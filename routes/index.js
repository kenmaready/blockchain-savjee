import express from "express";
const router = express.Router();

import { welcomeMessage, getUser, getUsers, registerUser, getWallet, getSigningKey, postTransaction, getBlock, getMiningInfo, submitMiningSolution, getBlockchain, getBalance } from "../controllers/index.js";


router.get('/', welcomeMessage);
router.get('/users/:username', getUser);
router.get('/users', getUsers);
router.post('/user', registerUser);
router.get('/wallet/:username', getWallet);
router.get('/signingkey/:username', getSigningKey);
router.post('/transactions', postTransaction);
router.get("/block/:index", getBlock);
router.get("/block", getBlock);
router.get('/mine', getMiningInfo);
router.post('/mine', submitMiningSolution);
router.get('/blockchain', getBlockchain);
router.get('/balance/:wallet', getBalance);

export default router;
