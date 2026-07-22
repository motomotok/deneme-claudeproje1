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
www/game/battlepass-ui.js → Sezon Bileti (battle-pass) ekranının DOM render'ı
www/game/input.js        → tüm buton/dokunma/klavye event listener'ları
www/game/main.js         → bootstrap (en son yüklenir, tek seferlik başlatma çağrıları)
www/privacy.html         → Gizlilik Politikası / KVKK aydınlatma metni (TR+EN)
www/licenses.html        → uygulama içi açık kaynak lisans metinleri
www/ads.js               → oyunun çağırdığı genel Ads API + tarayıcıda reklam simülasyonu
www/native-ads-bundle.js → derlenmiş dosya (elle DÜZENLEME), src/native-ads.js'den üretilir
src/native-ads.js        → gerçek AdMob (Capacitor) + UMP onay entegrasyonunun KAYNAK dosyası
www/premium.js           → "Reklamsız Premium" IAP köprüsü (cordova-plugin-purchase, bundlesiz)
www/season-pass.js       → "Sezon Bileti" (battle-pass premium) IAP köprüsü, premium.js ile aynı desen
www/playgames.js         → Play Games Services köprüsü (@openforge/capacitor-game-connect, bundlesiz)
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
2. **Kimlik doğrulama**: Google, yeni bireysel hesaplardan T.C. kimlik/pasaport ile kimlik
   doğrulaması istiyor — bu birkaç gün sürebilir, $25 ödemesinden ayrı bir adım.
3. Yeni uygulama oluştur, mağaza listeleme bilgilerini doldur — **hazır metinler ve görseller
   için `STORE_LISTING.md` ve `store-assets/` klasörüne bak**, hepsi kopyala-yapıştıra hazır.
4. İçerik derecelendirmesi anketini doldur, gizlilik politikası URL'si ekle (reklam SDK'sı
   kullanıldığı için "reklam gösteriyor" ve "veri toplama" beyanları gerekiyor — Play Console
   bu formu adım adım yönlendirir; hazır cevaplar için aşağıdaki "Data Safety formu" bölümüne bak).

### ⚠️ Kapalı test (closed testing) zorunluluğu
Google, 2023'ten beri **yeni bireysel geliştirici hesaplarının** uygulamayı herkese açık
yayına (production) almadan önce en az **12 test kullanıcısıyla, kesintisiz 14 gün** kapalı
test yapmasını şart koşuyor. Bunu atlayamazsın. Pratikte:
1. Play Console'da bir "Closed testing" track'i oluştur, `app-release.aab`'ı oraya yükle.
2. En az 12 kişinin e-postasını (arkadaş/aile) test listesine ekle, onlara katılım linkini gönder.
3. Bu 12 kişinin **gerçekten uygulamayı yükleyip açması** gerekiyor (sadece davet yetmez).
4. 14 gün dolup şartlar sağlanınca Play Console "production'a geçebilirsin" der.
Bu yüzden yayın planını buna göre yap — son ana bırakma, en az 2 hafta önceden başlat.

## 3) İmzalı release (AAB) üretme

✅ **Bu adım tamamlandı** — release keystore zaten oluşturuldu ve `android/app/build.gradle`
otomatik olarak `android/keystore.properties` dosyasından okuyup imzalıyor.

- `neon-yorunge-release.keystore` — repo kökünde, **git'e dahil DEĞİL** (`.gitignore`'da)
- `android/keystore.properties` — keystore şifreleri, **git'e dahil DEĞİL**

⚠️ **KRİTİK — bu iki dosyayı KAYBETME:** Play Store, bir uygulamanın her güncellemesinin
**aynı imza anahtarıyla** imzalanmasını şart koşar. Bu keystore'u veya şifresini kaybedersen,
uygulamayı bir daha ASLA güncelleyemez, yeni bir paket adıyla sıfırdan yayınlamak zorunda
kalırsın (tüm kullanıcı/yorum/rating geçmişini kaybedersin). **Şimdi yap:**
`neon-yorunge-release.keystore` dosyasını ve `android/keystore.properties` içindeki şifreleri
(ör. bir parola yöneticisine) bu bilgisayar dışında en az bir yere yedekle.

Yeni bir release almak için:

```bash
npm run cap:sync
cd android
gradlew.bat bundleRelease      # android/app/build/outputs/bundle/release/app-release.aab üretir
```

Üretilen `.aab` dosyası doğrudan Play Console'a yüklenir. Her yeni sürüm için
`android/app/build.gradle`'daki `versionCode`'u 1 artırıp `versionName`'i güncellemeyi unutma.

