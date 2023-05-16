// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MyERC20Token.sol";

contract TokenSale is Ownable {
    uint256 public price;
    uint256 public ratio;
    MyERC20Token public paymentToken;

    constructor(
        uint256 _ratio,  
        MyERC20Token _paymentToken
    ){
        ratio = _ratio;
        paymentToken = MyERC20Token(_paymentToken);
    }

    function buyTokens() external payable {
        uint256 amount = msg.value * ratio;
        paymentToken.mint(msg.sender, amount);
    }

    function returnTokens(uint256 amount) external {
        paymentToken.burnFrom(msg.sender, amount);
        payable(msg.sender).transfer(amount / ratio);
    }
}
