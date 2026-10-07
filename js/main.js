import { renderState, switchTab } from "./modules/ui.js";
import { saveAlerts } from "./modules/storage.js";
import { getPosition } from "./modules/geo.js";
import { tocarAlarme, pararAlarme, estaATocar, pararAlarmeComClick } from "./modules/audio.js";
import { gerirGravacaoAudio, partilharLocalizacao } from "./modules/recursos.js";


let emProcessamento = false;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Configurar os botões do Guia de Estados para testes
    document.querySelectorAll("[data-estado]").forEach((btn) => {
        btn.addEventListener("click", () => {
            renderState(btn.dataset.estado);
        });
    });

    // 2. Navegação por abas
    document.querySelectorAll(".aba").forEach((aba) => {
        aba.addEventListener("click", () => {
            const panelId = aba.dataset.panel;
            if (panelId) switchTab(panelId);
        });
    });

    // 3. Botão Principal SOS
    const botaoSOS = document.querySelector("#botao-sos");
    if (botaoSOS) {
        botaoSOS.addEventListener("click", acionarSOS);
    }

    // 4. Configurar Botões dos Recursos Rápidos
    configurarRecursos();
});

async function acionarSOS() {
    const botaoSOS = document.querySelector("#botao-sos");
    const estadoAtual = botaoSOS ? botaoSOS.dataset.state : "idle";

    // Se o alarme estiver a tocar OU o pedido já tiver sido enviado, o clique cancela e reseta o estado
    if (estaATocar() || estadoAtual === "sent") {
        pararAlarme();
        renderState("idle");
        return;
    }

    const alarmeToggle = document.querySelector("#alarme-toggle");
    const alarmeAtivo = alarmeToggle ? alarmeToggle.checked : false;

    try {
        renderState("locating");

        if (alarmeAtivo) {
            tocarAlarme();
        }

        // Procura a localização real do GPS
        const pos = await getPosition();

        // Guarda o registo do pedido no LocalStorage
        const novoPedido = {
            id: Date.now(),
            lat: pos.lat,
            lng: pos.lng,
            precisao: pos.precisao,
            criadoEm: new Date().toISOString()
        };
        saveAlerts(novoPedido);

        renderState("sent");

    } catch (err) {
        console.error("Erro na geolocalização:", err.message);
        renderState("error", err.message);
        if (alarmeAtivo) {
            pararAlarme();
        }
    }
}

function configurarRecursos() {
    const botoesRecursos = document.querySelectorAll(".recurso");

    botoesRecursos.forEach((btn) => {
        const texto = btn.textContent.trim();

        if (texto.includes("Gravar Áudio")) {
            btn.addEventListener("click", () => gerirGravacaoAudio(btn));
        } else if (texto.includes("Partilhar Rota")) {
            btn.addEventListener("click", () => partilharLocalizacao());
        }
    });
}