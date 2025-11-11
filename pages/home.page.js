import { BasePage } from './base.page.js';
import { TestLogger } from '../utils/logger.js';
import { testUrls } from '../test-data/credentials.js';

/**
 * Home Page Object
 * Handles all home/dashboard page interactions following Page Object Model pattern
 */
export class HomePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.url = testUrls.baseUrl;
  }

  // Element Selectors (using getters for fresh references)
  get userProfile() {
    return this.driver.$('[class*="profile"], [class*="user"], [class*="account"], a[href*="account"], a[href*="profile"]');
  }

  get logoutButton() {
    return this.driver.$('a*=Sign out');
  }

  get welcomeMessage() {
    return this.driver.$('[class*="welcome"], h1, h2, [class*="greeting"]');
  }

  get navigationMenu() {
    return this.driver.$('nav, [role="navigation"], [class*="nav"], [class*="menu"]');
  }

  get userAvatar() {
    return this.driver.$('[class*="avatar"], img[alt*="profile" i], img[alt*="user" i]');
  }

  get accountLink() {
    return this.driver.$('a[href*="My Account"]');
  }


  // Navigation Actions
  async navigateToAccount() {
    await this.executeWithErrorHandling('navigate to account page', async () => {
      await this.click(await this.accountLink, 'Account link');
      TestLogger.info('Navigated to account page');
    });
  }

  // User Actions
  async clickUserProfile() {
    await this.executeWithErrorHandling('click user profile', async () => {
      await this.click(await this.userProfile, 'User profile');
      TestLogger.info('User profile clicked');
    });
  }

  async logout() {
    await this.executeWithErrorHandling('logout', async () => {
      TestLogger.step('Attempting to logout');
      
      if (await this.isExisting(await this.logoutButton)) {
        await this.click(await this.logoutButton, 'Logout button');
      } else {
        await this.logoutViaProfile();
      }
      
      await this.waitForLogoutRedirect();
      TestLogger.info('Logout successful');
    });
  }

  // Page State Checks
  async isUserLoggedIn() {
    try {
      const currentUrl = await this.getCurrentUrl();
      
      if (currentUrl.includes('login')) {
        return false;
      }
      
      const profileExists = await this.isExisting(await this.userProfile);
      const accountLinkExists = await this.isExisting(await this.accountLink);
      
      return profileExists || accountLinkExists;
    } catch (error) {
      TestLogger.error('Failed to check login status', error);
      return false;
    }
  }

  // Get Information
  async getWelcomeMessage() {
    try {
      const welcomeElement = await this.welcomeMessage;
      if (await this.isDisplayed(welcomeElement)) {
        return await this.getText(welcomeElement);
      }
      return '';
    } catch (error) {
      TestLogger.warn('Welcome message not found');
      return '';
    }
  }

  async getPageContent() {
    try {
      const content = await this.dashboardContent;
      if (await this.isDisplayed(content)) {
        return await this.getText(content);
      }
      return '';
    } catch (error) {
      TestLogger.error('Failed to get page content', error);
      return '';
    }
  }

  // Assertions
  async assertSuccessfulLogin() {
    await this.executeWithErrorHandling('assert successful login', async () => {
      await this.waitForHomePageLoad();
      
      const currentUrl = await this.getCurrentUrl();
      this.assertHelper.assertFalse(
        currentUrl.includes('login'),
        'User is redirected away from login page'
      );
      
      const isLoggedIn = await this.checkLoginIndicators();
      this.assertHelper.assertTrue(
        isLoggedIn,
        'User is successfully logged in (profile/account elements present)'
      );
      
      TestLogger.info('Successful login assertion passed');
      await this.takeScreenshot('successful-login');
    }, 'login-assertion-failure');
  }

  async assertNavigationVisible() {
    await this.executeWithErrorHandling('assert navigation visible', async () => {
      await this.assertHelper.assertDisplayed(
        await this.navigationMenu,
        'Navigation menu'
      );
      TestLogger.info('Navigation menu visibility assertion passed');
    });
  }

  // Private Helper Methods
  async waitForHomePageLoad() {
    await this.waitHelper.waitForPageLoad();
    
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
  }

  async checkLoginIndicators() {
    const profileExists = await this.isExisting(await this.userProfile);
    const accountLinkExists = await this.isExisting(await this.accountLink);
    const dashboardExists = await this.isExisting(await this.dashboardContent);
    
    return profileExists || accountLinkExists || dashboardExists;
  }

  async logoutViaProfile() {
    await this.clickUserProfile();
    await this.waitHelper.pause(1000);
    await this.click(await this.logoutButton, 'Logout button');
  }

  async waitForLogoutRedirect() {
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
  }

  async executeWithErrorHandling(actionName, action, screenshotSuffix = null) {
    try {
      await action();
    } catch (error) {
      TestLogger.error(`Failed to ${actionName}`, error);
      if (screenshotSuffix) {
        await this.takeScreenshot(screenshotSuffix);
      }
      throw error;
    }
  }
}

export default HomePage;