# NexaPay IDO Platform - End-to-End Test Cases

---

## Test Environment Setup

### Prerequisites
- MetaMask wallet installed and configured
- Sepolia testnet added to MetaMask
- Sepolia ETH for gas fees (only for transaction gas, not for token purchase)
- PUSD Test Tokens for purchasing NPT
- Contract addresses deployed on Sepolia:
  - NexaPayToken: `0x806D505157a9858a8b533b4d6715e7a19C62C1a4`
  - NPT_IDO: `0x47D6d06d34aA875e01d556c29f98e9E6841d9779`
  - PUSD_TOKEN: `0x1099937F106CD6E182E318391C3E45044FDFd126`

### Test Data
- Test PUSD amounts: 1, 10, 100
- Expected NPT rate: 1 PUSD = 200 NPT
- Target fundraising: ₦700M
- PUSD to Naira rate: 1 PUSD = ₦1500 (example rate)

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
- Wallet address, ETH balance, and PUSD balance are no longer displayed.
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
- Price per token: 200 NPT (per 1 PUSD)
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

### Test Case 3.1: Valid PUSD Approval
**Objective**: Successfully approve PUSD for the IDO contract
**Steps**:
1. Connect wallet with PUSD balance
2. Enter PUSD amount: 100
3. Verify "Approve PUSD" button is visible and enabled
4. Click "Approve PUSD"
5. Confirm transaction in MetaMask

**Expected Result**:
- Transaction submitted successfully
- Transaction hash displayed
- Success toast: "Approval Successful"
- "Buy NPT Tokens" button becomes enabled (if conditions met)

### Test Case 3.2: Valid Purchase
**Objective**: Successfully purchase NPT tokens with approved PUSD
**Steps**:
1. Connect wallet with PUSD balance and sufficient allowance (from 3.1)
2. Enter PUSD amount: 1
3. Verify NPT amount calculation: 200 NPT
4. Click "Buy NPT Tokens"
5. Confirm transaction in MetaMask

**Expected Result**:
- Transaction submitted successfully
- Transaction hash displayed
- Success toast: "Purchase Successful!"
- Data refreshes with new balances
- Transaction appears in history

### Test Case 3.3: Invalid Amount - Zero PUSD
**Objective**: Handle zero PUSD amount
**Steps**:
1. Connect wallet
2. Enter PUSD amount: 0
3. Verify "Approve PUSD" and "Buy NPT Tokens" buttons are disabled

**Expected Result**:
- Both buttons remain disabled
- No toast notifications for invalid amount

### Test Case 3.4: Invalid Amount - Negative PUSD
**Objective**: Handle negative PUSD amount
**Steps**:
1. Connect wallet
2. Enter PUSD amount: -1
3. Verify "Approve PUSD" and "Buy NPT Tokens" buttons are disabled

**Expected Result**:
- Both buttons remain disabled
- No toast notifications for invalid amount

### Test Case 3.5: Insufficient PUSD Balance
**Objective**: Handle insufficient PUSD balance for purchase
**Steps**:
1. Connect wallet with low PUSD balance
2. Enter PUSD amount higher than balance
3. Verify "Buy NPT Tokens" button is disabled
4. Attempt to approve PUSD (if button is enabled)

**Expected Result**:
- "Buy NPT Tokens" button disabled
- If approval attempted, Error toast: "Insufficient PUSD balance"

### Test Case 3.6: Insufficient PUSD Allowance
**Objective**: Handle insufficient PUSD allowance for purchase
**Steps**:
1. Connect wallet with PUSD balance, but allowance < purchase amount
2. Enter PUSD amount
3. Verify "Approve PUSD" button is visible and enabled
4. Verify "Buy NPT Tokens" button is disabled

**Expected Result**:
- "Approve PUSD" button enabled
- "Buy NPT Tokens" button disabled
- Successful approval makes "Buy NPT Tokens" enabled

### Test Case 3.7: Different Purchase Amounts
**Objective**: Test various purchase amounts with PUSD
**Test Data**:
- 1 PUSD → 200 NPT
- 10 PUSD → 2,000 NPT
- 100 PUSD → 20,000 NPT

**Steps**:
1. Connect wallet with sufficient PUSD balance
2. Approve sufficient PUSD for each amount (or one large approval)
3. For each amount, enter value and verify calculation
4. Complete purchase

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
- 1 PUSD → 200 NPT
- 10 PUSD → 2,000 NPT
- 100 PUSD → 20,000 NPT

**Steps**:
1. Enter each PUSD amount
2. Verify calculated NPT amount

**Expected Result**:
- All calculations are accurate
- Formula: NPT = PUSD_Amount * 200

### Test Case 6.2: Naira Conversion
**Objective**: Verify Naira value calculation
**Test Data**:
- 1 PUSD → ₦1,500
- 10 PUSD → ₦15,000
- 100 PUSD → ₦150,000

**Steps**:
1. Enter each PUSD amount
2. Verify Naira value display

**Expected Result**:
- All conversions accurate
- Formula: Naira = PUSD_Amount × 1,500

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
**Objective**: Complete purchase flow from start to finish with PUSD
**Steps**:
1. Open app
2. Connect wallet
3. Enter 10 PUSD
4. Verify 2,000 NPT calculation
5. Click "Approve PUSD" and confirm in MetaMask
6. Click "Buy NPT Tokens" and confirm in MetaMask
7. Wait for confirmation
8. Verify balances updated
9. Check transaction on Etherscan

**Expected Result**:
- Complete flow works without errors
- All data updates correctly
- Transaction visible on blockchain

### Test Case 8.2: Multiple Purchases
**Objective**: Make multiple purchases in sequence with PUSD
**Steps**:
1. Connect wallet
2. Approve sufficient PUSD for multiple purchases (e.g., 100 PUSD)
3. Make purchase 1: 10 PUSD
4. Wait for confirmation
5. Make purchase 2: 5 PUSD
6. Wait for confirmation
7. Verify both transactions in history

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
- [ ] Sepolia ETH for gas fees (only for transaction gas, not for token purchase)
- [ ] PUSD Test Tokens obtained (for purchases)
- [ ] Contracts deployed and verified (NPT, IDO, PUSD)
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
- [ ] Token purchase (PUSD approval and NPT acquisition)
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
- NexaPayToken: `0x806D505157a9858a8b533b4d6715e7a19C62C1a4`
- NPT_IDO: `0x47D6d06d34aA875e01d556c29f98e9E6841d9779`
- PUSD_TOKEN: `0x1099937F106CD6E182E318391C3E45044FDFd126`

### Test Values
- PUSD amounts: 1, 10, 100
- Expected NPT: 200, 2,000, 20,000 (based on 1 PUSD = 200 NPT)
- Expected Naira: ₦1,500, ₦15,000, ₦150,000 (based on 1 PUSD = ₦1500)

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
