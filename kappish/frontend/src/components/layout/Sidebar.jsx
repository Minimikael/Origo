import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Plus, 
  Settings, 
  FolderOpen,
  FileText,
  CreditCard,
  HelpCircle
} from 'lucide-react'
import { useDocuments } from '../../context/DocumentContext'
import Button from '../ui/Button'

const Sidebar = () => {
  const location = useLocation()
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

  const navigation = [
    { name: 'Projects', href: '/', icon: FolderOpen, active: true },
    { name: 'Settings', href: '#', icon: Settings, disabled: true },
    { name: 'Billing', href: '#', icon: CreditCard, disabled: true },
    { name: 'Support', href: '#', icon: HelpCircle, disabled: true }
  ]

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">O</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-100">Origo</h1>
        </div>
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
                ${item.disabled 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
              onClick={item.disabled ? (e) => e.preventDefault() : undefined}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Recent Documents */}
      <div className="px-4 pb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Recent Documents
        </h3>
        <div className="space-y-1">
          {documents.slice(0, 5).map((doc) => {
            const isActive = location.pathname === `/editor/${doc.id}`
            return (
              <Link
                key={doc.id}
                to={`/editor/${doc.id}`}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <FileText size={16} />
                <span className="truncate">{doc.title}</span>
              </Link>
            )
          })}
        </div>
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
    </div>
  )
}

export default Sidebar 