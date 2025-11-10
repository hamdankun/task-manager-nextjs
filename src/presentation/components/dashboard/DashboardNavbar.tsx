'use client'

import { useState } from 'react'
import { LogOut, Settings, User, ChevronDown, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface DashboardNavbarProps {
  userEmail?: string
  userName?: string
  onLogout?: () => void
}

export function DashboardNavbar({
  userEmail = 'user@example.com',
  userName = 'User',
  onLogout,
}: DashboardNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    setIsMenuOpen(false)
    onLogout?.()
  }

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Left: Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Task Manager
            </span>
          </Link>

          {/* Right: Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userEmail}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg py-2 z-50">
                {/* Profile */}
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>

                {/* Settings */}
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>

                {/* Divider */}
                <div className="my-2 border-t border-gray-200 dark:border-gray-800"></div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  )
}
