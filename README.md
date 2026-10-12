# projetoFinalJS

# 🛡️ SOS Mulher — Aplicação Web de Emergência e Rede de Apoio

**SOS Mulher** é uma aplicação web progressiva, interativa e responsiva criada para prestar auxílio rápido a mulheres em situações de emergência ou vulnerabilidade. A plataforma permite acionar pedidos de socorro (SOS) geolocalizados, emitir alarmes sonoros dissuasores, consultar e pesquisar centros de apoio próximos em tempo real e aceder a recursos rápidos de segurança.

**Observação:** O app é mobile first, por este motivo, deve ser testado em formato de dispositivos móveis.

---

## 🌐 Link da Aplicação (GitHub Pages)

Acede à aplicação publicada e totalmente funcional através do seguinte link:
👉 **[SOS Mulher no GitHub Pages](inserir link do gitpages)**
*(Nota: Substitui o link acima pelo URL real do teu GitHub Pages)*

---

## 🚀 Funcionalidades Principais

- **Botão SOS Geolocalizado:** Identificação dinâmica da posição da utilizadora (coordenadas GPS) e envio imediato do pedido de ajuda.
- **Verificação Dinâmica de Cobertura (Raio 10 km):** Apresenta em tempo real a quantidade de pontos de apoio num raio de 10 km usando a fórmula de Haversine. Caso não existam centros próximos, ativa o modo de alerta contínuo.
- **Alarme Sonoro Dissuasor:** Opção configurável com persistência no `localStorage` para emitir um sinal sonoro de emergência.
- **Pesquisa Inteligente & Autocomplete:** Campo de busca com suporte a `<datalist>` dinâmico no cabeçalho, permitindo pesquisar centros de apoio por nome, tipo ou distrito em todo o país sem restrições de distância.
- **Recursos Rápidos de Segurança:** Atalho para ligação de emergência (112), gravação de áudio em tempo real e partilha rápida de rota/localização.
- **Guia de Estados:** Controlos de testes manuais para simular os diferentes estados da interface (*Idle*, *Locating*, *Sent*, *Error* e *No Coverage*).

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
- Visual Studio Code (recomendado) ou um servidor HTTP simples.

### Passo a Passo

1. **Clonar o Repositório:**
   ```bash
   git clone [https://github.com/teu-usuario/nome-do-repositorio.git](https://github.com/teu-usuario/nome-do-repositorio.git)