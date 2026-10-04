import { renderState, switchTab } from "./modules/ui.js";
import { saveAlerts, loadAlerts, removeAlerts } from "./modules/storage.js";

// Inicializa o estado base quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    // 1. Configurar os botões do Guia de Estados para testes
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

    // 3. Exemplo de evento no botão principal SOS
    const botaoSOS = document.querySelector("#botao-sos");
    if (botaoSOS) {
        botaoSOS.addEventListener("click", () => {
            // Mudar para o estado "A obter localização"
            renderState("locating");

            // Simular o envio com temporizador (substituir futuramente por chamada de API/GPS)
            setTimeout(() => {
                const novoPedido = {
                    id: Date.now(),
                    lat: 41.15,
                    lng: -8.61,
                    criadoEm: new Date().toISOString()
                };

                saveAlerts(novoPedido);
                renderState("sent");
            }, 2000);
        });
    }
});