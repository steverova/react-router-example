import { getUserByEmail } from "./login.repository"

export function authenticateUser(email: string, password: string) {
  const user = getUserByEmail(email)
  
  if (!user) {
    return { success: false, error: "User not found" }
  }

  // Demo: any password works
  return { success: true, user }
}
