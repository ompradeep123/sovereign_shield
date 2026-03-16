import Tesseract from 'tesseract.js';

/**
 * SovereignShield AI Document Classifier
 * Uses On-Device OCR to verify if a document is an official Government ID
 * without sending raw pixels to the cloud (Zero-Trust Privacy).
 */

const DOCUMENT_PATTERNS = {
    AADHAR: {
        keywords: ['Unique Identification Authority', 'Aadhaar', 'Enrollment No', 'DOB', 'Male', 'Female', 'Government of India'],
        regex: /\d{4}\s\d{4}\s\d{4}/, // XXXX XXXX XXXX format
        label: 'Aadhar Card'
    },
    PAN: {
        keywords: ['Income Tax Department', 'Permanent Account Number', 'Govt. of India', 'PAN'],
        regex: /[A-Z]{5}[0-9]{4}[A-Z]{1}/, // ABCDE1234F format
        label: 'Permanent Account Number (PAN)'
    },
    INCOME_CERT: {
        keywords: ['Income Certificate', 'Annual Income', 'Revenue Department', 'Tehsildar', 'Certificate No'],
        regex: /Rs\.|Rupees|Income/,
        label: 'Income Certificate'
    },
    ACADEMIC: {
        keywords: ['Secondary School', 'Higher Secondary', 'Board of Secondary Education', 'Marks Statement', 'Examination'],
        regex: /Roll No|Reg No|Marks/,
        label: 'Educational Certificate (10th/12th)'
    }
};

export const analyzeDocument = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                // Initialize Tesseract OCR
                const { data: { text } } = await Tesseract.recognize(reader.result, 'eng', {
                    logger: m => console.log(`[OCR_SCANNING] ${m.status}: ${Math.round(m.progress * 100)}%`)
                });

                console.log("[SCAN_RESULT_RAW]:", text);

                let identifiedType = null;
                let confidence = 0;

                // Pattern Matching Logic
                for (const [, pattern] of Object.entries(DOCUMENT_PATTERNS)) {
                    let hits = 0;
                    
                    // Check Keywords
                    pattern.keywords.forEach(word => {
                        if (text.toLowerCase().includes(word.toLowerCase())) hits++;
                    });

                    // Check Regex (ID Patterns)
                    if (pattern.regex.test(text)) hits += 3; // Regex matches are high indicators

                    if (hits > 2) {
                        identifiedType = pattern.label;
                        confidence = hits;
                        break;
                    }
                }

                if (identifiedType) {
                    resolve({ 
                        found: true, 
                        type: identifiedType, 
                        confidence,
                        text: text.substring(0, 500) // Keep snippet for audit 
                    });
                } else {
                    resolve({ 
                        found: false, 
                        message: "The document structure does not match a recognized Government Identity format (Aadhar, PAN, or Official Certificate)."
                    });
                }

            } catch (err) {
                console.error("OCR Error:", err);
                reject("AI Analysis Engine encountered an error processing the image.");
            }
        };
        reader.readAsDataURL(file);
    });
};
