const L = (en, fr, ar) => ({ en, fr, ar });

function localize(value, language = 'en') {
    if (!value) {
        return '';
    }

    if (typeof value === 'string') {
        return value;
    }

    return value[language] || value.en || '';
}

function localizeOptions(options, language = 'en') {
    return options.map((option) => ({
        ...option,
        label: localize(option.label, language)
    }));
}



const SUPPORTED_LANGUAGES = ['en', 'fr', 'ar'];

export function normalizeLanguage(language = 'en') {
    const value = String(language || '').toLowerCase().replace('_', '-');
    const baseLanguage = value.split('-')[0];
    return SUPPORTED_LANGUAGES.includes(baseLanguage) ? baseLanguage : 'en';
}

export function getBrowserLanguage() {
    try {
        const browserLanguages = [];
        if (typeof navigator !== 'undefined') {
            if (Array.isArray(navigator.languages)) {
                browserLanguages.push(...navigator.languages);
            }
            if (navigator.language) {
                browserLanguages.push(navigator.language);
            }
            if (navigator.userLanguage) {
                browserLanguages.push(navigator.userLanguage);
            }
        }

        for (const language of browserLanguages) {
            const normalized = normalizeLanguage(language);
            if (normalized !== 'en' || String(language || '').toLowerCase().startsWith('en')) {
                return normalized;
            }
        }
    } catch (error) {}

    return 'en';
}

export function getInitialLanguage() {
    try {
        const storedLanguage = window.localStorage.getItem('edolLanguage');
        if (storedLanguage) {
            return normalizeLanguage(storedLanguage);
        }
    } catch (error) {}

    const browserLanguage = getBrowserLanguage();

    // Important: persist the detected browser language the first time we resolve it.
    // Without this, one Experience Cloud page can detect FR while another page/component
    // falls back to EN before a manual language selection is made. Manual changes still
    // overwrite this value from the language selector.
    try {
        window.localStorage.setItem('edolLanguage', browserLanguage);
    } catch (error) {}

    return browserLanguage;
}

function getLocalizedCountryLabel(countryCode, language = 'en', fallbackLabel = '') {
    if (!countryCode) {
        return fallbackLabel;
    }

    try {
        if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
            const normalizedLanguage = language === 'ar' ? 'ar' : (language === 'fr' ? 'fr' : 'en');
            const displayNames = new Intl.DisplayNames([normalizedLanguage], { type: 'region' });
            const localized = displayNames.of(countryCode);
            if (localized) {
                return localized;
            }
        }
    } catch (error) {}

    return fallbackLabel || countryCode;
}


const TEXT = {
    en: {
        complaint: 'Complaint',
        track: 'Track your complaint',
        more: 'More information →',
        homeTitle: 'Your Digital\nComplaints Portal',
        homeSubtitle: 'Submit and track your complaints online, anytime, anywhere.',
        browseTitle: 'Browse all requests',
        browseSubtitle: 'Browse all requests — click to preview or open full form',
        quickPreview: 'Quick preview',
        openForm: 'Open form →',
        back: 'Back',
        needHelp: 'Do you need help?',
        stepOne: 'Nature of request',
        stepTwo: 'Form',
        stepThree: 'completed',
        infoText: 'Please select one of the categories from the dropdown menu below and fill out the form to submit a complaint. Fields marked with an asterisk (*) are required.',
        unavailableTitle: 'This online form is not available at the moment',
        unavailableMessage: 'Please choose another request type or contact Air Algérie support for assistance.',
        submit: 'Submit',
        submitting: 'Submitting...',
        successTitle: 'Your complaint has been submitted',
        successMessage: 'Thank you. Your request has been registered successfully.',
        successEmailMessage: 'A confirmation email will be sent to the email address you provided.',
        backToMain: 'Back to main page',
        reference: 'Reference',
        frontendOnlySuccess: 'The form has been checked successfully. Online submission will be connected in the next step.',
        validationError: 'Please complete all required fields before submitting.',
        emailMismatch: 'Email address and confirmation email address do not match.',
        uploadLabel: 'Click to Upload',
        fileLimitMessage: 'You can attach up to 3 files.',
        cancel: 'Cancel',
        ok: 'OK'
    },
    fr: {
        complaint: 'Réclamation',
        track: 'Suivre votre réclamation',
        more: 'Plus d’information →',
        homeTitle: 'Votre Portail Digital\nde Réclamations',
        homeSubtitle: 'Déposez et suivez vos réclamations en ligne, à tout moment, où que vous soyez.',
        browseTitle: 'Parcourir les demandes',
        browseSubtitle: 'Parcourez les demandes — cliquez pour ouvrir le formulaire complet',
        quickPreview: 'Aperçu rapide',
        openForm: 'Ouvrir le formulaire →',
        back: 'Retour',
        needHelp: 'Besoin d’aide ?',
        stepOne: 'Nature de la demande',
        stepTwo: 'Formulaire',
        stepThree: 'terminé',
        infoText: 'Veuillez sélectionner une catégorie puis remplir le formulaire pour soumettre une réclamation. Les champs marqués d’un astérisque (*) sont obligatoires.',
        unavailableTitle: 'Ce formulaire en ligne n’est pas disponible pour le moment',
        unavailableMessage: 'Veuillez choisir un autre type de demande ou contacter le support Air Algérie.',
        submit: 'Soumettre',
        submitting: 'Soumission...',
        successTitle: 'Votre réclamation a été soumise',
        successMessage: 'Merci. Votre demande a été enregistrée avec succès.',
        successEmailMessage: 'Un e-mail de confirmation sera envoyé à l’adresse e-mail renseignée.',
        backToMain: 'Retour à la page principale',
        reference: 'Référence',
        frontendOnlySuccess: 'Le formulaire a été contrôlé avec succès. La soumission en ligne sera raccordée à l’étape suivante.',
        validationError: 'Veuillez compléter tous les champs obligatoires avant de soumettre.',
        emailMismatch: 'L’adresse e-mail et sa confirmation ne correspondent pas.',
        uploadLabel: 'Cliquer pour importer',
        fileLimitMessage: 'Vous pouvez joindre jusqu’à 3 fichiers.',
        cancel: 'Annuler',
        ok: 'OK'
    },
    ar: {
        complaint: 'شكوى',
        track: 'تتبع الشكوى',
        more: 'معلومات إضافية ←',
        homeTitle: 'بوابة الشكاوى\nالرقمية',
        homeSubtitle: 'أرسل وتابع شكاويك عبر الإنترنت في أي وقت ومن أي مكان.',
        browseTitle: 'تصفح جميع الطلبات',
        browseSubtitle: 'تصفح الطلبات — اضغط لفتح النموذج الكامل',
        quickPreview: 'معاينة سريعة',
        openForm: 'فتح النموذج ←',
        back: 'رجوع',
        needHelp: 'هل تحتاج إلى مساعدة؟',
        stepOne: 'نوع الطلب',
        stepTwo: 'النموذج',
        stepThree: 'مكتمل',
        infoText: 'يرجى اختيار فئة وملء النموذج لإرسال الشكوى. الحقول المميزة بعلامة (*) إلزامية.',
        unavailableTitle: 'هذا النموذج غير متاح عبر الإنترنت حالياً',
        unavailableMessage: 'يرجى اختيار نوع طلب آخر أو التواصل مع دعم الخطوط الجوية الجزائرية.',
        submit: 'إرسال',
        submitting: 'جارٍ الإرسال...',
        successTitle: 'تم إرسال الشكوى',
        successMessage: 'شكراً لك. تم تسجيل طلبك بنجاح.',
        successEmailMessage: 'سيتم إرسال رسالة تأكيد إلى البريد الإلكتروني الذي قمت بإدخاله.',
        backToMain: 'العودة إلى الصفحة الرئيسية',
        reference: 'المرجع',
        frontendOnlySuccess: 'تم التحقق من النموذج بنجاح. سيتم ربط الإرسال الإلكتروني في المرحلة التالية.',
        validationError: 'يرجى إكمال جميع الحقول الإلزامية قبل الإرسال.',
        emailMismatch: 'عنوان البريد الإلكتروني وتأكيده غير متطابقين.',
        uploadLabel: 'اضغط للرفع',
        fileLimitMessage: 'يمكنك إرفاق ما يصل إلى 3 ملفات.',
        cancel: 'إلغاء',
        ok: 'موافق'
    }
};

