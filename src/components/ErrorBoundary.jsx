import { Component } from 'react'

// App-wide safety net. Before this, a single component throw (e.g. a missing
// import) blanked the ENTIRE SPA to a black screen with no recovery — audit
// found exactly this on /producer/received. Now a crash shows a recoverable
// message instead of taking the whole app down.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Surface for diagnosis; never silent.
    console.error('[ErrorBoundary]', error, info?.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-bg text-ink flex items-center justify-center p-6">
          <div className="max-w-sm text-center">
            <p className="font-display text-xl font-bold mb-2">Something went wrong on this screen.</p>
            <p className="text-sm text-muted mb-5">Your data is safe. Reload to continue.</p>
            <button className="btn-primary" onClick={() => { window.location.href = '/' }}>
              Back to start
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
