// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "hardhat/console.sol";

contract Marketplace
{
    struct Product
    {
        string name;
        string description;
        address seller;
        uint timestamp;
        string imageUrl;
    }

    Product[] public products;

    function add_product(string memory _name, string memory _description, string memory _imageUrl) public
    {
        console.log("Adding new product...");
        console.log("Product Name:", _name);
        console.log("Seller Address:", msg.sender);

        products.push(Product
        ({
            name: _name,
            description: _description,
            seller: msg.sender,
            timestamp: block.timestamp,
            imageUrl: _imageUrl
        }));
    }

    function get_all_products() public view returns (Product[] memory)
    {
        return products;
    }
}