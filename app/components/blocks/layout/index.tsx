import * as React from 'react'
import { Outlet, useLoaderData, data } from 'react-router'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger
} from '~/components/ui/sidebar'
import { Separator } from '~/components/ui/separator'
import { AppSidebar } from './app-sidebar'
import { requireAuth, rotateSession } from '~/session.server'
import { getUserById } from '~/features/user/user.repository'
import { useAuthStore } from '~/stores/auth-store'
import WindowControls from '~/components/shared/window-controls'


export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request)
  const user = await getUserById(Number(userId))
  const rotated = await rotateSession(request)
  if (rotated) {
    return data({ user }, { headers: rotated.headers })
  }
  return { user }
}

  export const shouldRevalidate = () => false

export default function Layout() {
  const { user } = useLoaderData<typeof loader>()
  const setUser = useAuthStore((s) => s.setUser)
  const authUser = useAuthStore((s) => s.user)

  React.useEffect(() => {
    if (user && JSON.stringify(user) !== JSON.stringify(authUser)) {
      setUser(user)
    }
  }, [user])
	
	return (
		<SidebarProvider className='h-screen'>
			<AppSidebar />
			<SidebarInset className='flex flex-col overflow-hidden'>
				<header
					data-tauri-drag-region
					className='flex h-10 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10 sticky top-0 z-50 bg-background border-b relative'
				>
					<div className='flex items-center gap-2 px-3'>
            <SidebarTrigger className='-ml-1' />
						<Separator
							orientation='vertical'
							className='mr-2 data-[orientation=vertical]:h-6'
						/>
					</div>
					<div className='flex-1' />
					<div className='flex items-center'>
						<WindowControls />
					</div>
				</header>
				<div className='flex flex-1 flex-col overflow-auto min-h-screen'>
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
