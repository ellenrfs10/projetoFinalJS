import { getPosition } from "./geo.js";

let mediaRecorder = null;
let blocosAudio = [];


export async function gerirGravacaoAudio(botaoElemento) {
    // Se já estiver a gravar, para a gravação
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        blocosAudio = [];

        mediaRecorder.ondataavailable = (e) => blocosAudio.push(e.data);

        mediaRecorder.onstart = () => {
            if (botaoElemento) {
                botaoElemento.style.borderColor = "var(--panic)";
                botaoElemento.querySelector("span:last-child").textContent = "A gravar... (Clique p/ parar)";
            }
        };

        mediaRecorder.onstop = () => {
            const blobAudio = new Blob(blocosAudio, { type: "audio/webm" });
            const urlAudio = URL.createObjectURL(blobAudio);

            // Faz o download automático do ficheiro gravado
            const a = document.createElement("a");
            a.href = urlAudio;
            a.download = `sos-gravacao-${Date.now()}.webm`;
            a.click();

            // Parar todas as faixas do microfone
            stream.getTracks().forEach((track) => track.stop());

            if (botaoElemento) {
                botaoElemento.style.borderColor = "";
                botaoElemento.querySelector("span:last-child").textContent = "Gravar Áudio";
            }
            alert("Gravação guardada com sucesso!");
        };

        mediaRecorder.start();

        
        setTimeout(() => {
            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop();
            }
        }, 10000);

    } catch (err) {
        alert("Permissão do microfone negada ou não suportada no seu dispositivo.");
    }
}


export async function partilharLocalizacao() {
    try {
        const pos = await getPosition();
        const linkMapa = `https://www.google.com/maps?q=${pos.lat},${pos.lng}`;
        const textoPartilha = `Preciso de ajuda! A minha localização atual é: ${linkMapa}`;

        if (navigator.share) {
            await navigator.share({
                title: "SOS - Minha Localização",
                text: textoPartilha,
                url: linkMapa
            });
        } else {
            // Fallback caso navigator.share não seja suportado no computador
            await navigator.clipboard.writeText(textoPartilha);
            alert("Link com a sua localização copiado para a área de transferência!");
        }
    } catch (err) {
        alert(`Não foi possível obter a localização: ${err.message}`);
    }
};