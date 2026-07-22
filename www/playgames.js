// Google Play Games Services köprüsü. @openforge/capacitor-game-connect
// modern @CapacitorPlugin API kullandığı için native ortamda plugin proxy'si
// Capacitor'ün kendi native köprüsü tarafından window.Capacitor.Plugins altına
// otomatik enjekte edilir — ads.js/premium.js'ten farklı olarak esbuild bundle
// gerekmez (import edilen tek şey string/sayı parametreli düz metotlar,
// özel enum/sınıf yok).
(function () {
  // Play Console → Play Games Services → Leaderboards'tan alınacak gerçek ID
  // buraya girilmeli (bkz. MOBILE_APP.md). Girilmeden submitScore/showLeaderboard
  // sessizce başarısız olur, oyunu bozmaz.
  const LEADERBOARD_ID = 'YOUR_LEADERBOARD_ID';

  let signedIn = false;

  function plugin() {
    return (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform() && window.Capacitor.Plugins)
      ? window.Capacitor.Plugins.CapacitorGameConnect
      : null;
  }
  function isNative() { return !!plugin(); }

  function signIn() {
    const p = plugin();
    if (!p) return Promise.resolve(false);
    return p.signIn()
      .then(() => { signedIn = true; return true; })
      .catch(() => { signedIn = false; return false; });
  }

  function submitScore(score) {
    const p = plugin();
    if (!p || !signedIn || LEADERBOARD_ID === 'YOUR_LEADERBOARD_ID') return;
    p.submitScore({ leaderboardID: LEADERBOARD_ID, totalScoreAmount: Math.round(score) }).catch(() => {});
  }

  function showLeaderboard() {
    const p = plugin();
    if (!p || LEADERBOARD_ID === 'YOUR_LEADERBOARD_ID') {
      if (window.queueToast) queueToast('🏆 Skor tablosu henüz ayarlanmadı.');
      return;
    }
    p.showLeaderboard({ leaderboardID: LEADERBOARD_ID }).catch(() => {});
  }

  window.PlayGames = {
    isNative,
    signIn,
    submitScore,
    showLeaderboard,
    get signedIn() { return signedIn; },
  };
})();
