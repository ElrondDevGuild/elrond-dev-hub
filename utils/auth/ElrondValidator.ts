import * as tweetnacl from "tweetnacl";
import {Buffer} from "buffer";
import {bech32} from "bech32";
import {hashMessage} from "./hash";

const MESSAGE_PREFIX = "\x17Elrond Signed Message:\n";

export default class ElrondValidator {
    validate(signature: string, address: string, nonce: string): boolean {
        const pubKey = this.getPubKey(address);
        const msg = `${address}${nonce}{}`;
        const message = hashMessage(MESSAGE_PREFIX, Buffer.from(msg));
        const result = tweetnacl.sign.open(
            Buffer.concat([Buffer.from(signature, "hex"), message]),
            pubKey
        );

        return result !== null;

    }

    protected getPubKey(address: string): Buffer {
        const decoded = bech32.decode(address);

        return Buffer.from(bech32.fromWords(decoded.words));
    }


};