const FIELD_LABELS = {
    en: {
        selectOption: 'Select an option',
        ticketPurchaseChannel: 'Select an option',
        claimantType: 'Individual',
        civility: 'Civility',
        lastName: 'Last Name',
        firstName: 'First Name',
        mobilePhone: 'Mobile Phone',
        landlinePhone: 'Landline Phone',
        email: 'Email Address',
        confirmEmail: 'Confirm Email Address',
        countryOfResidence: 'Country of residence',
        regionOfResidence: 'Region of residence',
        addressOfResidence: 'Address of residence',
        postalCode: 'Postal code',
        dateOfBirth: 'Date of Birth',
        incidentLocation: 'Location of the incident',
        flightNumber: 'Flight number',
        flightDate: 'Flight date',
        details: 'Details',
        pirFileNumber: 'PIR file number',
        complaintFiledDate: 'Date the complaint was filed',
        receptionQuality: 'Your opinion about the quality of the reception',
        chooseCountry: 'Choose a country',
        chooseRegion: 'Choose a region',
        chooseCivility: 'Select a civility',
        enterNumber: 'Enter number',
        enterDetails: 'Enter details',
        maxLength500: 'max length is 500',
        captcha: 'I am not a robot',
        ticketBlock: 'Ticket No.',
        ticketNumber: 'Ticket No',
        ticketNumberPlaceholder: 'Enter number',
        addTicket: '+ Add a ticket',
        remove: 'Remove',
        ticketRule: 'Input must be exactly 13 characters.',
        ticketRequired: 'Input must be exactly 13 characters.',
        uploadHelper: 'Please attach any useful supporting document.',
        baggageUploadHelper: 'Please attach any useful supporting document: baggage tag, ticket, receipt, etc.',
        personalDataConsent: 'I agree that my personal data may be collected and used by Air Algérie to process my request, in accordance with applicable personal data protection regulations.'
    },
    fr: {
        selectOption: 'Sélectionner une option',
        ticketPurchaseChannel: 'Sélectionner une option',
        claimantType: 'Demandeur',
        civility: 'Civilité',
        lastName: 'Nom',
        firstName: 'Prénom',
        mobilePhone: 'Téléphone mobile',
        landlinePhone: 'Téléphone fixe',
        email: 'Adresse e-mail',
        confirmEmail: 'Confirmer l’adresse e-mail',
        countryOfResidence: 'Pays de résidence',
        regionOfResidence: 'Région de résidence',
        addressOfResidence: 'Adresse de résidence',
        postalCode: 'Code postal',
        dateOfBirth: 'Date de naissance',
        incidentLocation: 'Lieu de l’incident',
        flightNumber: 'Numéro de vol',
        flightDate: 'Date du vol',
        details: 'Détails',
        pirFileNumber: 'Numéro de dossier PIR',
        complaintFiledDate: 'Date de dépôt de la réclamation',
        receptionQuality: 'Votre avis sur la qualité de l’accueil',
        chooseCountry: 'Choisir un pays',
        chooseRegion: 'Choisir une région',
        chooseCivility: 'Sélectionner une civilité',
        enterNumber: 'Entrer le numéro',
        enterDetails: 'Saisir les détails',
        maxLength500: '500 caractères maximum',
        captcha: 'Je ne suis pas un robot',
        ticketBlock: 'Billet n°',
        ticketNumber: 'Numéro du billet',
        ticketNumberPlaceholder: 'Saisir le numéro',
        addTicket: '+ Ajouter un billet',
        remove: 'Supprimer',
        ticketRule: 'Input must be exactly 13 characters.\nCe champ est limité à 13 caractères',
        ticketRequired: 'Input must be exactly 13 characters.\nCe champ est limité à 13 caractères',
        uploadHelper: 'Veuillez joindre tout document justificatif utile.',
        baggageUploadHelper: 'Veuillez joindre tout document utile : étiquette bagage, billet, reçu, etc.',
        personalDataConsent: 'J’accepte que mes données personnelles soient collectées et utilisées par Air Algérie pour traiter ma demande, conformément à la réglementation applicable sur la protection des données.'
    },
    ar: {
        selectOption: 'اختر خياراً',
        ticketPurchaseChannel: 'اختر خياراً',
        claimantType: 'صفة مقدم الطلب',
        civility: 'اللقب',
        lastName: 'اللقب العائلي',
        firstName: 'الاسم',
        mobilePhone: 'الهاتف المحمول',
        landlinePhone: 'الهاتف الثابت',
        email: 'البريد الإلكتروني',
        confirmEmail: 'تأكيد البريد الإلكتروني',
        countryOfResidence: 'بلد الإقامة',
        regionOfResidence: 'منطقة الإقامة',
        addressOfResidence: 'عنوان الإقامة',
        postalCode: 'الرمز البريدي',
        dateOfBirth: 'تاريخ الميلاد',
        incidentLocation: 'مكان الحادثة',
        flightNumber: 'رقم الرحلة',
        flightDate: 'تاريخ الرحلة',
        details: 'تفاصيل',
        pirFileNumber: 'رقم ملف PIR',
        complaintFiledDate: 'تاريخ تسجيل الشكوى',
        receptionQuality: 'رأيك حول جودة الاستقبال',
        chooseCountry: 'اختر بلداً',
        chooseRegion: 'اختر منطقة',
        chooseCivility: 'اختر اللقب',
        enterNumber: 'أدخل الرقم',
        enterDetails: 'أدخل التفاصيل',
        maxLength500: 'الحد الأقصى 500 حرف',
        captcha: 'أنا لست روبوتاً',
        ticketBlock: 'التذكرة رقم',
        ticketNumber: 'رقم التذكرة',
        ticketNumberPlaceholder: 'أدخل الرقم',
        addTicket: '+ إضافة تذكرة',
        remove: 'حذف',
        ticketRule: 'يجب أن يتكون رقم التذكرة من 13 رقماً بالضبط.',
        ticketRequired: 'يرجى إضافة رقم تذكرة واحد على الأقل.',
        uploadHelper: 'يرجى إرفاق أي مستند داعم مفيد.',
        baggageUploadHelper: 'يرجى إرفاق أي مستند مفيد: بطاقة الأمتعة، التذكرة، الإيصال، إلخ.',
        personalDataConsent: 'أوافق على جمع واستخدام بياناتي الشخصية من طرف الخطوط الجوية الجزائرية لمعالجة طلبي، وفقاً للتشريعات المعمول بها لحماية البيانات الشخصية.'
    }
};

