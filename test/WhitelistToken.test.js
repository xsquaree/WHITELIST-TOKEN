const { ethers } = require("hardhat");
const { expect } = require("chai");
const { MaxUint256, Signature, TypedDataEncoder } = ethers;

describe("WhitelistToken", function () {
  let token;
  let owner, spender, addr1, addr2;

  beforeEach(async function () {
    [owner, spender, addr1, addr2] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("WhitelistToken");
    token = await TokenFactory.deploy(owner.address);

    await token.connect(owner).addToWhitelist(spender.address);
  });

  it("should allow approve and transferFrom via permit()", async function () {
    const value = 1000;
    const deadline = MaxUint256;

    const nonce = await token.nonces(owner.address);
    const chainId = await owner.provider.getNetwork().then(n => n.chainId);
    const name = await token.name();

    const domain = {
      name,
      version: "1",
      chainId: BigInt(chainId),
      verifyingContract: token.target.toLowerCase(),
    };

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const message = {
      owner: owner.address,
      spender: spender.address,
      value,
      nonce,
      deadline,
    };

    // Generate EIP-712 signature
    const signature = await owner.signTypedData(domain, types, message);
    const sig = Signature.from(signature);
    const v = sig.yParity + 27;
    const { r, s } = sig;

    // Debug: Compare local and contract domain separators
    const contractDomainSeparator = await token.DOMAIN_SEPARATOR();
    const localDomainSeparator = TypedDataEncoder.hashDomain(domain);

    console.log("Contract DOMAIN_SEPARATOR:", contractDomainSeparator);
    console.log("Local DOMAIN_SEPARATOR:   ", localDomainSeparator);

    // Use permit to approve spender
    await token.permit(owner.address, spender.address, value, deadline, v, r, s);

    // Check allowance was correctly set
    expect(await token.allowance(owner.address, spender.address)).to.equal(value);

    // Transfer using approved allowance
    await token.connect(spender).transferFrom(owner.address, spender.address, value);

    expect(await token.balanceOf(spender.address)).to.equal(value);
  });

  it("should allow transfer if both sender and recipient are whitelisted", async function () {
    await token.connect(owner).addToWhitelist(addr1.address);
    await token.connect(owner).addToWhitelist(addr2.address);

    await token.connect(owner).transfer(addr1.address, 1000n);
    await token.connect(addr1).transfer(addr2.address, 500n);

    expect(await token.balanceOf(addr2.address)).to.equal(500n);
  });

  it("should revert if recipient is not whitelisted", async function () {
    await token.connect(owner).addToWhitelist(addr1.address);
    await token.connect(owner).transfer(addr1.address, 1000n);

    await expect(
      token.connect(addr1).transfer(addr2.address, 500n)
    ).to.be.revertedWith("Receiver is not whitelisted");
  });

  it("should revert if sender is not whitelisted", async function () {
    await token.connect(owner).addToWhitelist(addr2.address);
    await token.connect(owner).transfer(addr2.address, 1000n);
    await token.connect(owner).removeFromWhitelist(addr2.address);

    await expect(
      token.connect(addr2).transfer(owner.address, 1000n)
    ).to.be.revertedWith("Sender is not whitelisted");
  });

  it("should revert if non-owner tries to add to whitelist", async function () {
    await expect(
      token.connect(addr1).addToWhitelist(addr2.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
