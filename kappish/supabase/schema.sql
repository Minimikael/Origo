-- =============================================================================
-- ORIGO DATABASE SCHEMA
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- USERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    preferences JSONB DEFAULT '{}'::jsonb
);

-- =============================================================================
-- WORKSPACES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{}'::jsonb
);

-- =============================================================================
-- PROJECTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{}'::jsonb
);

-- =============================================================================
-- DOCUMENTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL DEFAULT 'Untitled Document',
    content TEXT,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_archived BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    version INTEGER DEFAULT 1
);

-- =============================================================================
-- DOCUMENT_VERSIONS TABLE (For version control)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES public.users(id),
    change_summary TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- =============================================================================
-- COLLABORATORS TABLE (For document sharing)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    permission_level VARCHAR(50) NOT NULL DEFAULT 'read', -- 'read', 'write', 'admin'
    invited_by UUID REFERENCES public.users(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(document_id, user_id)
);

-- =============================================================================
-- AI_ANALYSIS TABLE (For storing AI insights)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.ai_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    analysis_type VARCHAR(100) NOT NULL, -- 'plagiarism', 'grammar', 'style', 'sentiment'
    content TEXT NOT NULL,
    confidence_score DECIMAL(3,2),
    suggestions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id),
    is_active BOOLEAN DEFAULT TRUE
);

-- =============================================================================
-- DOCUMENT_COMMENTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.document_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    position JSONB, -- Store cursor position or selection
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_resolved BOOLEAN DEFAULT FALSE,
    parent_comment_id UUID REFERENCES public.document_comments(id) ON DELETE CASCADE
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Documents indexes
CREATE INDEX IF NOT EXISTS idx_documents_owner_id ON public.documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON public.documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_updated_at ON public.documents(updated_at);
CREATE INDEX IF NOT EXISTS idx_documents_is_archived ON public.documents(is_archived);

-- Collaborators indexes
CREATE INDEX IF NOT EXISTS idx_collaborators_document_id ON public.collaborators(document_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON public.collaborators(user_id);

-- AI Analysis indexes
CREATE INDEX IF NOT EXISTS idx_ai_analysis_document_id ON public.ai_analysis(document_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_type ON public.ai_analysis(analysis_type);

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_document_comments_document_id ON public.document_comments(document_id);
CREATE INDEX IF NOT EXISTS idx_document_comments_user_id ON public.document_comments(user_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_comments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Workspaces policies
CREATE POLICY "Users can view workspaces they own" ON public.workspaces
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can update workspaces they own" ON public.workspaces
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert workspaces" ON public.workspaces
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete workspaces they own" ON public.workspaces
    FOR DELETE USING (auth.uid() = owner_id);

-- Projects policies
CREATE POLICY "Users can view projects in their workspaces" ON public.projects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspaces 
            WHERE workspaces.id = projects.workspace_id 
            AND workspaces.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update projects in their workspaces" ON public.projects
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workspaces 
            WHERE workspaces.id = projects.workspace_id 
            AND workspaces.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert projects in their workspaces" ON public.projects
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workspaces 
            WHERE workspaces.id = projects.workspace_id 
            AND workspaces.owner_id = auth.uid()
        )
    );

-- Documents policies
CREATE POLICY "Users can view documents they own or collaborate on" ON public.documents
    FOR SELECT USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.collaborators 
            WHERE collaborators.document_id = documents.id 
            AND collaborators.user_id = auth.uid()
            AND collaborators.is_active = true
        )
    );

CREATE POLICY "Users can update documents they own or have write access" ON public.documents
    FOR UPDATE USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.collaborators 
            WHERE collaborators.document_id = documents.id 
            AND collaborators.user_id = auth.uid()
            AND collaborators.permission_level IN ('write', 'admin')
            AND collaborators.is_active = true
        )
    );

CREATE POLICY "Users can insert documents" ON public.documents
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete documents they own" ON public.documents
    FOR DELETE USING (owner_id = auth.uid());

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON public.workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_comments_updated_at BEFORE UPDATE ON public.document_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create document version on update
CREATE OR REPLACE FUNCTION create_document_version()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.content IS DISTINCT FROM NEW.content OR OLD.title IS DISTINCT FROM NEW.title THEN
        INSERT INTO public.document_versions (
            document_id,
            version_number,
            title,
            content,
            created_by,
            change_summary
        ) VALUES (
            NEW.id,
            NEW.version + 1,
            NEW.title,
            NEW.content,
            NEW.owner_id,
            'Document updated'
        );
        
        NEW.version = NEW.version + 1;
        NEW.last_edited_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for document versioning
CREATE TRIGGER create_document_version_trigger BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION create_document_version(); 