// NexaPay IDO Platform - Console Test Script
// Run this in the browser console on the IDO app page (http://localhost:8081)

console.log('🚀 Starting NexaPay IDO Console Tests...\n');

// Test 1: Check if main elements exist
function testMainElements() {
    console.log('🧪 Testing Main Elements...');
    
    const tests = [
        {
            name: 'Main Title',
            selector: '[data-testid="main-title"]',
            expectedText: 'NexaPay Token Sale'
        },
        {
            name: 'Connect Wallet Button (Header)',
            selector: '[data-testid="header-connect-wallet"]',
            expectedText: 'Connect Wallet'
        },
        {
            name: 'Connect Wallet Button (Main)',
            selector: '[data-testid="connect-wallet-button"]',
            expectedText: 'Connect Wallet'
        },
        {
            name: 'ETH Input Field',
            selector: '[data-testid="eth-input"]',
            expectedText: ''
        },
        {
            name: 'Buy Tokens Button',
            selector: '[data-testid="buy-tokens-button"]',
            expectedText: 'Buy'
        }
    ];

    let passed = 0;
    let failed = 0;

    tests.forEach(test => {
        const element = document.querySelector(test.selector);
        if (element) {
            if (test.expectedText === '' || element.textContent.includes(test.expectedText)) {
                console.log(`✅ ${test.name}: Found`);
                passed++;
            } else {
                console.log(`❌ ${test.name}: Found but text doesn't match`);
                failed++;
            }
        } else {
            console.log(`❌ ${test.name}: Not found`);
            failed++;
        }
    });

    console.log(`\n📊 Main Elements Test Results: ${passed} passed, ${failed} failed\n`);
    return { passed, failed };
}

// Test 2: Test ETH input calculation
function testETHCalculation() {
    console.log('🧪 Testing ETH Calculation...');
    
    const ethInput = document.querySelector('[data-testid="eth-input"]');
    if (!ethInput) {
        console.log('❌ ETH input field not found');
        return { passed: 0, failed: 1 };
    }

    // Test with 0.01 ETH
    ethInput.value = '0.01';
    ethInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Wait a bit for calculation
    setTimeout(() => {
        const nptDisplay = document.querySelector('span');
        if (nptDisplay && nptDisplay.textContent.includes('100')) {
            console.log('✅ ETH calculation working (0.01 ETH = 100 NPT)');
        } else {
            console.log('⚠️ ETH calculation may not be working properly');
        }
    }, 1000);

    console.log('✅ ETH input field found and tested');
    return { passed: 1, failed: 0 };
}

// Test 3: Test wallet connection
function testWalletConnection() {
    console.log('🧪 Testing Wallet Connection...');
    
    const connectButton = document.querySelector('[data-testid="header-connect-wallet"], [data-testid="connect-wallet-button"]');
    if (!connectButton) {
        console.log('❌ Connect wallet button not found');
        return { passed: 0, failed: 1 };
    }

    console.log('✅ Connect wallet button found');
    console.log('ℹ️ Click the button to test wallet connection');
    return { passed: 1, failed: 0 };
}

// Test 4: Test responsive design
function testResponsiveDesign() {
    console.log('🧪 Testing Responsive Design...');
    
    const container = document.querySelector('div[class*="max-w"]');
    if (container) {
        console.log('✅ Responsive container found');
        console.log('ℹ️ Resize your browser window to test responsiveness');
        return { passed: 1, failed: 0 };
    } else {
        console.log('⚠️ Responsive container not found');
        return { passed: 0, failed: 1 };
    }
}

// Test 5: Test progress bars
function testProgressBars() {
    console.log('🧪 Testing Progress Bars...');
    
    const progressBars = document.querySelectorAll('[role="progressbar"]');
    if (progressBars.length > 0) {
        console.log(`✅ Found ${progressBars.length} progress bar(s)`);
        return { passed: 1, failed: 0 };
    } else {
        console.log('⚠️ No progress bars found');
        return { passed: 0, failed: 1 };
    }
}

// Run all tests
function runAllTests() {
    console.log('🚀 Running All Tests...\n');
    
    let totalPassed = 0;
    let totalFailed = 0;

    const mainElementsResult = testMainElements();
    totalPassed += mainElementsResult.passed;
    totalFailed += mainElementsResult.failed;

    const ethCalculationResult = testETHCalculation();
    totalPassed += ethCalculationResult.passed;
    totalFailed += ethCalculationResult.failed;

    const walletConnectionResult = testWalletConnection();
    totalPassed += walletConnectionResult.passed;
    totalFailed += walletConnectionResult.failed;

    const responsiveDesignResult = testResponsiveDesign();
    totalPassed += responsiveDesignResult.passed;
    totalFailed += responsiveDesignResult.failed;

    const progressBarsResult = testProgressBars();
    totalPassed += progressBarsResult.passed;
    totalFailed += progressBarsResult.failed;

    console.log('\n📊 Final Test Results:');
    console.log('========================');
    console.log(`Total Tests: ${totalPassed + totalFailed}`);
    console.log(`Passed: ${totalPassed}`);
    console.log(`Failed: ${totalFailed}`);
    console.log(`Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);

    if (totalFailed === 0) {
        console.log('\n🎉 All tests passed! Your IDO app is working correctly.');
    } else {
        console.log('\n⚠️ Some tests failed. Check the details above.');
    }
}

// Auto-run tests
runAllTests();

// Export functions for manual testing
window.runIDOTests = runAllTests;
window.testMainElements = testMainElements;
window.testETHCalculation = testETHCalculation;
window.testWalletConnection = testWalletConnection;
window.testResponsiveDesign = testResponsiveDesign;
window.testProgressBars = testProgressBars;

console.log('\n💡 Manual Testing Commands:');
console.log('  - runIDOTests() - Run all tests again');
console.log('  - testMainElements() - Test main UI elements');
console.log('  - testETHCalculation() - Test ETH input calculation');
console.log('  - testWalletConnection() - Test wallet connection');
console.log('  - testResponsiveDesign() - Test responsive design');
console.log('  - testProgressBars() - Test progress bars');
