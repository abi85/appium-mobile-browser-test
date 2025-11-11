import dotenv from 'dotenv';

dotenv.config();

/**
 * Appium Capabilities Configuration
 * Defines desired capabilities for iOS and Android platforms
 * Following Single Responsibility Principle - handles only capability configuration
 */

const commonCapabilities = {
  platformName: '',
  automationName: '',
  browserName: '',
  deviceName: '',
  platformVersion: '',
  newCommandTimeout: 300,
  noReset: false,
  fullReset: false,
  autoWebview: true,
  autoAcceptAlerts: true,
  autoDismissAlerts: false,
};

export const iosCapabilities = {
  ...commonCapabilities,
  platformName: 'iOS',
  automationName: 'XCUITest',
  browserName: process.env.IOS_BROWSER_NAME || 'Safari',
  deviceName: process.env.IOS_DEVICE_NAME || 'iPhone 15',
  platformVersion: process.env.IOS_PLATFORM_VERSION || '17.0',
  safariInitialUrl: 'about:blank',
  safariAllowPopups: true,
  safariOpenLinksInBackground: false,
  includeSafariInWebviews: true,
  webviewConnectTimeout: 30000,
};

export const androidCapabilities = {
  ...commonCapabilities,
  platformName: 'Android',
  automationName: 'UiAutomator2',
  browserName: process.env.ANDROID_BROWSER_NAME || 'Chrome',
  deviceName: process.env.ANDROID_DEVICE_NAME || 'Pixel 7',
  platformVersion: process.env.ANDROID_PLATFORM_VERSION || '13.0',
  chromedriverAutodownload: true,
  autoGrantPermissions: true,
  noSign: true,
};

/**
 * Get capabilities based on platform
 * @param {string} platform - 'ios' or 'android'
 * @returns {Object} Platform-specific capabilities
 */
export const getCapabilities = (platform) => {
  const platformLower = platform.toLowerCase();
  
  switch (platformLower) {
  case 'ios':
    return iosCapabilities;
  case 'android':
    return androidCapabilities;
  default:
    throw new Error(`Unsupported platform: ${platform}. Use 'ios' or 'android'`);
  }
};

