import {Buffer} from "buffer";
import Keccak from "keccak";

export const hashMessage = (prefix: string, message: Buffer): Buffer => {
    const messageSize = Buffer.from(message.length.toString());
    const signableMessage = Buffer.concat([messageSize, message]);
    const messagePrefix = Buffer.concat([Buffer.from(prefix), signableMessage]);


    return Keccak("keccak256")
        .update(messagePrefix)
        .digest();
}