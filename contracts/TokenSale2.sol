// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSale2 is Ownable {
    using SafeERC20 for IERC20;

    // Token to be sold
    IERC20 public token;

    // Price per token in wei
    uint256 public tokenPrice;

    // Event to log token purchase
    event TokenPurchased(address buyer, uint256 amount, uint256 cost);

constructor(address _tokenAddress, uint256 _tokenPrice, address _initialOwner) Ownable(_initialOwner) {
    require(_tokenAddress != address(0), "Invalid token address");
    require(_tokenPrice > 0, "Token price must be greater than 0");

    token = IERC20(_tokenAddress);
    tokenPrice = _tokenPrice;
}

    // Function to allow users to purchase tokens
    function purchaseTokens(uint256 _amount) external payable {
        require(_amount > 0, "Amount must be greater than 0");
        require(msg.value == _amount * tokenPrice, "Incorrect Ether value");

        // Transfer tokens to the buyer
        token.safeTransfer(msg.sender, _amount);

        // Emit event
        emit TokenPurchased(msg.sender, _amount, msg.value);
    }

    // Function to withdraw Ether from the contract (only owner)
    function withdrawEther() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Function to withdraw ERC20 tokens from the contract (only owner)
    function withdrawTokens() external onlyOwner {
        token.safeTransfer(owner(), token.balanceOf(address(this)));
    }
}