'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SignupForm } from '@/src/presentation/components/auth'
import { signupAction } from '@/src/presentation/actions/auth'

/**
 * SignupFormWrapper Component
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
 * 1. User submits form in SignupForm
 * 2. handleSubmit is called with (email, password, firstName, lastName)
 * 3. signupAction (server action) is executed
 * 4. Result from domain layer is returned
 * 5. On success: redirect to dashboard/home
 * 6. On error: display error message to user
 */

export function SignupFormWrapper() {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>(undefined)

  const handleSubmit = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    try {
      setError(undefined)

      // Call server action with user data
      const result = await signupAction({
        email,
        password,
        firstName,
        lastName,
      })

      if (result.success) {
        // Redirect to dashboard on successful signup
        router.push('/login')
      } else {
        // Show error message from domain/data layer
        setError(result.error || 'Signup failed')
      }
    } catch (err) {
      // Handle unexpected errors
      console.error('Signup error:', err)
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      )
    }
  }

  return <SignupForm onSubmit={handleSubmit} error={error} />
}
