import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";
import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("Grandma Contract", function ()
{
  
  async function deploy_gift_fixture()
  {
    const [grandma, gchild1, gchild2, stranger] = await ethers.getSigners();
    const oneEth = ethers.parseEther("1.0"); 
    const currentTime = await time.latest();
    
    const birthdayG1 = currentTime + 86400; 
    const birthdayG2 = currentTime + 172800;

    const Grandma = await ethers.getContractFactory("Grandma");
    
    const contract = await Grandma.deploy
    (
      [gchild1.address, gchild2.address],
      [birthdayG1, birthdayG2],
      { value: oneEth }
    );

    const expectedGiftAmount = ethers.parseEther("0.5");

    return { 
      contract, 
      grandma, 
      gchild1, 
      gchild2, 
      stranger, 
      birthdayG1, 
      birthdayG2,
      expectedGiftAmount 
    };
  }

  describe("Deployment", function ()
  {
    it("Will set the right owner and calculate gift amount correctly", async function ()
    {
      const { contract, expectedGiftAmount } = await loadFixture(deploy_gift_fixture);
      expect(await contract.giftAmount()).to.equal(expectedGiftAmount);
    });
  });

  describe("Withdrawals", function ()
  {
    
    it("Will revert if withdrawing BEFORE birthday", async function ()
    {
      const { contract, gchild1 } = await loadFixture(deploy_gift_fixture);
      
      await expect(contract.connect(gchild1).withdraw_gift())
        .to.be.revertedWith("Birthday hasn`t arrived yet");
    });

    it("Will allow withdrawal ON the birthday", async function ()
    {
      const { contract, gchild1, birthdayG1, expectedGiftAmount } = await loadFixture(deploy_gift_fixture);
      await time.increaseTo(birthdayG1);
      
      await expect(contract.connect(gchild1).withdraw_gift())
        .to.changeEtherBalance(gchild1, expectedGiftAmount);
    });

    it("Will allow withdrawal AFTER the birthday", async function ()
    {
      const { contract, gchild1, birthdayG1, expectedGiftAmount } = await loadFixture(deploy_gift_fixture);
      await time.increaseTo(birthdayG1 + 100);
      
      await expect(contract.connect(gchild1).withdraw_gift())
        .to.changeEtherBalance(gchild1, expectedGiftAmount);
    });

    it("Will revert double withdrawal", async function ()
    {
      const { contract, gchild1, birthdayG1 } = await loadFixture(deploy_gift_fixture);
      await time.increaseTo(birthdayG1);
      
      await contract.connect(gchild1).withdraw_gift();
      
      await expect(contract.connect(gchild1).withdraw_gift())
        .to.be.revertedWith("Gift already withdrawn");
    });

    it("Will revert withdrawal by a stranger", async function ()
    {
      const { contract, stranger } = await loadFixture(deploy_gift_fixture);
      
      await expect(contract.connect(stranger).withdraw_gift())
        .to.be.revertedWith("You aren`t my grandchild.");
    });

    it("Will emit an event on withdrawal", async function ()
    {
      const { contract, gchild1, birthdayG1, expectedGiftAmount } = await loadFixture(deploy_gift_fixture);
      await time.increaseTo(birthdayG1);
      
      await expect(contract.connect(gchild1).withdraw_gift())
        .to.emit(contract, "gift_withdrawn")
        .withArgs(gchild1.address, expectedGiftAmount);
    });
  });
});