import React, { createContext, useState, useContext, useEffect } from 'react';

const translations = {
  en: {
    welcome: "Welcome back",
    verified_citizen: "Verified Citizen",
    secure_gateway: "Secure Gateway",
    soc_command: "SOC Command",
    live_monitoring: "Live Monitoring",
    threat_radar: "Threat Radar",
    security_audit: "Security Audit",
    disaster_recovery: "Disaster Recovery",
    terminate_session: "Terminate Session",
    logout: "Secure Logout",
    dashboard: "Dashboard",
    wallet: "Digital Wallet",
    services: "Request Service",
    status: "Identity Verified",
    recent_activity: "Recent Activity",
    quick_actions: "Quick Actions",
    login_title: "Sovereign Shield",
    login_subtitle: "Zero-Trust Identity Portal",
    operator_id: "Operator ID",
    secure_key: "Secure Key",
    initialize_connection: "Initialize Connection",
    language: "Language"
  },
  hi: {
    welcome: "वापसी पर स्वागत है",
    verified_citizen: "सत्यापित नागरिक",
    secure_gateway: "सुरक्षित गेटवे",
    soc_command: "एसओसी कमांड",
    live_monitoring: "लाइव निगरानी",
    threat_radar: "खतरा रडार",
    security_audit: "सुरक्षा ऑडिट",
    disaster_recovery: "आपदा प्रबंधन",
    terminate_session: "सत्र समाप्त करें",
    logout: "सुरक्षित लॉगआउट",
    dashboard: "डैशबोर्ड",
    wallet: "डिजिटल वॉलेट",
    services: "सेवा का अनुरोध",
    status: "पहचान सत्यापित",
    recent_activity: "हाल की गतिविधि",
    quick_actions: "त्वरित कार्रवाई",
    login_title: "सॉवरेन शील्ड",
    login_subtitle: "जीरो-ट्रस्ट पहचान पोर्टल",
    operator_id: "ऑपरेटर आईडी",
    secure_key: "सुरक्षित कुंजी",
    initialize_connection: "कनेक्शन प्रारंभ करें",
    language: "भाषा"
  },
  te: {
    welcome: "తిరిగి స్వాగతం",
    verified_citizen: "ధృవీకరించబడిన పౌరుడు",
    secure_gateway: "సురక్షిత గేట్‌వే",
    soc_command: "SOC కమాండ్",
    live_monitoring: "ప్రత్యక్ష పర్యవేక్షణ",
    threat_radar: "ముప్పు రాడార్",
    security_audit: "సెక్యూరిటీ ఆడిట్",
    disaster_recovery: "విపత్తు నిర్వహణ",
    terminate_session: "సెషన్‌ను ముగించు",
    logout: "సురక్షిత లాగ్అవుట్",
    dashboard: "డ్యాష్‌బోర్డ్",
    wallet: "డిజిటల్ వాలెట్",
    services: "సేవ అభ్యర్థన",
    status: "గుర్తింపు ధృవీకరించబడింది",
    recent_activity: "ఇటీవలి కార్యాచరణ",
    quick_actions: "త్వరిత చర్యలు",
    login_title: "సావరిన్ షీల్డ్",
    login_subtitle: "జీరో-ట్రస్ట్ ఐడెంటిటీ పోర్టల్",
    operator_id: "ఆపరేటర్ ID",
    secure_key: "సురక్షిత కీ",
    initialize_connection: "కనెక్షన్‌ని ప్రారంభించండి",
    language: "భాష"
  },
  ta: {
    welcome: "மீண்டும் வருக",
    verified_citizen: "சரிபார்க்கப்பட்ட குடிமகன்",
    secure_gateway: "பாதுகாப்பான கேட்வே",
    soc_command: "SOC கட்டளை",
    live_monitoring: "நேரடி கண்காணிப்பு",
    threat_radar: "அச்சுறுத்தல் ரேடார்",
    security_audit: "பாதுகாப்பு தணிக்கை",
    disaster_recovery: "பேரிடர் மீட்பு",
    terminate_session: "அமர்வை முடி",
    logout: "பாதுகாப்பான வெளியேற்றம்",
    dashboard: "டாஷ்போர்டு",
    wallet: "டிஜிட்டல் வாலட்",
    services: "சேவை கோரிக்கை",
    status: "அடையாளம் சரிபார்க்கப்பட்டது",
    recent_activity: "சமீபத்திய செயல்பாடு",
    quick_actions: "விரைவான நடவடிக்கைகள்",
    login_title: "சவரன் ஷீல்ட்",
    login_subtitle: "ஜீரோ-ட்ரஸ்ட் அடையாள போர்டல்",
    operator_id: "ஆபரேட்டர் ஐடி",
    secure_key: "பாதுகாப்பான திறவுகோல்",
    initialize_connection: "இணைப்பைத் தொடங்கவும்",
    language: "மொழி"
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
