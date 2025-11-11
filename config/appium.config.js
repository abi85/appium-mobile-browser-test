import dotenv from 'dotenv';

dotenv.config();

/**
 * Appium Server Configuration
 * Centralized configuration for Appium server connection
 */

export const appiumConfig = {
  host: process.env.APPIUM_HOST || '127.0.0.1',
  port: parseInt(process.env.APPIUM_PORT) || 4723,
  path: '/wd/hub',
  protocol: 'http',
  logLevel: 'info',
};

export const testConfig = {
  baseUrl: process.env.BASE_URL || 'https://www.wwgoa.com',
  loginPath: '/login',
  defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT) || 30000,
  implicitWait: parseInt(process.env.IMPLICIT_WAIT) || 10000,
  explicitWait: parseInt(process.env.EXPLICIT_WAIT) || 20000,
};

export const getAppiumUrl = () => {
  return `${appiumConfig.protocol}://${appiumConfig.host}:${appiumConfig.port}${appiumConfig.path}`;
};

