import { expect } from "chai";
import { ethers } from "hardhat";
import {Signer, Wallet} from "ethers"
import { Bytes, BytesLike, SigningKey, toUtf8CodePoints } from "ethers/lib/utils";
const list = require('../list')

const ContractJSON = require("../artifacts/contracts/NFTToken.sol/NFTToken.json")

// Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
// Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

// Account #1: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 (10000 ETH)
// Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

// Account #2: 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc (10000 ETH)
// Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

//***** Owner private key *******
const account0PrivateKey: BytesLike = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
//***** account1 private key *******
const account1PrivateKey: BytesLike = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
//***** account2 private key *******
const account2PrivateKey: BytesLike = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

// http://localhost:8545

describe("NFT Token tests", function () {
  it("Some basic tests for the NFT", async function () {
    
    // // creating a provider to connect to Infura
    // const projectID = "c396d1e39caf461d85bd0451f0b779a9"
    // const projectSecret = "5e90d9f982ed4aa2afc1cefc299e8bc2"
    // const provider = await ethers.getDefaultProvider("https://ropsten.infura.io/v3/",
    // {projectID,projectSecret})
    
    const provider = await ethers.getDefaultProvider("http://127.0.0.1:8545/")

    
    let privkey1: SigningKey = await new ethers.utils.SigningKey(account0PrivateKey)
    let privkey2: SigningKey = await new ethers.utils.SigningKey(account1PrivateKey);
    let privkey3: SigningKey = await new ethers.utils.SigningKey(account2PrivateKey);
    // creating some custom wallets that can sign transaction so we have read/write access
    let account0 : Wallet = new ethers.Wallet(privkey1,provider)
    let account1 : Wallet = new ethers.Wallet(privkey2,provider)
    let account2 : Wallet = new ethers.Wallet(privkey3,provider)
    let netWorkName: String = await (await account0.provider.getNetwork()).name;
    console.log("***** account0 information *******")
    console.log("account0 address: " + account0.address)
    console.log("account0 private key: " + account0.privateKey)
    console.log("account0 public key: " + account0.publicKey)
    console.log("account0 provider: " + netWorkName)
    
    console.log("***** account1 information *******")
    console.log("account1 address: " + account1.address)
    console.log("account1 private key: " + account1.privateKey)
    console.log("account1 public key: " + account1.publicKey)
    //console.log("account1 provider key: " + account1.provider._isProvider)

    console.log("***** account2 information *******")
    console.log("account2 address: " + account2.address)
    console.log("account2 private key: " + account2.privateKey)
    console.log("account2 public key: " + account2.publicKey)
    //console.log("account2 provider key: " + account2.provider._isProvider)
    let NFTFactory = await ethers.getContractFactory("NFTToken")
    let NFTContract = await NFTFactory.deploy(
        account0.address,
        "FirstNFT",
        "NFT",
        "Here goes the URI, it's id:"
      );
    
      await NFTContract.deployed()
      // 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
    console.log("NFT Contract address: " + NFTContract.address);
    let contractOwner = await NFTContract.owner();
    let tokenOwner = await NFTContract.ownerOf(1);
    console.log("NFT Contract owner: " + contractOwner);
    console.log("NFT token 1 owner: " + tokenOwner)
    const NFTUri = await NFTContract.tokenURI(1);
    console.log("Token URI for i: " + NFTUri);

    let gasprice = await provider.getGasPrice()

    console.log("Gas Price: ", gasprice)

    let contractWithSigner = NFTContract.connect(account0);
    let tx = await contractWithSigner["safeTransferFrom(address,address,uint256)"](account0.address,account1.address,1);
    
    console.log("hash: " + tx.hash);
    
    tx.wait();
    
    contractOwner = await NFTContract.owner();
    tokenOwner = await NFTContract.ownerOf(1);
    console.log("NFT Contract owner: " + contractOwner);
    console.log("NFT new token 1 owner: " + await NFTContract.ownerOf(1))
    //await list(NFTContract.address,account1.address)
  });
});
