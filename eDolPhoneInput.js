import { LightningElement, api } from 'lwc';
import flagEnglish from '@salesforce/resourceUrl/FlagEnglish';
import flagFrench from '@salesforce/resourceUrl/FlagFrench';
import flagArabic from '@salesforce/resourceUrl/FlagArabic';

const LANGUAGE_OPTIONS = [
    { value: 'en', label: 'English', flag: flagEnglish },
    { value: 'fr', label: 'Français', flag: flagFrench },
    { value: 'ar', label: 'العربية', flag: flagArabic }
];

export default class EDolLanguageSelector extends LightningElement {
    @api selectedLanguage = 'en';
    isOpen = false;

    get normalizedLanguage() {
        return ['en', 'fr', 'ar'].includes(this.selectedLanguage) ? this.selectedLanguage : 'en';
    }

    get selectedOption() {
        return LANGUAGE_OPTIONS.find((option) => option.value === this.normalizedLanguage) || LANGUAGE_OPTIONS[0];
    }

    get options() {
        return LANGUAGE_OPTIONS.map((option) => {
            const selected = option.value === this.normalizedLanguage;
            return {
                ...option,
                selected,
                className: selected ? 'edolLang__option edolLang__option--active' : 'edolLang__option'
            };
        });
    }

    toggleMenu(event) {
        event.preventDefault();
        event.stopPropagation();
        this.isOpen = !this.isOpen;
    }

    handleOptionClick(event) {
        event.preventDefault();
        event.stopPropagation();

        const language = event.currentTarget.dataset.language;
        if (!language || language === this.normalizedLanguage) {
            this.isOpen = false;
            return;
        }

        this.selectedLanguage = language;
        window.localStorage.setItem('edolLanguage', language);
        this.isOpen = false;

        this.dispatchEvent(new CustomEvent('languagechange', {
            detail: { language },
            bubbles: true,
            composed: true
        }));
    }

    handleKeydown(event) {
        if (event.key === 'Escape') {
            this.isOpen = false;
        }
    }
}
