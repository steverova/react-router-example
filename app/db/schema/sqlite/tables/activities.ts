import { integer, sqliteTable, text, real } from 'drizzle-orm/sqlite-core'

export const activities = sqliteTable('activities', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	projectId: integer('project_id').notNull(),
	parentActivityId: integer('parent_activity_id'),
	title: text('title').notNull(),
	description: text('description'),
	priority: text('priority', { enum: ['low', 'medium', 'high', 'critical'] })
		.notNull()
		.default('medium'),
	status: text('status', { enum: ['pending', 'in_progress', 'blocked', 'completed', 'cancelled'] })
		.notNull()
		.default('pending'),
	estimatedHours: real('estimated_hours'),
	startDate: text('start_date'),
	dueDate: text('due_date'),
	createdBy: integer('created_by'),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.default(new Date())
		.$onUpdate(() => new Date())
})
