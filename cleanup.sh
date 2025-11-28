#!/bin/bash
# Cleanup script before GitHub upload

echo "Cleaning up temporary files..."

# Backend cleanup
rm -rf backend/venv
rm -rf backend/__pycache__
rm -rf backend/app/__pycache__
rm -rf backend/app/*/__pycache__
rm -f backend/.env

# Frontend cleanup  
rm -rf frontend/node_modules
rm -rf frontend/dist
rm -f frontend/.env

# System files
find . -name ".DS_Store" -delete
find . -name "Thumbs.db" -delete
find . -name "*.pyc" -delete
find . -name "__pycache__" -type d -delete

echo "Cleanup complete!"
echo ""
echo "Safe to upload to GitHub. Files preserved:"
echo "  ✓ backend/.env.example"
echo "  ✓ frontend/.env.example"
echo "  ✓ .gitignore"
echo "  ✓ All source code"
