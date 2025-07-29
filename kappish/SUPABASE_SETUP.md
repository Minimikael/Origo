# 🚀 Supabase Setup for Origo

## 📋 Overview

This guide will help you set up Supabase as the backend for your Origo project. Supabase provides a powerful PostgreSQL database, real-time subscriptions, authentication, and edge functions.

## 🎯 What We're Setting Up

- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Email/password + OAuth providers
- **Real-time**: Live document collaboration
- **Storage**: File uploads and document attachments
- **Edge Functions**: Serverless functions for AI processing

## 📦 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Node.js**: Version 16 or higher
3. **Git**: For version control

## 🛠️ Step-by-Step Setup

### Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Sign in or create an account

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Enter project details:
     - **Name**: `origo-document-editor`
     - **Database Password**: Generate a strong password
     - **Region**: Choose closest to your users
     - **Pricing Plan**: Start with Free tier

3. **Wait for Setup**
   - Project creation takes 1-2 minutes
   - You'll receive an email when ready

### Step 2: Get Project Credentials

1. **Navigate to Settings**
   - Go to Project Settings → API
   - Copy the following values:

```bash
# Project URL
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co

# Anon Key (Public)
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here

# Service Role Key (Keep Secret!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 3: Set Up Environment Variables

1. **Create `.env` file**
   ```bash
   cd kappish/frontend
   cp env.example .env
   ```

2. **Update `.env` with your credentials**
   ```env
   # Supabase Configuration
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   
   # Keep existing Firebase config
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=your-app-id
   
   # API Configuration
   REACT_APP_API_URL=http://localhost:5000
   
   # AI Configuration
   REACT_APP_OPENAI_API_KEY=your-openai-api-key
   ```

### Step 4: Set Up Database Schema

1. **Open Supabase SQL Editor**
   - Go to SQL Editor in your Supabase dashboard
   - Create a new query

2. **Run the Schema**
   - Copy the contents of `kappish/supabase/schema.sql`
   - Paste into the SQL editor
   - Click "Run" to execute

3. **Verify Tables Created**
   - Go to Table Editor
   - You should see these tables:
     - `users`
     - `workspaces`
     - `projects`
     - `documents`
     - `document_versions`
     - `collaborators`
     - `ai_analysis`
     - `document_comments`

### Step 5: Configure Authentication

1. **Set Up Auth Providers**
   - Go to Authentication → Settings
   - Configure email templates
   - Set up OAuth providers (Google, GitHub, etc.)

2. **Configure Redirect URLs**
   - Add your local development URL:
     ```
     http://localhost:3000/auth/callback
     http://localhost:3000/auth/reset-password
     ```

3. **Set Up Row Level Security**
   - The schema already includes RLS policies
   - Verify they're working in Table Editor

### Step 6: Test the Setup

1. **Start Development Server**
   ```bash
   cd kappish/frontend
   npm start
   ```

2. **Test Authentication**
   - Go to `http://localhost:3000/auth`
   - Try signing up with email/password
   - Verify user is created in Supabase

3. **Test Database Operations**
   - Create a document
   - Check if it appears in Supabase dashboard
   - Test real-time subscriptions

## 🔧 Advanced Configuration

### Real-time Subscriptions

The app includes real-time subscriptions for:
- Document changes
- Collaborator updates
- AI analysis results

### Storage Setup

1. **Create Storage Buckets**
   ```sql
   -- Create buckets for different file types
   INSERT INTO storage.buckets (id, name, public) VALUES
   ('documents', 'documents', true),
   ('avatars', 'avatars', true),
   ('attachments', 'attachments', true);
   ```

2. **Set Storage Policies**
   ```sql
   -- Allow users to upload to their own folders
   CREATE POLICY "Users can upload documents" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

### Edge Functions

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Initialize Supabase**
   ```bash
   supabase init
   ```

3. **Create Edge Functions**
   ```bash
   supabase functions new ai-analysis
   supabase functions new document-processing
   ```

## 🚨 Security Considerations

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use different keys for development/production
- ✅ Rotate keys regularly

### Row Level Security
- ✅ All tables have RLS enabled
- ✅ Policies restrict access appropriately
- ✅ Test policies thoroughly

### API Security
- ✅ Use service role key only on server
- ✅ Validate all inputs
- ✅ Implement rate limiting

## 🔍 Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check `.env` file exists
   - Verify variable names are correct
   - Restart development server

2. **"RLS policy violation"**
   - Check user authentication
   - Verify policy conditions
   - Test with different user roles

3. **"Real-time not working"**
   - Check network connectivity
   - Verify channel subscriptions
   - Check browser console for errors

### Debug Commands

```bash
# Check Supabase connection
curl -X GET "https://your-project.supabase.co/rest/v1/" \
  -H "apikey: your-anon-key"

# Test authentication
curl -X POST "https://your-project.supabase.co/auth/v1/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📚 Next Steps

1. **Integrate with Frontend**
   - Update AuthContext to use Supabase
   - Replace Firebase with Supabase services
   - Test all CRUD operations

2. **Add Real-time Features**
   - Implement live collaboration
   - Add presence indicators
   - Sync document changes

3. **Deploy to Production**
   - Set up production environment
   - Configure custom domain
   - Set up monitoring

## 📞 Support

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Discord Community**: [supabase.com/discord](https://supabase.com/discord)
- **GitHub Issues**: [github.com/supabase/supabase](https://github.com/supabase/supabase)

## 🎉 Success Checklist

- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Authentication working
- [ ] Real-time subscriptions tested
- [ ] Storage buckets created
- [ ] Security policies verified
- [ ] Frontend integration complete

---

**🎯 You're now ready to build amazing features with Supabase!** 