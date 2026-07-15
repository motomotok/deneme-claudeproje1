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

- 🏠 Çok ekranlı menü: Ana Menü, Mod Seç, Nasıl Oynanır, Ayarlar, İstatistikler
- ❤️ Can sistemi + çarpışma sonrası kısa dokunulmazlık
- 🎁 6 güç-yükseltmesi: 🛡️ Kalkan, ⏱️ Yavaşlatma, 🧲 Mıknatıs, ⏳ Zaman Dondurma, 💰 Puan Çarpanı (x2), 👻 Hayalet
- 👾 3 asteroit türü: klasik, gezici (halka değiştiren), bomba (büyük çarpışma alanı)
- 💎 Nadir elmas koleksiyonu
- 🔄 Çift dokunuşla yön değiştirme
- 🔥 5 combo'da bir "STREAK" bonusu + yavaş çekim efekti
- 📈 Seviye ilerlemesi, hızlanan tempo, "SEVİYE UP" efekti
- 🎨 4 tema (Neon, Gün Batımı, Matrix, Buz)
- 🎭 5 kilit açılabilir orb rengi (başarımlarla açılır)
- 🏆 10 başarım, 📅 günlük görev sistemi
- 🏅 Yerel liderlik tablosu (en iyi 5 skor)
- 📤 Skor paylaşma (Web Share API / panoya kopyalama)
- 📳 Titreşim geri bildirimi (Android'de çalışır; iOS Safari Vibration API'yi desteklemez)
- 🌠 Kayan yıldızlar, ekran sarsıntısı, parçacık efektleri
- ⏸️ Duraklat/Devam
- ♿ Erişilebilirlik: Büyük Butonlar, Sol El Modu, Renk Körü Dostu Simgeler
- ⚙️ Ayarlar: ses aç/kapa, tema, orb rengi (hepsi kaydedilir)
- 📲 **PWA**: ana ekrana eklenebilir, uygulama gibi tam ekran açılır, ilk ziyaretten sonra çevrimdışı çalışır

Tüm ilerleme ve ayarlar tarayıcında (`localStorage`) saklanır.

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

`index.html` dosyasına çift tıkla — bu kadar. Ya da GitHub Pages ile yayında oyna (yukarıdaki link).

## Teknik

- Saf HTML + CSS + JavaScript (harici kütüphane yok)
- Canvas 2D ile çizim, WebAudio ile sesler, Vibration API ile titreşim
- `mulberry32` seeded RNG ile günlük mod herkese aynı düzeni sunar
- Basit bir durum makinesiyle ekran yönetimi
- Service Worker (`sw.js`) + Web App Manifest ile PWA desteği

Claude ile birlikte, deneme amaçlı yapıldı. 🚀
