# Neon Yörünge — Android Uygulaması ve Reklam Kurulumu

Bu proje artık hem web/PWA (`www/` klasörü, GitHub Pages) hem de **Capacitor** ile
paketlenmiş gerçek bir Android uygulaması olarak build edilebiliyor. Reklam
altyapısı (AdMob) şu an **Google'ın resmi TEST reklam ID'leri** ile çalışıyor —
henüz bir AdMob/Play Console hesabın olmadığı için hiçbir yerde gerçek para
kazandırmayan test reklamları gösterilir. Aşağıdaki adımlar hesapları
açtığında canlıya geçmen için.

## Proje yapısı

```
www/index.html           → sadece HTML iskeleti + script/style include'ları
www/style.css            → tüm oyun CSS'i
www/game/data.js         → temalar/kozmetikler/mağaza, ayar+istatistik kalıcılığı, RNG, görev/başarım, coin ekonomisi
www/game/fx.js           → ses (beep), titreşim, toast bildirimleri
www/game/engine.js       → canvas kurulumu, oyuncu/eşya fiziği, çarpışma, güç-yükseltme, revive akışı
www/game/render.js       → requestAnimationFrame döngüsü ve tüm canvas çizimi
www/game/screens.js      → menü/mod/mağaza/oyun/duraklat/oyun-sonu durum makinesi
www/game/shop-ui.js      → ayarlar/mağaza/istatistik ekranlarının DOM render'ı
www/game/input.js        → tüm buton/dokunma/klavye event listener'ları
www/game/main.js         → bootstrap (en son yüklenir, tek seferlik başlatma çağrıları)
www/privacy.html         → Gizlilik Politikası / KVKK aydınlatma metni (TR+EN)
www/licenses.html        → uygulama içi açık kaynak lisans metinleri
www/ads.js               → oyunun çağırdığı genel Ads API + tarayıcıda reklam simülasyonu
www/native-ads-bundle.js → derlenmiş dosya (elle DÜZENLEME), src/native-ads.js'den üretilir
src/native-ads.js        → gerçek AdMob (Capacitor) + UMP onay entegrasyonunun KAYNAK dosyası
android/                 → Capacitor'ın oluşturduğu native Android projesi
capacitor.config.json    → uygulama ID'si, adı, AdMob plugin ayarları
LICENSE                  → oyunun kendi telif bildirimi (kapalı kaynak)
THIRD_PARTY_LICENSES.md  → kullanılan açık kaynak kütüphanelerin (MIT) lisans metinleri
```

`www/game/*.js` dosyaları **klasik `<script>` etiketleri** ile sırayla yüklenir (bundler
yok) — tarayıcıda ardışık script'ler aynı global scope'u paylaştığı için `data.js`'de
tanımlanan bir değişken/fonksiyon `fx.js`'den sonrakilerde doğrudan kullanılabilir. Yeni
bir dosya eklerken `index.html`'deki `<script src="game/...">` sırasını bozmadan,
`main.js`'i her zaman EN SONA bırak.

## Günlük geliştirme

```bash
npm install                # bağımlılıkları kur (ilk seferde)
npm run build:ads          # src/native-ads.js → www/native-ads-bundle.js
npm run cap:sync           # www/ değişikliklerini android/ projesine kopyalar (build:ads'i de çalıştırır)
npm run android:open       # Android Studio'da açar (kuruluysa)
```

`www/index.html`, `www/ads.js` veya `www/sw.js` içinde değişiklik yaptıktan sonra
her zaman `npm run cap:sync` çalıştır — Capacitor bu dosyaları `android/app/src/main/assets/public`
içine kopyalıyor, doğrudan orada düzenleme yapma.

## 1) AdMob hesabı açıldıktan sonra yapılacaklar

1. https://admob.google.com üzerinden hesap aç, yeni bir "Uygulama" oluştur (Android).
2. Oluşturduğun uygulama için 2 reklam birimi (ad unit) oluştur:
   - **Geçiş reklamı (Interstitial)**
   - **Ödüllü video (Rewarded)**
