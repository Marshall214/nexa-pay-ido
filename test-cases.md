# NexaPay IDO Platform - End-to-End Test Cases

## Test Environment Setup

### Prerequisites
- MetaMask wallet installed and configured
- Sepolia testnet added to MetaMask
- Sepolia ETH for testing (get from faucets)
- Contract addresses deployed on Sepolia:
  - NexaPayToken: `0x0a5385Af31C7b9deEeAb6cEabacC3e1244920246`
  - NPT_IDO: `0xBD0Df2f72d89a5F3E5E96A9902eFc207aA730090`

### Test Data
- Test ETH amounts: 0.001, 0.01, 0.1, 1.0
- Expected NPT rate: 1 ETH = 10,000 NPT (0.0001 ETH per NPT)
- Target fundraising: ₦500M
- ETH to Naira rate: 1 ETH = ₦2.5M

---

## 1. WALLET CONNECTION TESTS

### Test Case 1.1: Initial State
**Objective**: Verify app loads without wallet connected
**Steps**:
1. Open app in browser
2. Verify "Connect Wallet" button is visible
3. Verify no wallet address is displayed
4. Verify purchase interface shows "Connect Your Wallet" message

**Expected Result**: 
- App loads successfully
- Connect Wallet button is enabled
- No wallet information displayed

### Test Case 1.2: Successful Wallet Connection
**Objective**: Connect MetaMask wallet successfully
**Steps**:
1. Click "Connect Wallet" button
2. MetaMask popup appears
3. Select account and click "Connect"
4. Approve connection

**Expected Result**:
- Wallet connects successfully
- Wallet address displayed in header (truncated format)
- Purchase interface becomes available
- Toast notification: "Wallet Connected"

### Test Case 1.3: Wallet Connection Rejection
**Objective**: Handle user rejection of wallet connection
**Steps**:
1. Click "Connect Wallet" button
2. MetaMask popup appears
3. Click "Cancel" or reject connection

**Expected Result**:
- Connection is rejected
- App remains in disconnected state
- Error toast: "Connection Failed"

### Test Case 1.4: No MetaMask Installed
**Objective**: Handle missing MetaMask extension
**Steps**:
1. Disable MetaMask extension
2. Refresh page
3. Click "Connect Wallet"

**Expected Result**:
- Error message: "MetaMask not detected"
- Instructions to install MetaMask

---

## 2. CONTRACT DATA LOADING TESTS

### Test Case 2.1: Token Data Loading
**Objective**: Verify token information loads correctly
**Steps**:
1. Connect wallet
2. Wait for data to load

**Expected Result**:
- Token name: "NexaPay Token"
- Token symbol: "NPT"
- Token decimals: 18
- Total supply displayed correctly
- User's NPT balance displayed

### Test Case 2.2: IDO Data Loading
**Objective**: Verify IDO sale information loads correctly
**Steps**:
1. Connect wallet
2. Wait for data to load

**Expected Result**:
- Tokens for sale: 1,000,000 NPT
- Tokens sold: Current sold amount
- Price per token: 0.0001 ETH
- Sale progress bar updates
- Remaining tokens calculated correctly

### Test Case 2.3: Data Refresh
**Objective**: Verify data refreshes after transactions
**Steps**:
1. Connect wallet
2. Make a purchase
3. Wait for transaction confirmation

**Expected Result**:
- All data updates automatically
- Tokens sold increases
- User balance updates
- Progress bar updates

---

## 3. TOKEN PURCHASE TESTS

### Test Case 3.1: Valid Purchase
**Objective**: Successfully purchase NPT tokens
**Steps**:
1. Connect wallet
2. Enter ETH amount: 0.01
3. Verify NPT amount calculation: 100 NPT
4. Click "Buy NPT Tokens"
5. Confirm transaction in MetaMask

**Expected Result**:
- Transaction submitted successfully
- Transaction hash displayed
- Success toast: "Purchase Successful!"
- Data refreshes with new balances
- Transaction appears in history

### Test Case 3.2: Invalid Amount - Zero
**Objective**: Handle zero ETH amount
**Steps**:
1. Connect wallet
2. Enter ETH amount: 0
3. Click "Buy NPT Tokens"

**Expected Result**:
- Error toast: "Invalid Amount"
- Transaction not submitted
- Button remains disabled

### Test Case 3.3: Invalid Amount - Negative
**Objective**: Handle negative ETH amount
**Steps**:
1. Connect wallet
2. Enter ETH amount: -0.01
3. Click "Buy NPT Tokens"

**Expected Result**:
- Error toast: "Invalid Amount"
- Transaction not submitted

### Test Case 3.4: Insufficient Balance
**Objective**: Handle insufficient ETH balance
**Steps**:
1. Connect wallet with low balance
2. Enter ETH amount higher than balance
3. Click "Buy NPT Tokens"

