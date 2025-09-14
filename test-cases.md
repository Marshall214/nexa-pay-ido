# NexaPay IDO Platform - End-to-End Test Cases

---

## Test Environment Setup

### Prerequisites
- MetaMask wallet installed and configured
- Sepolia testnet added to MetaMask
- Sepolia ETH for gas fees
- Contract addresses deployed on Sepolia:
  - NexaPayToken: `0x9F3c1f6b8E837002b70fd0f08DEd66De25721EEF`
  - NPT_IDO: `0xB57755E1E3df243872644a75d021083Da05a6462`

### Test Data
- Test ETH amounts: 0.01, 0.1, 1
- Expected NPT rate: 1 ETH = 857 NPT
- Target fundraising: ₦700M
- ETH to Naira rate: 1 ETH = ₦1,500,000 (example rate)

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

### Test Case 1.5: Successful Wallet Disconnection
**Objective**: Disconnect MetaMask wallet successfully and verify UI changes.
**Steps**:
1. Connect wallet.
2. Click the "Power" icon (disconnect button) in the header.
3. Observe the UI.

**Expected Result**:
- Wallet disconnects successfully (frontend state cleared).
- "Connect Wallet" button reappears.
- Wallet address, ETH balance are no longer displayed.
- Purchase interface reverts to "Connect Your Wallet" message.
- Toast notification appears: "Wallet Disconnected. To completely disconnect, please go to your MetaMask extension -> Connected sites and remove this DApp."

### Test Case 1.6: Disconnect Button Tooltip
**Objective**: Verify the tooltip for the disconnect button.
**Steps**:
1. Connect wallet.
2. Hover over the "Power" icon (disconnect button) in the header.

**Expected Result**:
- A tooltip appears with the text "Disconnect Wallet".

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
- Tokens for sale: 200,000,000 NPT
- Tokens sold: Current sold amount
- Price per token: 857 NPT (per 1 ETH)
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

### Test Case 3.1: Valid ETH Purchase
**Objective**: Successfully purchase NPT tokens with ETH
**Steps**:
1. Connect wallet with ETH balance
2. Enter ETH amount: 0.01
3. Verify "Buy NPT Tokens" button is visible and enabled
4. Click "Buy NPT Tokens"
5. Confirm transaction in MetaMask

**Expected Result**:
- Transaction submitted successfully
- Transaction hash displayed
- Success toast: "Purchase Successful!"
- Data refreshes with new balances
- Transaction appears in history

### Test Case 3.2: Valid Purchase
**Objective**: Successfully purchase NPT tokens with ETH
**Steps**:
1. Connect wallet with ETH balance
2. Enter ETH amount: 0.01
3. Verify NPT amount calculation: 8.57 NPT
4. Click "Buy NPT Tokens"
5. Confirm transaction in MetaMask

**Expected Result**:
- Transaction submitted successfully
- Transaction hash displayed
- Success toast: "Purchase Successful!"
- Data refreshes with new balances
- Transaction appears in history

### Test Case 3.3: Invalid Amount - Zero ETH
**Objective**: Handle zero ETH amount
**Steps**:
1. Connect wallet
2. Enter ETH amount: 0
3. Verify "Buy NPT Tokens" button is disabled

**Expected Result**:
- "Buy NPT Tokens" button disabled
- No toast notifications for invalid amount

### Test Case 3.4: Invalid Amount - Negative ETH
**Objective**: Handle negative ETH amount
**Steps**:
1. Connect wallet
2. Enter ETH amount: -1
3. Verify "Buy NPT Tokens" button is disabled

**Expected Result**:
- "Buy NPT Tokens" button disabled
- No toast notifications for invalid amount

### Test Case 3.5: Insufficient ETH Balance
**Objective**: Handle insufficient ETH balance for purchase
**Steps**:
1. Connect wallet with low ETH balance
2. Enter ETH amount higher than balance
3. Verify "Buy NPT Tokens" button is disabled
4. Attempt to approve ETH (if button is enabled)

**Expected Result**:
- "Buy NPT Tokens" button disabled
- If approval attempted, Error toast: "Insufficient ETH balance"

