// Gestionnaire de dépendances sécurisées
window.dependencyManager = {
    // Vérification des dépendances
    async checkDependencies() {
        try {
            // Vérifier si npm est installé
            if (!this.isNpmInstalled()) {
                throw new Error('npm n\'est pas installé');
            }

            // Lire le package.json
            const packageJson = await this.readPackageJson();
            
            // Vérifier les dépendances
            const vulnerabilities = await this.checkForVulnerabilities(packageJson);
            
            // Mettre à jour les dépendances si nécessaire
            if (vulnerabilities.length > 0) {
                await this.updateDependencies(packageJson, vulnerabilities);
            }

            // Vérifier les versions
            await this.checkVersions(packageJson);

            return {
                success: true,
                message: 'Vérification des dépendances terminée avec succès'
            };
        } catch (error) {
            console.error('Erreur lors de la vérification des dépendances:', error);
            return {
                success: false,
                message: 'Erreur lors de la vérification des dépendances',
                error: error.message
            };
        }
    },

    // Vérification de l'installation de npm
    isNpmInstalled() {
        try {
            return !!require('child_process').execSync('npm --version');
        } catch {
            return false;
        }
    },

    // Lecture du package.json
    async readPackageJson() {
        try {
            const fs = require('fs').promises;
            const data = await fs.readFile('package.json', 'utf8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error('Erreur lors de la lecture de package.json');
        }
    },

    // Vérification des vulnérabilités
    async checkForVulnerabilities(packageJson) {
        try {
            const { execSync } = require('child_process');
            const result = execSync('npm audit').toString();
            return result.includes('found') ? result : [];
        } catch (error) {
            throw new Error('Erreur lors de la vérification des vulnérabilités');
        }
    },

    // Mise à jour des dépendances
    async updateDependencies(packageJson, vulnerabilities) {
        try {
            const { execSync } = require('child_process');
            
            // Mettre à jour les dépendances vulnérables
            execSync('npm audit fix');
            
            // Vérifier les dépendances obsolètes
            const outdated = execSync('npm outdated').toString();
            
            // Mettre à jour les dépendances obsolètes
            if (outdated) {
                execSync('npm update');
            }
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour des dépendances');
        }
    },

    // Vérification des versions
    async checkVersions(packageJson) {
        try {
            const allowedDependencies = securityConfig.dependencies.allowedDependencies;
            
            // Vérifier chaque dépendance
            for (const dependency of Object.keys(packageJson.dependencies)) {
                if (!allowedDependencies.includes(dependency)) {
                    throw new Error(`Dépendance non autorisée: ${dependency}`);
                }
            }
        } catch (error) {
            throw new Error('Erreur lors de la vérification des versions');
        }
    }
};