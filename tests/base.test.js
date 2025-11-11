import { DriverManager } from '../utils/driver-manager.js';
import { TestLogger } from '../utils/logger.js';
import { LoginPage } from '../pages/login.page.js';
import { HomePage } from '../pages/home.page.js';

/**
 * Base Test Class
 * Provides common setup, teardown, and utilities for all tests
 */
export class BaseTest {
  constructor() {
    this.driverManager = null;
    this.driver = null;
    this.loginPage = null;
    this.homePage = null;
  }

  /**
   * Setup before each test
   * Initializes driver and page objects
   */
  async setup() {
    await this.executeWithLogging('SETUP', async () => {
      this.driverManager = new DriverManager();
      this.driver = await this.driverManager.createDriver();
      this.initializePageObjects();
    });
  }

  /**
   * Teardown after each test
   * Cleans up driver and resources
   */
  async teardown() {
    try {
      TestLogger.info('========== TEST TEARDOWN STARTED ==========');
      
      if (this.driverManager) {
        await this.driverManager.quitDriver();
      }
      
      TestLogger.info('========== TEST TEARDOWN COMPLETED ==========');
    } catch (error) {
      TestLogger.error('Test teardown failed', error);
      // Don't throw - allow other tests to continue
    }
  }

  /**
   * Take screenshot with standardized naming
   * @param {string} testName - Test identifier
   * @param {string} suffix - Optional description suffix
   */
  async takeScreenshot(testName, suffix = '') {
    try {
      const filename = this.generateScreenshotFilename(testName, suffix);
      await this.driverManager.takeScreenshot(filename);
    } catch (error) {
      TestLogger.error('Failed to take screenshot', error);
    }
  }

  /**
   * Handle test failure with screenshot and logging
   * @param {string} testName - Test identifier
   * @param {Error} error - Error that caused failure
   */
  async handleTestFailure(testName, error) {
    TestLogger.error(`Test failed: ${testName}`, error);
    await this.takeScreenshot(testName, 'failure');
  }

  /**
   * Get shared context for test data access
   * Useful for accessing shared state across tests
   */
  get context() {
    return {
      driver: this.driver,
      loginPage: this.loginPage,
      homePage: this.homePage
    };
  }

  // Private Helper Methods

  /**
   * Initialize all page objects
   * @private
   */
  initializePageObjects() {
    this.loginPage = new LoginPage(this.driver);
    this.homePage = new HomePage(this.driver);
  }

  /**
   * Execute operation with standardized logging
   * @private
   */
  async executeWithLogging(operation, action) {
    try {
      TestLogger.info(`========== TEST ${operation} STARTED ==========`);
      await action();
      TestLogger.info(`========== TEST ${operation} COMPLETED ==========`);
    } catch (error) {
      TestLogger.error(`Test ${operation.toLowerCase()} failed`, error);
      throw error;
    }
  }

  /**
   * Generate standardized screenshot filename
   * @private
   */
  generateScreenshotFilename(testName, suffix) {
    const timestamp = Date.now();
    const suffixPart = suffix ? `-${suffix}` : '';
    return `${testName}${suffixPart}-${timestamp}`;
  }
}

export default BaseTest;