// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NPT_IDO is ReentrancyGuard, Ownable(msg.sender) {
    IERC20 public immutable token;   // Token being sold

    uint256 public tokensForSale;    // total NPT allocated for IDO
    uint256 public tokensSold;       // how many sold so far
    uint256 public tokensPerETH;     // how many tokens per 1 ETH

    mapping(address => uint256) public tokensPurchased;

    event Bought(address indexed buyer, uint256 ethAmount, uint256 tokensAmount);
    event Withdraw(address indexed to, uint256 ethAmount);
    event UnsoldTokensRecovered(address indexed to, uint256 amount);

    constructor(
        address tokenAddress,
        uint256 _tokensForSale,
        uint256 _tokensPerETH
    ) {
        require(tokenAddress != address(0), "invalid token");
        require(_tokensForSale > 0, "tokensForSale zero");
        require(_tokensPerETH > 0, "tokensPerETH zero");

        token = IERC20(tokenAddress);
        tokensForSale = _tokensForSale;
        tokensPerETH = _tokensPerETH;
    }

    // Buyer sends ETH directly to buy NPT
    function buy() external payable nonReentrant {
        require(msg.value > 0, "zero ETH sent");

        uint256 tokensAmount = (msg.value * tokensPerETH) / (10**18);
        require(tokensAmount > 0, "zero tokens to allocate");
        require(tokensSold + tokensAmount <= tokensForSale, "not enough tokens left");

        // Send project tokens to buyer
        bool ok = token.transfer(msg.sender, tokensAmount);
        require(ok, "token transfer failed");

        tokensPurchased[msg.sender] += tokensAmount;
        tokensSold += tokensAmount;

        emit Bought(msg.sender, msg.value, tokensAmount);
    }

    // Owner withdraws raised ETH
    function withdrawFunds(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "zero address");
        require(amount <= address(this).balance, "insufficient ETH");
        (bool sent, ) = to.call{value: amount}("");
        require(sent, "withdraw failed");
        emit Withdraw(to, amount);
    }

    // Recover leftover unsold NPT tokens
    function recoverUnsoldTokens(address to) external onlyOwner {
        uint256 contractBalance = token.balanceOf(address(this));
        if (contractBalance > 0) {
            bool ok = token.transfer(to, contractBalance);
            require(ok, "recover failed");
            emit UnsoldTokensRecovered(to, contractBalance);
        }
    }

    function tokensRemaining() external view returns (uint256) {
        return tokensForSale - tokensSold;
    }
}
