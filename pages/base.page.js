import { TestLogger } from '../utils/logger.js';
import { WaitHelper } from '../utils/wait-helper.js';
import { AssertionHelper } from '../utils/assertion-helper.js';
import { testConfig } from '../config/appium.config.js';

/**
 * Base Page Object
 * Contains common methods and properties for all page objects
 * Following DRY principle and providing reusable functionality
 */
export class BasePage {
  constructor(driver) {
    if (!driver) {
      throw new Error('Driver instance is required');
    }
    this.driver = driver;
    this.waitHelper = new WaitHelper(driver);
    this.assertHelper = AssertionHelper;
    this.timeout = testConfig.explicitWait;
  }

  // Navigation
  async navigateTo(url) {
    await this.executeWithLogging(`navigate to ${url}`, async () => {
      await this.driver.url(url);
      await this.waitHelper.waitForPageLoad();
    });
  }

  async refresh() {
    await this.executeWithLogging('refresh page', async () => {
      await this.driver.refresh();
      await this.waitHelper.waitForPageLoad();
    });
  }

  // Page Information
  async getCurrentUrl() {
    return await this.executeWithLogging('get current URL', async () => {
      const url = await this.driver.getUrl();
      TestLogger.info(`Current URL: ${url}`);
      return url;
    });
  }

  async getPageTitle() {
    return await this.executeWithLogging('get page title', async () => {
      const title = await this.driver.getTitle();
      TestLogger.info(`Page title: ${title}`);
      return title;
    });
  }

  // Element Finding
  async findElement(selector) {
    return await this.executeWithLogging(`find element: ${selector}`, async () => {
      const element = await this.driver.$(selector);
      await this.waitHelper.waitForExist(element);
      return element;
    });
  }

  async findElements(selector) {
    return await this.executeWithLogging(`find elements: ${selector}`, async () => {
      return await this.driver.$$(selector);
    });
  }

  // Element Interactions
  async click(element, elementName = 'Element') {
    await this.executeWithLogging(`click on ${elementName}`, async () => {
      await this.waitHelper.waitForClickable(element);
      await element.click();
    });
  }

  async type(element, text, elementName = 'Element') {
    await this.executeWithLogging(`type into ${elementName}`, async () => {
      await this.waitHelper.waitForDisplayed(element);
      await element.clearValue();
      await element.setValue(text);
      TestLogger.info(`Typed: "${text}"`);
    });
  }

  async scrollToElement(element) {
    await this.executeWithLogging('scroll to element', async () => {
      await element.scrollIntoView();
    });
  }

  // Element State Checks
  async getText(element) {
    return await this.executeWithLogging('get element text', async () => {
      await this.waitHelper.waitForDisplayed(element);
      return await element.getText();
    });
  }

  async isDisplayed(element) {
    try {
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  async isExisting(element) {
    try {
      return await element.isExisting();
    } catch (error) {
      return false;
    }
  }

  // Waiting
  async waitForElement(element, timeout = this.timeout) {
    await this.waitHelper.waitForDisplayed(element, timeout);
  }

  // Utilities
  async takeScreenshot(filename) {
    try {
      const filepath = `./screenshots/${filename}.png`;
      await this.driver.saveScreenshot(filepath);
      TestLogger.screenshot(filepath);
    } catch (error) {
      TestLogger.error('Failed to take screenshot', error);
    }
  }

  async executeScript(script, ...args) {
    return await this.executeWithLogging('execute JavaScript', async () => {
      return await this.driver.execute(script, ...args);
    });
  }

  // Private Helper
  async executeWithLogging(actionName, action) {
    try {
      TestLogger.step(`${this.capitalize(actionName)}`);
      const result = await action();
      return result;
    } catch (error) {
      TestLogger.error(`Failed to ${actionName}`, error);
      throw error;
    }
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export default BasePage;