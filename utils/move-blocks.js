const { network } = require("hardhat")

/**
 * @description This function allows us to mine blocks in local blockchain.
 * Our local blockchain does not function as the real one - it does not mine blocks until we call TX etc.
 * @param {Number} amount amount of blocks to mine
 * @param {Number} sleepAmount amount to sleep in MS between mining of blocks
 */
async function moveBlocks(amount, sleepAmount = 0) {
    console.log("Moving blocks...")
    for (let i = 0; i < amount; i++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        })

        if (sleepAmount) {
            console.log(`Sleeping for ${sleepAmount} ms...`)
            await sleep(sleepAmount)
        }
    }
}

function sleep(timeInMs) {
    return new Promise((resolve) => setTimeout(resolve, timeInMs))
}

module.exports = { moveBlocks, sleep }
