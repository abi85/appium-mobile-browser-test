import dotenv from 'dotenv';

dotenv.config();

/**
 * Test Data Management
 * Manages test data for various test scenarios
 * Following Single Responsibility Principle - handles only test data
 */

export const validCredentials = {
  username: process.env.VALID_USERNAME || 'tester1@simplestream.com',
  password: process.env.VALID_PASSWORD || 'TestLogin',
};

export const invalidCredentials = [
  {
    scenario: 'Invalid username and password',
    username: 'invalid@example.com',
    password: 'WrongPassword123',
    expectedError: 'Invalid credentials',
  },
  {
    scenario: 'Empty username',
    username: '',
    password: 'TestLogin',
    expectedError: 'Username is required',
  },
  {
    scenario: 'Empty password',
    username: 'tester1@simplestream.com',
    password: '',
    expectedError: 'Password is required',
  },
  {
    scenario: 'Empty username and password',
    username: '',
    password: '',
    expectedError: 'Username is required',
  },
  {
    scenario: 'Invalid email format',
    username: 'notanemail',
    password: 'TestLogin',
    expectedError: 'Invalid email format',
  },
  {
    scenario: 'SQL Injection attempt',
    username: "admin' OR '1'='1",
    password: "admin' OR '1'='1",
    expectedError: 'Invalid credentials',
  },
  {
    scenario: 'XSS attempt',
    username: '<script>alert("XSS")</script>',
    password: 'TestLogin',
    expectedError: 'Invalid credentials',
  },
];

export const testUrls = {
  baseUrl: process.env.BASE_URL || 'https://www.wwgoa.com',
  loginPage: '/login',
  homePage: '/',
  accountPage: '/my-account',
};

/**
 * Get credentials by scenario type
 * @param {string} type - 'valid' or 'invalid'
 * @returns {Object|Array} Credentials object or array
 */
export const getCredentials = (type) => {
  switch (type.toLowerCase()) {
  case 'valid':
    return validCredentials;
  case 'invalid':
    return invalidCredentials;
  default:
    throw new Error(`Unknown credential type: ${type}`);
  }
};

/**
 * Get random invalid credential scenario
 * @returns {Object} Random invalid credential
 */
export const getRandomInvalidCredential = () => {
  const randomIndex = Math.floor(Math.random() * invalidCredentials.length);
  return invalidCredentials[randomIndex];
};

export default {
  validCredentials,
  invalidCredentials,
  testUrls,
  getCredentials,
  getRandomInvalidCredential,
};

