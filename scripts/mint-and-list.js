const { ethers } = require("hardhat")

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
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
