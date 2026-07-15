import { verifyPassword } from "~/lib/crypto"
import { getUserByEmail, getCredentialByUserId } from "./login.repository"

export async function authenticateUser(email: string, password: string) {
  const user = await getUserByEmail(email)

  if (!user) {
    return { success: false, error: "User not found" }
  }

  const credential = await getCredentialByUserId(user.id)

  if (!credential || !credential.passwordHash) {
    return { success: false, error: "No credentials found" }
  }

  if (!verifyPassword(password, credential.passwordHash)) {
    return { success: false, error: "Invalid password" }
  }

  return { success: true, user }
}
