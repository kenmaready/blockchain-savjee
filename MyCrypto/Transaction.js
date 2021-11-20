import mongoose from "mongoose";
import sha256 from "crypto-js/sha256.js";
import EC from "elliptic";
const ec = new EC.ec('secp256k1');

class Transaction {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }

    calculateHash() {
        return sha256(this.from + this.to + this.amount).toString();
    }

    signTransaction(signingKey){
        signingKey = ec.keyFromPrivate(signingKey);
        if(signingKey.getPublic('hex') !== this.from) {
            throw new Error("You cannot sign transactions for other wallets.");
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
        if(this.from === null) return true;
    

        if(!this.signature || this.signature.length === 0) {
            throw new Error('No signature provided for this signature.');
        }

        const publicKey = ec.keyFromPublic(this.from, 'hex');
        // console.log(publicKey.verify(this.calculateHash(), this.signature));
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

export default Transaction;