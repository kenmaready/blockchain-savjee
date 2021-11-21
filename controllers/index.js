// import express from "express";
import BC from "../model/Blockchain.js";
import { userDB as db } from "../model/Users.js";
import User from "../model/User.js";
import Transaction from "../model/Transaction.js";

const bc = await BC.getBlockchain();

export const welcomeMessage = (req, res) => {
    res.status = 200;
    res.json({ message: "Welcome to the Shadowbank API...", success: true });
}

export const getUser = async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ name: username});

    if (!user) {
        res.status(404);
        return res.json({ success: false, error: true, message: "User not found."});
    }

    res.status(200);
    res.json({ success: true, user });
}

export const getUsers = async (req, res) => {
    const users = await User.find();
    res.status(200);
    res.json({ success: true, users });
}


export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({name, password, email});


    res.status(200);
    res.json({ user, success: true });
}

export const getWallet = async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ name: username });
    
    if (!user) {
        res.status(404);
        return res.json({ success: false, error: true, message: "User not found."});
    }

    res.status(200);
    res.json({ wallet: user.publicKey, success: true });
}

export const getSigningKey = async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ name: username });
    
    if (!user) {
        res.status(404);
        return res.json({ success: false, error: true, message: "User not found."});
    }

    res.status(200);
    res.json({ signingKey: user.getSigningKey(), success: true });
}

export const postTransaction = async (req, res) => {
    const { from, to, amount, signingKey } = req.body;

    const fromUser = await User.findOne({publicKey: from});
    if (!fromUser) {
        res.status(404);
        return res.json({ success: false, error: true, message: "No user found for the from wallet provided."});
    }

    const toUser = await User.findOne({publicKey: to});
    if (!toUser) {
        res.status(404);
        return res.json({ success: false, error: true, message: "No user found for the to wallet provided."});
    }

    const transaction = await Transaction.create({from, to, amount, signingKey });

    if (!transaction) {
        res.status(500);
        return res.json({success: false, error: true, message: "There was an error creating the transaction."});
    }

    await bc.addTransaction(transaction);

    res.status(200);
    res.json({success: true, transaction });
}

export const getBlock = (req, res) => {
    let block;

    try {
        if (req.params.index) {
            block = bc.getBlock(+req.params.index);
        } else {
            block = bc.getLatestBlock();
        }
    } catch (err) {
        res.status(404);
        res.json({ success: false, error: true, message: err.message });
    }

    res.status(200);
    res.json({ success: true, block });

}

export const getMiningInfo = async (req, res) => {

    const miningInfo = await bc.getMiningInfo();
    res.status(200);
    res.json({ success: true, miningInfo });
}

export const submitMiningSolution = async (req, res) => {

    const solutionPkg = req.body;
    console.log("submitted solutionPkg:", solutionPkg);
    const success = await bc.checkSolution(solutionPkg);

    res.status(200);
    res.json({ success, message: "thank you for submitting a solution..."});
}


export const mineTransactions = (req, res) => {
    const { publicKey } = req.body;
    let transaction;

    try {
        transaction = bc.minePendingTransactions(publicKey);
    } catch (err) {
        res.status(500);
        res.json({ success: false, error: true, message: err.message });
    }

    res.status(200);
    res.json({ success: true, 
        transaction, 
        message: `Congratulations, you have mined a new block and have earned ${transaction.amount} ShareCoins. These will be in your account as soon as the next block is mined.` });
}

export const getBlockchain = (req, res) => {
    const blockchain = bc.getChain();
    res.status(200);
    res.json({ success: true, blockchain });
}

export const getBalance = (req, res) => {
    const balance = bc.getBalance(req.params.wallet);

    res.status(200);
    res.json({success: true, balance });
}