#!/bin/bash

# Start Android Emulator Script
# This script starts the Android emulator with the configured device

echo "🤖 Starting Android Emulator..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set default device if not in .env
ANDROID_DEVICE_NAME=${ANDROID_DEVICE_NAME:-"Pixel_7_API_33"}

# Check if Android SDK is installed
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME is not set"
    echo "Please set ANDROID_HOME in your environment:"
    echo "export ANDROID_HOME=\$HOME/Library/Android/sdk"
    exit 1
fi

# Check if emulator command exists
if ! command -v emulator &> /dev/null
then
    echo "❌ Android emulator not found"
    echo "Please install Android SDK and add to PATH:"
    echo "export PATH=\$PATH:\$ANDROID_HOME/emulator"
    exit 1
fi

# List available emulators
echo "📋 Available Android Emulators:"
emulator -list-avds

# Check if the specified emulator exists
if ! emulator -list-avds | grep -q "^${ANDROID_DEVICE_NAME}$"; then
    echo "❌ Emulator '$ANDROID_DEVICE_NAME' not found"
    echo "Available emulators:"
    emulator -list-avds
    echo ""
    echo "Please update ANDROID_DEVICE_NAME in .env file"
    exit 1
fi

# Check if emulator is already running
RUNNING_EMULATOR=$(adb devices | grep emulator | cut -f1)
if [ ! -z "$RUNNING_EMULATOR" ]; then
    echo "⚠️  An emulator is already running: $RUNNING_EMULATOR"
    read -p "Do you want to continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Start the emulator
echo "✅ Starting emulator: $ANDROID_DEVICE_NAME"
echo "This may take a few minutes..."

emulator -avd "$ANDROID_DEVICE_NAME" -no-snapshot-load &

# Wait for emulator to boot
echo "⏳ Waiting for emulator to boot..."
adb wait-for-device

echo "⏳ Waiting for boot to complete..."
adb shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done;'

echo "✅ Android Emulator started successfully!"
echo "Device: $ANDROID_DEVICE_NAME"

# Show device info
echo ""
echo "📱 Device Information:"
adb shell getprop ro.product.model
adb shell getprop ro.build.version.release

