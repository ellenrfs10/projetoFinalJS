export async function carregarCentrosApoio() {
    try  {
        const resposta = await fetch("./data/dados.json");
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar dados: ${resposta.status}`);            
        }
        const dados = await resposta.json();
        return dados;
    } catch(erro){
        console.log("Não foi possível adquirir os dados", erro);
        return[];
    }
    
}