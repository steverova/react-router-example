import { randomBytes } from 'node:crypto'
import dotenv from 'dotenv'

dotenv.config()

import { createClient } from '@libsql/client'
import { hashPassword } from '~/lib/crypto'

const SEED_USER = {
	name: 'Admin',
	email: 'admin@admin.com',
	role: 'admin',
	status: 'active',
	emailVerifiedAt: Date.now(),
	createdAt: Date.now(),
	updatedAt: Date.now()
}

const SEED_PASSWORD = 'password123'

async function seed() {
	console.log(' Seeding database...')

	const client = createClient({
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN,
	})

	const existing = await client.execute({
		sql: 'SELECT id FROM users WHERE email = ?',
		args: [SEED_USER.email]
	})

	if (existing.rows.length > 0) {
		console.log(` ⏭  User ${SEED_USER.email} already exists, skipping.`)
		return
	}

	const publicId = randomBytes(16).toString('base64url').slice(0, 21)

	await client.execute({
		sql: `INSERT INTO users (public_id, name, email, role, status, email_verified_at, created_at, updated_at)
		      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			publicId,
			SEED_USER.name,
			SEED_USER.email,
			SEED_USER.role,
			SEED_USER.status,
			SEED_USER.emailVerifiedAt,
			SEED_USER.createdAt,
			SEED_USER.updatedAt
		]
	})

	const user = await client.execute({
		sql: 'SELECT id FROM users WHERE email = ?',
		args: [SEED_USER.email]
	})
	const userId = user.rows[0].id

	await client.execute({
		sql: `INSERT INTO credentials (user_id, provider, password_hash, created_at)
		      VALUES (?, ?, ?, ?)`,
		args: [userId, 'password', hashPassword(SEED_PASSWORD), Date.now()]
	})

	console.log(
		` ✅ Seed user created: ${SEED_USER.email} (id: ${userId}, publicId: ${publicId})`
	)
	console.log(` 🔑 Password: ${SEED_PASSWORD}`)
}

try {
	await seed()
	process.exit(0)
} catch (err) {
	console.error(' ❌ Seed failed:', err)
	process.exit(1)
}
