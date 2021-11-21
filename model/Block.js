import mongoose from "mongoose";
import Transaction from "./Transaction.js";
import crypto from "crypto";
import validator from "validator";

const { ObjectId } = mongoose.Schema;
const difficulty = process.env.MINING_DIFFICULTY || 3;

const BlockSchema = mongoose.Schema({
    hash: {
        type: String
    },
    previousHash: {
        type: String,
        required: [true, "Each Block must include the hash of the previous Block."],
    },
    transactions: [{type: ObjectId, ref: 'Transaction' }],
    nonce: Number,
    minedBy: {
        type: String,
        required: [true, "Each Block must include the wallet (public key) of the block's miner."]
    }
}, {
    timestamps: true,
    toJSON: { versionKey: false },
    toObject: { versionKey: false }
});

BlockSchema.pre('validate', function(next) {
    if (!validator.isHash(this.previousHash, 'sha256')) {
        next(new Error('Previous Hash must be a valid sha256 hash.'));
    }

    next();
});

BlockSchema.pre('save', function(next) {
    this.hash = this.calculateHash();
    next();
})

BlockSchema.methods = {
    calculateHash() {
        const hash = crypto.createHash('sha256').update(this.previousHash + this.timestamp +
        JSON.stringify(this.transactions) + this.nonce).digest('hex');
        console.log("hash:", hash);
        return hash;
    },

    getHash() {
        return this.hash;
    },

    mineBlock(difficulty, miner) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        this.minedBy = miner;
        console.log("Block mined: ", this.hash);
    },

    transactionsValid() {
        for (const tx of this.transactions) {
            console.log("this transaction is valid:", tx.isValid());
            if (!tx.isValid()){
                return false;
            }
        }
        return true;
    }
};

export default mongoose.model('Block', BlockSchema);