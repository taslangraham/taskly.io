import { compare, hash } from "bcryptjs";
import { createHash } from 'crypto';
const SALT_LENGTH = 10;

/**
 * Returns the hash value for a given string
 * @param str strng value to hash
 */
export const stringHash = (str: string) => {
  return hash(str, SALT_LENGTH);
};

/**
 * Accepts a string and compare it's hash value against a given hash
 * @param str raw string
 * @param hashedStr hash value that string will be compared against
 */
export const hashCompare = (str: string, hashedStr: string) => {
  return compare(str, hashedStr);
};