const CATEGORIES = [
    {
        id: 'cancellation-delay',
        number: '1',
        iconKey: 'cancellation',
        title: L('Cancellation or delay', 'Annulation ou retard', 'إلغاء أو تأخير'),
        description: L('Claims related to flight cancellations or significant delays affecting your travel.', 'Réclamations liées aux annulations de vols ou aux retards importants affectant votre voyage.', 'شكاوى متعلقة بإلغاء الرحلات أو التأخيرات الكبيرة التي أثرت على سفرك.'),
        supported: true,
        urlKey: 'cancellationDelayUrl',
        formCode: 'cancellation-delay-main'
    },
    {
        id: 'denied-boarding',
        number: '2',
        iconKey: 'deniedBoarding',
        title: L('Denied boarding', 'Refus d’embarquement', 'رفض الصعود إلى الطائرة'),
        description: L('Claims related to denied boarding, including overbooking and special situations.', 'Réclamations liées au refus d’embarquement, y compris le surbooking et les situations particulières.', 'شكاوى متعلقة برفض الصعود إلى الطائرة، بما في ذلك حالات الحجز الزائد.'),
        supported: true,
        urlKey: 'deniedBoardingUrl',
        formCode: 'denied-boarding-main'
    },
    {
        id: 'mishandled-baggage',
        number: '3',
        iconKey: 'baggage',
        title: L('Mishandled baggage', 'Litige bagages', 'مشاكل الأمتعة'),
        description: L('Baggage handling disputes and related claims.', 'Litiges et réclamations liés à la gestion des bagages.', 'نزاعات وشكاوى متعلقة بمعالجة الأمتعة.'),
        supported: true,
        urlKey: 'mishandledBaggageUrl',
        formCode: 'baggage-follow-up'
    },
    {
        id: 'downgrade',
        number: '4',
        iconKey: 'downgrade',
        title: L('Downgrade', 'Déclassement', 'تغيير درجة السفر'),
        description: L('Claims related to a cabin downgrade or undesired change to the reservation.', 'Réclamations liées à un déclassement de cabine ou à un changement non souhaité de la réservation.', 'شكاوى متعلقة بتغيير درجة المقصورة أو تعديل غير مرغوب فيه في الحجز.'),
        supported: false,
        urlKey: 'downgradeUrl'
    },
    {
        id: 'payment-issue',
        number: '5',
        iconKey: 'payment',
        title: L('Report a payment issue during a reservation', 'Signaler un problème de paiement lors d’une réservation', 'الإبلاغ عن مشكلة دفع أثناء الحجز'),
        description: L('Report a payment not recorded, a double charge or an error during booking.', 'Signaler un paiement non enregistré, un double débit ou une erreur lors de la réservation.', 'الإبلاغ عن دفع غير مسجل، خصم مزدوج أو خطأ أثناء الحجز.'),
        supported: false,
        urlKey: 'paymentIssueUrl'
    },
    {
        id: 'services-amenities',
        number: '6',
        iconKey: 'services',
        title: L('Services and amenities', 'Services et prestations', 'الخدمات والمرافق'),
        description: L('Complaints regarding staff behavior and quality of service.', 'Réclamations concernant le comportement du personnel et la qualité des services.', 'شكاوى حول سلوك الموظفين وجودة الخدمات.'),
        supported: false,
        urlKey: 'servicesAmenitiesUrl'
    },
    {
        id: 'loyalty',
        number: '7',
        iconKey: 'loyalty',
        title: L('Air Algérie Plus members', 'Membres Air Algérie Plus', 'أعضاء Air Algérie Plus'),
        description: L('Requests related to miles, loyalty cards, status and member benefits.', 'Demandes liées aux miles, cartes de fidélité, statuts et avantages membres.', 'طلبات متعلقة بالأميال وبطاقات الولاء والمزايا.'),
        supported: false,
        urlKey: 'loyaltyUrl'
    },
    {
        id: 'refund-unused-ticket',
        number: '8',
        iconKey: 'refund',
        title: L('Request refund for unused or partially used ticket', 'Demander le remboursement d’un billet non utilisé ou partiellement utilisé', 'طلب استرداد تذكرة غير مستخدمة أو مستخدمة جزئياً'),
        description: L('Refund requests for tickets that were not used or only partially used.', 'Demandes de remboursement pour les billets non utilisés ou partiellement utilisés.', 'طلبات استرداد التذاكر غير المستخدمة أو المستخدمة جزئياً.'),
        supported: false,
        urlKey: 'refundUnusedTicketUrl'
    },
    {
        id: 'feedback-suggestions',
        number: '9',
        iconKey: 'feedback',
        title: L('Feedback and suggestions', 'Avis et suggestions', 'آراء واقتراحات'),
        description: L('Share feedback, suggestions or general comments regarding Air Algérie services.', 'Partagez vos avis, suggestions ou commentaires concernant les services Air Algérie.', 'شارك آراءك أو اقتراحاتك حول خدمات Air Algérie.'),
        supported: false,
        urlKey: 'feedbackSuggestionsUrl'
    }
];

