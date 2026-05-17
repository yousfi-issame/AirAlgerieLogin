<template>
    <c-e-dol-form-shell selected-language={selectedLanguage} category-id="denied-boarding" back-url={backUrl} current-step={currentStep} completion-mode={isSubmitted} onlanguagechange={handleLanguageChange}>
        <template if:true={isSubmitted}>
            <div class="edol-success-page">
                <div class="edol-celebration" aria-hidden="true">
                    <span class="edol-celebration-piece edol-celebration-piece-1">●</span>
                    <span class="edol-celebration-piece edol-celebration-piece-2">♥</span>
                    <span class="edol-celebration-piece edol-celebration-piece-3">◆</span>
                    <span class="edol-celebration-piece edol-celebration-piece-4">✦</span>
                    <span class="edol-celebration-piece edol-celebration-piece-5">●</span>
                    <span class="edol-celebration-piece edol-celebration-piece-6">♥</span>
                    <span class="edol-celebration-piece edol-celebration-piece-7">◆</span>
                    <span class="edol-celebration-piece edol-celebration-piece-8">✦</span>
                    <span class="edol-celebration-piece edol-celebration-piece-9">●</span>
                    <span class="edol-celebration-piece edol-celebration-piece-10">♥</span>
                    <span class="edol-celebration-piece edol-celebration-piece-11">◆</span>
                    <span class="edol-celebration-piece edol-celebration-piece-12">✦</span>
                </div>
                <div class="edol-success-icon">✓</div>
                <h1>{text.successTitle}</h1>
                <p>{text.successMessage}</p>
                <template if:true={submissionReference}>
                    <p class="edol-success-reference">{text.reference}: {submissionReference}</p>
                </template>
                <p class="edol-success-email">{text.successEmailMessage}</p>
                <div class="edol-success-actions">
                    <button class="edol-btn edol-btn-primary" type="button" onclick={handleBackToMain}>{text.backToMain}</button>
                </div>
            </div>
        </template>

        <template if:false={isSubmitted}>
            <template if:true={errorModalOpen}>
                <section class="edol-error-popup-backdrop" role="dialog" aria-modal="true" aria-labelledby="edol-error-title">
                    <div class="edol-error-popup">
                        <button class="edol-error-popup-close" type="button" onclick={closeErrorPopup} aria-label="Close">×</button>
                        <div class="edol-error-popup-icon">!</div>
                        <h2 id="edol-error-title">{errorModalTitle}</h2>
                        <p>{errorMessage}</p>
                        <div class="edol-error-popup-actions">
                            <button class="edol-btn edol-btn-primary" type="button" onclick={closeErrorPopup}>{errorOkLabel}</button>
                        </div>
                    </div>
                </section>
            </template>

            <form class="formBody" onsubmit={handleSubmit}>
            <div class="formSection">
                <div class="edol-field">
                    <label class="edol-label"><span class="edol-required">*</span> {labels.selectOption}</label>
                    <select class="edol-select" name="reason" value={formData.reason} onchange={handleInputChange}>
                        <option value="" disabled selected hidden>{labels.selectOption}</option>
                        <template for:each={reasonOptions} for:item="item">
                            <option key={item.value} value={item.value}>{item.label}</option>
                        </template>
                    </select>
                </div>

                <div class="edol-field">
                    <label class="edol-label"><span class="edol-required">*</span> {labels.claimantType}</label>
                    <select class="edol-select" name="claimantType" value={formData.claimantType} onchange={handleInputChange}>
                        <option value="" disabled selected hidden>{labels.selectOption}</option>
                        <template for:each={claimantOptions} for:item="item">
                            <option key={item.value} value={item.value}>{item.label}</option>
                        </template>
                    </select>
                </div>

                <div class="edol-field">
                    <label class="edol-label"><span class="edol-required">*</span> {labels.civility}</label>
                    <select class="edol-select" name="civility" value={formData.civility} onchange={handleInputChange} disabled={isAccountReadOnly}>
                        <option value="" disabled selected hidden>{labels.chooseCivility}</option>
                        <template for:each={civilityOptions} for:item="item">
                            <option key={item.value} value={item.value}>{item.label}</option>
                        </template>
                    </select>
                </div>
            </div>

            <div class="edol-grid-2">
                <div class="edol-field">
                    <label class="edol-label"><span class="edol-required">*</span> {labels.lastName}</label>
                    <input class="edol-input" name="lastName" disabled={isAccountReadOnly} value={formData.lastName} oninput={handleInputChange} onchange={handleInputChange} />
                </div>
                <div class="edol-field">
                    <label class="edol-label"><span class="edol-required">*</span> {labels.firstName}</label>
                    <input class="edol-input" name="firstName" disabled={isAccountReadOnly} value={formData.firstName} oninput={handleInputChange} onchange={handleInputChange} />
                </div>
            </div>

            <div class="edol-grid-2">
                <div class="edol-field">
                    <label class="edol-label"><span class="edol-required">*</span> {labels.mobilePhone}</label>
                    <c-e-dol-phone-input name="mobilePhone" value={formData.mobilePhone} placeholder={labels.enterNumber} selected-language={selectedLanguage} disabled={isAccountReadOnly} onphonechange={handlePhoneChange}></c-e-dol-phone-input>
                </div>
                <div class="edol-field">
                    <label class="edol-label">{labels.landlinePhone}</label>
                    <c-e-dol-phone-input name="landlinePhone" value={formData.landlinePhone} placeholder={labels.enterNumber} selected-language={selectedLanguage} disabled={isAccountReadOnly} onphonechange={handlePhoneChange}></c-e-dol-phone-input>
                </div>
            </div>

            <div class="edol-grid-2">
                <div class="edol-field">
                    <label class="edol-label"><span class="edol-required">*</span> {labels.email}</label>
                    <input class="edol-input" name="email" disabled={isAccountReadOnly} type="email" value={formData.email} oninput={handleInputChange} onchange={handleInputChange} />
                </div>
                <div class="edol-field">
                    <label class="edol-label"><span class="edol-required">*</span> {labels.confirmEmail}</label>
                    <input class="edol-input" name="confirmEmail" disabled={isAccountReadOnly} type="email" value={formData.confirmEmail} oninput={handleInputChange} onchange={handleInputChange} />
                </div>
            </div>

            <div class="edol-field">
                <label class="edol-label"><span class="edol-required">*</span> {labels.countryOfResidence}</label>
                <select class="edol-select" name="countryOfResidence" value={formData.countryOfResidence} onchange={handleCountryChange} disabled={isAccountReadOnly}>
                    <option value="" disabled selected hidden>{labels.chooseCountry}</option>
                    <template for:each={countryOptions} for:item="item">
                        <option key={item.value} value={item.value}>{item.label}</option>
                    </template>
                </select>
            </div>

            <template if:true={showRegionOfResidence}>
                <div class="edol-field">
                    <label class="edol-label"><span class="edol-required">*</span> {labels.regionOfResidence}</label>
                    <select class="edol-select" name="regionOfResidence" value={formData.regionOfResidence} onchange={handleInputChange} disabled={isRegionDisabled}>
                        <option value="" disabled selected hidden>{labels.chooseRegion}</option>
                        <template for:each={regionOptions} for:item="item">
                            <option key={item.value} value={item.value}>{item.label}</option>
                        </template>
                    </select>
                </div>
            </template>

            <div class="edol-grid-2">
                <div class="edol-field">
                    <label class="edol-label"><span class="edol-required">*</span> {labels.addressOfResidence}</label>
                    <input class="edol-input" name="addressOfResidence" disabled={isAccountReadOnly} value={formData.addressOfResidence} oninput={handleInputChange} onchange={handleInputChange} />
                </div>
                <div class="edol-field">
                    <label class="edol-label">{labels.postalCode}</label>
                    <input class="edol-input" name="postalCode" disabled={isAccountReadOnly} value={formData.postalCode} oninput={handleInputChange} onchange={handleInputChange} />
                </div>
            </div>

            <div class="edol-field">
                <label class="edol-label"><span class="edol-required">*</span> {labels.dateOfBirth}</label>
                <c-e-dol-date-picker name="dateOfBirth" value={formData.dateOfBirth} max={todayIso} disabled={isAccountReadOnly} onchange={handleInputChange}></c-e-dol-date-picker>
            </div>

            <div class="edol-field">
                <label class="edol-label"><span class="edol-required">*</span> {labels.incidentLocation}</label>
                <input class="edol-input" name="incidentLocation" value={formData.incidentLocation} oninput={handleInputChange} onchange={handleInputChange} />
            </div>

            <div class="edol-grid-2">
                <div class="edol-field">
                    <label class="edol-label"><span class="edol-required">*</span> {labels.flightNumber}</label>
                    <input class="edol-input" name="flightNumber" value={formData.flightNumber} oninput={handleInputChange} onchange={handleInputChange} />
                </div>
                <div class="edol-field">
                    <label class="edol-label"><span class="edol-required">*</span> {labels.flightDate}</label>
                    <c-e-dol-date-picker name="flightDate" value={formData.flightDate} max={todayIso} onchange={handleInputChange}></c-e-dol-date-picker>
                </div>
            </div>

            <c-e-dol-ticket-repeater selected-language={selectedLanguage} onticketschange={handleTicketsChange}></c-e-dol-ticket-repeater>

            <div class="edol-field">
                <label class="edol-label">{labels.details}</label>
                <textarea class="edol-textarea" name="details" maxlength="500" placeholder={labels.maxLength500} value={formData.details} oninput={handleInputChange} onchange={handleInputChange}></textarea>
            </div>

            <c-e-dol-file-upload label={text.uploadLabel} helper-text={labels.uploadHelper} limit-message={text.fileLimitMessage} cancel-label={text.cancel} ok-label={text.ok} onfilesuploaded={handleFilesUploaded}></c-e-dol-file-upload>

            <div class="edol-field edol-consent-field">
                <label class="edol-checkbox-label">
                    <input class="edol-checkbox" name="consentAccepted" type="checkbox" checked={formData.consentAccepted} onchange={handleConsentChange} />
                    <span><span class="edol-required">*</span> {labels.personalDataConsent}</span>
                </label>
            </div>


            <div class="captchaActions">
                <c-e-dol-captcha class="edol-captcha-popup-only" hide-inline language={selectedLanguage} oncaptchachange={handleCaptchaChange}></c-e-dol-captcha>
                <button class="edol-btn edol-btn-primary" type="submit" disabled={isSubmitDisabled}>{submitLabel}</button>
            </div>
            </form>
        </template>
    </c-e-dol-form-shell>
</template>
