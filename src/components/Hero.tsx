import React from 'react';
import { Scale } from 'lucide-react';

export default function Hero() {
  return (
    <header className="relative h-[60vh] flex items-center justify-center text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&q=80")',
          opacity: '0.3'
        }}
      />
      <div className="relative z-10 text-center px-4">
        <Scale className="w-16 h-16 mx-auto mb-6 text-blue-400" />
        <h1 className="text-6xl font-bold mb-2">HYFORENSIC</h1>
        <h2 className="text-3xl font-semibold mb-4 text-blue-400">Adli Bilişim Uzmanları</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Dijital delil analizi ve veri kurtarma konusunda uzman ekibimizle yanınızdayız
        </p>
      </div>
    </header>
  );
}