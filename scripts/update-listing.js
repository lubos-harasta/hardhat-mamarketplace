const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const TOKEN_ID = 1
const NEW_PRICE = ethers.utils.parseEther("1.157")

async function updateItem() {
    console.log("Updating item price...")
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNft")
    const updateTx = await nftMarketplace.updateListing(basicNft.address, TOKEN_ID, NEW_PRICE)
    await updateTx.wait(1)

    console.log(
        `Price of NFT with tokenId ${TOKEN_ID} on address ${
            basicNft.address
        } updated. It costs ${ethers.utils.formatUnits(NEW_PRICE, "ether")} ETH now.`
    )

    if (network.config.chainId == "31337") {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

updateItem()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
