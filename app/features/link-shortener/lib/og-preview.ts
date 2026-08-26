const FETCH_TIMEOUT_MS = 3000
const MAX_HTML_BYTES = 256_000

export async function fetchOgImage(targetUrl: string): Promise<string | null> {
	if (!targetUrl) return null

	let parsed: URL
	try {
		parsed = new URL(targetUrl)
	} catch {
		return null
	}

	if (!/^https?:$/.test(parsed.protocol)) return null

	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

	try {
		const response = await fetch(targetUrl, {
			method: 'GET',
			redirect: 'follow',
			signal: controller.signal,
			headers: {
				'User-Agent':
					'Mozilla/5.0 (compatible; LinkPreviewBot/1.0; +https://example.com)',
				Accept: 'text/html,application/xhtml+xml',
			},
		})

		if (!response.ok) return null

		const contentType = response.headers.get('content-type') ?? ''
		if (!contentType.includes('text/html')) return null

		const reader = response.body?.getReader()
		if (!reader) return null

		let received = 0
		const chunks: Uint8Array[] = []

		while (true) {
			const { done, value } = await reader.read()
			if (done) break
			if (value) {
				received += value.byteLength
				if (received > MAX_HTML_BYTES) break
				chunks.push(value)
			}
		}

		const decoder = new TextDecoder('utf-8')
		const html = decoder.decode(concatChunks(chunks))

		const ogImage = extractMetaContent(html, [
			['property', 'og:image'],
			['property', 'og:image:url'],
			['property', 'og:image:secure_url'],
			['name', 'twitter:image'],
			['name', 'twitter:image:src'],
		])

		if (!ogImage) return null
		return resolveUrl(ogImage, parsed)
	} catch {
		return null
	} finally {
		clearTimeout(timeoutId)
	}
}

function concatChunks(chunks: Uint8Array[]): Uint8Array {
	const total = chunks.reduce((sum, c) => sum + c.byteLength, 0)
	const result = new Uint8Array(total)
	let offset = 0
	for (const chunk of chunks) {
		result.set(chunk, offset)
		offset += chunk.byteLength
	}
	return result
}

function extractMetaContent(
	html: string,
	attributes: Array<[string, string]>
): string | null {
	for (const [attr, value] of attributes) {
		const regex = new RegExp(
			`<meta[^>]*\\s${attr}=["']${escapeRegex(value)}["'][^>]*\\scontent=["']([^"']+)["']`,
			'i'
		)
		const match = html.match(regex)
		if (match) return match[1]

		const reverseRegex = new RegExp(
			`<meta[^>]*\\scontent=["']([^"']+)["'][^>]*\\s${attr}=["']${escapeRegex(value)}["']`,
			'i'
		)
		const reverseMatch = html.match(reverseRegex)
		if (reverseMatch) return reverseMatch[1]
	}
	return null
}

function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function resolveUrl(value: string, base: URL): string {
	try {
		return new URL(value, base).toString()
	} catch {
		return value
	}
}
