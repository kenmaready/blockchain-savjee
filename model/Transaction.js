import mongoose from "mongoose";
import crypto from "crypto";
import validator from "validator";

import EC from "elliptic";
const ec = new EC.ec('secp256k1');
const { ObjectId } = mongoose.Schema;

import User from "./User.js";

const TransactionSchema = mongoose.Schema({
    from: {
        type: String,
        required: [true, 'Each transaction must have a from address.']
    },
    to: {
        type: String,
        required: [true, 'Each transaction must have a to address.']
    },
    amount: {
        type: Number,
        required: [true, 'Each transaction must include an amount.'],
        // validate: [validator.isNumeric, 'Please provide a valid email.'],
    },
    signingKey: {
        type: String,
        required: [true, "Signing key must be provided to validate transaction."]
    },
    signature: {
        type: String
    },
    mined: {
        type: Boolean,
        default: false
    },
    block: {
        type: ObjectId, ref: "Block"
    }
}, {
    timestamps: true,
    toJSON: { versionKey: false },
    toObject: { versionKey: false }
    }
);

TransactionSchema.pre('validate', async function(next) {
    if (!validator.isHexadecimal(this.from) || this.from.length !==130) {
        next(new Error('From address must be a valid secp256k1 key.'));
    }

    if (!validator.isHexadecimal(this.to) || this.to.length !==130) {
        next(new Error('To address must be a valid secp256k1 key.'));
    }

    if (this.amount <= 0) {
        next(new Error('Amount must be a positive number.'));
    }

    const sender = await User.findOne({ publicKey: this.from });
    if (!sender) next(new Error("No User found with that wallet number."));

    if(this.amount > (sender.balance - sender.pendingTransfers)) {
        next(new Error('Sender does not have enough Shadowcoin for this transfer (taking into account transfers awaiting mining/validation).'));
    }

    this.addSenderPendingTransfers(sender._id);
    this.signTransaction(this.signingKey);

    next();
});

TransactionSchema.methods = {
    basicInfo() {
        const { _id, from, to, amount } = this;
        return { _id, from, to, amount };
    },

    calculateHash() {
        return crypto.createHash('sha256').update(this.from + this.to + this.amount).toString('hex');
    },

    signTransaction(signingKey){
        signingKey = ec.keyFromPrivate(signingKey);
        if(signingKey.getPublic('hex') !== this.from) {
            throw new Error("You cannot sign transactions for other wallets.");
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    },

    async addSenderPendingTransfers(senderId) {
        const sender = await User.findByIdAndUpdate(senderId, { $inc: { 'pendingTransfers': this.amount }});
        console.log(`adding ${this.amount} to pending transfers for sender ${sender._id}`);
    },

    isValid() {
        if(this.from === null) return true;
    

        if(!this.signature || this.signature.length === 0) {
            throw new Error('No signature provided for this signature.');
        }

        const publicKey = ec.keyFromPublic(this.from, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

export default mongoose.model('Transaction', TransactionSchema);