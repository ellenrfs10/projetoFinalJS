let audioCtx = null;
let oscilador = null;
let ganho = null;
let comecou = false;

export function tocarAlarme() {
    if (comecou) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    
    oscilador = audioCtx.createOscillator();
    ganho = audioCtx.createGain();

    oscilador.type = "sawtooth";
   /*  oscilador.frequency.setValueAtTime(800, audioCtx.currentTime); */

    const agora = audioCtx.currentTime;
    for (let i = 0; i< 30; i++){
        oscilador.frequency.setValueAtTime(800, agora + i* 0.4);
        oscilador.frequency.setValueAtTime(400, agora + i * 0.4 + 0.2);
    }

    ganho.gain.setValueAtTime(0.3, audioCtx.currentTime);
    oscilador.connect(ganho);
    ganho.connect(audioCtx.destination);

    oscilador.start();
    comecou = true;

}

export function pararAlarme() {
    if (oscilador) {
        try{
            
            oscilador.stop(60);
           
        } catch(err){

        }
    }
     if (audioCtx){setTimeout(() => {
         audioCtx.close();
         oscilador.disconnect();
         comecou = false;
         oscilador = null;
         audioCtx = null;

     }, 60000);
       
    } 

    
}