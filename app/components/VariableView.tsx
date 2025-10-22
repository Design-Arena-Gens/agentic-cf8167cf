'use client'

import { useState } from 'react'
import { Variable } from '../types'

interface VariableViewProps {
  variables: Variable[]
}

export default function VariableView({ variables }: VariableViewProps) {
  const [expandedVars, setExpandedVars] = useState<Set<string>>(new Set())

  const toggleExpand = (name: string) => {
    const newExpanded = new Set(expandedVars)
    if (newExpanded.has(name)) {
      newExpanded.delete(name)
    } else {
      newExpanded.add(name)
    }
    setExpandedVars(newExpanded)
  }

  const renderValue = (value: any, type: string): React.ReactNode => {
    if (type === 'list') {
      return (
        <div className="mt-2 space-y-1">
          {value.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center space-x-2 pl-4 text-sm">
              <span className="text-gray-500">[{idx}]</span>
              <span className="text-primary">{JSON.stringify(item)}</span>
            </div>
          ))}
        </div>
      )
    } else if (type === 'dict') {
      return (
        <div className="mt-2 space-y-1">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="flex items-center space-x-2 pl-4 text-sm">
              <span className="text-gray-500">{key}:</span>
              <span className="text-primary">{JSON.stringify(val)}</span>
            </div>
          ))}
        </div>
      )
    } else {
      return <span className="text-primary">{JSON.stringify(value)}</span>
    }
  }

  if (variables.length === 0) {
    return null
  }

  return (
    <div className="bg-background rounded-lg border border-border overflow-hidden">
      <div className="px-3 py-2 bg-panel border-b border-border">
        <h3 className="text-sm font-semibold text-gray-300">Variables</h3>
      </div>
      <div className="p-3 space-y-2" role="region" aria-label="Variable states">
        {variables.map((variable) => {
          const isComplex = variable.type === 'list' || variable.type === 'dict'
          const isExpanded = expandedVars.has(variable.name)

          return (
            <div
              key={variable.name}
              className="bg-panel rounded border border-border p-3 hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1">
                  {isComplex && (
                    <button
                      onClick={() => toggleExpand(variable.name)}
                      className="p-0.5 hover:bg-border rounded"
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${variable.name}`}
                      aria-expanded={isExpanded}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'transform rotate-90' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  <span className="font-mono text-sm font-semibold">{variable.name}</span>
                  <span className="text-xs text-gray-500 bg-background px-2 py-0.5 rounded">
                    {variable.type}
                  </span>
                </div>
              </div>
              {(!isComplex || isExpanded) && (
                <div className="mt-2 font-mono text-sm">
                  {renderValue(variable.value, variable.type)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
