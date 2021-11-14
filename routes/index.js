import express from "express";
const router = express.Router();

import { welcomeMessage, getUser, getUsers, registerUser, getKeys, postTransaction, getBlock, mineTransactions, getBlockchain, getBalance } from "../controllers/index.js";


router.get('/', welcomeMessage);
router.get('/users/:username', getUser);
router.get('/users', getUsers);
router.post('/user', registerUser);
router.get('/keys/:username', getKeys);
router.post('/transactions', postTransaction);
router.get("/block/:index", getBlock);
router.get("/block", getBlock);
router.post('/block/mine', mineTransactions);
router.get('/blockchain', getBlockchain);
router.get('/balance/:wallet', getBalance);

export default router;
