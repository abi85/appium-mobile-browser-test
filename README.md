# Appium Mobile Browser Test Automation Framework

A comprehensive test automation framework for mobile browser testing using Appium, JavaScript, and the Page Object Model (POM) design pattern.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Test Reports](#test-reports)
- [Design Patterns](#design-patterns)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This framework automates the testing of a mobile web application's login functionality across iOS and Android platforms using Appium. It follows SOLID principles and implements the Page Object Model design pattern for maintainable and scalable test automation.

### Test Scope

The framework tests the login functionality of https://www.wwgoa.com/login with the following scenarios:

- ✅ Valid login credentials
- ❌ Invalid login credentials (multiple scenarios)
- 🔍 Login page element verification
- ⚠️ Error handling and network issues

## ✨ Features

- **Cross-Platform Support**: Tests run on both iOS and Android simulators
- **Page Object Model**: Clean separation of test logic and page interactions
- **Comprehensive Logging**: Detailed test execution logs with Winston
- **Screenshot Capture**: Automatic screenshots on failures and key steps
- **Test Reports**: HTML reports with Mochawesome
- **Dynamic Test Data**: Configurable test data for various scenarios
- **Error Handling**: Robust error handling and recovery mechanisms
- **SOLID Principles**: Well-structured, maintainable code
- **Parallel Execution**: Support for parallel test execution

## 🏗️ Architecture

The framework follows a layered architecture:

```
┌─────────────────────────────────────┐
│         Test Layer                  │
│    (Mocha Test Suites)              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Page Object Layer              │
│  (LoginPage, HomePage, BasePage)    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│       Utility Layer                 │
│ (Driver, Wait, Assertion Helpers)   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      WebDriverIO / Appium           │
└─────────────────────────────────────┘
```

## 📦 Prerequisites

Before running the tests, ensure you have the following installed:

### Required Software

1. **Node.js** (v16 or higher)
   ```bash
   node --version
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **Appium Server** (v2.x)
   ```bash
   npm install -g appium
   appium --version
   ```

4. **Appium Drivers**
   ```bash
   # Install XCUITest driver for iOS
   appium driver install xcuitest
   
   # Install UiAutomator2 driver for Android
   appium driver install uiautomator2
   ```

### iOS Requirements

5. **Xcode** (latest version)
   - Install from Mac App Store
   - Install Xcode Command Line Tools:
     ```bash
     xcode-select --install
     ```

6. **iOS Simulator**
   - Open Xcode → Preferences → Components
   - Download desired iOS simulator versions

7. **Carthage** (for iOS WebDriverAgent)
   ```bash
   brew install carthage
   ```

### Android Requirements

8. **Android Studio**
   - Download from https://developer.android.com/studio
   - Install Android SDK and Platform Tools

9. **Android SDK Setup**
   ```bash
   # Add to ~/.zshrc or ~/.bash_profile
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

10. **Android Emulator**
    - Open Android Studio → AVD Manager
    - Create a virtual device (e.g., Pixel 7, Android 13)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   cd /Users/abi.balogun/Desktop/Development
   cd appium-mobile-browser-test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment configuration**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file** with your configuration
   ```bash
   nano .env
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Appium Server Configuration
APPIUM_HOST=127.0.0.1
APPIUM_PORT=4723

# Test Configuration
DEFAULT_TIMEOUT=30000
IMPLICIT_WAIT=10000
EXPLICIT_WAIT=20000

# Test URL
BASE_URL=https://www.wwgoa.com

# iOS Configuration
IOS_PLATFORM_VERSION=17.0
IOS_DEVICE_NAME=iPhone 15
IOS_BROWSER_NAME=Safari

# Android Configuration
ANDROID_PLATFORM_VERSION=13.0
ANDROID_DEVICE_NAME=Pixel 7
ANDROID_BROWSER_NAME=Chrome

# Test Data
VALID_USERNAME=tester1@simplestream.com
VALID_PASSWORD=TestLogin
```

### Appium Capabilities

Capabilities are configured in `config/capabilities.js`:

- **iOS**: Uses XCUITest automation with Safari browser
- **Android**: Uses UiAutomator2 automation with Chrome browser

## 📁 Project Structure

```
appium-mobile-browser-test/
├── config/                      # Configuration files
│   ├── appium.config.js        # Appium server configuration
│   └── capabilities.js         # Platform capabilities
├── pages/                       # Page Object Model
│   ├── base.page.js            # Base page with common methods
│   ├── login.page.js           # Login page object
│   └── home.page.js            # Home page object
├── tests/                       # Test suites
│   ├── base.test.js            # Base test class
│   └── login.test.js           # Login test cases
├── utils/                       # Utility functions
│   ├── logger.js               # Logging utility
│   ├── driver-manager.js       # WebDriver management
│   ├── wait-helper.js          # Wait utilities
│   └── assertion-helper.js     # Custom assertions
├── test-data/                   # Test data
│   └── credentials.js          # Login credentials data
├── logs/                        # Test execution logs
├── screenshots/                 # Test screenshots
├── reports/                     # Test reports
├── .babelrc                     # Babel configuration
├── .eslintrc.json              # ESLint configuration
├── .mocharc.json               # Mocha configuration
├── package.json                # Project dependencies
└── README.md                   # This file
```

## 🧪 Running Tests

### Prerequisites Before Running Tests

1. **Start Appium Server**
   ```bash
   appium
   ```
   Keep this terminal open.

2. **Start iOS Simulator** (for iOS tests)
   ```bash
   open -a Simulator
   ```
   Or open from Xcode → Open Developer Tool → Simulator

3. **Start Android Emulator** (for Android tests)
   ```bash
   # List available emulators
   emulator -list-avds
   
   # Start specific emulator
   emulator -avd Pixel_7_API_33
   ```

### Run All Tests

```bash
npm test
```

### Run iOS Tests Only

```bash
npm run test:ios
```

### Run Android Tests Only

```bash
npm run test:android
```

### Run Tests with HTML Report

```bash
npm run test:report
```

### Run Tests in Parallel

```bash
npm run test:parallel
```

### Run Specific Test File

```bash
npx mocha tests/login.test.js --require @babel/register --timeout 300000
```

## 📊 Test Reports

### Console Output

Real-time test execution logs are displayed in the console with:
- Test steps
- Assertions
- Pass/Fail status
- Error messages

### Log Files

Detailed logs are saved in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only
- `test-execution.log` - Test execution logs

### HTML Reports

Generate HTML reports using Mochawesome:

```bash
npm run test:report
```

Reports are saved in `reports/` directory. Open `reports/test-report.html` in a browser.

### Screenshots

Screenshots are automatically captured:
- On test failures
- At key test steps
- Stored in `screenshots/` directory

## 🎨 Design Patterns

### 1. Page Object Model (POM)

Each page is represented as a class with:
- Element locators
- Page-specific methods
- No test logic in page objects

**Example:**
```javascript
// pages/login.page.js
export class LoginPage extends BasePage {
  get usernameInput() { return this.driver.$('input[type="email"]'); }
  
  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
}
```

### 2. Single Responsibility Principle (SRP)

Each class has one responsibility:
- `DriverManager` - Manages WebDriver lifecycle
- `WaitHelper` - Handles wait operations
- `AssertionHelper` - Performs assertions
- `TestLogger` - Handles logging

### 3. Open/Closed Principle

- `BasePage` is open for extension (inherited by page objects)
- Closed for modification (common methods don't change)

### 4. Dependency Injection

Dependencies are injected through constructors:
```javascript
constructor(driver) {
  this.driver = driver;
  this.waitHelper = new WaitHelper(driver);
}
```

### 5. DRY (Don't Repeat Yourself)

- Common functionality in `BasePage`
- Reusable utilities in `utils/`
- Shared test setup in `BaseTest`

## 🎯 Best Practices

### Test Organization

1. **One test file per feature/page**
2. **Descriptive test names**
3. **Proper test setup and teardown**
4. **Independent tests** (no dependencies between tests)

### Page Objects

1. **Use getter methods** for element locators
2. **Return page objects** for method chaining
3. **Keep page objects simple** (no complex logic)
4. **Use meaningful method names**

### Assertions

1. **One assertion per test** (when possible)
2. **Use descriptive assertion messages**
3. **Log all assertions**
4. **Take screenshots on failures**

### Error Handling

1. **Try-catch blocks** in critical sections
2. **Meaningful error messages**
3. **Log all errors**
4. **Graceful degradation**

### Logging

1. **Log all test steps**
2. **Log important actions**
3. **Include context in logs**
4. **Use appropriate log levels**

## 🔧 Troubleshooting

### Common Issues

#### 1. Appium Server Not Running

**Error:** `ECONNREFUSED 127.0.0.1:4723`

**Solution:**
```bash
appium
```

#### 2. iOS Simulator Not Found

**Error:** `Could not find device with name 'iPhone 15'`

**Solution:**
```bash
# List available simulators
xcrun simctl list devices

# Update IOS_DEVICE_NAME in .env
```

#### 3. Android Emulator Not Running

**Error:** `Could not find device with name 'Pixel 7'`

**Solution:**
```bash
# List available emulators
emulator -list-avds

# Start emulator
emulator -avd <emulator_name>
```

#### 4. WebDriverAgent Build Failed (iOS)

**Solution:**
```bash
# Rebuild WebDriverAgent
cd ~/.appium/node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent
./Scripts/bootstrap.sh
```

#### 5. Chrome Driver Issues (Android)

**Solution:**
```bash
# Enable auto-download in capabilities
chromedriverAutodownload: true
```

#### 6. Element Not Found

**Solution:**
- Check element locators
- Increase wait timeouts
- Verify page is loaded
- Check if element is in iframe

#### 7. Test Timeout

**Solution:**
- Increase timeout in `.env`
- Check network connectivity
- Verify simulator/emulator performance

### Debug Mode

Enable debug logging:

```bash
# In .env
LOG_LEVEL=debug

# Or run with debug flag
DEBUG=* npm test
```

### Verify Setup

Run this checklist:

```bash
# 1. Check Node.js
node --version

# 2. Check Appium
appium --version

# 3. Check Appium drivers
appium driver list

# 4. Check iOS simulator (macOS)
xcrun simctl list devices

# 5. Check Android emulator
emulator -list-avds

# 6. Check environment variables
cat .env
```

## 📝 Test Data Management

Test data is managed in `test-data/credentials.js`:

### Valid Credentials
```javascript
export const validCredentials = {
  username: 'tester1@simplestream.com',
  password: 'TestLogin',
};
```

### Invalid Credentials
Multiple scenarios including:
- Invalid username and password
- Empty fields
- Invalid email format
- SQL injection attempts
- XSS attempts

## 🔒 Security Notes

- Never commit `.env` file with real credentials
- Use environment variables for sensitive data
- Rotate test credentials regularly
- Use test accounts only

## 🤝 Contributing

1. Follow SOLID principles
2. Maintain Page Object Model pattern
3. Add tests for new features
4. Update documentation
5. Follow existing code style

## 📄 License

ISC

## 👥 Authors

Created for Simplestream Appium Code Challenge

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review Appium documentation: https://appium.io/docs/
3. Check WebdriverIO documentation: https://webdriver.io/

## 🎓 Learning Resources

- [Appium Documentation](https://appium.io/docs/)
- [WebdriverIO Documentation](https://webdriver.io/)
- [Mocha Test Framework](https://mochajs.org/)
- [Page Object Model Pattern](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**Happy Testing! 🚀**

