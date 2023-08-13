const { ethers } = require("ethers");
const { RPC, ETH, ETHERSCAN } = require("./config");
const { W_2, W_3, W_4, W_5, W_6, W_7, W_8, W_9, W_10 } = require("./config").addresses;
const { main } = require("./config").keys;
const provider = new ethers.providers.JsonRpcProvider(RPC);
const walletMain = new ethers.Wallet(main, provider);
const transferAmount = ethers.utils.parseEther(ETH);
const addressList = [W_2, W_3, W_4, W_5, W_6, W_7, W_8, W_9, W_10];
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
(async function () {
  try {
    console.log("== Starting Transaction ==");
    rl.question("Mau transfer berapa kali? ", async function (iterations) {
      let transferCount = 0;
      for (let i = 0; i < iterations; i++) {
        const address = addressList[i % addressList.length];
        const transaction = await walletMain.sendTransaction({
          to: address,
          value: transferAmount,
        });
        transferCount++;
        console.log(`Transfer ${transferCount} Successful to ${address}. Tx => [${transaction.hash}]`);
      }
      console.log(`== Transfers Complete! ==`);
      console.log(`See transactions at: ${ETHERSCAN}/address/${walletMain.address}`);
      rl.close();
    });
  } catch (err) {
    console.error(err);
  }
})();
