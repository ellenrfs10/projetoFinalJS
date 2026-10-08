const CHAVE = "sosmulher:pedidos";
const CHAVE_ALARME = "sosmulher:alarme_ativo";
const MAX_PEDIDOS = 20;

export function loadAlerts() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE));
        return Array.isArray(dados) ? dados : [];
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
    return persist([pedido, ...loadAlerts()].slice(0, MAX_PEDIDOS));
}

export function removeAlerts(id) {
    return persist(loadAlerts().filter((p) => p.id !== id));
}

// CORRIGIDO: adicionado o 'return' e a verificação de string "true"
export function getAlarmePreferencial() {
    return localStorage.getItem(CHAVE_ALARME) === "true";
}

// CORRIGIDO: alterado de getItem para setItem e corrigido o nome da função
export function setAlarmePreferencial(ativo) {
    localStorage.setItem(CHAVE_ALARME, ativo);
}