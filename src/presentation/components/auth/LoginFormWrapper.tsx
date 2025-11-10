'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/src/presentation/components/auth'
import { loginAction } from '@/src/presentation/actions/auth'

/**
 * LoginFormWrapper Component
 *
 * Architecture: Presentation Layer (Client Component)
 * - Bridge between Server Page and Client Form
 * - Handles form submission logic
 * - Calls server actions
 * - Manages loading and error states
 *
 * This wrapper is necessary because:
 * - Next.js doesn't allow passing functions from Server → Client Components
 * - We need a Client Component to handle form interactivity
 * - Server actions are called directly within the client context
 *
 * Data Flow:
 * 1. User submits form in LoginForm
 * 2. handleSubmit is called with (email, password)
 * 3. loginAction (server action) is executed
 * 4. Result from domain layer is returned
 * 5. On success: redirect to dashboard/home
 * 6. On error: display error message to user
 */

export function LoginFormWrapper() {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>(undefined)

  const handleSubmit = async (email: string, password: string) => {
    try {
      setError(undefined)

      // Call server action with credentials
      const result = await loginAction({
        email,
        password,
      })

      if (result.success) {
        // Redirect to dashboard on successful login
        router.push('/dashboard')
      } else {
        // Show error message from domain/data layer
        setError(result.error || 'Login failed')
      }
    } catch (err) {
      // Handle unexpected errors
      console.error('Login error:', err)
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      )
    }
  }

  return <LoginForm onSubmit={handleSubmit} error={error} />
}
