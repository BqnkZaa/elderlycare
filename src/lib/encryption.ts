/**
 * PDPA-Compliant Encryption Utilities
 * 
 * These utilities provide encryption/decryption for sensitive data
 * such as National ID, phone numbers, etc.
 * 
 * Uses AES-256-CBC encryption for PDPA compliance.
 */

import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-32-char-encryption-key!';

/**
 * Encrypt sensitive data
 * @param plainText - The text to encrypt
 * @returns Encrypted string (base64 encoded)
 */
export function encrypt(plainText: string): string {
    if (!plainText) return '';

    try {
        const encrypted = CryptoJS.AES.encrypt(plainText, ENCRYPTION_KEY).toString();
        return encrypted;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}

/**
 * Decrypt encrypted data
 * @param encryptedText - The encrypted text (base64 encoded)
 * @returns Decrypted string
 */
export function decrypt(encryptedText: string): string {
    if (!encryptedText) return '';

    try {
        const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
}

/**
 * Mask sensitive data for display (e.g., show last 4 digits of ID)
 * @param text - The text to mask
 * @param visibleChars - Number of characters to show at the end
 * @returns Masked string
 */
export function maskSensitiveData(text: string, visibleChars: number = 4): string {
    if (!text || text.length <= visibleChars) return text;

    const masked = '*'.repeat(text.length - visibleChars) + text.slice(-visibleChars);
    return masked;
}

/**
 * Hash data using SHA-256 (for non-reversible hashing)
 * @param text - The text to hash
 * @returns SHA-256 hash
 */
export function hashData(text: string): string {
    return CryptoJS.SHA256(text).toString();
}
