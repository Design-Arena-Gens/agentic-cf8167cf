'use client'

import { StackFrame } from '../types'

interface CallStackViewProps {
  stack: StackFrame[]
}

export default function CallStackView({ stack }: CallStackViewProps) {
  if (stack.length === 0) {
    return null
  }

  return (
    <div className="bg-background rounded-lg border border-border overflow-hidden">
      <div className="px-3 py-2 bg-panel border-b border-border">
        <h3 className="text-sm font-semibold text-gray-300">Call Stack</h3>
      </div>
      <div className="p-3" role="region" aria-label="Function call stack">
        <div className="space-y-2">
          {stack.map((frame, idx) => (
            <div
              key={idx}
              className={`bg-panel rounded border p-3 ${
                idx === stack.length - 1 ? 'border-primary' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 bg-background px-2 py-0.5 rounded">
                    {stack.length - idx}
                  </span>
                  <span className="font-mono text-sm font-semibold text-primary">
                    {frame.function}()
                  </span>
                </div>
                <span className="text-xs text-gray-500">line {frame.line}</span>
              </div>
              {frame.variables.length > 0 && (
                <div className="mt-2 space-y-1 pl-2 border-l-2 border-border">
                  {frame.variables.map((variable) => (
                    <div key={variable.name} className="flex items-center space-x-2 text-sm">
                      <span className="font-mono text-gray-400">{variable.name}:</span>
                      <span className="font-mono text-primary">
                        {JSON.stringify(variable.value)}
                      </span>
                      <span className="text-xs text-gray-500">({variable.type})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
