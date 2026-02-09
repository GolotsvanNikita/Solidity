// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

library ResourceUtils
{
    function calculate_upgrade_cost(uint currentLevel, uint baseCost) internal pure returns (uint)
    {
        return baseCost * (currentLevel + 1);
    }

    function apply_discount(uint amount, uint discountPercent) internal pure returns (uint)
    {
        if (discountPercent >= 100) return 0;
        return amount - ((amount * discountPercent) / 100);
    }

    function has_enough_energy(uint currentEnergy, uint requiredAmount) internal pure returns (bool)
    {
        return currentEnergy >= requiredAmount;
    }
}