### Play App Signing
Play Console ilk yüklemede "Play App Signing"e kaydolmanı önerecek (varsayılan ve önerilen
seçenek) — bu durumda yukarıdaki keystore senin **upload key**'in olur, Google kendi
sunucusunda ayrı bir imzalama anahtarı tutar. Yine de upload key'i kaybetmemek gerekir.

## 4) Reklam/Coin ekonomisi — nerede ne var

- **Oyun sonu geçiş reklamı**: her oyunda DEĞİL, rastgele **2 veya 3 oyunda bir** gösterilir
  (oyuncuyu yormamak için) — `www/game/screens.js` içinde `adGamesLeft`/`rollAdInterval()`.
  `stats.premiumNoAds` true ise (Premium satın alınmışsa) hiç gösterilmez.
- **"Reklam İzle → Coin"**: oyun-sonu ve mağaza ekranlarındaki buton, `watchAdForCoins()`'i
  çağırır. Ödül: `REWARD_AD_COINS = 25` yıldız tozu, günlük limit `DAILY_AD_REWARD_CAP = 10`
  (her iki sabit de `www/game/data.js` içinde, `addStardust` fonksiyonunun hemen altında).
  Bu, Premium kullanıcılar için de aktif kalır (isteğe bağlı/opt-in olduğu için zorlayıcı değil).
- **Revive ("son canla devam et")**: son can gidince `offerRevive()` tetiklenir, reklam
  izlenirse `lives=1` ile oyun kaldığı yerden devam eder; oyun başına sadece bir kez kullanılabilir
  (`session.revivedUsed`).
- **Mağaza fiyatları**: ekonominin çok kolay kazanılmaması için tüm kozmetik/takviye
  fiyatları yükseltildi (`www/game/data.js` — THEMES/SKINS/TRAILS/SUNS/RINGSTYLES/BOOSTS,
  ör. Vaporwave teması 250→400 🪙).
- **Genişletilmiş kozmetik kataloğu**: 2 yeni tema (İnferno, Semavi), 3 yeni orb
  rengi + Sezon Bileti'ne özel "Nova Orb", 2 yeni iz (Kuantum, Hayalet İz), 2 yeni
  güneş (Kuasar, Süpernova) ve 2 yeni halka stili (Nabız, Devre) — tamamı canvas
  gradient/şekil ile üretiliyor, dış görsel varlık yok (`www/game/data.js` kataloglar,
  `www/game/render.js` → `drawSun()`/`drawRing()`/`drawTrail()` yeni stil dalları).
- **Rakip/hedef sistemi**: gerçek arkadaş verisi olmadığı için (backend/sosyal giriş yok)
  Subway Surfers'daki "arkadaşını geç" hissi rastgele bir isim + mantıklı bir hedef puanla
  simüle ediliyor. `www/game/data.js` → `RIVAL_NAMES`, `ensureRival()` (yeni hedef =
  mevcut en iyi skor + %15-30 artış, ilk seferde 300-700 arası). Menüde
  `#rivalLine`'da gösterilir, hedef geçilince oyun-sonunda kutlama toast'ı çıkar ve
  yeni bir rakip belirlenir. `turkishAccusative()` fonksiyonu isim eklerini (Tolga'yı,
  Ahmet'i, Onur'u gibi) doğru Türkçe dilbilgisiyle üretir.
- Tarayıcıda (Capacitor olmadan) çalışırken reklam akışları `www/ads.js` içindeki
  simülasyon overlay'i ile çalışır — gerçek reklam SDK'sı devreye girmeden test edebilirsin.

### 🔥 Oyuncu Bağlılığı (Retention) Mekanikleri

Hepsi tamamen istemci tarafında (`localStorage`), sunucu/backend gerektirmez.

- **Günlük Giriş Serisi**: Uygulama her açıldığında `main.js` içinde bir kez
  `handleDailyReturn()` çağrılır (`www/game/data.js`). Art arda gün geçtikçe
  `stats.loginStreak` artar, `LOGIN_STREAK_REWARDS = [20,30,40,60,80,100,150]`
  tablosuna göre ödül verilir (7. günden sonra döngü tekrarlar). Menüde
  `#streakLine`'da her zaman görünür. Bir gün atlanırsa (art arda gelmezse)
  seri 1'e sıfırlanır.
- **Geri Dönüş Ödülü**: Aynı `handleDailyReturn()` fonksiyonu, son girişten bu yana
  **3+ gün** geçtiyse `Math.min(300, gün*20)` 🪙 bonus verir ("👋 Seni özledik!").
  Bu, giriş serisi ödülüne ek olarak verilir (seri zaten sıfırlanmış olur çünkü
  ardışık gün değildir).
