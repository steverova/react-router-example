import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"

interface AlertDialogOptions {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
}

interface AlertDialogContextValue {
  confirm: (options: AlertDialogOptions) => Promise<boolean>
}

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null)

export function AlertDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<AlertDialogOptions>({
    title: "",
    description: "",
  })
  const [resolve, setResolve] = useState<(value: boolean) => void>(() => () => {})

  const confirm = useCallback((options: AlertDialogOptions) => {
    return new Promise<boolean>((res) => {
      setOptions(options)
      setResolve(() => res)
      setOpen(true)
    })
  }, [])

  const handleAction = () => {
    resolve(true)
    setOpen(false)
  }

  const handleCancel = () => {
    resolve(false)
    setOpen(false)
  }

  return (
    <AlertDialogContext.Provider value={{ confirm }}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options.title}</AlertDialogTitle>
            <AlertDialogDescription>{options.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {options.cancelText || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>
              {options.confirmText || "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  )
}

export function useAlertDialog() {
  const context = useContext(AlertDialogContext)
  if (!context) {
    throw new Error("useAlertDialog must be used within AlertDialogProvider")
  }
  return context
}
