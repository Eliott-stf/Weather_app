import { WeatherService } from "./services/weather-service.js";
import { formatTemperature, formatTimestamp, formatWindSpeed } from "./utils/formatters.js";

export class App {

    //Propriété privé : stocke l'élément DOM racine ou l'app sera rendu 
    #root;

    //Propriété privé : stocke l'instance du service météo (géré les appels API)
    #service;

    //Propriété privé : état interne de l'application (loading, erreurs, resultat)
    #state = {
        loading: false,
        error: '',
        lastResult: null
    }

    constructor(rootElement) {
        this.#root = rootElement;

        const apiKey = import.meta.env.VITE_OPENWEATHER_KEY; // on récup la donnée (api_key) dans le .env
        if (!apiKey || apiKey === 'VOTRE_API_KEY') {
            console.error("VITE_OPENWEATHER_KEY non défini ou invalide.")
        }

        //Service dédié aux appels réseau, isolé du rendu 
        this.#service = new WeatherService(apiKey);
    }

    //méthode pour faire le rendu 
    #render() {
        //on vide le contenu HTML
        this.#root.innerHTML = '';

        //contenaire principale de la page avec class tailwind
        const page = document.createElement("div");
        page.className = "mx-auto max-w-[920px] px-6 pb-12 pt-8"
        //carte principale
        const card = document.createElement("div");
        card.className = "rounded-xl border border-border-light bg-bg-primary p-6 shadow-md"
        card.innerHTML = `
        <h1 class=" mb-2 text-3xl font-bold">Météo</h1>
        <p class="mb-6 text-text-secondary">Cherchez par ville ou par coordonnées géographiques.</p>
        `;

        //Formulaire
        const form = document.createElement("form");
        form.className = "space-y-6";
        form.addEventListener('submit', this.#handleSubmit.bind(this));

        //section 1 du formulaire : Recherche par ville
        const citySection = document.createElement("div");
        citySection.className = "rounded-lg border-2 border-dashed border-border-light bg-bg-secondary/50 p-5 transition-all duration-300 ease-out hover:border-primary-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        citySection.innerHTML = `
        <div class="mb-3 flex items-center gap-2">
            <svg class ="h-5 w-5 text-primary-500 " xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><defs><mask id="SVGOL58XdYm"><g fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="4"><path stroke-linecap="round" d="M4 42h40"/><rect width="12" height="20" x="8" y="22" fill="#555" rx="2"/><rect width="20" height="38" x="20" y="4" fill="#555" rx="2"/><path stroke-linecap="round" d="M28 32.008h4m-20 0h4m12-9h4m-4-9h4"/></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#SVGOL58XdYm)"/></svg> 
            <h2 class="text-base font-semibold text-text-primary">Recherche par ville</h2>     
        </div>

        <div class="space-y-2">
            <label for="city" class="block text-sm font-medium text-text-secondary" >Nom de la ville</label>
            <input 
                id= "city"
                name = "city"
                type = "text"
                placeholder = "Ex : Tokyo.."
                autocomplete = "off"
                class = "w-full rounded-lg border border-border-medium bg-white px-4 py-3 text-sm transition-all placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-1"
            >

            <p class="text-xs text-text-muted">Saississez le nom d'un ville pour obtenir sa météo</p>
        </div>
        `;

        //séparateur visuel "OU"
        const separator = document.createElement("div");
        separator.className = "relative"
        separator.innerHTML = `
            <div class="absolute inset-0 flex items-center">
                <div class=" w-full border-t border-border-medium"></div>
            </div>

            <div class= "relative flex justify-center text-sm">
                <span class="bg-bg-primary px-4 text-text-muted">OU</span>
            </div>
        `;

        //Section 2. Recherche par coordonnéees
        const coordsSection = document.createElement("div");
        coordsSection.className = "rounded-lg border-2 border-dashed border-border-light bg-bg-secondary/50 p-5 transition-all duration-300 ease-out hover:border-primary-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        coordsSection.innerHTML = `
        <div class="mb-3 flex items-center gap-2">
            <svg class ="h-5 w-5 text-primary-500 "xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="M128 60a44 44 0 1 0 44 44a44.05 44.05 0 0 0-44-44m0 64a20 20 0 1 1 20-20a20 20 0 0 1-20 20m0-112a92.1 92.1 0 0 0-92 92c0 77.36 81.64 135.4 85.12 137.83a12 12 0 0 0 13.76 0a259 259 0 0 0 42.18-39C205.15 170.57 220 136.37 220 104a92.1 92.1 0 0 0-92-92m31.3 174.71a249.4 249.4 0 0 1-31.3 30.18a249.4 249.4 0 0 1-31.3-30.18C80 167.37 60 137.31 60 104a68 68 0 0 1 136 0c0 33.31-20 63.37-36.7 82.71"/></svg>
            <h2 class="text-base font-semibold text-text-primary">Recherche par coordonnées</h2>     
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 ">
            <div class="space-y-2">
                <label for="lat" class="block text-sm font-medium text-text-secondary" >Latitude
                    <span class="ml-1 text-xs text-text-muted">(-90 à 90)</span>
                </label>

                <input 
                 id= "lat"
                 name = "lat"
                 type = "number"
                 placeholder = "Ex : 35.6296"
                 autocomplete = "off"
                 step="any"
                 inputmode="decimal"
                 min="-90"
                 max="90"
                 class = "w-full rounded-lg border border-border-medium bg-white px-4 py-3 text-sm transition-all placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-1"
                >
            </div>

             <div class="space-y-2">
                <label for="lon" class="block text-sm font-medium text-text-secondary" >Longitude
                    <span class="ml-1 text-xs text-text-muted">(-180 à 180)</span>
                </label>

                <input 
                 id= "lon"
                 name = "lon"
                 type = "number"
                 placeholder = "Ex : 139.6716"
                 autocomplete = "off"
                 step="any"
                 inputmode="decimal"
                 min="-180"
                 max="180"
                 class = "w-full rounded-lg border border-border-medium bg-white px-4 py-3 text-sm transition-all placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-1"
                >
            </div>
        </div>
         <p class=" mt-2 text-xs text-text-muted">Saississez les coordonnées GPS pour obtenir la météo d'un lieu précis</p>
        `;

        //on imbrique les different unput et séparateur dans le form
        form.append(citySection, separator, coordsSection);

        //Conteneur des boutons 
        const actions = document.createElement("div");
        actions.className = "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end";

        //Bouton secondaire (effacer)
        const clear = document.createElement("button");
        clear.type = "button";
        clear.className = "flex items-center justify-center gap-2 rounded-lg border border-border-medium bg-white px-6 py-3 text-sm font-semibold text-text-primary transition-all hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600 active:scale-95"
        clear.innerHTML = `
            <svg class ="h-5 w-5 text-red-500 " xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M7.293 8L3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293l4.146-4.147a.5.5 0 0 1 .708.708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708z"/></svg>
            <span>Effacer </span>
        `;
        clear.addEventListener("click", () => {
            form.reset();
            this.#setState({error: '', lastResult: null});
        });

        //Bouton principal (Afficher la météo)
        const submit = document.createElement("button");
        submit.type = "submit";
        submit.className = "group flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-primary-500/25 transition-all hover:-translate-y-0.5 hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:shadow-primary-500/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        submit.disabled = this.#state.loading;

        if (this.#state.loading) {
            submit.innerHTML = `
            <svg class ="h-5 w-5 transition-transform group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c4.97 0 9 4.03 9 9"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
            <span>Chargement...</span>
            `;
        } else {
            submit.innerHTML = `
           <svg class="h-5 w-5 transition-transform group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M10.464 15.748L12.7 13.26a.75.75 0 0 1 1.184.915l-.068.088l-1.111 1.236h2.276a.75.75 0 0 1 .645 1.134l-.058.084l-3.212 4.031a.75.75 0 0 1-1.236-.843l.063-.091l2.242-2.815h-2.403a.75.75 0 0 1-.623-1.168zL12.7 13.26zm2.538-10.74c3.168 0 4.966 2.098 5.227 4.631h.08a3.687 3.687 0 0 1 3.692 3.683a3.687 3.687 0 0 1-3.692 3.682l-1.788.001a1.33 1.33 0 0 0-.002-1.5l1.734.002c1.261 0 2.283-1.002 2.283-2.237s-1.022-2.236-2.283-2.236h-.69c-.366 0-.685-.28-.685-.638c0-2.285-1.805-3.89-3.876-3.89c-2.072 0-3.877 1.634-3.877 3.89c0 .357-.319.638-.684.638h-.69c-1.262 0-2.284 1-2.284 2.236c0 1.235 1.022 2.237 2.283 2.237l1.762-.001a1.33 1.33 0 0 0-.002 1.5l-1.816-.002a3.687 3.687 0 0 1-3.692-3.682a3.687 3.687 0 0 1 3.692-3.683h.08c.263-2.55 2.06-4.63 5.228-4.63M10 2c1.617 0 3.05.815 3.9 2.062a8 8 0 0 0-.898-.053q-.593 0-1.139.085a3.22 3.22 0 0 0-5.032 2.062l-.073.414a1 1 0 0 1-.985.827h-.49a1.782 1.782 0 0 0-1.264 3.04c-.315.4-.565.855-.735 1.347a3.282 3.282 0 0 1 1.812-5.881l.257-.006A4.72 4.72 0 0 1 10 2"/></svg>
            <span>Afficher la météo</span>
            `;
        }

        actions.append(clear, submit);
        form.append(actions);
        card.append(form, this.#renderResult());
        page.append(card);
        this.#root.append(page);
    }

    /**
     * méthode pour mettre a jour le state 
     * @param {Object} next
     */
    #setState(next) {
        this.#state = { ...this.#state, ...next }
        this.#render();
    }

    /**
     * Méthode privée : gère la soumission du formulaire 
     * @param {Event} event - Evenement de soumission du formulaire 
     */
    async #handleSubmit(event) {
        //on désactive le comportement naturel du formulaire 
        event.preventDefault();
        const form = new FormData(event.target);
        const city = form.get('city').trim();
        const lat = form.get('lat').trim();
        const lon = form.get('lon').trim();
        console.log("Form data:", { city, lat, lon });

        if (!city && (!lat || !lon)) {
            this.#setState({ error: "Renseignez une ville ou un couple de coordonnées", lastResult: null });
            return;
        }

        this.#setState({ loading: true, error: '', lastResult: null })

        const search = city ? { q: city } : { lat, lon }
        console.log("Search param:", search);
        const response = await this.#service.getCurrent(search);
        console.log("Response API:", response);

        if (!response.ok) {
            this.#setState({ loading: false, error: response.error || "Erreur inconnue" });
            return;
        }

        this.#setState({ loading: false, error: '', lastResult: response.data });
        console.log("Etat du state: ", this.#state);


    }

    /**
     * méthode privée : créer un bloc métrique réutilisable (température, vent, etc..)
     * @param {string} title
     * @param {string} content
     * @return {HTMLElement}
     */
    #renderMetric(content, title) {
        const block = document.createElement("div");
        block.className = "rounded-lg border border-border-light bg-bg-secondary p-4";
        block.innerHTML = `
        <h4 class="mb-2 text-base font-semibold">${title}</h4>${content}`;
        return block;
    }

    /**
    * Méthode privée : convertit les dégreés (0-360) en direction cardinale 
    @param {number |undefined|null} deg 
    @return {string} Direction cardinale 
    */
    #directionFromDegrees(deg) {
        if (deg === undefined || deg === null) return "-";

        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
        const index = Math.round(deg / 45);
        return directions[index];
    }

    /**
     * méthode privée: génère et retourne l'affichage des résultat météo 
     * 
     * @return {HTMLElement}
     */
    #renderResult() {
        //conteneur principal du résultat
        const container = document.createElement("div");
        container.className = "mt-6 grid gap-4"

        //si loading = true
        if (this.#state.loading) {
            //message de chargement 
            container.innerHTML = `<p class="mt-4 text-sm text-text-secondary">Chargement...</p>`
            return container;
        }

        //si il y a des erreurs
        if (this.#state.error) {
            container.innerHTML = `<div class="py-3 px-6 rounded-lg border border-error-border bg-error-light text-error">${this.#state.error === 'city not found' ? 'Ville non trouvée': `${this.#state.error}`}</div>`
            return container;
        }

        //si lastResult = null
        if (!this.#state.lastResult) {
            container.innerHTML = `<p class="italic text-text-muted">Aucun résultat pour l'instant</p>`
            return container;
        }

        //on traite la réponse de l'API
        const data = this.#state.lastResult;
        const weather = data?.weather?.[0];
        const main = data?.main || {};
        const wind = data?.wind || {};
        const sys = data?.sys || {};
        const imgUrl = 'https://openweathermap.org/img/wn';

        //En-tête avec les informations principales 
        const header = document.createElement("div");
        header.className = "rounded-lg border border-border-light bg-bg-secondary p-4";
        header.innerHTML = `
            <div class ="flex w-full items-center justify-between">
                <div>
                    <h4 class =""> ${data?.name || 'Ville inconnue'} ${sys.country ? `, ${sys.country}` : ''}</h4>

                    <div class =" text-text-secondary">
                        ${weather?.description || '-'}
                    </div>
                </div>

                ${weather?.icon ? `<img src="${imgUrl}/${weather.icon}@2x.png" alt="${weather.description}" width="64" height="64" >` : ''}
            </div>

            <div class="mt-3 flex flex-wrap gap-2">
                <span class= "inline-flex items-center gap-1.5 rounded-full border-primary-500 bg-white px-2.5 py-1.5 text-xs text-primary-700">Temp: ${formatTemperature(main?.temp)}</span>

                <span class= "inline-flex items-center gap-1.5 rounded-full border-border-medium bg-white px-2.5 py-1.5 text-xs ">Ressenti: ${formatTemperature(main?.feels_like)}</span>

                <span class= "inline-flex items-center gap-1.5 rounded-full border-success bg-white px-2.5 py-1.5 text-xs text-success-dark">Humidité: ${main?.humidity ?? '-'}%</span>

                <span class= "inline-flex items-center gap-1.5 rounded-full border-warning bg-white px-2.5 py-1.5 text-xs text-warning-dark">Pression: ${main?.pressure ?? '-'}hPa</span>
            </div>
        `;

        //grille responsive pour les métriques 
        const grid = document.createElement("div")
        grid.className = "grid grid-cols-1 gap-4 md:grid-cols-2";
        grid.appendChild(this.#renderMetric("Température", `
            <div class="text-text-secondary">Min: ${formatTemperature(main?.temp_min)} / Max: ${formatTemperature(main?.temp_max)}</div>
        `))

        grid.appendChild(this.#renderMetric("Vent", `
            <div class="text-text-secondary">Vitesse: ${formatWindSpeed(wind?.speed)}</div>
            <div class="text-text-secondary">Direction du vent: ${this.#directionFromDegrees(wind?.deg)}</div>
            <div class="text-text-secondary">Rafales: ${formatWindSpeed(wind?.gust)}</div>
        `))

        grid.appendChild(this.#renderMetric("Visibilité", `
            <div class="text-text-secondary">${(data?.visibility ?? 0) / 1000}km</div>
        `))

        grid.appendChild(this.#renderMetric("Soleil", `
            <div class="text-text-secondary">Lever: ${formatTimestamp(sys?.sunrise)}</div>
            <div class="text-text-secondary">Coucher: ${formatTimestamp(sys?.sunset)}</div>
        `))

        if (data?.rain?.['1h'] || data?.snow?.['1h']) {
            const type = data?.rain ? 'Pluie' : 'Neige';
            const amount = data?.rain?.['1h'] || data?.snow?.['1h'];
            grid.appendChild(this.#renderMetric("Précipitation", `
                <div class="text-text-secondary">${type} (1h): ${amount}mm</div>
            `))
        }

        container.append(header, grid);
        return container;
    }


    //méthode pour appeler la méthode   
    mount() {
        this.#render();
    }

}