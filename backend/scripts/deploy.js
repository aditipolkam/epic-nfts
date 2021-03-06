
const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to ", nftContract.address);

    //let tokenURI = "https://jsonkeeper.com/b/CQZ0"
    let txn = await nftContract.makeAnEpicNFT()
    await txn.wait()
    console.log("Minted NFT")

    let total = await nftContract.getTotalTokens()
    console.log("Total Tokens: ", total)


};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
};

runMain();

//