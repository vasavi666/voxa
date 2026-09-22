// Centralized language configuration for VOXA
// All components should import languages from this file

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', speechCode: 'en-US' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', speechCode: 'te-IN' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', speechCode: 'hi-IN' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', speechCode: 'kn-IN' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', speechCode: 'ta-IN' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', speechCode: 'ml-IN' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳', speechCode: 'bn-IN' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', speechCode: 'mr-IN' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', speechCode: 'gu-IN' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', speechCode: 'pa-IN' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', speechCode: 'es-ES' },
  { code: 'fr', name: 'French', flag: '🇫🇷', speechCode: 'fr-FR' },
  { code: 'de', name: 'German', flag: '🇩🇪', speechCode: 'de-DE' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', speechCode: 'ja-JP' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', speechCode: 'ko-KR' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', speechCode: 'zh-CN' },
];

// Helper: get language object by code
export const getLanguageByCode = (code) => {
  return languages.find((lang) => lang.code === code) || languages[0];
};

// Helper: get display string like "English 🇬🇧"
export const getLanguageDisplay = (code) => {
  const lang = getLanguageByCode(code);
  return `${lang.name} ${lang.flag}`;
};

export default languages;
