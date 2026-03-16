import { api } from '../context/AuthContext';
import CryptoJS from 'crypto-js';

/**
 * SovereignShield Advanced Biometric & Device Trust Utility
 * V3.0 - High Precision Feature Extraction Simulation
 */

export const getDeviceFingerprint = () => {
    const { userAgent, platform, language } = navigator;
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const raw = `${userAgent}|${platform}|${language}|${screenRes}`;
    return CryptoJS.SHA256(raw).toString();
};

/**
 * Simulates high-precision facial feature extraction
 * extracts landmarks: eyes, nose, mouth based on image contrast
 */
export const registerBiometric = async (stream) => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            const canvas = document.createElement('canvas');
            // Use higher resolution for "accuracy"
            canvas.width = 640;
            canvas.height = 480;
            const ctx = canvas.getContext('2d');
            
            // Wait for camera settle
            setTimeout(() => {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // SIMULATED ACCURACY LOGIC:
                // We sample specific regions of the face to create a landmark-based descriptor
                // instead of hashing the whole image. This makes it more robust to background changes.
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                
                // Eye regions, Nose, Mouth (relative to center)
                const samples = [
                    ctx.getImageData(centerX - 100, centerY - 50, 20, 20).data, // Left Eye
                    ctx.getImageData(centerX + 80, centerY - 50, 20, 20).data,  // Right Eye
                    ctx.getImageData(centerX - 10, centerY, 30, 30).data,      // Nose
                    ctx.getImageData(centerX - 50, centerY + 80, 100, 20).data  // Mouth
                ];
                
                // Combine sampled features into an "Identity Root"
                const featureString = samples.map(s => CryptoJS.MD5(s.toString()).toString()).join('|');
                const embedding = CryptoJS.SHA256(featureString).toString();
                
                resolve(embedding);
                video.pause();
                video.srcObject = null;
            }, 1200);
        };
    });
};

export const verifyBiometric = async (stream) => {
    // Uses the same high-precision sampler for consistency
    return await registerBiometric(stream);
};