3. `src/native-ads.js` dosyasının en üstünde:
   ```js
   const ADS_TEST_MODE = false;   // true → false
   const PROD_INTERSTITIAL_AD_ID = 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY';
   const PROD_REWARDED_AD_ID     = 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ';
   ```
   gerçek ID'lerini yapıştır.
4. `android/app/src/main/AndroidManifest.xml` içindeki
   `com.google.android.gms.ads.APPLICATION_ID` meta-data değerini AdMob panelindeki
   **App ID** (uygulama kimliği, `ca-app-pub-...~...` formatında) ile değiştir.
5. `npm run cap:sync` çalıştır, sonra release build al (aşağıya bak).

⚠️ **Önemli:** Uygulama Play Store'da yayına alınıp AdMob tarafından onaylanana kadar
gerçek reklam ID'lerini test cihazı dışında kullanma / gerçek reklamlara tıklama —
AdMob hesabının askıya alınmasına yol açabilir. Onaylanana kadar `ADS_TEST_MODE=true`
ile bırakmak en güvenlisi.

## 2) Google Play Console hesabı ($25, tek seferlik)

1. https://play.google.com/console adresinden geliştirici hesabı aç ($25 tek seferlik ücret).
2. Yeni uygulama oluştur, mağaza listeleme bilgilerini doldur (README.md'deki açıklamalar,
   özellik listesi ve `www/icons/icon-512.png` bu iş için kullanılabilir — Play Store 512×512 ikon ister).
3. İçerik derecelendirmesi anketini doldur, gizlilik politikası URL'si ekle (reklam SDK'sı
   kullanıldığı için "reklam gösteriyor" ve "veri toplama" beyanları gerekiyor — Play Console
   bu formu adım adım yönlendirir).

## 3) İmzalı release (AAB) üretme

Henüz bir keystore'un yoksa önce oluştur (bu dosyayı ve şifresini KAYBETME — kaybedersen
uygulamayı bir daha güncelleyemezsin):

```bash
keytool -genkey -v -keystore neon-yorunge-release.keystore -alias neonyorunge -keyalg RSA -keysize 2048 -validity 10000
```

