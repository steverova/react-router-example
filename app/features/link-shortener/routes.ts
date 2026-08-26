import { route, type RouteConfigEntry } from '@react-router/dev/routes'

export const linkShortenerPublicRoutes: RouteConfigEntry[] = [
	route(':slug', './features/link-shortener/ui/redirect.tsx'),
]

export const linkShortenerAuthenticatedRoutes: RouteConfigEntry[] = [
	route('links/actions/create', './features/link-shortener/actions/create-link.action.ts'),
	route('links/actions/edit', './features/link-shortener/actions/edit-link.action.ts'),
	route('links/actions/delete', './features/link-shortener/actions/delete-link.action.ts'),
	route('api/links/stats/:id', './features/link-shortener/api/link-stats.ts'),
	route('links', './features/link-shortener/ui/link-page.tsx'),
	route('links/new-record', './features/link-shortener/ui/link-form.tsx', {
		id: 'links-new',
	}),
	route(
		'links/:id/edit-record',
		'./features/link-shortener/ui/link-form.tsx',
		{ id: 'links-edit' }
	),
	route('links/:id', './features/link-shortener/ui/link-detail-page.tsx'),
]
