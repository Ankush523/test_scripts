import { ethers } from "ethers";
import { Dcyfr } from 'bytekode-eth-decoder'
import axios from "axios";
const providerUrl = "https://polygon-mumbai.g.alchemy.com/v2/B_5czQpQeXc_6pZlC-wDa_-QD1xhTI86";
const provider = new ethers.JsonRpcProvider(providerUrl);

const polygonscanApiKey = "6CDZ8DMKHHZ3D5ZVEQF48HPUX67BNZUEQ1";

async function getContractABI(contractAddress: string): Promise<any> {
  try {
    const response = await axios.get(
        `https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${polygonscanApiKey}`
    );

    if (response.data.status === "1") {
      const dcyfr = new Dcyfr(response.data.result);
      const data = '0xcf81464b'
      const decodedResponse = dcyfr.getTxInfoFromData({ data })
      console.log(decodedResponse)
      const func = decodedResponse?.func
      console.log("Executed Function : ",func)
      console.log('------------------------------------------------------------------')
      return JSON.parse(response.data.result);
    } else {
      console.error("Error while fetching contract ABI:", response.data.message);
    }
  } catch (error) {
    console.error("Error while fetching contract ABI:", error);
  }

  return null;
}

async function getPendingContractAddress(transactionHash: string): Promise<string | null> {
  try {
    const transaction = await provider.getTransaction(transactionHash);

    if (transaction) {
      const receipt = await provider.getTransactionReceipt(transactionHash);

      if (receipt) {
        if (receipt.status === 1) {
          return receipt.contractAddress;
        } else {
          console.log("Transaction failed or is not a contract creation transaction.");
        }
      } else {
        console.log("Transaction is still pending.");
      }
    } else {
      console.log("Transaction hash not found on the blockchain.");
    }
  } catch (error) {
    console.error("Error while fetching transaction data:", error);
  }
  return null;
}

const transactionHash = "0xdfd0b0e36daa1a841e9ea310029b6ef8b4ab70c1f6eb8f4639b03c9bedb5258c";

getPendingContractAddress(transactionHash).then(async (contractAddress) => {
  if (contractAddress) {
    console.log("Contract address:", contractAddress);
    console.log("----------------------------------------------------------------")
    const contractABI = await getContractABI("0x96b82b65acf7072efeb00502f45757f254c2a0d4");
    if (contractABI) {
      console.log("Contract ABI:", contractABI);
    } else {
      console.log("Unable to fetch contract ABI.");
    }
  } else {
    console.log("Unable to get contract address from the given transaction hash.");
  }
});

// 0xcc954a672dc0340a2ee836998a465aa163888a55dee3919efa63bc210e660342
// 0xdfd0b0e36daa1a841e9ea310029b6ef8b4ab70c1f6eb8f4639b03c9bedb5258c