# Gemini API Integration Setup Guide

## 🚀 Overview

This guide will help you integrate Google's Gemini API into your Origo application securely. The integration uses Supabase Edge Functions to keep your API key secure on the server-side.

## 📋 Prerequisites

1. **Google AI Studio Account**: Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/)
2. **Supabase Project**: Ensure your Supabase project is set up
3. **Supabase CLI**: Install for local development

## 🔑 Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key" in the top right
4. Create a new API key or use an existing one
5. **IMPORTANT**: Copy and save your API key securely

## 🔧 Step 2: Set Up Supabase Edge Functions

### Install Supabase CLI (if not already installed)
```bash
npm install -g supabase
```

### Login to Supabase
```bash
supabase login
```

### Link your project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### Set the Gemini API key in Supabase
```bash
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here
```

## 🏗️ Step 3: Deploy Edge Functions

### Deploy the Gemini API function
```bash
supabase functions deploy gemini-api
```

### Verify deployment
```bash
supabase functions list
```

## 🔒 Step 4: Security Configuration

### Environment Variables
Add these to your Supabase project dashboard under Settings > API:

- `GEMINI_API_KEY`: Your Gemini API key
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key

### API Key Restrictions (Recommended)
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Find your API key
3. Click "Edit" (pencil icon)
4. Add restrictions:
   - **Application restrictions**: HTTP referrers
   - **API restrictions**: Restrict to Gemini API only
   - **IP restrictions**: Add your server IPs

## 🧪 Step 5: Test the Integration

### Test the Edge Function locally
```bash
supabase functions serve gemini-api --env-file .env.local
```

### Test with curl
```bash
curl -X POST http://localhost:54321/functions/v1/gemini-api \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello, how are you?",
    "model": "gemini-1.5-flash",
    "maxTokens": 100
  }'
```

## 🎯 Step 6: Frontend Integration

The frontend is already configured to use the Gemini service. Key features include:

### Available AI Features
- **Writing Suggestions**: Get AI-powered writing improvement suggestions
- **Content Analysis**: Analyze tone, themes, and writing quality
- **Content Continuation**: AI continues your text naturally
- **Writing Improvement**: Enhance clarity and flow
- **Title Generation**: Generate engaging titles for your content

### Usage Examples

```javascript
// Get writing suggestions
const suggestions = await getWritingSuggestions(content, documentId);

// Analyze content
const analysis = await analyzeContent(content, documentId);

// Continue content
const continuation = await continueContent(content, documentId);

// Improve writing
const improved = await improveWriting(content, documentId);

// Generate titles
const titles = await generateTitles(content, documentId);
```

## 🔧 Step 7: Environment Configuration

### Local Development (.env.local)
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Production (Vercel)
Add these environment variables in your Vercel dashboard:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

## 🚨 Security Best Practices

### ✅ DO
- Keep API keys in environment variables
- Use server-side Edge Functions
- Implement rate limiting
- Add API key restrictions
- Monitor usage and costs
- Use HTTPS in production

### ❌ DON'T
- Never commit API keys to Git
- Never expose API keys in client-side code
- Don't hardcode API keys
- Don't share API keys publicly

## 📊 Monitoring & Analytics

### Track Usage
The Edge Function automatically logs AI usage to the `ai_analysis` table:
- Document ID
- Analysis type
- Prompt and response
- Timestamp

### Monitor Costs
- Set up billing alerts in Google AI Studio
- Monitor token usage
- Set usage limits

## 🔄 Troubleshooting

### Common Issues

1. **"Missing authorization header"**
   - Ensure user is authenticated
   - Check JWT token is valid

2. **"Gemini API key not configured"**
   - Verify `GEMINI_API_KEY` is set in Supabase
   - Check Edge Function deployment

3. **"Failed to generate content"**
   - Check API key restrictions
   - Verify prompt format
   - Check rate limits

### Debug Steps
1. Check Supabase logs: `supabase functions logs gemini-api`
2. Verify environment variables
3. Test with simple prompts first
4. Check network connectivity

## 🎉 Success Indicators

✅ Edge Function deployed successfully
✅ API key configured and restricted
✅ Frontend can call Gemini API
✅ Writing suggestions appear in editor
✅ Content analysis works
✅ No API keys exposed in client code

## 📚 Additional Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Google AI Studio](https://aistudio.google.com/)
- [Security Best Practices](https://ai.google.dev/docs/safety)

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase and Gemini API logs
3. Verify all environment variables are set
4. Test with minimal examples first

---

**Remember**: Keep your API keys secure and monitor usage to control costs! 🛡️ 