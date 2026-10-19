'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // <-- تمت إضافة استيراد الفوتر

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3] dark:bg-[#0f0f1e] transition-colors duration-300" dir="rtl">
      <Navbar />

      <section className="bg-gradient-to-br from-[#1E88E5] to-[#43A047] py-20 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-7xl mb-6">💬</div>
          <h1 className="text-6xl font-black mb-6">تواصل معنا</h1>
          <p className="text-2xl leading-relaxed opacity-95">
            نحن هنا لسماعك! لديك سؤال، اقتراح، أو تحتاج إلى دعم؟
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-[#1a1a2e] p-8 rounded-3xl shadow-xl text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#1E88E5] to-[#42A5F5] rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black mb-3 text-[#1E88E5]">البريد الإلكتروني</h3>
            <a href="mailto:info@taysir.ai" className="text-[#1E88E5] font-bold hover:underline">info@taysir.ai</a>
          </div>

          <div className="bg-white dark:bg-[#1a1a2e] p-8 rounded-3xl shadow-xl text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#43A047] to-[#66BB6A] rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black mb-3 text-[#43A047]">الهاتف</h3>
            <a href="tel:+201000000000" className="text-[#43A047] font-bold hover:underline">+20 100 000 0000</a>
          </div>

          <div className="bg-white dark:bg-[#1a1a2e] p-8 rounded-3xl shadow-xl text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#8E24AA] to-[#AB47BC] rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black mb-3 text-[#8E24AA]">الموقع</h3>
            <p className="text-[#8E24AA] font-bold">القاهرة، مصر</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white dark:bg-[#1a1a2e]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black mb-6 text-[#2C3E50] dark:text-white text-center">أرسل لنا رسالة</h2>

          {submitted ? (
            <div className="bg-[#43A047]/10 border-2 border-[#43A047] rounded-3xl p-12 text-center">
              <div className="text-7xl mb-4">✅</div>
              <h3 className="text-3xl font-black text-[#43A047] mb-3">تم إرسال رسالتك بنجاح!</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <input 
                type="text" 
                required 
                placeholder="الاسم الكامل" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 dark:bg-[#0f0f1e] dark:text-white rounded-xl text-lg focus:border-[#1E88E5] focus:outline-none" 
              />
              <input 
                type="email" 
                required 
                placeholder="البريد الإلكتروني" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 dark:bg-[#0f0f1e] dark:text-white rounded-xl text-lg focus:border-[#1E88E5] focus:outline-none" 
              />
              <select 
                required 
                value={formData.subject} 
                onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 dark:bg-[#0f0f1e] dark:text-white rounded-xl text-lg focus:border-[#1E88E5] focus:outline-none"
              >
                <option value="">اختر الموضوع</option>
                <option value="استفسار">استفسار عام</option>
                <option value="دعم">دعم فني</option>
                <option value="اقتراح">اقتراح تحسين</option>
              </select>
              <textarea 
                required 
                placeholder="الرسالة" 
                value={formData.message} 
                onChange={(e) => setFormData({...formData, message: e.target.value})} 
                rows={6} 
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 dark:bg-[#0f0f1e] dark:text-white rounded-xl text-lg focus:border-[#1E88E5] focus:outline-none resize-none" 
              />
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white py-4 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all"
              >
                📤 إرسال الرسالة
              </button>
            </form>
          )}
        </div>
      </section>

      {/* <-- تم استبدال الفوتر البسيط بمكون الفوتر الاحترافي --> */}
      <Footer />
    </div>
  );
}