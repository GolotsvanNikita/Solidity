// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;


contract WarriorGuild
{
    mapping(address => bool) public isRegistered;
    string public guildName = "Heroes Guild";

    function register() public
    {
        require(!isRegistered[msg.sender], "Already registered");
        isRegistered[msg.sender] = true;
    }

    function attack() public pure virtual returns (string memory, uint)
    {
        return ("Basic punch", 10);
    }
}

contract Knight is WarriorGuild
{
    function attack() public pure override returns (string memory, uint)
    {
        return ("Sword Slash", 50);
    }

    function shieldBash() public pure returns (string memory)
    {
        return "Stunned enemy";
    }
}

contract Mage is WarriorGuild
{
    function attack() public pure override returns (string memory, uint)
    {
        return ("Fireball", 80);
    }

    function castHeal() public pure returns (string memory)
    {
        return "Restored 20 HP";
    }
}

contract Assassin is WarriorGuild
{
    function attack() public pure override returns (string memory, uint)
    {
        return ("Backstab", 150);
    }
    
    function stealth() public pure returns (string memory)
    {
        return "Invisible now";
    }
}