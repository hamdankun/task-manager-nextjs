import { redirect } from 'next/navigation'
import { getAuthUser } from '@lib/auth'
import TasksPageClient from '@/src/presentation/components/task/TasksPageClient'
import { DashboardLayout } from '@/src/presentation/components/dashboard/DashboardLayout'

export default async function TasksPage() {
  const authUser = await getAuthUser()

  if (!authUser) {
    redirect('/login')
  }

  return (
    <DashboardLayout
      userEmail={authUser.email}
      userName={authUser.firstName && authUser.lastName ? `${authUser.firstName} ${authUser.lastName}` : authUser.email}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <TasksPageClient />
        </div>
      </div>
    </DashboardLayout>
  )
}
