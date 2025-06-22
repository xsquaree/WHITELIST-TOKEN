// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WhitelistToken
 * @dev ERC20 Token with a whitelist mechanism.
 *      Only approved addresses can transfer or receive tokens.
 *      Supports permit() from EIP-2612 for gasless approvals.
 */
contract WhitelistToken is ERC20, ERC20Permit, Ownable {
    mapping(address => bool) public whitelist;

    /**
     * @dev Initializes the token, mints to the initial owner, sets ownership, and whitelists the initial owner.
     * @param initialOwner The address to receive initial supply and ownership.
     */
    constructor(address initialOwner)
        ERC20("Whitelist Token", "WLT")
        ERC20Permit("Whitelist Token")
    {
        _mint(initialOwner, 1_000_000 * 10 ** decimals());
        _transferOwnership(initialOwner);
        whitelist[initialOwner] = true;
    }

    /**
     * @dev Set whitelist status for an address.
     * @param account The address to whitelist/unwhitelist.
     * @param status Whether the address should be whitelisted.
     */
    function setWhitelist(address account, bool status) external onlyOwner {
        whitelist[account] = status;
    }

    /**
     * @dev Add an address to the whitelist.
     */
    function addToWhitelist(address account) external onlyOwner {
        whitelist[account] = true;
    }

    /**
     * @dev Remove an address from the whitelist.
     */
    function removeFromWhitelist(address account) external onlyOwner {
        whitelist[account] = false;
    }

    /**
     * @dev Modifier that checks both sender and recipient are whitelisted.
     */
    modifier onlyWhitelisted(address from, address to) {
        require(whitelist[from], "Sender is not whitelisted");
        require(whitelist[to], "Receiver is not whitelisted");
        _;
    }

    /**
     * @dev Overrides ERC20 transfer to include whitelist check.
     */
    function transfer(address to, uint256 amount)
        public
        override
        onlyWhitelisted(_msgSender(), to)
        returns (bool)
    {
        return super.transfer(to, amount);
    }

    /**
     * @dev Overrides ERC20 transferFrom to include whitelist check.
     */
    function transferFrom(address from, address to, uint256 amount)
        public
        override
        onlyWhitelisted(from, to)
        returns (bool)
    {
        return super.transferFrom(from, to, amount);
    }
}
