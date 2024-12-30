import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-6">
      <div className="text-center text-gray-400">
        © {new Date().getFullYear()} HYFORENSIC. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}