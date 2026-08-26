export {
	listLinksForUser,
	listAllLinks,
	findLinkForUser,
	registerLink,
	updateLink,
	removeLink,
	resolveLinkForRedirect,
	validateLinkPassword,
	recordClick,
	getAnalytics,
	computeLinkStatus,
	LinkServiceError,
	type LinkWithStatus,
	type LinkStatus,
	type CreateLinkPayload,
	type UpdateLinkPayload,
	type ResolveResult,
	type AnalyticsData,
} from './link.service'

export { links, linkClicks } from './db'
export { isValidSlugFormat, generateSlug, generateUniqueSlug } from './lib/slug'
export { fetchOgImage } from './lib/og-preview'
export {
	extractGeoFromHeaders,
	countryName,
	isValidCountryCode,
} from './lib/geo'
