import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Menu, 
  X, 
  Plus, 
  Settings, 
  User, 
  LogOut,
  ChevronDown,
  FolderOpen,
  FileText
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useDocuments } from '../../context/DocumentContext'
import Button from '../ui/Button'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const location = useLocation()
  const { user, signOut } = useAuth()
  const { createDocument, documents } = useDocuments()

  const handleCreateDocument = async () => {
    try {
      const newDoc = await createDocument('Untitled Document', '')
      // Navigate to the new document
      window.location.href = `/editor/${newDoc.id}`
    } catch (error) {
      console.error('Error creating document:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const workspaceSections = [
    {
      title: 'Recent',
      items: documents.slice(0, 5).map(doc => ({
        id: doc.id,
        name: doc.title,
        icon: FileText,
        href: `/editor/${doc.id}`,
        type: 'document'
      }))
    },
    {
      title: 'Quick Access',
      items: [
        { id: 'dashboard', name: 'Dashboard', icon: FolderOpen, href: '/dashboard', type: 'link' },
        { id: 'settings', name: 'Settings', icon: Settings, href: '/settings', type: 'link' }
      ]
    }
  ]

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FolderOpen },
    { name: 'Settings', href: '/settings', icon: Settings }
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">O</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-100">Origo</h1>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Workspace Sections */}
          <div className="px-4 pb-6 space-y-6">
            {workspaceSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <Link
                        key={item.id}
                        to={item.href}
                        className={`
                          flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors
                          ${isActive 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          }
                        `}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon size={16} />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-4">
            <Button
              onClick={handleCreateDocument}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Plus size={16} />
              <span>New Document</span>
            </Button>
          </div>

          {/* User Profile */}
          <div className="px-4 pb-4 border-t border-gray-700 pt-4">
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-3 w-full p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-200">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {user?.email}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                  <div className="py-2">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar 