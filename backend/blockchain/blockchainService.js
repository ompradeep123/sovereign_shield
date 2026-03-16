const { ethers } = require('ethers');

// Manual ABI for simplicity since we want to avoid Hardhat ESM conflicts with our CJS backend
const CertificateRegistryABI = [
  "function storeCertificate(string _certificateId, string _hash) public",
  "function verifyCertificate(string _certificateId, string _hash) public view returns (bool)",
  "event CertificateStored(string indexed certificateId, bytes32 indexed dataHash, uint256 timestamp)"
];

// Provide fallbacks for Demo Environment
const polygonAmoyRPC = process.env.POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology/";
// Fallback private key for demo (DO NOT USE IN PRODUCTION)
const privateKey = process.env.PRIVATE_KEY || "0x1234567890123456789012345678901234567890123456789012345678901234"; 
const contractAddress = process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

let provider;
let wallet;
let contract;

try {
  provider = new ethers.JsonRpcProvider(polygonAmoyRPC);
  wallet = new ethers.Wallet(privateKey, provider);
  contract = new ethers.Contract(contractAddress, CertificateRegistryABI, wallet);
} catch (error) {
  console.warn("Polygon integration failed to initialize (Ensure PRIVATE_KEY is valid). Running in mock mode.");
}

async function storeHashOnBlockchain(certificateId, dataHash) {
    if (!contract || contractAddress === "0x0000000000000000000000000000000000000000") {
        console.log(`[MOCK BLOCKCHAIN] Stored certificate ${certificateId} with hash ${dataHash} on Polygon Amoy (Simulated)`);
        // Generate a mock transaction hash
        return `0x${require('crypto').randomBytes(32).toString('hex')}`;
    }

    try {
        const tx = await contract.storeCertificate(certificateId, dataHash);
        await tx.wait();
        return tx.hash;
    } catch (error) {
        console.error("Blockchain transaction failed:", error);
        throw new Error("Blockchain integration error");
    }
}

async function verifyHashOnBlockchain(certificateId, dataHash) {
    if (!contract || contractAddress === "0x0000000000000000000000000000000000000000") {
        console.log(`[MOCK BLOCKCHAIN] Verified certificate ${certificateId} on Polygon Amoy (Simulated)`);
        return true; // Mock verification
    }

    try {
        return await contract.verifyCertificate(certificateId, dataHash);
    } catch (error) {
        console.error("Blockchain verification failed:", error);
        return false;
    }
}

module.exports = {
    storeHashOnBlockchain,
    verifyHashOnBlockchain
};
