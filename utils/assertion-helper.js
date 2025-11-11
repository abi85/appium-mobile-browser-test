import { expect } from 'chai';
import { TestLogger } from './logger.js';

/**
 * Assertion Helper
 * Provides custom assertion methods with logging
 * Following Single Responsibility Principle - handles only assertions
 */

export class AssertionHelper {
  /**
   * Assert element is displayed
   * @param {Object} element - WebdriverIO element
   * @param {string} elementName - Name of element for logging
   */
  static async assertDisplayed(element, elementName) {
    try {
      const isDisplayed = await element.isDisplayed();
      expect(isDisplayed).to.be.true;
      TestLogger.assertion(`${elementName} is displayed`, true);
    } catch (error) {
      TestLogger.assertion(`${elementName} is displayed`, false);
      throw new Error(`${elementName} is not displayed`);
    }
  }

  /**
   * Assert element exists
   * @param {Object} element - WebdriverIO element
   * @param {string} elementName - Name of element for logging
   */
  static async assertExists(element, elementName) {
    try {
      const exists = await element.isExisting();
      expect(exists).to.be.true;
      TestLogger.assertion(`${elementName} exists`, true);
    } catch (error) {
      TestLogger.assertion(`${elementName} exists`, false);
      throw new Error(`${elementName} does not exist`);
    }
  }

  /**
   * Assert element is enabled
   * @param {Object} element - WebdriverIO element
   * @param {string} elementName - Name of element for logging
   */
  static async assertEnabled(element, elementName) {
    try {
      const isEnabled = await element.isEnabled();
      expect(isEnabled).to.be.true;
      TestLogger.assertion(`${elementName} is enabled`, true);
    } catch (error) {
      TestLogger.assertion(`${elementName} is enabled`, false);
      throw new Error(`${elementName} is not enabled`);
    }
  }

  /**
   * Assert text equals expected value
   * @param {string} actual - Actual text
   * @param {string} expected - Expected text
   * @param {string} description - Description for logging
   */
  static assertTextEquals(actual, expected, description) {
    try {
      expect(actual).to.equal(expected);
      TestLogger.assertion(`${description}: "${actual}" equals "${expected}"`, true);
    } catch (error) {
      TestLogger.assertion(`${description}: "${actual}" equals "${expected}"`, false);
      throw new Error(`${description}: Expected "${expected}" but got "${actual}"`);
    }
  }

  /**
   * Assert text contains expected value
   * @param {string} actual - Actual text
   * @param {string} expected - Expected text
   * @param {string} description - Description for logging
   */
  static assertTextContains(actual, expected, description) {
    try {
      expect(actual).to.include(expected);
      TestLogger.assertion(`${description}: "${actual}" contains "${expected}"`, true);
    } catch (error) {
      TestLogger.assertion(`${description}: "${actual}" contains "${expected}"`, false);
      throw new Error(`${description}: Expected to contain "${expected}" but got "${actual}"`);
    }
  }

  /**
   * Assert URL contains expected value
   * @param {string} actualUrl - Actual URL
   * @param {string} expectedUrl - Expected URL or URL fragment
   * @param {string} description - Description for logging
   */
  static assertUrlContains(actualUrl, expectedUrl, description) {
    try {
      expect(actualUrl).to.include(expectedUrl);
      TestLogger.assertion(`${description}: URL contains "${expectedUrl}"`, true);
    } catch (error) {
      TestLogger.assertion(`${description}: URL contains "${expectedUrl}"`, false);
      throw new Error(`${description}: Expected URL to contain "${expectedUrl}" but got "${actualUrl}"`);
    }
  }

  /**
   * Assert value is true
   * @param {boolean} value - Value to check
   * @param {string} description - Description for logging
   */
  static assertTrue(value, description) {
    try {
      expect(value).to.be.true;
      TestLogger.assertion(description, true);
    } catch (error) {
      TestLogger.assertion(description, false);
      throw new Error(`${description}: Expected true but got ${value}`);
    }
  }

  /**
   * Assert value is false
   * @param {boolean} value - Value to check
   * @param {string} description - Description for logging
   */
  static assertFalse(value, description) {
    try {
      expect(value).to.be.false;
      TestLogger.assertion(description, true);
    } catch (error) {
      TestLogger.assertion(description, false);
      throw new Error(`${description}: Expected false but got ${value}`);
    }
  }

  /**
   * Assert element attribute value
   * @param {Object} element - WebdriverIO element
   * @param {string} attribute - Attribute name
   * @param {string} expectedValue - Expected attribute value
   * @param {string} description - Description for logging
   */
  static async assertAttribute(element, attribute, expectedValue, description) {
    try {
      const actualValue = await element.getAttribute(attribute);
      expect(actualValue).to.equal(expectedValue);
      TestLogger.assertion(`${description}: ${attribute}="${expectedValue}"`, true);
    } catch (error) {
      TestLogger.assertion(`${description}: ${attribute}="${expectedValue}"`, false);
      throw error;
    }
  }
}

export default AssertionHelper;

