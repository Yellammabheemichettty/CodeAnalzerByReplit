import React from 'react'
import { Route } from 'wouter'
import CodeScanner from './pages/CodeScanner'
import BatchAnalyzer from './pages/BatchAnalyzer'
import History from './pages/History'
import NotFound from './pages/not-found'

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Route path="/" component={CodeScanner} />
      <Route path="/batch" component={BatchAnalyzer} />
      <Route path="/history" component={History} />
      <Route path="/:rest*" component={NotFound} />
    </div>
  )
}