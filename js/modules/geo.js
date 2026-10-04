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