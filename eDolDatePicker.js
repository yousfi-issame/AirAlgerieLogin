<template>
    <div class={wrapperClass}>
        <template if:false={hideInline}>
        <button
            class={inlineButtonClass}
            type="button"
            aria-pressed={verified}
            onclick={openChallenge}
        >
            <span class="edol-captcha-checkbox" aria-hidden="true">
                <template if:true={verified}>✓</template>
            </span>
            <span class="edol-captcha-copy">
                <span class="edol-captcha-title">{checkboxLabel}</span>
                <template if:true={verified}>
                    <span class="edol-captcha-status">Verified</span>
                </template>
            </span>
            <span class="edol-captcha-brand" aria-hidden="true">
                <span class="edol-captcha-brand-icon">↻</span>
                <span>reCAPTCHA</span>
            </span>
        </button>
        </template>

        <template if:true={isChallengeOpen}>
            <section class="edol-captcha-modal-backdrop" role="dialog" aria-modal="true" aria-label="Security verification">
                <div class="edol-captcha-modal">
                    <div class="edol-captcha-modal-header">
                        <div>
                            <h2>{modalTitle}</h2>
                            <p>{modalHelp}</p>
                        </div>
                        <button
                            class="edol-captcha-modal-close"
                            type="button"
                            title="Close verification"
                            aria-label="Close verification"
                            onclick={closeChallenge}
                        >×</button>
                    </div>

                    <iframe
                        class="edol-captcha-frame"
                        data-id="captchaFrame"
                        src={captchaUrl}
                        title="reCAPTCHA verification"
                        scrolling="auto"
                        frameborder="0"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms">
                    </iframe>
                </div>
            </section>
        </template>

        <template if:true={errorMessage}>
            <div class="edol-captcha-error">{errorMessage}</div>
        </template>
    </div>
</template>