`android/app/build.gradle` içine bir `signingConfigs` bloğu eklenip `release` build type'a
bağlanmalı (Android Studio bunu "Generate Signed Bundle/APK" sihirbazıyla otomatik yapar —
ilk seferde Android Studio'dan gitmek daha az hataya açık).

```bash
npm run cap:sync
cd android
gradlew.bat bundleRelease      # android/app/build/outputs/bundle/release/app-release.aab üretir
```

Üretilen `.aab` dosyası doğrudan Play Console'a yüklenir.

## 4) Reklam/Coin ekonomisi — nerede ne var

- **Oyun sonu geçiş reklamı**: her `gameOver()` çağrısından ~0.7sn sonra otomatik gösterilir
  (`www/index.html` → `gameOver()` içinde `Ads.showInterstitial()`).
- **"Reklam İzle → Coin"**: oyun-sonu ve mağaza ekranlarındaki buton, `watchAdForCoins()`'i
  çağırır. Ödül: `REWARD_AD_COINS = 25` yıldız tozu, günlük limit `DAILY_AD_REWARD_CAP = 10`
  (her iki sabit de `www/game/data.js` içinde, `addStardust` fonksiyonunun hemen altında).
- **Revive ("son canla devam et")**: son can gidince `offerRevive()` tetiklenir, reklam
  izlenirse `lives=1` ile oyun kaldığı yerden devam eder; oyun başına sadece bir kez kullanılabilir
  (`session.revivedUsed`).
- Tarayıcıda (Capacitor olmadan) çalışırken tüm bu akışlar `www/ads.js` içindeki simülasyon
  overlay'i ile çalışır — gerçek reklam SDK'sı devreye girmeden test edebilirsin.

## 5) Gizlilik, telif ve Google Play zorunlulukları

Bu bölüm kod değil, **Play Console'da elle doldurman gereken formlar** için
hazır cevaplar içerir.

### Gizlilik Politikası URL'si
`www/privacy.html` GitHub Pages'te yayına girince şu adreste olacak:
`https://motomotok.github.io/deneme-claudeproje1/privacy.html`. Bu URL'yi
Play Console → App content → Privacy policy alanına yapıştır. Sayfa hem
Türkçe KVKK aydınlatma metni hem İngilizce özet içerir, iletişim adresi
`paslagameinfo@gmail.com`. Aynı sayfa uygulama içinde Ayarlar →
"🔒 Gizlilik Politikası"ndan da açılır (Google Play, hem mağaza kaydında
hem uygulama içinde erişilebilir olmasını şart koşar).

### Data Safety formu (Play Console → App content → Data safety)
| Soru | Cevap |
|---|---|
| Veri topluyor musunuz? | Evet — reklam SDK'sı (AdMob) aracılığıyla |
| Toplanan veri türü | Cihaz/diğer kimlikler (reklam kimliği), yaklaşık konum |
| Kişisel bilgi (isim, e-posta) toplanıyor mu? | Hayır |
| Veri aktarımda şifreleniyor mu? | Evet (HTTPS) |
| Kullanıcı veri silmeyi talep edebilir mi? | Uygulama tarafında saklanan veri yok (her şey cihazda `localStorage`); AdMob verisi için Google'a başvurulur |
| Veri toplama amacı | Reklam sunumu ve ölçümleme |

### Hedef kitle ve reklam ayarları
- **Hedef yaş aralığı**: "13 yaş ve üzeri / genel kitle" seç, **çocuklara
  yönelik değil**. Kod tarafında da tutarlı: `tagForChildDirectedTreatment`
  kullanılmıyor, `AdMobInitializationOptions`'da varsayılan (false) bırakıldı.
- **İçerik derecelendirmesi anketi**: oyun şiddet/kan/kumar içermiyor
  (asteroit çarpışması soyut parçacık efekti) → muhtemelen "Everyone"/PEGI 3
  çıkacaktır, ama anketi eksiksiz doldurmak Play Console'un işi.
- **Reklamlar içeriyor** onay kutusu: işaretlenmeli (uygulama gerçekten reklam gösteriyor).

### AB/UK/CH kullanıcı onayı (UMP)
`src/native-ads.js`'deki `init()` artık uygulama açılışında otomatik olarak
`AdMob.requestConsentInfo()` çağırıp gerekirse (AB/UK/İsviçre'den erişim)
Google'ın UMP onay formunu gösteriyor — bu, Google'ın "EU User Consent
Policy"sinin bir gereği. Kullanıcı Ayarlar → "📋 Reklam Onayını Yönet"
üzerinden tercihini istediği an değiştirebilir (`showPrivacyOptions()`).
Bu akış AdMob hesabı gerçek ID'lerle çalışsa da test modunda da sorunsuz
tetiklenir; gerçek davranışı görmek için gerçek bir Android cihazda
`npx cap run android` ile test edilmeli (tarayıcı simülasyonu UMP'yi
kapsamaz, sadece reklam izle/coin akışını simüle eder).

### Telif/lisans
- `LICENSE`: oyunun kendi kodu/varlıkları için "tüm hakları saklı" bildirimi
  (telif sahibi: Ali Aslan). Play Console'daki geliştirici adıyla aynı olmalı.
- `THIRD_PARTY_LICENSES.md` + uygulama içi `www/licenses.html`: Capacitor ve
  AdMob eklentisinin MIT lisans metinlerini içerir (MIT, dağıtırken telif
  bildiriminin korunmasını şart koşar).
- Yayından önce "Neon Yörünge" isminin başka bir Play Store uygulamasıyla
  çakışmadığını manuel kontrol et (otomatik marka taraması yapılmadı).

## 6) Test cihazında çalıştırma

Bağlı bir Android cihaz veya çalışan bir emulator varsa:

```bash
npm run cap:sync
npx cap run android
```

Yoksa `npm run android:debug` ile üretilen debug APK'yı (`android/app/build/outputs/apk/debug/app-debug.apk`)
`adb install app-debug.apk` ile kendi telefonuna kurabilirsin.
