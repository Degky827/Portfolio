import { Component } from 'react'

export default class ContactErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Contact 3D scene error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}
