# Enhanced Document Backend Setup Guide

## Overview
This guide will help you set up a comprehensive backend for the Origo document management system. The backend includes support for:

- **Documents**: Core document storage with content, metadata, and status management
- **Sources**: Research sources with reliability scoring and metadata
- **Notes**: User notes and annotations
- **Research Results**: AI-powered research findings
- **Citations**: Academic citations with multiple style support
- **AI Analysis**: Document analysis results and suggestions
- **Chat Messages**: AI assistant conversation history
- **Document Settings**: User preferences and configuration

## Database Setup

### 1. Run the Database Schema

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the entire contents of `database_schema.sql`
4. Execute the script

This will create:
- 8 main tables with proper relationships
- Row Level Security (RLS) policies for data protection
- Indexes for optimal performance
- Triggers for automatic timestamp updates
- Custom functions for data retrieval

### 2. Verify the Setup

After running the schema, you should see:
- 8 tables: `documents`, `sources`, `notes`, `research_results`, `citations`, `ai_analysis`, `chat_messages`, `document_settings`
- Custom types: `document_status`, `source_type`, `citation_style`, `research_status`
- RLS policies enabled on all tables
- Indexes for performance optimization

## Frontend Integration

### 1. Updated Services

The `supabase.js` file now includes comprehensive services for all document features:

```javascript
// Available services:
- documentService: Core document CRUD operations
- sourceService: Source management
- noteService: Notes and annotations
- researchService: Research results
- citationService: Citation management
- aiAnalysisService: AI analysis storage
- chatService: Chat message history
- documentSettingsService: Document preferences
```

### 2. Enhanced Context

The `DocumentContext.js` now provides:

- **State Management**: Centralized state for all document data
- **CRUD Operations**: Complete CRUD for all document features
- **Real-time Updates**: Automatic state updates when data changes
- **Error Handling**: Comprehensive error handling and logging

### 3. Key Features

#### Document Management
```javascript
// Create a new document
const newDoc = await createDocument('My Document', 'Initial content')

// Update document content
await updateDocument(docId, { content: 'Updated content', title: 'New Title' })

// Archive/restore documents
await archiveDocument(docId)
await restoreDocument(docId)
```

#### Sources Management
```javascript
// Add a research source
await addSource(docId, {
  title: 'Research Paper Title',
  url: 'https://example.com',
  author: 'John Doe',
  source_type: 'article',
  reliability_score: 0.85
})

// Update source information
await updateSource(sourceId, { reliability_score: 0.9 })
```

#### Notes System
```javascript
// Add a note
await addNote(docId, 'Important research finding', 0)

// Update note content
await updateNote(noteId, { content: 'Updated note content' })
```

#### Research Integration
```javascript
// Store research results
await addResearchResults(docId, 'AI Ethics', 'artificial intelligence ethics', {
  sources: [...],
  summary: 'Research summary',
  key_findings: [...]
})
```

#### Citations
```javascript
// Add a citation
await addCitation(docId, sourceId, 'Doe, J. (2023). Research Paper. Journal.', 'APA')
```

#### AI Analysis
```javascript
// Store AI analysis results
await addAIAnalysis(docId, 'argument_strength', {
  score: 0.85,
  feedback: 'Strong argument structure'
}, 0.85, ['Consider adding more evidence'])
```

#### Chat History
```javascript
// Add chat messages
await addChatMessage(docId, 'User question', true)
await addChatMessage(docId, 'AI response', false, { model: 'gpt-4' })
```

## Implementation Steps

### 1. Database Setup
1. Run the database schema in Supabase SQL Editor
2. Verify all tables and policies are created
3. Test basic CRUD operations

### 2. Frontend Updates
1. The enhanced services are already included in `supabase.js`
2. The enhanced context is already included in `DocumentContext.js`
3. Update components to use the new features

### 3. Component Integration

#### Dashboard Updates
The Dashboard now shows enhanced document information:
- Word count and character count
- Source count
- AI analysis status
- Last edited timestamp

#### Editor Integration
The Editor can now:
- Save and load all document data
- Manage sources and citations
- Store research results
- Track AI analysis
- Maintain chat history

### 4. Testing

Test the following scenarios:

1. **Document Creation**
   - Create a new document
   - Verify settings are automatically created
   - Check word/character count updates

2. **Source Management**
   - Add sources to documents
   - Update source reliability scores
   - Delete sources

3. **Notes System**
   - Add notes to documents
   - Update note content
   - Delete notes

4. **Research Integration**
   - Store research results
   - Link research to sources
   - Update research status

5. **Citations**
   - Add citations to sources
   - Use different citation styles
   - Update citation text

6. **AI Analysis**
   - Store analysis results
   - Track analysis scores
   - Store suggestions

7. **Chat History**
   - Add user and AI messages
   - Store message metadata
   - Clear chat history

## Security Features

### Row Level Security (RLS)
All tables have RLS policies that ensure:
- Users can only access their own documents
- All related data (sources, notes, etc.) is protected
- Proper authentication is required for all operations

### Data Validation
- Input validation for all data types
- Constraint checking (e.g., reliability scores 0-1)
- Proper error handling and logging

## Performance Optimizations

### Indexes
- User ID indexes for fast document queries
- Status indexes for filtering
- Timestamp indexes for sorting
- Foreign key indexes for relationships

### Triggers
- Automatic timestamp updates
- Word/character count calculation
- Data integrity maintenance

## Monitoring and Maintenance

### Database Monitoring
- Monitor query performance
- Check index usage
- Review RLS policy effectiveness

### Error Handling
- Comprehensive error logging
- User-friendly error messages
- Graceful degradation

## Next Steps

1. **Implement the database schema** in your Supabase project
2. **Test the basic CRUD operations** to ensure everything works
3. **Update your components** to use the new enhanced features
4. **Add error handling** and loading states
5. **Implement real-time updates** if needed
6. **Add data validation** and user feedback
7. **Test all features** thoroughly before deployment

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Ensure user is authenticated
   - Check policy conditions
   - Verify user ID matches

2. **Foreign Key Errors**
   - Ensure referenced records exist
   - Check cascade delete settings
   - Verify data integrity

3. **Performance Issues**
   - Check index usage
   - Optimize queries
   - Monitor query execution plans

### Debug Tips

1. **Enable Supabase Logs**
   - Monitor SQL queries
   - Check authentication logs
   - Review error messages

2. **Test Incrementally**
   - Start with basic document CRUD
   - Add features one by one
   - Test each feature thoroughly

3. **Use Development Tools**
   - Supabase Dashboard for data inspection
   - Browser dev tools for network monitoring
   - Console logging for debugging

This enhanced backend provides a solid foundation for a comprehensive document management system with all the features needed for research, writing, and collaboration. 