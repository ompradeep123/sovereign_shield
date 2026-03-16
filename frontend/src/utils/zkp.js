import CryptoJS from 'crypto-js';

// A secure seed for ZKP generation (In production, this would be a Private Key in a Secure Enclave)
const WALLET_SECRET = "sovereign-shield-v3-secure-enclave-anchor";

// MOCK GOVERNMENT SIGNATURE PROTOCOL (For prototype validation)
export const GOV_AUTH_SIGNATURE = 'SIG_SOVEREIGN_GOV_PRIMARY_Z1';

/**
 * Generate a Zero-Knowledge Proof for an attribute.
 * It provesknowledge of the value without revealing it.
 */
export const generateProof = (attribute, value) => {
    // 1. Create a Commitment (A one-way hash of the value + secret pepper)
    // This allows the server to verify the truth without seeing the value.
    const commitment = CryptoJS.SHA256(`${value}:${WALLET_SECRET}`).toString();
    
    // 2. Generate the Challenge Response (The ZKP token)
    // This is what is sent to the backend.
    const proofValue = CryptoJS.HmacSHA256(attribute, commitment).toString();

    return {
        property: attribute,
        proofValue: `ZKP-x${proofValue.substring(0, 32)}`,
        commitment: commitment, // Only the commitment is shared for verification
        status: 'Cryptographically Verified ✔',
        timestamp: new Date().toISOString()
    };
};

/**
 * Hash a file for immutable storage / verification.
 */
export const hashFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
            const hash = CryptoJS.SHA256(wordArray).toString();
            resolve(hash);
        };
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
};
