import {
	BadgeCheckIcon,
	ChevronsUpDownIcon,
	LogOutIcon
} from 'lucide-react'
import { useFetcher } from 'react-router'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from '~/components/ui/sidebar'
import { useAuthStore } from '~/stores/auth-store'


export function NavUser() {
	const { isMobile } = useSidebar()
	const user = useAuthStore((s) => s.user)
	const logout = useAuthStore((s) => s.logout)
	const fetcher = useFetcher()

	if (!user) return null

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton size='lg' className='aria-expanded:bg-muted' />
						}
					>
						<Avatar>
							<AvatarFallback>
								{user.name.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className='grid flex-1 text-left text-sm leading-tight'>
							<span className='truncate font-medium'>{user.email}</span>
							<span className='truncate text-xs capitalize'>{user.role}</span>
						</div>
						<ChevronsUpDownIcon className='ml-auto size-4' />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-fit'
						side={isMobile ? 'bottom' : 'right'}
						align='end'
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className='p-0 font-normal'>
								<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
									<Avatar>
										<AvatarFallback>
											{user.name.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className='grid flex-1 text-left text-sm leading-tight'>
										<span className='truncate font-medium'>{user.name}</span>
										<span className='truncate text-xs'>
											{user.email}
										</span>
										<span className='truncate text-xs capitalize'>
											{user.role}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<BadgeCheckIcon />
								Account
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								logout()
								fetcher.submit(null, { method: "post", action: "/logout" })
							}}
						>
							<LogOutIcon />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