- **Günün Fırsatı**: Mağaza her açıldığında (`goShop()` → `ensureDailyDeal()`)
  tarih-seed'li RNG ile kozmetik kataloglardan (tema/orb/iz/güneş/halka) bir
  öğe seçilip **%30 indirim** uygulanır — gün boyunca sabit kalır, ertesi gün
  değişir. Mağazada 🔥 rozeti ve üstü çizili eski fiyatla gösterilir
  (`DEAL_DISCOUNT`, `ensureDailyDeal()`, `effectivePrice()` — `data.js`).
- **Hafta Sonu Coin Bonusu**: Cuma/Cumartesi/Pazar günleri oyun-içi kazanılan
  yıldız tozunda **+%20** (`weekendMult()` — `data.js`; uygulandığı yerler:
  `engine.js` coin toplama ve `screens.js` oyun-sonu puan bonusu).
- **Rakipler Ligi**: İstatistikler ekranında (`#leagueCard`), tek bir rastgele
  rakip yerine (mevcut `ensureRival()`/menü banner'ı, değişmedi) **5 kademelik**
  artan hedef listesi (`ensureRivalLeague()` — `data.js`), her biri farklı
  rastgele isim+skor, geçilenler ✅ ile işaretlenir. **Not:** Bu, gerçek
  arkadaş verisi DEĞİL — hâlâ yerel simülasyon. Gerçek bir "arkadaşlarını geç"
  özelliği için Google Play Games Services (bulut kayıt + OAuth + Play
  Console'da ayrı bir kurulum, `google-services.json`/SHA-1 parmak izi
  gerektirir) entegre edilmesi gerekir — bu, AdMob/IAP'tan bağımsız,
  ayrı ve daha büyük bir iş olarak ileride ele alınabilir.

### 💎 Premium (Reklamsız) — uygulama içi satın alma

`www/premium.js`, native ortamda otomatik enjekte edilen `window.CdvPurchase`
(cordova-plugin-purchase) global objesini kullanır — ads.js'ten farklı olarak
bundle gerektirmez, npm paketi Cordova plugin sistemi üzerinden doğrudan çalışır.

**Play Console'da yapman gerekenler (kod tarafı hazır):**
1. Play Console → Monetize → Products → In-app products → yeni ürün oluştur.
2. Ürün ID'sini **tam olarak** `remove_ads` yap (`www/premium.js`'deki `PRODUCT_ID` ile
   birebir eşleşmeli).
3. Tip: "Yönetilmeyen ürün" (managed product / non-consumable — bir kez alınır, kalıcıdır).
4. Fiyatı Türkiye için ~49 TL olacak şekilde ayarla (Google diğer ülkeler için otomatik
   dönüştürür, tam 49 TL karşılığı olmayabilir — bu normaldir).
5. Uygulama en az bir test track'ine (closed testing) yüklenmeden IAP ürünleri
   test edilemez/aktif olmaz — bu yüzden Premium satın alma gerçek cihazda ancak
   uygulama Play Console'a yüklendikten sonra test edilebilir.

**Nasıl çalışır:**
- `www/premium.js` sadece ürünü `register()` eder (kaydeder + event handler bağlar);
  gerçek `store.initialize()` çağrısı `main.js`'de, hem Premium hem Sezon Bileti (aşağıya
  bkz.) register olduktan SONRA, tek seferlik yapılır (cordova-plugin-purchase tüm
  ürünlerin önce register edilip sonra tek bir initialize ile başlatılmasını bekliyor).
  Ürün zaten sahipse `stats.premiumNoAds=true` yapılır ve reklamlar tamamen kesilir.
- Ayarlar ekranındaki "💎 Reklamsız Premium" butonu `Premium.purchase()`'ı tetikler,
  Google'ın kendi satın alma diyaloğunu açar.
- Web/tarayıcı sürümünde (`window.CdvPurchase` yokken) buton sadece bir bilgi toast'ı
  gösterir, hiçbir şeyi bozmaz.
- ⚠️ Bu plugin **Google Play Billing** kütüphanesini kullanıyor ve bu kütüphane
  minSdk 23 + compileSdk/targetSdk 35 gerektiriyor — bu yüzden `android/variables.gradle`
  (minSdk 22→23, compileSdk/targetSdk 34→35) ve `android/build.gradle` (AGP 8.2.1→8.5.2,
  Gradle wrapper 8.2.1→8.7) güncellendi. Android 5.1 (API 22) desteği kaldırıldı —
  günümüzde pratikte hiç kullanıcısı kalmamış bir sürüm.

### 🎫 Sezon Bileti (Battle-Pass) — ücretsiz + ücretli çizgi

