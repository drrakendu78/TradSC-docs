// security.js
export const security = {
    // Configuration GitHub
    github: {
        token: '',
        clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
        clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
        redirectUri: 'https://drrakendu78.github.io/TradSC-docs/callback'
    },

    // Validation des URLs
    validateUrl(url) {
        try {
            const urlObj = new URL(url);
            // Vérifier que l'URL est HTTPS
            if (urlObj.protocol !== 'https:') {
                return false;
            }
            
            // Autoriser les URLs GitHub et raw.githubusercontent.com
            const allowedHosts = [
                'github.com',
                'raw.githubusercontent.com',
                'api.github.com'
            ];
            
            // Vérifier si le hostname est dans la liste autorisée
            if (!allowedHosts.some(host => urlObj.hostname === host || urlObj.hostname.endsWith('.' + host))) {
                return false;
            }
            
            // Vérifier que le chemin commence par /drrakendu78/TradSC-docs/ pour les ressources
            if (urlObj.hostname === 'raw.githubusercontent.com' && 
                !urlObj.pathname.startsWith('/drrakendu78/TradSC-docs/')) {
                return false;
            }
            
            return true;
        } catch {
            return false;
        }
    },

    // Protection contre les attaques CSRF
    addCsrfToken() {
        const token = crypto.randomUUID();
        document.cookie = `csrf_token=${token}; Secure; SameSite=Strict`;
        return token;
    },

    verifyCsrfToken(token) {
        const storedToken = document.cookie.split('; ').find(row => row.startsWith('csrf_token='));
        return storedToken ? storedToken.split('=')[1] === token : false;
    },

    // Protection contre les attaques XSS
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    // Gestion sécurisée des erreurs
    handleError(error, element) {
        const userMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        if (element) {
            element.textContent = userMessage;
            element.classList.remove('btn-success');
            element.style.backgroundColor = '#dc3545';
            if (element.hasAttribute('disabled')) {
                element.setAttribute('disabled', 'disabled');
            }
        }
        console.error('Erreur détaillée:', error);
    },

    // Requête sécurisée
    secureFetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            try {
                // Vérifier l'URL
                if (!this.validateUrl(url)) {
                    reject(new Error('URL non sécurisée'));
                    return;
                }
                
                // Configuration des options pour GitHub API
                const fetchOptions = {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'TradSC-docs'
                    },
                    mode: 'cors',
                    credentials: 'omit'
                };

                // Pour les requêtes vers l'API GitHub, utiliser le token si disponible
                if (url.includes('api.github.com')) {
                    if (this.github.token) {
                        fetchOptions.headers['Authorization'] = 'Bearer ' + this.github.token;
                    }
                }

                fetch(url, fetchOptions)
                    .then(response => {
                        if (!response.ok) {
                            reject(new Error(`HTTP error! status: ${response.status}`));
                            return;
                        }
                        resolve(response);
                    })
                    .catch(error => {
                        this.handleError(error);
                        reject(error);
                    });
            } catch (error) {
                this.handleError(error);
                reject(error);
            }
        });
    },

    // Gestion de l'authentification GitHub
    async authenticateGitHub() {
        try {
            // Vérifier si l'utilisateur est déjà authentifié
            if (this.github.token) {
                return true;
            }

            // Rediriger vers GitHub pour l'authentification
            const authUrl = `https://github.com/login/oauth/authorize?` +
                `client_id=${this.github.clientId}&` +
                `redirect_uri=${encodeURIComponent(this.github.redirectUri)}&` +
                `scope=repo`;

            // Ouvrir une nouvelle fenêtre pour l'authentification
            const authWindow = window.open(authUrl, '_blank', 'width=600,height=800');

            // Attendre la réponse de GitHub
            const response = await new Promise((resolve) => {
                const messageHandler = (event) => {
                    if (event.origin !== 'https://drrakendu78.github.io') return;
                    
                    try {
                        const data = JSON.parse(event.data);
                        if (data.code) {
                            // Échanger le code contre un token
                            fetch('https://github.com/login/oauth/access_token', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    client_id: this.github.clientId,
                                    client_secret: this.github.clientSecret,
                                    code: data.code
                                })
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.access_token) {
                                    this.github.token = data.access_token;
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            })
                            .catch(error => {
                                console.error('Erreur lors de l\'échange du code:', error);
                                resolve(false);
                            });
                        }
                    } catch (error) {
                        resolve(false);
                    }
                };

                window.addEventListener('message', messageHandler, false);
                
                // Nettoyer l'écouteur après 5 minutes
                setTimeout(() => {
                    window.removeEventListener('message', messageHandler);
                    authWindow.close();
                }, 300000);
            });

            return response;
        } catch (error) {
            console.error('Erreur lors de l\'authentification GitHub:', error);
            return false;
        }
    },

    // Test de l'authentification GitHub
    async testAuthentication() {
        try {
            console.log('Début du test d\'authentification...');
            
            // Vérifier si déjà authentifié
            if (this.github.token) {
                console.log('Déjà authentifié avec un token valide');
                return true;
            }

            // Lancer l'authentification
            const isAuthenticated = await this.authenticateGitHub();
            
            if (isAuthenticated) {
                console.log('Authentification réussie !');
                console.log('Token obtenu:', this.github.token);
                
                // Tester une requête API
                const response = await this.secureFetch('https://api.github.com/user');
                const userData = await response.json();
                console.log('Données utilisateur:', userData);
                
                return true;
            } else {
                console.error('Authentification échouée');
                return false;
            }
        } catch (error) {
            console.error('Erreur lors du test:', error);
            return false;
        }
    }
}