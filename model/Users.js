import KeyGen from "./KeyGenerator.js";
import Transaction from "../MyCrypto/Transaction.js";

class UserDB {
    users = [];

    constructor() {};

    addUser(user) {
        this.users.push(user);
        return user;
    }

    removeUser(name) {
        const index = this.users.indexOf(findUser(name));
        this.users.splice(index,1);
    }

    findUser(name) {
        for (const user of this.users) {
            if (name == user.name) {
                return user;
            }
        }
        return false;
    }

    getUsers() { return this.users; };
}

export const userDB = new UserDB();


export class User {
    name;
    password;
    privateKey;
    publicKey;

    constructor(name, password) {
        this.name = name;
        this.password = password;
        this.generateKeys();
    }

    getName() { return this.name; };

    getPublicKey() { return this.publicKey; };
    
    checkPassword (pw) {
        return pw == this.password;
    }

    generateKeys() {
        const { privateKey, publicKey } = KeyGen.generateKeys();
        this.privateKey = privateKey;
        this.publicKey = publicKey; 
    }
}