const COUNTRY_OPTIONS = [
    { label: L('Algeria', 'Algérie', 'الجزائر'), value: 'DZ' },
    { label: L('France', 'France', 'France'), value: 'FR' },
    { label: L('Afghanistan', 'Afghanistan', 'Afghanistan'), value: 'AF' },
    { label: L('Albania', 'Albania', 'Albania'), value: 'AL' },
    { label: L('American Samoa', 'American Samoa', 'American Samoa'), value: 'AS' },
    { label: L('Andorra', 'Andorra', 'Andorra'), value: 'AD' },
    { label: L('Angola', 'Angola', 'Angola'), value: 'AO' },
    { label: L('Anguilla', 'Anguilla', 'Anguilla'), value: 'AI' },
    { label: L('Antarctica', 'Antarctica', 'Antarctica'), value: 'AQ' },
    { label: L('Antigua and Barbuda', 'Antigua and Barbuda', 'Antigua and Barbuda'), value: 'AG' },
    { label: L('Argentina', 'Argentina', 'Argentina'), value: 'AR' },
    { label: L('Armenia', 'Armenia', 'Armenia'), value: 'AM' },
    { label: L('Aruba', 'Aruba', 'Aruba'), value: 'AW' },
    { label: L('Australia', 'Australia', 'Australia'), value: 'AU' },
    { label: L('Austria', 'Austria', 'Austria'), value: 'AT' },
    { label: L('Azerbaijan', 'Azerbaijan', 'Azerbaijan'), value: 'AZ' },
    { label: L('Bahamas', 'Bahamas', 'Bahamas'), value: 'BS' },
    { label: L('Bahrain', 'Bahrain', 'Bahrain'), value: 'BH' },
    { label: L('Bangladesh', 'Bangladesh', 'Bangladesh'), value: 'BD' },
    { label: L('Barbados', 'Barbados', 'Barbados'), value: 'BB' },
    { label: L('Belarus', 'Belarus', 'Belarus'), value: 'BY' },
    { label: L('Belgium', 'Belgium', 'Belgium'), value: 'BE' },
    { label: L('Belize', 'Belize', 'Belize'), value: 'BZ' },
    { label: L('Benin', 'Benin', 'Benin'), value: 'BJ' },
    { label: L('Bermuda', 'Bermuda', 'Bermuda'), value: 'BM' },
    { label: L('Bhutan', 'Bhutan', 'Bhutan'), value: 'BT' },
    { label: L('Bolivia', 'Bolivia', 'Bolivia'), value: 'BO' },
    { label: L('Bonaire, Sint Eustatius and Saba', 'Bonaire, Sint Eustatius and Saba', 'Bonaire, Sint Eustatius and Saba'), value: 'BQ' },
    { label: L('Bosnia and Herzegovina', 'Bosnia and Herzegovina', 'Bosnia and Herzegovina'), value: 'BA' },
    { label: L('Botswana', 'Botswana', 'Botswana'), value: 'BW' },
    { label: L('Bouvet Island', 'Bouvet Island', 'Bouvet Island'), value: 'BV' },
    { label: L('Brazil', 'Brazil', 'Brazil'), value: 'BR' },
    { label: L('British Indian Ocean Territory', 'British Indian Ocean Territory', 'British Indian Ocean Territory'), value: 'IO' },
    { label: L('Brunei Darussalam', 'Brunei Darussalam', 'Brunei Darussalam'), value: 'BN' },
    { label: L('Bulgaria', 'Bulgaria', 'Bulgaria'), value: 'BG' },
    { label: L('Burkina Faso', 'Burkina Faso', 'Burkina Faso'), value: 'BF' },
    { label: L('Burundi', 'Burundi', 'Burundi'), value: 'BI' },
    { label: L('Cabo Verde', 'Cabo Verde', 'Cabo Verde'), value: 'CV' },
    { label: L('Cambodia', 'Cambodia', 'Cambodia'), value: 'KH' },
    { label: L('Cameroon', 'Cameroon', 'Cameroon'), value: 'CM' },
    { label: L('Cayman Islands', 'Cayman Islands', 'Cayman Islands'), value: 'KY' },
    { label: L('Central African Republic', 'Central African Republic', 'Central African Republic'), value: 'CF' },
    { label: L('Chad', 'Chad', 'Chad'), value: 'TD' },
    { label: L('Chile', 'Chile', 'Chile'), value: 'CL' },
    { label: L('China', 'China', 'China'), value: 'CN' },
    { label: L('Christmas Island', 'Christmas Island', 'Christmas Island'), value: 'CX' },
    { label: L('Cocos (Keeling) Islands', 'Cocos (Keeling) Islands', 'Cocos (Keeling) Islands'), value: 'CC' },
    { label: L('Colombia', 'Colombia', 'Colombia'), value: 'CO' },
    { label: L('Comoros', 'Comoros', 'Comoros'), value: 'KM' },
    { label: L('Cook Islands', 'Cook Islands', 'Cook Islands'), value: 'CK' },
    { label: L('Costa Rica', 'Costa Rica', 'Costa Rica'), value: 'CR' },
    { label: L('Croatia', 'Croatia', 'Croatia'), value: 'HR' },
    { label: L('Cuba', 'Cuba', 'Cuba'), value: 'CU' },
    { label: L('Curaçao', 'Curaçao', 'Curaçao'), value: 'CW' },
    { label: L('Cyprus', 'Cyprus', 'Cyprus'), value: 'CY' },
    { label: L('Czechia', 'Czechia', 'Czechia'), value: 'CZ' },
    { label: L('Democratic Republic of the Congo', 'Democratic Republic of the Congo', 'Democratic Republic of the Congo'), value: 'CD' },
    { label: L('Denmark', 'Denmark', 'Denmark'), value: 'DK' },
    { label: L('Djibouti', 'Djibouti', 'Djibouti'), value: 'DJ' },
    { label: L('Dominica', 'Dominica', 'Dominica'), value: 'DM' },
    { label: L('Dominican Republic', 'Dominican Republic', 'Dominican Republic'), value: 'DO' },
    { label: L('Ecuador', 'Ecuador', 'Ecuador'), value: 'EC' },
    { label: L('Egypt', 'Egypt', 'Egypt'), value: 'EG' },
    { label: L('El Salvador', 'El Salvador', 'El Salvador'), value: 'SV' },
    { label: L('Equatorial Guinea', 'Equatorial Guinea', 'Equatorial Guinea'), value: 'GQ' },
    { label: L('Eritrea', 'Eritrea', 'Eritrea'), value: 'ER' },
    { label: L('Estonia', 'Estonia', 'Estonia'), value: 'EE' },
    { label: L('Eswatini', 'Eswatini', 'Eswatini'), value: 'SZ' },
    { label: L('Ethiopia', 'Ethiopia', 'Ethiopia'), value: 'ET' },
    { label: L('Falkland Islands (Malvinas)', 'Falkland Islands (Malvinas)', 'Falkland Islands (Malvinas)'), value: 'FK' },
    { label: L('Faroe Islands', 'Faroe Islands', 'Faroe Islands'), value: 'FO' },
    { label: L('Fiji', 'Fiji', 'Fiji'), value: 'FJ' },
    { label: L('Finland', 'Finland', 'Finland'), value: 'FI' },
    { label: L('French Guiana', 'French Guiana', 'French Guiana'), value: 'GF' },
    { label: L('French Polynesia', 'French Polynesia', 'French Polynesia'), value: 'PF' },
    { label: L('French Southern Territories', 'French Southern Territories', 'French Southern Territories'), value: 'TF' },
    { label: L('Gabon', 'Gabon', 'Gabon'), value: 'GA' },
    { label: L('Gambia', 'Gambia', 'Gambia'), value: 'GM' },
    { label: L('Georgia', 'Georgia', 'Georgia'), value: 'GE' },
    { label: L('Germany', 'Germany', 'Germany'), value: 'DE' },
    { label: L('Ghana', 'Ghana', 'Ghana'), value: 'GH' },
    { label: L('Gibraltar', 'Gibraltar', 'Gibraltar'), value: 'GI' },
    { label: L('Greece', 'Greece', 'Greece'), value: 'GR' },
    { label: L('Greenland', 'Greenland', 'Greenland'), value: 'GL' },
    { label: L('Grenada', 'Grenada', 'Grenada'), value: 'GD' },
    { label: L('Guadeloupe', 'Guadeloupe', 'Guadeloupe'), value: 'GP' },
    { label: L('Guam', 'Guam', 'Guam'), value: 'GU' },
    { label: L('Guatemala', 'Guatemala', 'Guatemala'), value: 'GT' },
    { label: L('Guernsey', 'Guernsey', 'Guernsey'), value: 'GG' },
    { label: L('Guinea', 'Guinea', 'Guinea'), value: 'GN' },
    { label: L('Guinea-Bissau', 'Guinea-Bissau', 'Guinea-Bissau'), value: 'GW' },
    { label: L('Guyana', 'Guyana', 'Guyana'), value: 'GY' },
    { label: L('Haiti', 'Haiti', 'Haiti'), value: 'HT' },
    { label: L('Heard Island and McDonald Islands', 'Heard Island and McDonald Islands', 'Heard Island and McDonald Islands'), value: 'HM' },
    { label: L('Holy See (Vatican City State)', 'Holy See (Vatican City State)', 'Holy See (Vatican City State)'), value: 'VA' },
    { label: L('Honduras', 'Honduras', 'Honduras'), value: 'HN' },
    { label: L('Hong Kong', 'Hong Kong', 'Hong Kong'), value: 'HK' },
    { label: L('Hungary', 'Hungary', 'Hungary'), value: 'HU' },
    { label: L('Iceland', 'Iceland', 'Iceland'), value: 'IS' },
    { label: L('India', 'India', 'India'), value: 'IN' },
    { label: L('Indonesia', 'Indonesia', 'Indonesia'), value: 'ID' },
    { label: L('Iran', 'Iran', 'Iran'), value: 'IR' },
    { label: L('Iraq', 'Iraq', 'Iraq'), value: 'IQ' },
    { label: L('Ireland', 'Ireland', 'Ireland'), value: 'IE' },
    { label: L('Isle of Man', 'Isle of Man', 'Isle of Man'), value: 'IM' },
    { label: L('Italy', 'Italy', 'Italy'), value: 'IT' },
    { label: L('Ivory Coast', 'Ivory Coast', 'Ivory Coast'), value: 'CI' },
    { label: L('Jamaica', 'Jamaica', 'Jamaica'), value: 'JM' },
    { label: L('Japan', 'Japan', 'Japan'), value: 'JP' },
    { label: L('Jersey', 'Jersey', 'Jersey'), value: 'JE' },
    { label: L('Jordan', 'Jordan', 'Jordan'), value: 'JO' },
    { label: L('Kazakhstan', 'Kazakhstan', 'Kazakhstan'), value: 'KZ' },
    { label: L('Kenya', 'Kenya', 'Kenya'), value: 'KE' },
    { label: L('Kiribati', 'Kiribati', 'Kiribati'), value: 'KI' },
    { label: L('Kuwait', 'Kuwait', 'Kuwait'), value: 'KW' },
    { label: L('Kyrgyzstan', 'Kyrgyzstan', 'Kyrgyzstan'), value: 'KG' },
    { label: L('Laos', 'Laos', 'Laos'), value: 'LA' },
    { label: L('Latvia', 'Latvia', 'Latvia'), value: 'LV' },
    { label: L('Lebanon', 'Lebanon', 'Lebanon'), value: 'LB' },
    { label: L('Lesotho', 'Lesotho', 'Lesotho'), value: 'LS' },
    { label: L('Liberia', 'Liberia', 'Liberia'), value: 'LR' },
    { label: L('Libya', 'Libya', 'Libya'), value: 'LY' },
    { label: L('Liechtenstein', 'Liechtenstein', 'Liechtenstein'), value: 'LI' },
    { label: L('Lithuania', 'Lithuania', 'Lithuania'), value: 'LT' },
    { label: L('Luxembourg', 'Luxembourg', 'Luxembourg'), value: 'LU' },
    { label: L('Macao', 'Macao', 'Macao'), value: 'MO' },
    { label: L('Madagascar', 'Madagascar', 'Madagascar'), value: 'MG' },
    { label: L('Malawi', 'Malawi', 'Malawi'), value: 'MW' },
    { label: L('Malaysia', 'Malaysia', 'Malaysia'), value: 'MY' },
    { label: L('Maldives', 'Maldives', 'Maldives'), value: 'MV' },
    { label: L('Mali', 'Mali', 'Mali'), value: 'ML' },
    { label: L('Malta', 'Malta', 'Malta'), value: 'MT' },
    { label: L('Marshall Islands', 'Marshall Islands', 'Marshall Islands'), value: 'MH' },
    { label: L('Martinique', 'Martinique', 'Martinique'), value: 'MQ' },
    { label: L('Mauritania', 'Mauritania', 'Mauritania'), value: 'MR' },
    { label: L('Mauritius', 'Mauritius', 'Mauritius'), value: 'MU' },
    { label: L('Mayotte', 'Mayotte', 'Mayotte'), value: 'YT' },
    { label: L('Mexico', 'Mexico', 'Mexico'), value: 'MX' },
    { label: L('Micronesia, Federated States of', 'Micronesia, Federated States of', 'Micronesia, Federated States of'), value: 'FM' },
    { label: L('Moldova', 'Moldova', 'Moldova'), value: 'MD' },
    { label: L('Monaco', 'Monaco', 'Monaco'), value: 'MC' },
    { label: L('Mongolia', 'Mongolia', 'Mongolia'), value: 'MN' },
    { label: L('Montenegro', 'Montenegro', 'Montenegro'), value: 'ME' },
    { label: L('Montserrat', 'Montserrat', 'Montserrat'), value: 'MS' },
    { label: L('Morocco', 'Morocco', 'Morocco'), value: 'MA' },
    { label: L('Mozambique', 'Mozambique', 'Mozambique'), value: 'MZ' },
    { label: L('Myanmar', 'Myanmar', 'Myanmar'), value: 'MM' },
    { label: L('Namibia', 'Namibia', 'Namibia'), value: 'NA' },
    { label: L('Nauru', 'Nauru', 'Nauru'), value: 'NR' },
    { label: L('Nepal', 'Nepal', 'Nepal'), value: 'NP' },
    { label: L('Netherlands', 'Netherlands', 'Netherlands'), value: 'NL' },
    { label: L('New Caledonia', 'New Caledonia', 'New Caledonia'), value: 'NC' },
    { label: L('New Zealand', 'New Zealand', 'New Zealand'), value: 'NZ' },
    { label: L('Nicaragua', 'Nicaragua', 'Nicaragua'), value: 'NI' },
    { label: L('Niger', 'Niger', 'Niger'), value: 'NE' },
    { label: L('Nigeria', 'Nigeria', 'Nigeria'), value: 'NG' },
    { label: L('Niue', 'Niue', 'Niue'), value: 'NU' },
    { label: L('Norfolk Island', 'Norfolk Island', 'Norfolk Island'), value: 'NF' },
    { label: L('North Korea', 'North Korea', 'North Korea'), value: 'KP' },
    { label: L('North Macedonia', 'North Macedonia', 'North Macedonia'), value: 'MK' },
    { label: L('Northern Mariana Islands', 'Northern Mariana Islands', 'Northern Mariana Islands'), value: 'MP' },
    { label: L('Norway', 'Norway', 'Norway'), value: 'NO' },
    { label: L('Oman', 'Oman', 'Oman'), value: 'OM' },
    { label: L('Pakistan', 'Pakistan', 'Pakistan'), value: 'PK' },
    { label: L('Palau', 'Palau', 'Palau'), value: 'PW' },
    { label: L('Palestine, State of', 'Palestine, State of', 'Palestine, State of'), value: 'PS' },
    { label: L('Panama', 'Panama', 'Panama'), value: 'PA' },
    { label: L('Papua New Guinea', 'Papua New Guinea', 'Papua New Guinea'), value: 'PG' },
    { label: L('Paraguay', 'Paraguay', 'Paraguay'), value: 'PY' },
    { label: L('Peru', 'Peru', 'Peru'), value: 'PE' },
    { label: L('Philippines', 'Philippines', 'Philippines'), value: 'PH' },
    { label: L('Pitcairn', 'Pitcairn', 'Pitcairn'), value: 'PN' },
    { label: L('Poland', 'Poland', 'Poland'), value: 'PL' },
    { label: L('Portugal', 'Portugal', 'Portugal'), value: 'PT' },
    { label: L('Puerto Rico', 'Puerto Rico', 'Puerto Rico'), value: 'PR' },
    { label: L('Qatar', 'Qatar', 'Qatar'), value: 'QA' },
    { label: L('Republic of the Congo', 'Republic of the Congo', 'Republic of the Congo'), value: 'CG' },
    { label: L('Romania', 'Romania', 'Romania'), value: 'RO' },
    { label: L('Russia', 'Russia', 'Russia'), value: 'RU' },
    { label: L('Rwanda', 'Rwanda', 'Rwanda'), value: 'RW' },
    { label: L('Réunion', 'Réunion', 'Réunion'), value: 'RE' },
    { label: L('Saint Barthélemy', 'Saint Barthélemy', 'Saint Barthélemy'), value: 'BL' },
    { label: L('Saint Helena, Ascension and Tristan da Cunha', 'Saint Helena, Ascension and Tristan da Cunha', 'Saint Helena, Ascension and Tristan da Cunha'), value: 'SH' },
    { label: L('Saint Kitts and Nevis', 'Saint Kitts and Nevis', 'Saint Kitts and Nevis'), value: 'KN' },
    { label: L('Saint Lucia', 'Saint Lucia', 'Saint Lucia'), value: 'LC' },
    { label: L('Saint Martin (French part)', 'Saint Martin (French part)', 'Saint Martin (French part)'), value: 'MF' },
    { label: L('Saint Pierre and Miquelon', 'Saint Pierre and Miquelon', 'Saint Pierre and Miquelon'), value: 'PM' },
    { label: L('Saint Vincent and the Grenadines', 'Saint Vincent and the Grenadines', 'Saint Vincent and the Grenadines'), value: 'VC' },
    { label: L('Samoa', 'Samoa', 'Samoa'), value: 'WS' },
    { label: L('San Marino', 'San Marino', 'San Marino'), value: 'SM' },
    { label: L('Sao Tome and Principe', 'Sao Tome and Principe', 'Sao Tome and Principe'), value: 'ST' },
    { label: L('Saudi Arabia', 'Saudi Arabia', 'Saudi Arabia'), value: 'SA' },
    { label: L('Senegal', 'Senegal', 'Senegal'), value: 'SN' },
    { label: L('Serbia', 'Serbia', 'Serbia'), value: 'RS' },
    { label: L('Seychelles', 'Seychelles', 'Seychelles'), value: 'SC' },
    { label: L('Sierra Leone', 'Sierra Leone', 'Sierra Leone'), value: 'SL' },
    { label: L('Singapore', 'Singapore', 'Singapore'), value: 'SG' },
    { label: L('Sint Maarten (Dutch part)', 'Sint Maarten (Dutch part)', 'Sint Maarten (Dutch part)'), value: 'SX' },
    { label: L('Slovakia', 'Slovakia', 'Slovakia'), value: 'SK' },
    { label: L('Slovenia', 'Slovenia', 'Slovenia'), value: 'SI' },
    { label: L('Solomon Islands', 'Solomon Islands', 'Solomon Islands'), value: 'SB' },
    { label: L('Somalia', 'Somalia', 'Somalia'), value: 'SO' },
    { label: L('South Africa', 'South Africa', 'South Africa'), value: 'ZA' },
    { label: L('South Georgia and the South Sandwich Islands', 'South Georgia and the South Sandwich Islands', 'South Georgia and the South Sandwich Islands'), value: 'GS' },
    { label: L('South Korea', 'South Korea', 'South Korea'), value: 'KR' },
    { label: L('South Sudan', 'South Sudan', 'South Sudan'), value: 'SS' },
    { label: L('Spain', 'Spain', 'Spain'), value: 'ES' },
    { label: L('Sri Lanka', 'Sri Lanka', 'Sri Lanka'), value: 'LK' },
    { label: L('Sudan', 'Sudan', 'Sudan'), value: 'SD' },
    { label: L('Suriname', 'Suriname', 'Suriname'), value: 'SR' },
    { label: L('Svalbard and Jan Mayen', 'Svalbard and Jan Mayen', 'Svalbard and Jan Mayen'), value: 'SJ' },
    { label: L('Sweden', 'Sweden', 'Sweden'), value: 'SE' },
    { label: L('Switzerland', 'Switzerland', 'Switzerland'), value: 'CH' },
    { label: L('Syria', 'Syria', 'Syria'), value: 'SY' },
    { label: L('Taiwan', 'Taiwan', 'Taiwan'), value: 'TW' },
    { label: L('Tajikistan', 'Tajikistan', 'Tajikistan'), value: 'TJ' },
    { label: L('Tanzania', 'Tanzania', 'Tanzania'), value: 'TZ' },
    { label: L('Thailand', 'Thailand', 'Thailand'), value: 'TH' },
    { label: L('Timor-Leste', 'Timor-Leste', 'Timor-Leste'), value: 'TL' },
    { label: L('Togo', 'Togo', 'Togo'), value: 'TG' },
    { label: L('Tokelau', 'Tokelau', 'Tokelau'), value: 'TK' },
    { label: L('Tonga', 'Tonga', 'Tonga'), value: 'TO' },
    { label: L('Trinidad and Tobago', 'Trinidad and Tobago', 'Trinidad and Tobago'), value: 'TT' },
    { label: L('Tunisia', 'Tunisia', 'Tunisia'), value: 'TN' },
    { label: L('Turkmenistan', 'Turkmenistan', 'Turkmenistan'), value: 'TM' },
    { label: L('Turks and Caicos Islands', 'Turks and Caicos Islands', 'Turks and Caicos Islands'), value: 'TC' },
    { label: L('Tuvalu', 'Tuvalu', 'Tuvalu'), value: 'TV' },
    { label: L('Türkiye', 'Türkiye', 'Türkiye'), value: 'TR' },
    { label: L('Uganda', 'Uganda', 'Uganda'), value: 'UG' },
    { label: L('Ukraine', 'Ukraine', 'Ukraine'), value: 'UA' },
    { label: L('United Arab Emirates', 'United Arab Emirates', 'United Arab Emirates'), value: 'AE' },
    { label: L('United Kingdom', 'United Kingdom', 'United Kingdom'), value: 'GB' },
    { label: L('United States', 'United States', 'United States'), value: 'US' },
    { label: L('United States Minor Outlying Islands', 'United States Minor Outlying Islands', 'United States Minor Outlying Islands'), value: 'UM' },
    { label: L('Uruguay', 'Uruguay', 'Uruguay'), value: 'UY' },
    { label: L('Uzbekistan', 'Uzbekistan', 'Uzbekistan'), value: 'UZ' },
    { label: L('Vanuatu', 'Vanuatu', 'Vanuatu'), value: 'VU' },
    { label: L('Venezuela', 'Venezuela', 'Venezuela'), value: 'VE' },
    { label: L('Vietnam', 'Vietnam', 'Vietnam'), value: 'VN' },
    { label: L('Virgin Islands, British', 'Virgin Islands, British', 'Virgin Islands, British'), value: 'VG' },
    { label: L('Virgin Islands, U.S.', 'Virgin Islands, U.S.', 'Virgin Islands, U.S.'), value: 'VI' },
    { label: L('Wallis and Futuna', 'Wallis and Futuna', 'Wallis and Futuna'), value: 'WF' },
    { label: L('Western Sahara', 'Western Sahara', 'Western Sahara'), value: 'EH' },
    { label: L('Yemen', 'Yemen', 'Yemen'), value: 'YE' },
    { label: L('Zambia', 'Zambia', 'Zambia'), value: 'ZM' },
    { label: L('Zimbabwe', 'Zimbabwe', 'Zimbabwe'), value: 'ZW' },
    { label: L('Åland Islands', 'Åland Islands', 'Åland Islands'), value: 'AX' }
];

