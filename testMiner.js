import fs from "fs";
import { stringify } from "querystring";
import Miner from "./model/Miner.js";

var fileName = process.argv[2];
console.log("args:", fileName);

let raw = fs.readFileSync(fileName);
console.log("raw:", raw);
let info = JSON.parse(raw);
console.log("miningInfo:", info.miningInfo);
const { transactions, previousHash, difficulty } = info.miningInfo;
console.log("transactions:", transactions);

const miner = new Miner(info.minedBy);
miner.setMiningInfo(info.miningInfo);
miner.mine();
console.log(miner.submitSolution());

const solution = JSON.stringify(miner.submitSolution());
fs.writeFileSync('./testMinerSolution.json', solution);