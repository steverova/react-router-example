import { createHash, randomBytes, scryptSync } from 'node:crypto'

export function hashPassword(password: string): string {
	const salt = randomBytes(16).toString('hex')
	const hash = scryptSync(password, salt, 64).toString('hex')
	return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
	const [salt, hash] = stored.split(':')
	const verify = scryptSync(password, salt ?? '', 64).toString('hex')
	return verify === hash
}

export function hashToken(token: string): string {
	return createHash('sha256').update(token).digest('hex')
}
