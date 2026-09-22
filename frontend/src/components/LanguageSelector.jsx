import { ChevronDown } from 'lucide-react';
import languages from '../config/languages';
import './LanguageSelector.css';

/**
 * Reusable language selector dropdown
 *
 * @param {string} value - Selected language code
 * @param {function} onChange - Called with new language code
 * @param {string} [label] - Accessible label
 * @param {string} [excludeCode] - Language code to exclude (for preventing same source/target)
 */
const LanguageSelector = ({ value, onChange, label, excludeCode }) => {
  const filteredLanguages = excludeCode
    ? languages.filter((lang) => lang.code !== excludeCode)
    : languages;

  const selectedLang = languages.find((lang) => lang.code === value);

  return (
    <div className="language-selector">
      {label && <label className="language-selector-label">{label}</label>}
      <div className="language-selector-wrapper">
        <select
          className="language-selector-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label || 'Select language'}
        >
          {filteredLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
        <div className="language-selector-display">
          <span className="language-selector-flag">{selectedLang?.flag}</span>
          <span className="language-selector-name">{selectedLang?.name}</span>
          <ChevronDown size={16} className="language-selector-chevron" />
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
