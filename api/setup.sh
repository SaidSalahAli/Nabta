#!/bin/bash

# Nabta Educational Platform API - Quick Start Script

echo "=========================================="
echo "Nabta Educational Platform - Setup"
echo "=========================================="

# Check if composer is installed
if ! command -v composer &> /dev/null; then
    echo "❌ Composer is not installed. Please install Composer first."
    exit 1
fi

echo "✓ Composer found"

# Change to API directory
cd "$(dirname "$0")" || exit

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
composer install

# Create .env file if not exists
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your database credentials"
fi

# Create necessary directories
echo ""
echo "📁 Creating directories..."
mkdir -p storage/logs
mkdir -p storage/uploads/media
mkdir -p storage/uploads/worksheets
mkdir -p storage/uploads/thumbnails
chmod -R 755 storage

echo ""
echo "✓ Setting permissions..."
chmod -R 755 public

# Database setup
echo ""
echo "🗄️  Database setup:"
echo "1. Import database/schema.sql into your MySQL database"
echo "2. Update database credentials in .env"

echo ""
echo "=========================================="
echo "✅ Setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Update .env with your configuration"
echo "2. Run: php -S localhost:8000 -t public/"
echo "3. API will be available at: http://localhost:8000/api/v1/"
echo ""
