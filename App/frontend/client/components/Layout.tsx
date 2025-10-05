'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Flower2, 
  MapPin, 
  Grid3X3, 
  Share2, 
  ChevronDown 
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const navigation = [
    {
      name: 'Bloom Dashboard',
      href: '/',
      icon: Grid3X3,
      current: pathname === '/'
    },
    {
      name: 'Health Impact Alerts',
      href: '/health-alerts',
      icon: Flower2,
      current: pathname === '/health-alerts'
    },
    {
      name: 'Monterrey Bloom Map',
      href: '/bloom-map',
      icon: MapPin,
      current: pathname === '/bloom-map'
    }
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white shadow-lg`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-4 py-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-bloom-green rounded flex items-center justify-center">
                <Flower2 className="w-5 h-5 text-white" />
              </div>
              {isSidebarOpen && (
                <div className="ml-3">
                  <h1 className="text-lg font-bold text-gray-900">BloomingHealth</h1>
                  <p className="text-sm text-gray-500">Health & Bloom Tracker</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-bloom-green text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {isSidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">AI</span>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-900">Nature Themed Dashboard App</h2>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-bloom-green text-white rounded-lg hover:bg-green-600 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
