import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
    path: './config.env'
});
import "./db.js";

import Blockchain from "./model/Blockchain.js";
import Block from "./model/Block.js";
import Transaction from "./model/Transaction.js";
import User from "./model/User.js";



const deleteDB = async function () {
    await Blockchain.deleteMany({});
    await Block.deleteMany({});
    await Transaction.deleteMany({});
    await User.deleteMany({});
    console.log("Blockchain deleted...");
    mongoose.connection.close();
}

deleteDB();