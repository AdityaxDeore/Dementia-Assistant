#!/bin/bash

# Clarity Setup Script
echo "🚀 Setting up Clarity - StudentMindscape Mental Health Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18 or higher) and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION detected. Please upgrade to Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔧 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created with default SQLite configuration"
else
    echo "✅ .env file already exists"
fi

# Test TypeScript compilation
echo "🔍 Checking TypeScript compilation..."
npm run check

echo ""
echo "🎉 Setup complete! You can now run:"
echo ""
echo "  npm run dev    # Start development server"
echo "  npm run build  # Build for production"
echo "  npm start      # Start production server (after build)"
echo ""
echo "The app will be available at http://localhost:5000"
echo ""
echo "📚 For more information, see README.md"