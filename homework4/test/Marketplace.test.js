const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace", function ()
{
  async function deployFixture()
  {
    const [owner, seller1, seller2] = await ethers.getSigners();
    const marketplace = await ethers.getContractFactory("Marketplace");
    const contract = await marketplace.deploy();
    return { contract, owner, seller1, seller2 };
  }

  it("Will add products and display them in a table", async function ()
  {
    const { contract, seller1, seller2 } = await loadFixture(deployFixture);

    await contract.connect(seller1).add_product("MacBook Pro", "Laptop", "https://MacBook");
    await contract.connect(seller2).add_product("Tesla Model S", "Electric Car", "https://Tesla");

    const allProducts = await contract.get_all_products();

    const tableData = allProducts.map((p, index) => 
    {
        return {
            ID: index,
            Name: p.name,
            Description: p.description,
            Seller: p.seller, 
            Created: new Date(Number(p.timestamp) * 1000).toLocaleString(),
            ImageURL: p.imageUrl
        };
    });

    console.log("PRODUCTS TABLE");
    console.table(tableData); 
    
    expect(allProducts.length).to.equal(2);
    expect(allProducts[0].name).to.equal("MacBook Pro");
  });
});