# Üçüncü Taraf Lisansları / Third-Party Licenses

Bu uygulama, aşağıdaki açık kaynak yazılım bileşenlerini kullanır. Bu
bileşenlerin tamamı **MIT Lisansı** altında dağıtılmaktadır; MIT lisansı,
yazılımı dağıtırken orijinal telif bildirimi ve izin metninin korunmasını
şart koşar — bu dosya o şartı yerine getirir. Bu liste ayrıca uygulama
içinde Ayarlar → "📄 Açık Kaynak Lisansları" üzerinden de görüntülenir
(bkz. `www/licenses.html`).

This app uses the following open-source software components, all
distributed under the **MIT License**, which requires the original
copyright and permission notice to be preserved when redistributing the
software — this file fulfills that requirement. This list is also shown
in-app via Settings → "📄 Open Source Licenses" (see `www/licenses.html`).

---

## @capacitor/core, @capacitor/android

```
MIT License

Copyright (c) 2017-present Drifty Co.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## @capacitor-community/admob

```
MIT License

Copyright (c) 2021 Capacitor Community

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Google Mobile Ads SDK (AdMob)

Google Mobile Ads SDK, Google LLC'nin kendi [Şartlar ve Koşulları](https://developers.google.com/admob/android/sdk-license)
altında dağıtılır ve `@capacitor-community/admob` eklentisi aracılığıyla
Android derlemesine (Gradle bağımlılığı olarak) dahil edilir. Bu depoda
kaynak kodu bulunmaz, ikili (binary) bağımlılık olarak Google'ın kendi
Maven deposundan çekilir.

---

*Not: `esbuild`, `@capacitor/cli` ve `@capacitor/assets` yalnızca geliştirme
sırasında (build-time) kullanılır; uygulamaya gömülmezler, bu yüzden
çalışan uygulamaya dahil olmazlar ve burada listelenmemiştir.*
