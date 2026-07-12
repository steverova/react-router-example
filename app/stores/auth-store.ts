import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: number
  publicId: string
  name: string
  email: string
  role: string
  status: string | null
}

interface AuthState {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
)
