import React, { createContext, useContext, useState, useEffect } from 'react'
import { documentService } from '../services/supabase'
import { useAuth } from './AuthContext'

const DocumentContext = createContext()

export const useDocuments = () => {
  const context = useContext(DocumentContext)
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider')
  }
  return context
}

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([])
  const [currentDocument, setCurrentDocument] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const loadDocuments = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const docs = await documentService.getDocuments(user.id)
      setDocuments(docs)
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [user, loadDocuments])

  const createDocument = async (title, content = '') => {
    if (!user) throw new Error('User not authenticated')
    
    try {
      const newDoc = await documentService.createDocument(user.id, title, content)
      setDocuments(prev => [newDoc, ...prev])
      return newDoc
    } catch (error) {
      console.error('Error creating document:', error)
      throw error
    }
  }

  const updateDocument = async (documentId, updates) => {
    try {
      const updatedDoc = await documentService.updateDocument(documentId, updates)
      setDocuments(prev => 
        prev.map(doc => doc.id === documentId ? updatedDoc : doc)
      )
      if (currentDocument?.id === documentId) {
        setCurrentDocument(updatedDoc)
      }
      return updatedDoc
    } catch (error) {
      console.error('Error updating document:', error)
      throw error
    }
  }

  const deleteDocument = async (documentId) => {
    try {
      await documentService.deleteDocument(documentId)
      setDocuments(prev => prev.filter(doc => doc.id !== documentId))
      if (currentDocument?.id === documentId) {
        setCurrentDocument(null)
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  }

  const selectDocument = async (documentId) => {
    try {
      const doc = await documentService.getDocument(documentId)
      setCurrentDocument(doc)
      return doc
    } catch (error) {
      console.error('Error selecting document:', error)
      throw error
    }
  }

  const value = {
    documents,
    currentDocument,
    loading,
    createDocument,
    updateDocument,
    deleteDocument,
    selectDocument
  }

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  )
} 