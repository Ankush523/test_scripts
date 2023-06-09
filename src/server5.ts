// for Pending Transaction on Mainnet

// import { ethers } from "ethers";
// import axios from "axios";
// import { Dcyfr } from "bytekode-eth-decoder";

// const address = "0x816fe884C2D2137C4F210E6a1d925583fa4A917d";
// const polygonwss = "wss://polygon-mainnet.g.alchemy.com/v2/s5BwByPukIVosEOZEfXU68neTN4WsDOy";
// const providerUrl = "https://polygon-mainnet.g.alchemy.com/v2/s5BwByPukIVosEOZEfXU68neTN4WsDOy";
// const provider = new ethers.JsonRpcProvider(providerUrl);
// const polygonscanApiKey = "6MD3XR8ZUEPW5KBCBXHB5R741QGR4HES4B";

// var txndata = '';
// const init = function () {
  
//   const customWsProvider = new ethers.WebSocketProvider(polygonwss);

//   customWsProvider.on("pending", (tx : string) => {
//     customWsProvider.getTransaction(tx).then(function (transaction : any) {
//       console.log("hello")
//       if (transaction.from == address || transaction.to == address) {
//         console.log("Hi..")
//         console.log("Transaction Data : ",transaction.data);
//         txndata = transaction.data;
//         getPendingContractAddress(transaction.hash).then(async (contractAddress) => {
//             if (transaction.to) {
//               console.log("Contract address:", transaction.to);
//               console.log("----------------------------------------------------------------")
//               const contractABI = await getContractABI(transaction.to);
//               if (contractABI) {
//                 console.log("Contract ABI:", contractABI);
//               } else {
//                 console.log("Unable to fetch contract ABI.");
//               }
//             } else {
//               console.log("Unable to get contract address from the given transaction hash.");
//             }
//           });
//       }
//     });
//   });
// };

// async function getContractABI(contractAddress: string): Promise<any> {
//     try {
//       const response = await axios.get(
//           `https://api.polygonscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${polygonscanApiKey}`
//       );
//       if (response.data.status === "1") {
//         const dcyfr = new Dcyfr(response.data.result);
//         const data = txndata;
//         const decodedResponse = dcyfr.getTxInfoFromData({ data })
//         console.log(decodedResponse)
//         const func = decodedResponse?.func
//         console.log("Executed Function : ",func)
//         console.log('------------------------------------------------------------------')
//         return JSON.parse(response.data.result);
//       } else {
//         console.error("Error while fetching contract ABI:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error while fetching contract ABI:", error);
//     }
//     return null;
//   }
  
//   async function getPendingContractAddress(transactionHash: string): Promise<string | null> {
//     try {
//       const transaction = await provider.getTransaction(transactionHash);
  
//       if (transaction) {
//         var receipt = await provider.getTransactionReceipt(transactionHash);
//         if (receipt) {
//           if (receipt.status === 1) {
//             return receipt.contractAddress;
//           } else {
//             console.log("Transaction failed or is not a contract creation transaction.");
//           }
//         } else {
//           console.log("Transaction is still pending.");
//         }
//       } else {
//         console.log("Transaction hash not found on the blockchain.");
//       }
//     } catch (error) {
//       console.error("Error while fetching transaction data:", error);
//     }
//     return null;
//   }

// init();



// for Confirmed Transaction on Mainnet

import { ethers } from "ethers";
import axios from "axios";
import { Dcyfr } from "bytekode-eth-decoder";
const provider = new ethers.providers.WebSocketProvider('wss://polygon-mumbai.g.alchemy.com/v2/CC-YaEP9wPG0mtb2SlesCoDRUlfhAppE');

const address = "0x816fe884C2D2137C4F210E6a1d925583fa4A917d";
const providerUrl = "https://polygon-mumbai.g.alchemy.com/v2/CC-YaEP9wPG0mtb2SlesCoDRUlfhAppE";
const polygon_provider = new ethers.providers.JsonRpcProvider(providerUrl);
const polygonscanApiKey = "6MD3XR8ZUEPW5KBCBXHB5R741QGR4HES4B";

var txndata = '';

async function getConfirmedTransactionDetails(txHash : any) {
  const tx = await provider.getTransaction(txHash);
  if (tx && tx.blockNumber) {
    if(tx.from == address || tx.to == address)
    {
        console.log("Transaction Data : ",tx.data);
        txndata = tx.data;
        console.log(tx.to)
      getPendingContractAddress(tx.hash).then(async (contractAddress) => {
        if (tx.to) {
          console.log("Contract address:", tx.to);
          console.log("----------------------------------------------------------------")
          const contractABI = await getContractABI(tx.to);
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
  }
}

provider.on('block', async (blockNumber : any) => {
  const block = await provider.getBlock(blockNumber);
  if (block && block.transactions) {
    for (const tx of block.transactions) {
      await getConfirmedTransactionDetails(tx);
    }
  }
});

async function getContractABI(contractAddress: string): Promise<any> {
    try {
      const response = await axios.get(
          `https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${polygonscanApiKey}`
      );
      if (response.data.status === "1") {
        const dcyfr = new Dcyfr(response.data.result);
        const data = txndata;
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
      const transaction = await polygon_provider.getTransaction(transactionHash);
  
      if (transaction) {
        var receipt = await polygon_provider.getTransactionReceipt(transactionHash);
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