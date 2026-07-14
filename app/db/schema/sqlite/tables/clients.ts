import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const clients = sqliteTable('clients', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	entityType: text('entity_type', { enum: ['legal_entity', 'person'] })
		.notNull()
		.default('legal_entity'),
	legalName: text('legal_name').notNull(),
	tradeName: text('trade_name'),
	taxId: text('tax_id'),
	country: text('country'),
	address: text('address'),
	postalCode: text('postal_code'),
	email: text('email').notNull(),
	phone: text('phone'),
	notes: text('notes'),
	status: text('status', { enum: ['active', 'inactive'] }).default('active'),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.default(new Date())
		.$onUpdate(() => new Date())
})
