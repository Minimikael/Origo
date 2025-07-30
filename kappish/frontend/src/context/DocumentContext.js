import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { 
  documentService, 
  sourceService, 
  noteService, 
  researchService, 
  citationService, 
  aiAnalysisService, 
  chatService, 
  documentSettingsService 
} from '../services/supabase'
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
  const [documentData, setDocumentData] = useState(null) // Full document data with all related items
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Document CRUD operations
  const loadDocuments = useCallback(async () => {
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
  }, [user])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

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
        setDocumentData(null)
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  }

  const archiveDocument = async (documentId) => {
    try {
      await documentService.archiveDocument(documentId)
      setDocuments(prev => 
        prev.map(doc => doc.id === documentId ? { ...doc, status: 'archived' } : doc)
      )
    } catch (error) {
      console.error('Error archiving document:', error)
      throw error
    }
  }

  const restoreDocument = async (documentId) => {
    try {
      await documentService.restoreDocument(documentId)
      setDocuments(prev => 
        prev.map(doc => doc.id === documentId ? { ...doc, status: 'active' } : doc)
      )
    } catch (error) {
      console.error('Error restoring document:', error)
      throw error
    }
  }

  const markAsCompleted = async (documentId) => {
    try {
      // Add a completion analysis to mark the document as completed
      await addAIAnalysis(documentId, 'completion', { status: 'completed' }, 100, ['Document marked as completed'])
      setDocuments(prev => 
        prev.map(doc => doc.id === documentId ? { ...doc, aiAnalysis: true } : doc)
      )
    } catch (error) {
      console.error('Error marking document as completed:', error)
      throw error
    }
  }

  const selectDocument = async (documentId) => {
    try {
      const fullData = await documentService.getDocumentWithData(documentId)
      setCurrentDocument(fullData.document)
      setDocumentData(fullData)
      return fullData
    } catch (error) {
      console.error('Error selecting document:', error)
      throw error
    }
  }

  // Sources operations
  const loadSources = useCallback(async (documentId) => {
    if (!documentId) return
    try {
      const sources = await sourceService.getSources(documentId)
      setDocumentData(prev => prev ? { ...prev, sources } : null)
      return sources
    } catch (error) {
      console.error('Error loading sources:', error)
      throw error
    }
  }, [])

  const addSource = async (documentId, sourceData) => {
    try {
      const newSource = await sourceService.addSource(documentId, sourceData)
      setDocumentData(prev => prev ? { 
        ...prev, 
        sources: [newSource, ...(prev.sources || [])] 
      } : null)
      return newSource
    } catch (error) {
      console.error('Error adding source:', error)
      throw error
    }
  }

  const updateSource = async (sourceId, updates) => {
    try {
      const updatedSource = await sourceService.updateSource(sourceId, updates)
      setDocumentData(prev => prev ? {
        ...prev,
        sources: prev.sources?.map(s => s.id === sourceId ? updatedSource : s) || []
      } : null)
      return updatedSource
    } catch (error) {
      console.error('Error updating source:', error)
      throw error
    }
  }

  const deleteSource = async (sourceId) => {
    try {
      await sourceService.deleteSource(sourceId)
      setDocumentData(prev => prev ? {
        ...prev,
        sources: prev.sources?.filter(s => s.id !== sourceId) || []
      } : null)
    } catch (error) {
      console.error('Error deleting source:', error)
      throw error
    }
  }

  // Notes operations
  const loadNotes = useCallback(async (documentId) => {
    if (!documentId) return
    try {
      const notes = await noteService.getNotes(documentId)
      setDocumentData(prev => prev ? { ...prev, notes } : null)
      return notes
    } catch (error) {
      console.error('Error loading notes:', error)
      throw error
    }
  }, [])

  const addNote = async (documentId, content, position = 0) => {
    try {
      const newNote = await noteService.addNote(documentId, content, position)
      setDocumentData(prev => prev ? {
        ...prev,
        notes: [...(prev.notes || []), newNote]
      } : null)
      return newNote
    } catch (error) {
      console.error('Error adding note:', error)
      throw error
    }
  }

  const updateNote = async (noteId, updates) => {
    try {
      const updatedNote = await noteService.updateNote(noteId, updates)
      setDocumentData(prev => prev ? {
        ...prev,
        notes: prev.notes?.map(n => n.id === noteId ? updatedNote : n) || []
      } : null)
      return updatedNote
    } catch (error) {
      console.error('Error updating note:', error)
      throw error
    }
  }

  const deleteNote = async (noteId) => {
    try {
      await noteService.deleteNote(noteId)
      setDocumentData(prev => prev ? {
        ...prev,
        notes: prev.notes?.filter(n => n.id !== noteId) || []
      } : null)
    } catch (error) {
      console.error('Error deleting note:', error)
      throw error
    }
  }

  // Research operations
  const loadResearchResults = useCallback(async (documentId) => {
    if (!documentId) return
    try {
      const researchResults = await researchService.getResearchResults(documentId)
      setDocumentData(prev => prev ? { ...prev, research_results: researchResults } : null)
      return researchResults
    } catch (error) {
      console.error('Error loading research results:', error)
      throw error
    }
  }, [])

  const addResearchResults = async (documentId, topic, query, results) => {
    try {
      const newResearch = await researchService.addResearchResults(documentId, topic, query, results)
      setDocumentData(prev => prev ? {
        ...prev,
        research_results: [newResearch, ...(prev.research_results || [])]
      } : null)
      return newResearch
    } catch (error) {
      console.error('Error adding research results:', error)
      throw error
    }
  }

  // Citations operations
  const loadCitations = useCallback(async (documentId) => {
    if (!documentId) return
    try {
      const citations = await citationService.getCitations(documentId)
      setDocumentData(prev => prev ? { ...prev, citations } : null)
      return citations
    } catch (error) {
      console.error('Error loading citations:', error)
      throw error
    }
  }, [])

  const addCitation = async (documentId, sourceId, citationText, citationStyle = 'APA') => {
    try {
      const newCitation = await citationService.addCitation(documentId, sourceId, citationText, citationStyle)
      setDocumentData(prev => prev ? {
        ...prev,
        citations: [newCitation, ...(prev.citations || [])]
      } : null)
      return newCitation
    } catch (error) {
      console.error('Error adding citation:', error)
      throw error
    }
  }

  // AI Analysis operations
  const loadAIAnalysis = useCallback(async (documentId) => {
    if (!documentId) return
    try {
      const aiAnalysis = await aiAnalysisService.getAIAnalysis(documentId)
      setDocumentData(prev => prev ? { ...prev, ai_analysis: aiAnalysis } : null)
      return aiAnalysis
    } catch (error) {
      console.error('Error loading AI analysis:', error)
      throw error
    }
  }, [])

  const addAIAnalysis = async (documentId, analysisType, results, score = null, suggestions = null) => {
    try {
      const newAnalysis = await aiAnalysisService.addAIAnalysis(documentId, analysisType, results, score, suggestions)
      setDocumentData(prev => prev ? {
        ...prev,
        ai_analysis: [newAnalysis, ...(prev.ai_analysis || [])]
      } : null)
      return newAnalysis
    } catch (error) {
      console.error('Error adding AI analysis:', error)
      throw error
    }
  }

  // Chat operations
  const loadChatMessages = useCallback(async (documentId) => {
    if (!documentId) return
    try {
      const chatMessages = await chatService.getChatMessages(documentId)
      setDocumentData(prev => prev ? { ...prev, chat_messages: chatMessages } : null)
      return chatMessages
    } catch (error) {
      console.error('Error loading chat messages:', error)
      throw error
    }
  }, [])

  const addChatMessage = async (documentId, message, isUserMessage = true, metadata = null) => {
    try {
      const newMessage = await chatService.addChatMessage(documentId, message, isUserMessage, metadata)
      setDocumentData(prev => prev ? {
        ...prev,
        chat_messages: [...(prev.chat_messages || []), newMessage]
      } : null)
      return newMessage
    } catch (error) {
      console.error('Error adding chat message:', error)
      throw error
    }
  }

  const clearChatMessages = async (documentId) => {
    try {
      await chatService.clearChatMessages(documentId)
      setDocumentData(prev => prev ? {
        ...prev,
        chat_messages: []
      } : null)
    } catch (error) {
      console.error('Error clearing chat messages:', error)
      throw error
    }
  }

  // Document settings operations
  const loadDocumentSettings = useCallback(async (documentId) => {
    if (!documentId) return
    try {
      const settings = await documentSettingsService.getDocumentSettings(documentId)
      setDocumentData(prev => prev ? { ...prev, settings } : null)
      return settings
    } catch (error) {
      console.error('Error loading document settings:', error)
      throw error
    }
  }, [])

  const updateDocumentSettings = async (documentId, updates) => {
    try {
      const updatedSettings = await documentSettingsService.updateDocumentSettings(documentId, updates)
      setDocumentData(prev => prev ? {
        ...prev,
        settings: updatedSettings
      } : null)
      return updatedSettings
    } catch (error) {
      console.error('Error updating document settings:', error)
      throw error
    }
  }

  const value = {
    // Document state
    documents,
    currentDocument,
    documentData,
    loading,
    
    // Document CRUD
    createDocument,
    updateDocument,
    deleteDocument,
    archiveDocument,
    restoreDocument,
    markAsCompleted,
    selectDocument,
    loadDocuments,
    
    // Sources
    loadSources,
    addSource,
    updateSource,
    deleteSource,
    
    // Notes
    loadNotes,
    addNote,
    updateNote,
    deleteNote,
    
    // Research
    loadResearchResults,
    addResearchResults,
    
    // Citations
    loadCitations,
    addCitation,
    
    // AI Analysis
    loadAIAnalysis,
    addAIAnalysis,
    
    // Chat
    loadChatMessages,
    addChatMessage,
    clearChatMessages,
    
    // Settings
    loadDocumentSettings,
    updateDocumentSettings
  }

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  )
} 