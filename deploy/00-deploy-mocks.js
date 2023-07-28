const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")
// const { Log } = require('ethers')

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { log, deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    log(DECIMALS, INITIAL_ANSWER)

    if (developmentChains.includes(network.name)) {
        log("deploying to local network...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("mocks deployed!")
        log("_______________________________________")
    }
}

module.exports.tags = ["all", "mocks"]
//  yarn hardhat deploy --tags mocks
