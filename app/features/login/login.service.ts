import type { AppDb } from "~/db"
import { verifyPassword } from "~/lib/crypto"
import { getUserByEmail, getCredentialByUserId } from "./login.repository"

export async function authenticateUser(db: AppDb, email: string, password: string) {
  const user = await getUserByEmail(db, email)

  if (!user) {
    return { success: false, error: "User not found" }
  }

  const credential = await getCredentialByUserId(db, user.id)

  if (!credential || !credential.passwordHash) {
    return { success: false, error: "No credentials found" }
  }

  if (!await verifyPassword(password, credential.passwordHash)) {
    return { success: false, error: "Invalid password" }
  }

  return { success: true, user }
}
