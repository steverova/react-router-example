import { Link2Icon, type LucideIcon } from 'lucide-react'
import type { NavigationItem } from '~/components/blocks/layout/navigation-menu-items'

export const LinkShortenerNav: NavigationItem[] = [
	{
		path: '/links',
		label: 'Link Shortener',
		type: 'item',
		icon: Link2Icon as unknown as LucideIcon,
		authorization: {
			roles: ['admin', 'user'],
		},
	},
]
