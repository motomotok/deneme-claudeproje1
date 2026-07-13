# 🌌 Neon Yörünge

Tek dosyalık, tarayıcıda çalışan bir refleks oyunu. Kurulum yok, sunucu yok — iPad, telefon veya bilgisayarda `index.html`'i aç, oyna.

## Nasıl oynanır?

Merkezdeki yıldızın etrafında **üç halka** var ve orbun bu halkalardan birinde dönüyor.

- **Ekrana dokun** (veya `Boşluk` tuşu) → orb sırayla iç → orta → dış → iç halkaya geçer.
- ⭐ **Yıldız** topla → puan + combo
- 🌟 **Altın yıldız** → combo katlanır, ekstra puan
- ☄️ **Asteroit**'e çarpma → oyun biter!

Zaman geçtikçe hız ve asteroit yoğunluğu artar. Combo yaptıkça her yıldız daha çok puan getirir. En iyi skorun tarayıcında kaydedilir.

## Çalıştırma

```
index.html dosyasına çift tıkla — bu kadar.
```

Ya da yayınlamak istersen GitHub Pages'i aç (Settings → Pages → Branch: `main`), oyun otomatik yayına girer.

## Teknik

- Saf HTML + CSS + JavaScript (harici kütüphane yok)
- Canvas 2D ile çizim, WebAudio ile sesler
- Dokunma (touch) ve klavye desteği, retina/DPR uyumlu

Claude ile birlikte, deneme amaçlı yapıldı. 🚀
