import { renderState, switchTab, renderizarListaPontoApoio, pontoApoioProximo } from "./modules/ui.js";
import { saveAlerts } from "./modules/storage.js";
import { getPosition, calcularDistanciaKm } from "./modules/geo.js";
import { tocarAlarme, pararAlarme, estaATocar, pararAlarmeComClick } from "./modules/audio.js";
import { gerirGravacaoAudio, partilharLocalizacao } from "./modules/recursos.js";
import { carregarCentrosApoio } from "./modules/api.js";

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Botões do Guia de Estados
    document.querySelectorAll("[data-estado]").forEach((btn) => {
        btn.addEventListener("click", () => renderState(btn.dataset.estado));
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

    // 4. Recursos Rápidos
    configurarRecursos();

    // 5. APENAS carrega a quantidade de centros próximos no início (uso do REDUCE)
    await atualizarCardRede();
});

async function centrosComDistancia(pos) {
    const centros = await carregarCentrosApoio();
    return centros.map((centro) => ({
        ...centro,
        distanciaKm: calcularDistanciaKm(pos.lat, pos.lng, centro.lat, centro.long)
    }));
}

// Atualiza APENAS o contador na parte superior ao abrir a app
async function atualizarCardRede() {
    const info = document.querySelector("#rede-info");
    if (!info) return;

    try {
        const pos = await getPosition();
        const centros = await centrosComDistancia(pos);

        // Executa o reduce e mostra apenas o texto com a contagem de pontos próximos
        pontoApoioProximo(centros, info);
    } catch (err) {
        info.textContent = err.message;
    }
}

async function acionarSOS() {
    const botaoSOS = document.querySelector("#botao-sos");
    const estadoAtual = botaoSOS ? botaoSOS.dataset.state : "idle";

    if (estaATocar() || estadoAtual === "sent") {
        pararAlarmeComClick();
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

        const pos = await getPosition();

        const novoPedido = {
            id: Date.now(),
            lat: pos.lat,
            lng: pos.lng,
            precisao: pos.precisao,
            criadoEm: new Date().toISOString()
        };
        saveAlerts(novoPedido);

        renderState("sent");

        // CARREGA OS CARDS (uso do MAP) APENAS APÓS SOLICITAR O HELP
        const listaCentroApoio = await centrosComDistancia(pos);
        const container = document.querySelector("#pontos-de-apoio");

        renderizarListaPontoApoio(listaCentroApoio, container);

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