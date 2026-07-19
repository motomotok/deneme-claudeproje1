# 🌌 Neon Yörünge

Tek dosyalık, tarayıcıda çalışan bir refleks/arcade oyunu. Kurulum yok, sunucu yok — iPad, telefon veya bilgisayarda aç, oyna. Artık PWA olarak ana ekrana da eklenebilir.

🎮 **Oyna:** https://motomotok.github.io/deneme-claudeproje1/

## Nasıl oynanır?

Merkezdeki yıldızın etrafında **üç halka** var ve orbun bu halkalardan birinde dönüyor. Ekran ikiye bölünür:

- **Sağ tarafa dokun** → dış halkaya geç.
- **Sol tarafa dokun** → iç halkaya geç.
- Uçlarda (en iç/en dış) fazladan dokunma bir şey yapmaz — sınır orada kilitlenir.
- Halkalar arası geçerken çarpışmazsın — kaçış hamlen!
- ⭐ Yıldız, 🌟 altın yıldız, 💎 elmas → puan + combo
- 🪙 Yıldız tozu jetonu → mağaza parası
- ☄️ Asteroit / gezici asteroit / bomba asteroit → can gider

## 🎮 Oyun Modları

| Mod | Açıklama |
|-----|----------|
| 🌌 Klasik | Canlarla sonsuz mod |
| ⏱️ Zaman Yarışı | 60 saniyede en yüksek skor |
| 🧘 Zen | Asteroit yok, sadece topla, istediğin an bitir |
| 📅 Günlük | Herkese aynı (tohum tabanlı) düzen, günde tek deneme |

Klasik ve Zaman Yarışı modlarında **Kolay / Normal / Zor** zorluk seçilebilir.

## ✨ Özellikler

- 🏠 Çok ekranlı menü: Ana Menü, Mod Seç, 🛒 Mağaza, Nasıl Oynanır, Ayarlar, İstatistikler
- ❤️ Can sistemi + çarpışma sonrası kısa dokunulmazlık
- 🎁 6 güç-yükseltmesi: 🛡️ Kalkan, ⏱️ Yavaşlatma, 🧲 Mıknatıs, ⏳ Zaman Dondurma, 💰 Puan Çarpanı (x2), 👻 Hayalet
- 👾 3 asteroit türü: klasik, gezici (halka değiştiren), bomba (büyük çarpışma alanı)
- 💎 Nadir elmas koleksiyonu
- 🔥 5 combo'da bir "STREAK" bonusu + yavaş çekim efekti
- 📈 Seviye ilerlemesi, hızlanan tempo, "SEVİYE UP" efekti
- 🏆 10 başarım (her biri yıldız tozu ödülü verir), 📅 günlük görev sistemi
- 🏅 Yerel liderlik tablosu (en iyi 5 skor)
- 📤 Skor paylaşma (Web Share API / panoya kopyalama)
- 📳 Titreşim geri bildirimi (Android'de çalışır; iOS Safari Vibration API'yi desteklemez)
- 🌠 Kayan yıldızlar, ekran sarsıntısı, parçacık efektleri
- ⏸️ Duraklat/Devam
- ♿ Erişilebilirlik: Büyük Butonlar, Sol El Modu, Renk Körü Dostu Simgeler
- 📲 **PWA**: ana ekrana eklenebilir, uygulama gibi tam ekran açılır, ilk ziyaretten sonra çevrimdışı çalışır

Tüm ilerleme, satın alımlar ve ayarlar tarayıcında (`localStorage`) saklanır.

## 🪙 Yıldız Tozu & Kozmik Mağaza

Oyun içinde beliren bakır-altın **yıldız tozu jetonlarını** topla; ayrıca her oyun sonunda puanına göre bonus kazanırsın, başarım açtıkça ekstra ödül gelir. Ana menüden **🛒 MAĞAZA**'ya gidip 6 kategoride harca:

| Kategori | İçerik | Kilitlenme |
|----------|--------|------------|
| 🎨 Temalar | 4 ücretsiz + 3 premium (Vaporwave, Altın Çağ, Kara Madde) | Ücretsiz / Yıldız tozu |
| 🔮 Orb Skinleri | 5 başarımla açılan + 5 satın alınabilir (biri gökkuşağı efektli "Prizma") | Başarım / Yıldız tozu |
| ✨ İz Efektleri | Klasik, Kıvılcım, Kuyruklu Yıldız, Gökkuşağı, Piksel, Kurdele | Yıldız tozu |
| ☀️ Güneş Skinleri | Klasik, Kızıl Dev, Kara Delik, Nebula, Kristal Çekirdek | Yıldız tozu |
| 💫 Halka Stilleri | Klasik, Noktalı, Parlak, Çift Çizgi | Yıldız tozu |
| 🚀 Başlangıç Takviyeleri | Kalkanla Başla, Yavaş Açılış, Şanslı Açılış, Toz Rüzgarı — tek kullanımlık, Mod Seç ekranından oyuna başlamadan önce takılır | Yıldız tozu (tüketilebilir, birden fazla alınabilir) |

Satın aldığın kozmetikler kalıcı olarak takılır (equip); takviyeler ise envanterine eklenir ve bir sonraki oyunda tek seferlik kullanılır.

## Kontroller

| Girdi | Etki |
|-------|------|
| Sağ yarıya dokun / tık | Dış halkaya geç |
| Sol yarıya dokun / tık | İç halkaya geç |
| `→` / `D` | Dış halkaya geç |
| `←` / `A` | İç halkaya geç |
| `Boşluk` | Bağlama göre: mod seç / tekrar oyna / devam et |
| `P` veya `Esc` | Duraklat / devam |

## iPad'de ana ekrana ekleme

Safari'de siteyi aç → Paylaş (□↑) → **"Ana Ekrana Ekle"**. Artık simgesine dokunarak uygulama gibi tam ekran açabilirsin.

## Çalıştırma

`www/index.html` dosyasına çift tıkla — bu kadar. Ya da GitHub Pages ile yayında oyna (yukarıdaki link).

## Android uygulaması

Proje Capacitor ile gerçek bir Android uygulamasına paketlenebiliyor; reklamlarla
(geçiş reklamı + ödüllü reklam + "izle, coin kazan") para kazanma altyapısı kurulu.
Kurulum, build ve AdMob/Play Console hesap adımları için bkz. [MOBILE_APP.md](MOBILE_APP.md).

## Gizlilik ve Lisans

[Gizlilik Politikası / KVKK](www/privacy.html) · [Açık Kaynak Lisansları](www/licenses.html) · [Telif Hakkı](LICENSE)

## Teknik

- Saf HTML + CSS + JavaScript (harici kütüphane yok), oyun mantığı `www/game/*.js` altında modüllere ayrılmış
- Canvas 2D ile çizim, WebAudio ile sesler, Vibration API ile titreşim
- `mulberry32` seeded RNG ile günlük mod herkese aynı düzeni sunar
- Basit bir durum makinesiyle ekran yönetimi
- Service Worker (`sw.js`) + Web App Manifest ile PWA desteği

Claude ile birlikte, deneme amaçlı yapıldı. 🚀
