type NavigationItemType = 'item' | 'group' | 'collapse' | 'url'

import {
	Archive,
	Calendar,
	CalendarDays,
	Handshake,
	LayoutDashboard,
	Puzzle,
	Table,
	User,
} from 'lucide-react'


export type NavigationItem = {
	isActive?: boolean
	icon?: React.ElementType
	label: string
	path?: string
	roles?: string[]
	type?: NavigationItemType
	authorization?: {
		roles: string[]
		
	}
	children?: NavigationItem[]
}

const navigation: NavigationItem[] = [
	{
		path: '/dashboard',
		label: 'Dashboard',
		type: 'item',
		icon: LayoutDashboard,
		authorization: {
			roles: ['admin', 'user'],
		},
	},
	{
		path: '/calendar',
		label: 'Calendar',
		type: 'collapse',
		icon: CalendarDays,
	},
	{
		type: 'collapse',
		label: 'Management',
		icon: Archive,
		children: [
			{
				path: '/manage/clients',
				type: 'item',
				label: 'Clients',
				icon: Handshake,
			},
			{
				path: '/manage/users',
				type: 'item',
				label: 'Users',
				icon: User ,
			},
		],
	},
	{
		path: '/time-tracking',
		label: 'Time Tracking',
		type: 'item',
		icon: Calendar,
	},
	{
   path: '/ticket-board',
	 label: 'Ticket Board',
	 type: 'item',
	 icon: Table,
	},
	{
		label: 'Components',
		type: 'collapse',
		icon: Puzzle,
		children: [
			{
				path: 'components/date-picker',
				label: 'Calendar',
				type: 'item',
				icon: Calendar,
			},
			{
				path: 'components/table',
				label: 'Table',
				type: 'item',
				icon: Table,
			},
			{
				path: 'components/alert-dialog',
				label: 'Alert Dialog',
				type: 'item',
				icon: Archive,
				roles: ['admin'],
			},
		],
	},
]

export default navigation
