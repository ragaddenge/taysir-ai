import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // <-- تمت إضافة استيراد الفوتر

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDF6E3] dark:bg-[#0f0f1e] transition-colors duration-300 flex flex-col" dir="rtl">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-8 pt-16">
        <div className="max-w-4xl text-center">
          <h1 className="text-6xl font-black mb-6 text-[#1E88E5] dark:text-[#42A5F5]">
            منصة تيسير <span className="text-[#43A047]">AI</span>
          </h1>
          
          <p className="text-3xl mb-8 text-[#2C3E50] dark:text-gray-300 leading-relaxed">
            ذكاء يفهم تحديك.. ويصمم حلّك
          </p>
          
          <p className="text-xl mb-12 text-[#2C3E50]/80 dark:text-gray-400 leading-loose max-w-3xl mx-auto">
            أول منصة عربية تستخدم الذكاء الاصطناعي لتحليل أخطاء الكتابة والقراءة 
            لدى مصابي الدسلكسيا، وتوليد تمارين علاجية مخصصة فورياً.
          </p>

          <div className="flex flex-col gap-6 justify-center mb-16 max-w-md mx-auto">
            <Link href="/scanner" className="bg-[#1E88E5] text-white px-12 py-5 rounded-full text-2xl font-bold hover:bg-[#1565C0] transition-all shadow-xl text-center">
              📸 ابدأ المسح الذكي
            </Link>
            
            <Link href="/exercises" className="bg-[#43A047] text-white px-12 py-5 rounded-full text-2xl font-bold hover:bg-[#2E7D32] transition-all shadow-xl text-center">
              🎯 جرب التمارين
            </Link>

            <Link href="/games" className="bg-[#E53935] text-white px-12 py-5 rounded-full text-2xl font-bold hover:bg-[#C62828] transition-all shadow-xl text-center">
              🎮 الألعاب التعليمية
            </Link>

            <Link href="/users" className="bg-[#8E24AA] text-white px-12 py-5 rounded-full text-2xl font-bold hover:bg-[#6A1B9A] transition-all shadow-xl text-center">
              👤 المستخدمون
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white dark:bg-[#1a1a2e] p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#1E88E5] to-[#42A5F5] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-3 text-[#1E88E5] dark:text-[#42A5F5]">تحليل ذكي</h3>
              <p className="text-lg leading-relaxed text-[#2C3E50]/80 dark:text-gray-400">
                يكتشف أنماط الأخطاء في اللغة العربية بدقة عالية
              </p>
            </div>
            
            <div className="bg-white dark:bg-[#1a1a2e] p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#43A047] to-[#66BB6A] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-3 text-[#43A047]">تمارين مخصصة</h3>
              <p className="text-lg leading-relaxed text-[#2C3E50]/80 dark:text-gray-400">
                تمارين تفاعلية مكيفة حسب مستوى كل مستخدم
              </p>
            </div>
            
            <div className="bg-white dark:bg-[#1a1a2e] p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#8E24AA] to-[#AB47BC] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-3 text-[#8E24AA]">تقارير واضحة</h3>
              <p className="text-lg leading-relaxed text-[#2C3E50]/80 dark:text-gray-400">
                متابعة التقدم بشكل مرئي ومحفز للأهل والمختصين
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* <-- تمت إضافة الفوتر الاحترافي هنا --> */}
      <Footer />
    </div>
  );
}