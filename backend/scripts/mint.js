
const main = async () => {
    const address = "0xA08EcFbF72A5eEd0778aA18FE9E8E572e42db5c7";
    const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
    const nftContract = await nftContractFactory.attach(address);

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