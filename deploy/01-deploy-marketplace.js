const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

/**
 * Notice:
 *  async ({getNamedAccounts, deployments}) => {}
 *  is the same as:
 *  async (hre) => {
 *  const { getNamedAccounts, deployments } = hre
 *  }
 * */

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    args = [] // args for a constructor

    const nftMarketplace = await deploy("NftMarketplace", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying NftMarketplace...")
        await verify(nftMarketplace.address, args)
    }

    console.log("--------------------------")
}

module.exports.tags = ["all", "nftmarketplace"]
