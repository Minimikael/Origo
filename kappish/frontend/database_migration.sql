-- Migration script to upgrade existing Origo database to comprehensive backend
-- This script safely upgrades your existing documents table and adds new features

-- Step 1: Create custom types (if they don't exist)
DO $$ BEGIN
    CREATE TYPE document_status AS ENUM ('active', 'archived', 'deleted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE source_type AS ENUM ('website', 'book', 'article', 'video', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE citation_style AS ENUM ('APA', 'MLA', 'Chicago', 'Harvard', 'Vancouver');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE research_status AS ENUM ('pending', 'in_progress', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Upgrade existing documents table
-- Add new columns to existing documents table
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS character_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update status column to use the new enum type
-- First, ensure all existing status values are valid for the enum
UPDATE documents SET status = 'active' WHERE status NOT IN ('active', 'archived', 'deleted');

-- Drop the default constraint first
ALTER TABLE documents ALTER COLUMN status DROP DEFAULT;

-- Now safely convert the column type
ALTER TABLE documents 
ALTER COLUMN status TYPE document_status USING status::document_status;

-- Add the default back with the correct type
ALTER TABLE documents ALTER COLUMN status SET DEFAULT 'active'::document_status;

-- Step 3: Create new tables

-- Sources table
CREATE TABLE IF NOT EXISTS sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT,
    author TEXT,
    publication_date DATE,
    source_type source_type DEFAULT 'website',
    reliability_score DECIMAL(3,2) CHECK (reliability_score >= 0 AND reliability_score <= 1),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research results table
CREATE TABLE IF NOT EXISTS research_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    query TEXT NOT NULL,
    results JSONB,
    status research_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Citations table
CREATE TABLE IF NOT EXISTS citations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
    citation_text TEXT NOT NULL,
    citation_style citation_style DEFAULT 'APA',
    position_in_text INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Analysis table
CREATE TABLE IF NOT EXISTS ai_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    analysis_type TEXT NOT NULL,
    results JSONB,
    score DECIMAL(3,2),
    suggestions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_user_message BOOLEAN DEFAULT true,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document settings table
CREATE TABLE IF NOT EXISTS document_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE UNIQUE,
    auto_save BOOLEAN DEFAULT true,
    citation_style citation_style DEFAULT 'APA',
    word_count_goal INTEGER,
    theme TEXT DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_sources_document_id ON sources(document_id);
CREATE INDEX IF NOT EXISTS idx_notes_document_id ON notes(document_id);
CREATE INDEX IF NOT EXISTS idx_research_results_document_id ON research_results(document_id);
CREATE INDEX IF NOT EXISTS idx_citations_document_id ON citations(document_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_document_id ON ai_analysis(document_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_document_id ON chat_messages(document_id);

-- Step 5: Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 6: Create triggers for updated_at
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sources_updated_at ON sources;
CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_research_results_updated_at ON research_results;
CREATE TRIGGER update_research_results_updated_at BEFORE UPDATE ON research_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_analysis_updated_at ON ai_analysis;
CREATE TRIGGER update_ai_analysis_updated_at BEFORE UPDATE ON ai_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_document_settings_updated_at ON document_settings;
CREATE TRIGGER update_document_settings_updated_at BEFORE UPDATE ON document_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Enable RLS on new tables
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_settings ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS policies for new tables

-- Sources policies
DROP POLICY IF EXISTS "Users can view sources for their documents" ON sources;
CREATE POLICY "Users can view sources for their documents" ON sources
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = sources.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert sources for their documents" ON sources;
CREATE POLICY "Users can insert sources for their documents" ON sources
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = sources.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update sources for their documents" ON sources;
CREATE POLICY "Users can update sources for their documents" ON sources
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = sources.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete sources for their documents" ON sources;
CREATE POLICY "Users can delete sources for their documents" ON sources
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = sources.document_id 
            AND documents.user_id = auth.uid()
        )
    );

-- Notes policies
DROP POLICY IF EXISTS "Users can view notes for their documents" ON notes;
CREATE POLICY "Users can view notes for their documents" ON notes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = notes.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert notes for their documents" ON notes;
CREATE POLICY "Users can insert notes for their documents" ON notes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = notes.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update notes for their documents" ON notes;
CREATE POLICY "Users can update notes for their documents" ON notes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = notes.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete notes for their documents" ON notes;
CREATE POLICY "Users can delete notes for their documents" ON notes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = notes.document_id 
            AND documents.user_id = auth.uid()
        )
    );

-- Research results policies
DROP POLICY IF EXISTS "Users can view research for their documents" ON research_results;
CREATE POLICY "Users can view research for their documents" ON research_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = research_results.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert research for their documents" ON research_results;
CREATE POLICY "Users can insert research for their documents" ON research_results
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = research_results.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update research for their documents" ON research_results;
CREATE POLICY "Users can update research for their documents" ON research_results
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = research_results.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete research for their documents" ON research_results;
CREATE POLICY "Users can delete research for their documents" ON research_results
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = research_results.document_id 
            AND documents.user_id = auth.uid()
        )
    );

-- Citations policies
DROP POLICY IF EXISTS "Users can view citations for their documents" ON citations;
CREATE POLICY "Users can view citations for their documents" ON citations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = citations.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert citations for their documents" ON citations;
CREATE POLICY "Users can insert citations for their documents" ON citations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = citations.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update citations for their documents" ON citations;
CREATE POLICY "Users can update citations for their documents" ON citations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = citations.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete citations for their documents" ON citations;
CREATE POLICY "Users can delete citations for their documents" ON citations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = citations.document_id 
            AND documents.user_id = auth.uid()
        )
    );

