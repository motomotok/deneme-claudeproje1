// "Reklamsız Premium" uygulama içi satın alma (IAP) köprüsü.
// cordova-plugin-purchase, native (Capacitor/Android) ortamda çalışırken
// otomatik olarak window.CdvPurchase global objesini enjekte eder — ayrı
// bir bundler/import gerekmez (ads.js/native-ads-bundle.js'den farklı).
// Tarayıcıda (bu obje yokken) tüm çağrılar sessizce no-op'tur.
(function () {
  // Play Console'da oluşturulacak "Yönetilmeyen ürün" (non-consumable) ID'si.
  // Fiyatı (~49 TL) Play Console tarafında sen belirlersin; buradaki metin
  // sadece gerçek fiyat gelene kadar gösterilecek bir yer tutucudur.
  const PRODUCT_ID = 'remove_ads';
  const FALLBACK_PRICE_TEXT = '49 TL';

  function isAvailable() {
    return !!(window.CdvPurchase && window.CdvPurchase.store);
  }

  // Sadece ürünü kaydeder + event handler'ları bağlar. store.initialize()
  // ÇAĞIRMAZ — cordova-plugin-purchase tüm ürünlerin önce register edilmesini,
  // sonra TEK bir initialize() çağrısı yapılmasını beklediği için bu çağrı
  // main.js'de, Premium ve SeasonPass ikisi de register olduktan sonra yapılır.
  function register(onOwned, onPriceReady) {
    if (!isAvailable()) return;
    const { store, ProductType, Platform } = window.CdvPurchase;
    store.register({ id: PRODUCT_ID, type: ProductType.NON_CONSUMABLE, platform: Platform.GOOGLE_PLAY });

    store.when().productUpdated((p) => {
      if (p.id !== PRODUCT_ID) return;
      if (p.owned) { onOwned && onOwned(); }
      else if (p.pricing && p.pricing.price) { onPriceReady && onPriceReady(p.pricing.price); }
    });
    store.when().approved((transaction) => transaction.verify());
    store.when().verified((receipt) => receipt.finish());
    store.when().owned(() => { onOwned && onOwned(); });
  }

  function purchase() {
    if (!isAvailable()) return;
    const { store } = window.CdvPurchase;
    const product = store.get(PRODUCT_ID);
    const offer = product && product.getOffer && product.getOffer();
    if (offer) store.order(offer);
  }

  function restore() {
    if (!isAvailable()) return;
    window.CdvPurchase.store.restorePurchases();
  }

  window.Premium = { isNative: isAvailable, register, purchase, restore, FALLBACK_PRICE_TEXT };
})();
