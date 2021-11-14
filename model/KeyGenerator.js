import EC from "elliptic";

class KeyGenerator {
    constructor() {
        this.ec = new EC.ec('secp256k1');
    }

    generateKeys() {
        const key = this.ec.genKeyPair();
        const publicKey = key.getPublic('hex');
        const privateKey = key.getPrivate('hex');
        return { privateKey, publicKey };
    }
}

const KeyGen = new KeyGenerator();
export default KeyGen;