const REGION_OPTIONS = {
    DZ: [
        { label: L('Adrar', 'Adrar', 'أدرار'), value: 'DZ-01' },
        { label: L('Chlef', 'Chlef', 'الشلف'), value: 'DZ-02' },
        { label: L('Laghouat', 'Laghouat', 'الأغواط'), value: 'DZ-03' },
        { label: L('Oum El Bouaghi', 'Oum El Bouaghi', 'أم البواقي'), value: 'DZ-04' },
        { label: L('Batna', 'Batna', 'باتنة'), value: 'DZ-05' },
        { label: L('Béjaïa', 'Béjaïa', 'بجاية'), value: 'DZ-06' },
        { label: L('Biskra', 'Biskra', 'بسكرة'), value: 'DZ-07' },
        { label: L('Béchar', 'Béchar', 'بشار'), value: 'DZ-08' },
        { label: L('Blida', 'Blida', 'البليدة'), value: 'DZ-09' },
        { label: L('Bouira', 'Bouira', 'البويرة'), value: 'DZ-10' },
        { label: L('Tamanrasset', 'Tamanrasset', 'تمنراست'), value: 'DZ-11' },
        { label: L('Tébessa', 'Tébessa', 'تبسة'), value: 'DZ-12' },
        { label: L('Tlemcen', 'Tlemcen', 'تلمسان'), value: 'DZ-13' },
        { label: L('Tiaret', 'Tiaret', 'تيارت'), value: 'DZ-14' },
        { label: L('Tizi Ouzou', 'Tizi Ouzou', 'تيزي وزو'), value: 'DZ-15' },
        { label: L('Algiers', 'Alger', 'الجزائر'), value: 'DZ-16' },
        { label: L('Djelfa', 'Djelfa', 'الجلفة'), value: 'DZ-17' },
        { label: L('Jijel', 'Jijel', 'جيجل'), value: 'DZ-18' },
        { label: L('Sétif', 'Sétif', 'سطيف'), value: 'DZ-19' },
        { label: L('Saïda', 'Saïda', 'سعيدة'), value: 'DZ-20' },
        { label: L('Skikda', 'Skikda', 'سكيكدة'), value: 'DZ-21' },
        { label: L('Sidi Bel Abbès', 'Sidi Bel Abbès', 'سيدي بلعباس'), value: 'DZ-22' },
        { label: L('Annaba', 'Annaba', 'عنابة'), value: 'DZ-23' },
        { label: L('Guelma', 'Guelma', 'قالمة'), value: 'DZ-24' },
        { label: L('Constantine', 'Constantine', 'قسنطينة'), value: 'DZ-25' },
        { label: L('Médéa', 'Médéa', 'المدية'), value: 'DZ-26' },
        { label: L('Mostaganem', 'Mostaganem', 'مستغانم'), value: 'DZ-27' },
        { label: L('M’Sila', 'M’Sila', 'المسيلة'), value: 'DZ-28' },
        { label: L('Mascara', 'Mascara', 'معسكر'), value: 'DZ-29' },
        { label: L('Ouargla', 'Ouargla', 'ورقلة'), value: 'DZ-30' },
        { label: L('Oran', 'Oran', 'وهران'), value: 'DZ-31' },
        { label: L('El Bayadh', 'El Bayadh', 'البيض'), value: 'DZ-32' },
        { label: L('Illizi', 'Illizi', 'إليزي'), value: 'DZ-33' },
        { label: L('Bordj Bou Arréridj', 'Bordj Bou Arréridj', 'برج بوعريريج'), value: 'DZ-34' },
        { label: L('Boumerdès', 'Boumerdès', 'بومرداس'), value: 'DZ-35' },
        { label: L('El Tarf', 'El Tarf', 'الطارف'), value: 'DZ-36' },
        { label: L('Tindouf', 'Tindouf', 'تندوف'), value: 'DZ-37' },
        { label: L('Tissemsilt', 'Tissemsilt', 'تيسمسيلت'), value: 'DZ-38' },
        { label: L('El Oued', 'El Oued', 'الوادي'), value: 'DZ-39' },
        { label: L('Khenchela', 'Khenchela', 'خنشلة'), value: 'DZ-40' },
        { label: L('Souk Ahras', 'Souk Ahras', 'سوق أهراس'), value: 'DZ-41' },
        { label: L('Tipaza', 'Tipaza', 'تيبازة'), value: 'DZ-42' },
        { label: L('Mila', 'Mila', 'ميلة'), value: 'DZ-43' },
        { label: L('Aïn Defla', 'Aïn Defla', 'عين الدفلى'), value: 'DZ-44' },
        { label: L('Naâma', 'Naâma', 'النعامة'), value: 'DZ-45' },
        { label: L('Aïn Témouchent', 'Aïn Témouchent', 'عين تموشنت'), value: 'DZ-46' },
        { label: L('Ghardaïa', 'Ghardaïa', 'غرداية'), value: 'DZ-47' },
        { label: L('Relizane', 'Relizane', 'غليزان'), value: 'DZ-48' },
        { label: L('Timimoun', 'Timimoun', 'تيميمون'), value: 'DZ-49' },
        { label: L('Bordj Badji Mokhtar', 'Bordj Badji Mokhtar', 'برج باجي مختار'), value: 'DZ-50' },
        { label: L('Ouled Djellal', 'Ouled Djellal', 'أولاد جلال'), value: 'DZ-51' },
        { label: L('Béni Abbès', 'Béni Abbès', 'بني عباس'), value: 'DZ-52' },
        { label: L('In Salah', 'In Salah', 'عين صالح'), value: 'DZ-53' },
        { label: L('In Guezzam', 'In Guezzam', 'عين قزام'), value: 'DZ-54' },
        { label: L('Touggourt', 'Touggourt', 'تقرت'), value: 'DZ-55' },
        { label: L('Djanet', 'Djanet', 'جانت'), value: 'DZ-56' },
        { label: L('El M’Ghair', 'El M’Ghair', 'المغير'), value: 'DZ-57' },
        { label: L('El Meniaa', 'El Meniaa', 'المنيعة'), value: 'DZ-58' }
    ],
    DEFAULT: [
        { label: L('Other / Not listed', 'Autre / non listé', 'أخرى / غير مدرجة'), value: 'OTHER' }
    ]
};

