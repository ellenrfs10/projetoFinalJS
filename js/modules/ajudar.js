import { loadAlerts } from "./storage.js";

/**
 * Renderiza a lista de alertas recentes e atualiza os contadores da Aba 2
 */
export function inicializarPainelAjudar() {
    const listaAlertasEl = document.querySelector("#lista-alertas");
    const totalAlertasEl = document.querySelector("#total-alertas");
    const badgeAjudaEl = document.querySelector("#badge-contador-ajuda");

    if (!listaAlertasEl) return;

    const pedidosGuardados = loadAlerts();
    const total = pedidosGuardados.length;

    // Atualiza os contadores visuais
    if (totalAlertasEl) totalAlertasEl.textContent = total;
    if (badgeAjudaEl) badgeAjudaEl.textContent = total;

    if (total === 0) {
        listaAlertasEl.innerHTML = `
            <li class="alerta">
                <p class="alerta__descricao" style="text-align: center; padding: 1rem 0;">
                    Sem pedidos de ajuda ativos de momento. A zona está segura.
                </p>
            </li>
        `;
        return;
    }

    // Mapeia e gera o HTML para cada alerta guardado
    listaAlertasEl.innerHTML = pedidosGuardados.map((p) => {
        const dataFormatada = new Date(p.criadoEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return `
            <li>
                <article class="alerta" data-id="${p.id}">
                    <p class="alerta__meta">
                        <span class="alerta__prioridade alerta__prioridade--alta">
                            <span aria-hidden="true">!</span> Prioridade Alta
                        </span>
                        <time class="alerta__tempo">${dataFormatada}</time>
                        <span class="alerta__distancia">Lat: ${p.lat.toFixed(3)}, Lng: ${p.lng.toFixed(3)}</span>
                    </p>

                    <h3 class="alerta__titulo">Pedido de Emergência SOS</h3>
                    <p class="alerta__descricao">
                        Coordenadas exatas obtidas via GPS. Precisão de <strong>${Math.round(p.precisao || 10)}m</strong>.
                    </p>

                    <button type="button" class="botao-ajudar" data-id="${p.id}" onclick="this.textContent='A Caminho ✓'; this.dataset.state='a-caminho'; this.disabled=true;">
                        Posso Ajudar
                    </button>
                </article>
            </li>
        `;
    }).join("");
}