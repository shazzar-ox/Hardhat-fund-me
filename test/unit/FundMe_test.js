const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts, waffle } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

// const provider = waffle.provider
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe
          let deployer
          let mockV3Aggregator
          const fundValue = ethers.parseEther("1") // convert it to 1eth ... read eth doc for other use cases...

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"]) // this does to the deploy folder ad deployss all our tags with  all... optionontract takes intwo variables... the contact name,  and the network....

              // get
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer,
              )
              // console.log(mockV3Aggregator)
          })
          // so we would be testtingfor each unit from the construction to esch function.....

          describe("constructor", async () => {
              it("set the aggregator addr correctly", async () => {
                  const response = await fundMe.getPriceFeed()
                  // console.log(response)
                  assert.equal(mockV3Aggregator.target, response)
              })
          })

          describe("fund", async () => {
              it("fails if you dont send enough eth", async () => {
                  // to tell our contract to check and expect the contract to break
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "Didnt send enough gaz",
                  )
              })

              it("should fund the contract", async () => {
                  await fundMe.fund({ value: fundValue })
                  // console.log(deployer)
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer,
                  )
                  // console.log(await response)
                  assert.deepEqual(response.toString(), fundValue.toString())
              })

              it("should add funds to the funders array", async () => {
                  await fundMe.fund({ value: fundValue })
                  const response = await fundMe.getFunders(0)
                  console.log(response)
                  assert.equal(response, deployer)
              })
          })

          describe("withdraw", async () => {
              // we are going to ask the contract to be funded.. automaitcally before perfroming any
              // withdrawal function....

              beforeEach(async () => {
                  await fundMe.fund({ value: fundValue })
              })

              it("should withdraw eth from a single founder", async () => {
                  // arrange -> act  -> assert
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  console.log(startingFundMeBalance)

                  // act
                  const response = await fundMe.withdraw()
                  const responseReceipt = await response.wait(1)
                  const { gasUsed, gasPrice } = responseReceipt
                  // console.log(responseReceipt)
                  const gazCost = gasPrice * gasUsed
                  console.log(gazCost)

                  const endFundMebalance = await ethers.provider.getBalance(
                      fundMe.target,
                  )
                  const endDeployerBalance = await ethers.provider.getBalance(
                      deployer,
                  )
                  // total gas price = gasPrice * gas used
                  // console.log(startingFundMeBalance.add(startingDeployerBalance))
                  assert.equal(endFundMebalance, 0)
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endDeployerBalance + gazCost).toString(),
                  )
              })

              it("allows withdrawal from multiple senders", async () => {
                  // arrange
                  const accounts = await ethers.getSigners()
                  let fundMeConnectContract
                  //  i = 0 is the deployer address so we have to start from one
                  for (i = 1; i < 6; i++) {
                      fundMeConnectContract = await fundMe.connect(accounts[i])
                      await fundMeConnectContract.fund({ value: fundValue })
                  }
                  // console.log((await ethers.provider.getBalance(fundMe.target)).toString())

                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  const response = await fundMe.withdraw()
                  const responseReceipt = await response.wait(1)
                  const { gasUsed, gasPrice } = responseReceipt
                  // console.log(responseReceipt)
                  const gazCost = gasPrice * gasUsed

                  const endFundMebalance = await ethers.provider.getBalance(
                      fundMe.target,
                  )
                  const endDeployerBalance = await ethers.provider.getBalance(
                      deployer,
                  )

                  // act

                  // await fundMeConnectContract.withdraw()
                  // const currentBalance = await ethers.provider.getBalance(fundMe.target)

                  // assert
                  await expect(fundMeConnectContract.withdraw()).to.be.reverted
                  assert.equal(endFundMebalance, 0)
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endDeployerBalance + gazCost).toString(),
                  )

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address,
                          ),
                          0,
                      )
                  }
              })
              it("only owner can withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const fundMeConnected = await fundMe.connect(attacker)
                  // console.log(fundMeConnected)/
                  // console.log(fundMe)
                  await expect(
                      fundMeConnected.withdraw(),
                  ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")
              })
          })

          describe(" cheaper withdraw", async () => {
              // we are going to ask the contract to be funded.. automaitcally before perfroming any
              // withdrawal function....

              beforeEach(async () => {
                  await fundMe.fund({ value: fundValue })
              })

              it("should withdraw eth from a single founder", async () => {
                  // arrange -> act  -> assert
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)
                  console.log(startingFundMeBalance)

                  // act
                  const response = await fundMe.cheaperWithdraw()
                  const responseReceipt = await response.wait(1)
                  const { gasUsed, gasPrice } = responseReceipt
                  // console.log(responseReceipt)
                  const gazCost = gasPrice * gasUsed
                  console.log(gazCost)

                  const endFundMebalance = await ethers.provider.getBalance(
                      fundMe.target,
                  )
                  const endDeployerBalance = await ethers.provider.getBalance(
                      deployer,
                  )
                  // total gas price = gasPrice * gas used
                  // console.log(startingFundMeBalance.add(startingDeployerBalance))
                  assert.equal(endFundMebalance, 0)
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endDeployerBalance + gazCost).toString(),
                  )
              })

              it("allows withdrawal from multiple senders", async () => {
                  // arrange
                  const accounts = await ethers.getSigners()
                  let fundMeConnectContract
                  //  i = 0 is the deployer address so we have to start from one
                  for (i = 1; i < 6; i++) {
                      fundMeConnectContract = await fundMe.connect(accounts[i])
                      await fundMeConnectContract.fund({ value: fundValue })
                  }
                  // console.log((await ethers.provider.getBalance(fundMe.target)).toString())

                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)

                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  const response = await fundMe.cheaperWithdraw()
                  const responseReceipt = await response.wait(1)
                  const { gasUsed, gasPrice } = responseReceipt
                  // console.log(responseReceipt)
                  const gazCost = gasPrice * gasUsed

                  const endFundMebalance = await ethers.provider.getBalance(
                      fundMe.target,
                  )
                  const endDeployerBalance = await ethers.provider.getBalance(
                      deployer,
                  )

                  // act

                  // await fundMeConnectContract.withdraw()
                  // const currentBalance = await ethers.provider.getBalance(fundMe.target)

                  // assert
                  await expect(fundMeConnectContract.withdraw()).to.be.reverted
                  assert.equal(endFundMebalance, 0)
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endDeployerBalance + gazCost).toString(),
                  )

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address,
                          ),
                          0,
                      )
                  }
              })
              it("only owner can withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const fundMeConnected = await fundMe.connect(attacker)
                  // console.log(fundMeConnected)/
                  // console.log(fundMe)
                  await expect(
                      fundMeConnected.cheaperWithdraw(),
                  ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")
              })
          })
      })
