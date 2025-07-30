import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Debug environment variables
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing')

if (!supabaseUrl) {
  throw new Error('REACT_APP_SUPABASE_URL is not defined in environment variables')
}

if (!supabaseAnonKey) {
  throw new Error('REACT_APP_SUPABASE_ANON_KEY is not defined in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Enhanced Document operations
export const documentService = {
  // Get all documents for a user with basic info
  async getDocuments(userId) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get a single document with all related data
  async getDocumentWithData(documentId) {
    const { data, error } = await supabase
      .rpc('get_document_with_data', { doc_id: documentId })
    
    if (error) throw error
    return data
  },

  // Create a new document
  async createDocument(userId, title, content = '') {
    const { data, error } = await supabase
      .from('documents')
      .insert([
        {
          user_id: userId,
          title: title,
          content: content,
          status: 'active'
        }
      ])
      .select()
    
    if (error) throw error
    
    // Create default document settings
    const document = data[0]
    await this.createDocumentSettings(document.id)
    
    return document
  },

  // Update a document
  async updateDocument(documentId, updates) {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', documentId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete a document (soft delete by setting status to deleted)
  async deleteDocument(documentId) {
    const { error } = await supabase
      .from('documents')
      .update({ status: 'deleted' })
      .eq('id', documentId)
    
    if (error) throw error
    return true
  },

  // Archive a document
  async archiveDocument(documentId) {
    const { error } = await supabase
      .from('documents')
      .update({ status: 'archived' })
      .eq('id', documentId)
    
    if (error) throw error
    return true
  },

  // Restore a document
  async restoreDocument(documentId) {
    const { error } = await supabase
      .from('documents')
      .update({ status: 'active' })
      .eq('id', documentId)
    
    if (error) throw error
    return true
  }
}

// Sources operations
export const sourceService = {
  // Get sources for a document
  async getSources(documentId) {
    const { data, error } = await supabase
      .from('sources')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Add a source
  async addSource(documentId, sourceData) {
    const { data, error } = await supabase
      .from('sources')
      .insert([{
        document_id: documentId,
        ...sourceData
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Update a source
  async updateSource(sourceId, updates) {
    const { data, error } = await supabase
      .from('sources')
      .update(updates)
      .eq('id', sourceId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete a source
  async deleteSource(sourceId) {
    const { error } = await supabase
      .from('sources')
      .delete()
      .eq('id', sourceId)
    
    if (error) throw error
    return true
  }
}

// Notes operations
export const noteService = {
  // Get notes for a document
  async getNotes(documentId) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('document_id', documentId)
      .order('position', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Add a note
  async addNote(documentId, content, position = 0) {
    const { data, error } = await supabase
      .from('notes')
      .insert([{
        document_id: documentId,
        content,
        position
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Update a note
  async updateNote(noteId, updates) {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', noteId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete a note
  async deleteNote(noteId) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
    
    if (error) throw error
    return true
  }
}

// Research operations
export const researchService = {
  // Get research results for a document
  async getResearchResults(documentId) {
    const { data, error } = await supabase
      .from('research_results')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Add research results
  async addResearchResults(documentId, topic, query, results) {
    const { data, error } = await supabase
      .from('research_results')
      .insert([{
        document_id: documentId,
        topic,
        query,
        results,
        status: 'completed'
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Update research status
  async updateResearchStatus(researchId, status) {
    const { data, error } = await supabase
      .from('research_results')
      .update({ status })
      .eq('id', researchId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete research results
  async deleteResearchResults(researchId) {
    const { error } = await supabase
      .from('research_results')
      .delete()
      .eq('id', researchId)
    
    if (error) throw error
    return true
  }
}

// Citations operations
export const citationService = {
  // Get citations for a document
  async getCitations(documentId) {
    const { data, error } = await supabase
      .from('citations')
      .select(`
        *,
        sources (
          id,
          title,
          url,
          author
        )
      `)
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Add a citation
  async addCitation(documentId, sourceId, citationText, citationStyle = 'APA') {
    const { data, error } = await supabase
      .from('citations')
      .insert([{
        document_id: documentId,
        source_id: sourceId,
        citation_text: citationText,
        citation_style: citationStyle
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Update a citation
  async updateCitation(citationId, updates) {
    const { data, error } = await supabase
      .from('citations')
      .update(updates)
      .eq('id', citationId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete a citation
  async deleteCitation(citationId) {
    const { error } = await supabase
      .from('citations')
      .delete()
      .eq('id', citationId)
    
    if (error) throw error
    return true
  }
}

// AI Analysis operations
export const aiAnalysisService = {
  // Get AI analysis for a document
  async getAIAnalysis(documentId) {
    const { data, error } = await supabase
      .from('ai_analysis')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Add AI analysis
  async addAIAnalysis(documentId, analysisType, results, score = null, suggestions = null) {
    const { data, error } = await supabase
      .from('ai_analysis')
      .insert([{
        document_id: documentId,
        analysis_type: analysisType,
        results,
        score,
        suggestions
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Update AI analysis
  async updateAIAnalysis(analysisId, updates) {
    const { data, error } = await supabase
      .from('ai_analysis')
      .update(updates)
      .eq('id', analysisId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete AI analysis
  async deleteAIAnalysis(analysisId) {
    const { error } = await supabase
      .from('ai_analysis')
      .delete()
      .eq('id', analysisId)
    
    if (error) throw error
    return true
  }
}

// Chat messages operations
export const chatService = {
  // Get chat messages for a document
  async getChatMessages(documentId) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Add a chat message
  async addChatMessage(documentId, message, isUserMessage = true, metadata = null) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{
        document_id: documentId,
        message,
        is_user_message: isUserMessage,
        metadata
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Update a chat message
  async updateChatMessage(messageId, updates) {
    const { data, error } = await supabase
      .from('chat_messages')
      .update(updates)
      .eq('id', messageId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete a chat message
  async deleteChatMessage(messageId) {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', messageId)
    
    if (error) throw error
    return true
  },

  // Clear all chat messages for a document
  async clearChatMessages(documentId) {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('document_id', documentId)
    
    if (error) throw error
    return true
  }
}

// Document settings operations
export const documentSettingsService = {
  // Get document settings
  async getDocumentSettings(documentId) {
    const { data, error } = await supabase
      .from('document_settings')
      .select('*')
      .eq('document_id', documentId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"
    return data
  },

  // Create document settings
  async createDocumentSettings(documentId) {
    const { data, error } = await supabase
      .from('document_settings')
      .insert([{
        document_id: documentId,
        auto_save: true,
        citation_style: 'APA',
        theme: 'default'
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Update document settings
  async updateDocumentSettings(documentId, updates) {
    const { data, error } = await supabase
      .from('document_settings')
      .update(updates)
      .eq('document_id', documentId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete document settings
  async deleteDocumentSettings(documentId) {
    const { error } = await supabase
      .from('document_settings')
      .delete()
      .eq('document_id', documentId)
    
    if (error) throw error
    return true
  }
}

// User operations
export const userService = {
  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Sign up
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) throw error
    return data
  },

  // Sign in
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
} 