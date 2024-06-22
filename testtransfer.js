// Bridge untuk mengakses web3
const { ethers } = require("ethers");
const { RPC, ETHERSCAN } = require("./config");
const addresses = require("./config").addresses;
const privateKey = require("./config").keys.main;

// Contract ABI dan alamat
const tokenABI = require("./tokenABI.json");
const tokenAddress = "0x0Fff1763AcFA9992Faa81cd414f9DEEAb12ba732"; // Ganti sc token // address wallet

const provider = new ethers.providers.JsonRpcProvider(RPC);
const wallet = new ethers.Wallet(privateKey, provider);

// Fungsi untuk delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async function () {
  try {
    console.log("== Memulai Transaksi ==");

    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);

    const transferAmount = ethers.BigNumber.from("100000000000000"); // Ganti dengan jumlah token 

    const transactionsPerBatch = 50; // Jumlah transaksi per batch
    const delayBetweenBatches = 12 * 60 * 60 * 1000; // 12 jam

    let transferCounter = 0; // Inisialisasi counter untuk nomor urut transfer
    let addressIndex = 2; // Mulai dari W_2 

    for (let j = 0; j < Infinity; j++) { // Loop tanpa batas, bisa diubah sesuai kebutuhan
      console.log(`=== Batch ${j + 1} ===`);
      
      for (let i = 0; i < transactionsPerBatch; i++) {
        try {
          const toAddress = addresses[`W_${addressIndex}`];
          const transaction = await tokenContract.transfer(toAddress, transferAmount);
          transferCounter++; // Tambahkan counter setiap kali transfer berhasil
          console.log(`Transfer Berhasil ke ${toAddress}. Tx => [${transaction.hash}] - Nomor Urut: ${transferCounter}`);
          addressIndex++;
        } catch (innerErr) {
          // Hilangkan atau komentar baris berikut untuk menghilangkan log error
          // console.error(`Gagal transfer ke ${addresses[`W_${addressIndex}`]}. Error: ${innerErr.message}`);
          addressIndex++; // Tetap tingkatkan indeks alamat bahkan jika gagal
        }
      }
      console.log(`== Menunggu 12 jam sebelum batch berikutnya ==`);
      await delay(delayBetweenBatches);
    }

  } catch (err) {
    // Hilangkan atau komentar baris berikut untuk menghilangkan log error utama
    // console.error(`Error utama: ${err.message}`);
  }
})();
