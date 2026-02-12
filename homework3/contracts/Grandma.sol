// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract Grandma
{
    address public grandma;
    uint public giftAmount;
    
    struct Grandchild
    {
        uint birthday;
        bool withdrawn;
        bool exists;
    }

    mapping(address => Grandchild) public grandchildren;

    event gift_withdrawn(address indexed beneficiary, uint amount);

    constructor(address[] memory _beneficiaries, uint[] memory _birthdays) payable
    {
        require(_beneficiaries.length == _birthdays.length, "Arrays length mismatch");
        require(_beneficiaries.length > 0, "No grandchildren specified");
        require(msg.value > 0, "Grandma needs to put some ETH");

        grandma = msg.sender;
        giftAmount = msg.value / _beneficiaries.length;

        for (uint i = 0; i < _beneficiaries.length; i++)
        {
            grandchildren[_beneficiaries[i]] = Grandchild
            ({
                birthday: _birthdays[i],
                withdrawn: false,
                exists: true
            });
        }
    }

    function withdraw_gift() external
    {
        Grandchild storage beneficiary = grandchildren[msg.sender];

        require(beneficiary.exists, "You aren`t my grandchild.");
        
        require(block.timestamp >= beneficiary.birthday, "Birthday hasn`t arrived yet");
        
        require(!beneficiary.withdrawn, "Gift already withdrawn");

        beneficiary.withdrawn = true;

        payable(msg.sender).transfer(giftAmount);

        emit gift_withdrawn(msg.sender, giftAmount);
    }
}