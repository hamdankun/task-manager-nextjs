/**
 * Login Page
 *
 * Architecture: Presentation Layer (Page Component)
 * - Server Component by default
 * - Renders AuthLayout with LoginFormWrapper
 * - Handles page-level metadata and routing
 *
 * URL: /login
 * Flow: User → LoginForm → loginAction (server action)
 */

import { AuthLayout, LoginFormWrapper } from '@/src/presentation/components/auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - Task Manager',
  description: 'Sign in to your Task Manager account',
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginFormWrapper />
    </AuthLayout>
  )
}
