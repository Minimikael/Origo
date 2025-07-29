# 🚀 Deployment Guide for Origo

## 📋 Overview

This guide covers deploying your Origo application to various platforms including Vercel, Netlify, and Railway.

## 🎯 Vercel Deployment (Recommended)

### Prerequisites
- GitHub repository published
- Vercel account ([vercel.com](https://vercel.com))
- Environment variables ready

### Step 1: Connect to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in with GitHub

2. **Import Repository**
   - Click "New Project"
   - Select your `origo` repository
   - Vercel will auto-detect it's a React app

### Step 2: Configure Build Settings

**Framework Preset**: `Create React App`
**Root Directory**: `kappish/frontend`
**Build Command**: `npm run build`
**Output Directory**: `build`
**Install Command**: `npm install`

### Step 3: Set Environment Variables

In Vercel dashboard, add these environment variables:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://qfbqdirbaslzsdjcxzss.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# Firebase Configuration (if using)
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id

# API Configuration
REACT_APP_API_URL=https://your-backend-url.railway.app

# AI Configuration
REACT_APP_OPENAI_API_KEY=your-openai-api-key
```

### Step 4: Deploy

1. **Click "Deploy"**
2. **Wait for build** (2-3 minutes)
3. **Test the deployment**

### Step 5: Custom Domain (Optional)

1. **Go to Project Settings**
2. **Click "Domains"**
3. **Add your custom domain**
4. **Configure DNS records**

## 🌐 Netlify Deployment

### Step 1: Connect to Netlify

1. **Go to Netlify Dashboard**
2. **Click "New site from Git"**
3. **Connect to GitHub**
4. **Select your repository**

### Step 2: Configure Build Settings

**Base directory**: `kappish/frontend`
**Build command**: `npm run build`
**Publish directory**: `build`

### Step 3: Set Environment Variables

Add the same environment variables as Vercel.

## 🚂 Railway Deployment (Backend)

### Step 1: Deploy Backend

1. **Go to Railway Dashboard**
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Select your repository**
5. **Set root directory to**: `kappish/backend`

### Step 2: Configure Environment Variables

```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app

# Supabase
SUPABASE_URL=https://qfbqdirbaslzsdjcxzss.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Firebase Admin (if using)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
```

### Step 3: Deploy

1. **Click "Deploy"**
2. **Wait for deployment**
3. **Copy the generated URL**

## 🔧 Environment Setup

### Development vs Production

**Development**:
- Uses local environment variables
- Runs on `localhost:3000`
- Connects to local backend

**Production**:
- Uses Vercel/Netlify environment variables
- Runs on your domain
- Connects to Railway backend

### Environment Variables Checklist

- [ ] `REACT_APP_SUPABASE_URL`
- [ ] `REACT_APP_SUPABASE_ANON_KEY`
- [ ] `REACT_APP_FIREBASE_API_KEY` (if using Firebase)
- [ ] `REACT_APP_API_URL` (production backend URL)
- [ ] `REACT_APP_OPENAI_API_KEY`

## 🧪 Testing Deployment

### Pre-Deployment Checklist

- [ ] App runs locally (`npm start`)
- [ ] Build succeeds (`npm run build`)
- [ ] All environment variables set
- [ ] Supabase database configured
- [ ] Backend deployed (if applicable)

### Post-Deployment Testing

1. **Visit your deployed URL**
2. **Test authentication**
3. **Test document creation**
4. **Test real-time features**
5. **Check console for errors**

## 🔍 Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Check build locally
   cd kappish/frontend
   npm run build
   ```

2. **Environment Variables Missing**
   - Verify all variables are set in Vercel
   - Check variable names (must start with `REACT_APP_`)

3. **API Connection Errors**
   - Verify backend is deployed
   - Check CORS settings
   - Verify API URL is correct

4. **Supabase Connection Issues**
   - Verify Supabase project is active
   - Check RLS policies
   - Test connection at `/supabase-test`

### Debug Commands

```bash
# Test build locally
cd kappish/frontend
npm run build

# Check environment variables
echo $REACT_APP_SUPABASE_URL

# Test API connection
curl https://your-api-url.railway.app/health
```

## 📊 Performance Optimization

### Vercel Optimizations

- **Automatic HTTPS**
- **Global CDN**
- **Edge Functions** (if needed)
- **Automatic deployments** on Git push

### Build Optimizations

- **Code splitting** (already configured)
- **Tree shaking** (enabled by default)
- **Gzip compression** (automatic)
- **Image optimization** (can be added)

## 🔐 Security Considerations

### Production Security

- **HTTPS only** (automatic with Vercel)
- **Environment variables** (never in code)
- **CORS configuration** (backend)
- **Rate limiting** (backend)
- **Input validation** (both frontend and backend)

### Environment Variables Security

- ✅ Never commit `.env` files
- ✅ Use different keys for dev/prod
- ✅ Rotate keys regularly
- ✅ Use Vercel's environment variable encryption

## 📈 Monitoring

### Vercel Analytics

1. **Enable Vercel Analytics**
2. **Monitor performance**
3. **Track user behavior**
4. **Set up alerts**

### Error Tracking

Consider adding:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Google Analytics** for insights

## 🚀 Continuous Deployment

### Automatic Deployments

- **Push to main** → Automatic deployment
- **Preview deployments** for pull requests
- **Rollback** to previous versions

### Deployment Strategy

1. **Development**: Local development
2. **Staging**: Preview deployments
3. **Production**: Main branch deployments

---

**🎯 Your Origo app is now ready for production deployment!** 