const ethers = require("ethers")
const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
//hre - harhdat runtime environment

module.exports = async (hre) => {
    // console.log(hre)
    const { getNamedAccounts, deployments } = hre
    const { log, deploy, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    log(await getNamedAccounts())

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
        log(ethUsdPriceFeedAddress)
    }

    // we want to verify the contract...

    // a mock is a fake contract to represent a comples contract
    // bacuse we were etting our data onlicne from chainlink we would be using a mock
    // so that we can test on a local blockchain

    // what we are trying to do here is to deploy from the hard hat ... which is a bit different from depoloying on get contract factory....
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    console.log("next....")
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API
    ) {
        await verify(fundMe.address, args)
    }
    log("----------------------------------------------")
}

module.exports.tags = ["all", "fundMe"]
//async const deployFunc = () => {
//     console.log('hi')
// }

// module.exports.default = deployFunc
// const main = async () => {

// }

// main().then(() => process.exit(0)).catch((err) => {
//     if (err) throw err
//     process.exit(1)
// })
