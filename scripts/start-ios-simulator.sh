#!/bin/bash

# Start iOS Simulator Script
# This script starts the iOS simulator with the configured device

echo "📱 Starting iOS Simulator..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set default device if not in .env
IOS_DEVICE_NAME=${IOS_DEVICE_NAME:-"iPhone 15"}
IOS_PLATFORM_VERSION=${IOS_PLATFORM_VERSION:-"17.0"}

# Check if Xcode is installed
if ! command -v xcrun &> /dev/null
then
    echo "❌ Xcode is not installed. Please install Xcode from the App Store."
    exit 1
fi

# List available simulators
echo "📋 Available iOS Simulators:"
xcrun simctl list devices | grep -v "unavailable"

# Find the device ID
DEVICE_ID=$(xcrun simctl list devices | grep "$IOS_DEVICE_NAME" | grep -v "unavailable" | head -1 | grep -o '[0-9A-F]\{8\}-[0-9A-F]\{4\}-[0-9A-F]\{4\}-[0-9A-F]\{4\}-[0-9A-F]\{12\}')

if [ -z "$DEVICE_ID" ]; then
    echo "❌ Device '$IOS_DEVICE_NAME' not found"
    echo "Please update IOS_DEVICE_NAME in .env file"
    exit 1
fi

echo "✅ Found device: $IOS_DEVICE_NAME ($DEVICE_ID)"

# Boot the simulator if not already booted
DEVICE_STATE=$(xcrun simctl list devices | grep "$DEVICE_ID" | grep -o "Booted\|Shutdown")

if [ "$DEVICE_STATE" == "Shutdown" ]; then
    echo "🔄 Booting simulator..."
    xcrun simctl boot "$DEVICE_ID"
    sleep 5
else
    echo "✅ Simulator already booted"
fi

# Open Simulator app
echo "📱 Opening Simulator app..."
open -a Simulator

echo "✅ iOS Simulator started successfully!"
echo "Device: $IOS_DEVICE_NAME"
echo "ID: $DEVICE_ID"

