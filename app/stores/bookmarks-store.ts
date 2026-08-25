import { create } from "zustand"
import { persist } from "zustand/middleware"

export type BookmarkItem = {
  id: string
  type: "bookmark"
  title: string
  url: string
}

export type FolderItem = {
  id: string
  type: "folder"
  title: string
  children: ToolbarItem[]
}

export type SeparatorItem = {
  id: string
  type: "separator"
}

export type ToolbarItem = BookmarkItem | FolderItem | SeparatorItem

interface BookmarksState {
  items: ToolbarItem[]
  addBookmark: (title: string, url: string, parentId?: string | null) => void
  addFolder: (title: string, parentId?: string | null) => void
  addSeparator: (parentId?: string | null) => void
  removeItem: (id: string) => void
  editItem: (id: string, data: { title?: string; url?: string }) => void
  moveItem: (itemId: string, targetFolderId: string | null, index: number) => void
  reorderItems: (items: ToolbarItem[]) => void
}

function generateId() {
  return crypto.randomUUID()
}

function addItemToFolder(
  items: ToolbarItem[],
  parentId: string,
  newItem: ToolbarItem
): ToolbarItem[] {
  return items.map((item) => {
    if (item.type === "folder" && item.id === parentId) {
      return { ...item, children: [...item.children, newItem] }
    }
    if (item.type === "folder") {
      return { ...item, children: addItemToFolder(item.children, parentId, newItem) }
    }
    return item
  })
}

function removeItemRecursive(items: ToolbarItem[], id: string): ToolbarItem[] {
  return items
    .filter((item) => item.id !== id)
    .map((item) => {
      if (item.type === "folder") {
        return { ...item, children: removeItemRecursive(item.children, id) }
      }
      return item
    })
}

function findItem(items: ToolbarItem[], id: string): ToolbarItem | null {
  for (const item of items) {
    if (item.id === id) return item
    if (item.type === "folder") {
      const found = findItem(item.children, id)
      if (found) return found
    }
  }
  return null
}

function insertItemAt(items: ToolbarItem[], item: ToolbarItem, index: number): ToolbarItem[] {
  const result = [...items]
  result.splice(index, 0, item)
  return result
}

function insertIntoFolder(
  items: ToolbarItem[],
  folderId: string,
  newItem: ToolbarItem,
  index: number
): ToolbarItem[] {
  return items.map((item) => {
    if (item.type === "folder" && item.id === folderId) {
      return { ...item, children: insertItemAt(item.children, newItem, index) }
    }
    if (item.type === "folder") {
      return { ...item, children: insertIntoFolder(item.children, folderId, newItem, index) }
    }
    return item
  })
}

function editItemRecursive(
  items: ToolbarItem[],
  id: string,
  data: { title?: string; url?: string }
): ToolbarItem[] {
  return items.map((item) => {
    if (item.id === id) {
      if (item.type === "bookmark") {
        return { ...item, title: data.title ?? item.title, url: data.url ?? item.url }
      }
      if (item.type === "folder") {
        return { ...item, title: data.title ?? item.title }
      }
    }
    if (item.type === "folder") {
      return { ...item, children: editItemRecursive(item.children, id, data) }
    }
    return item
  })
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set) => ({
      items: [],
      addBookmark: (title, url, parentId) =>
        set((state) => {
          const newItem: BookmarkItem = { id: generateId(), type: "bookmark", title, url }
          if (parentId) {
            return { items: addItemToFolder(state.items, parentId, newItem) }
          }
          return { items: [...state.items, newItem] }
        }),
      addFolder: (title, parentId) =>
        set((state) => {
          const newItem: FolderItem = { id: generateId(), type: "folder", title, children: [] }
          if (parentId) {
            return { items: addItemToFolder(state.items, parentId, newItem) }
          }
          return { items: [...state.items, newItem] }
        }),
      addSeparator: (parentId) =>
        set((state) => {
          const newItem: SeparatorItem = { id: generateId(), type: "separator" }
          if (parentId) {
            return { items: addItemToFolder(state.items, parentId, newItem) }
          }
          return { items: [...state.items, newItem] }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: removeItemRecursive(state.items, id),
        })),
      editItem: (id, data) =>
        set((state) => ({
          items: editItemRecursive(state.items, id, data),
        })),
      moveItem: (itemId, targetFolderId, index) =>
        set((state) => {
          const item = findItem(state.items, itemId)
          if (!item) return state
          // Remove item from current position
          let newItems = removeItemRecursive(state.items, itemId)
          // Insert into target
          if (targetFolderId) {
            newItems = insertIntoFolder(newItems, targetFolderId, item, index)
          } else {
            newItems = insertItemAt(newItems, item, index)
          }
          return { items: newItems }
        }),
      reorderItems: (items) => set({ items }),
    }),
    {
      name: "bookmarks-storage",
    }
  )
)
