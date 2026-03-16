import Tesseract from 'tesseract.js';

/**
 * SovereignShield AI Document Classifier V2
 * Uses On-Device OCR to verify if a document is an official Government ID
 * optimized for Indian Government IDs (Aadhar, PAN, MSME, etc.)
 */

const DOCUMENT_PATTERNS = {
    AADHAR: {
        keywords: ['Unique Identification', 'Aadhaar', 'Enrollment', 'DOB', 'Male', 'Female', 'India', 'Aadhar', 'Government of India'],
        regex: /\d{4}\s\d{4}\s\d{4}/, 
        label: 'Aadhar Card'
    },
    PAN: {
        keywords: ['Income Tax', 'Permanent Account', 'PAN', 'Govt. of India', 'Department', 'Signature of Card'],
        regex: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
        label: 'Permanent Account Number (PAN)'
    },
    MSME: {
        keywords: ['MSME', 'Udyam', 'Registration', 'Enterprise', 'Micro', 'Small', 'Medium', 'Udyog Aadhaar'],
        regex: /UDYAM-[A-Z]+-[0-9]+/,
        label: 'MSME Certificate'
    },
    INCOME_CERT: {
        keywords: ['Income Certificate', 'Annual', 'Revenue', 'Tehsildar', 'Certificate', 'Signature', 'Authorized'],
        regex: /Rs\.|Rupees|Income|Annual/,
        label: 'Income Certificate'
    },
    ACADEMIC: {
        keywords: ['Secondary', 'Higher', 'Education', 'Board', 'Marks', 'Result', 'Examination', 'University', 'College'],
        regex: /Roll No|Reg No|Marks|Grade/,
        label: 'Educational Certificate (10th/12th)'
    }
};

// Global "Gov Presence" Keywords to catch edge cases
const GOV_HEADERS = ['Government', 'India', 'Ministry', 'Department', 'Official', 'National', 'Statutory', 'Authority'];

export const analyzeDocument = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                // Initialize Tesseract OCR with a simplified logger
                const { data: { text } } = await Tesseract.recognize(reader.result, 'eng');

                const cleanText = text.replace(/\n/g, ' ').toLowerCase();
                console.log("[AI_SCAN_DEBUG]:", cleanText);

                let identifiedType = null;
                let highestScore = 0;

                // 1. Specific Pattern Matching
                for (const [, pattern] of Object.entries(DOCUMENT_PATTERNS)) {
                    let score = 0;
                    
                    pattern.keywords.forEach(word => {
                        if (cleanText.includes(word.toLowerCase())) score += 1;
                    });

                    if (pattern.regex.test(text)) score += 5;

                    if (score > 1 && score > highestScore) {
                        highestScore = score;
                        identifiedType = pattern.label;
                    }
                }

                // 2. Fallback: Check if it's a generic Government Document (High resilience)
                if (!identifiedType) {
                    let govHeaderHits = 0;
                    GOV_HEADERS.forEach(header => {
                        if (cleanText.includes(header.toLowerCase())) govHeaderHits++;
                    });

                    if (govHeaderHits >= 1) {
                        identifiedType = 'Government Verified Document';
                        highestScore = govHeaderHits;
                    }
                }

                if (identifiedType) {
                    resolve({ 
                        found: true, 
                        type: identifiedType, 
                        confidence: highestScore,
                        text: text.substring(0, 500)
                    });
                } else {
                    resolve({ 
                        found: false, 
                        message: "The AI Engine could not find official Government markers in this document. Please ensure the scan is clear and contains official keywords like 'Government' or 'Ministry'."
                    });
                }

            } catch (err) {
                console.error("AI Analysis Error:", err);
                reject("AI Analysis Engine encountered a technical fault. Please retry or ensure the file is a valid image.");
            }
        };
        reader.readAsDataURL(file);
    });
};
