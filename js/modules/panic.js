import { getPosition, enriquecerCentrosComDistancia } from "./geo.js";
import { tocarAlarme, pararAlarmeComClick, estaATocar } from "./audio.js";
import { saveAlerts, getAlarmePreferencial, getClientId } from "./storage.js";
import { renderState, renderizarListaPontoApoio, pontoApoioProximo } from "./ui.js";
import { inicializarPainelAjudar } from "./help.js";

let isSending = false;

export async function acionarSOS(centrosCarregados) {
    const botao = document.querySelector("#botao-sos");

    if (estaATocar()) {
        pararAlarmeComClick();
        renderState("idle");
        isSending = false;
        return;
    }

    if (botao && botao.dataset.state !== "idle" && botao.dataset.state !== "locating") {
        pararAlarmeComClick();
        renderState("idle");
        isSending = false;
        return;
    }

    if (isSending) return;

    if (getAlarmePreferencial()) {
        tocarAlarme();
    }

    isSending = true;

    try {
        renderState("locating");

        const pos = await getPosition();
        const centrosComDistancia = enriquecerCentrosComDistancia(centrosCarregados, pos);

        const containerApoio = document.querySelector("#pontos-de-apoio");
        const infoRedeEl = document.querySelector("#rede-info");

        pontoApoioProximo(centrosComDistancia, infoRedeEl, 10);
        const proximo = centrosComDistancia.filter(c => c.distanciaKm <= 10);
        renderizarListaPontoApoio(centrosComDistancia, containerApoio, 10, true);

        if (proximo.length === 0) {
            renderState("no_coverage");
        } else {
            renderState("sent");
        }

        const novoPedido = {
            id: Date.now(),
            clientId: getClientId(),
            lat: pos.lat,
            lng: pos.lng,
            precisao: pos.precisao,
            criadoEm: new Date().toISOString()
        };

        saveAlerts(novoPedido);
        inicializarPainelAjudar();

    } catch (err) {
        renderState("error", err.message);
    } finally {
        isSending = false;
    }
}