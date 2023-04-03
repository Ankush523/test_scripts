import { ethers } from "ethers";
const address = "0x816fe884C2D2137C4F210E6a1d925583fa4A917d";
const polygonurl = "wss://polygon-mumbai.g.alchemy.com/v2/B_5czQpQeXc_6pZlC-wDa_-QD1xhTI86";
const init = function () {
  
  const customWsProvider = new ethers.WebSocketProvider(polygonurl);

  customWsProvider.on("pending", (tx : string) => {
    customWsProvider.getTransaction(tx).then(function (transaction : any) {
      if (transaction.from == address || transaction.to == address) {
        console.log(transaction.hash);
      }
    });
  });
};

init();