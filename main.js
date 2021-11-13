const fs = require('fs');
const EC = require("elliptic").ec;
const ec = new EC('secp256k1');

const Blockchain = require("./MyCrypto/Blockchain");
const Block = require("./MyCrypto/Block");
const Transaction = require("./MyCrypto/Transaction");

// generate keys & wallets

// read in data from json file:
let rawdata = fs.readFileSync('users.json');
let users = JSON.parse(rawdata);

const ken = users.ken;
ken.key = ec.keyFromPrivate(ken.privateKey);
ken.wallet = ken.publicKey;

const april = users.april;
april.key = ec.keyFromPrivate(april.privateKey);
april.wallet = april.publicKey;

const minerx = users.minerx;
minerx.key = ec.keyFromPrivate(minerx.privateKey);
minerx.wallet = minerx.publicKey;


bc = new Blockchain();

const tx1 = new Transaction(ken.wallet, april.wallet, 27);
tx1.signTransaction(ken.key);
bc.addTransaction(tx1);

bc.minePendingTransactions(minerx.wallet);
bc.minePendingTransactions(minerx.wallet);
// console.log(bc.chain[1].transactions);
console.log(bc.isChainValid());

console.log("ken has", bc.getBalance(ken.wallet),"credits.");
console.log("april has", bc.getBalance(april.wallet),"credits.");
console.log("minerx has", bc.getBalance(minerx.wallet),"credits.");


