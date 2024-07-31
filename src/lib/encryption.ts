import { AES, enc, SHA256 } from 'crypto-js';
import { ethers } from 'ethers';

// Function to derive a fixed-length key from a signature using Keccak256
export const signToKeccak256 = (signature: string): string => {
  console.log("SIGN_KEY",process.env.SIGN_KEY);
  return ethers.keccak256(ethers.toUtf8Bytes(signature));
};

// Function to derive a fixed-length key from a signature
const deriveKey = (signature: string): string => {
  return SHA256(signature).toString(enc.Hex);
};

export const encryptData = (data: string, key: string): string => {
  const derivedKey = deriveKey(key);
  return AES.encrypt(data, derivedKey).toString();
};

export const decryptData = (encryptedData: string, key: string): string => {
  const derivedKey = deriveKey(key);
  const bytes = AES.decrypt(encryptedData, derivedKey);
  return bytes.toString(enc.Utf8);
};