const CIVILITY_OPTIONS = [
    { label: L('Mr.', 'M.', 'السيد'), value: 'mr' },
    { label: L('Mrs.', 'Mme', 'السيدة'), value: 'mrs' }
];

const CLAIMANT_OPTIONS = [
    { label: L('Passenger', 'Passager', 'مسافر'), value: 'passenger' },
    { label: L('Legal representative of a passenger', 'Représentant légal d’un passager', 'الممثل القانوني للمسافر'), value: 'legal-representative' }
];

const CANCELLATION_DELAY_REASONS = [
    { label: L('Cancellation', 'Annulation', 'إلغاء'), value: 'cancellation' },
    { label: L('Delay', 'Retard', 'تأخير'), value: 'delay' }
];


const TICKET_PURCHASE_CHANNEL_OPTIONS = [
    { label: L('Tickets purchased on the Air Algérie website or mobile application', 'Billets achetés sur le site Air Algérie ou application Air Algérie', 'تذاكر تم شراؤها من موقع أو تطبيق الخطوط الجوية الجزائرية'), value: 'website-or-app' },
    { label: L('Tickets purchased via contact center', 'Billets achetés via contact center', 'تذاكر تم شراؤها عبر مركز الاتصال'), value: 'contact-center' },
    { label: L('Tickets purchased from Air Algérie agencies', 'Billets achetés auprès des agences Air Algérie', 'تذاكر تم شراؤها من وكالات الخطوط الجوية الجزائرية'), value: 'agency' }
];

