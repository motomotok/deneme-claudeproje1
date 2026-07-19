// Bootstrap: tüm modüller yüklendikten sonra tek seferlik başlatma çağrıları.
// Bu dosya her zaman script sırasının EN SONUNDA yer almalı.
resize(); initStars(); applyTheme(cfg.theme); applyAccessibility(); ensureTodayQuest(); resetGame(); renderThemeGrid(); goMenu();
Ads.init();
requestAnimationFrame(loop);
