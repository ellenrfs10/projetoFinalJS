let audioCtx = null;
let oscilador = null;
let ganho = null;
let comecou = false;

export function estaATocar() {
    return comecou;
}

export function tocarAlarme() {
    if (comecou) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    
    oscilador = audioCtx.createOscillator();
    ganho = audioCtx.createGain();

    oscilador.type = "sawtooth";
   /*  oscilador.frequency.setValueAtTime(800, audioCtx.currentTime); */

    const agora = audioCtx.currentTime;
    for (let i = 0; i< 120; i++){
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

//parar alarme com clique 

export function pararAlarmeComClick(){

    if (oscilador) {
        try {

            oscilador.stop();

        } catch (err) {

        }
    }
    if (audioCtx) {
      
            audioCtx.close();
            oscilador.disconnect();
            comecou = false;
            oscilador = null;
            audioCtx = null;

        }

    } 





    /* comecou = false;

    if (ganho && audioCtx){
        try{
            ganho.gain.cancelScheduledValues(audioCtx.currentTime);
            ganho.gain.setValueAtTime(0, audioCtx.currentTime);
        } catch (err) {
            } 

    } if (audioCtx) {
        try {
            audioCtx.close();
        } catch (e) { }
    }

    oscilador = null;
    ganho = null;
    audioCtx = null; */