Aylık sıfırlanan bir ilerleme sistemi (menüden "🎫 SEZON" ile açılır). Her oyun
sonunda `stats.seasonXp` artar (`www/game/screens.js` → `gameOver()`), 10 kademeli
`SEASON_TIERS` tablosuna göre (`www/game/data.js`) ücretsiz ödüller herkese açık,
ücretli çizgi (`stats.seasonPremium`) her kademede ekstra 🪙 + son kademede özel
"Nova Orb" kozmetiği verir. `ensureSeason()` her ay (`YYYY-MM` değiştiğinde) XP'yi,
claim'leri ve premium durumunu otomatik sıfırlar — **her ay yeniden satın alınması
gerekir**, bu yüzden IAP tipi non-consumable değil **consumable**.

**Play Console'da yapman gerekenler:**
1. Play Console → Monetize → Products → In-app products → yeni ürün oluştur.
2. Ürün ID'sini **tam olarak** `season_pass` yap (`www/season-pass.js`'deki
   `PRODUCT_ID` ile birebir eşleşmeli).
3. Tip: **Tüketilebilir ürün (consumable)** — bu kritik, "Yönetilmeyen ürün"
   (non-consumable) seçilirse ay sonunda otomatik yeniden satılamaz.
4. Fiyatı Türkiye için ~29 TL olacak şekilde ayarla (yer tutucu metin budur,
   gerçek fiyat Play Console'dan gelince otomatik güncellenir).
5. `remove_ads` gibi, bu ürün de ancak uygulama bir test track'ine yüklendikten
   sonra gerçek cihazda test edilebilir.

### 🏆 Play Games Services — gerçek skor tablosu/rakip bağlantısı

`@openforge/capacitor-game-connect` paketiyle entegre edildi (`www/playgames.js`).
Mevcut yerel "Rakipler Ligi" (İstatistikler ekranı) **aynen kalıyor** — bu, gerçek
bir Play Console kurulumu olmadan da çalışan bağımsız bir sistem. Play Games Services
sadece isteğe bağlı, ek bir "gerçek skor tablosu" katmanı ekliyor.

⚠️ **Not:** Bu paketin en güncel sürümü (v5.0.2, Aralık 2023) npm'de resmi olarak
Capacitor v3-v5'i hedefliyor; projemiz Capacitor v6 kullanıyor. `--legacy-peer-deps`
ile kurulup gerçek Android derlemesiyle (`gradlew assembleDebug`/`bundleRelease`)
test edildi ve **başarıyla derlendi** — plugin `@CapacitorPlugin` (Capacitor'ün
modern annotation tabanlı otomatik-kayıt sistemi) kullandığı için `MainActivity.java`'da
manuel bir değişiklik gerekmedi. Yine de gerçek bir Android cihazda oturum açma/skor
gönderme akışı, ancak aşağıdaki Play Console kurulumu tamamlanıp uygulama bir test
track'ine yüklendikten sonra fiilen doğrulanabilir.

**Play Console'da yapman gerekenler:**
1. Play Console → Büyüt (Grow) → Play Games Services → "Yeni oyun oluştur" ile
   projeyi Play Games Services'e bağla.
2. Oluşan **proje numarasını** (App ID) `android/app/src/main/res/values/strings.xml`
   içindeki `game_services_project_id` string'ine gir (şu an `YOUR_GAME_SERVICES_PROJECT_ID`
   placeholder'ı var).
3. Play Games Services → Leaderboards → yeni bir skor tablosu oluştur, aldığın
   **Leaderboard ID**'yi `www/playgames.js` içindeki `LEADERBOARD_ID` sabitine gir
   (şu an `YOUR_LEADERBOARD_ID` placeholder'ı var).
4. Play Games Services → OAuth istemcileri: imzalama sertifikanın SHA-1 parmak izini
   (release keystore'undan `keytool -list -v -keystore neon-yorunge-release.keystore`
   ile alınır) OAuth istemcisine ekle.
5. Test kullanıcı e-postalarını (senin ve test cihazlarındaki Google hesapları)
   Play Games Services test listesine ekle — eklenmeyen hesaplar oturum açamaz.

**Nasıl çalışır:**
- Uygulama açılışında native ortamda sessizce `PlayGames.signIn()` denenir; başarısız
  olursa (henüz kurulum tamamlanmadıysa) sessizce yutulur, oyunu bozmaz.
- Ayarlar ekranındaki "🏆 Play Games ile Bağlan" butonu (sadece native'de görünür)
  bağlı değilse giriş yapar, bağlıysa skor tablosunu açar.
- Her klasik/zaman/günlük oyun sonunda (zen hariç), bağlıysa skor otomatik gönderilir.

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
