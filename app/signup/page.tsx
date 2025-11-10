/**
 * Sign Up Page
 *
 * Architecture: Presentation Layer (Page Component)
 * - Server Component by default
 * - Renders AuthLayout with SignupFormWrapper
 * - Handles page-level metadata and routing
 *
 * URL: /signup
 * Flow: User → SignupForm → signupAction (server action)
 */

import { AuthLayout, SignupFormWrapper } from '@/src/presentation/components/auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - Task Manager',
  description: 'Create a new Task Manager account',
}

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupFormWrapper />
    </AuthLayout>
  )
}
