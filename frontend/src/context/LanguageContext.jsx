import React, { createContext, useState, useContext, useEffect } from 'react';

const translations = {
  en: {
    dashboard: "Citizen Dashboard",
    wallet: "Digital Identity Wallet",
    services: "Government Services",
    trust_timeline: "Trust Timeline",
    verify_cert: "Verify Certificate",
    profile: "My Profile",
    welcome: "Welcome back",
    verified_citizen: "Verified Citizen",
    logout: "Secure Logout",
    status: "Verified Account",
    recent_activity: "Recent Activity",
    quick_actions: "Quick Access",
    soc_command: "SOC Command Center",
    live_monitoring: "Infrastructure Pulse",
    threat_radar: "Threat Intelligence",
    security_audit: "Security Audit",
    disaster_recovery: "Disaster Management",
    terminate_session: "Terminate Session",
    operator_id: "Operator ID",
    secure_key: "Secure Key",
    initialize_connection: "Initialize Connection",
    login_title: "Sovereign Shield",
    login_subtitle: "Zero-Trust Identity Portal",
    privacy_center: "Privacy Center",
    data_control: "Data Control Center",
  },
  hi: {
    dashboard: "नागरिक डैशबोर्ड",
    wallet: "डिजिटल पहचान वॉलेट",
    services: "सरकारी सेवाएं",
    trust_timeline: "ट्रस्ट टाइमलाइन",
    verify_cert: "प्रमाणपत्र सत्यापित करें",
    profile: "मेरी रूपरेखा",
    welcome: "वापसी पर स्वागत है",
    verified_citizen: "सत्यापित नागरिक",
    logout: "सुरक्षित लॉगआउट",
    status: "सत्यापित खाता",
    recent_activity: "हाल की गतिविधि",
    quick_actions: "त्वरित पहुंच",
    soc_command: "एसओसी कमांड सेंटर",
    live_monitoring: "इन्फ्रास्ट्रक्चर पल्स",
    threat_radar: "खतरा खुफिया",
    security_audit: "सुरक्षा ऑडिट",
    disaster_recovery: "आपदा प्रबंधन",
    terminate_session: "सत्र समाप्त करें",
    operator_id: "ऑपरेटर आईडी",
    secure_key: "सुरक्षित कुंजी",
    initialize_connection: "कनेक्शन प्रारंभ करें",
    login_title: "सॉवरेन शील्ड",
    login_subtitle: "जीरो-ट्रस्ट पहचान पोर्टल",
    privacy_center: "गोपनीयता केंद्र",
    data_control: "डेटा नियंत्रण केंद्र",
  },
  te: {
    dashboard: "పౌర డాష్‌బోర్డ్",
    wallet: "డిజిటల్ గుర్తింపు వాలెట్",
    services: "ప్రభుత్వ సేవలు",
    trust_timeline: "ట్రస్ట్ టైమ్‌లైన్",
    verify_cert: "ధృవీకరణ పత్రాన్ని ధృవీకరించండి",
    profile: "నా ప్రొఫైల్",
    welcome: "తిరిగి స్వాగతం",
    verified_citizen: "ధృవీకరించబడిన పౌరుడు",
    logout: "సురక్షిత లాగ్అవుట్",
    status: "ధృవీకరించబడిన ఖాతా",
    recent_activity: "ఇటీవలి కార్యాచరణ",
    quick_actions: "త్వరిత ప్రాప్యత",
    soc_command: "SOC కమాండ్ సెంటర్",
    live_monitoring: "మౌలిక సదుపాయాల పల్స్",
    threat_radar: "ముప్పు ఇంటెలిజెన్స్",
    security_audit: "సెక్యూరిటీ ఆడిట్",
    disaster_recovery: "విపత్తు నిర్వహణ",
    terminate_session: "సెషన్‌ను ముగించు",
    operator_id: "ఆపరేటర్ ID",
    secure_key: "సురక్షిత కీ",
    initialize_connection: "కనెక్షన్‌ని ప్రారంభించండి",
    login_title: "సావరిన్ షీల్డ్",
    login_subtitle: "జీరో-ట్రస్ట్ ఐడెంటిటీ పోర్టల్",
    privacy_center: "గోప్యతా కేంద్రం",
    data_control: "డేటా నియంత్రణ కేంద్రం",
  },
  ta: {
    dashboard: "குடிமகன் டாஷ்போர்டு",
    wallet: "டிஜிட்டல் அடையாள வாலட்",
    services: "அரசு சேவைகள்",
    trust_timeline: "நம்பிக்கை காலவரிசை",
    verify_cert: "சான்றிதழைச் சரிபார்க்கவும்",
    profile: "எனது சுயவிவரம்",
    welcome: "மீண்டும் வருக",
    verified_citizen: "சரிபார்க்கப்பட்ட குடிமகன்",
    logout: "பாதுகாப்பான வெளியேற்றம்",
    status: "சரிபார்க்கப்பட்ட கணக்கு",
    recent_activity: "சமீபத்திய செயல்பாடு",
    quick_actions: "விரைவான அணுகல்",
    soc_command: "SOC கட்டளை மையம்",
    live_monitoring: "உள்கட்டமைப்பு துடிப்பு",
    threat_radar: "அச்சுறுத்தல் உளவுத்துறை",
    security_audit: "பாதுகாப்பு தணிக்கை",
    disaster_recovery: "பேரிடர் மேலாண்மை",
    terminate_session: "அமர்வை முடி",
    operator_id: "ஆபரேட்டர் ஐடி",
    secure_key: "பாதுகாப்பான திறவுகோல்",
    initialize_connection: "இணைப்பைத் தொடங்கவும்",
    login_title: "சவரன் ஷீல்ட்",
    login_subtitle: "ஜீரோ-ட்ரஸ்ட் அடையாள போர்டல்",
    privacy_center: "தனியுரிமை மையம்",
    data_control: "தரவு கட்டுப்பாட்டு மையம்",
  }
};

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('sov_lang') || 'en');

  const t = (key) => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('sov_lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
