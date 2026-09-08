# Hatice — Enes

Hatice için hazırlanmış, GitHub Pages üzerinde çalışan statik ve etkileşimli romantik deneyim.

## Yerel doğrulama

Node.js 20 veya üzeriyle:

```bash
npm run validate
npm test
```

Doğrulama aracı şunları kontrol eder:

- Yayın için gerekli HTML, CSS, JavaScript, MP3 ve fotoğraf parçalarının varlığı
- `index.html` içindeki yerel `src` ve `href` referanslarının boşa çıkmaması
- Dört fotoğraf parçasının geçerli base64 olarak birleşmesi ve JPEG başlığı üretmesi
- Müzik dosyasının geçerli MP3/ID3 başlığı taşıması

Bu kontroller içerik veya tasarımı değiştirmez. Ama eksik yükleme, bozuk fotoğraf parçası ya da yanlış dosya adı nedeniyle GitHub Pages sürümünün sessizce kırılmasını engeller.
