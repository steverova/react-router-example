import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core'
import { links } from './links'

export const LINK_CLICKS_TABLE = 'link_clicks' as const

export const linkClicks = sqliteTable(
	LINK_CLICKS_TABLE,
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		linkId: integer('link_id')
			.notNull()
			.references(() => links.id, { onDelete: 'cascade' }),
		clickedAt: integer('clicked_at', { mode: 'timestamp' })
			.notNull()
			.default(new Date()),
		referrer: text('referrer'),
		userAgent: text('user_agent'),
		country: text('country'),
		city: text('city'),
		deviceType: text('device_type', {
			enum: ['mobile', 'tablet', 'desktop', 'bot', 'unknown'],
		}).default('unknown'),
		deviceOs: text('device_os'),
		browser: text('browser'),
		ipHash: text('ip_hash'),
	},
	(table) => ({
		linkTimeIdx: index('idx_link_clicks_link_time').on(
			table.linkId,
			table.clickedAt
		),
		countryIdx: index('idx_link_clicks_country').on(table.country),
	})
)

export type LinkClickRow = typeof linkClicks.$inferSelect
export type LinkClickInsert = typeof linkClicks.$inferInsert
