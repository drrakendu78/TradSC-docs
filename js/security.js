// Fonctions de sécurité pour un site statique GitHub Pages
const security = {
    // Validation des URLs
    validateUrl(url) {
        try {
            const urlObj = new URL(url);
            // Autoriser uniquement les URLs HTTPS vers GitHub et ses CDN
            return urlObj.protocol === 'https:' && 
                   (urlObj.hostname === 'github.com' || 
                    urlObj.hostname === 'raw.githubusercontent.com' ||
                    urlObj.hostname === 'drrakendu78.github.io');
        } catch {
            return false;
        }
    },

    // Validation des assets GitHub
    validateGithubAsset(asset) {
        return asset && 
               typeof asset === 'object' && 
               typeof asset.browser_download_url === 'string' && 
               asset.browser_download_url.startsWith('https://github.com/') &&
               asset.name.endsWith('.msi');
    }
};

// Exporter l'objet security vers window
window.security = security;