import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, MapPin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: null, message: '' });

    try {
      const mailtoLink = `mailto:info@hyforensic.com?subject=İletişim Formu: ${formData.name}&body=Gönderen: ${formData.name}%0D%0AE-posta: ${formData.email}%0D%0A%0D%0AMesaj:%0D%0A${formData.message}`;
      window.location.href = mailtoLink;
      
      setStatus({
        type: 'success',
        message: 'E-posta uygulamanız açılıyor...'
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="bg-slate-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">İletişim</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center text-gray-300">
              <Phone className="w-6 h-6 mr-3 text-blue-400" />
              <span>+90 (224) 235 5036</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Mail className="w-6 h-6 mr-3 text-blue-400" />
              <span>info@hyforensic.com</span>
            </div>
            <div className="flex items-center text-gray-300">
              <MapPin className="w-6 h-6 mr-3 text-blue-400" />
              <span>Bursa, Türkiye</span>
            </div>
            <a 
              href="https://wa.me/902242355036" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              WhatsApp ile İletişime Geçin
            </a>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Adınız"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-blue-400 focus:outline-none"
            />
            <input
              type="email"
              placeholder="E-posta Adresiniz"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-blue-400 focus:outline-none"
            />
            <textarea
              placeholder="Mesajınız"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-blue-400 focus:outline-none"
            ></textarea>
            {status.message && (
              <div className={`p-3 rounded-lg ${
                status.type === 'success' ? 'bg-green-600' : 'bg-red-600'
              } text-white`}>
                {status.message}
              </div>
            )}
            <button
              type="submit"
              disabled={sending}
              className={`w-full ${
                sending ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
              } text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center`}
            >
              {sending ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}