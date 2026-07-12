import { randomBytes } from 'node:crypto'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	publicId: text('public_id')
		.unique()
		.notNull()
		.$defaultFn(() => randomBytes(16).toString('base64url').slice(0, 21)),
	name: text('name').notNull(),
	email: text('email').unique().notNull(),
	emailVerifiedAt: integer('email_verified_at', { mode: 'timestamp' }),
	role: text('role').notNull().default('user'),
	status: text('status', { enum: ['active', 'suspended', 'deleted'] }).default(
		'active'
	),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.default(new Date())
		.$onUpdate(() => new Date())
})
