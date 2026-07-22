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

let toastQueue=[], toastShowing=false;
function queueToast(text){ toastQueue.push(text); pumpToast(); }
function pumpToast(){
  if(toastShowing || !toastQueue.length) return;
  toastShowing=true;
  const el=document.getElementById('toast');
  el.innerHTML=toastQueue.shift(); el.classList.add('show');
  setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>{ toastShowing=false; pumpToast(); },300); },2400);
}
