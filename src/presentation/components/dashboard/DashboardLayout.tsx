'use client'

import { DashboardNavbar } from '@/src/presentation/components/dashboard/DashboardNavbar'
import { logoutAction } from '@/src/presentation/actions/auth/logout'
import { useRouter } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
  userEmail?: string
  userName?: string
}

export function DashboardLayout({ 
  children, 
  userEmail = 'user@example.com',
  userName = 'User',
}: DashboardLayoutProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await logoutAction()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardNavbar
        userEmail={userEmail}
        userName={userName}
        onLogout={handleLogout}
      />
      {children}
    </div>
  )
}
