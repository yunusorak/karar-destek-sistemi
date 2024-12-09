# Karar Destek Sistemi

## Genel Bakış

Çoklu karar kriterleri kullanarak alternatifleri değerlendiren güçlü bir web uygulaması.

🌐 **Canlı Demo**: [https://decision-yo.vercel.app/](https://decision-yo.vercel.app/)

## Özellikler

- **Karar Kriterleri**:
  - İyimser Kriter
  - Kötümser Kriter
  - Hurwicz Kriteri
  - Eşit Olasılık Kriteri
  - Savage Kriteri

- **Etkileşimli Karar Matrisi**:
  - Dinamik alternatif ve durum yönetimi
  - Anlık puan hesaplamaları
  - Alternatif ekleme/çıkarma
  - Durum sayısını ayarlama

- **Görselleştirme**:
  - Alternatif puanlarını gösteren çubuk grafik
  - Sıralanmış sonuçlar tablosu
  - Responsive tasarım

- **Dışa Aktarma Özellikleri**:
  - PDF rapor oluşturma
  - Özelleştirilebilir proje adı

- **Koyu/Açık Mod**
  - Rahat görüntüleme için tema değiştirme

## Teknolojiler

- React
- Next.js
- Recharts
- Tailwind CSS
- Shadcn/UI Bileşenleri
- html-to-image
- jsPDF

## Kullanım

1. Proje adını belirleyin
2. Karar kriterini seçin
3. Alternatifleri ve durum değerlerini ekleyin
4. Kriter parametrelerini ayarlayın
5. Sonuçları görüntüleyin ve PDF raporunu dışa aktarın

## Kurulum

```bash
git clone https://github.com/kullaniciadi/karar-destek-sistemi.git
cd karar-destek-sistemi
npm install
npm run dev
```