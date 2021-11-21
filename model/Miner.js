import crypto from "crypto";
const difficulty = process.env.MINING_DIFFICULTY || 3;

export default class Miner {
    transactions = [];
    publicKey = null;
    previousHash = null;
    solution = "";
    nonce = 0;

    constructor(publicKey) {
        this.publicKey = publicKey;
    }

    setTransactions(transactions) {
        this.transactions = transactions;
    }

    setPreviousHash(previousHash) {
        this.previousHash = previousHash;
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    setMiningInfo({ previousHash, transactions, difficulty }) {
        this.setTransactions(transactions);
        this.setPreviousHash(previousHash);
        this.setDifficulty(difficulty);
    }

    calculateHash() {
        this.timestamp = Date.now();
        return crypto.createHash('sha256').update(this.previousHash + this.timestamp +
        JSON.stringify(this.transactions) + this.nonce).digest('hex');
    }
    
    mine() {
        while(this.solution.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.solution = this.calculateHash();
            console.log(`Attempt no. ${this.nonce}, hash: ${this.solution}`);
        }
        
        console.log("Block mined: ", this.solution);
    }

    submitSolution() {
        return {
            solution: this.solution,
            previousHash: this.previousHash,
            transactions: this.transactions,
            nonce: this.nonce,
            minedBy: this.publicKey,
            timestamp: this.timestamp,
        }
    }
};
