'use client'

import { ExecutionState } from '../types'
import VariableView from './VariableView'
import CallStackView from './CallStackView'

interface VisualizationPanelProps {
  state?: ExecutionState
  error: string | null
  onToggleSidebar: () => void
  sidebarCollapsed: boolean
}

export default function VisualizationPanel({ state, error, onToggleSidebar, sidebarCollapsed }: VisualizationPanelProps) {
  return (
    <div className="h-full flex flex-col bg-panel">
      <div className="px-4 py-2 border-b border-border flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-300">Visualization</h2>
        <button
          onClick={onToggleSidebar}
          className="lg:block hidden p-1 hover:bg-border rounded"
          aria-label={sidebarCollapsed ? 'Show code editor' : 'Hide code editor'}
          aria-expanded={!sidebarCollapsed}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4" role="region" aria-label="Execution visualization">
        {error && (
          <div
            className="bg-error bg-opacity-10 border border-error rounded-lg p-4 mb-4"
            role="alert"
            aria-live="assertive"
          >
            <h3 className="text-error font-semibold mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Error
            </h3>
            <pre className="text-sm font-mono whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {!state && !error && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
              <p>Execute code to see visualization</p>
            </div>
          </div>
        )}

        {state && (
          <div className="space-y-4">
            <CallStackView stack={state.callStack} />
            <VariableView variables={state.variables} />

            {state.stdout && (
              <div className="bg-background rounded-lg border border-border overflow-hidden">
                <div className="px-3 py-2 bg-panel border-b border-border">
                  <h3 className="text-sm font-semibold text-gray-300">Output</h3>
                </div>
                <pre className="p-3 font-mono text-sm whitespace-pre-wrap">{state.stdout}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
