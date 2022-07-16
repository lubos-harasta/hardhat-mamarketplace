const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const TOKEN_ID = 6
// const PRICE = ethers.utils.parseEther("0.1")

async function buyItem() {
    console.log(`Buying item...`)
    const accounts = await ethers.getSigners()
    const buyer = accounts[1]
    const nftMarketplaceContract = await ethers.getContract("NftMarketplace")
    const nftMarketplace = nftMarketplaceContract.connect(buyer)
    const basicNft = await ethers.getContract("BasicNft")
    const listing = await nftMarketplaceContract.getListing(basicNft.address, TOKEN_ID)
    const nftPrice = listing.price.toString()
    const buyingTx = await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, { value: nftPrice })
    await buyingTx.wait(1)
    console.log(
        `NFT with tokenId ${TOKEN_ID} on address ${
            basicNft.address
        } for ${ethers.utils.formatUnits(nftPrice, "ether")} ETH bought.`
    )

    if (network.config.chainId == "31337") {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

buyItem()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
