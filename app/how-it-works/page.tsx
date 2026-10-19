import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // <-- تمت إضافة استيراد الفوتر

export default function HowItWorksPage() {
  const steps = [
    { number: '01', title: 'إنشاء حساب', description: 'يسجل ولي الأمر حساباً جديداً ويُنشئ ملفاً شخصياً للطفل يتضمن العمر والصف الدراسي ومستوى الصعوبة.', icon: '👤', color: 'from-[#1E88E5] to-[#42A5F5]' },
    { number: '02', title: 'المسح الذكي', description: 'يتم تصوير ورقة كتابة الطفل أو رفع صورة، ويقوم الذكاء الاصطناعي بتحليل الأخطاء الإملائية والنحوية تلقائياً.', icon: '📸', color: 'from-[#43A047] to-[#66BB6A]' },
    { number: '03', title: 'تحليل الأنماط', description: 'يحدد النظام أنماط الأخطاء المتكررة (مثل: التاء المربوطة، الهمزة، النقاط) ويصنفها حسب نوع الصعوبة.', icon: '🧠', color: 'from-[#8E24AA] to-[#AB47BC]' },
    { number: '04', title: 'تمارين مخصصة', description: 'يُولّد النظام تمارين علاجية مخصصة تستهدف نقاط الضعف المحددة، مع مستويات صعوبة متدرجة.', icon: '🎯', color: 'from-[#E53935] to-[#EF5350]' },
    { number: '05', title: 'متابعة التقدم', description: 'يتابع ولي الأمر تقدم الطفل عبر لوحة تحكم تفاعلية تعرض الإحصائيات والإنجازات والتوصيات الذكية.', icon: '📊', color: 'from-[#FFB300] to-[#FFC107]' },
    { number: '06', title: 'تقارير دورية', description: 'يصدر النظام تقارير أسبوعية وشهرية مفصلة يمكن مشاركتها مع المعلمين والمختصين لمتابعة الحالة.', icon: '📄', color: 'from-[#00ACC1] to-[#26C6DA]' }
  ];

  const features = [
    { title: 'دقة عالية', stat: '95%', description: 'تحليل الأخطاء بدقة عالية', icon: '🎯' },
    { title: 'سرعة فائقة', stat: '<3s', description: 'نتائج فورية خلال ثوانٍ', icon: '⚡' },
    { title: 'تمارين ذكية', stat: '500+', description: 'تمرين علاجي مكيف', icon: '🎮' },
    { title: 'دعم عربي', stat: '100%', description: 'واجهة وتمارين بالعربية', icon: '🇸🇦' }
  ];

  const technologies = [
    { name: 'Next.js 16', description: 'إطار عمل React الأحدث', icon: '⚛️' },
    { name: 'TypeScript', description: 'لغة برمجة آمنة', icon: '📘' },
    { name: 'Tailwind CSS', description: 'تصميم حديث وسريع', icon: '🎨' },
    { name: 'AI/ML', description: 'ذكاء اصطناعي متقدم', icon: '🤖' },
    { name: 'OpenAI API', description: 'تحليل ذكي للصور', icon: '🧠' },
    { name: 'Vercel', description: 'استضافة سحابية', icon: '☁️' }
  ];

  return (
    <div className="min-h-screen bg-[#FDF6E3] dark:bg-[#0f0f1e] transition-colors duration-300" dir="rtl">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1E88E5] to-[#43A047] py-20 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-7xl mb-6">⚙️</div>
          <h1 className="text-6xl font-black mb-6">كيف نعمل؟</h1>
          <p className="text-2xl leading-relaxed opacity-95">
            6 خطوات بسيطة لتحويل تحدي التعلم إلى رحلة نجاح ممتعة
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16 text-[#2C3E50] dark:text-white transition-colors">
            رحلة الطفل مع تيسير AI
          </h2>
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-6 bg-white dark:bg-[#1a1a2e] p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all">
                <div className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-2xl flex flex-col items-center justify-center text-white shadow-lg flex-shrink-0`}>
                  <div className="text-4xl mb-1">{step.icon}</div>
                  <div className="text-xl font-black">{step.number}</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-[#2C3E50] dark:text-white mb-2 transition-colors">{step.title}</h3>
                  <p className="text-lg text-[#2C3E50]/80 dark:text-gray-300 leading-relaxed transition-colors">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Stats */}
      <section className="py-20 px-6 bg-white dark:bg-[#1a1a2e] transition-colors">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16 text-[#2C3E50] dark:text-white transition-colors">
            لماذا تيسير AI؟
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-[#FDF6E3] dark:bg-[#0f0f1e] p-6 rounded-3xl text-center hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="text-5xl mb-3">{feature.icon}</div>
                <div className="text-4xl font-black text-[#1E88E5] dark:text-[#42A5F5] mb-2 transition-colors">{feature.stat}</div>
                <h3 className="text-xl font-black text-[#2C3E50] dark:text-white mb-2 transition-colors">{feature.title}</h3>
                <p className="text-[#2C3E50]/80 dark:text-gray-300 transition-colors">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16 text-[#2C3E50] dark:text-white transition-colors">
            التقنيات المستخدمة
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-white dark:bg-[#1a1a2e] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-4">
                <div className="text-4xl">{tech.icon}</div>
                <div>
                  <h3 className="text-xl font-black text-[#2C3E50] dark:text-white transition-colors">{tech.name}</h3>
                  <p className="text-[#2C3E50]/70 dark:text-gray-400 transition-colors">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6">جاهز للبدء؟</h2>
          <p className="text-xl mb-8 opacity-95">انضم إلى آلاف الأسر التي تستخدم تيسير AI</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/login" className="bg-white text-[#1E88E5] px-8 py-4 rounded-full text-xl font-bold hover:shadow-2xl transition-all">
              🔐 ابدأ الآن
            </Link>
            <Link href="/dashboard" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-white hover:text-[#1E88E5] transition-all">
              📊 لوحة التحكم
            </Link>
          </div>
        </div>
      </section>

      {/* <-- تم استبدال الفوتر البسيط بمكون الفوتر الاحترافي --> */}
      <Footer />
    </div>
  );
}