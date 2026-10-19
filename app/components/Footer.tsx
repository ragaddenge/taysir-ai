import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#2C3E50] dark:bg-[#1a1a2e] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-black mb-4">تيسير AI</h3>
          <p className="text-gray-400">أول منصة عربية ذكية لدعم مصابي الدسلكسيا</p>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">روابط سريعة</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="text-gray-400 hover:text-white">الرئيسية</Link></li>
            <li><Link href="/about" className="text-gray-400 hover:text-white">من نحن</Link></li>
            <li><Link href="/contact" className="text-gray-400 hover:text-white">تواصل معنا</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">الخدمات</h4>
          <ul className="space-y-2">
            <li><Link href="/scanner" className="text-gray-400 hover:text-white">الماسح الذكي</Link></li>
            <li><Link href="/exercises" className="text-gray-400 hover:text-white">التمارين</Link></li>
            <li><Link href="/dashboard" className="text-gray-400 hover:text-white">لوحة التحكم</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">تواصل معنا</h4>
          <p className="text-gray-400 mb-2"> info@taysir.ai</p>
          <p className="text-gray-400 mb-2">📱 +20 100 000 0000</p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-2xl">📘</a>
            <a href="#" className="text-2xl"></a>
            <a href="#" className="text-2xl">📷</a>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>© 2026 منصة تيسير AI - جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}