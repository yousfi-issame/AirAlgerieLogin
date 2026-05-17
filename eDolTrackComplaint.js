import { LightningElement, api } from 'lwc';
import basePath from '@salesforce/community/basePath';
import logo from '@salesforce/resourceUrl/AirAlgerieLogo';

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

export default class EDolPortalHeader extends LightningElement {
    @api selectedLanguage = 'en';
    @api homeUrl = '/';
    logoUrl = logo;

    get resolvedHomeUrl() {
        return buildCommunityUrl(this.homeUrl || '/');
    }

    handleLogoClick(event) {
        event.preventDefault();
        window.location.assign(this.resolvedHomeUrl);
    }

    handleLanguageChange(event) {
        this.dispatchEvent(new CustomEvent('languagechange', {
            detail: { language: event.detail.language },
            bubbles: true,
            composed: true
        }));
    }
}
