import { redirect } from 'next/navigation'
import { getAuthUser } from '@lib/auth'
import SettingsPageClient from '@/src/presentation/components/profile/SettingsPageClient'

// Mark this route as dynamic because it uses cookies
export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const authUser = await getAuthUser()

  if (!authUser) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <SettingsPageClient />
    </div>
  )
}
