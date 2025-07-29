import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database table names
export const TABLES = {
  USERS: 'users',
  DOCUMENTS: 'documents',
  DOCUMENT_VERSIONS: 'document_versions',
  COLLABORATORS: 'collaborators',
  AI_ANALYSIS: 'ai_analysis',
  PROJECTS: 'projects',
  WORKSPACES: 'workspaces'
};

// Row Level Security (RLS) policies
export const RLS_POLICIES = {
  USERS: {
    SELECT: 'users can view their own profile',
    UPDATE: 'users can update their own profile',
    INSERT: 'users can insert their own profile'
  },
  DOCUMENTS: {
    SELECT: 'users can view documents they own or collaborate on',
    UPDATE: 'users can update documents they own or collaborate on',
    INSERT: 'users can create documents',
    DELETE: 'users can delete documents they own'
  }
};

// Helper functions for common operations
export const supabaseHelpers = {
  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Get user session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Subscribe to real-time changes
  subscribeToChanges: (table, callback) => {
    return supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe();
  }
};

export default supabase; 