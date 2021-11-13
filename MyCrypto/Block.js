const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(transactions, previousHash = ""){
        this.timestamp = Date.now();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;

        this.hash = this.calculateHash();
    }

    calculateHash() {
        // console.log("transactions:", this.transactions);
        // console.log("nonce:", this.nonce);
        return SHA256(this.previousHash + this.timestamp +
            JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: ", this.hash);
    }

    transactionsValid() {
        for (const tx of this.transactions) {
            console.log("this transaction is valid:", tx.isValid());
            if (!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}

module.exports = Block;