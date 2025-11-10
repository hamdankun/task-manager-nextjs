'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Logout Server Action
 *
 * Clears the authentication cookie and redirects to login page
 * 
 * Security:
 * - Removes HTTP-only auth_user cookie (cannot be accessed by JavaScript)
 * - Clears session data on server
 * - Redirects to login page
 */
export async function logoutAction() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('auth_user')
  } catch (error) {
    console.error('Logout error:', error)
  }

  // Redirect to login page
  redirect('/login')
}
