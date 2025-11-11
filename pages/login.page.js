import { BasePage } from './base.page.js';
import { TestLogger } from '../utils/logger.js';
import { testUrls } from '../test-data/credentials.js';

/**
 * Login Page Object
 * Handles all login page interactions following Page Object Model pattern
 */
export class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.url = `${testUrls.baseUrl}${testUrls.loginPage}`;
  }

  // Element Selectors (using getters for fresh references)
  get usernameInput() {
    return this.driver.$('input[type="email"]');
  }

  get passwordInput() {
    return this.driver.$('input[name="password"]');
  }

  get loginButton() {
    return this.driver.$('button*=Sign in');
  }

  get errorMessage() {
    return this.driver.$('[role="alert"]');
  }

  get loginForm() {
    return this.driver.$('form, [class*="login"], [id*="login"]');
  }

  get rememberMeCheckbox() {
    return this.driver.$('input[type="checkbox"][name*="remember"]');
  }

  // Navigation
  async open() {
    await this.executeWithErrorHandling('open login page', async () => {
      TestLogger.step('Opening login page');
      await this.navigateTo(this.url);
      await this.waitForPageToLoad();
      TestLogger.info('Login page opened successfully');
    });
  }

  // Form Input Actions
  async enterUsername(username) {
    await this.executeWithErrorHandling('enter username', async () => {
      await this.type(await this.usernameInput, username, 'Username field');
    });
  }

  async enterPassword(password) {
    await this.executeWithErrorHandling('enter password', async () => {
      await this.type(await this.passwordInput, password, 'Password field');
    });
  }

  async clickLoginButton() {
    await this.executeWithErrorHandling('click login button', async () => {
      await this.click(await this.loginButton, 'Login button');
      await this.waitHelper.pause(2000);
      TestLogger.info('Login button clicked successfully');
    });
  }

  async toggleRememberMe() {
    try {
      const checkbox = await this.rememberMeCheckbox;
      if (await this.isExisting(checkbox)) {
        await this.click(checkbox, 'Remember Me checkbox');
      }
    } catch (error) {
      TestLogger.warn('Remember Me checkbox not found or not clickable');
    }
  }

  // Complete Login Flow
  async login(username, password) {
    await this.executeWithErrorHandling('perform login', async () => {
      TestLogger.step(`Performing login with username: ${username}`);
      await this.enterUsername(username);
      await this.enterPassword(password);
      await this.assertFieldsPopulated(username);
      await this.clickLoginButton();
      await this.assertLoginProcessInitiated();
      TestLogger.info('Login action completed');
    }, 'login-failure');
  }

  // Page State Checks
  async isErrorDisplayed() {
    try {
      return await this.isDisplayed(await this.errorMessage);
    } catch (error) {
      return false;
    }
  }

  async isLoginButtonEnabled() {
    try {
      const loginBtn = await this.loginButton;
      await this.waitForElement(loginBtn);
      
      const isDisabled = await loginBtn.getAttribute('disabled');
      const ariaDisabled = await loginBtn.getAttribute('aria-disabled');
      const isEnabled = !isDisabled && ariaDisabled !== 'true';
      
      TestLogger.info(`Login button enabled state: ${isEnabled}`);
      return isEnabled;
    } catch (error) {
      TestLogger.error('Failed to check login button enabled state', error);
      return false;
    }
  }

  async hasRememberMeCheckbox() {
    return await this.isExisting(await this.rememberMeCheckbox);
  }

  // Get Information
  async getErrorMessage() {
    try {
      const errorElement = await this.errorMessage;
      if (await this.isDisplayed(errorElement)) {
        return await this.getText(errorElement);
      }
      return '';
    } catch (error) {
      TestLogger.error('Failed to get error message', error);
      return '';
    }
  }

  // Assertions
  async assertLoginPageLoaded() {
    await this.executeWithErrorHandling('assert login page loaded', async () => {
      const currentUrl = await this.getCurrentUrl();
      this.assertHelper.assertUrlContains(currentUrl, 'login', 'Login page URL verification');
      
      const usernameExists = await this.isExisting(await this.usernameInput);
      const passwordExists = await this.isExisting(await this.passwordInput);
      
      this.assertHelper.assertTrue(
        usernameExists && passwordExists,
        'Login form elements are present'
      );
      
      TestLogger.info('Login page loaded assertion passed');
    }, 'login-page-load-failure');
  }

  async assertFieldsPopulated(expectedUsername) {
    await this.executeWithErrorHandling('assert fields populated', async () => {
      const usernameValue = await (await this.usernameInput).getValue();
      const passwordValue = await (await this.passwordInput).getValue();
      
      this.assertHelper.assertTextEquals(
        usernameValue,
        expectedUsername,
        'Username field value'
      );
      
      this.assertHelper.assertTrue(
        passwordValue.length > 0,
        'Password field is populated'
      );
      
      TestLogger.info('Fields populated assertion passed');
    }, 'fields-population-failure');
  }

  async assertLoginProcessInitiated() {
    await this.executeWithErrorHandling('assert login process initiated', async () => {
      await this.driver.waitUntil(
        async () => {
          const currentUrl = await this.getCurrentUrl();
          return !currentUrl.includes('login') || await this.isErrorDisplayed();
        },
        {
          timeout: 15000,
          timeoutMsg: 'Login process did not initiate',
        }
      );
      
      TestLogger.info('Login process initiated successfully');
    }, 'login-process-initiation-failure');
  }

  async assertErrorDisplayed(expectedError = null) {
    await this.executeWithErrorHandling('assert error displayed', async () => {
      const isErrorShown = await this.isErrorDisplayed();
      this.assertHelper.assertTrue(isErrorShown, 'Error message is displayed');
      
      if (expectedError) {
        const actualError = await this.getErrorMessage();
        TestLogger.info(`Error message displayed: ${actualError}`);
      }
      
      TestLogger.info('Error message assertion passed');
    }, 'error-message-assertion-failure');
  }

  async assertLoginButtonEnabled() {
    await this.executeWithErrorHandling('assert login button enabled', async () => {
      const isEnabled = await this.isLoginButtonEnabled();
      this.assertHelper.assertTrue(isEnabled, 'Login button is enabled');
      TestLogger.info('Login button enabled assertion passed');
    }, 'login-button-enabled-assertion-failure');
  }

  async assertLoginButtonDisabled() {
    await this.executeWithErrorHandling('assert login button disabled', async () => {
      const isEnabled = await this.isLoginButtonEnabled();
      this.assertHelper.assertFalse(isEnabled, 'Login button is disabled');
      TestLogger.info('Login button disabled assertion passed');
    }, 'login-button-disabled-assertion-failure');
  }

  // Private Helper Methods
  async waitForPageToLoad() {
    try {
      await this.waitHelper.waitForPageLoad();
      
      await this.driver.waitUntil(
        async () => {
          const usernameExists = await this.isExisting(await this.usernameInput);
          const formExists = await this.isExisting(await this.loginForm);
          return usernameExists || formExists;
        },
        {
          timeout: this.timeout,
          timeoutMsg: 'Login page did not load within timeout',
        }
      );
      
      TestLogger.info('Login page loaded successfully');
    } catch (error) {
      TestLogger.error('Login page failed to load', error);
      throw error;
    }
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

export default LoginPage;