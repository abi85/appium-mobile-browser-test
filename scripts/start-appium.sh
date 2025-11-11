#!/bin/bash

# Start Appium Server Script
# This script starts the Appium server with proper configuration

echo "🚀 Starting Appium Server..."

# Check if Appium is installed
if ! command -v appium &> /dev/null
then
    echo "❌ Appium is not installed. Please install it using:"
    echo "   npm install -g appium"
    exit 1
fi

# Check if required drivers are installed
echo "📦 Checking Appium drivers..."
appium driver list

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set default values if not in .env
APPIUM_HOST=${APPIUM_HOST:-127.0.0.1}
APPIUM_PORT=${APPIUM_PORT:-4723}

# Check if port is already in use
if lsof -Pi :$APPIUM_PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port $APPIUM_PORT is already in use"
    echo "Killing existing process..."
    lsof -ti:$APPIUM_PORT | xargs kill -9
    sleep 2
fi

# Start Appium server
echo "✅ Starting Appium on $APPIUM_HOST:$APPIUM_PORT"
appium --address $APPIUM_HOST --port $APPIUM_PORT --log-timestamp --log-no-colors

# If script is interrupted, clean up
trap "echo '🛑 Stopping Appium...'; exit" INT TERM

