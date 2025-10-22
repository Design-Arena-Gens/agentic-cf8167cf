'use client'

import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'

interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
  currentLine?: number
  isExecuting: boolean
}

export default function CodeEditor({ code, onChange, currentLine, isExecuting }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.innerHTML = Prism.highlight(code, Prism.languages.python, 'python')
    }
  }, [code])

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = e.currentTarget.scrollTop
      highlightRef.current.scrollLeft = e.currentTarget.scrollLeft
    }
  }

  const lines = code.split('\n')

  return (
    <div className="h-full flex flex-col bg-panel">
      <div className="px-4 py-2 border-b border-border">
        <h2 className="text-sm font-semibold text-gray-300">Code Editor</h2>
      </div>
      <div className="flex-1 relative overflow-hidden" role="region" aria-label="Code Editor">
        <div className="absolute inset-0 flex">
          {/* Line numbers */}
          <div className="bg-background text-gray-500 text-right pr-3 pl-2 py-4 select-none font-mono text-sm border-r border-border">
            {lines.map((_, i) => (
              <div
                key={i}
                className={`leading-6 ${currentLine === i + 1 ? 'text-primary font-bold' : ''}`}
                aria-current={currentLine === i + 1 ? 'step' : undefined}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code area */}
          <div className="flex-1 relative overflow-auto">
            <textarea
              ref={textareaRef}
              className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white font-mono text-sm resize-none outline-none z-10"
              value={code}
              onChange={(e) => onChange(e.target.value)}
              onScroll={handleScroll}
              spellCheck={false}
              disabled={isExecuting}
              aria-label="Python code input"
              style={{
                lineHeight: '1.5rem',
                tabSize: 4,
              }}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault()
                  const start = e.currentTarget.selectionStart
                  const end = e.currentTarget.selectionEnd
                  const newCode = code.substring(0, start) + '    ' + code.substring(end)
                  onChange(newCode)
                  setTimeout(() => {
                    if (textareaRef.current) {
                      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4
                    }
                  }, 0)
                }
              }}
            />

            <pre
              ref={highlightRef}
              className="absolute inset-0 w-full h-full p-4 font-mono text-sm overflow-auto pointer-events-none"
              aria-hidden="true"
              style={{
                lineHeight: '1.5rem',
                tabSize: 4,
              }}
            >
              <code className="language-python">{code}</code>
            </pre>

            {/* Current line highlight */}
            {currentLine && (
              <div
                className="absolute left-0 right-0 bg-primary bg-opacity-10 border-l-2 border-primary pointer-events-none"
                style={{
                  top: `${(currentLine - 1) * 24 + 16}px`,
                  height: '24px',
                }}
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
