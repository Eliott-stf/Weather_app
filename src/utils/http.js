/**
 * Utilitaire http: construire l'url avec paramètres de requete (query string)
 * cette fonction va transformer un objet JS en paramètre d'url 
 * on va récup les data pour les mettre dans l'URL générique 
 */

/**
 * méthode qui reconstruit une url en get grace a un objet 
 * @param {string} baseUrl
 * @param {Object} params
 * @returns {string} URL complète avec paramètres 
 */

export function buildUrl(baseUrl, params = {}){
    //on transfomre notre objet params en tab de clé valeur ["e" => 'e']
    const entries = Object.entries(params).filter(([, value])=> value !== undefined && value !== '')

    //si aucun paramètres valide, on retourne l'url de base telle quelle
    if(!entries.length) return baseUrl;

    //transformation de chaque [clé, valeur] en chaine "clé=valeur" encodé pour l'url
    const query = entries
    .map(([key, value])=> `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

    //on retourne l'url reconstruite avec ces paramètres 
    return `${baseUrl}?${query}`;
}