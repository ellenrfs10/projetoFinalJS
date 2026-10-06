const ESTADOS = {
    idle: {
        titulo: "HELP",
        sub: "Tocar para acionar",
        mensagem: "O teu pedido será enviado instantaneamente para protetoras e voluntárias num raio de <strong>10 km</strong>.",
        desativado: false
    },
    locating: {
        titulo: "A obter a localização",
        sub: "",
        mensagem: "Mantém o ecrã aberto, é só um momento.",
        desativado: true
    },
    sent: {
        titulo: "HELP ENVIADO!",
        sub: "",
        mensagem: "Pedido enviado. Caso seja necessário, liga 112 no botão abaixo.",
        desativado: true
    },
    error: {
        titulo: "Tentar de novo",
        sub: "",
        mensagem: "Não foi possível enviar o pedido.",
        desativado: false
    }
};

/**
 * Atualiza o estado visual do botão e a mensagem do SOS.
 * @param {string} estado - Nome do estado ('idle', 'locating', 'sent', 'error')
 * @param {string} [detalhe=""] - Mensagem personalizada opcional
 */
export function renderState(estado, detalhe = "") {
    const botao = document.querySelector("#botao-sos");
    const texto = document.querySelector(".botao-sos__texto");
    const sub = document.querySelector(".botao-sos__sub");
    const mensagem = document.querySelector("#estado-sos");

    const config = ESTADOS[estado] || ESTADOS.idle;

    if (botao) {
        botao.dataset.state = estado;
        botao.disabled = config.desativado;
    }

    if (texto) {
        texto.textContent = config.titulo;
    }

    if (sub) {
        sub.textContent = config.sub;
    }

    if (mensagem) {
       
        mensagem.innerHTML = detalhe || config.mensagem;
    }
}

/**
 * Gestão de alternância entre as abas principais (Pedir / Dar ajuda)
 * @param {string} targetPanelId - ID da secção a exibir
 */
export function switchTab(targetPanelId) {
    const abas = document.querySelectorAll(".aba");
    // Seleciona apenas os painéis principais de navegação
    const paineis = document.querySelectorAll("main > section[id^='painel-']");

    paineis.forEach((painel) => {
        if (painel.id === targetPanelId) {
            painel.removeAttribute("hidden");
        } else {
            painel.setAttribute("hidden", "true");
        }
    });

    abas.forEach((btn) => {
        const isSelected = btn.dataset.panel === targetPanelId;
        btn.setAttribute("aria-selected", isSelected ? "true" : "false");
    });
}