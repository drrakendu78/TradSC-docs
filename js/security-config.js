// Configuration de sécurité
window.securityConfig = {
    // Configuration HSTS
    hsts: {
        maxAge: 31536000, // 1 an en secondes
        includeSubDomains: true,
        preload: true
    },

    // Configuration des headers de sécurité
    headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': `
            default-src 'self';
            script-src 'self' 'unsafe-inline' https://api.github.com;
            connect-src 'self' https://api.github.com;
            img-src 'self' https: data:;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
            font-src 'self' https://fonts.gstatic.com;
            object-src 'none';
            media-src 'self';
            frame-src 'none';
            child-src 'none';
            form-action 'self';
            base-uri 'self';
            manifest-src 'self';
            worker-src 'self';
            upgrade-insecure-requests;
            block-all-mixed-content;
        `
    },

    // Configuration des dépendances
    dependencies: {
        // Liste des dépendances autorisées
        allowedDependencies: [
            'vite',
            'vue',
            '@vue/compiler-sfc'
        ],

        // Configuration des versions
        versionPolicy: {
            major: 'patch', // Seules les mises à jour de correction de bugs sont autorisées
            minor: 'patch', // Seules les mises à jour de correction de bugs sont autorisées
            patch: 'auto' // Mises à jour automatiques autorisées
        },

        // Configuration des vérifications de sécurité
        securityChecks: {
            enabled: true,
            frequency: 'daily', // Vérifications quotidiennes
            autoUpdate: true, // Mises à jour automatiques des dépendances vulnérables
            maxAge: 30 // Les dépendances plus vieilles que 30 jours sont considérées comme obsolètes
        }
    },

    // Configuration du développement
    development: {
        // Configuration pour le développement local
        localDevelopment: {
            disableHSTS: true,
            disableSecurityHeaders: false,
            allowInsecureRequests: true
        },

        // Configuration pour les tests
        testing: {
            mockAPI: true,
            disableCSRF: true,
            allowLocalhost: true
        }
    }
};