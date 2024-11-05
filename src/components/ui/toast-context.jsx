import * as React from "react"
import { ToastProvider as ToastUIProvider, Toast, ToastViewport } from "./toast"

const ToastContext = React.createContext(undefined)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([])

  const toast = React.useCallback(
    function toast({ title, description, action, ...props }) {
      const id = Math.random().toString(36).substr(2, 9)
      setToasts((prevToasts) => [
        ...prevToasts,
        { id, title, description, action, ...props },
      ])

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prevToasts) => 
          prevToasts.filter((toast) => toast.id !== id)
        )
      }, 5000)
    },
    []
  )

  const dismiss = React.useCallback(
    function dismiss(toastId) {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId))
    },
    []
  )

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      <ToastUIProvider>
        {children}
        {toasts.map(({ id, ...props }) => (
          <Toast key={id} {...props} onClose={() => dismiss(id)} />
        ))}
        <ToastViewport />
      </ToastUIProvider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return context
}