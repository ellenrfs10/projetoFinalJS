const ESTADOS = {
    idle: {
        titulo: "HELP",
        sub: "Tocar para acionar",
        mensagem: "O teu pedido será enviado instantneamente para protetores e voluntários num raio de 10km",
        desativado: false
    },
    locating: {
        titulo: "A obter a localização",
        sub: "",
        mensagem: "Mantém o ecrã aberto, é só um momento.",
        desativado: true

    },

    sent: {
        "HELP ENVIADO!",
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