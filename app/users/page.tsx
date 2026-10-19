'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  grade: string;
  level: string;
  parentName: string;
}

export default function UsersPage() {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    level: 'مبتدئ',
    parentName: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('taysir_profiles');
    if (saved) {
      setProfiles(JSON.parse(saved));
    } else {
      const sampleProfiles: ChildProfile[] = [
        {
          id: '1',
          name: 'أحمد محمد',
          age: 8,
          grade: 'الثالث الابتدائي',
          level: 'متوسط',
          parentName: 'محمد أحمد'
        },
        {
          id: '2',
          name: 'فاطمة علي',
          age: 7,
          grade: 'الثاني الابتدائي',
          level: 'مبتدئ',
          parentName: 'علي حسن'
        }
      ];
      setProfiles(sampleProfiles);
      localStorage.setItem('taysir_profiles', JSON.stringify(sampleProfiles));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: ChildProfile = {
      id: Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      grade: formData.grade,
      level: formData.level,
      parentName: formData.parentName
    };
    const updated = [...profiles, newProfile];
    setProfiles(updated);
    localStorage.setItem('taysir_profiles', JSON.stringify(updated));
    setFormData({ name: '', age: '', grade: '', level: 'مبتدئ', parentName: '' });
    setShowForm(false);
  };

  const deleteProfile = (id: string) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    localStorage.setItem('taysir_profiles', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3] py-12 px-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-block mb-6 text-[#1E88E5] text-xl font-bold hover:underline">
          ← العودة للرئيسية
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-black text-[#8E24AA]">المستخدمون</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#8E24AA] text-white px-6 py-3 rounded-2xl text-xl font-bold hover:bg-[#6A1B9A] transition-all"
          >
            {showForm ? 'إلغاء' : '+ مستخدم جديد'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-[#8E24AA] mb-6">إنشاء ملف مستخدم جديد</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="اسم الطفل"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-[#8E24AA] focus:outline-none"
                />
                <input
                  type="number"
                  required
                  placeholder="العمر"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-[#8E24AA] focus:outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="الصف الدراسي"
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  className="p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-[#8E24AA] focus:outline-none"
                />
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  className="p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-[#8E24AA] focus:outline-none"
                >
                  <option value="مبتدئ">مبتدئ</option>
                  <option value="متوسط">متوسط</option>
                  <option value="متقدم">متقدم</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="اسم ولي الأمر"
                  value={formData.parentName}
                  onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                  className="p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-[#8E24AA] focus:outline-none md:col-span-2"
                />
              </div>
              <button type="submit" className="w-full bg-[#8E24AA] text-white py-4 rounded-2xl text-xl font-bold hover:bg-[#6A1B9A] transition-all">
                حفظ الملف
              </button>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-3xl shadow-xl p-6 hover:scale-105 transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="text-6xl">👶</div>
                <button
                  onClick={() => deleteProfile(profile.id)}
                  className="text-[#E53935] hover:text-[#C62828] text-xl"
                >
                  🗑️
                </button>
              </div>
              <h3 className="text-2xl font-bold text-[#8E24AA] mb-2">{profile.name}</h3>
              <div className="space-y-2 text-[#2C3E50]">
                <p className="text-lg">🎂 العمر: <span className="font-bold">{profile.age} سنوات</span></p>
                <p className="text-lg">🎓 الصف: <span className="font-bold">{profile.grade}</span></p>
                <p className="text-lg">📊 المستوى: <span className="font-bold">{profile.level}</span></p>
                <p className="text-lg">‍👩‍👧 ولي الأمر: <span className="font-bold">{profile.parentName}</span></p>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href="/scanner" className="flex-1 bg-[#1E88E5] text-white py-2 rounded-xl text-center font-bold hover:bg-[#1565C0]">
                  📸 تحليل
                </Link>
                <Link href="/exercises" className="flex-1 bg-[#43A047] text-white py-2 rounded-xl text-center font-bold hover:bg-[#2E7D32]">
                   تمارين
                </Link>
              </div>
            </div>
          ))}
        </div>

        {profiles.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-8xl mb-4">📭</div>
            <p className="text-2xl text-[#2C3E50]">لا توجد ملفات بعد. اضغط "مستخدم جديد" للبدء!</p>
          </div>
        )}
      </div>
    </div>
  );
}