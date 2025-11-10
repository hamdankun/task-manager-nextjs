/**
 * Auth Layout Component
 *
 * Provides a centered, minimal layout for authentication pages
 * with brand consistency and proper spacing.
 *
 * Architecture: Presentation Layer
 * - Server Component (no 'use client' directive)
 * - Provides layout wrapper for auth forms
 * - Handles responsive design and theming
 */

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      {/* Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Card container */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 dark:text-gray-500 mt-6">
          Task Manager © 2025. All rights reserved.
        </p>
      </div>
    </div>
  )
}
