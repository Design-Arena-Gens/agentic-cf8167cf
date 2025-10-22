export interface Variable {
  name: string
  value: any
  type: string
}

export interface StackFrame {
  function: string
  line: number
  variables: Variable[]
}

export interface ExecutionState {
  line: number
  variables: Variable[]
  callStack: StackFrame[]
  output: string[]
  stdout: string
}
