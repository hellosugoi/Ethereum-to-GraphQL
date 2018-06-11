pragma solidity ^0.4.24;

import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin {
  mapping (address => uint) balances;
  uint public candy;
  string public source;

  event Transfer(address indexed _from, address indexed _to, uint256 _value);

  constructor() public {
    balances[msg.sender] = 10000;
    candy = 6;
    source = "source";
  }

  function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
    if (balances[msg.sender] < amount) return false;
    balances[msg.sender] -= amount;
    balances[receiver] += amount;
    emit Transfer(msg.sender, receiver, amount);
    return true;
  }

  function getBalanceInEth(address addr) public returns(uint) {
    return ConvertLib.convert(getBalance(addr), 2);
  }

  function getBalance(address addr) public returns(uint) {
    return balances[addr];
  }

  function returns2(address addr, uint num) public returns(uint, bool) {
    return (balances[addr], true);
  }

  function other() public returns (string, bytes32, uint256) {
    return ("hey", 0x11, 600);
  }

}
