// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ZiraToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZiraVault is Ownable {
    ZiraToken public immutable ziraToken;
    address  public immutable metaWallet;

    mapping(address => uint256) public balances;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed to,   uint256 amount);

    constructor(address _ziraToken, address _metaWallet)
        Ownable(msg.sender)
    {
        require(_ziraToken != address(0) && _metaWallet != address(0), "zero addr");
        ziraToken  = ZiraToken(_ziraToken);
        metaWallet = _metaWallet;
    }

    /* ------------------------------------------------------------------ */
    /*  Doğrudan yatırma                                                  */
    /* ------------------------------------------------------------------ */
    function deposit(uint256 amount) external {
        require(amount > 0, "amount==0");
        require(
            ziraToken.transferFrom(msg.sender, address(this), amount),
            "transfer failed"
        );
        balances[msg.sender] += amount;
        emit Deposited(msg.sender, amount);
    }

    /* ------------------------------------------------------------------ */
    /*  Yalnızca MetaWallet’den yatırma                                   */
    /* ------------------------------------------------------------------ */
    function depositFor(address user, uint256 amount) external {
        require(msg.sender == metaWallet, "only meta-wallet");
        require(
            ziraToken.transferFrom(user, address(this), amount),
            "transfer failed"
        );
        balances[user] += amount;
        emit Deposited(user, amount);
    }

    /* ------------------------------------------------------------------ */
    /*  Çekim (sadece sahip)                                              */
    /* ------------------------------------------------------------------ */
    function withdraw(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "zero to");
        require(balances[to] >= amount, "insufficient stake");

        balances[to] -= amount;                 // 💡 kritik düzeltme
        require(
            ziraToken.transfer(to, amount),
            "withdraw failed"
        );
        emit Withdrawn(to, amount);
    }
}
