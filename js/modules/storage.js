const CHAVE = "sosmulher:pedidos";
const CHAVE_ALARME = "sosmulher:alarme_ativo";
const CHAVE_CLIENT_ID = "sosmulher:client_id";
const MAX_PEDIDOS = 20;

export function getClientId() {
    let id = localStorage.getItem(CHAVE_CLIENT_ID);
    if (!id) {
        id = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(CHAVE_CLIENT_ID, id);
    }
    return id;
}

export function loadAlerts() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE));
        if (!Array.isArray(dados)) return [];

        const unicos = Array.from(
            new Map(dados.map(item => [String(item.id), item])).values()
        );
        return unicos;
    } catch (err) {
        return [];
    }
}

function persist(pedidos) {
    try {
        localStorage.setItem(CHAVE, JSON.stringify(pedidos));
    } catch (err) {
        console.log("Não foi possível guardar os pedidos", err);
    }
    return pedidos;
}

export function saveAlerts(pedido) {
    const atuais = loadAlerts();
    const agora = Date.now();

    // Anti-spam: rejeita se houver um pedido do mesmo cliente nos últimos 5 segundos
    const ultimoPedidoDoCliente = atuais.find(p => p.clientId === pedido.clientId);
    if (ultimoPedidoDoCliente && (agora - new Date(ultimoPedidoDoCliente.criadoEm).getTime() < 5000)) {
        return atuais;
    }

    const novoPedidoComIdUnico = {
        ...pedido,
        id: pedido.id || `${agora}-${Math.random().toString(36).substr(2, 9)}`
    };
    const atualizados = [novoPedidoComIdUnico, ...atuais].slice(0, MAX_PEDIDOS);
    return persist(atualizados);
}

export function removeAlerts(id) {
    return persist(loadAlerts().filter((p) => String(p.id) !== String(id)));
}

export function getAlarmePreferencial() {
    return localStorage.getItem(CHAVE_ALARME) === "true";
}

export function setAlarmePreferencial(ativo) {
    localStorage.setItem(CHAVE_ALARME, ativo);
}