// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NPT_IDO is ReentrancyGuard, Ownable(msg.sender) {
    IERC20 public immutable token;   // Token being sold
    IERC20 public immutable pusd;    // PUSD stablecoin used for payment

    uint256 public tokensForSale;
    uint256 public tokensSold;
    uint256 public tokensPerPUSD; // how many project tokens per 1 PUSD

    mapping(address => uint256) public tokensPurchased;

    event Bought(address indexed buyer, uint256 pusdAmount, uint256 tokensAmount);
    event Withdraw(address indexed to, uint256 pusdAmount);
    event UnsoldTokensRecovered(address indexed to, uint256 amount);

    constructor(
        address tokenAddress,
        address pusdAddress,
        uint256 _tokensForSale,
        uint256 _tokensPerPUSD
    ) {
        require(tokenAddress != address(0), "invalid token");
        require(pusdAddress != address(0), "invalid PUSD");
        require(_tokensForSale > 0, "tokensForSale zero");
        require(_tokensPerPUSD > 0, "tokensPerPUSD zero");

        token = IERC20(tokenAddress);
        pusd = IERC20(pusdAddress);
        tokensForSale = _tokensForSale;
        tokensPerPUSD = _tokensPerPUSD;
    }

    // Buyer calls this after approving PUSD
    function buy(uint256 pusdAmount) external nonReentrant {
        require(pusdAmount > 0, "zero PUSD");

        uint256 tokensAmount = pusdAmount * tokensPerPUSD;
        require(tokensAmount > 0, "zero tokens to allocate");
        require(tokensSold + tokensAmount <= tokensForSale, "not enough tokens left");

        // Transfer PUSD from buyer to contract
        bool ok1 = pusd.transferFrom(msg.sender, address(this), pusdAmount);
        require(ok1, "PUSD transfer failed");

        // Send project tokens to buyer
        bool ok2 = token.transfer(msg.sender, tokensAmount);
        require(ok2, "token transfer failed");

        tokensPurchased[msg.sender] += tokensAmount;
        tokensSold += tokensAmount;

        emit Bought(msg.sender, pusdAmount, tokensAmount);
    }

    function withdrawFunds(address to, uint256 pusdAmount) external onlyOwner {
        require(to != address(0), "zero address");
        require(pusdAmount <= pusd.balanceOf(address(this)), "insufficient PUSD");
        bool sent = pusd.transfer(to, pusdAmount);
        require(sent, "withdraw failed");
        emit Withdraw(to, pusdAmount);
    }

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
