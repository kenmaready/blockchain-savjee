import crypto from "crypto";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import EC from "elliptic";
const ec = new EC.ec('secp256k1');

import KeyGen from "./KeyGenerator.js";

const passwordResetExpiresIn = process.env.PASSWORD_REST_EXPIRES_IN || 10;

const getHash = (token) => crypto.createHash('sha256').update(token).toString('hex');

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Users must have a username.']},
        email: { 
            type: String, 
            required: [true, 'Users must provide an email.'],
            unique: true, 
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email.']},
        role: { 
            type: String, 
            enum: ['user', 'node', 'admin'],
            default: 'user'
        },
        password: {
            type: String,
            required: [true, 'User must provide a password.'],
            minLength: 6,
            select: false,
        },
        privateKey: {
            type: String
        },
        publicKey: {
            type: String
        },
    },{
        timestamps: true,
        toJSON: { versionKey: false },
        toObject: { versionKey: false }
    }
)

UserSchema.pre('save', async function(next) {

    // hash password and store hashed instead of original password
    this.password = await bcrypt.hash(this.password, 12);

    // generate pulic and private keys for user:
    const { privateKey, publicKey } = KeyGen.generateKeys();
    this.privateKey = privateKey;
    this.publicKey = publicKey; 

    next();
});

UserSchema.methods = {
    checkPassword: async function(pw) {
        return await bcrypt.compare(pw, this.password);
    },

    getSigningKey: function() {
        return ec.keyFromPrivate(this.privateKey);
    },

    toJSON: function() {
        var obj = this.toObject();
        delete obj.password;
        delete obj.privateKey;
        return obj;
    },

    wallet: function() {
        return this.publicKey;
    }
};

export default mongoose.model('User', UserSchema);