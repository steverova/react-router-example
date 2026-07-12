import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth-store"

interface UserResponse {
  data: {
    id: string
    email: string
    role: string
    status: string
    createdAt: number
  }
}

export function useUser() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const user = useAuthStore((s) => s.user)

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get<UserResponse>("/auth/me")
      setAuth(data.data, useAuthStore.getState().accessToken ?? "")
      return data.data
    },
    enabled: !!user,
    retry: false,
    staleTime: Infinity,
  })
}
