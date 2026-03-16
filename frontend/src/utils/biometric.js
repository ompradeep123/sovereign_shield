import { api } from '../context/AuthContext';
import CryptoJS from 'crypto-js';

/**
 * SovereignShield Biometric & Device Trust Utility
 */

export const getDeviceFingerprint = () => {
    const { userAgent, platform, language } = navigator;
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const raw = `${userAgent}|${platform}|${language}|${screenRes}`;
    return CryptoJS.SHA256(raw).toString();
};

export const registerBiometric = async (stream) => {
    // In a real high-fidelity implementation, we use face-api.js to get 128D descriptors.
    // For this prototype, we simulate the extraction by hashing a frame from the stream
    // to demonstrate the end-to-end Zero Trust workflow.
    
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            
            // Capture after 1s to ensure exposure
            setTimeout(() => {
                ctx.drawImage(video, 0, 0);
                const data = canvas.toDataURL('image/jpeg');
                // Extract a "unique" embedding from the image data
                const embedding = CryptoJS.SHA256(data).toString();
                resolve(embedding);
                video.pause();
                video.srcObject = null;
            }, 1000);
        };
    });
};

export const verifyBiometric = async (stream, storedEmbedding) => {
    const currentEmbedding = await registerBiometric(stream);
    // In a real system, we'd use Euclidean distance between embeddings.
    // For the demo logic, we rely on the backend comparison of encrypted hashes.
    return currentEmbedding;
};
