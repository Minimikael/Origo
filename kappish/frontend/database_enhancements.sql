-- Enhanced Database Schema for Origo App
-- Additional security, performance, and functionality improvements

-- =============================================
-- 1. ADDITIONAL SECURITY ENHANCEMENTS
-- =============================================

-- Add rate limiting table for API calls
CREATE TABLE IF NOT EXISTS api_rate_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add audit log table for security monitoring
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. PERFORMANCE OPTIMIZATIONS
-- =============================================

-- Add composite indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_user_status ON documents(user_id, status);
CREATE INDEX IF NOT EXISTS idx_documents_user_created ON documents(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_doc_type ON ai_analysis(document_id, analysis_type);
CREATE INDEX IF NOT EXISTS idx_chat_messages_doc_created ON chat_messages(document_id, created_at DESC);

-- Add partial indexes for active documents only
CREATE INDEX IF NOT EXISTS idx_documents_active_only ON documents(user_id, created_at DESC) 
WHERE status = 'active';

-- Add GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_ai_analysis_results_gin ON ai_analysis USING GIN (results);
CREATE INDEX IF NOT EXISTS idx_chat_messages_metadata_gin ON chat_messages USING GIN (metadata);

-- =============================================
-- 3. MISSING RLS POLICIES
-- =============================================

-- Rate limiting policies
CREATE POLICY "Users can view their own rate limits" ON api_rate_limits
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own rate limits" ON api_rate_limits
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own rate limits" ON api_rate_limits
    FOR UPDATE USING (user_id = auth.uid());

-- Audit log policies (users can only see their own audit logs)
CREATE POLICY "Users can view their own audit logs" ON audit_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- =============================================
-- 4. ADDITIONAL FUNCTIONS FOR SECURITY
-- =============================================

-- Function to clean up old rate limit records
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM api_rate_limits 
    WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    p_user_id UUID,
    p_action TEXT,
    p_table_name TEXT,
    p_record_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO audit_logs (
        user_id, 
        action, 
        table_name, 
        record_id, 
        old_values, 
        new_values
    ) VALUES (
        p_user_id,
        p_action,
        p_table_name,
        p_record_id,
        p_old_values,
        p_new_values
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 5. ENHANCED TRIGGERS FOR AUDIT LOGGING
-- =============================================

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM log_audit_event(
            NEW.user_id,
            'INSERT',
            TG_TABLE_NAME,
            NEW.id,
            NULL,
            to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM log_audit_event(
            NEW.user_id,
            'UPDATE',
            TG_TABLE_NAME,
            NEW.id,
            to_jsonb(OLD),
            to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM log_audit_event(
            OLD.user_id,
            'DELETE',
            TG_TABLE_NAME,
            OLD.id,
            to_jsonb(OLD),
            NULL
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to critical tables
CREATE TRIGGER audit_documents_trigger
    AFTER INSERT OR UPDATE OR DELETE ON documents
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_ai_analysis_trigger
    AFTER INSERT OR UPDATE OR DELETE ON ai_analysis
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- =============================================
-- 6. ADDITIONAL UTILITY FUNCTIONS
-- =============================================

-- Function to get user's document statistics
CREATE OR REPLACE FUNCTION get_user_document_stats(p_user_id UUID)
RETURNS TABLE (
    total_documents BIGINT,
    active_documents BIGINT,
    archived_documents BIGINT,
    total_words BIGINT,
    total_characters BIGINT,
    last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_documents,
        COUNT(*) FILTER (WHERE status = 'active')::BIGINT as active_documents,
        COUNT(*) FILTER (WHERE status = 'archived')::BIGINT as archived_documents,
        COALESCE(SUM(word_count), 0)::BIGINT as total_words,
        COALESCE(SUM(character_count), 0)::BIGINT as total_characters,
        MAX(updated_at) as last_activity
    FROM documents 
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has exceeded rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_user_id UUID,
    p_endpoint TEXT,
    p_max_requests INTEGER DEFAULT 100,
    p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
    current_count INTEGER;
BEGIN
    -- Clean up old records first
    PERFORM cleanup_old_rate_limits();
    
    -- Get current count for this user and endpoint
    SELECT COALESCE(SUM(request_count), 0) INTO current_count
    FROM api_rate_limits
    WHERE user_id = p_user_id 
    AND endpoint = p_endpoint
    AND window_start > NOW() - INTERVAL '1 minute' * p_window_minutes;
    
    -- If under limit, increment counter
    IF current_count < p_max_requests THEN
        INSERT INTO api_rate_limits (user_id, endpoint, request_count)
        VALUES (p_user_id, p_endpoint, 1)
        ON CONFLICT (user_id, endpoint, window_start)
        DO UPDATE SET request_count = api_rate_limits.request_count + 1;
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 7. ADDITIONAL CONSTRAINTS FOR DATA INTEGRITY
-- =============================================

-- Add check constraints for data validation
ALTER TABLE documents ADD CONSTRAINT check_title_length 
    CHECK (LENGTH(title) >= 1 AND LENGTH(title) <= 200);

ALTER TABLE documents ADD CONSTRAINT check_content_length 
    CHECK (LENGTH(content) <= 1000000); -- 1MB max

ALTER TABLE sources ADD CONSTRAINT check_url_format 
    CHECK (url IS NULL OR url ~ '^https?://');

ALTER TABLE ai_analysis ADD CONSTRAINT check_score_range 
    CHECK (score IS NULL OR (score >= 0 AND score <= 1));

-- =============================================
-- 8. SCHEDULED CLEANUP TASKS
-- =============================================

-- Create a function to clean up old audit logs (keep last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM audit_logs 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 9. ADDITIONAL INDEXES FOR BETTER PERFORMANCE
-- =============================================

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_documents_search ON documents USING GIN (to_tsvector('english', title || ' ' || content));
CREATE INDEX IF NOT EXISTS idx_sources_search ON sources USING GIN (to_tsvector('english', title || ' ' || COALESCE(author, '')));
CREATE INDEX IF NOT EXISTS idx_notes_search ON notes USING GIN (to_tsvector('english', content));

-- Add indexes for time-based queries
CREATE INDEX IF NOT EXISTS idx_documents_updated_at ON documents(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_created_at ON ai_analysis(created_at DESC);

-- =============================================
-- 10. GRANTS AND PERMISSIONS
-- =============================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated; 