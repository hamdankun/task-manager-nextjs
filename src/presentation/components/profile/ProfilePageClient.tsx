'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfileAction } from '@presentation/actions/profile/updateProfile'
import { EditProfileForm } from './EditProfileForm'

interface ProfilePageClientProps {
  initialEmail: string
  initialFirstName: string
  initialLastName: string
}

export default function ProfilePageClient({
  initialEmail,
  initialFirstName,
  initialLastName,
}: ProfilePageClientProps) {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)

  const handleSubmit = async (
    email: string,
    firstName: string,
    lastName: string
  ) => {
    setError(undefined)
    setSuccess(undefined)

    try {
      const result = await updateProfileAction({ email, firstName, lastName })

      if (!result.success) {
        setError(result.error || 'Failed to update profile')
        return
      }

      setSuccess('Profile updated successfully! Redirecting...')
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred. Please try again.'
      )
    }
  }

  return (
    <EditProfileForm
      initialEmail={initialEmail}
      initialFirstName={initialFirstName}
      initialLastName={initialLastName}
      onSubmit={handleSubmit}
      error={error}
      success={success}
    />
  )
}
