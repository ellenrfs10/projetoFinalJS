import { renderState, switchTab } from "./modules/ui.js";
import { saveAlerts, loadAlerts, removeAlerts } from "./modules/storage.js";
import { getPosition } from "./modules/geo.js";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Configurar os botões do Guia de Estados para testes manuais
    document.querySelectorAll("[data-estado]").forEach((btn) => {
        btn.addEventListener("click", () => {
            renderState(btn.dataset.estado);
        });
    });

    // 2. Configurar a navegação por abas
    document.querySelectorAll(".aba").forEach((aba) => {
        aba.addEventListener("click", () => {
            const panelId = aba.dataset.panel;
            if (panelId) switchTab(panelId);
        });
    });

    // 3. Evento no botão principal SOS com GPS real
    const botaoSOS = document.querySelector("#botao-sos");
    if (botaoSOS) {
        botaoSOS.addEventListener("click", acionarSOS);
    }
});

/**
 * Função responsável por acionar o pedido SOS e obter a localização real do GPS
 */
async function acionarSOS() {
    try {
        // Coloca o botão no estado "A obter localização"
        renderState("locating");

        // Obtém as coordenadas reais através do módulo geo.js
        const pos = await getPosition();
        console.log("Posição obtida com sucesso:", pos);

        // Cria o objeto do pedido com os dados reais
        const novoPedido = {
            id: Date.now(),
            lat: pos.lat,
            lng: pos.lng,
            precisao: pos.precisao,
            criadoEm: new Date().toISOString()
        };

        // Guarda o pedido no LocalStorage
        saveAlerts(novoPedido);

        // Atualiza a interface para o estado "Enviado"
        renderState("sent");

    } catch (err) {
        console.error("Erro ao obter geolocalização:", err.message);
        // Em caso de erro/recusa de GPS, altera o estado e exibe a mensagem de erro detalhada
        renderState("error", err.message);
    }
}