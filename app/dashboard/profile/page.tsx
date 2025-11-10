import { redirect } from 'next/navigation'
import { getAuthUser } from '@lib/auth'
import ProfilePageClient from '@/src/presentation/components/profile/ProfilePageClient'

export default async function ProfilePage() {
  const authUser = await getAuthUser()

  if (!authUser) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <ProfilePageClient
        initialEmail={authUser.email}
        initialFirstName={authUser.firstName || ''}
        initialLastName={authUser.lastName || ''}
      />
    </div>
  )
}
