import mongoose from "mongoose";
import crypto from "crypto";
import validator from "validator";

import EC from "elliptic";
const ec = new EC.ec('secp256k1');

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
    }
}, {
    timestamps: true,
    toJSON: { versionKey: false },
    toObject: { versionKey: false }
    }
);

TransactionSchema.pre('validate', function(next) {
    if (!validator.isHexadecimal(this.from) || this.from.length !==130) {
        next(new Error('From address must be a valid secp256k1 key.'));
    }

    if (!validator.isHexadecimal(this.to) || this.to.length !==130) {
        next(new Error('To address must be a valid secp256k1 key.'));
    }

    if (this.amount <= 0) {
        next(new Error('Amount must be a positive number.'));
    }

    this.signTransaction(this.signingKey);

    next();
});

TransactionSchema.methods = {
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