import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import AccessibilityMenu from './components/AccessibilityMenu';

export const metadata: Metadata = {
  title: 'منصة تيسير AI - أول منصة عربية ذكية لدعم مصابي الدسلكسيا',
  description: 'منصة تيسير AI تستخدم الذكاء الاصطناعي لتحليل أخطاء الكتابة والقراءة لدى مصابي الدسلكسيا، وتوليد تمارين علاجية مخصصة فورياً',
  keywords: 'دسلكسيا, تعليم, ذكاء اصطناعي, عربي, أطفال, صعوبات تعلم, تيسير, AI',
  authors: [{ name: 'Taysir AI Team' }],
  openGraph: {
    title: 'منصة تيسير AI',
    description: 'أول منصة عربية ذكية لدعم مصابي الدسلكسيا',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ThemeProvider>
          {children}
          <AccessibilityMenu />
        </ThemeProvider>
      </body>
    </html>
  );
}