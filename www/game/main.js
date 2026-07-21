// Bootstrap: tüm modüller yüklendikten sonra tek seferlik başlatma çağrıları.
// Bu dosya her zaman script sırasının EN SONUNDA yer almalı.
resize(); initStars(); applyTheme(cfg.theme); applyAccessibility(); ensureTodayQuest(); handleDailyReturn(); resetGame(); renderThemeGrid(); goMenu();
Ads.init();
if(window.Premium){
  Premium.init(
    ()=>{ if(!stats.premiumNoAds){ stats.premiumNoAds=true; saveStats(); queueToast('💎 Premium aktif! Artık reklamsız oynuyorsun.'); } syncPremiumUI(); },
    (price)=>{ syncPremiumUI(price); }
  );
}
requestAnimationFrame(loop);
