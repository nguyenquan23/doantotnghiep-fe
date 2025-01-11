/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(__error: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error: ', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <main className='flex h-screen w-full flex-col items-center justify-center bg-[#1A2238]'>
          <h2 className='text-9xl font-extrabold tracking-widest text-white'>500</h2>
          <div className='absolute rotate-12 rounded bg-[#FF6A3D] px-6 text-lg'>Error</div>
        </main>
      )
    }

    return this.props.children
  }
}
