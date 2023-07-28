require("@nomicfoundation/hardhat-ethers")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("@nomicfoundation/hardhat-verify")
require("@nomicfoundation/hardhat-toolbox")
// require('./tasks/block-number')
require("hardhat-gas-reporter")
require("solidity-coverage")
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */

const sepoliaUrl = process.env.SEPOLIA_RPC_URL || ""
const sepoliaPrivateKey =
  process.env.SEPOLIA_PRIVATE_KEY || 'key'
const etherscanApiKey = process.env.ETHERSCAN_API || "key"
const coinMarketCapKey = process.env.COINMARKETCAP_KEY || "key"

console.log(sepoliaPrivateKey)

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/", // hardhat will directly use the accounts availabe in the node,
      chainId: 31337,
    },
    sepolia: {
      url: sepoliaUrl,
      accounts: [sepoliaPrivateKey],
      chainId: 11155111,
      blockConfirmations: 3,
    },
  },
  // solidity: "0.8.20",
  solidity: {
    compilers: [{ version: "0.8.20" }, { version: "0.7.0" }],
  },
  etherscan: {
    apiKey: etherscanApiKey,
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    // coinmarketcap: coinMarketCapKey,
    token: "MATIC",
    gasPriceApi:
      "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice",
  },
  namedAccounts: {
    deployer: {
      default: 0,
      2: 0,
      // 31337: 1,
      // 11155111: 2
    },
  },
}
