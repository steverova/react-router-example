import {
	integer,
	sqliteTable,
	text
} from 'drizzle-orm/sqlite-core'

export const loginAttempts = sqliteTable('login_attempts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').notNull(),
	ipAddress: text('ip_address').notNull(),
	success: integer('success', { mode: 'boolean' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date())
})
