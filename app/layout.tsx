import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Python Code Visualizer',
  description: 'Interactive step-by-step Python code execution visualization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-gray-100">{children}</body>
    </html>
  )
}
