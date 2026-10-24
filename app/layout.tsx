import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import AccessibilityMenu from './components/AccessibilityMenu';
import Navbar from './components/Navbar';
import BackToHome from './components/BackToHome';
import Footer from './components/Footer';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'منصة تيسير AI - دعم ذوي عسر القراءة (الدسلكسيا) بالذكاء الاصطناعي',
  description:
    'منصة تيسير AI تستخدم الذكاء الاصطناعي لرصد مؤشرات محتملة لأخطاء الكتابة العربية من صورة خط اليد، وتقدّم تمارين وألعابًا للتدريب على القراءة والكتابة',
  keywords: [
    'دسلكسيا',
    'عسر القراءة',
    'تعليم',
    'ذكاء اصطناعي',
    'عربي',
    'أطفال',
    'صعوبات تعلم',
    'تيسير',
    'AI',
  ],
  authors: [{ name: 'Taysir AI Team' }],
  openGraph: {
    title: 'منصة تيسير AI',
    description: 'منصة عربية لدعم ذوي عسر القراءة (الدسلكسيا) بالتحليل والتدريب',
    type: 'website',
    locale: 'ar',
  },
};

// يعمل قبل أول رسم للصفحة لتفادي وميض الوضع الفاتح
const initScript = `
  try {
    var d = document.documentElement;
    var s = localStorage.getItem('taysir_dark_mode');
    var dark = s !== null ? s === 'true' : matchMedia('(prefers-color-scheme: dark)').matches;
    var hc = localStorage.getItem('taysir_high_contrast') === 'true';
    d.classList.toggle('dark', dark || hc);
    d.classList.toggle('high-contrast', hc);

    var fs = parseInt(localStorage.getItem('taysir_font_size'), 10);
    if (fs >= 80 && fs <= 200) d.style.fontSize = fs + '%';
    d.classList.toggle('dyslexia-font', localStorage.getItem('taysir_dyslexia_font') === 'true');
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body className={`${tajawal.variable} flex min-h-screen flex-col bg-amber-50 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100`}>
        <ThemeProvider>
          {/* رابط تخطي التنقل: يظهر عند أول ضغطة Tab للوحة المفاتيح */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-gray-900 focus:shadow-lg"
          >
            تخطَّ إلى المحتوى
          </a>
          <Navbar />
          <BackToHome />
          {/* div بدل main: الصفحات نفسها فيها main، ولا يجوز تداخلهم */}
          <div id="main-content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </div>
          <Footer />
          <AccessibilityMenu />
        </ThemeProvider>
      </body>
    </html>
  );
}
