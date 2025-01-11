import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useContext, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppContext, AppProvider } from './contexts/app.context'
import useRouteElements from './useRouteElements'
import { LocalStorageEventTarget } from './utils/auth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

function App() {
  const routeElements = useRouteElements()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset)

    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>{routeElements}</LocalizationProvider>
        <ToastContainer autoClose={2000} hideProgressBar theme='colored' />
      </AppProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
