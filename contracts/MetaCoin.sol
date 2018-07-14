pragma solidity ^0.4.18;

import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin {
  enum EnumChoice { zero, first, second, third }
  EnumChoice ec; 
  mapping (address => uint) balances;
  uint public candy;
  string public source;
  address owner;

  event Transfer(address indexed _from, address indexed _to, uint256 _value);

  function MetaCoin() public {
    balances[msg.sender] = 10000;
    candy = 6;
    source = "source";
    owner = msg.sender;
  }

  function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
    if (balances[msg.sender] < amount) return false;
    balances[msg.sender] -= amount;
    balances[receiver] += amount;
    Transfer(msg.sender, receiver, amount);
    return true;
  }

  function getBalanceInEth(address addr) public returns(uint) {
    return ConvertLib.convert(getBalance(addr), 2);
  }

  function getBalance(address addr) public view returns(uint) {
    return balances[addr];
  }

  function returns2(address addr, uint num) public view returns(uint, bool) {
    return (balances[addr], true);
  }

  function returns2Bools(address addr, uint num) public view returns(bool, bool) {
    return (false, true);
  }

  function returns3() public pure returns (string, bytes32, uint256) {
    return ("hey", 0x11, 600);
  }

  function returnsSingleUint8() public pure returns (uint8) {
    return 11;
  }

  function returnsSingleByte32() public pure returns (bytes32) {
    return 'hello';
  }

  function returnsArrayInt() public pure returns (uint[]) {
    uint[] memory tmp = new uint[](2);
    tmp[0] = 2;
    tmp[1] = 5;
    return tmp;
  }

  function returnsArrayAddresses() public pure returns(address[]) {
    address[] memory tmp = new address[](3);
    tmp[0] = 0x04;
    tmp[1] = 0x07;
    tmp[2] = 0x09;
    return tmp;
  }

  function returnsArrayBytes() public pure returns(bytes32[]) {
    bytes32[] memory tmp = new bytes32[](3);
    tmp[0] = "uno";
    tmp[1] = "dos";
    tmp[2] = "tres";
    return tmp;
  }

  function returnsNamedInt() public pure returns(uint32 tweleve) {
    tweleve = 12;
  }

  function returnsMixedNamedInt() public pure returns(uint16 num, uint32) {
    num = 13;
    return (num, 14);
  }

  function returnsaddress() public view returns(address) {
    return owner;
  }

  function returnsEnum() public view returns(int) {
    return int(EnumChoice.third);
  }


}
