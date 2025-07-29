#!/bin/bash

# =============================================================================
# GITHUB SETUP SCRIPT FOR ORIGO
# =============================================================================

echo "🚀 Setting up GitHub repository for Origo..."

# Check if we're in the right directory
if [ ! -f "kappish/README.md" ]; then
    echo "❌ Error: Please run this script from the Origo root directory"
    exit 1
fi

echo "📋 Current status:"
git status --porcelain

echo ""
echo "🔗 To connect to GitHub, please:"
echo "1. Create a new repository at https://github.com/new"
echo "2. Name it 'origo' or 'origo-document-editor'"
echo "3. Make it public or private (your choice)"
echo "4. DO NOT initialize with README (we already have one)"
echo "5. Copy the repository URL"
echo ""
echo "📝 Then run these commands with your repository URL:"
echo ""
echo "git remote add origin https://github.com/YOUR_USERNAME/origo.git"
echo "git push -u origin main"
echo ""
echo "🎯 Or run this script with your repository URL:"
echo "./kappish/setup-github.sh https://github.com/YOUR_USERNAME/origo.git"
echo ""

# If repository URL is provided as argument
if [ ! -z "$1" ]; then
    echo "🔗 Adding remote origin: $1"
    git remote add origin "$1"
    
    echo "🚀 Pushing to GitHub..."
    git push -u origin main
    
    echo "✅ Success! Your repository is now on GitHub."
    echo "🌐 Visit your repository at: $1"
else
    echo "💡 Tip: You can also run this script with your repository URL:"
    echo "./kappish/setup-github.sh https://github.com/YOUR_USERNAME/origo.git"
fi

echo ""
echo "📚 Next steps:"
echo "1. Set up GitHub Pages (optional)"
echo "2. Configure branch protection rules"
echo "3. Set up GitHub Actions for CI/CD"
echo "4. Add collaborators if needed"
echo ""
echo "🎉 Happy coding!" 