import { cookies } from 'next/headers'

/**
 * User from cookie
 */
export interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

/**
 * Get authenticated user from cookies
 * 
 * @returns User data if authenticated, null otherwise
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('auth_user')

    if (!authCookie?.value) {
      return null
    }

    const user = JSON.parse(authCookie.value) as AuthUser
    return user
  } catch (error) {
    console.error('Error getting auth user:', error)
    return null
  }
}

/**
 * Get user full name from cookies
 */
export async function getUserFullName(): Promise<string> {
  const user = await getAuthUser()

  if (!user) {
    return 'User'
  }

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }

  if (user.firstName) {
    return user.firstName
  }

  return user.email.split('@')[0]
}

/**
 * Get user email from cookies
 */
export async function getUserEmail(): Promise<string> {
  const user = await getAuthUser()
  return user?.email || 'user@example.com'
}
