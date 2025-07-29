import { supabase, TABLES } from '../config/supabase';

// =============================================================================
// AUTHENTICATION SERVICES
// =============================================================================

export const authService = {
  // Sign up with email and password
  signUp: async (email, password, displayName = null) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName
        }
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in with OAuth provider
  signInWithProvider: async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Reset password
  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    
    if (error) throw error;
  },

  // Update password
  updatePassword: async (newPassword) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
  }
};

// =============================================================================
// USER SERVICES
// =============================================================================

export const userService = {
  // Get user profile
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create user profile
  createProfile: async (userData) => {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// =============================================================================
// WORKSPACE SERVICES
// =============================================================================

export const workspaceService = {
  // Get user's workspaces
  getUserWorkspaces: async () => {
    const { data, error } = await supabase
      .from(TABLES.WORKSPACES)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get workspace by ID
  getWorkspace: async (workspaceId) => {
    const { data, error } = await supabase
      .from(TABLES.WORKSPACES)
      .select('*')
      .eq('id', workspaceId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create workspace
  createWorkspace: async (workspaceData) => {
    const { data, error } = await supabase
      .from(TABLES.WORKSPACES)
      .insert(workspaceData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update workspace
  updateWorkspace: async (workspaceId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.WORKSPACES)
      .update(updates)
      .eq('id', workspaceId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete workspace
  deleteWorkspace: async (workspaceId) => {
    const { error } = await supabase
      .from(TABLES.WORKSPACES)
      .delete()
      .eq('id', workspaceId);
    
    if (error) throw error;
  }
};

// =============================================================================
// PROJECT SERVICES
// =============================================================================

export const projectService = {
  // Get projects in workspace
  getWorkspaceProjects: async (workspaceId) => {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get project by ID
  getProject: async (projectId) => {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create project
  createProject: async (projectData) => {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .insert(projectData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update project
  updateProject: async (projectId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete project
  deleteProject: async (projectId) => {
    const { error } = await supabase
      .from(TABLES.PROJECTS)
      .delete()
      .eq('id', projectId);
    
    if (error) throw error;
  }
};

// =============================================================================
// DOCUMENT SERVICES
// =============================================================================

export const documentService = {
  // Get user's documents
  getUserDocuments: async () => {
    const { data, error } = await supabase
      .from(TABLES.DOCUMENTS)
      .select(`
        *,
        projects (
          id,
          name,
          workspaces (
            id,
            name
          )
        )
      `)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get documents in project
  getProjectDocuments: async (projectId) => {
    const { data, error } = await supabase
      .from(TABLES.DOCUMENTS)
      .select('*')
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get document by ID
  getDocument: async (documentId) => {
    const { data, error } = await supabase
      .from(TABLES.DOCUMENTS)
      .select(`
        *,
        projects (
          id,
          name,
          workspaces (
            id,
            name
          )
        ),
        collaborators (
          id,
          user_id,
          permission_level,
          users (
            id,
            display_name,
            email
          )
        )
      `)
      .eq('id', documentId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create document
  createDocument: async (documentData) => {
    const { data, error } = await supabase
      .from(TABLES.DOCUMENTS)
      .insert(documentData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update document
  updateDocument: async (documentId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.DOCUMENTS)
      .update(updates)
      .eq('id', documentId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete document
  deleteDocument: async (documentId) => {
    const { error } = await supabase
      .from(TABLES.DOCUMENTS)
      .delete()
      .eq('id', documentId);
    
    if (error) throw error;
  },

  // Archive document
  archiveDocument: async (documentId) => {
    const { data, error } = await supabase
      .from(TABLES.DOCUMENTS)
      .update({ is_archived: true })
      .eq('id', documentId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get document versions
  getDocumentVersions: async (documentId) => {
    const { data, error } = await supabase
      .from('document_versions')
      .select('*')
      .eq('document_id', documentId)
      .order('version_number', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// =============================================================================
// COLLABORATION SERVICES
// =============================================================================

export const collaborationService = {
  // Add collaborator to document
  addCollaborator: async (documentId, userId, permissionLevel = 'read') => {
    const { data, error } = await supabase
      .from(TABLES.COLLABORATORS)
      .insert({
        document_id: documentId,
        user_id: userId,
        permission_level: permissionLevel
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Remove collaborator from document
  removeCollaborator: async (documentId, userId) => {
    const { error } = await supabase
      .from(TABLES.COLLABORATORS)
      .delete()
      .eq('document_id', documentId)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  // Update collaborator permissions
  updateCollaboratorPermissions: async (documentId, userId, permissionLevel) => {
    const { data, error } = await supabase
      .from(TABLES.COLLABORATORS)
      .update({ permission_level: permissionLevel })
      .eq('document_id', documentId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get document collaborators
  getDocumentCollaborators: async (documentId) => {
    const { data, error } = await supabase
      .from(TABLES.COLLABORATORS)
      .select(`
        *,
        users (
          id,
          display_name,
          email,
          avatar_url
        )
      `)
      .eq('document_id', documentId)
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  }
};

// =============================================================================
// AI ANALYSIS SERVICES
// =============================================================================

export const aiAnalysisService = {
  // Get AI analysis for document
  getDocumentAnalysis: async (documentId, analysisType = null) => {
    let query = supabase
      .from(TABLES.AI_ANALYSIS)
      .select('*')
      .eq('document_id', documentId)
      .eq('is_active', true);
    
    if (analysisType) {
      query = query.eq('analysis_type', analysisType);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create AI analysis
  createAnalysis: async (analysisData) => {
    const { data, error } = await supabase
      .from(TABLES.AI_ANALYSIS)
      .insert(analysisData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update AI analysis
  updateAnalysis: async (analysisId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.AI_ANALYSIS)
      .update(updates)
      .eq('id', analysisId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// =============================================================================
// REAL-TIME SUBSCRIPTIONS
// =============================================================================

export const realtimeService = {
  // Subscribe to document changes
  subscribeToDocument: (documentId, callback) => {
    return supabase
      .channel(`document:${documentId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: TABLES.DOCUMENTS,
        filter: `id=eq.${documentId}`
      }, callback)
      .subscribe();
  },

  // Subscribe to document collaborators
  subscribeToCollaborators: (documentId, callback) => {
    return supabase
      .channel(`collaborators:${documentId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: TABLES.COLLABORATORS,
        filter: `document_id=eq.${documentId}`
      }, callback)
      .subscribe();
  },

  // Subscribe to AI analysis updates
  subscribeToAnalysis: (documentId, callback) => {
    return supabase
      .channel(`analysis:${documentId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: TABLES.AI_ANALYSIS,
        filter: `document_id=eq.${documentId}`
      }, callback)
      .subscribe();
  }
};

// =============================================================================
// EXPORT ALL SERVICES
// =============================================================================

export default {
  auth: authService,
  user: userService,
  workspace: workspaceService,
  project: projectService,
  document: documentService,
  collaboration: collaborationService,
  aiAnalysis: aiAnalysisService,
  realtime: realtimeService
}; 