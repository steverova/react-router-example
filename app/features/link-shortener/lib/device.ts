import { UAParser } from 'ua-parser-js'

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'bot' | 'unknown'

const BOT_PATTERNS = [
	'bot',
	'crawler',
	'spider',
	'slurp',
	'facebookexternalhit',
	'whatsapp',
	'telegram',
	'discordbot',
	'twitterbot',
	'linkedinbot',
	'googlebot',
	'bingbot',
	'yandex',
	'baiduspider',
	'dotbot',
	'petalbot',
	'semrushbot',
	'ahrefsbot',
]

export interface ParsedDevice {
	type: DeviceType
	os: string | null
	browser: string | null
}

export function parseUserAgent(userAgent: string | null | undefined): ParsedDevice {
	if (!userAgent) {
		return { type: 'unknown', os: null, browser: null }
	}

	const ua = userAgent.toLowerCase()
	if (BOT_PATTERNS.some((pattern) => ua.includes(pattern))) {
		return { type: 'bot', os: null, browser: 'bot' }
	}

	const parser = new UAParser(userAgent)
	const result = parser.getResult()

	const device = result.device.type
	const type: DeviceType =
		device === 'mobile'
			? 'mobile'
			: device === 'tablet'
				? 'tablet'
				: device === 'wearable' || device === 'console' || device === 'embedded'
					? 'desktop'
					: 'desktop'

	return {
		type,
		os: result.os.name ?? null,
		browser: result.browser.name ?? null,
	}
}

export async function sha256Hex(input: string): Promise<string> {
	const data = new TextEncoder().encode(input)
	const buffer = await crypto.subtle.digest('SHA-256', data)
	return Array.from(new Uint8Array(buffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('')
}
