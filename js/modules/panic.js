import { getPosition, calcularDistanciaKm } from "./geo.js";
import { tocarAlarme, pararAlarmeComClick, estaATocar } from "./audio.js";
import { saveAlerts, getAlarmePreferencial } from "./storage.js";
import { renderState, renderizarListaPontoApoio, pontoApoioProximo } from "./ui.js";
import { inicializarPainelAjudar } from "./ajudar.js";

export async function acionarSOS(centrosCarregados) {
    const botao = document.querySelector("#botao-sos");

    // 1. Se o alarme já estiver a tocar OU o botão estiver num estado ativo/locating, o clique interrompe e reseta tudo
    if (estaATocar() || (botao && botao.dataset.state !== "idle")) {
        pararAlarmeComClick();
        renderState("idle");
        return;
    }

    // 2. DISPARA O ALARME IMEDIATAMENTE AO CLICAR (independentemente do GPS)
    if (getAlarmePreferencial()) {
        tocarAlarme();
    }

    try {
        // 3. Muda o estado visual para "A localizar" enquanto obtém o GPS em segundo plano
        renderState("locating");

        const pos = await getPosition();

        const centrosComDistancia = centrosCarregados.map((centro) => ({
            ...centro,
            distanciaKm: calcularDistanciaKm(pos.lat, pos.lng, centro.lat, centro.long)
        }));

        const containerApoio = document.querySelector("#pontos-de-apoio");
        const infoRedeEl = document.querySelector("#rede-info");

        // Atualiza o cartão inicial e a lista de apoio
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
            lat: pos.lat,
            lng: pos.lng,
            precisao: pos.precisao,
            criadoEm: new Date().toISOString()
        };

        saveAlerts(novoPedido);
        inicializarPainelAjudar();

    } catch (err) {
        renderState("error", err.message);
    }
}