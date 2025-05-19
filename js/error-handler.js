// error-handler.js
window.errorHandler = {
    handleError(error, element) {
        const userMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        if (element) {
            element.textContent = userMessage;
            element.classList.remove('btn-success');
            element.style.backgroundColor = '#ccc';
            element.setAttribute('disabled', 'disabled');
        }
        console.error('Erreur détaillée:', error);
    },

    handleApiError(error, element) {
        let errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        
        if (error.response) {
            errorMessage = `Erreur API: ${error.response.status} - ${error.response.statusText}`;
        } else if (error.request) {
            errorMessage = 'Pas de réponse du serveur';
        } else if (error.message.includes('Network')) {
            errorMessage = 'Erreur réseau - Vérifiez votre connexion';
        } else {
            errorMessage = 'Erreur de configuration de la requête';
        }

        if (element) {
            element.textContent = errorMessage;
            element.classList.remove('btn-success');
            element.style.backgroundColor = '#ccc';
            element.setAttribute('disabled', 'disabled');
        }
        
        console.error('Erreur détaillée:', error);
    },

    validateUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'https:' && 
                   (urlObj.hostname === 'github.com' || urlObj.hostname === 'raw.githubusercontent.com');
        } catch {
            return false;
        }
    }
}
