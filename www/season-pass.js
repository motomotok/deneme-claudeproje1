// "Sezon Bileti" (Battle-Pass premium çizgisi) uygulama içi satın alma köprüsü.
// premium.js ile aynı desen, tek fark: ürün CONSUMABLE — her ay (sezon
// değiştiğinde) stats.seasonPremium sıfırlanır ve tekrar satın alınabilmesi
// gerekir, bu yüzden NON_CONSUMABLE değil CONSUMABLE kullanılıyor.
(function () {
  const PRODUCT_ID = 'season_pass';
  const FALLBACK_PRICE_TEXT = '29 TL';

  function isAvailable() {
    return !!(window.CdvPurchase && window.CdvPurchase.store);
  }

  // Sadece kaydeder + handler bağlar; store.initialize() main.js'de,
  // Premium.register() ile birlikte, tek seferlik çağrılır (bkz. premium.js).
  function register(onOwned, onPriceReady) {
    if (!isAvailable()) return;
    const { store, ProductType, Platform } = window.CdvPurchase;
    store.register({ id: PRODUCT_ID, type: ProductType.CONSUMABLE, platform: Platform.GOOGLE_PLAY });

    store.when().productUpdated((p) => {
      if (p.id !== PRODUCT_ID) return;
      if (p.pricing && p.pricing.price) { onPriceReady && onPriceReady(p.pricing.price); }
    });
    store.when().approved((transaction) => transaction.verify());
    store.when().verified((receipt) => { onOwned && onOwned(); receipt.finish(); });
  }

  function purchase() {
    if (!isAvailable()) return;
    const { store } = window.CdvPurchase;
    const product = store.get(PRODUCT_ID);
    const offer = product && product.getOffer && product.getOffer();
    if (offer) store.order(offer);
  }

  window.SeasonPass = { isNative: isAvailable, register, purchase, FALLBACK_PRICE_TEXT };
})();
