import { TestLogger } from './logger.js';
import { testConfig } from '../config/appium.config.js';

/**
 * Wait Helper
 * Provides utility methods for waiting and synchronization
 * Following Single Responsibility Principle - handles only wait operations
 */

export class WaitHelper {
  constructor(driver) {
    this.driver = driver;
    this.defaultTimeout = testConfig.explicitWait;
  }

  /**
   * Wait for element to be displayed
   * @param {Object} element - WebdriverIO element
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<boolean>}
   */
  async waitForDisplayed(element, timeout = this.defaultTimeout) {
    try {
      await element.waitForDisplayed({
        timeout,
        timeoutMsg: `Element not displayed after ${timeout}ms`,
      });
      return true;
    } catch (error) {
      TestLogger.error('Element not displayed within timeout', error);
      return false;
    }
  }

  /**
   * Wait for element to be clickable
   * @param {Object} element - WebdriverIO element
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<boolean>}
   */
  async waitForClickable(element, timeout = this.defaultTimeout) {
    try {
      await element.waitForClickable({
        timeout,
        timeoutMsg: `Element not clickable after ${timeout}ms`,
      });
      return true;
    } catch (error) {
      TestLogger.error('Element not clickable within timeout', error);
      return false;
    }
  }

  /**
   * Wait for element to exist in DOM
   * @param {Object} element - WebdriverIO element
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<boolean>}
   */
  async waitForExist(element, timeout = this.defaultTimeout) {
    try {
      await element.waitForExist({
        timeout,
        timeoutMsg: `Element does not exist after ${timeout}ms`,
      });
      return true;
    } catch (error) {
      TestLogger.error('Element does not exist within timeout', error);
      return false;
    }
  }

  /**
   * Wait for element to be enabled
   * @param {Object} element - WebdriverIO element
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<boolean>}
   */
  async waitForEnabled(element, timeout = this.defaultTimeout) {
    try {
      await element.waitForEnabled({
        timeout,
        timeoutMsg: `Element not enabled after ${timeout}ms`,
      });
      return true;
    } catch (error) {
      TestLogger.error('Element not enabled within timeout', error);
      return false;
    }
  }

  /**
   * Wait for page to load
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForPageLoad(timeout = this.defaultTimeout) {
    try {
      await this.driver.waitUntil(
        async () => {
          const state = await this.driver.execute(() => document.readyState);
          return state === 'complete';
        },
        {
          timeout,
          timeoutMsg: 'Page did not load within timeout',
        }
      );
      TestLogger.info('Page loaded successfully');
    } catch (error) {
      TestLogger.error('Page load timeout', error);
      throw error;
    }
  }

  /**
   * Custom wait with condition
   * @param {Function} condition - Condition function
   * @param {number} timeout - Timeout in milliseconds
   * @param {string} message - Error message
   */
  async waitUntil(condition, timeout = this.defaultTimeout, message = 'Condition not met') {
    try {
      await this.driver.waitUntil(condition, {
        timeout,
        timeoutMsg: message,
      });
    } catch (error) {
      TestLogger.error(message, error);
      throw error;
    }
  }

  /**
   * Simple pause/sleep
   * @param {number} milliseconds - Time to pause in milliseconds
   */
  async pause(milliseconds) {
    await this.driver.pause(milliseconds);
  }
}

export default WaitHelper;

