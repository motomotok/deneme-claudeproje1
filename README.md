# 🌌 Neon Yörünge

Tek dosyalık, tarayıcıda çalışan bir refleks/arcade oyunu. Kurulum yok, sunucu yok — iPad, telefon veya bilgisayarda `index.html`'i aç, oyna.

🎮 **Oyna:** https://motomotok.github.io/deneme-claudeproje1/

## Nasıl oynanır?

Merkezdeki yıldızın etrafında **üç halka** var ve orbun bu halkalardan birinde dönüyor.

- **Ekrana dokun** (veya `Boşluk` tuşu) → orb sırayla iç → orta → dış → iç halkaya geçer.
- Halkalar arası geçerken çarpışmazsın — bu senin kaçış hamlen!
- ⭐ **Yıldız** → puan + combo
- 🌟 **Altın yıldız** → combo katlanır, ekstra puan
- ☄️ **Asteroit** → bir can gider (3 canın var)

## ✨ Özellikler

- 🏠 **Çok ekranlı menü** — Ana Menü, Nasıl Oynanır, Ayarlar, İstatistikler
- ❤️ **Can sistemi** — 3 can + çarpışma sonrası kısa dokunulmazlık (tek asteroit oyunu bitirmez)
- 🎁 **Güç-yükseltmeleri:**
  - 🛡️ **Kalkan** — bir çarpışmayı emer
  - ⏱️ **Yavaşlatma** — orbu bir süre yavaşlatır
  - 🧲 **Mıknatıs** — yıldızları her halkadan çeker
- 📈 **Seviye ilerlemesi** — zamanla artan seviye, hızlanan tempo, "SEVİYE UP" efekti
- 🎨 **4 tema** — Neon, Gün Batımı, Matrix, Buz (renk paleti değişir)
- ⏸️ **Duraklat** — oyun içi duraklat/devam (butonla veya `P`/`Esc`)
- ⚙️ **Ayarlar** — ses aç/kapa + tema seçimi (kaydedilir)
- 📊 **İstatistikler** — en iyi skor, toplam yıldız, oynanan oyun, en yüksek seviye
- 🏆 **Yeni rekor** rozeti, combo çarpanı, parçacık efektleri, ekran sarsıntısı

Tüm ilerleme ve ayarlar tarayıcında (`localStorage`) saklanır.

## Kontroller

| Girdi | Etki |
|-------|------|
| Dokunma / sol tık | Sonraki halkaya geç |
| `Boşluk` | Halka değiştir / oyunu başlat |
| `P` veya `Esc` | Duraklat / devam |

## Çalıştırma

`index.html` dosyasına çift tıkla — bu kadar. Ya da GitHub Pages ile yayında oyna (yukarıdaki link).

## Teknik

- Saf HTML + CSS + JavaScript (harici kütüphane yok)
- Canvas 2D ile çizim, WebAudio ile sesler
- Dokunma (touch) ve klavye desteği, retina/DPR uyumlu
- Basit bir durum makinesiyle ekran yönetimi (menü/oyun/duraklat/bitiş)

Claude ile birlikte, deneme amaçlı yapıldı. 🚀
