// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "lib/ResourceUtils.sol";

contract ResourceManager
{
    using ResourceUtils for uint;

    mapping(address => uint) public gold;
    mapping(address => uint) public energy;
    mapping(address => uint) public buildingLevel;

    uint public constant BASE_UPGRADE_COST = 100;

    constructor()
    {
        gold[msg.sender] = 1000;
        energy[msg.sender] = 50;
    }

    function upgrade_building() public
    {
        uint currentLevel = buildingLevel[msg.sender];
        
        uint cost = currentLevel.calculate_upgrade_cost(BASE_UPGRADE_COST);

        require(gold[msg.sender] >= cost, "Not enough gold");
        
        gold[msg.sender] -= cost;
        buildingLevel[msg.sender]++;
    }

    function buy_item_with_discount(uint price, uint discount) public
    {
        uint finalPrice = price.apply_discount(discount);
        
        require(gold[msg.sender] >= finalPrice, "Not enough gold");
        gold[msg.sender] -= finalPrice;
    }

    function perform_action(uint energyCost) public
    {
        require(ResourceUtils.has_enough_energy(energy[msg.sender], energyCost), "Low energy");
        energy[msg.sender] -= energyCost;
    }
}