### Test Case 3.6: Insufficient ETH Allowance
**Objective**: Handle insufficient ETH allowance for purchase
**Steps**:
1. Connect wallet with ETH balance, but allowance < purchase amount
2. Enter ETH amount
3. Verify "Approve ETH" button is visible and enabled
4. Verify "Buy NPT Tokens" button is disabled

**Expected Result**:
- "Approve ETH" button enabled
- "Buy NPT Tokens" button disabled
- Successful approval makes "Buy NPT Tokens" enabled

### Test Case 3.7: Different Purchase Amounts
**Objective**: Test various purchase amounts with ETH
**Test Data**:
- 0.01 ETH → 8.57 NPT
- 0.1 ETH → 85.7 NPT
- 1 ETH → 857 NPT

**Steps**:
1. Connect wallet with sufficient ETH balance
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
- 0.01 ETH → 8.57 NPT
- 0.1 ETH → 85.7 NPT
- 1 ETH → 857 NPT

**Steps**:
1. Enter each ETH amount
2. Verify calculated NPT amount

**Expected Result**:
- All calculations are accurate
- Formula: NPT = ETH_Amount * 857

### Test Case 6.2: Naira Conversion
**Objective**: Verify Naira value calculation
**Test Data**:
- 0.01 ETH → ₦15,000
- 0.1 ETH → ₦150,000
- 1 ETH → ₦1,500,000

**Steps**:
1. Enter each ETH amount
2. Verify Naira value display

**Expected Result**:
- All conversions accurate
- Formula: Naira = ETH_Amount × 1,500,000

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
**Objective**: Complete purchase flow from start to finish with ETH
**Steps**:
1. Open app
2. Connect wallet
3. Enter 0.01 ETH
4. Verify 8.57 NPT calculation
5. Click "Buy NPT Tokens" and confirm in MetaMask
6. Wait for confirmation
7. Verify balances updated
8. Check transaction on Etherscan

**Expected Result**:
- Complete flow works without errors
- All data updates correctly
- Transaction visible on blockchain

### Test Case 8.2: Multiple Purchases
**Objective**: Make multiple purchases in sequence with ETH
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
- [ ] Sepolia ETH for gas fees
- [ ] Contracts deployed and verified (NPT, IDO)
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
- [ ] Wallet connection and disconnection
- [ ] Token purchase (ETH acquisition)
- [ ] Data display (all contract data and balances)
- [ ] Transaction confirmation

### Important Features (Should Work)
- [ ] Multiple purchases
- [ ] Transaction history
- [ ] Error handling (user-friendly messages and recovery options)
- [ ] Responsive design

### Nice to Have (Could Work)
- [ ] Advanced error messages
- [ ] Performance optimizations
- [ ] Additional validations

---

## Test Data Summary

### Contract Addresses
- NexaPayToken: `0x9F3c1f6b8E837002b70fd0f08DEd66De25721EEF`
- NPT_IDO: `0xB57755E1E3df243872644a75d021083Da05a6462`

### Test Values
- ETH amounts: 0.01, 0.1, 1
- Expected NPT: 8.57, 85.7, 857 (based on 1 ETH = 857 NPT)
- Expected Naira: ₦15,000, ₦150,000, ₦1,500,000 (based on 1 ETH = ₦1,500,000)

### Network Details
- Network: Sepolia Testnet
- Chain ID: 11155111
- RPC: `https://sepolia.infura.io/v3/a43942b15b5c4e6385a88d4cb61f950d`
- Explorer: `https://sepolia.etherscan.io/`

---

## 📞 Conclusion

The NexaPay IDO Platform represents a comprehensive solution for conducting secure and transparent token sales. By combining cutting-edge Web3 technology with an intuitive user interface, the platform addresses key pain points in the DeFi space while providing a professional and engaging user experience.

The detailed requirements outlined in this PRD ensure that the platform meets both technical excellence and user experience standards, positioning it for successful adoption and long-term sustainability in the competitive DeFi marketplace.

---

*This document is version controlled and should be updated with any changes to requirements or scope. All stakeholders should review and approve changes before implementation.*
