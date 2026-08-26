export interface GeoInfo {
	country: string | null
	city: string | null
	continent: string | null
}

export function extractGeoFromHeaders(request: Request): GeoInfo {
	const headers = request.headers
	return {
		country: headers.get('CF-IPCountry') || null,
		city: decodeURIComponent(headers.get('CF-IPCity') || '') || null,
		continent: headers.get('CF-IPContinent') || null,
	}
}

export function extractIpFromHeaders(request: Request): string | null {
	return (
		request.headers.get('CF-Connecting-IP') ||
		request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
		null
	)
}

export function extractReferrerFromHeaders(request: Request): string | null {
	const referrer = request.headers.get('Referer')
	if (!referrer) return null
	try {
		const url = new URL(referrer)
		return `${url.protocol}//${url.host}${url.pathname}`
	} catch {
		return referrer
	}
}

const COUNTRY_NAMES: Record<string, string> = {
	US: 'United States',
	CA: 'Canada',
	MX: 'Mexico',
	BR: 'Brazil',
	AR: 'Argentina',
	CL: 'Chile',
	CO: 'Colombia',
	PE: 'Peru',
	ES: 'Spain',
	GB: 'United Kingdom',
	FR: 'France',
	DE: 'Germany',
	IT: 'Italy',
	PT: 'Portugal',
	NL: 'Netherlands',
	BE: 'Belgium',
	CH: 'Switzerland',
	AT: 'Austria',
	SE: 'Sweden',
	NO: 'Norway',
	DK: 'Denmark',
	FI: 'Finland',
	PL: 'Poland',
	IE: 'Ireland',
	JP: 'Japan',
	CN: 'China',
	KR: 'South Korea',
	IN: 'India',
	ID: 'Indonesia',
	AU: 'Australia',
	NZ: 'New Zealand',
	RU: 'Russia',
	UA: 'Ukraine',
	TR: 'Turkey',
	IL: 'Israel',
	AE: 'United Arab Emirates',
	SA: 'Saudi Arabia',
	EG: 'Egypt',
	ZA: 'South Africa',
	XX: 'Unknown',
}

export function countryName(code: string | null): string {
	if (!code) return 'Unknown'
	return COUNTRY_NAMES[code.toUpperCase()] ?? code
}

export function isValidCountryCode(code: string | null): boolean {
	if (!code || code === 'XX') return false
	return code.length === 2 && /^[A-Z]{2}$/i.test(code)
}
