import React from 'react';
import { Star, Quote, ThumbsUp } from 'lucide-react';

const reviews = [
  {
    name: "Ahmet Yılmaz",
    rating: 5,
    comment: "Kritik dosyalarımızı başarıyla kurtardılar. Profesyonel ve güvenilir hizmet.",
    date: "2024-02-15",
    platform: "Google"
  },
  {
    name: "Mehmet Kaya",
    rating: 5,
    comment: "Adli bilişim sürecinde detaylı raporlama ve profesyonel yaklaşım sergilediler.",
    date: "2024-02-10",
    platform: "Google"
  },
  {
    name: "Ayşe Demir",
    rating: 5,
    comment: "Hassas verilerin kurtarılmasında gösterdikleri özen için teşekkürler.",
    date: "2024-02-05",
    platform: "Google"
  },
  {
    name: "Can Özkan",
    rating: 5,
    comment: "Silinen önemli dosyalarımı kurtardılar. Çok teşekkür ederim.",
    date: "2024-01-25",
    platform: "Google"
  }
];

const stats = [
  { label: "Başarılı Veri Kurtarma", value: "1000+" },
  { label: "Adli Analiz", value: "500+" },
  { label: "Yıllık Tecrübe", value: "10+" },
  { label: "Müşteri Memnuniyeti", value: "%98" }
];

export default function Reviews() {
  return (
    <section className="py-20 px-4 bg-slate-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Müşteri Yorumları</h2>
        
        {/* İstatistikler */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Yorumlar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-slate-700 p-6 rounded-lg relative hover:transform hover:scale-105 transition-all duration-300">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-400 opacity-20" />
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-blue-400">{review.platform}</span>
              </div>
              <p className="text-gray-300 mb-4 italic">{review.comment}</p>
              <div className="mt-4 pt-4 border-t border-slate-600">
                <p className="text-white font-semibold">{review.name}</p>
                <p className="text-sm text-gray-400">{new Date(review.date).toLocaleDateString('tr-TR')}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Memnuniyet Notu */}
        <div className="mt-12 text-center bg-slate-700 p-8 rounded-lg">
          <ThumbsUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Güvenilir Adli Bilişim Hizmeti</h3>
          <p className="text-gray-300">
            Dijital delil analizi ve veri kurtarma konusundaki uzmanlığımızla, 
            müşterilerimize en yüksek standartlarda hizmet sunuyoruz.
          </p>
        </div>
      </div>
    </section>
  );
}