const DENIED_BOARDING_REASONS = [
    { label: L('Overbooking', 'Surbooking', 'حجز زائد'), value: 'overbooking' },
    { label: L('Aircraft change (IRGAV)', 'Changement d’avion (IRGAV)', 'تغيير الطائرة (IRGAV)'), value: 'aircraft-change' },
    { label: L('Flown status / unused journey', 'Statut volé / trajet non utilisé', 'حالة الرحلة / مسار غير مستخدم'), value: 'flown-status-unused-journey' },
    { label: L('Late passenger arrival', 'Arrivée tardive du passager', 'وصول المسافر متأخراً'), value: 'late-passenger-arrival' },
    { label: L('Passenger behaviour', 'Comportement du passager', 'سلوك المسافر'), value: 'passenger-behaviour' },
    { label: L('Penalty payment dispute', 'Litige paiement pénalité', 'نزاع حول دفع غرامة'), value: 'penalty-payment-dispute' },
    { label: L('Pregnant passenger', 'Passagère enceinte', 'مسافرة حامل'), value: 'pregnant-passenger' },
    { label: L('Other...', 'Autre...', 'أخرى...'), value: 'other' }
];

const BAGGAGE_REASONS = [
    { label: L('Follow-up to an already filed complaint', 'Suivi d’une réclamation déjà déposée', 'متابعة شكوى تم إيداعها سابقاً'), value: 'follow-up-existing-complaint' }
];

