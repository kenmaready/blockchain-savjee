import express from "express";
const router = express.Router();

import { welcomeMessage, registerUser, getKeys } from "../controllers/index.js";


router.get('/', welcomeMessage);
router.post('/user', registerUser);
router.get('/keys', getKeys)

export default router;
