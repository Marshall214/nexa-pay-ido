// NexaPay IDO Platform - Automated Test Script
// Run this in browser console to test basic functionality

class IDOTestSuite {
  constructor() {
    this.results = [];
    this.testCount = 0;
    this.passCount = 0;
    this.failCount = 0;
  }

  async runTest(testName, testFunction) {
    this.testCount++;
    console.log(`\n🧪 Running Test: ${testName}`);
    
    try {
      await testFunction();
      this.passCount++;
      this.results.push({ name: testName, status: 'PASS', error: null });
      console.log(`✅ PASS: ${testName}`);
    } catch (error) {
      this.failCount++;
      this.results.push({ name: testName, status: 'FAIL', error: error.message });
      console.log(`❌ FAIL: ${testName} - ${error.message}`);
    }
  }

  async testWalletConnection() {
    // Check if wallet connection elements exist
    const connectButton = document.querySelector('[data-testid="header-connect-wallet"], [data-testid="connect-wallet-button"]');
    if (!connectButton) {
      throw new Error('Connect Wallet button not found');
    }
    
    // Check if wallet address is displayed when connected
    const walletAddress = document.querySelector('[class*="font-mono"]');
    if (walletAddress && walletAddress.textContent.includes('0x')) {
      console.log('Wallet connected:', walletAddress.textContent);
    }
  }

  async testTokenCalculation() {
    // Find ETH input field
    const ethInput = document.querySelector('[data-testid="eth-input"]');
    if (!ethInput) {
      throw new Error('ETH input field not found');
    }

    // Test calculation with 0.01 ETH
    ethInput.value = '0.01';
    ethInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Wait for calculation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if NPT amount is calculated (should be 100)
    const nptDisplay = document.querySelector('span:contains("100")');
    if (!nptDisplay) {
      throw new Error('NPT calculation not working - expected 100 NPT for 0.01 ETH');
    }
  }

  async testUIElements() {
    // Check for key UI elements
    const elements = [
      { selector: '[data-testid="main-title"]', text: 'NexaPay Token Sale' },
      { selector: '[data-testid="header-connect-wallet"], [data-testid="connect-wallet-button"]', text: 'Connect Wallet' },
      { selector: '[data-testid="eth-input"]', text: 'ETH input' },
      { selector: '[data-testid="buy-tokens-button"]', text: 'Buy button' }
    ];

    for (const element of elements) {
      const el = document.querySelector(element.selector);
      if (!el) {
        throw new Error(`${element.text} not found`);
      }
    }
  }

  async testProgressBars() {
    // Check if progress bars exist
    const progressBars = document.querySelectorAll('[role="progressbar"]');
    if (progressBars.length === 0) {
      throw new Error('Progress bars not found');
    }
  }

  async testResponsiveDesign() {
    // Test different viewport sizes
    const sizes = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];

    for (const size of sizes) {
      // Simulate viewport change
      Object.defineProperty(window, 'innerWidth', { value: size.width });
      Object.defineProperty(window, 'innerHeight', { value: size.height });
      window.dispatchEvent(new Event('resize'));

      // Check if layout adapts
      const mainContainer = document.querySelector('div[class*="max-w"]');
      if (!mainContainer) {
        throw new Error(`Layout not responsive for ${size.name}`);
      }
    }
  }

  async testErrorHandling() {
    // Test invalid input
    const ethInput = document.querySelector('input[type="number"]');
    if (ethInput) {
      ethInput.value = '-0.01';
      ethInput.dispatchEvent(new Event('input', { bubbles: true }));

      // Check if error handling works
      const buyButton = document.querySelector('button:contains("Buy")');
      if (buyButton && !buyButton.disabled) {
        throw new Error('Error handling not working - negative input should disable buy button');
      }
    }
  }

  async testContractData() {
    // Check if contract data is loading
    const dataElements = [
      'Total Supply',
      'Remaining',
      'Price per Token'
    ];

    for (const text of dataElements) {
      const element = document.querySelector(`*:contains("${text}")`);
      if (!element) {
        throw new Error(`Contract data element "${text}" not found`);
      }
    }
  }

  async runAllTests() {
    console.log('🚀 Starting NexaPay IDO Platform Tests...\n');

    await this.runTest('UI Elements Check', () => this.testUIElements());
    await this.runTest('Wallet Connection Elements', () => this.testWalletConnection());
    await this.runTest('Token Calculation', () => this.testTokenCalculation());
    await this.runTest('Progress Bars', () => this.testProgressBars());
    await this.runTest('Contract Data Loading', () => this.testContractData());
    await this.runTest('Error Handling', () => this.testErrorHandling());
    await this.runTest('Responsive Design', () => this.testResponsiveDesign());

    this.printSummary();
  }

  printSummary() {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    console.log(`Total Tests: ${this.testCount}`);
    console.log(`Passed: ${this.passCount}`);
    console.log(`Failed: ${this.failCount}`);
    console.log(`Success Rate: ${((this.passCount / this.testCount) * 100).toFixed(1)}%`);

    if (this.failCount > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`  - ${r.name}: ${r.error}`));
    }

    console.log('\n🎯 Test Complete!');
  }
}

// Helper function to find elements by text content
function findElementByText(selector, text) {
  const elements = document.querySelectorAll(selector);
  for (const el of elements) {
    if (el.textContent.includes(text)) {
      return el;
    }
  }
  return null;
}

// Extend querySelector to support :contains pseudo-selector
const originalQuerySelector = document.querySelector;
document.querySelector = function(selector) {
  if (selector.includes(':contains(')) {
    const [tag, text] = selector.split(':contains(');
    const cleanText = text.replace(')', '');
    return findElementByText(tag, cleanText);
  }
  return originalQuerySelector.call(this, selector);
};

// Run tests when script is loaded
const testSuite = new IDOTestSuite();
testSuite.runAllTests();

// Export for manual testing
window.IDOTestSuite = IDOTestSuite;
window.runIDOTests = () => testSuite.runAllTests();

console.log('\n💡 Manual Testing Commands:');
console.log('  - runIDOTests() - Run all tests again');
console.log('  - new IDOTestSuite().runAllTests() - Create new test instance');
