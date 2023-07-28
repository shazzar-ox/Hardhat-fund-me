const {
    deployments,
    ethers,
    getNamedAccounts,
    waffle,
    network,
} = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

console.log(developmentChains)
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe
          let deployer
          const fundValue = ethers.parseEther("1") // convert it to 1eth ... read eth doc for other use cases...

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer

              // get
              fundMe = await ethers.getContract("FundMe", deployer)
              // console.log(mockV3Aggregator)
          })

          it("allows people to fund and withdraw", async () => {
              await fundMe.fund({ value: fundValue })
              await fundMe.withdraw()
              const endingBalance = await ethers.provider.getBalance(
                  fundMe.address,
              )
              assert(endingBalance.toString(), "0")
          })
      })
