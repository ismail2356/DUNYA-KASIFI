# Dünya Kaşifi - Kullanıcı Arayüzü Tasarımı

## Tasarım İlkeleri

### Çocuk Dostu Tasarım
- Büyük, okunaklı yazı tipleri
- Canlı ve çekici renkler
- Basit ve anlaşılır simgeler
- Dokunmatik ekran için optimize edilmiş büyük dokunma alanları

### Erişilebilirlik
- Renk körlüğü uyumlu renk paleti
- Ayarlanabilir yazı tipi boyutu
- Ekran okuyucu desteği
- Basitleştirilmiş navigasyon seçenekleri

### Tutarlılık
- Tüm ekranlarda tutarlı tasarım dili
- Benzer işlevler için benzer kontroller
- Tanıdık simgeler ve metaforlar
- Öngörülebilir etkileşim modelleri

## Ekran Tasarımları

### 1. Açılış ve Giriş Ekranı
- Animasyonlu logo ve karşılama ekranı
- Yeni kullanıcı / Mevcut kullanıcı seçenekleri
- Ebeveyn giriş alanı
- Hızlı başlangıç seçeneği

### 2. Karakter Oluşturma Ekranı
- Avatar düzenleme arayüzü
  - Kaydırılabilir özellik seçenekleri
  - Renk paleti seçimi
  - 3D önizleme
- Ekipman seçim arayüzü
  - Kategori tabanlı ekipman listesi
  - Ekipman detay bilgileri
  - Ekipman önizleme
- Kaşif sertifikası oluşturma
  - İsim girişi
  - Kaşif yemini animasyonu
  - Sertifika önizleme ve paylaşım

### 3. Ana Menü Ekranı
- 3D dünya haritası (ana odak noktası)
- Alt navigasyon çubuğu
  - Profil
  - Harita
  - Görevler
  - Koleksiyon
  - Ayarlar
- Üst bilgi çubuğu
  - Kaşif seviyesi
  - Kazanılan puanlar
  - Tamamlanan görevler

### 4. Dünya Haritası Ekranı
- Etkileşimli 3D dünya modeli
  - Yakınlaştırma/uzaklaştırma kontrolleri
  - Döndürme ve gezinme kontrolleri
  - Ülke ve şehir seçimi
- Rota görünümü
  - Mevcut konum
  - Hedef noktalar
  - Tamamlanan duraklar
- Bilgi kartları
  - Ülke bilgileri
  - İlgi çekici noktalar
  - Görev ipuçları

### 5. Görev Ekranı
- Kategori tabanlı görev listesi
  - Coğrafi görevler
  - Kültürel görevler
  - Dil görevleri
  - Mini oyunlar
- Görev detay kartları
  - Görev açıklaması
  - Zorluk seviyesi
  - Ödül bilgisi
  - İlerleme durumu
- Görev filtreleme ve sıralama seçenekleri

### 6. Pseudo-AR Deneyim Ekranı
- Kamera görüntüsü (arka plan)
- 3D modeller ve sanal içerikler
- Etkileşim kontrolleri
  - Dokunma ve sürükleme
  - Yakınlaştırma/uzaklaştırma
  - Döndürme
- Bilgi balonları ve etiketler

### 7. Mini Oyun Ekranları
- Oyun başlangıç ekranı
  - Oyun açıklaması
  - Zorluk seviyesi seçimi
  - Başlat butonu
- Oyun alanı
  - Oyun elementleri
  - Puan göstergesi
  - Süre/ilerleme çubuğu
- Sonuç ekranı
  - Puan özeti
  - Başarı rozetleri
  - Tekrar oyna/çıkış seçenekleri

### 8. Profil ve İlerleme Ekranı
- Kaşif profili
  - Avatar görünümü
  - Kaşif seviyesi ve unvanı
  - Toplam puan ve başarılar
- Kaşif pasaportu
  - Ziyaret edilen yerler
  - Toplanan damgalar
  - Öğrenilen bilgiler
- İlerleme grafikleri ve istatistikler

### 9. Ayarlar Ekranı
- Genel ayarlar
  - Ses ve müzik kontrolleri
  - Dil seçenekleri
  - Bildirim tercihleri
- Ebeveyn kontrolleri
  - Kullanım süresi limitleri
  - İçerik filtreleme
  - Şifre korumalı ayarlar
- Hesap yönetimi
  - Profil düzenleme
  - Veri yedekleme
  - Yardım ve destek

## Navigasyon Yapısı

### Hiyerarşik Navigasyon
- Ana menü (üst seviye)
  - Dünya haritası
  - Görevler
  - Profil
  - Koleksiyon
  - Ayarlar

### Görev Tabanlı Navigasyon
- Görev seçimi → Görev detayı → Görev aktivitesi → Sonuç ekranı

### Coğrafi Navigasyon
- Dünya → Kıta → Ülke → Şehir → İlgi çekici nokta

## Etkileşim Modelleri

### Dokunmatik Etkileşimler
- Tek dokunuş: Seçim ve aktivasyon
- Çift dokunuş: Yakınlaştırma
- Sürükleme: Gezinme ve hareket ettirme
- Sıkıştırma/genişletme: Yakınlaştırma/uzaklaştırma
- Döndürme: 3D nesneleri döndürme

### Cihaz Hareketi Etkileşimleri
- Eğme: Perspektif değişimi
- Döndürme: 360° görünüm
- Sallama: Özel aktivasyonlar
- Yönlendirme: Pusula ve yön bulma

## Görsel Stil

### Renk Paleti
- Ana renkler:
  - Mavi (#1E88E5): Gökyüzü, okyanus, keşif
  - Yeşil (#43A047): Doğa, ormanlar, macera
  - Turuncu (#FF9800): Enerji, heyecan, aktivite
- Vurgu renkleri:
  - Mor (#7B1FA2): Sihir, hayal gücü
  - Kırmızı (#E53935): Önemli bilgiler, uyarılar
  - Sarı (#FDD835): Ödüller, başarılar

### Tipografi
- Ana başlıklar: Rounded, kalın ve oyuncu bir yazı tipi
- Alt başlıklar: Orta kalınlıkta, okunaklı
- İçerik metni: Yuvarlak hatlı, çocuk dostu
- Boyut hiyerarşisi: Başlıklar (24pt+), Alt başlıklar (18-20pt), İçerik (14-16pt)

### İkonografi
- Basit, anlaşılır ve tutarlı ikon seti
- Yuvarlak hatlı, çocuk dostu tasarım
- Animasyonlu durum değişiklikleri
- Renkli ve ifade dolu simgeler

### Animasyonlar
- Sayfa geçişleri: Yumuşak ve akıcı
- Etkileşim geri bildirimleri: Hızlı ve belirgin
- Ödül animasyonları: Gösterişli ve motive edici
- Karakter animasyonları: İfadeli ve eğlenceli

## Duyarlı Tasarım

### Farklı Ekran Boyutları
- Telefon (dikey): Tek sütun düzeni
- Telefon (yatay): İki sütun düzeni
- Tablet: Çok sütunlu, detaylı düzen

### Performans Optimizasyonu
- Düşük performanslı cihazlar için basitleştirilmiş görseller
- Kademeli yükleme stratejileri
- Önbelleğe alma ve verimli kaynak kullanımı 