(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function s(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(r){if(r.ep)return;r.ep=!0;const n=s(r);fetch(r.href,n)}})();window.securityConfig={hsts:{maxAge:31536e3,includeSubDomains:!0,preload:!0},headers:{"X-Frame-Options":"DENY","X-Content-Type-Options":"nosniff","X-XSS-Protection":"1; mode=block","Referrer-Policy":"strict-origin-when-cross-origin","Content-Security-Policy":`
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
        `},dependencies:{allowedDependencies:["vite","vue","@vue/compiler-sfc"],versionPolicy:{major:"patch",minor:"patch",patch:"auto"},securityChecks:{enabled:!0,frequency:"daily",autoUpdate:!0,maxAge:30}},development:{localDevelopment:{disableHSTS:!0,disableSecurityHeaders:!1,allowInsecureRequests:!0},testing:{mockAPI:!0,disableCSRF:!0,allowLocalhost:!0}}};window.dependencyManager={async checkDependencies(){try{if(!this.isNpmInstalled())throw new Error("npm n'est pas installé");const t=await this.readPackageJson(),e=await this.checkForVulnerabilities(t);return e.length>0&&await this.updateDependencies(t,e),await this.checkVersions(t),{success:!0,message:"Vérification des dépendances terminée avec succès"}}catch(t){return console.error("Erreur lors de la vérification des dépendances:",t),{success:!1,message:"Erreur lors de la vérification des dépendances",error:t.message}}},isNpmInstalled(){try{return!!require("child_process").execSync("npm --version")}catch{return!1}},async readPackageJson(){try{const e=await require("fs").promises.readFile("package.json","utf8");return JSON.parse(e)}catch{throw new Error("Erreur lors de la lecture de package.json")}},async checkForVulnerabilities(t){try{const{execSync:e}=require("child_process"),s=e("npm audit").toString();return s.includes("found")?s:[]}catch{throw new Error("Erreur lors de la vérification des vulnérabilités")}},async updateDependencies(t,e){try{const{execSync:s}=require("child_process");s("npm audit fix"),s("npm outdated").toString()&&s("npm update")}catch{throw new Error("Erreur lors de la mise à jour des dépendances")}},async checkVersions(t){try{const e=securityConfig.dependencies.allowedDependencies;for(const s of Object.keys(t.dependencies))if(!e.includes(s))throw new Error(`Dépendance non autorisée: ${s}`)}catch{throw new Error("Erreur lors de la vérification des versions")}}};
