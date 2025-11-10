'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { changePasswordAction } from '@presentation/actions/profile/changePassword'
import { ChangePasswordForm } from './ChangePasswordForm'

export default function SettingsPageClient() {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)

  const handleSubmit = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    setError(undefined)
    setSuccess(undefined)

    try {
      const result = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      })

      if (!result.success) {
        setError(result.error || 'Failed to change password')
        return
      }

      setSuccess('Password changed successfully! Redirecting...')
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
    <ChangePasswordForm
      onSubmit={handleSubmit}
      error={error}
      success={success}
    />
  )
}
