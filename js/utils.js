// utils.js
const utils = {
    // Validation des URLs
    validateUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'https:' && 
                   (urlObj.hostname === 'github.com' || urlObj.hostname === 'raw.githubusercontent.com');
        } catch {
            return false;
        }
    },

    // Validation des assets GitHub
    validateGithubAsset(asset) {
        return asset && 
               typeof asset === 'object' && 
               typeof asset.browser_download_url === 'string' && 
               asset.browser_download_url.startsWith('https://') &&
               asset.name.endsWith('.msi');
    },

    // Validation des images
    validateImageSrc(src) {
        return this.validateUrl(src);
    },

    // Chargement sécurisé des scripts
    loadScript(src, integrity) {
        const script = document.createElement('script');
        script.src = src;
        if (integrity) {
            script.integrity = integrity;
        }
        script.crossOrigin = 'anonymous';
        script.referrerPolicy = 'strict-origin-when-cross-origin';
        document.head.appendChild(script);
    },

    // Validation des données JSON
    validateJsonData(data) {
        if (!data || typeof data !== 'object') return false;
        if (!Array.isArray(data.assets)) return false;
        if (!data.assets.every(asset => this.validateGithubAsset(asset))) return false;
        return true;
    }
};

// Exposer les utils à la fenêtre
globalThis.utils = utils;
