// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NPT_IDO is ReentrancyGuard, Ownable {
    IERC20 public immutable token;
    uint256 public tokensForSale;
    uint256 public tokensSold;
    uint256 public tokensPerEth;

    bool public paused;

    uint256 public minContributionWei;
    uint256 public maxContributionWei;

    bool public useWhitelist;
    mapping(address => bool) public whitelist;

    mapping(address => uint256) public contributions;
    mapping(address => uint256) public tokensPurchased;

    event Bought(address indexed buyer, uint256 weiAmount, uint256 tokensAmount);
    event Withdraw(address indexed to, uint256 amountWei);
    event UnsoldTokensRecovered(address indexed to, uint256 amount);
    event WhitelistUpdated(address indexed account, bool allowed);

    constructor(
        address tokenAddress,
        uint256 _tokensForSale,
        uint256 _tokensPerEth
    ) Ownable(msg.sender) {
        require(tokenAddress != address(0), "invalid token");
        require(_tokensForSale > 0, "tokensForSale zero");
        require(_tokensPerEth > 0, "tokensPerEth zero");

        token = IERC20(tokenAddress);
        tokensForSale = _tokensForSale;
        tokensPerEth = _tokensPerEth;

        minContributionWei = 0;
        maxContributionWei = type(uint256).max;
        useWhitelist = false;
    }

    modifier onlyWhileOpen() {
        require(!paused, "paused");
        _;
    }

    receive() external payable {
        buy();
    }

    fallback() external payable {
        buy();
    }

    function buy() public payable nonReentrant onlyWhileOpen {
        require(msg.value > 0, "zero ETH");
        if (useWhitelist) {
            require(whitelist[msg.sender], "not whitelisted");
        }

        uint256 newContribution = contributions[msg.sender] + msg.value;
        require(newContribution >= minContributionWei, "below min");
        require(newContribution <= maxContributionWei, "above max");

        uint256 tokensAmount = (msg.value * tokensPerEth) / 1 ether;
        require(tokensAmount > 0, "zero tokens to allocate");
        require(tokensSold + tokensAmount <= tokensForSale, "not enough tokens left");

        contributions[msg.sender] = newContribution;
        tokensPurchased[msg.sender] += tokensAmount;
        tokensSold += tokensAmount;

        bool ok = token.transfer(msg.sender, tokensAmount);
        require(ok, "token transfer failed");

        emit Bought(msg.sender, msg.value, tokensAmount);
    }

    function withdrawFunds(address payable to, uint256 amountWei) external onlyOwner {
        require(to != address(0), "zero address");
        require(amountWei <= address(this).balance, "insufficient balance");
        (bool sent, ) = to.call{value: amountWei}("");
        require(sent, "withdraw failed");
        emit Withdraw(to, amountWei);
    }

    function recoverUnsoldTokens(address to) external onlyOwner {
        uint256 contractBalance = token.balanceOf(address(this));
        if (contractBalance > 0) {
            bool ok = token.transfer(to, contractBalance);
            require(ok, "recover failed");
            emit UnsoldTokensRecovered(to, contractBalance);
        }
    }

    function setPaused(bool p) external onlyOwner {
        paused = p;
    }

    function setContributionLimits(uint256 minWei, uint256 maxWei) external onlyOwner {
        require(minWei <= maxWei, "bad limits");
        minContributionWei = minWei;
        maxContributionWei = maxWei;
    }

    function setTokensPerEth(uint256 _tokensPerEth) external onlyOwner {
        require(_tokensPerEth > 0, "zero price");
        tokensPerEth = _tokensPerEth;
    }

    function setUseWhitelist(bool flag) external onlyOwner {
        useWhitelist = flag;
    }

    function updateWhitelist(address account, bool allowed) external onlyOwner {
        whitelist[account] = allowed;
        emit WhitelistUpdated(account, allowed);
    }

    function batchUpdateWhitelist(address[] calldata accounts, bool allowed) external onlyOwner {
        for (uint i = 0; i < accounts.length; i++) {
            whitelist[accounts[i]] = allowed;
            emit WhitelistUpdated(accounts[i], allowed);
        }
    }

    function tokensRemaining() external view returns (uint256) {
        return tokensForSale - tokensSold;
    }
}