const RECEPTION_QUALITY_OPTIONS = [
    { label: L('Good', 'Bonne', 'جيدة'), value: 'good' },
    { label: L('Average', 'Moyenne', 'متوسطة'), value: 'average' },
    { label: L('Poor', 'Mauvaise', 'ضعيفة'), value: 'poor' }
];

export function getText(language = 'en') {
    return TEXT[language] || TEXT.en;
}

export function getFieldLabels(language = 'en') {
    return FIELD_LABELS[language] || FIELD_LABELS.en;
}

export function getCategories(language = 'en') {
    return CATEGORIES.map((category) => ({
        ...category,
        title: localize(category.title, language),
        description: localize(category.description, language)
    }));
}

export function getCategory(categoryId, language = 'en') {
    return getCategories(language).find((category) => category.id === categoryId);
}

export function getCountryOptions(language = 'en') {
    return COUNTRY_OPTIONS.map((option) => ({
        ...option,
        label: getLocalizedCountryLabel(option.value, language, localize(option.label, language))
    }));
}

export function getRegionOptions(countryCode, language = 'en') {
    return localizeOptions(REGION_OPTIONS[countryCode] || REGION_OPTIONS.DEFAULT || [], language);
}

export function getCivilityOptions(language = 'en') {
    return localizeOptions(CIVILITY_OPTIONS, language);
}

export function getClaimantOptions(language = 'en') {
    return localizeOptions(CLAIMANT_OPTIONS, language);
}

export function getCancellationDelayReasons(language = 'en') {
    return localizeOptions(CANCELLATION_DELAY_REASONS, language);
}

export function getTicketPurchaseChannelOptions(language = 'en') {
    return localizeOptions(TICKET_PURCHASE_CHANNEL_OPTIONS, language);
}

export function getDeniedBoardingReasons(language = 'en') {
    return localizeOptions(DENIED_BOARDING_REASONS, language);
}

export function getBaggageReasons(language = 'en') {
    return localizeOptions(BAGGAGE_REASONS, language);
}

export function getReceptionQualityOptions(language = 'en') {
    return localizeOptions(RECEPTION_QUALITY_OPTIONS, language);
}
