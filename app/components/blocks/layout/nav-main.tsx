import { ChevronRightIcon } from 'lucide-react'
import { Link } from 'react-router'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from '~/components/ui/collapsible'
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem
} from '~/components/ui/sidebar'
import navigation, { type NavigationItem } from './navigation-menu-items'

function NavItem({ item }: { item: NavigationItem }) {
	const Icon = item.icon

	if (item.type === 'collapse' && item.children) {
		return (
			<Collapsible
				defaultOpen={item.isActive}
				className='group/collapsible'
				render={<SidebarMenuItem />}
			>
				<CollapsibleTrigger
					render={<SidebarMenuButton tooltip={item.label} />}
				>
					{Icon && <Icon className='size-4 shrink-0' />}
					<span>{item.label}</span>
					<ChevronRightIcon className='ml-auto size-4 transition-transform duration-200 group-data-open/collapsible:rotate-90' />
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{item.children.map((child) => (
							<SidebarMenuSubItem key={child.label}>
								<SidebarMenuSubButton render={<Link to={child.path ?? '#'} />}>
									{child.icon && <child.icon className='size-4 shrink-0' />}
									<span>{child.label}</span>
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		)
	}

	return (
		<SidebarMenuItem>
			<SidebarMenuButton tooltip={item.label} render={<Link to={item.path ?? '#'} />}>
				{Icon && <Icon className='size-4 shrink-0' />}
				<span>{item.label}</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}

export function NavMain() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{navigation.map((item) => (
					<NavItem key={item.label} item={item} />
				))}
			</SidebarMenu>
		</SidebarGroup>
	)
}
