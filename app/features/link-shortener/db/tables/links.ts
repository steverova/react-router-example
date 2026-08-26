import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core'

export const LINKS_TABLE = 'links' as const

export const links = sqliteTable(
	LINKS_TABLE,
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		slug: text('slug').unique().notNull(),
		originalUrl: text('original_url').notNull(),
		userId: integer('user_id').notNull(),
		title: text('title'),
		description: text('description'),
		ogImage: text('og_image'),
		passwordHash: text('password_hash'),
		expiresAt: integer('expires_at', { mode: 'timestamp' }),
		maxClicks: integer('max_clicks'),
		isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
		totalClicks: integer('total_clicks').notNull().default(0),
		lastClickedAt: integer('last_clicked_at', { mode: 'timestamp' }),
		createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date()),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.default(new Date())
			.$onUpdate(() => new Date()),
	},
	(table) => ({
		userIdx: index('idx_links_user_id').on(table.userId),
		createdIdx: index('idx_links_created_at').on(table.createdAt),
	})
)

export type LinkRow = typeof links.$inferSelect
export type LinkInsert = typeof links.$inferInsert
