import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import myEpicNft from './utils/MyEpicNFT.json';

const CONTRACT_ADDRESS = "0xA08EcFbF72A5eEd0778aA18FE9E8E572e42db5c7";
const TWITTER_HANDLE = 'aditipolkam';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/randomsquare-v2';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [totalNFT, setTotalNFT] = useState(0);
    
  const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;

      if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
      } else {
          console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
					setCurrentAccount(account)
          //when user wallet is authorized
          setupEventListener()
      } else {
          console.log("No authorized account found")
      }
  }
  
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupEventListener() 
    } catch (error) {
      console.log(error)
    }
  }

  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber())
        alert(`Hey there! We've minted your NFT and sent it to your wallet. View it here: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });
      } 
      else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getChainId = async () =>{
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);
    return chainId;
  }
  
  const askContractToMintNft = async () => {
    let chainId = await getChainId();
    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
    	alert("You are not connected to the Rinkeby Test Network!");
      return;
    }
    if (totalNFT === TOTAL_MINT_COUNT){
      alert("Maximum token already minted.");
      return;
    }
    else{
      alert("Your NFT minting process started.")
    }
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.")
        await nftTxn.wait();
        console.log(nftTxn);
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getTotalNFTsMintedSoFar = async () =>{
    let total = 0;
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
        total = await connectedContract.getTotalTokens();
        //console.log("Total tokens:",total.toNumber())
      }
    }
    catch(error){
      console.log(error);
    }
    return total.toNumber();
  }

  const renderNftCount = () => {
    getTotalNFTsMintedSoFar().then((x)=>{
      setTotalNFT(x)
    })
    return (
    <p style={{color:"white"}}>Total tokens minted : {totalNFT} out of {TOTAL_MINT_COUNT}
    </p>
  )}
                            

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
  )

  const viewCollection = () => (
    <a href={OPENSEA_LINK} target="_blank" rel="noopener noreferrer">View Collection</a>
  )

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">3-word Jumble</p>
          <p className="sub-text">
            Unique Collection of coloful NFTs
          </p>
          {renderNftCount()}
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
          <br></br>
          <br></br>{viewCollection()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;