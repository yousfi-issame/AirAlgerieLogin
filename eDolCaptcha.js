import { LightningElement, api } from 'lwc';
import basePath from '@salesforce/community/basePath';
import verifyRecaptchaToken from '@salesforce/apex/EDolRecaptchaController.verifyToken';
import submitComplaint from '@salesforce/apex/EDolSubmissionController.submitComplaint';
import {
    getText,
    getFieldLabels,
    getCountryOptions,
    getRegionOptions,
    getCivilityOptions,
    getClaimantOptions,
    getCancellationDelayReasons,
    getTicketPurchaseChannelOptions,
    getInitialLanguage
} from 'c/eDolFormData';



function getApexErrorMessage(error) {
    return (error && error.body && error.body.message) ||
        (error && error.message) ||
        'Unable to submit the complaint.';
}


function buildCommunityUrl(path) {
    if (!path || path === '/') {
        return basePath || '/';
    }
    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    const cleanBase = basePath && basePath !== '/' ? basePath.replace(/\/$/, '') : '';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    if (cleanBase && (cleanPath === cleanBase || cleanPath.startsWith(`${cleanBase}/`))) {
        return cleanPath;
    }

    return `${cleanBase}${cleanPath}` || '/';
}

function getSubmissionReference(result) {
    return result && (result.caseNumber || result.caseId) ? (result.caseNumber || result.caseId) : '';
}

function buildSuccessMessage(text, result) {
    const reference = result && (result.caseNumber || result.caseId);
    if (!reference) {
        return text.successMessage;
    }
    return `${text.successMessage} ${text.reference}: ${reference}`;
}


function normalizeTicketsForApex(tickets) {
    return (tickets || [])
        .filter((ticket) => ticket && (ticket.number || ticket.fullTicketNumber))
        .map((ticket) => ({
            prefix: ticket.prefix || '124',
            ticketNumber: ticket.number || ticket.ticketNumber || '',
            fullTicketNumber: ticket.fullTicketNumber || `${ticket.prefix || '124'}${ticket.number || ticket.ticketNumber || ''}`,
            details: ticket.details || ''
        }));
}

function buildKey(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}


function getTodayIso() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function isValidIsoDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) {
        return false;
    }

    const [year, month, day] = value.split('-').map((part) => parseInt(part, 10));
    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;
}

