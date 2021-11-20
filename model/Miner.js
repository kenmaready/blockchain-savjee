import crypto from "crypto";
const difficulty = process.env.MINING_DIFFICULTY || 3;

export default class Miner {
    transactions = [];
    publicKey = null;
    previousHash = null;
    solution = null;
    nonce = 0;

    constructor(publicKey, previousHash, difficulty = difficulty) {
        this.publicKey = publicKey;
        this.previousHash = previousHash;
        this.difficulty = difficulty;
    }

    addTransactions(transactions) {
        this.transactions = transactions;
    }

    calculateHash() {
        this.timestamp = Datenow();
        return crypto.createHash('sha256').update(this.previousHash + this.timestamp +
        JSON.stringify(this.transactions) + this.nonce).toString('hex');
    }
    
    mine() {
        while(this.solution.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.solution = this.calculateHash();
        }
        
        console.log("Block mined: ", this.solution);
    }

    submitSolution() {
        return {
            hash: this.solution,
            previousHash: this.previousHash,
            transactions: this.transactions,
            nonce: this.nonce,
            minedBy: this.publicKey,
            timestamp: this.timestamp,
        }
    }
};
