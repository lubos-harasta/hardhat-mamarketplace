const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const NFT_PRICE = ethers.utils.parseEther("0.1")

async function mintAndList() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNft")

    console.log("Minting NFT...")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.events[0].args.tokenId

    console.log("Approving NFT...")
    const approveTx = await basicNft.approve((await nftMarketplace).address, tokenId)
    await approveTx.wait(1)

    console.log("Listing NFT...")
    const listTx = await nftMarketplace.listItem(basicNft.address, tokenId, NFT_PRICE)
    await listTx.wait(1)

    console.log("Listed")

    // if on localhost, mine 2 blocks and sleep for 1000 ms between each block mined
    if (network.config.chainId == "31337") {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
