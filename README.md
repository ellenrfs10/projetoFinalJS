# projetoFinalJS

# 🛡️ SOS Mulher — Aplicação Web de Emergência e Rede de Apoio

**SOS Mulher** é uma aplicação web progressiva, interativa e responsiva criada para prestar auxílio rápido a mulheres em situações de emergência ou vulnerabilidade. A plataforma permite acionar pedidos de socorro (SOS) geolocalizados, emitir alarmes sonoros dissuasores, consultar e pesquisar centros de apoio próximos em tempo real e aceder a recursos rápidos de segurança.

**Observação:** O app é mobile first, por este motivo, deve ser testado em formato de dispositivos móveis.

---

## 🌐 Link da Aplicação (GitHub Pages)

Acede à aplicação publicada e totalmente funcional através do seguinte link:
👉 **[SOS Mulher no GitHub Pages](https://ellenrfs10.github.io/projetoFinalJS/)**
**

👉 Acede ao repositório aqui: https://github.com/ellenrfs10/projetoFinalJS.git

---

## 🚀 Funcionalidades Principais

- **Botão SOS Geolocalizado:** Identificação dinâmica da posição da utilizadora (coordenadas GPS) e envio imediato do pedido de ajuda.
- **Verificação Dinâmica de Cobertura (Raio 10 km):** Apresenta em tempo real a quantidade de pontos de apoio num raio de 10 km usando a fórmula de Haversine. Caso não existam centros próximos, ativa o modo de alerta contínuo.
- **Alarme Sonoro Dissuasor:** Opção configurável com persistência no `localStorage` para emitir um sinal sonoro de emergência.
- **Pesquisa Inteligente & Autocomplete:** Campo de busca com suporte a `<datalist>` dinâmico no cabeçalho, permitindo pesquisar centros de apoio por nome, tipo ou distrito em todo o país sem restrições de distância.
- **Recursos Rápidos de Segurança:** Atalho para ligação de emergência (112), gravação de áudio em tempo real e partilha rápida de rota/localização.
- **Guia de Estados:** Controlos de testes manuais para simular os diferentes estados da interface (*Idle*, *Locating*, *Sent*, *Error* e *No Coverage*).
- **Obs Segunda Aba:** Apenas exibe os alertas junto com as notificações. As funcionalidades dinâmicas desta página serão desenvolvidas na segunda parte do projeto.

---

## 🛠️ Tecnologias e Conceitos Aplicados (Requisitos do Projeto)

Esta aplicação foi desenvolvida em **HTML5**, **CSS3** e **JavaScript Moderno (ES6+)** sem dependência de frameworks externas, cobrindo os 8 tópicos exigidos:

1. **Lógica e Controlo de Fluxo:** Utilização de `if/else`, `switch`, operadores ternários e loops/métodos iterativos (`map`, `filter`, `reduce`).
2. **Manipulação de Dados Simples:** Tratamento e validação de strings (pesquisa *case-insensitive*), formatação de coordenadas, distâncias em km (`toFixed`) e datas ISO.
3. **Manipulação de Dados Complexos:** Processamento imutável de arrays de objetos e ordenação dinâmica por distância (`sort`).
4. **Manipulação do DOM (Criação Dinâmica):** Renderização dinâmica de *cards* e sugestões no HTML com *template strings* e manipulação limpa de conteúdos (`innerHTML`).
5. **Reatividade & Eventos:** Gestão de eventos do utilizador em tempo real (`click`, `input`, `change`, navegação por abas com atributos `data-*`).
6. **Escopo (Scope) & Closures:** Encapsulamento do estado da aplicação, utilização rigorosa de `const`/`let` e proteção de variáveis globais nos módulos.
7. **Assincronismo (`async/await`, `fetch`):** Consumo assíncrono do ficheiro local `dados.json` via `fetch()`, manipulação da Geolocation API via `Promises` e tratamento rigoroso de erros com `try/catch`.
8. **Modularização (ES6 Modules):** Separação do código em módulos limpos com `import`/`export`:
   - `main.js`: Ponto de entrada e orquestração de eventos.
   - `ui.js`: Renderização de estados e componentes visuais.
   - `api.js`: Carregamento e consumo da base de dados JSON.
   - `geo.js`: Geolocalização GPS e cálculo da fórmula de Haversine.
   - `storage.js`: Gestão de histórico e preferências com `localStorage`.
   - `audio.js`: Gestão do sintetizador/reprodutor de áudio de emergência.
   - `recursos.js`: Gravação de áudio e partilha de localização.

---

## 💾 Persistência de Dados

A aplicação utiliza o **`localStorage`** do navegador para:
- Manter o histórico dos últimos 20 pedidos de SOS efetuados (`sosmulher:pedidos`).
- Guardar a preferência da utilizadora quanto ao acionamento automático do alarme sonoro (`sosmulher:alarme_ativo`).

---

## 💻 Como Executar o Projeto Localmente

Por utilizar **Módulos ES6** (`import`/`export`) e requisições assíncronas `fetch()`, a aplicação deve ser executada num servidor local simples para evitar bloqueios de CORS.

### Pré-requisitos
- Um navegador moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
- Ter o Node.js instalado (opcional, mas recomendado) OU utilizar uma extensão de servidor local no seu editor (ex: Live Server no VS Code).

### Passo a Passo

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/ellenrfs10/projetoFinalJS.git

## 🧪 Como Testar as Funcionalidades
Assim que a aplicação abrir no navegador, podes testar os diferentes módulos e requisitos implementados:

**Carregamento de Dados (API Local):**

Ao abrir a aplicação, verifica se os centros de apoio e as opções de pesquisa carregam automaticamente na interface (consumidos via fetch do dados.json).

**Painel de Estado SOS e Alarme:**

- Clica no botão principal "HELP" (SOS).

- Verifica o fluxo reativo: passa pelo estado de obtenção de geolocalização, calcula a distância aos centros de apoio num raio de 10 km e ativa o alarme sonoro (caso esteja ativado nas preferências) e os efeitos visuais correspondentes.

**Recursos de Áudio e Partilha:**

- Testa a funcionalidade de gravação de áudio (requer permissão do microfone do navegador) e o botão de partilha de rota/localização.

- Persistência de Dados (localStorage):

- Cria um alerta ou altera as preferências de som, faz refresh à página (F5) e valida se o estado e os dados continuam guardados corretamente.

**Pesquisa em Tempo Real e Abas:**

Digita termos na barra de pesquisa para filtrar os centros de apoio instantaneamente e navega entre as diferentes abas da aplicação para testar a manipulação dinâmica do DOM.
