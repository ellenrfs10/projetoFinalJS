import { renderState, switchTab, renderizarListaPontoApoio, preencherSugestoesBusca, pontoApoioProximo } from "./modules/ui.js";
import { getAlarmePreferencial, setAlarmePreferencial } from "./modules/storage.js";
import { carregarCentrosApoio } from "./modules/api.js";
import { gerirGravacaoAudio, partilharLocalizacao } from "./modules/recursos.js";
import { inicializarPainelAjudar } from "./modules/ajudar.js";
import { acionarSOS } from "./modules/panic.js";
import { getPosition, calcularDistanciaKm } from "./modules/geo.js";

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
        botaoSOS.addEventListener("click", () => acionarSOS(centrosCarregados));
    }

    // 4. Recursos Rápidos (Áudio e Partilha)
    const btnAudio = document.querySelector("#btn-gravar-audio");
    if (btnAudio) btnAudio.addEventListener("click", () => gerirGravacaoAudio(btnAudio));

    const btnPartilhar = document.querySelector("#btn-partilhar-rota");
    if (btnPartilhar) btnPartilhar.addEventListener("click", partilharLocalizacao);

    // 5. Configurar Checkbox do Alarme
    const alarmeToggle = document.querySelector("#alarme-toggle");
    if (alarmeToggle) {
        alarmeToggle.checked = getAlarmePreferencial();
        alarmeToggle.addEventListener("change", (e) => {
            setAlarmePreferencial(e.target.checked);
        });
    }

    // 6. Carrega os dados da API para o autocomplete e funcionamento geral
    centrosCarregados = await carregarCentrosApoio();
    preencherSugestoesBusca(centrosCarregados);

    // 7. Calcula e preenche o card "Rede Protetora Disponível" logo no início
    try {
        const pos = await getPosition();
        const infoRedeEl = document.querySelector("#rede-info");
        if (infoRedeEl && centrosCarregados.length > 0) {
            const centrosComDistancia = centrosCarregados.map((c) => ({
                ...c,
                distanciaKm: calcularDistanciaKm(pos.lat, pos.lng, c.lat, c.long)
            }));
            pontoApoioProximo(centrosComDistancia, infoRedeEl, 10);
        }
    } catch (err) {
        const infoRedeEl = document.querySelector("#rede-info");
        if (infoRedeEl) infoRedeEl.textContent = "Não foi possível obter a localização para calcular centros próximos.";
    }

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

    // 9. Inicializa e preenche os alertas na Aba 2
    inicializarPainelAjudar();
});