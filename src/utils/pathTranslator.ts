/**
 * Traduce un segmento de la URL a un texto legible para el usuario.
 * @param {string} pathSegment - El segmento de la ruta (ejemplo: "profile").
 * @returns {string} El texto traducido (ejemplo: "Gestión de Heladerías").
 */
export const translatePath = (pathSegment: string): string => {
    switch (pathSegment.toLowerCase()) {
        case 'ice-cream-shop':
            return 'Gestión de Heladerías';
        case 'profile':
            return 'Perfil de Usuario';
        case 'ingredients-page':
            return 'Gestión de Ingredientes';
        case 'products':
            return 'Gestión de Productos';
        case 'purchases':
            return 'Gestión de Compras';
        default:
            // Como fallback, capitalizamos el segmento
            return pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);
    }
};