**Expected Result**:
- Error toast: "Insufficient Balance"
- Transaction not submitted

### Test Case 3.5: Different Purchase Amounts
**Objective**: Test various purchase amounts
**Test Data**:
- 0.001 ETH → 10 NPT
- 0.01 ETH → 100 NPT
- 0.1 ETH → 1,000 NPT
- 1.0 ETH → 10,000 NPT

**Steps**:
1. Connect wallet
2. For each amount, enter value and verify calculation
3. Complete purchase

**Expected Result**:
- All calculations correct
- All purchases successful
- Balances update correctly

---

## 4. UI/UX TESTS

### Test Case 4.1: Responsive Design
**Objective**: Verify app works on different screen sizes
**Steps**:
1. Test on desktop (1920x1080)
2. Test on tablet (768x1024)
3. Test on mobile (375x667)

**Expected Result**:
- Layout adapts correctly
- All elements visible and clickable
- No horizontal scrolling

### Test Case 4.2: Loading States
**Objective**: Verify loading indicators work correctly
**Steps**:
1. Connect wallet (should show "Connecting...")
2. Make purchase (should show "Processing...")
3. Wait for data refresh

**Expected Result**:
- Loading states display correctly
- Buttons disabled during loading
- Spinner animations work

### Test Case 4.3: Error Handling
**Objective**: Verify error messages display correctly
**Steps**:
1. Test various error scenarios
2. Verify error toasts appear
3. Verify error states clear properly

**Expected Result**:
- Error messages clear and helpful
- Error states don't persist
- User can retry after errors

---

## 5. TRANSACTION HISTORY TESTS

### Test Case 5.1: Transaction Display
**Objective**: Verify transaction history displays correctly
**Steps**:
1. Make multiple purchases
2. Check transaction history section

**Expected Result**:
- All transactions appear in history
- Transaction hashes displayed (truncated)
- Amounts and status shown correctly
- Copy button works for transaction hashes

### Test Case 5.2: Transaction Status
**Objective**: Verify transaction status updates
**Steps**:
1. Make a purchase
2. Watch transaction status change

**Expected Result**:
- Initial status: "pending" with spinner
- Final status: "success" with checkmark
- Failed transactions show "error" with alert icon

---

## 6. CALCULATION TESTS

### Test Case 6.1: NPT Calculation
**Objective**: Verify NPT amount calculation
**Test Data**:
- 0.001 ETH → 10 NPT
- 0.01 ETH → 100 NPT
- 0.1 ETH → 1,000 NPT
- 1.0 ETH → 10,000 NPT

**Steps**:
1. Enter each ETH amount
2. Verify calculated NPT amount

**Expected Result**:
- All calculations are accurate
- Formula: NPT = ETH / 0.0001

### Test Case 6.2: Naira Conversion
**Objective**: Verify Naira value calculation
**Test Data**:
- 0.001 ETH → ₦2,500
- 0.01 ETH → ₦25,000
- 0.1 ETH → ₦250,000
- 1.0 ETH → ₦2,500,000

**Steps**:
1. Enter each ETH amount
2. Verify Naira value display

**Expected Result**:
- All conversions accurate
- Formula: Naira = ETH × 2,500,000

### Test Case 6.3: Progress Calculation
**Objective**: Verify progress bar calculations
**Steps**:
1. Check initial progress
2. Make purchases
3. Verify progress updates

**Expected Result**:
- Progress = (Tokens Sold / Total Supply) × 100
- Progress bar updates correctly
- Percentage display accurate

---

## 7. EDGE CASE TESTS

### Test Case 7.1: Maximum Purchase
**Objective**: Test maximum allowed purchase
**Steps**:
1. Check max contribution limit in contract
2. Attempt to purchase maximum amount
3. Verify transaction succeeds

**Expected Result**:
- Maximum purchase allowed
- No errors for valid maximum

### Test Case 7.2: Minimum Purchase
**Objective**: Test minimum required purchase
**Steps**:
1. Check min contribution limit in contract
2. Attempt to purchase minimum amount
3. Verify transaction succeeds

**Expected Result**:
- Minimum purchase allowed
- No errors for valid minimum

### Test Case 7.3: Sale Paused
**Objective**: Handle paused sale state
**Steps**:
1. Pause sale via contract (admin function)
2. Attempt to make purchase
3. Verify error handling

**Expected Result**:
- Error message: "Sale is paused"
- Purchase blocked
- UI shows paused state

### Test Case 7.4: Sale Ended
**Objective**: Handle ended sale state
**Steps**:
1. Wait for sale end time
2. Attempt to make purchase
3. Verify error handling

**Expected Result**:
- Error message: "Sale has ended"
- Purchase blocked
- UI shows ended state

---