-- AI Analysis policies
DROP POLICY IF EXISTS "Users can view AI analysis for their documents" ON ai_analysis;
CREATE POLICY "Users can view AI analysis for their documents" ON ai_analysis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = ai_analysis.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert AI analysis for their documents" ON ai_analysis;
CREATE POLICY "Users can insert AI analysis for their documents" ON ai_analysis
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = ai_analysis.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update AI analysis for their documents" ON ai_analysis;
CREATE POLICY "Users can update AI analysis for their documents" ON ai_analysis
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = ai_analysis.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete AI analysis for their documents" ON ai_analysis;
CREATE POLICY "Users can delete AI analysis for their documents" ON ai_analysis
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = ai_analysis.document_id 
            AND documents.user_id = auth.uid()
        )
    );

-- Chat messages policies
DROP POLICY IF EXISTS "Users can view chat messages for their documents" ON chat_messages;
CREATE POLICY "Users can view chat messages for their documents" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = chat_messages.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert chat messages for their documents" ON chat_messages;
CREATE POLICY "Users can insert chat messages for their documents" ON chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = chat_messages.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update chat messages for their documents" ON chat_messages;
CREATE POLICY "Users can update chat messages for their documents" ON chat_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = chat_messages.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete chat messages for their documents" ON chat_messages;
CREATE POLICY "Users can delete chat messages for their documents" ON chat_messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = chat_messages.document_id 
            AND documents.user_id = auth.uid()
        )
    );

-- Document settings policies
DROP POLICY IF EXISTS "Users can view settings for their documents" ON document_settings;
CREATE POLICY "Users can view settings for their documents" ON document_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = document_settings.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert settings for their documents" ON document_settings;
CREATE POLICY "Users can insert settings for their documents" ON document_settings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = document_settings.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update settings for their documents" ON document_settings;
CREATE POLICY "Users can update settings for their documents" ON document_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = document_settings.document_id 
            AND documents.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete settings for their documents" ON document_settings;
CREATE POLICY "Users can delete settings for their documents" ON document_settings
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = document_settings.document_id 
            AND documents.user_id = auth.uid()
        )
    );

-- Step 9: Create function to update word and character counts
CREATE OR REPLACE FUNCTION update_document_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update word count (simple word counting)
    NEW.word_count = array_length(regexp_split_to_array(NEW.content, '\s+'), 1);
    
    -- Update character count
    NEW.character_count = length(NEW.content);
    
    -- Update last_edited_at
    NEW.last_edited_at = NOW();
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for document counts
DROP TRIGGER IF EXISTS update_document_counts_trigger ON documents;
CREATE TRIGGER update_document_counts_trigger
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_document_counts();

-- Step 10: Create function to get document with all related data
CREATE OR REPLACE FUNCTION get_document_with_data(doc_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'document', d,
        'sources', COALESCE(sources_data, '[]'::json),
        'notes', COALESCE(notes_data, '[]'::json),
        'research_results', COALESCE(research_data, '[]'::json),
        'citations', COALESCE(citations_data, '[]'::json),
        'ai_analysis', COALESCE(ai_data, '[]'::json),
        'chat_messages', COALESCE(chat_data, '[]'::json),
        'settings', COALESCE(settings_data, '{}'::json)
    ) INTO result
    FROM documents d
    LEFT JOIN (
        SELECT document_id, json_agg(s.*) as sources_data
        FROM sources s
        WHERE s.document_id = doc_id
        GROUP BY document_id
    ) s ON d.id = s.document_id
    LEFT JOIN (
        SELECT document_id, json_agg(n.*) as notes_data
        FROM notes n
        WHERE n.document_id = doc_id
        GROUP BY document_id
    ) n ON d.id = n.document_id
    LEFT JOIN (
        SELECT document_id, json_agg(r.*) as research_data
        FROM research_results r
        WHERE r.document_id = doc_id
        GROUP BY document_id
    ) r ON d.id = r.document_id
    LEFT JOIN (
        SELECT document_id, json_agg(c.*) as citations_data
        FROM citations c
        WHERE c.document_id = doc_id
        GROUP BY document_id
    ) c ON d.id = c.document_id
    LEFT JOIN (
        SELECT document_id, json_agg(a.*) as ai_data
        FROM ai_analysis a
        WHERE a.document_id = doc_id
        GROUP BY document_id
    ) a ON d.id = a.document_id
    LEFT JOIN (
        SELECT document_id, json_agg(cm.*) as chat_data
        FROM chat_messages cm
        WHERE cm.document_id = doc_id
        GROUP BY document_id
    ) cm ON d.id = cm.document_id
    LEFT JOIN (
        SELECT document_id, json_agg(ds.*) as settings_data
        FROM document_settings ds
        WHERE ds.document_id = doc_id
        GROUP BY document_id
    ) ds ON d.id = ds.document_id
    WHERE d.id = doc_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Step 11: Update existing documents to have proper word/character counts
UPDATE documents 
SET 
    word_count = array_length(regexp_split_to_array(content, '\s+'), 1),
    character_count = length(content),
    last_edited_at = updated_at
WHERE word_count = 0 OR character_count = 0;

-- Migration complete!
-- Your database now has all the comprehensive features while preserving existing data 