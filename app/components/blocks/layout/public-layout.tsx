import { Outlet } from 'react-router'
import WindowControls from '~/components/shared/window-controls'

export default function PublicLayout() {
  return (
    <div className='flex flex-col min-h-screen'>
      <header
        data-tauri-drag-region
        className='flex h-10 shrink-0 items-center sticky top-0 z-50 bg-background border-b relative'
      >
        <div className='flex-1' />
        <div className='flex items-center'>
          <WindowControls />
        </div>
      </header>
      <div className='flex flex-1 flex-col overflow-auto'>
        <Outlet />
      </div>
    </div>
  )
}
