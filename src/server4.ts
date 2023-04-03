import { ethers } from "ethers";
import axios from "axios";
import { Dcyfr } from "bytekode-eth-decoder";

const address = "0x816fe884C2D2137C4F210E6a1d925583fa4A917d";
const polygonwss = "wss://polygon-mumbai.g.alchemy.com/v2/B_5czQpQeXc_6pZlC-wDa_-QD1xhTI86";
const providerUrl = "https://polygon-mumbai.g.alchemy.com/v2/B_5czQpQeXc_6pZlC-wDa_-QD1xhTI86";
const provider = new ethers.JsonRpcProvider(providerUrl);
const polygonscanApiKey = "6CDZ8DMKHHZ3D5ZVEQF48HPUX67BNZUEQ1";

var data1 = '';
const init = function () {
  
  const customWsProvider = new ethers.WebSocketProvider(polygonwss);

  customWsProvider.on("pending", (tx : string) => {
    customWsProvider.getTransaction(tx).then(function (transaction : any) {
      if (transaction.from == address || transaction.to == address) {
        console.log("Transaction Data : ",transaction.data);
        data1 = transaction.data;
        getPendingContractAddress(transaction.hash).then(async (contractAddress) => {
            if (transaction.to) {
              console.log("Contract address:", transaction.to);
              console.log("----------------------------------------------------------------")
              const contractABI = await getContractABI(transaction.to);
              if (contractABI) {
                console.log("Contract ABI:", contractABI);
              } else {
                console.log("Unable to fetch contract ABI.");
              }
            } else {
              console.log("Unable to get contract address from the given transaction hash.");
            }
          });
      }
    });
  });
};

async function getContractABI(contractAddress: string): Promise<any> {
    try {
      const response = await axios.get(
          `https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${polygonscanApiKey}`
      );
      if (response.data.status === "1") {
        const dcyfr = new Dcyfr(response.data.result);
        const data = data1;
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
        var receipt = await provider.getTransactionReceipt(transactionHash);
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

init();