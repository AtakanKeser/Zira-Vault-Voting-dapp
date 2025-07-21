import { expect }                                  from "chai";
import { ethers }                                  from "hardhat";
import { Signer }                                  from "ethers";
import { MinimalForwarder__factory } from "../frontend/src/typechain-types";
import {
  /* sözleşme tipleri  */
  ZiraToken,
  ZiraVault,
  ZiraGovernance,
  /* factory’ler       */
  ZiraToken__factory,
  ZiraVault__factory,
  ZiraGovernance__factory,
} from "../frontend/src/typechain-types";

import "@nomicfoundation/hardhat-chai-matchers";

const DAY = 24 * 60 * 60;          // 1 gün (saniye)

describe("ZiraGovernance", () => {
  let owner:  Signer;
  let voter1: Signer;
  let voter2: Signer;

  let token: ZiraToken;
  let vault: ZiraVault;
  let gov:   ZiraGovernance;

  beforeEach(async () => {
    [owner, voter1, voter2] = await ethers.getSigners();

  /* 1) Token */
  token = await new ZiraToken__factory(owner).deploy();
  await token.waitForDeployment();

  /* 1‑b) Forwarder (dummy) */
  const fwd = await new MinimalForwarder__factory(owner).deploy();
  await fwd.waitForDeployment();

  /* 2) Vault — forwarder sıfır **DEĞİL** */
  vault = await new ZiraVault__factory(owner).deploy(
    await token.getAddress(),
    await fwd.getAddress()
  );
  await vault.waitForDeployment();

  /* 3) Governance */
  gov = await new ZiraGovernance__factory(owner).deploy(
    await vault.getAddress()
  );
  await gov.waitForDeployment();

    /* *******************************************
     * 3) Mint + stake
     * *******************************************/
    const stake1 = ethers.parseEther("50");
    const stake2 = ethers.parseEther("40");

    await token.mint(await voter1.getAddress(), stake1);
    await token.mint(await voter2.getAddress(), stake2);

    await token.connect(voter1).approve(await vault.getAddress(), stake1);
    await token.connect(voter2).approve(await vault.getAddress(), stake2);

    await vault.connect(voter1).deposit(stake1);
    await vault.connect(voter2).deposit(stake2);
  });

  /* ──────────────────────────────────────────────
   * Testler
   * ──────────────────────────────────────────── */

  it("allows creating a proposal", async () => {
    await expect(
      gov.connect(voter1).createProposal("Yeni özellik ekleyelim")
    )
      .to.emit(gov, "ProposalCreated")
      .withArgs(1, await voter1.getAddress(), "Yeni özellik ekleyelim");

    const prop = await gov.getProposal(1);
    expect(prop.proposer).to.equal(await voter1.getAddress());
    expect(prop.state).to.equal(0); // ACTIVE
  });

  it("prevents zero-stake users from proposing", async () => {
    const outsider = (await ethers.getSigners())[3];
    await expect(
      gov.connect(outsider).createProposal("Hileli teklif")
    ).to.be.revertedWith("Must stake to propose");
  });

  it("handles voting & finalize (accepted)", async () => {
    await gov.connect(voter1).createProposal("DAO logosunu değiştir");
    await gov.connect(voter1).vote(1, true);  // 50 yes
    await gov.connect(voter2).vote(1, true);  // 40 yes

    /* oylama süresini ileri sar */
    await ethers.provider.send("evm_increaseTime", [3 * DAY + 1]);
    await ethers.provider.send("evm_mine");

    await expect(gov.finalizeProposal(1))
      .to.emit(gov, "ProposalFinalized")
      .withArgs(1, 1); // ACCEPTED

    const prop = await gov.getProposal(1);
    expect(prop.state).to.equal(1); // ACCEPTED
  });

  it("rejects proposal when no > yes", async () => {
    await gov.connect(voter1).createProposal("Topluca tatil");
    await gov.connect(voter1).vote(1, false); // 50 no

    await ethers.provider.send("evm_increaseTime", [3 * DAY + 1]);
    await ethers.provider.send("evm_mine");

    await gov.finalizeProposal(1);
    const prop = await gov.getProposal(1);
    expect(prop.state).to.equal(2); // REJECTED
  });

  it("blocks double voting", async () => {
    await gov.connect(voter1).createProposal("İki kez oy denemesi");
    await gov.connect(voter1).vote(1, true);

    await expect(gov.connect(voter1).vote(1, false))
      .to.be.revertedWith("Already voted");
  });
});
