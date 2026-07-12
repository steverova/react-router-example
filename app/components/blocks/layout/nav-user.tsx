import {
	BadgeCheckIcon,
	ChevronsUpDownIcon,
	Loader2Icon,
	LogOutIcon
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
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


export function NavUser() {
	const navigate = useNavigate()
	const { isMobile } = useSidebar()
	const [isLoggingOut, setIsLoggingOut] = useState(false)

  const user = {
    email: 'steverova0594@gmail.com',
    role: 'admin'
  }
	function handleLogout() {
		setIsLoggingOut(true)
	
	}

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
								{user.email.charAt(0).toUpperCase()}
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
											{user.email.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className='grid flex-1 text-left text-sm leading-tight'>
										<span className='truncate font-medium'>{user.email}</span>
										<span className='truncate text-xs capitalize'>
											{user.role}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={() => navigate('account')}>
								<BadgeCheckIcon />
								Account
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
							{isLoggingOut ? (
								<Loader2Icon className='animate-spin' />
							) : (
								<LogOutIcon />
							)}
							{isLoggingOut ? 'Cerrando sesión...' : 'Log out'}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>

			{isLoggingOut && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
					<div className='flex flex-col items-center gap-3'>
						<Loader2Icon className='size-8 animate-spin text-primary' />
						<span className='text-sm text-muted-foreground'>
							Cerrando sesión...
						</span>
					</div>
				</div>
			)}
		</SidebarMenu>
	)
}
