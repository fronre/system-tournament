#!/bin/bash

# Deployment Script for Tournament System
echo "🚀 Starting deployment..."

# Check if we're on the right branch
if [ "$(git branch --show-current)" != "gh-pages" ]; then
    echo "📦 Switching to gh-pages branch..."
    git checkout gh-pages
fi

# Add all changes
echo "📝 Adding files..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Auto-deploy: $(date)"

# Push to GitHub
echo "🌐 Pushing to GitHub..."
git push origin gh-pages

echo "✅ Deployment complete!"
echo "🌍 Your site will be live at: https://fronre.github.io/system-tournament-ar/"
