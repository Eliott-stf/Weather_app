/**
 * Service météo
 * 
 * Gère les appels d'API sur OpenWeather
 */

import { buildUrl } from "../utils/http.js"

export class WeatherService {
    //Champ privé pour stocker la clé d'api
    #apiKey;
    //Champs privé pour les options par défaut
    #baseOptions;

    constructor(apiKey) {
        this.#apiKey = apiKey;
        this.#baseOptions = {
            units: "metric",
            lang: "fr"
        }
    }

    /**
     * Récupère les données météo actuelles pour une localisation
     * @param {Object} params ex: {q: "perpi"} ou {lat: 48.6577, lon: 5.1847}
     * @return {Promise<Object>}
     * - {ok: true, data: {...}}
     * - {ok: false, error: "message"}
     */
    async getCurrent(params) {
        //on vérifie qu'on a bien la clé api
        if (!this.#apiKey) {
            return {
                ok: false,
                error: "Aucune clé API. Définisez VITE_OPENWEATHER_KEY dans .env"
            }
        }

        //on a bien la clé d'api, on fusionne les options: baseOptions + params + clé d'api
        const query = { ...this.#baseOptions, ...params, appid: this.#apiKey }

        // on construit l'url avec ses paramètres 
        const url = buildUrl("https://api.openweathermap.org/data/2.5/weather", query)

        try {
            //on passe la requete avec fetch()
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                return {
                    ok: false,
                    error: data?.message || "Erreur API."
                }
            }

            //succès: on retourne les données
            return{ok: true,data}

        } catch (error) {
            return{ok: false, error: error.message}
        }
    }

}