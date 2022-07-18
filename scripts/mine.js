const { moveBlocks } = require("../utils/move-blocks")

BLOCKS = 2
SLEEP_AMOUNT = 1000

async function mine() {
    await moveBlocks(2, (sleepAmount = SLEEP_AMOUNT))
}

mine()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
