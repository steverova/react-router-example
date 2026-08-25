import { useState } from "react"
import {
  DndContext,
  pointerWithin,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  type CollisionDetection,
} from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/components/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { BookmarkIcon, FolderIcon, MinusIcon, XIcon, GripVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { useBookmarksStore, type ToolbarItem, type FolderItem } from "~/stores/bookmarks-store"

type AddMode = "bookmark" | "folder" | null
type EditState = { id: string; type: "bookmark"; title: string; url: string } | { id: string; type: "folder"; title: string } | null

function findItemRecursive(items: ToolbarItem[], id: string): ToolbarItem | null {
  for (const item of items) {
    if (item.id === id) return item
    if (item.type === "folder") {
      const found = findItemRecursive(item.children, id)
      if (found) return found
    }
  }
  return null
}

export default function BookmarksToolbar() {
  const { items, addBookmark, addFolder, addSeparator, removeItem, editItem, moveItem, reorderItems } = useBookmarksStore()
  const [mode, setMode] = useState<AddMode>(null)
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [editing, setEditing] = useState<EditState>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const collisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args)
    // Prefer folder drop zones
    const folderCollision = pointerCollisions.find((c) =>
      String(c.id).startsWith("folder-drop-")
    )
    if (folderCollision) return [folderCollision]

    // Then prefer the root drop zone
    const rootCollision = pointerCollisions.find((c) => c.id === "toolbar-root")
    if (rootCollision) {
      // But also check sortable items for reordering within root
      const sortableCollisions = closestCenter(args)
      if (sortableCollisions.length > 0) return sortableCollisions
      return [rootCollision]
    }

    return closestCenter(args)
  }

  function handleSubmit() {
    if (mode === "bookmark" && name.trim() && url.trim()) {
      addBookmark(name.trim(), url.trim(), targetFolderId)
    } else if (mode === "folder" && name.trim()) {
      addFolder(name.trim(), targetFolderId)
    }
    closeDialog()
  }

  function closeDialog() {
    setMode(null)
    setTargetFolderId(null)
    setName("")
    setUrl("")
  }

  function openAddBookmark(folderId?: string | null) {
    setTargetFolderId(folderId ?? null)
    setMode("bookmark")
  }

  function openAddFolder(folderId?: string | null) {
    setTargetFolderId(folderId ?? null)
    setMode("folder")
  }

  function handleAddSeparator(folderId?: string | null) {
    addSeparator(folderId ?? undefined)
  }

  function openEdit(item: ToolbarItem) {
    if (item.type === "bookmark") {
      setEditing({ id: item.id, type: "bookmark", title: item.title, url: item.url })
    } else if (item.type === "folder") {
      setEditing({ id: item.id, type: "folder", title: item.title })
    }
  }

  function handleEditSubmit() {
    if (!editing) return
    if (editing.type === "bookmark") {
      editItem(editing.id, { title: editing.title, url: editing.url })
    } else {
      editItem(editing.id, { title: editing.title })
    }
    setEditing(null)
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const overId = over.id as string
    const activeIdStr = active.id as string

    // Dropping into a folder
    if (overId.startsWith("folder-drop-")) {
      const folderId = overId.replace("folder-drop-", "")
      // Don't drop a folder into itself
      if (folderId === activeIdStr) return
      const folder = findItemRecursive(items, folderId) as FolderItem | null
      if (folder && folder.type === "folder") {
        moveItem(activeIdStr, folderId, folder.children.length)
      }
      return
    }

    // Dropping on the root toolbar (move out of folder to root)
    if (overId === "toolbar-root") {
      moveItem(activeIdStr, null, items.length)
      return
    }

    // Check if over item is a folder (sortable item at root)
    const overItem = findItemRecursive(items, overId)
    if (overItem && overItem.type === "folder" && activeIdStr !== overId) {
      moveItem(activeIdStr, overId, overItem.children.length)
      return
    }

    // Reorder at root level
    const activeIndex = items.findIndex((item) => item.id === activeIdStr)
    const overIndex = items.findIndex((item) => item.id === overId)
    if (activeIndex !== -1 && overIndex !== -1) {
      reorderItems(arrayMove(items, activeIndex, overIndex))
    } else if (overIndex !== -1) {
      // Item coming from inside a folder, move to root at that position
      moveItem(activeIdStr, null, overIndex)
    }
  }

  const activeItem = activeId ? findItemRecursive(items, activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full shrink-0 bg-neutral-100 dark:bg-neutral-900 border-b">
        <ContextMenu>
          <ToolbarDropZone>
            <ContextMenuTrigger className="flex w-full items-center gap-1 px-3 py-1 min-h-8">
              {items.length === 0 && (
                <span className="text-xs text-muted-foreground">
                  <span className="hidden pointer-fine:inline-block">
                    Right click to add bookmarks
                  </span>
                  <span className="hidden pointer-coarse:inline-block">
                    Long press to add bookmarks
                  </span>
                </span>
              )}
              <SortableContext items={items.map((i) => i.id)} strategy={horizontalListSortingStrategy}>
                {items.map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                    onAddBookmark={openAddBookmark}
                    onAddFolder={openAddFolder}
                    onAddSeparator={handleAddSeparator}
                    onEdit={openEdit}
                  />
                ))}
              </SortableContext>
            </ContextMenuTrigger>
          </ToolbarDropZone>
          <ContextMenuContent className="w-48">
            <ContextMenuItem closeOnClick={false} onClick={() => openAddBookmark(null)}>
              <BookmarkIcon />
              Add Bookmark
            </ContextMenuItem>
            <ContextMenuItem closeOnClick={false} onClick={() => openAddFolder(null)}>
              <FolderIcon />
              Add Folder
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleAddSeparator(null)}>
              <MinusIcon />
              Add Separator
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        <Dialog open={mode !== null} onOpenChange={(open) => { if (!open) closeDialog() }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {mode === "bookmark" ? "Add Bookmark" : "Add Folder"}
              </DialogTitle>
              <DialogDescription>
                {mode === "bookmark"
                  ? "Enter the name and URL for your bookmark."
                  : "Enter a name for your folder."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bookmark-name">Name</Label>
                <Input
                  id="bookmark-name"
                  placeholder={mode === "bookmark" ? "My Bookmark" : "My Folder"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  autoFocus
                />
              </div>
              {mode === "bookmark" && (
                <div className="grid gap-2">
                  <Label htmlFor="bookmark-url">URL</Label>
                  <Input
                    id="bookmark-url"
                    type="url"
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null) }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing?.type === "bookmark" ? "Edit Bookmark" : "Edit Folder"}
              </DialogTitle>
              <DialogDescription>
                {editing?.type === "bookmark"
                  ? "Update the name and URL."
                  : "Update the folder name."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editing?.title ?? ""}
                  onChange={(e) => setEditing((prev) => prev ? { ...prev, title: e.target.value } : prev)}
                  onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
                  autoFocus
                />
              </div>
              {editing?.type === "bookmark" && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-url">URL</Label>
                  <Input
                    id="edit-url"
                    type="url"
                    value={editing.url}
                    onChange={(e) => setEditing((prev) => prev && prev.type === "bookmark" ? { ...prev, url: e.target.value } : prev)}
                    onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DragOverlay>
        {activeItem ? <DragOverlayItem item={activeItem} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

function ToolbarDropZone({ children }: { children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id: "toolbar-root" })
  return <div ref={setNodeRef}>{children}</div>
}

interface ToolbarItemViewProps {
  item: ToolbarItem
  onRemove: (id: string) => void
  onAddBookmark: (folderId?: string | null) => void
  onAddFolder: (folderId?: string | null) => void
  onAddSeparator: (folderId?: string | null) => void
  onEdit: (item: ToolbarItem) => void
}

function SortableItem({ item, onRemove, onAddBookmark, onAddFolder, onAddSeparator, onEdit }: ToolbarItemViewProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  if (item.type === "separator") {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="h-4 w-px bg-border mx-1 group relative cursor-grab">
        <button
          onClick={() => onRemove(item.id)}
          className="absolute -top-1 -right-1 size-3 bg-destructive text-destructive-foreground rounded-full items-center justify-center text-[8px] hidden group-hover:flex"
        >
          <XIcon className="size-2" />
        </button>
      </div>
    )
  }

  if (item.type === "folder") {
    return (
      <div ref={setNodeRef} style={style} {...attributes}>
        <FolderView
          folder={item}
          onRemove={onRemove}
          onAddBookmark={onAddBookmark}
          onAddFolder={onAddFolder}
          onAddSeparator={onAddSeparator}
          onEdit={onEdit}
          dragListeners={listeners}
        />
      </div>
    )
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ContextMenu>
        <ContextMenuTrigger>
          <a
            href={item.url}
            className="group relative flex items-center gap-1 px-2 py-0.5 rounded text-xs hover:bg-accent cursor-grab"
            title={item.url}
            onClick={(e) => { if (isDragging) e.preventDefault() }}
          >
            <BookmarkIcon className="size-3.5 text-muted-foreground" />
            <span>{item.title}</span>
          </a>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem closeOnClick={false} onClick={() => onEdit(item)}>
            <PencilIcon />
            Edit
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" onClick={() => onRemove(item.id)}>
            <Trash2Icon />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

function DragOverlayItem({ item }: { item: ToolbarItem }) {
  if (item.type === "separator") {
    return <div className="h-4 w-px bg-border mx-1" />
  }
  if (item.type === "folder") {
    return (
      <div className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-accent shadow-sm">
        <FolderIcon className="size-3.5 text-muted-foreground" />
        <span>{item.title}</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-accent shadow-sm">
      <BookmarkIcon className="size-3.5 text-muted-foreground" />
      <span>{item.title}</span>
    </div>
  )
}

function FolderView({
  folder,
  onRemove,
  onAddBookmark,
  onAddFolder,
  onAddSeparator,
  onEdit,
  dragListeners,
}: {
  folder: FolderItem
  dragListeners: Record<string, unknown> | undefined
} & Omit<ToolbarItemViewProps, "item">) {
  const hasChildren = folder.children.length > 0
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `folder-drop-${folder.id}`,
  })

  if (hasChildren) {
    return (
      <ContextMenu>
        <ContextMenuTrigger
          ref={setDropRef}
          className={`group relative flex items-center gap-0.5 rounded text-xs hover:bg-accent cursor-default transition-colors ${isOver ? "ring-2 ring-primary bg-accent" : ""}`}
        >
          <span {...dragListeners} className="cursor-grab px-0.5 text-muted-foreground hover:text-foreground">
            <GripVerticalIcon className="size-3" />
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 px-1 py-0.5 outline-none">
              <FolderIcon className="size-3.5 text-muted-foreground" />
              <span>{folder.title}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <FolderChildrenMenu items={folder.children} folderId={folder.id} onRemove={onRemove} />
            </DropdownMenuContent>
          </DropdownMenu>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem closeOnClick={false} onClick={() => onEdit(folder)}>
            <PencilIcon />
            Edit
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem closeOnClick={false} onClick={() => onAddBookmark(folder.id)}>
            <BookmarkIcon />
            Add Bookmark
          </ContextMenuItem>
          <ContextMenuItem closeOnClick={false} onClick={() => onAddFolder(folder.id)}>
            <FolderIcon />
            Add Folder
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onAddSeparator(folder.id)}>
            <MinusIcon />
            Add Separator
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" onClick={() => onRemove(folder.id)}>
            <Trash2Icon />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger
        ref={setDropRef}
        className={`group relative flex items-center gap-0.5 rounded text-xs hover:bg-accent cursor-default transition-colors ${isOver ? "ring-2 ring-primary bg-accent" : ""}`}
      >
        <span {...dragListeners} className="cursor-grab px-0.5 text-muted-foreground hover:text-foreground">
          <GripVerticalIcon className="size-3" />
        </span>
        <div className="flex items-center gap-1 px-1 py-0.5">
          <FolderIcon className="size-3.5 text-muted-foreground" />
          <span>{folder.title}</span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem closeOnClick={false} onClick={() => onEdit(folder)}>
          <PencilIcon />
          Edit
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem closeOnClick={false} onClick={() => onAddBookmark(folder.id)}>
          <BookmarkIcon />
          Add Bookmark
        </ContextMenuItem>
        <ContextMenuItem closeOnClick={false} onClick={() => onAddFolder(folder.id)}>
          <FolderIcon />
          Add Folder
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAddSeparator(folder.id)}>
          <MinusIcon />
          Add Separator
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onClick={() => onRemove(folder.id)}>
          <Trash2Icon />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

function FolderChildrenMenu({ items, folderId, onRemove }: { items: ToolbarItem[]; folderId: string; onRemove: (id: string) => void }) {
  return (
    <>
      {items.map((item) => {
        if (item.type === "separator") {
          return <DropdownMenuSeparator key={item.id} />
        }
        if (item.type === "folder") {
          return (
            <DraggableFolderChild key={item.id} item={item}>
              <FolderIcon className="size-3.5" />
              {item.title}
              {item.children.length > 0 && (
                <span className="ml-auto text-muted-foreground text-[10px]">
                  {item.children.length}
                </span>
              )}
            </DraggableFolderChild>
          )
        }
        return (
          <DraggableFolderChild key={item.id} item={item}>
            <BookmarkIcon className="size-3.5" />
            {item.title}
          </DraggableFolderChild>
        )
      })}
    </>
  )
}

function DraggableFolderChild({ item, children }: { item: ToolbarItem; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative flex cursor-grab items-center gap-2.5 rounded-none px-3 py-2 text-xs font-medium tracking-wider uppercase outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      {children}
    </div>
  )
}
