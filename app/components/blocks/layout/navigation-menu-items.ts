type NavigationItemType = 'item' | 'group' | 'collapse' | 'url'

import {
	Archive,
	Calendar,
	CalendarDays,
	FolderKanban,
	Handshake,
	LayoutDashboard,
	ListTodo,
	Puzzle,
	Table,
	Table2,
	User,
  User2,
} from 'lucide-react'
import { LinkShortenerNav } from '~/features/link-shortener/nav'


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
		path: '/users',
		label: 'Users',
		type: 'item',
		icon: User2,
		authorization: {
			roles: ['admin', 'user'],
		},
  },
  {
		path: '/clients',
		label: 'Clients',
		type: 'item',
		icon: Handshake,
		authorization: {
			roles: ['admin', 'user'],
		},
  },
  {
		path: '/projects',
		label: 'Projects',
		type: 'item',
		icon: FolderKanban,
		authorization: {
			roles: ['admin', 'user'],
		},
  },
  {
		path: '/activities',
		label: 'Activities',
		type: 'item',
		icon: ListTodo,
		authorization: {
			roles: ['admin', 'user'],
		},
  },
	{
		path: '/table-example',
		label: 'Table Example',
		type: 'item',
		icon: Table2,
		authorization: {
			roles: ['admin', 'user'],
		},
	},
  ...LinkShortenerNav,
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
