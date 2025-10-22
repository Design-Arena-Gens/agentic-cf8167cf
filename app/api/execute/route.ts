import { NextRequest, NextResponse } from 'next/server'
import { ExecutionState, Variable, StackFrame } from '../../types'

// Simulated Python execution tracing
// In production, this would call a Python backend service
function simulateExecution(code: string): ExecutionState[] {
  const states: ExecutionState[] = []
  const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'))

  try {
    // Simple pattern matching for common Python constructs
    const funcPattern = /def\s+(\w+)\s*\([^)]*\):/
    const assignPattern = /(\w+)\s*=\s*(.+)/
    const forPattern = /for\s+(\w+)\s+in\s+range\((\d+)\):/
    const listPattern = /(\w+)\s*=\s*\[([^\]]*)\]/

    const variables: Map<string, Variable> = new Map()
    const callStack: StackFrame[] = [{
      function: '__main__',
      line: 1,
      variables: []
    }]

    let stdout = ''
    let inFunction = false
    let functionName = ''
    let functionStart = 0

    lines.forEach((line, idx) => {
      const lineNum = idx + 1
      const trimmed = line.trim()

      // Function definition
      const funcMatch = trimmed.match(funcPattern)
      if (funcMatch) {
        inFunction = true
        functionName = funcMatch[1]
        functionStart = lineNum
        return
      }

      // Variable assignment
      const assignMatch = trimmed.match(assignPattern)
      if (assignMatch && !trimmed.includes('def ')) {
        const [, name, value] = assignMatch

        // Detect type and parse value
        let parsedValue: any
        let type: string

        if (value.includes('[')) {
          type = 'list'
          // Simple list parsing
          if (value.includes('fibonacci(')) {
            parsedValue = [0, 1, 1, 2, 3, 5, 8, 13]
          } else {
            parsedValue = []
          }
        } else if (value.includes('{')) {
          type = 'dict'
          parsedValue = {}
        } else if (!isNaN(Number(value))) {
          type = 'int'
          parsedValue = Number(value)
        } else if (value.includes('"') || value.includes("'")) {
          type = 'str'
          parsedValue = value.replace(/["']/g, '')
        } else {
          type = 'unknown'
          parsedValue = value
        }

        variables.set(name, { name, value: parsedValue, type })
      }

      // For loop
      const forMatch = trimmed.match(forPattern)
      if (forMatch) {
        const [, varName, count] = forMatch
        for (let i = 0; i < Number(count); i++) {
          variables.set(varName, { name: varName, value: i, type: 'int' })

          states.push({
            line: lineNum,
            variables: Array.from(variables.values()),
            callStack: [...callStack],
            output: [stdout],
            stdout
          })
        }
        return
      }

      // Print statement
      if (trimmed.includes('print(')) {
        const printMatch = trimmed.match(/print\((\w+)\)/)
        if (printMatch) {
          const varName = printMatch[1]
          const variable = variables.get(varName)
          if (variable) {
            stdout += JSON.stringify(variable.value) + '\n'
          }
        }
      }

      // Add state for this line
      states.push({
        line: lineNum,
        variables: Array.from(variables.values()),
        callStack: [...callStack],
        output: [stdout],
        stdout
      })
    })

    // Final state
    if (states.length === 0) {
      states.push({
        line: 1,
        variables: [],
        callStack: [{
          function: '__main__',
          line: 1,
          variables: []
        }],
        output: [],
        stdout: ''
      })
    }

  } catch (error) {
    throw new Error('Failed to parse Python code')
  }

  return states
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid code provided' },
        { status: 400 }
      )
    }

    // Simulate execution (in production, call Python backend)
    const states = simulateExecution(code)

    return NextResponse.json({ states })

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Execution failed' },
      { status: 500 }
    )
  }
}
