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

const botao = document.querySelector("#botao-sos");
const texto = document.querySelector(".botao-sos__texto");
const sub = document.querySelector(".botao-sos__sub");
const mensagem = document.querySelector("#estado-sos");

export function renderState(estado, detalhe = "") {
    const config = ESTADOS[estado];

    botao.dataset.state = estado;
    texto.textContent = config.titulo;
    sub.textContent = config.sub;
    botao.disabled = config.desativado;

    if (detalhe) {
        mensagem.textContent = detalhe;
    } else {
        mensagem.innerHTML = config.mensagem;
    }
}