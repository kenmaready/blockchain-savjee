import express from "express";
import KeyGen from "../MyCrypto/KeyGenerator.js";

export const welcomeMessage = (req, res) => {
    res.status = 200;
    res.json({ message: "Welcome to the ShareCoin API...", success: true });
}

export const registerUser = (req, res) => {


}

export const getKeys = (req, res) => {
    const keys = KeyGen.getKeys();
    res.status(200);
    res.json({ ...keys, success: true });
}