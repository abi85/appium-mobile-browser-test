import { remote } from 'webdriverio';
import { getCapabilities } from '../config/capabilities.js';
import { appiumConfig, testConfig } from '../config/appium.config.js';
import { TestLogger } from './logger.js';

/**
 * Driver Manager
 * Manages WebDriver instance lifecycle
 * Following Single Responsibility Principle - handles only driver management
 */

export class DriverManager {
  constructor() {
    this.driver = null;
    this.platform = process.env.PLATFORM || 'ios';
  }

  /**
   * Initialize and create WebDriver instance
   * @returns {Promise<Object>} WebDriver instance
   */
  async createDriver() {
    try {
      TestLogger.info(`Initializing driver for platform: ${this.platform}`);
      
      const capabilities = getCapabilities(this.platform);
      
      const options = {
        hostname: appiumConfig.host,
        port: appiumConfig.port,
        path: appiumConfig.path,
        logLevel: appiumConfig.logLevel,
        capabilities: capabilities,
        waitforTimeout: testConfig.explicitWait,
        connectionRetryTimeout: 120000,
        connectionRetryCount: 3,
      };

      this.driver = await remote(options);
      
      // Set implicit wait
      await this.driver.setTimeout({
        implicit: testConfig.implicitWait,
      });

      TestLogger.info('Driver initialized successfully');
      return this.driver;
    } catch (error) {
      TestLogger.error('Failed to initialize driver', error);
      throw error;
    }
  }

  /**
   * Get current driver instance
   * @returns {Object} WebDriver instance
   */
  getDriver() {
    if (!this.driver) {
      throw new Error('Driver not initialized. Call createDriver() first.');
    }
    return this.driver;
  }

  /**
   * Quit and cleanup driver instance
   */
  async quitDriver() {
    if (this.driver) {
      try {
        TestLogger.info('Quitting driver...');
        await this.driver.deleteSession();
        this.driver = null;
        TestLogger.info('Driver quit successfully');
      } catch (error) {
        TestLogger.error('Error while quitting driver', error);
        throw error;
      }
    }
  }

  /**
   * Take screenshot
   * @param {string} filename - Screenshot filename
   * @returns {Promise<string>} Screenshot path
   */
  async takeScreenshot(filename) {
    if (!this.driver) {
      throw new Error('Driver not initialized');
    }

    try {
      const screenshot = await this.driver.saveScreenshot(`./screenshots/${filename}.png`);
      TestLogger.screenshot(`./screenshots/${filename}.png`);
      return screenshot;
    } catch (error) {
      TestLogger.error('Failed to take screenshot', error);
      throw error;
    }
  }

  /**
   * Get platform name
   * @returns {string} Platform name
   */
  getPlatform() {
    return this.platform;
  }
}

export default DriverManager;

