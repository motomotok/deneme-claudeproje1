// Tüm DOM olay bağlamaları (butonlar, dokunma/klavye girişi) ve erişilebilirlik
// sınıflarının uygulanması. Yeni bir buton eklerken listener'ı buraya ekle.
let pendingMode='classic', pendingDiff='normal';
document.querySelectorAll('.modeCard').forEach(el=>{
  el.addEventListener('click', ()=>{
    pendingMode=el.dataset.mode;
    document.querySelectorAll('.modeCard').forEach(x=>x.classList.toggle('sel', x===el));
    document.getElementById('diffRow').classList.toggle('disabled', pendingMode==='zen'||pendingMode==='daily');
    beep(500,0.06,'sine',0.1); refreshDailyStatus();
  });
});
document.querySelectorAll('.diffChip').forEach(el=>{
  el.addEventListener('click', ()=>{
    pendingDiff=el.dataset.diff;
    document.querySelectorAll('.diffChip').forEach(x=>x.classList.toggle('sel', x===el));
    beep(500,0.05,'sine',0.08);
  });
});
document.getElementById('modeStartBtn').addEventListener('click', ()=>startGame(pendingMode,pendingDiff));

document.querySelectorAll('.stab').forEach(el=>{
  el.addEventListener('click', ()=>{ shopTab=el.dataset.tab; renderShopTab(); beep(500,0.05,'sine',0.08); });
});

document.querySelectorAll('[data-go]').forEach(b=>{
  b.addEventListener('click', e=>{ e.stopPropagation();
    const g=b.dataset.go;
    if(g==='mode') goMode();
    else if(g==='menu') goMenu();
    else if(g==='howto') goHowto();
    else if(g==='settings') goSettings();
    else if(g==='stats') goStats();
    else if(g==='shop') goShop();
    else if(g==='battlepass') goBattlepass();
  });
});
document.getElementById('retryBtn').addEventListener('click', e=>{ e.stopPropagation(); startGame(); });
document.getElementById('shareBtn').addEventListener('click', e=>{ e.stopPropagation(); shareScore(); });
document.getElementById('watchAdCoinsBtn').addEventListener('click', e=>{ e.stopPropagation(); watchAdForCoins(); });
document.getElementById('watchAdCoinsShopBtn').addEventListener('click', e=>{ e.stopPropagation(); watchAdForCoins(); });
document.getElementById('reviveWatchBtn').addEventListener('click', e=>{ e.stopPropagation(); acceptRevive(); });
document.getElementById('reviveSkipBtn').addEventListener('click', e=>{ e.stopPropagation(); declineRevive(); });
document.getElementById('resumeBtn').addEventListener('click', e=>{ e.stopPropagation(); resumeGame(); });
document.getElementById('zenFinishBtn').addEventListener('click', e=>{ e.stopPropagation(); gameOver('zen'); });
document.getElementById('pauseBtn').addEventListener('click', e=>{ e.stopPropagation(); pauseGame(); });
document.getElementById('soundSw').addEventListener('click', ()=>{ cfg.sound=!cfg.sound; saveCfg(); syncSettings(); if(cfg.sound) beep(700,0.08,'sine',0.12); });
document.getElementById('bigSw').addEventListener('click', ()=>{ cfg.bigButtons=!cfg.bigButtons; saveCfg(); applyAccessibility(); syncSettings(); beep(600,0.06,'sine',0.1); });
document.getElementById('handSw').addEventListener('click', ()=>{ cfg.leftHand=!cfg.leftHand; saveCfg(); applyAccessibility(); syncSettings(); beep(600,0.06,'sine',0.1); });
document.getElementById('cbSw').addEventListener('click', ()=>{ cfg.colorblind=!cfg.colorblind; saveCfg(); syncSettings(); beep(600,0.06,'sine',0.1); });
document.getElementById('resetStats').addEventListener('click', ()=>{
  stats={best:0,stars:0,games:0,maxLevel:1,magnets:0,golds:0,diamonds:0,unlocked:[],leaderboard:[],
    dailyDate:'',dailyDone:false,dailyScore:0,dailyCount:0,questDate:'',questId:'',questDone:false};
  saveStats(); syncStats(); beep(300,0.15,'square',0.12);
});
document.getElementById('pcYesBtn').addEventListener('click', e=>{ e.stopPropagation();
  const cb=pendingPurchase; hidePurchaseConfirm(); if(cb) cb();
});
document.getElementById('pcNoBtn').addEventListener('click', e=>{ e.stopPropagation(); hidePurchaseConfirm(); beep(300,0.06,'sine',0.08); });
document.getElementById('purchaseConfirmOverlay').addEventListener('click', e=>{
  if(e.target.id==='purchaseConfirmOverlay') hidePurchaseConfirm();
});
document.getElementById('premiumBuyBtn').addEventListener('click', e=>{ e.stopPropagation();
  if(window.Premium && Premium.isNative()){ Premium.purchase(); }
  else { queueToast('💎 Premium satın alma yalnızca Play Store uygulamasında kullanılabilir.'); }
});
document.getElementById('seasonPassBuyBtn').addEventListener('click', e=>{ e.stopPropagation();
  if(window.SeasonPass && SeasonPass.isNative()){ SeasonPass.purchase(); }
  else { queueToast('🎫 Sezon Bileti satın alma yalnızca Play Store uygulamasında kullanılabilir.'); }
});
document.getElementById('playGamesBtn').addEventListener('click', e=>{ e.stopPropagation();
  if(!window.PlayGames || !PlayGames.isNative()){ queueToast('🏆 Play Games yalnızca Play Store uygulamasında kullanılabilir.'); return; }
  if(PlayGames.signedIn){ PlayGames.showLeaderboard(); return; }
  PlayGames.signIn().then(ok=>{ syncPlayGamesUI(); if(ok) queueToast('🏆 Play Games\'e bağlandın!'); else queueToast('🏆 Bağlanılamadı, tekrar dene.'); });
});
document.getElementById('privacyBtn').addEventListener('click', e=>{ e.stopPropagation(); window.open('privacy.html','_blank'); });
document.getElementById('licensesBtn').addEventListener('click', e=>{ e.stopPropagation(); window.open('licenses.html','_blank'); });
document.getElementById('adConsentBtn').addEventListener('click', e=>{ e.stopPropagation(); Ads.showPrivacyOptions(); });

function applyAccessibility(){
  document.body.classList.toggle('big-ui', cfg.bigButtons);
  document.body.classList.toggle('left-hand', cfg.leftHand);
}

window.addEventListener('pointerdown', e=>{
  if(e.target.closest('button, .theme, .sw, .modeCard, .diffChip, .skinDot, .shopCard, .stab')) return;
  if(state==='play'){ e.preventDefault(); tap(e.clientX); }
}, {passive:false});
window.addEventListener('keydown', e=>{
  if(e.code==='ArrowRight' || e.code==='KeyD'){
    if(state==='play') tap(W);
  } else if(e.code==='ArrowLeft' || e.code==='KeyA'){
    if(state==='play') tap(0);
  } else if(e.code==='Space'){
    e.preventDefault();
    if(state==='menu') goMode();
    else if(state==='over') startGame();
    else if(state==='pause') resumeGame();
  } else if(e.code==='KeyP' || e.code==='Escape'){
    if(state==='play') pauseGame(); else if(state==='pause') resumeGame();
  }
});
window.addEventListener('resize', ()=>{ resize(); initStars(); });

if('serviceWorker' in navigator && location.protocol==='https:'){
  window.addEventListener('load', ()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); });
}
