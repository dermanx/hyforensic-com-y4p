import React from 'react';
import { Search, Database, FileSearch, HardDrive } from 'lucide-react';

const services = [
  {
    icon: <Search className="w-8 h-8" />,
    title: "Adli Bilişim İnceleme",
    desc: "Profesyonel dijital delil analizi ve mahkemeye sunulabilir raporlama (Hukuki Mütalaa)"
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "Veri Kurtarma",
    desc: "Silinen veya hasarlı verilerin güvenli bir şekilde kurtarılması"
  },
  {
    icon: <FileSearch className="w-8 h-8" />,
    title: "İOS ve Android Cihazdan Veri Kurtarma",
    desc: "Mobil cihazlardan silinen verilerin güvenli bir şekilde kurtarılması"
  },
  {
    icon: <HardDrive className="w-8 h-8" />,
    title: "Disk İmajlama",
    desc: "Adli kopyalama ve delil bütünlüğü koruma"
  }
];

export default function Services() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Hizmetlerimiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition-colors">
              <div className="text-blue-400 mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-gray-400">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}