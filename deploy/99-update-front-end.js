/**
 * yarn hardhat deploy --network localhost --tags frontend
 */

const { ethers, network } = require("hardhat")
const fs = require("fs")
const frontEndAddressesMapping = "../nextjs-mamarketplace-moralis/constants/networkMapping.json"
const frontEndAbi = "../nextjs-mamarketplace-moralis/constants/"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating fron-end...")
        console.log("... contract addresses")
        await updateContractAddressesInFrontend()
        console.log("... contract ABIs")
        await updateContractABIsInFrontend()
    }
}

async function updateContractABIsInFrontend() {
    // update NFT Marketplace contract ABI
    // (it creates new ones or rewrite them)
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    fs.writeFileSync(
        `${frontEndAbi}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )

    // update Basic NFT contract ABI
    const basicNft = await ethers.getContract("BasicNft")
    fs.writeFileSync(
        `${frontEndAbi}BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddressesInFrontend() {
    console.log("Updating markeplace addresses...")
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNft")
    const chainId = network.config.chainId.toString()
    // get current contract addresses from frontend JSON file
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndAddressesMapping, "utf-8"))
    console.log(contractAddresses)
    if (chainId in contractAddresses) {
        // if nftMarketplace address for the given network already exists but the address of nftMarketplace not,
        // populate it;
        if (!contractAddresses[chainId]["NftMarketplace"].includes(nftMarketplace.address)) {
            contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address)
            console.log("Contract address of NftMarketplace has been updated.")
        }

        if (!contractAddresses[chainId]["BasicNft"].includes(basicNft.address)) {
            contractAddresses[chainId]["BasicNft"].push(basicNft.address)
            console.log("Contract address of BasicNft has been updated.")
        }
    } else {
        contractAddresses[chainId] = {
            NftMarketplace: [nftMarketplace.address],
            BasicNft: [basicNft.address],
        }
        console.log("Contract address of NftMarketplace and BasicNft has been created.")
    }
    fs.writeFileSync(frontEndAddressesMapping, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
