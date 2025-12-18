
/**
 * Utilitaire de conversion
 * cette fonction va convertir les valeurs ex: km/h ect....
*/

/**
 * Méthode qui formate la température
 * @param {number|undefined|null} value 
 * @return {string} température formatée (ex: 25°C)
 */
export const formatTemperature = (value) => {
    if (value === undefined || value === null) return '-';

    return `${Math.round(value)}°C`;
}

/**
 * Méthode qui convertie les m/s en km/h
 * @param {number|undefined|null} value 
 * @return {string} vitesse formatée 
 */
export const formatWindSpeed = (value) => {
    if (value === undefined || value === null) return '-';
    
    return `${Math.round(value * 3.6)}km/h`

}

/**
 * Méthode qui formate un timestamp en heure 
 * @param {number|undefined|null} value 
 * @return {string} heure formatée (ex: 08:00)
 */
export const formatTimestamp = (timestamp) => {
    if (timestamp === undefined || timestamp === null) return '-';

    const date = new Date(timestamp * 1000);

    return date.toLocaleDateString("fr-FR", {hour: '2-digit', minute: '2-digit'})
}