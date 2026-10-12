import { renderState, switchTab, renderizarListaPontoApoio, pontoApoioProximo, preencherSugestoesBusca } from "./modules/ui.js";
import { saveAlerts, getAlarmePreferencial, setAlarmePreferencial } from "./modules/storage.js";
import { getPosition, calcularDistanciaKm } from "./modules/geo.js";
import { tocarAlarme, pararAlarme, estaATocar, pararAlarmeComClick } from "./modules/audio.js";
import { gerirGravacaoAudio, partilharLocalizacao } from "./modules/recursos.js";
import { carregarCentrosApoio } from "./modules/api.js";
import { inicializarPainelAjudar } from "./modules/ajudar.js";


let centrosCarregados = [];

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

    // 5. Configurar Checkbox do Alarme
    const alarmeToggle = document.querySelector("#alarme-toggle");
    if (alarmeToggle) {
        alarmeToggle.checked = getAlarmePreferencial();
        alarmeToggle.addEventListener("change", (e) => {
            setAlarmePreferencial(e.target.checked);
        });
    }

    // 6. Carrega a quantidade de centros próximos no início (reduce)
    await atualizarCardRede();

    // 7. Carrega os dados da API para o autocomplete da pesquisa
    centrosCarregados = await carregarCentrosApoio();
    preencherSugestoesBusca(centrosCarregados);

    // 8. Pesquisa em Tempo Real
    const campoPesquisa = document.querySelector("#campo-pesquisa");
    if (campoPesquisa) {
        campoPesquisa.addEventListener("input", (e) => {
            const termo = e.target.value.toLowerCase().trim();
            const container = document.querySelector("#pontos-de-apoio");

            if (!termo) {
                if (container) container.innerHTML = "";
                preencherSugestoesBusca([]);
                return;
            }

            const filtrados = centrosCarregados.filter((c) =>
                c.nome.toLowerCase().includes(termo) ||
                c.distrito.toLowerCase().includes(termo) ||
                c.tipo.toLowerCase().includes(termo)
            );

            preencherSugestoesBusca(filtrados);

            renderizarListaPontoApoio(filtrados, container, 10, false);

        
        });
    }

    inicializarPainelAjudar();
});

async function centrosComDistancia(pos) {
    const centros = await carregarCentrosApoio();
    return centros.map((centro) => ({
        ...centro,
        distanciaKm: calcularDistanciaKm(pos.lat, pos.lng, centro.lat, centro.long)
    }));
}

async function atualizarCardRede() {
    const info = document.querySelector("#rede-info");
    if (!info) return;

    try {
        const pos = await getPosition();
        const centros = await centrosComDistancia(pos);
        pontoApoioProximo(centros, info);
    } catch (err) {
        info.textContent = err.message;
    }
}

async function acionarSOS() {
    const botaoSOS = document.querySelector("#botao-sos");
    const estadoAtual = botaoSOS ? botaoSOS.dataset.state : "idle";

    if (estaATocar() || estadoAtual === "sent" || estadoAtual === "no_coverage") {
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

        /* renderState("sent"); */

        const listaCentroApoio = await centrosComDistancia(pos);
        const proximos = listaCentroApoio.filter((c) => c.distanciaKm <=10);

        const container = document.querySelector("#pontos-de-apoio");
        renderizarListaPontoApoio(proximos, container, 10, true);      
        
        if(proximos.length === 0) {
            renderState("no_coverage");
        } else{
            renderState("sent");
        }

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