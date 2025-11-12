import { BasePage } from './base.page.js';
import { TestLogger } from '../utils/logger.js';
import { testUrls } from '../test-data/credentials.js';

/**
 * Home Page Object
 * Implements Page Object Model for Home/Dashboard page after successful login
 * Following Single Responsibility Principle - handles only home page interactions
 * Extends BasePage for common functionality
 */

export class HomePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.url = testUrls.baseUrl;
  }

  /**
   * Page Element Selectors
   * Using getter methods to ensure fresh element references
   */
  
  get myContentLink() {
    return this.driver.$('a*=My Content');
  }

  get signOutButton() {
    return this.driver.$('a*=Sign Out');
  }

  get accountLink() {
    return this.driver.$('a*=My Account');
  }

  /**
   * Wait for home page to load
   */
  async waitForHomePageLoad() {
    try {
      await this.waitHelper.waitForPageLoad();
      
      // Wait for page to fully load by checking URL doesn't contain 'login'
      await this.driver.waitUntil(
        async () => {
          const currentUrl = await this.getCurrentUrl();
          return !currentUrl.includes('login');
        },
        {
          timeout: this.timeout,
          timeoutMsg: 'Home page did not load within timeout',
        }
      );
      
      TestLogger.info('Home page loaded successfully');
    } catch (error) {
      TestLogger.error('Home page failed to load', error);
      throw error;
    }
  }

  /**
   * Assert user is logged in and on home page
   */
  async assertSuccessfulLogin() {
    try {
      await this.waitForHomePageLoad();
      
      const currentUrl = await this.getCurrentUrl();
      
      // Assert URL does not contain 'login'
      this.assertHelper.assertFalse(
        currentUrl.includes('login'),
        'User is redirected away from login page'
      );
      
      // Check for user profile or account indicators
      const myContentExists = await this.isExisting(await this.myContentLink);
      const accountLinkExists = await this.isExisting(await this.accountLink);
      const signOutButtonExists = await this.isExisting(await this.signOutButton);
      
      const isLoggedIn = myContentExists || accountLinkExists || signOutButtonExists;
      
      this.assertHelper.assertTrue(
        isLoggedIn,
        'User is successfully logged in (profile/account elements present)'
      );
      
      TestLogger.info('Successful login assertion passed');
      await this.takeScreenshot('successful-login');
    } catch (error) {
      TestLogger.error('Successful login assertion failed', error);
      await this.takeScreenshot('login-assertion-failure');
      throw error;
    }
  }

  /**
   * Check if user is logged in
   * @returns {Promise<boolean>} True if user is logged in
   */
  async isUserLoggedIn() {
    try {
      const currentUrl = await this.getCurrentUrl();
      
      if (currentUrl.includes('login')) {
        return false;
      }
      
      const myContentExists = await this.isExisting(await this.myContentLink);
      const accountLinkExists = await this.isExisting(await this.accountLink);
      
      return myContentExists || accountLinkExists;
    } catch (error) {
      TestLogger.error('Failed to check login status', error);
      return false;
    }
  }


  /**
   * Click on user profile
   */
  async clickUserProfile() {
    try {
      const profile = await this.myContentLink;
      await this.click(profile, 'User profile');
      TestLogger.info('User profile clicked');
    } catch (error) {
      TestLogger.error('Failed to click user profile', error);
      throw error;
    }
  }

  /**
   * Logout from application
   */
  async logout() {
    try {
      TestLogger.step('Attempting to logout');
      
      // Try to find and click logout button
      const logoutBtn = await this.signOutButton;
      
      if (await this.isExisting(logoutBtn)) {
        await this.click(logoutBtn, 'Logout button');
      } else {
        // If logout button not visible, try clicking profile first
        await this.clickUserProfile();
        await this.waitHelper.pause(1000);
        const logoutBtnRetry = await this.signOutButton;
        await this.click(logoutBtnRetry, 'Logout button');
      }
      
      // Wait for redirect to login page
      await this.driver.waitUntil(
        async () => {
          const currentUrl = await this.getCurrentUrl();
          return currentUrl.includes('login');
        },
        {
          timeout: 10000,
          timeoutMsg: 'Did not redirect to login page after logout',
        }
      );
      
      TestLogger.info('Logout successful');
    } catch (error) {
      TestLogger.error('Logout failed', error);
      throw error;
    }
  }

  /**
   * Navigate to account page
   */
  async navigateToAccount() {
    try {
      const accountLnk = await this.accountLink;
      await this.click(accountLnk, 'Account link');
      TestLogger.info('Navigated to account page');
    } catch (error) {
      TestLogger.error('Failed to navigate to account page', error);
      throw error;
    }
  }
}

export default HomePage;

