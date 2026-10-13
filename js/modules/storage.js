const CHAVE = "sosmulher:pedidos";
const CHAVE_ALARME = "sosmulher:alarme_ativo";
const MAX_PEDIDOS = 20;

export function loadAlerts() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE));
        if (!Array.isArray(dados)) return [];

        // Remove duplicados garantindo conversão segura da chave de ID para string
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

    // Garante que o pedido tem um ID único infalível (caso venha sem ID ou repetido)
    const novoPedidoComIdUnico = {
        ...pedido,
        id: pedido.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // Adiciona sempre o novo pedido no topo da lista e limita ao máximo de 20
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

// Gestão do Raio de Distância (Padrão: 10km)
export function getRaioPreferencial() {
    const valor = localStorage.getItem(CHAVE_RAIO);
    return valor !== null ? Number(valor) : 10;
}

export function setRaioPreferencial(raio) {
    localStorage.setItem(CHAVE_RAIO, Number(raio));
}