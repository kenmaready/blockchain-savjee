import "./db.js";
import mongoose from "mongoose";
import readline from "readline";
import Blockchain from "./model/Blockchain.js";
import Block from "./model/Block.js";
import Transaction from "./model/Transaction.js";
import User from "./model/User.js";

const ui = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
   
  ui.question('Are you sure you want to delete the current blockchain, iincluding all blocks and transactions? (y/n)', async input => {
    if (input.toLowerCase()==="yes" || input.toLowerCase().charAt(0) === 'y') {
        await Blockchain.deleteMany({});
        await Block.deleteMany({});
        await Transaction.deleteMany({});
        await User.deleteOne({name: 'god'});

        console.log("Blockchain deleted...");
    }
    ui.close();
    process.exit(0);
  });