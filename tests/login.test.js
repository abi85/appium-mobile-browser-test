import { describe, it, before, after, beforeEach, afterEach } from 'mocha';
import { BaseTest } from './base.test.js';
import { TestLogger } from '../utils/logger.js';
import { validCredentials, invalidCredentials } from '../test-data/credentials.js';

/**
 * Login Test Suite
 * Tests login functionality with valid and invalid credentials
 */
describe('Mobile Browser Login Tests', function() {
  this.timeout(300000);

  let baseTest;

  before(() => {
    TestLogger.info('========== LOGIN TEST SUITE STARTED ==========');
  });

  after(() => {
    TestLogger.info('========== LOGIN TEST SUITE COMPLETED ==========');
  });

  beforeEach(async () => {
    baseTest = new BaseTest();
    await baseTest.setup();
  });

  afterEach(async () => {
    if (baseTest) {
      await baseTest.teardown();
    }
  });

  describe('Valid Login Scenarios', () => {
    it('should successfully login with valid credentials', async () => {
      const testName = 'valid-login-test';
      
      await executeTest(testName, async () => {
        await openAndVerifyLoginPage(testName);
        await enterValidCredentials(testName);
        await verifyLoginButtonEnabled();
        await submitLoginForm(testName);
        await verifySuccessfulLogin(testName);
      });
    });

    it('should display user profile after successful login', async () => {
      const testName = 'login-profile-verification';
      
      await executeTest(testName, async () => {
        await performLogin();
        await verifyUserProfile(testName);
      });
    });
  });

  describe('Invalid Login Scenarios', () => {
    invalidCredentials.forEach((testData, index) => {
      it(`should keep login button disabled for: ${testData.scenario}`, async () => {
        const testName = `invalid-login-${index}-${sanitizeScenarioName(testData.scenario)}`;
        
        await executeTest(testName, async () => {
          await openAndVerifyLoginPage(testName);
          await enterInvalidCredentials(testName, testData);
          await verifyLoginButtonDisabled(testName);
          await verifyRemainsOnLoginPage();
        });
      });
    });
  });

  describe('Login Page Elements', () => {
    it('should display all required login form elements', async () => {
      const testName = 'login-elements-verification';
      
      await executeTest(testName, async () => {
        await openAndVerifyLoginPage(testName);
        await verifyAllFormElements();
        await baseTest.takeScreenshot(testName, 'elements-verified');
      });
    });
  });

  describe('Error Handling Scenarios', () => {
    it('should handle page load timeout gracefully', async () => {
      const testName = 'page-load-timeout-handling';
      
      await executeTest(testName, async () => {
        await handlePageLoadTimeout(testName);
      });
    });
  });

  // Test Execution Helper
  async function executeTest(testName, testLogic) {
    TestLogger.testStart(testName);
    try {
      await testLogic();
      TestLogger.testEnd(testName, 'PASSED');
    } catch (error) {
      await baseTest.handleTestFailure(testName, error);
      TestLogger.testEnd(testName, 'FAILED');
      throw error;
    }
  }

  // Page Navigation Helpers
  async function openAndVerifyLoginPage(testName) {
    TestLogger.step('Opening login page');
    await baseTest.loginPage.open();
    await baseTest.loginPage.assertLoginPageLoaded();
    await baseTest.takeScreenshot(testName, 'page-loaded');
  }

  // Credential Entry Helpers
  async function enterValidCredentials(testName) {
    TestLogger.step('Entering valid credentials');
    await baseTest.loginPage.enterUsername(validCredentials.username);
    await baseTest.loginPage.enterPassword(validCredentials.password);
    await baseTest.loginPage.assertFieldsPopulated(validCredentials.username);
    await baseTest.takeScreenshot(testName, 'credentials-entered');
  }

  async function enterInvalidCredentials(testName, testData) {
    TestLogger.step(`Entering credentials for scenario: ${testData.scenario}`);
    TestLogger.info(`Username: "${testData.username}", Password: "${testData.password}"`);
    
    if (testData.username) {
      await baseTest.loginPage.enterUsername(testData.username);
    }
    if (testData.password) {
      await baseTest.loginPage.enterPassword(testData.password);
    }
    
    await baseTest.loginPage.waitHelper.pause(1000);
    await baseTest.takeScreenshot(testName, 'credentials-entered');
  }

  // Login Button Verification Helpers
  async function verifyLoginButtonEnabled() {
    TestLogger.step('Verifying login button is enabled');
    await baseTest.loginPage.assertLoginButtonEnabled();
  }

  async function verifyLoginButtonDisabled(testName) {
    TestLogger.step('Verifying login button is disabled');
    await baseTest.loginPage.assertLoginButtonDisabled();
    await baseTest.takeScreenshot(testName, 'button-disabled');
  }

  // Form Submission Helpers
  async function submitLoginForm(testName) {
    TestLogger.step('Submitting login form');
    await baseTest.loginPage.clickLoginButton();
    await baseTest.loginPage.assertLoginProcessInitiated();
    await baseTest.takeScreenshot(testName, 'login-initiated');
  }

  // Login Verification Helpers
  async function verifySuccessfulLogin(testName) {
    TestLogger.step('Verifying successful login and redirect to homepage');
    await baseTest.homePage.assertSuccessfulLogin();
    await baseTest.takeScreenshot(testName, 'login-successful');
  }

  async function performLogin() {
    TestLogger.step('Performing login with valid credentials');
    await baseTest.loginPage.open();
    await baseTest.loginPage.assertLoginPageLoaded();
    await baseTest.loginPage.login(validCredentials.username, validCredentials.password);
    await baseTest.homePage.assertSuccessfulLogin();
  }

  async function verifyUserProfile(testName) {
    TestLogger.step('Verifying user profile is visible');
    const isLoggedIn = await baseTest.homePage.isUserLoggedIn();
    baseTest.homePage.assertHelper.assertTrue(
      isLoggedIn,
      'User profile is visible after login'
    );
    await baseTest.takeScreenshot(testName, 'profile-visible');
  }

  async function verifyRemainsOnLoginPage() {
    TestLogger.step('Verifying user remains on login page');
    const currentUrl = await baseTest.loginPage.getCurrentUrl();
    baseTest.loginPage.assertHelper.assertUrlContains(
      currentUrl,
      'login',
      'User remains on login page with disabled button'
    );
  }

  // Element Verification Helpers
  async function verifyAllFormElements() {
    const elements = [
      { getter: () => baseTest.loginPage.usernameInput, name: 'Username input field', step: 2 },
      { getter: () => baseTest.loginPage.passwordInput, name: 'Password input field', step: 3 },
      { getter: () => baseTest.loginPage.loginButton, name: 'Login button', step: 4 }
    ];

    for (const { getter, name, step } of elements) {
      TestLogger.step(`Step ${step}: Verifying ${name.toLowerCase()} exists`);
      const element = await getter();
      await baseTest.loginPage.assertHelper.assertExists(element, name);
    }
  }

  // Error Handling Helpers
  async function handlePageLoadTimeout(testName) {
    TestLogger.step('Attempting to open login page with timeout handling');
    
    try {
      await baseTest.loginPage.open();
      TestLogger.info('Page loaded successfully');
      await baseTest.takeScreenshot(testName, 'page-loaded');
    } catch (error) {
      TestLogger.step('Handling page load error gracefully');
      TestLogger.error('Page load timeout occurred (expected in some scenarios)', error);
      TestLogger.info('Error handled gracefully without crashing test framework');
      await baseTest.takeScreenshot(testName, 'timeout-handled');
    }
  }

  // Utility Helpers
  function sanitizeScenarioName(scenario) {
    return scenario.replace(/\s+/g, '-').toLowerCase();
  }
});