## 8. INTEGRATION TESTS

### Test Case 8.1: End-to-End Purchase Flow
**Objective**: Complete purchase flow from start to finish
**Steps**:
1. Open app
2. Connect wallet
3. Enter 0.01 ETH
4. Verify 100 NPT calculation
5. Click buy
6. Confirm in MetaMask
7. Wait for confirmation
8. Verify balances updated
9. Check transaction on Etherscan

**Expected Result**:
- Complete flow works without errors
- All data updates correctly
- Transaction visible on blockchain

### Test Case 8.2: Multiple Purchases
**Objective**: Make multiple purchases in sequence
**Steps**:
1. Connect wallet
2. Make purchase 1: 0.01 ETH
3. Wait for confirmation
4. Make purchase 2: 0.005 ETH
5. Wait for confirmation
6. Verify both transactions in history

**Expected Result**:
- Both purchases successful
- Balances cumulative
- History shows both transactions

### Test Case 8.3: Network Switching
**Objective**: Handle network switching
**Steps**:
1. Connect wallet on Sepolia
2. Switch to mainnet in MetaMask
3. Attempt to use app
4. Switch back to Sepolia

**Expected Result**:
- App detects wrong network
- Shows network error
- Works when back on Sepolia

---

## 9. PERFORMANCE TESTS

### Test Case 9.1: Load Time
**Objective**: Verify app loads quickly
**Steps**:
1. Open app in browser
2. Measure load time
3. Check for any delays

**Expected Result**:
- App loads within 3 seconds
- No significant delays
- Smooth user experience

### Test Case 9.2: Data Refresh Performance
**Objective**: Verify data refreshes quickly
**Steps**:
1. Connect wallet
2. Make purchase
3. Measure refresh time

**Expected Result**:
- Data refreshes within 5 seconds
- No significant delays
- Smooth updates

---

## 10. SECURITY TESTS

### Test Case 10.1: Input Validation
**Objective**: Verify input validation works
**Steps**:
1. Try entering invalid characters
2. Try entering extremely large numbers
3. Try entering negative numbers

**Expected Result**:
- Invalid inputs rejected
- No crashes or errors
- Proper error messages

### Test Case 10.2: Transaction Security
**Objective**: Verify transactions are secure
**Steps**:
1. Make purchase
2. Verify transaction details in MetaMask
3. Check transaction on Etherscan

**Expected Result**:
- Transaction details correct
- No unexpected contract calls
- Gas fees reasonable

---

## Test Execution Checklist

### Pre-Test Setup
- [ ] MetaMask installed and configured
- [ ] Sepolia testnet added
- [ ] Sepolia ETH obtained
- [ ] Contracts deployed and verified
- [ ] App running on localhost

### Test Execution
- [ ] Run all wallet connection tests
- [ ] Run all contract data tests
- [ ] Run all purchase tests
- [ ] Run all UI/UX tests
- [ ] Run all calculation tests
- [ ] Run all edge case tests
- [ ] Run all integration tests
- [ ] Run all performance tests
- [ ] Run all security tests

### Post-Test
- [ ] Document any bugs found
- [ ] Verify all critical paths work
- [ ] Check transaction history
- [ ] Verify contract state
- [ ] Clean up test data

---

## Bug Reporting Template

### Bug Report Format
```
**Bug ID**: [Unique identifier]
**Severity**: [Critical/High/Medium/Low]
**Test Case**: [Which test case failed]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result**: [What should happen]
**Actual Result**: [What actually happened]
**Screenshots**: [If applicable]
**Browser/OS**: [Browser version and OS]
**Wallet**: [MetaMask version]
**Network**: [Sepolia]
```

---

## Success Criteria

### Critical Paths (Must Work)
- [ ] Wallet connection
- [ ] Token purchase
- [ ] Data display
- [ ] Transaction confirmation

### Important Features (Should Work)
- [ ] Multiple purchases
- [ ] Transaction history
- [ ] Error handling
- [ ] Responsive design

### Nice to Have (Could Work)
- [ ] Advanced error messages
- [ ] Performance optimizations
- [ ] Additional validations

---

## Test Data Summary

### Contract Addresses
- NexaPayToken: `0x0a5385Af31C7b9deEeAb6cEabacC3e1244920246`
- NPT_IDO: `0xBD0Df2f72d89a5F3E5E96A9902eFc207aA730090`

### Test Values
- ETH amounts: 0.001, 0.01, 0.1, 1.0
- Expected NPT: 10, 100, 1,000, 10,000
- Expected Naira: ₦2,500, ₦25,000, ₦250,000, ₦2,500,000

### Network Details
- Network: Sepolia Testnet
- Chain ID: 11155111
- RPC: https://sepolia.infura.io/v3/YOUR_KEY
- Explorer: https://sepolia.etherscan.io/
