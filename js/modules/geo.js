const MENSAGENS = {
    1: "Permissão de localização negada. Ativa-a nas definições do navegador.",
    2: "Não foi possível determinar a tua posição.",
    3: "A localização demorou demasiado. Tenta outra vez."
};

export function getPosition(timeout = 10000) {
    return new Promise((resolve, reject) => {
        if (!("geolocation" in navigator)) {
            reject(new Error("Este dispositivo não suporta geolocalização."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => resolve({
                lat: Number(coords.latitude.toFixed(5)),
                lng: Number(coords.longitude.toFixed(5)),
                precisao: Math.round(coords.accuracy)
            }),
            (err) => reject(new Error(MENSAGENS[err.code] ?? "Erro de localização.")),
            { enableHighAccuracy: true, timeout, maximumAge: 0 }
        );
    });
}

/**
 * Calcula a distância em quilómetros entre duas coordenadas (Latitude/Longitude)
 * utilizando a Fórmula de Haversine.
 */
export function calcularDistanciaKm(latUtilizador, lonUtilizador, latCentroApoio, lonCentroApoio) {
    const R = 6371; // Raio da Terra em km
    const dLat = (latCentroApoio - latUtilizador) * (Math.PI / 180);
    const dLon = (lonCentroApoio - lonUtilizador) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(latUtilizador * (Math.PI / 180)) *
        Math.cos(latCentroApoio * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c;

    return Number(distancia.toFixed(1));
}