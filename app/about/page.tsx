import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDF6E3] dark:bg-[#0f0f1e] transition-colors duration-300" dir="rtl">
      <Navbar />

      <section className="bg-gradient-to-br from-[#1E88E5] to-[#43A047] py-20 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-black mb-6">من نحن</h1>
          <p className="text-2xl leading-relaxed opacity-95">
            منصة تيسير AI - أول منصة عربية ذكية لدعم مصابي الدسلكسيا
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#1a1a2e] p-10 rounded-3xl shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1E88E5] to-[#42A5F5] rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-[#1E88E5] mb-4">رؤيتنا</h2>
            <p className="text-xl leading-loose text-[#2C3E50] dark:text-gray-300">
              عالم لا يشعر فيه أي طفل عربي بالعجز بسبب صعوبات التعلم.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1a1a2e] p-10 rounded-3xl shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-[#43A047] to-[#66BB6A] rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-[#43A047] mb-4">رسالتنا</h2>
            <p className="text-xl leading-loose text-[#2C3E50] dark:text-gray-300">
              توفير أدوات ذكية وسهلة الاستخدام للأهل والمعلمين.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}