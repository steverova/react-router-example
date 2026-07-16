import { useEffect, useState } from "react"
import { Minus, Square, X, Maximize2, RotateCw } from "lucide-react"

export default function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false)
  const [ready, setReady] = useState(false)
  const [win, setWin] = useState<any>(null)

  useEffect(() => {
    if (!window.__TAURI_INTERNALS__) return

    import("@tauri-apps/api/window").then(({ getCurrentWindow }) => {
      const w = getCurrentWindow()
      setWin(w)
      w.isMaximized().then(setIsMaximized)
      setReady(true)

      w.onResized(async () => {
        const maximized = await w.isMaximized()
        setIsMaximized(maximized)
      })
    })
  }, [])

  if (!ready) return null

  return (
    <div className="flex items-center gap-0 ml-auto shrink-0">
      <button
        data-tauri-drag-region="false"
        onClick={() => window.location.reload()}
        className="flex items-center justify-center w-11 h-11 hover:bg-muted transition-colors"
        title="Recargar"
      >
        <RotateCw className="size-4" />
      </button>
      <button
        data-tauri-drag-region="false"
        onClick={() => win.minimize()}
        className="flex items-center justify-center w-11 h-11 hover:bg-muted transition-colors"
        title="Minimizar"
      >
        <Minus className="size-4" />
      </button>
      <button
        data-tauri-drag-region="false"
        onClick={() => isMaximized ? win.unmaximize() : win.maximize()}
        className="flex items-center justify-center w-11 h-11 hover:bg-muted transition-colors"
        title={isMaximized ? "Restaurar" : "Maximizar"}
      >
        {isMaximized ? (
          <Square className="size-3.5" />
        ) : (
          <Maximize2 className="size-3.5" />
        )}
      </button>
      <button
        data-tauri-drag-region="false"
        onClick={() => win.close()}
        className="flex items-center justify-center w-11 h-11 hover:bg-destructive hover:text-destructive-foreground transition-colors"
        title="Cerrar"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
