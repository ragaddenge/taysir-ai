'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // <-- تمت إضافة استيراد الفوتر

export default function DashboardPage() {
  const childName = 'أحمد محمد';
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    // قراءة البيانات المحفوظة من الماسح
    const savedScans = JSON.parse(localStorage.getItem('taysir_scan_results') || '[]');
    const savedStats = JSON.parse(localStorage.getItem('taysir_dashboard_stats') || '{}');
    setScanResults(savedScans);
    setStats(savedStats);
  }, []);

  const weeklyProgress = [
    { day: 'السبت', score: 75 },
    { day: 'الأحد', score: 82 },
    { day: 'الاثنين', score: 78 },
    { day: 'الثلاثاء', score: 88 },
    { day: 'الأربعاء', score: 92 },
    { day: 'الخميس', score: 95 },
    { day: 'الجمعة', score: 90 }
  ];

  const achievements = [
    { id: 1, title: 'أول تحليل', icon: '🎯', color: 'from-[#1E88E5] to-[#42A5F5]', unlocked: true },
    { id: 2, title: '10 تمارين', icon: '✅', color: 'from-[#43A047] to-[#66BB6A]', unlocked: true },
    { id: 3, title: 'أسبوع متواصل', icon: '🔥', color: 'from-[#E53935] to-[#EF5350]', unlocked: true },
    { id: 4, title: '100% دقة', icon: '⭐', color: 'from-[#FFB300] to-[#FFC107]', unlocked: false },
    { id: 5, title: 'بطل القراءة', icon: '📚', color: 'from-[#8E24AA] to-[#AB47BC]', unlocked: false },
    { id: 6, title: 'خبير الإملاء', icon: '🏆', color: 'from-[#00ACC1] to-[#26C6DA]', unlocked: false }
  ];

  const recentActivities = [
    { type: 'تحليل', title: 'مسح ورقة كتابة جديدة', time: 'منذ ساعتين', icon: '📸', color: 'bg-[#1E88E5]' },
    { type: 'تمرين', title: 'أكمل تمرين التاء المربوطة', time: 'منذ 5 ساعات', icon: '✅', color: 'bg-[#43A047]' },
    { type: 'لعبة', title: 'حقق 100 نقطة في القراءة السريعة', time: 'أمس', icon: '🎮', color: 'bg-[#E53935]' },
    { type: 'إنجاز', title: 'حصل على شارة "أول تحليل"', time: 'منذ يومين', icon: '🏅', color: 'bg-[#FFB300]' }
  ];

  const recommendations = [
    { title: 'تركيز على النقاط', desc: 'أحمد يحتاج تمارين إضافية على وضع النقاط', priority: 'عالي', color: 'border-[#E53935]' },
    { title: 'تمارين الهمزة', desc: 'تحسن ملحوظ، استمر في التمارين اليومية', priority: 'متوسط', color: 'border-[#FFB300]' },
    { title: 'القراءة الجهرية', desc: 'قراءة 15 دقيقة يومياً لتحسين الطلاقة', priority: 'منخفض', color: 'border-[#43A047]' }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0a0a1a] transition-colors duration-300" dir="rtl">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#1E88E5] to-[#43A047] rounded-3xl p-8 mb-8 text-white shadow-xl">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-black mb-2">مرحباً بعودتك! 👋</h1>
              <p className="text-xl opacity-95">إليك ملخص تقدم {childName} هذا الأسبوع</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-5xl font-black">{stats.averageAccuracy || 92}%</div>
              <div className="text-lg opacity-90">معدل هذا الأسبوع</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#1E88E5]/10 rounded-xl flex items-center justify-center text-2xl">📊</div>
              <span className="text-[#43A047] font-bold text-sm">+12% ↑</span>
            </div>
            <div className="text-3xl font-black text-[#2C3E50] dark:text-white">{stats.totalExercises || 24}</div>
            <div className="text-[#2C3E50]/70 dark:text-gray-400">تمرين مكتمل</div>
          </div>

          <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#43A047]/10 rounded-xl flex items-center justify-center text-2xl">🏆</div>
              <span className="text-[#43A047] font-bold text-sm">+3 ↑</span>
            </div>
            <div className="text-3xl font-black text-[#2C3E50] dark:text-white">3</div>
            <div className="text-[#2C3E50]/70 dark:text-gray-400">شارات جديدة</div>
          </div>

          <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#E53935]/10 rounded-xl flex items-center justify-center text-2xl">🔥</div>
              <span className="text-[#E53935] font-bold text-sm">7 أيام</span>
            </div>
            <div className="text-3xl font-black text-[#2C3E50] dark:text-white">12</div>
            <div className="text-[#2C3E50]/70 dark:text-gray-400">سلسلة يومية</div>
          </div>

          <div className="bg-white dark:bg-[#1a1a2e] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#8E24AA]/10 rounded-xl flex items-center justify-center text-2xl">⭐</div>
              <span className="text-[#8E24AA] font-bold text-sm">المستوى 5</span>
            </div>
            <div className="text-3xl font-black text-[#2C3E50] dark:text-white">450</div>
            <div className="text-[#2C3E50]/70 dark:text-gray-400">نقطة إجمالية</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          
          {/* Progress Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1a1a2e] p-8 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-[#2C3E50] dark:text-white">📈 تقدم الأسبوع</h2>
              <select className="bg-[#F5F7FA] dark:bg-[#0f0f1e] dark:text-white px-4 py-2 rounded-lg font-bold">
                <option>هذا الأسبوع</option>
                <option>الأسبوع الماضي</option>
                <option>هذا الشهر</option>
              </select>
            </div>
            
            <div className="flex items-end justify-between gap-3 h-64">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-sm font-bold text-[#2C3E50] dark:text-gray-300">{day.score}%</div>
                  <div 
                    className="w-full bg-gradient-to-t from-[#1E88E5] to-[#43A047] rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${day.score * 2.2}px` }}
                  ></div>
                  <div className="text-sm text-[#2C3E50]/70 dark:text-gray-400 font-bold">{day.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-[#1a1a2e] p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-black text-[#2C3E50] dark:text-white mb-6">🏆 الإنجازات</h2>
            <div className="grid grid-cols-3 gap-4">
              {achievements.map((badge) => (
                <div 
                  key={badge.id}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all ${
                    badge.unlocked 
                      ? `bg-gradient-to-br ${badge.color} text-white shadow-lg hover:scale-110` 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-1">{badge.icon}</div>
                  <div className="text-xs font-bold leading-tight">{badge.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Scans - الجديد! */}
        {scanResults.length > 0 && (
          <div className="bg-white dark:bg-[#1a1a2e] p-8 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-black text-[#2C3E50] dark:text-white mb-6">📸 آخر التحليلات</h2>
            <div className="space-y-4">
              {scanResults.slice(-5).reverse().map((scan: any, index: number) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-[#F5F7FA] dark:bg-[#0f0f1e] rounded-xl">
                  <div className="w-12 h-12 bg-[#1E88E5] rounded-xl flex items-center justify-center text-2xl">📸</div>
                  <div className="flex-1">
                    <div className="font-bold text-[#2C3E50] dark:text-white">تحليل #{scan.id.slice(-4)}</div>
                    <div className="text-sm text-[#2C3E50]/60 dark:text-gray-400">{scan.date}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-[#43A047]">{scan.accuracy}%</div>
                    <div className="text-xs text-[#2C3E50]/60 dark:text-gray-400">دقة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-[#E53935]">{scan.errors}</div>
                    <div className="text-xs text-[#2C3E50]/60 dark:text-gray-400">أخطاء</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activities & Recommendations */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          
          {/* Recent Activities */}
          <div className="bg-white dark:bg-[#1a1a2e] p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-black text-[#2C3E50] dark:text-white mb-6">📋 آخر النشاطات</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-[#F5F7FA] dark:bg-[#0f0f1e] rounded-xl hover:shadow-md transition-all">
                  <div className={`w-12 h-12 ${activity.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[#2C3E50] dark:text-white">{activity.title}</div>
                    <div className="text-sm text-[#2C3E50]/60 dark:text-gray-400">{activity.time}</div>
                  </div>
                  <span className="text-xs bg-white dark:bg-[#1a1a2e] px-3 py-1 rounded-full font-bold text-[#2C3E50]/70 dark:text-gray-300">
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="bg-white dark:bg-[#1a1a2e] p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-black text-[#2C3E50] dark:text-white mb-6">🤖 توصيات ذكية</h2>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className={`p-5 bg-[#F5F7FA] dark:bg-[#0f0f1e] rounded-xl border-r-4 ${rec.color} hover:shadow-md transition-all`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-[#2C3E50] dark:text-white">{rec.title}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      rec.priority === 'عالي' ? 'bg-[#E53935]/10 text-[#E53935]' :
                      rec.priority === 'متوسط' ? 'bg-[#FFB300]/10 text-[#FFB300]' :
                      'bg-[#43A047]/10 text-[#43A047]'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-[#2C3E50]/80 dark:text-gray-300">{rec.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-[#8E24AA] to-[#1E88E5] rounded-3xl p-8 text-white shadow-xl mb-8">
          <h2 className="text-3xl font-black mb-6">⚡ إجراءات سريعة</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/scanner" className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl text-center hover:bg-white/30 transition-all">
              <div className="text-4xl mb-2">📸</div>
              <div className="font-bold">مسح جديد</div>
            </Link>
            <Link href="/exercises" className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl text-center hover:bg-white/30 transition-all">
              <div className="text-4xl mb-2">🎯</div>
              <div className="font-bold">تمارين</div>
            </Link>
            <Link href="/games" className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl text-center hover:bg-white/30 transition-all">
              <div className="text-4xl mb-2">🎮</div>
              <div className="font-bold">ألعاب</div>
            </Link>
            <Link href="/contact" className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl text-center hover:bg-white/30 transition-all">
              <div className="text-4xl mb-2">📊</div>
              <div className="font-bold">تقرير PDF</div>
            </Link>
          </div>
        </div>
      </div>

      {/* <-- تم إضافة الفوتر الاحترافي هنا --> */}
      <Footer />
    </div>
  );
}