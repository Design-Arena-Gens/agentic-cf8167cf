'use client'

import { useState } from 'react'
import CodeEditor from './components/CodeEditor'
import VisualizationPanel from './components/VisualizationPanel'
import ControlPanel from './components/ControlPanel'
import { ExecutionState } from './types'

const defaultCode = `# Example: Fibonacci sequence
def fibonacci(n):
    a, b = 0, 1
    result = []
    for i in range(n):
        result.append(a)
        a, b = b, a + b
    return result

fib_list = fibonacci(8)
print(fib_list)`

export default function Home() {
  const [code, setCode] = useState(defaultCode)
  const [executionStates, setExecutionStates] = useState<ExecutionState[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const executeCode = async () => {
    setIsExecuting(true)
    setError(null)

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Execution failed')
      }

      setExecutionStates(data.states)
      setCurrentStep(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setExecutionStates([])
    } finally {
      setIsExecuting(false)
    }
  }

  const stepForward = () => {
    if (currentStep < executionStates.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const reset = () => {
    setCurrentStep(0)
    setExecutionStates([])
    setError(null)
  }

  const currentState = executionStates[currentStep]

  return (
    <main className="h-screen flex flex-col">
      <header className="bg-panel border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold text-primary">Python Code Visualizer</h1>
        <p className="text-sm text-gray-400 mt-1">Interactive step-by-step code execution</p>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className={`${sidebarCollapsed ? 'hidden lg:block lg:w-0' : 'w-full lg:w-1/2'} border-b lg:border-b-0 lg:border-r border-border transition-all duration-300`}>
          <CodeEditor
            code={code}
            onChange={setCode}
            currentLine={currentState?.line}
            isExecuting={isExecuting}
          />
        </div>

        <div className={`${sidebarCollapsed ? 'w-full' : 'w-full lg:w-1/2'} flex flex-col transition-all duration-300`}>
          <VisualizationPanel
            state={currentState}
            error={error}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            sidebarCollapsed={sidebarCollapsed}
          />
        </div>
      </div>

      <ControlPanel
        onExecute={executeCode}
        onStepForward={stepForward}
        onStepBackward={stepBackward}
        onReset={reset}
        currentStep={currentStep}
        totalSteps={executionStates.length}
        isExecuting={isExecuting}
        hasStates={executionStates.length > 0}
      />
    </main>
  )
}