function getIsoYearsAgo(years) {
    const date = new Date();
    date.setFullYear(date.getFullYear() - years);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getDateValidationMessage(language, fieldLabel, rule) {
    const lang = (language || 'en').toLowerCase();

    const messages = {
        en: {
            invalid: `Please enter a valid date for ${fieldLabel}.`,
            future: `${fieldLabel} cannot be a future date.`,
            tooOld: `${fieldLabel} cannot be more than 120 years ago.`
        },
        fr: {
            invalid: `Veuillez saisir une date valide pour ${fieldLabel}.`,
            future: `${fieldLabel} ne peut pas être une date future.`,
            tooOld: `${fieldLabel} ne peut pas dépasser 120 ans.`
        },
        ar: {
            invalid: `يرجى إدخال تاريخ صحيح لـ ${fieldLabel}.`,
            future: `${fieldLabel} لا يمكن أن يكون تاريخًا مستقبليًا.`,
            tooOld: `${fieldLabel} لا يمكن أن يتجاوز 120 سنة.`
        }
    };

    return (messages[lang] || messages.en)[rule];
}

function getInitialFormData() {
    return {
        reason: '',
        ticketPurchaseChannel: '',
        claimantType: '',
        civility: '',
        lastName: '',
        firstName: '',
        mobilePhone: '',
        landlinePhone: '',
        email: '',
        confirmEmail: '',
        countryOfResidence: '',
        regionOfResidence: '',
        addressOfResidence: '',
        postalCode: '',
        dateOfBirth: '',
        incidentLocation: '',
        flightNumber: '',
        flightDate: '',
        details: '',
        consentAccepted: false
    };
}

export default class EDolCancellationDelayForm extends LightningElement {
    @api backUrl = '/';
    @api readonlyPrefilledAccount = false;

    _prefillData;

    @api
    get prefillData() {
        return this._prefillData;
    }

    set prefillData(value) {
        this._prefillData = value;
        this.applyPrefillData(value);
    }
    selectedLanguage = 'en';
    formData = getInitialFormData();
    tickets = [];
    captchaAccepted = false;
    captchaToken = '';
    submitAfterCaptcha = false;
    isSubmitting = false;
    errorMessage = '';
    errorModalOpen = false;
    successMessage = '';
    submissionDone = false;
    submissionReference = '';
    uploadedFiles = [];
    phoneValidation = {};
    fileUploadSessionKey = buildKey('cancellation-delay');

    get text() { return getText(this.selectedLanguage); }
    get labels() { return getFieldLabels(this.selectedLanguage); }
    get submitLabel() { return this.isSubmitting ? this.text.submitting : this.text.submit; }
    get todayIso() { return getTodayIso(); }
    get errorModalTitle() {
        const language = (this.selectedLanguage || 'en').toLowerCase();
        if (language === 'fr') {
            return 'Vérification requise';
        }
        if (language === 'ar') {
            return 'التحقق مطلوب';
        }
        return 'Verification required';
    }
    get errorOkLabel() { return (this.text && this.text.ok) ? this.text.ok : 'OK'; }
    get isSubmitted() { return this.submissionDone; }
    get currentStep() { return this.submissionDone ? '3' : '2'; }
    get reasonOptions() { return getCancellationDelayReasons(this.selectedLanguage); }
    get ticketPurchaseChannelOptions() { return getTicketPurchaseChannelOptions(this.selectedLanguage); }
    get isCancellationReason() { return this.formData.reason === 'cancellation'; }
    get showRegionOfResidence() { return Boolean(this.formData.countryOfResidence); }
    get isSubmitDisabled() { return this.isSubmitting; }
    get claimantOptions() { return getClaimantOptions(this.selectedLanguage); }
    get civilityOptions() { return getCivilityOptions(this.selectedLanguage); }
    get countryOptions() { return getCountryOptions(this.selectedLanguage); }
    get regionOptions() { return getRegionOptions(this.formData.countryOfResidence, this.selectedLanguage); }
    get isRegionDisabled() { return !this.formData.countryOfResidence; }
    get isAccountReadOnly() { return false; }

    renderedCallback() {
        this.updateSelectPlaceholderStyles();
    }

    updateSelectPlaceholderStyles() {
        const selects = this.template.querySelectorAll('select.edol-select');
        selects.forEach((select) => {
            if (!select.value) {
                select.classList.add('edol-select-placeholder');
            } else {
                select.classList.remove('edol-select-placeholder');
            }
        });
    }

    connectedCallback() {
        this.selectedLanguage = getInitialLanguage();
        this.readonlyPrefilledAccount = false;
        this.applyPrefillData(this._prefillData);
    }

    setStoredLanguage(language) {
        try {
            window.localStorage.setItem('edolLanguage', language);
        } catch (error) {}
    }

    handleLanguageChange(event) {
        this.selectedLanguage = event.detail.language;
        this.setStoredLanguage(event.detail.language);
    }

    handleInputChange(event) {
        const detail = event.detail || {};
        const name = detail.name || event.target.name;
        if (this.isAccountReadOnly && this.isAccountField(name)) {
            return;
        }
        const value = Object.prototype.hasOwnProperty.call(detail, 'value') ? detail.value : (event.target.value || '');
        const nextData = { ...this.formData, [name]: value };

        if (name === 'reason' && value !== 'cancellation') {
            nextData.ticketPurchaseChannel = '';
            this.clearFieldHighlight('ticketPurchaseChannel');
        }

        this.formData = nextData;
        this.clearFieldHighlight(name);
        window.setTimeout(() => this.updateSelectPlaceholderStyles(), 0);

        if (name === 'email' || name === 'confirmEmail') {
            this.clearFieldHighlight('email');
            this.clearFieldHighlight('confirmEmail');
        }
    }

    handleCountryChange(event) {
        const countryOfResidence = event.target.value || '';
        const availableRegions = countryOfResidence ? getRegionOptions(countryOfResidence, this.selectedLanguage) : [];
        const autoSelectedRegion = availableRegions.length === 1 ? availableRegions[0].value : '';

        this.formData = {
            ...this.formData,
            countryOfResidence,
            regionOfResidence: autoSelectedRegion
        };

        this.clearFieldHighlight('countryOfResidence');
        if (autoSelectedRegion) {
            this.clearFieldHighlight('regionOfResidence');
        }
        window.setTimeout(() => this.updateSelectPlaceholderStyles(), 0);
    }

    handlePhoneChange(event) {
        const fieldName = event.detail.name;
        const phoneValue = event.detail.value || {};
        this.formData = { ...this.formData, [fieldName]: phoneValue.fullNumber || '' };
        this.phoneValidation = {
            ...this.phoneValidation,
            [fieldName]: {
                isValid: phoneValue.isValid !== false,
                message: phoneValue.validationMessage || this.getGenericPhoneValidationMessage()
            }
        };

        if (!phoneValue.fullNumber || phoneValue.isValid !== false) {
            this.clearFieldHighlight(fieldName);
        }
    }

    isAccountField(name) {
        return ['civility', 'lastName', 'firstName', 'mobilePhone', 'landlinePhone', 'email', 'confirmEmail', 'countryOfResidence', 'regionOfResidence', 'addressOfResidence', 'postalCode', 'dateOfBirth'].includes(name);
    }

    applyPrefillData(prefillData) {
        if (!prefillData) {
            return;
        }
        const values = prefillData.values || prefillData;
        if (!values || typeof values !== 'object') {
            return;
        }

        const cleanValues = {};
        Object.keys(values).forEach((key) => {
            const value = values[key];
            if (value !== null && value !== undefined && value !== '') {
                cleanValues[key] = value;
            }
        });

        if (Object.keys(cleanValues).length) {
            this.formData = { ...this.formData, ...cleanValues };
            window.setTimeout(() => {
                this.syncPhoneInputs();
                this.updateSelectPlaceholderStyles();
            }, 0);
        }
    }

    syncPhoneInputs() {
        const mobilePhone = this.template.querySelector('c-e-dol-phone-input[name="mobilePhone"]');
        if (mobilePhone && mobilePhone.value !== this.formData.mobilePhone) {
            mobilePhone.value = this.formData.mobilePhone || '';
        }
        const landlinePhone = this.template.querySelector('c-e-dol-phone-input[name="landlinePhone"]');
        if (landlinePhone && landlinePhone.value !== this.formData.landlinePhone) {
            landlinePhone.value = this.formData.landlinePhone || '';
        }
    }

    handleConsentChange(event) {
        this.formData = { ...this.formData, consentAccepted: event.target.checked === true };
        this.clearFieldHighlight('consentAccepted');
    }

    handleTicketsChange(event) {
        this.tickets = event.detail.tickets;
    }

    handleCaptchaChange(event) {
        this.captchaAccepted = event.detail.verified === true;
        this.captchaToken = event.detail.token || '';

        if (this.captchaAccepted) {
            this.clearError();

            if (this.submitAfterCaptcha && !this.isSubmitting) {
                this.submitAfterCaptcha = false;
                window.setTimeout(() => {
                    this.handleSubmit({ preventDefault() {} });
                }, 100);
            }
        }
    }

    handleBackToMain() {
        window.location.assign(buildCommunityUrl(this.backUrl || '/'));
    }

    scrollToTop() {
        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            window.scrollTo(0, 0);
        }
    }

    showError(message) {
        this.errorMessage = message || 'Unable to submit the complaint.';
        this.errorModalOpen = true;
    }

    clearError() {
        this.errorMessage = '';
        this.errorModalOpen = false;
    }

    closeErrorPopup() {
        this.errorModalOpen = false;
    }

    openCaptchaPopup() {
        const captcha = this.template.querySelector('c-e-dol-captcha');

        if (captcha && typeof captcha.open === 'function') {
            captcha.open();
            return;
        }

        this.showError(this.text.captchaError || 'Please complete the reCAPTCHA verification.');
    }

    handleFilesUploaded(event) {
        this.uploadedFiles = (event.detail && event.detail.files) ? event.detail.files : [];
    }

    getGenericPhoneValidationMessage() {
        const language = (this.selectedLanguage || 'en').toLowerCase();
        if (language === 'fr') {
            return 'Veuillez saisir un numéro de téléphone valide pour le pays sélectionné.';
        }
        if (language === 'ar') {
            return 'يرجى إدخال رقم هاتف صحيح للبلد المحدد.';
        }
        return 'Please enter a valid phone number for the selected country.';
    }

    getRequiredValidationMessage() {
        const language = (this.selectedLanguage || 'en').toLowerCase();
        if (language === 'fr') {
            return 'Ce champ est obligatoire.';
        }
        if (language === 'ar') {
            return 'هذا الحقل إجباري.';
        }
        return 'This field is required.';
    }


    getTicketValidationMessage() {
        return (this.labels && this.labels.ticketRule) ? this.labels.ticketRule : 'Please add at least one ticket number with exactly 10 digits.';
    }

    syncPhoneInputs() {
        const phoneInputs = this.template.querySelectorAll('c-e-dol-phone-input');
        let nextData = { ...this.formData };
        let nextValidation = { ...this.phoneValidation };

        phoneInputs.forEach((phoneInput) => {
            if (!phoneInput || typeof phoneInput.getValue !== 'function') {
                return;
            }

            const phoneState = phoneInput.getValue();
            const fieldName = phoneState.name;
            const phoneValue = phoneState.value || {};
            if (!fieldName) {
                return;
            }

            nextData = { ...nextData, [fieldName]: phoneValue.fullNumber || '' };
            nextValidation = {
                ...nextValidation,
                [fieldName]: {
                    isValid: phoneValue.isValid !== false,
                    message: phoneValue.validationMessage || this.getGenericPhoneValidationMessage()
                }
            };
        });

        this.formData = nextData;
        this.phoneValidation = nextValidation;
    }

    syncTicketRepeater() {
        const repeater = this.template.querySelector('c-e-dol-ticket-repeater');
        if (repeater && typeof repeater.getTickets === 'function') {
            this.tickets = repeater.getTickets();
        }
    }

    validateTickets(showErrors = true) {
        const repeater = this.template.querySelector('c-e-dol-ticket-repeater');
        const childValid = repeater && typeof repeater.validate === 'function'
            ? repeater.validate(showErrors)
            : false;
        this.syncTicketRepeater();
        const hasApexTicket = normalizeTicketsForApex(this.tickets).length > 0;

        return childValid === true && hasApexTicket === true;
    }

    scrollToTicketRepeater() {
        const repeater = this.template.querySelector('c-e-dol-ticket-repeater');
        if (!repeater) {
            return;
        }
        try {
            repeater.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            repeater.scrollIntoView();
        }
        if (typeof repeater.focus === 'function') {
            window.setTimeout(() => repeater.focus(), 250);
        }
    }

    clearFieldHighlights() {
        const highlightedFields = this.template.querySelectorAll('.edol-field-error');
        highlightedFields.forEach((field) => {
            field.classList.remove('edol-field-error');
            field.removeAttribute('data-error');
        });
    }

    clearFieldHighlight(fieldName) {
        if (!fieldName) {
            return;
        }

        const fieldElement = this.getFieldElement(fieldName);
        const wrapper = fieldElement ? fieldElement.closest('.edol-field') : null;
        if (wrapper) {
            wrapper.classList.remove('edol-field-error');
            wrapper.removeAttribute('data-error');
        }
    }

    getFieldElement(fieldName) {
        if (!fieldName) {
            return null;
        }

        try {
            return this.template.querySelector(`[name="${fieldName}"]`);
        } catch (error) {
            return null;
        }
    }

    showFieldValidationErrors(fieldMessages) {
        this.errorMessage = '';
        this.errorModalOpen = false;
        this.clearFieldHighlights();

        Object.keys(fieldMessages || {}).forEach((fieldName) => {
            const fieldElement = this.getFieldElement(fieldName);
            const wrapper = fieldElement ? fieldElement.closest('.edol-field') : null;
            if (wrapper) {
                wrapper.classList.add('edol-field-error');
                wrapper.setAttribute('data-error', fieldMessages[fieldName]);
            }
        });

        window.setTimeout(() => {
            this.scrollToFirstHighlightedField();
        }, 0);
    }

    scrollToFirstHighlightedField() {
        const firstInvalidField = this.template.querySelector('.edol-field-error');
        if (!firstInvalidField) {
            return;
        }

        try {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            firstInvalidField.scrollIntoView();
        }

        const focusable = firstInvalidField.querySelector('input, select, textarea, c-e-dol-date-picker, c-e-dol-phone-input, c-e-dol-ticket-repeater');
        if (focusable && typeof focusable.focus === 'function') {
            window.setTimeout(() => focusable.focus(), 250);
        }
    }

    validateDates() {
        const today = this.todayIso;
        const minimumBirthDate = getIsoYearsAgo(120);
        const dateOfBirthLabel = (this.labels && this.labels.dateOfBirth) ? this.labels.dateOfBirth : 'Date of birth';
        const flightDateLabel = (this.labels && this.labels.flightDate) ? this.labels.flightDate : 'Flight date';
        const fieldMessages = {};

        if (this.formData.dateOfBirth && !isValidIsoDate(this.formData.dateOfBirth)) {
            fieldMessages.dateOfBirth = getDateValidationMessage(this.selectedLanguage, dateOfBirthLabel, 'invalid');
        } else if (this.formData.dateOfBirth > today) {
            fieldMessages.dateOfBirth = getDateValidationMessage(this.selectedLanguage, dateOfBirthLabel, 'future');
        } else if (this.formData.dateOfBirth && this.formData.dateOfBirth < minimumBirthDate) {
            fieldMessages.dateOfBirth = getDateValidationMessage(this.selectedLanguage, dateOfBirthLabel, 'tooOld');
        }

        if (this.formData.flightDate && !isValidIsoDate(this.formData.flightDate)) {
            fieldMessages.flightDate = getDateValidationMessage(this.selectedLanguage, flightDateLabel, 'invalid');
        } else if (this.formData.flightDate > today) {
            fieldMessages.flightDate = getDateValidationMessage(this.selectedLanguage, flightDateLabel, 'future');
        }

        return fieldMessages;
    }

    validate(showErrors = true) {
        this.syncPhoneInputs();
        this.syncTicketRepeater();
        const fieldMessages = {};
        const required = ['reason','claimantType','civility','lastName','firstName','mobilePhone','email','confirmEmail','countryOfResidence','addressOfResidence','dateOfBirth','incidentLocation','flightNumber','flightDate','consentAccepted'];

        required.forEach((field) => {
            if (!this.formData[field]) {
                fieldMessages[field] = this.getRequiredValidationMessage();
            }
        });

        if (this.isCancellationReason && !this.formData.ticketPurchaseChannel) {
            fieldMessages.ticketPurchaseChannel = this.getRequiredValidationMessage();
        }
        if (this.showRegionOfResidence && !this.formData.regionOfResidence) {
            fieldMessages.regionOfResidence = this.getRequiredValidationMessage();
        }

        ['mobilePhone', 'landlinePhone'].forEach((fieldName) => {
            const phoneState = this.phoneValidation[fieldName];
            if (this.formData[fieldName] && phoneState && phoneState.isValid === false) {
                fieldMessages[fieldName] = phoneState.message || this.getGenericPhoneValidationMessage();
            }
        });

        Object.assign(fieldMessages, this.validateDates());

        if (this.formData.email && this.formData.confirmEmail && this.formData.email !== this.formData.confirmEmail) {
            fieldMessages.email = this.text.emailMismatch;
            fieldMessages.confirmEmail = this.text.emailMismatch;
        }

        const hasTicketErrors = !this.validateTickets(showErrors);

        if (Object.keys(fieldMessages).length > 0 || hasTicketErrors) {
            this.submitAfterCaptcha = false;
            if (showErrors) {
                this.showFieldValidationErrors(fieldMessages);
                if (Object.keys(fieldMessages).length === 0 && hasTicketErrors) {
                    window.setTimeout(() => this.scrollToTicketRepeater(), 0);
                }
            }
            return false;
        }

        if (!this.captchaAccepted || !this.captchaToken) {
            if (showErrors) {
                this.submitAfterCaptcha = true;
                this.openCaptchaPopup();
            }
            return false;
        }

        if (showErrors) {
            this.clearFieldHighlights();
            this.clearError();
        }
        return true;
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (!this.validate()) {
            return;
        }

        this.submitAfterCaptcha = false;
        this.isSubmitting = true;
        try {
            const isCaptchaValid = await verifyRecaptchaToken({ token: this.captchaToken });
            if (!isCaptchaValid) {
                this.showError(this.text.captchaError || 'Please complete the reCAPTCHA verification.');
                const captcha = this.template.querySelector('c-e-dol-captcha');
                if (captcha) {
                    captcha.reset();
                }
                this.isSubmitting = false;
                return;
            }

            const payload = {
                categoryId: 'cancellation-delay',
                formCode: 'cancellation-delay-main',
                language: this.selectedLanguage,
                values: { ...this.formData, language: this.selectedLanguage },
                tickets: normalizeTicketsForApex(this.tickets),
                files: this.uploadedFiles,
                captchaVerified: true,
                fileUploadSessionKey: this.fileUploadSessionKey
            };
            const result = await submitComplaint({ request: payload });
            console.log('E-DOL form submission result', JSON.stringify(result));
            this.submissionReference = getSubmissionReference(result);
            this.successMessage = buildSuccessMessage(this.text, result);
            this.clearError();
            this.submissionDone = true;
            this.scrollToTop();
        } catch (error) {
            this.showError(getApexErrorMessage(error));
        }
        this.isSubmitting = false;
    }
}
