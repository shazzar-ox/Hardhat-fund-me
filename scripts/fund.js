const { getNamedAccounts, deployments, ethers } = require("hardhat")

// console.log(getNamedAccounts)

const main = async () => {
    const { deployer } = getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("funding contract............")
    const transactionReceipt = await fundMe.fund({
        value: ethers.parseEther("0.1"),
    })
    await transactionReceipt.wait(1)
    console.log("funded!")
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
