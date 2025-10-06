import { useState } from 'react'
import { 
  BarChart3, 
  MapPin, 
  Menu,
  X,
  Flower2,
  ChevronLeft
} from 'lucide-react'

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'map', name: 'Bloom Map', icon: MapPin },
  ]

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-56'
      } ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center px-3 py-3 border-b border-gray-200 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            <button 
              onClick={() => setIsCollapsed(false)}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <Flower2 className="w-4 h-4 text-white" />
              </div>
              {!isCollapsed && (
                <div className="ml-2">
                  <h1 className="text-sm font-bold text-gray-900">BloomingHealth</h1>
                </div>
              )}
            </button>
            {/* Collapse button - only show when expanded */}
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(true)}
                className="hidden lg:flex p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center px-2' : 'px-2'
                  } py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gray-200 text-gray-900' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="w-4 h-4" />
                  {!isCollapsed && <span className="ml-2">{item.name}</span>}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-white shadow-lg bg-white/90 backdrop-blur-sm"
      >
        {sidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>
    </>
  )
}