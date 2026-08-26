import { z } from 'zod'

const SLUG_REGEX = /^[a-zA-Z0-9_-]{3,32}$/

const optionalString = (maxLength: number, msg: string) =>
	z
		.string()
		.max(maxLength, msg)
		.optional()
		.or(z.literal(''))

export const createLinkSchema = z.object({
	originalUrl: z
		.string()
		.min(1, 'Destination URL is required')
		.url('Must be a valid URL')
		.max(2048, 'URL too long'),
	customSlug: z.preprocess(
		(val) => (val === '' || val === null || val === undefined ? '' : val),
		z
			.string()
			.regex(SLUG_REGEX, 'Slug must be 3-32 chars: letters, numbers, _ or -')
			.optional()
			.or(z.literal(''))
	),
	title: z
		.string()
		.min(1, 'Title is required')
		.max(100, 'Title too long'),
	description: optionalString(500, 'Description too long'),
	expiresAt: z.preprocess(
		(val) => (val === '' || val === null || val === undefined ? '' : val),
		z.string().optional().or(z.literal(''))
	),
	maxClicks: z.preprocess(
		(val) => {
			if (val === '' || val === null || val === undefined) return null
			if (typeof val === 'boolean') return Number.NaN
			if (typeof val === 'string') {
				const trimmed = val.trim().toLowerCase()
				if (
					trimmed === '' ||
					trimmed === 'null' ||
					trimmed === 'undefined' ||
					trimmed === 'nan'
				) {
					return null
				}
				const num = Number(trimmed)
				return Number.isFinite(num) ? num : Number.NaN
			}
			if (typeof val === 'number') {
				return Number.isFinite(val) ? val : Number.NaN
			}
			return Number.NaN
		},
		z
			.number({ invalid_type_error: 'Max clicks must be a number' })
			.int('Must be a whole number')
			.positive('Must be greater than zero')
			.max(1_000_000_000, 'Value too large')
			.nullable()
			.optional()
	),
	password: z
		.string()
		.max(72, 'Password too long')
		.optional()
		.or(z.literal('')),
})

export type CreateLinkInput = z.infer<typeof createLinkSchema>

export const editLinkSchema = createLinkSchema.partial().extend({
	id: z.coerce.number().int().positive(),
	isActive: z.preprocess(
		(val) =>
			val === '' || val === null || val === undefined ? undefined : val,
		z.coerce.boolean().optional()
	),
})

/** Form-state type: all create fields + isActive (only used in edit). */
export type LinkFormValues = CreateLinkInput & {
	isActive?: boolean
}

export type EditLinkInput = z.infer<typeof editLinkSchema>

export const deleteLinkSchema = z.object({
	id: z.coerce.number().int().positive(),
})

export const passwordGateSchema = z.object({
	password: z.string().min(1, 'Password is required').max(72),
})

export const analyticsRangeSchema = z.object({
	range: z.enum(['7d', '30d', '90d']).default('30d'),
})

export type AnalyticsRange = z.infer<typeof analyticsRangeSchema>
