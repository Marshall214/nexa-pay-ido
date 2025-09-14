// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NexaPayToken is ERC20, Ownable {
    constructor() ERC20("NexaPay Token", "NPT") Ownable(msg.sender) {
        // Mint 1 billion NPT (with 18 decimals) to deployer
        _mint(msg.sender, 1_000_000_000 * 10 ** decimals());
    }
}
