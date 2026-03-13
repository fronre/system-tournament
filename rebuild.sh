#!/bin/bash

# Rebuild Script for esports-bracket-ar
echo "🔄 Starting rebuild process..."

# Clean up git history
echo "🧹 Cleaning up..."
rm -rf .git

# Initialize new repository
echo "📦 Initializing new repository..."
git init

# Add all files
echo "📝 Adding files..."
git add .

# Initial commit
echo "💾 Creating initial commit..."
git commit -m "🚀 Initial commit: Professional 2v2 Tournament Management System

✨ Features:
- Neon design with dark theme
- Interactive spinning wheel with Canvas
- Complete tournament bracket system
- Arabic interface
- Responsive design
- Winner animations and celebrations

🛠️ Tech: HTML5, CSS3, JavaScript, Canvas API
🌐 Live: https://fronre.github.io/esports-bracket-ar/"

# Add new remote
echo "🌐 Adding new remote..."
git remote add origin https://github.com/fronre/esports-bracket-ar.git

# Create gh-pages branch
echo "📄 Creating gh-pages branch..."
git checkout -b gh-pages

# Push to new repository
echo "🚀 Pushing to new repository..."
git push -u origin gh-pages

# Also push to main branch
echo "📋 Creating main branch..."
git checkout -b main
git push -u origin main

echo "✅ Rebuild complete!"
echo "🌍 New repository: https://github.com/fronre/esports-bracket-ar"
echo "🌐 Live site: https://fronre.github.io/esports-bracket-ar/"
