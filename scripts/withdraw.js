const { getNamedAccounts, ethers } = require("hardhat")

const main = async () => {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("funding....")
    console.log(deployer)
    const withdraw = await fundMe.withdraw()
    const transactionReceipt = await withdraw.wait(1)
    const getBalance = await ethers.provider.getBalance(deployer)
    console.log(getBalance.toString())
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
