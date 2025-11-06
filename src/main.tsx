import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [err, setErr] = React.useState<Error | null>(null)
  React.useEffect(() => {
    const h = (e: ErrorEvent) => setErr(e.error ?? new Error(e.message))
    window.addEventListener('error', h)
    window.addEventListener('unhandledrejection', (e) => setErr(e.reason instanceof Error ? e.reason : new Error(String(e.reason))))
    return () => {
      window.removeEventListener('error', h)
      window.removeEventListener('unhandledrejection', () => {})
    }
  }, [])
  if (err) return <pre style={{ padding: 16, whiteSpace: 'pre-wrap' }}>App crashed: {String(err.stack || err.message)}</pre>
  return <>{children}</>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
