const ethers = require("ethers");
const address = "0x816fe884C2D2137C4F210E6a1d925583fa4A917d";
const url = "wss://ws.testnet.mantle.xyz";
const polygonurl = "wss://polygon-mumbai.g.alchemy.com/v2/B_5czQpQeXc_6pZlC-wDa_-QD1xhTI86";
const init = function () {
  
  const customWsProvider = new ethers.WebSocketProvider(polygonurl);

  customWsProvider.on("pending", (tx : string) => {
    customWsProvider.getTransaction(tx).then(function (transaction : any) {
      if (transaction.from == address || transaction.to == address) {
        console.log(transaction);
      }
    });
  });

  // customWsProvider.on("block", (blockNumber : number) => {
  //   customWsProvider.getBlock(blockNumber).then(function (block : any) {
  //     console.log(block);
  //   });
  // });

  customWsProvider.websocket.on("error", async () => {
    console.log(`Unable to connect to ${polygonurl} retrying in 3s...`);
    setTimeout(init, 3000);
  });

  customWsProvider.websocket.on("close", async (code : number) => {
    console.log(
      `Connection lost with code ${code}! Attempting reconnect in 3s...`
    );
    customWsProvider._websocket.terminate();
    setTimeout(init, 3000);
  });
};

init();