import { integer, sqliteTable, text, real } from 'drizzle-orm/sqlite-core'

export const projects = sqliteTable('projects', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	projectCode: text('project_code').unique().notNull(),
	clientEntityId: integer('client_entity_id').notNull(),
	name: text('name').notNull(),
	description: text('description'),
	projectManagerId: integer('project_manager_id'),
	ownerId: integer('owner_id'),
	status: text('status', { enum: ['draft', 'active', 'on_hold', 'completed', 'cancelled', 'archived'] })
		.notNull()
		.default('draft'),
	startDate: text('start_date'),
	targetEndDate: text('target_end_date'),
	hoursBudget: real('hours_budget'),
	documentationUrl: text('documentation_url'),
	repositoryUrl: text('repository_url'),
	contractReference: text('contract_reference'),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.default(new Date())
		.$onUpdate(() => new Date())
})
