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
        desativado: false
    },
    no_coverage: {
        titulo: "A TOCAR ALARME",
        sub: "Clique p/ Parar",
        mensagem: "Nenhum centro de apoio num raio de 10km. <strong>Ligue 112 em caso de emergência.</strong>",
        desativado: false
    },
    sent: {
        titulo: "HELP ENVIADO!",
        sub: "",
        mensagem: "Pedido enviado. Caso seja necessário, liga 112 no botão abaixo.",
        desativado: false
    },
    error: {
        titulo: "Tentar de novo",
        sub: "",
        mensagem: "Não foi possível enviar o pedido.",
        desativado: false
    }
};



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



export function switchTab(targetPanelId) {
    const abas = document.querySelectorAll(".aba");
    
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

export function renderizarListaPontoApoio(listaCentroApoio, containerElemento, raioMaximoKm = 10, filtrarPorRaio = false) {
    if (!containerElemento) return;
    containerElemento.innerHTML = "";

    if (!listaCentroApoio || listaCentroApoio.length === 0) {
        containerElemento.innerHTML = "<p>Nenhum centro de apoio encontrado.</p>";
        return;
    }

    
    let centrosParaExibir = listaCentroApoio;
    if (filtrarPorRaio) {
        centrosParaExibir = listaCentroApoio.filter((centro) => centro.distanciaKm <= raioMaximoKm);
    }

    
    if (centrosParaExibir.length === 0) {
        containerElemento.innerHTML = `<p>Nenhum centro de apoio encontrado num raio de ${raioMaximoKm} km.</p>`;
        return;
    }

    
    const listaOrdenada = [...centrosParaExibir].sort((a, b) => {
        if (a.distanciaKm !== undefined && b.distanciaKm !== undefined) {
            return a.distanciaKm - b.distanciaKm;
        }
        return 0;
    });

    // Mapeia e gera o HTML de cada card
    const cartoesHTML = listaOrdenada.map((item) => {
        const textoDistancia = item.distanciaKm !== undefined
            ? `<p><strong>Distância:</strong> ${item.distanciaKm} km</p>`
            : "";

        return `
            <article class="card-apoio" data-id="${item.id}">
                <h3>${item.nome}</h3>
                <p><strong>Tipo:</strong> ${item.tipo} | <strong>Distrito:</strong> ${item.distrito}</p>
                ${textoDistancia}
                <a href="tel:${item.telefone}" class="btn-ligar">📞 ${item.telefone}</a>
            </article>
        `;
    }).join("");

    containerElemento.innerHTML = cartoesHTML;
}
export function pontoApoioProximo(listaCentroApoio, containerElemento, raioKm = 10) {
    if (!containerElemento) return [];

    // USO DO REDUCE
    const apoioProximo = listaCentroApoio.reduce((acc, centro) => {
        if (centro.distanciaKm <= raioKm) {
            acc.push(centro);
        }
        return acc;
    }, []);

    // Atualiza o elemento no ecrã
    if (apoioProximo.length === 0) {
        containerElemento.innerHTML = "<p>Não há centros de apoio próximos à sua localização (raio de 10 km).</p>";
    } else if (apoioProximo.length === 1) {
        containerElemento.innerHTML = `<p>Existe <strong>1 centro de apoio</strong> próximo à sua localização.</p>`;
    } else {
        containerElemento.innerHTML = `<p>Existem <strong>${apoioProximo.length} centros de apoio</strong> próximos à sua localização.</p>`;
    }

    return apoioProximo;
}

export function preencherSugestoesBusca(listaCentroApoio) {
    const listaDados = document.querySelector("#sugestoes-centros");
    if (!listaDados) {
       
        return;
    }
   
    listaDados.innerHTML = listaCentroApoio.map((c) => {
        return `<option value="${c.nome}">${c.tipo} - ${c.distrito}</option>`;
    }).join("");
}