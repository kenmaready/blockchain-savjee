import crypto from "crypto";
import Block from "./Block.js";
import Transaction from "./Transaction.js";

class Blockchain {
    static blockNumber = 1;

    constructor(){
        this.counter = 0;
        this.difficulty = 3;
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        const genBlock = new Block([new Transaction("god", "world", 0)]);
        genBlock.minedBy = "000000";
        return genBlock;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    getBlock(index) { 
        if (index >= this.chain.length) {
            throw new Error(`Out of Bounds Error: There is no block with index ${index} on this chain.`);
        }
        return this.chain[index]; 
    };

    getChain() { return this.chain; };

    minePendingTransactions(miner) {
        let block = new Block(this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty, miner);
        
        this.chain.push(block);
        const transaction = new Transaction(null, miner, this.miningReward);
        this.pendingTransactions = [transaction];
        return transaction;
    }

    addTransaction(transaction) {
        if (!transaction.from || !transaction.to) {
            throw new Error("Transaction must include from and to addresses.");   
        }

        if (!transaction.isValid()) {
            throw new Error("Transaction invalid. Cannot add to the blockchain.");
        }

        this.pendingTransactions.push(transaction);
    }

    getBalance(address) {
        let balance = 0.0;
        for(const block of this.chain) {
            for (const transxn of block.transactions) {
                if (transxn.to === address) {
                    balance += transxn.amount;
                }
                if (transxn.from === address) {
                    balance -= transxn.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for (let i=1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];

            console.log("block", i, "transactions valid:", this.chain[i].transactionsValid());
            if (!this.chain[i].transactionsValid()) {
                console.log("Transactions not valid for block", i);
                return false;
            }

            if (this.chain[i].hash != this.chain[i].calculateHash()) {
                console.log("Hash isn't valid for block", i);
                return false;
            };

            if (this.chain[i].previousHash != this.chain[i-1].hash) {
                console.log("PRevious hash of block", i, "doesn't match previous block's hash.");
                return false;
            } 
        }
        return true;
    }
}

const blockchain = new Blockchain();
export default blockchain;