// Fonctions de sécurité pour un site statique GitHub Pages
const security = {
    // Validation des URLs
    validateUrl(url) {
        try {
            const urlObj = new URL(url);
            const allowedDomains = [
                'github.com',
                'raw.githubusercontent.com',
                'drrakendu78.github.io',
                'fonts.googleapis.com',
                'fonts.gstatic.com'
            ];
            
            return urlObj.protocol === 'https:' && 
                   allowedDomains.includes(urlObj.hostname);
        } catch {
            return false;
        }
    },

    // Validation des assets GitHub
    validateGithubAsset(asset) {
        if (!asset || typeof asset !== 'object') return false;
        
        const urlObj = new URL(asset.browser_download_url);
        return this.validateUrl(asset.browser_download_url) && 
               asset.name.endsWith('.msi') &&
               urlObj.pathname.includes('/releases/download/');
    },

    // Sanitization du HTML
    sanitizeHtml(html) {
        return html
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};

// Exporter l'objet security vers window
window.security = security;