// Ses (WebAudio beep'leri), titreşim ve ekran-üstü toast bildirimleri.
let AC=null;
function beep(freq,dur,type,vol){
  if(!cfg.sound) return;
  dur=dur||0.09; type=type||'sine'; vol=vol||0.14;
  try{
    if(!AC) AC=new (window.AudioContext||window.webkitAudioContext)();
    const o=AC.createOscillator(), g=AC.createGain();
    o.type=type; o.frequency.value=freq; o.connect(g); g.connect(AC.destination);
    const t=AC.currentTime;
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.start(t); o.stop(t+dur);
  }catch(e){}
}
function vibrate(pattern){ try{ if(navigator.vibrate) navigator.vibrate(pattern); }catch(e){} }

// Kombo ilerledikçe çalan üretimsel melodi: La minör pentatonik (A-C-D-E-G),
// hangi sırayla toplanırsa toplansın hep uyumlu kalır. Her 5 notada (bir
// "oktav") bir üst kayda geçilir — combo ne kadar uzun sürerse melodi o kadar
// yükselir, bu da oyuncuya skorun ötesinde kovalanacak somut bir his verir.
const MELODY_SCALE = [220.00, 261.63, 293.66, 329.63, 392.00];
function melodyFreq(i){
  const oct = Math.floor(Math.max(0,i) / MELODY_SCALE.length);
  return MELODY_SCALE[((i%MELODY_SCALE.length)+MELODY_SCALE.length)%MELODY_SCALE.length] * Math.pow(2, Math.min(oct,3));
}
function playMelodyNote(comboVal, vol){
  beep(melodyFreq(comboVal-1), 0.10, 'sine', vol||0.14);
}

let toastQueue=[], toastShowing=false;
function queueToast(text){ toastQueue.push(text); pumpToast(); }
function pumpToast(){
  if(toastShowing || !toastQueue.length) return;
  toastShowing=true;
  const el=document.getElementById('toast');
  el.innerHTML=toastQueue.shift(); el.classList.add('show');
  setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>{ toastShowing=false; pumpToast(); },300); },2400);
}
