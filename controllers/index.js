// import express from "express";
import bc from "../MyCrypto/Blockchain.js";
import { User, userDB as db } from "../model/Users.js";
import Transaction from "../MyCrypto/Transaction.js";


export const welcomeMessage = (req, res) => {
    res.status = 200;
    res.json({ message: "Welcome to the ShareCoin API...", success: true });
}

export const getUser = (req, res) => {
    const { username } = req.params;
    const user = db.findUser(username);

    if (!user) {
        res.status(404);
        return res.json({ success: false, error: true, message: "User not found."});
    }

    res.status(200);
    res.json({ success: true, user });
}

export const getUsers = (req, res) => {
    const users = db.getUsers();
    res.status(200);
    res.json({ success: true, users });
}


export const registerUser = (req, res) => {
    const { name, password } = req.body;
    const user = db.addUser(new User(name, password));

    res.status(200);
    res.json({ user, success: true });
}

export const getKeys = (req, res) => {
    const { username } = req.params;
    const user = db.findUser(username);
    
    if (!user) {
        res.status(404);
        return res.json({ success: false, error: true, message: "User not found."});
    }

    const { privateKey, publicKey } = user;

    res.status(200);
    res.json({ privateKey, publicKey, success: true });
}

export const postTransaction = (req, res) => {
    const { from, to, amount, signingKey } = req.body;
    let transaction;

    try {
        transaction = new Transaction(from, to, amount);
        transaction.signTransaction(signingKey);
        bc.addTransaction(transaction);
    } catch (err) {
        res.status(400);
        return res.json({success: false, error: true, message: err.message});
    }

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