// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZiraToken is ERC20Permit, Ownable {
    // msg.sender sözleşmenin ilk sahibi olur
    constructor()
        ERC20("Zira Token", "ZIRA")
        ERC20Permit("Zira Token")
        Ownable(msg.sender)          // <-- zorunlu güncelleme
    {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(_msgSender(), amount);
    }
}
