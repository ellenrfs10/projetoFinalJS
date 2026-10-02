const CHAVE= "sosmulher:pedidos";
const MAX_PEDIDOS=20;

export function loadAlerts(){
try{
    const dados = JSON.parse(localStorage.getItem(CHAVE));
    return Array.isArray?dados:[];
} catch{
    return [];
}
}

function persist(pedidos) {
    try {
        localStorage.setItem(CHAVE, JSON.stringify(pedidos));
    }catch (err){
        console.log("Não foi possível guardar os pedidos", err);
    }return pedidos;
}

export function saveAlerts(pedido){
    return persist([pedido,...loadAlerts()].slice(0, MAX_PEDIDOS));
}

export function removeAlerts(id){
    return persist(loadAlerts().filter((p) => p.id !== id));
}