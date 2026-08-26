import { eq } from 'drizzle-orm'
import { customAlphabet } from 'nanoid'
import type { AppDb } from '~/db'
import { links } from '../db'

const SLUG_ALPHABET = '23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'

const SLUG_REGEX = /^[a-zA-Z0-9_-]{3,32}$/

export function isValidSlugFormat(slug: string): boolean {
	return SLUG_REGEX.test(slug)
}

export function generateSlug(length = 7): string {
	const nano = customAlphabet(SLUG_ALPHABET, length)
	return nano()
}

export async function isSlugAvailable(db: AppDb, slug: string): Promise<boolean> {
	const result = await db
		.select({ id: links.id })
		.from(links)
		.where(eq(links.slug, slug))
		.limit(1)
	return result.length === 0
}

export async function generateUniqueSlug(
	db: AppDb,
	length = 7,
	maxRetries = 8
): Promise<string> {
	for (let i = 0; i < maxRetries; i++) {
		const candidate = generateSlug(length)
		if (await isSlugAvailable(db, candidate)) {
			return candidate
		}
	}
	throw new Error('Could not generate a unique slug after several retries')
}
