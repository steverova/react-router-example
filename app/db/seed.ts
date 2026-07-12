import { randomBytes, scryptSync } from 'node:crypto'
import Database from 'better-sqlite3'

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

function hashPassword(password: string): string {
	const salt = randomBytes(16).toString('hex')
	const hash = scryptSync(password, salt, 64).toString('hex')
	return `${salt}:${hash}`
}

function seed() {
	console.log(' Seeding database...')

	const db = new Database(process.env.SQLITE_PATH ?? './local.db')

	const existing = db
		.prepare('SELECT id FROM users WHERE email = ?')
		.get(SEED_USER.email)

	if (existing) {
		console.log(` ⏭  User ${SEED_USER.email} already exists, skipping.`)
		db.close()
		return
	}

	const insertUser = db.prepare(
		`INSERT INTO users (public_id, name, email, role, status, email_verified_at, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
	)

	const insertCredential = db.prepare(
		`INSERT INTO credentials (user_id, provider, password_hash, created_at)
		 VALUES (?, ?, ?, ?)`
	)

	const txn = db.transaction(() => {
		const publicId = randomBytes(16).toString('base64url').slice(0, 21)

		const result = insertUser.run(
			publicId,
			SEED_USER.name,
			SEED_USER.email,
			SEED_USER.role,
			SEED_USER.status,
			SEED_USER.emailVerifiedAt,
			SEED_USER.createdAt,
			SEED_USER.updatedAt
		)

		const userId = result.lastInsertRowid

		insertCredential.run(
			userId,
			'password',
			hashPassword(SEED_PASSWORD),
			Date.now()
		)

		return { publicId, userId }
	})

	const { publicId, userId } = txn()

	console.log(
		` ✅ Seed user created: ${SEED_USER.email} (id: ${userId}, publicId: ${publicId})`
	)
	console.log(` 🔑 Password: ${SEED_PASSWORD}`)
	db.close()
}

try {
	seed()
	process.exit(0)
} catch (err) {
	console.error(' ❌ Seed failed:', err)
	process.exit(1)
}
