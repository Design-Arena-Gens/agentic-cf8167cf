'use client'

interface ControlPanelProps {
  onExecute: () => void
  onStepForward: () => void
  onStepBackward: () => void
  onReset: () => void
  currentStep: number
  totalSteps: number
  isExecuting: boolean
  hasStates: boolean
}

export default function ControlPanel({
  onExecute,
  onStepForward,
  onStepBackward,
  onReset,
  currentStep,
  totalSteps,
  isExecuting,
  hasStates,
}: ControlPanelProps) {
  return (
    <div className="bg-panel border-t border-border px-6 py-4" role="region" aria-label="Control panel">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={onExecute}
            disabled={isExecuting}
            className="bg-primary hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            aria-label="Execute code"
          >
            {isExecuting ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Executing...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>Execute</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            disabled={!hasStates || isExecuting}
            className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            aria-label="Reset execution"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {hasStates && (
            <div className="text-sm text-gray-400" aria-live="polite" aria-atomic="true">
              Step <span className="text-primary font-semibold">{currentStep + 1}</span> of {totalSteps}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={onStepBackward}
              disabled={!hasStates || currentStep === 0 || isExecuting}
              className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              aria-label="Step backward"
              title="Step Backward (Alt+Left)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            <button
              onClick={onStepForward}
              disabled={!hasStates || currentStep === totalSteps - 1 || isExecuting}
              className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              aria-label="Step forward"
              title="Step Forward (Alt+Right)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        Keyboard shortcuts: Alt+Left (back) | Alt+Right (forward) | Enter (execute)
      </div>
    </div>
  )
}
