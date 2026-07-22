// Bootstrap: tüm modüller yüklendikten sonra tek seferlik başlatma çağrıları.
// Bu dosya her zaman script sırasının EN SONUNDA yer almalı.
resize(); initStars(); applyTheme(cfg.theme); applyAccessibility(); ensureTodayQuest(); handleDailyReturn(); resetGame(); renderThemeGrid(); goMenu();
Ads.init();
if(window.PlayGames && PlayGames.isNative()){
  PlayGames.signIn().then(()=>{ syncPlayGamesUI(); });
}
if(window.Premium){
  Premium.register(
    ()=>{ if(!stats.premiumNoAds){ stats.premiumNoAds=true; saveStats(); queueToast('💎 Premium aktif! Artık reklamsız oynuyorsun.'); } syncPremiumUI(); },
    (price)=>{ syncPremiumUI(price); }
  );
}
if(window.SeasonPass){
  SeasonPass.register(
    ()=>{ ensureSeason(); stats.seasonPremium=true; saveStats(); queueToast('🎫 Sezon Bileti aktif! Premium ödülleri açıldı.'); syncSeasonPassUI(); },
    (price)=>{ syncSeasonPassUI(price); }
  );
}
if(window.CdvPurchase && window.CdvPurchase.store){
  window.CdvPurchase.store.initialize([window.CdvPurchase.Platform.GOOGLE_PLAY]).catch(()=>{});
}
requestAnimationFrame(loop);
