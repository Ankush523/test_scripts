import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const PVT_KEY = process.env.PVT_KEY as string;
const API_KEY = process.env.API_KEY as string;

const config: HardhatUserConfig = {
  solidity: "0.8.7",
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {},
    mumbai: {
      url: "https://matic-mumbai.chainstacklabs.com",
      accounts: [PVT_KEY],
  }
  },
  etherscan:{
    apiKey : API_KEY
  }
};

export default config;
