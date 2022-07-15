const { ethers, network } = require("hardhat")
const fs = require("fs")
const frontEndAddressesMapping = "../nextjs-mamarketplace-moralis/constants/networkMapping.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating fron-end...")
        await updateContractAddressesInFrontend()
    }
}

async function updateContractAddressesInFrontend() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const chainId = network.config.chainId.toString()
    // get current contract addresses from frontend JSON file
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndAddressesMapping, "utf-8"))
    if (chainId in contractAddresses) {
        // if nftMarketplace address for the given network already exists but the address of nftMarketplace not,
        // populate it;
        if (!contractAddresses[chainId]["NftMarketplace"].includes(nftMarketplace.address)) {
            contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address)
            console.log("Contract address of NftMarketplace has been updated.")
        }
    } else {
        contractAddresses[chainId] = { NftMarketplace: [nftMarketplace.address] }
        console.log("Contract address of NftMarketplace has been created.")
    }
    fs.writeFileSync(frontEndAddressesMapping, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
