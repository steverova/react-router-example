import { Outlet, useLoaderData } from 'react-router'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger
} from '~/components/ui/sidebar'
import { Separator } from '~/components/ui/separator'
import { AppSidebar } from './app-sidebar'
import { requireAuth } from '~/session.server'


export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request)
  return { userId }
}

export default function Layout() {

  const { userId } = useLoaderData<typeof loader>()
  
	return (
		<SidebarProvider className='h-screen'>
			<AppSidebar />
			<SidebarInset className='flex flex-col overflow-hidden'>
				<header className='flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10 sticky top-0 z-50 bg-background border-b'>
					<div className='flex items-center gap-2 px-3'>
            <SidebarTrigger className='-ml-1' />
            {userId}
						<Separator
							orientation='vertical'
							className='mr-2 data-[orientation=vertical]:h-8'
						/>
					</div>
				</header>
				<div className='flex flex-1 flex-col overflow-hidden'>
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
