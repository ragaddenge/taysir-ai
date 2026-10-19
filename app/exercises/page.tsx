'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ExercisesPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const exercises = [
    {
      question: 'اختر الكلمة الصحيحة إملائياً:',
      options: ['هاذا', 'هذا', 'هاذه', 'هاذ'],
      correct: 1
    },
    {
      question: 'أي كلمة مكتوبة بشكل صحيح؟',
      options: ['مدرسه', 'مدرسة', 'مدرست', 'مدرس'],
      correct: 1
    },
    {
      question: 'اختر الكلمة التي تحتوي على نقاط صحيحة:',
      options: ['تلا', 'تلة', 'تله', 'تلاّ'],
      correct: 1
    },
    {
      question: 'ما هو الشكل الصحيح للكلمة؟',
      options: ['يكتب', 'يكتُب', 'يكتِب', 'يكتَب'],
      correct: 0
    },
    {
      question: 'اختر الكلمة الصحيحة:',
      options: ['الشمس', 'الشّمس', 'الشّمسُ', 'كلها صحيحة'],
      correct: 3
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === exercises[currentExercise].correct;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const restart = () => {
    setCurrentExercise(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  if (showResult) {
    const percentage = Math.round((score / exercises.length) * 100);
    return (
      <div className="min-h-screen bg-[#FDF6E3] py-12 px-6 flex items-center justify-center" dir="rtl">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="text-8xl mb-6"></div>
          <h1 className="text-5xl font-black text-[#1E88E5] mb-6">أحسنت!</h1>
          <p className="text-3xl mb-4 text-[#2C3E50]">
            نتيجتك: <span className="text-[#43A047] font-black">{score}</span> من {exercises.length}
          </p>
          <div className="text-7xl font-black text-[#43A047] mb-8">{percentage}%</div>
          
          <div className="space-y-4">
            <Link href="/exercises" onClick={restart} className="block w-full bg-[#1E88E5] text-white py-4 rounded-2xl text-2xl font-bold hover:bg-[#1565C0] transition-all">
              🔄 إعادة التمارين
            </Link>
            <Link href="/games" className="block w-full bg-[#E53935] text-white py-4 rounded-2xl text-2xl font-bold hover:bg-[#C62828] transition-all">
              🎮 انتقل للألعاب
            </Link>
            <Link href="/" className="block w-full bg-gray-200 text-[#2C3E50] py-4 rounded-2xl text-2xl font-bold hover:bg-gray-300 transition-all">
               العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const exercise = exercises[currentExercise];

  return (
    <div className="min-h-screen bg-[#FDF6E3] py-12 px-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-block mb-6 text-[#1E88E5] text-xl font-bold hover:underline">
          ← العودة للرئيسية
        </Link>

        <h1 className="text-5xl font-black text-center mb-4 text-[#1E88E5]">التمارين التفاعلية</h1>
        <p className="text-2xl text-center mb-12 text-[#2C3E50]/80">تمارين مخصصة لتحسين مهاراتك الإملائية</p>

        {/* Progress Bar */}
        <div className="bg-white rounded-full h-4 mb-8 overflow-hidden shadow-md">
          <div 
            className="bg-gradient-to-r from-[#1E88E5] to-[#43A047] h-full transition-all duration-500"
            style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-center text-xl font-bold mb-8 text-[#2C3E50]">
          السؤال {currentExercise + 1} من {exercises.length}
        </p>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold mb-8 text-[#2C3E50]">{exercise.question}</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {exercise.options.map((option, index) => {
              let buttonStyle = 'bg-[#FDF6E3] hover:bg-[#1E88E5]/10 border-2 border-[#1E88E5]/20';
              
              if (selectedAnswer !== null) {
                if (index === exercise.correct) {
                  buttonStyle = 'bg-[#43A047] text-white border-2 border-[#43A047]';
                } else if (index === selectedAnswer && !isCorrect) {
                  buttonStyle = 'bg-[#E53935] text-white border-2 border-[#E53935]';
                } else {
                  buttonStyle = 'bg-gray-100 border-2 border-gray-200 opacity-50';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => selectedAnswer === null && handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`p-6 rounded-2xl text-2xl font-bold transition-all ${buttonStyle} disabled:cursor-not-allowed`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {isCorrect !== null && (
            <div className={`mt-6 p-4 rounded-xl text-center text-2xl font-bold ${
              isCorrect ? 'bg-[#43A047]/10 text-[#43A047]' : 'bg-[#E53935]/10 text-[#E53935]'
            }`}>
              {isCorrect ? '✅ إجابة صحيحة! أحسنت!' : '❌ إجابة خاطئة، الإجابة الصحيحة ملونة بالأخضر'}
            </div>
          )}
        </div>

        {/* Score */}
        <div className="mt-8 text-center">
          <span className="bg-white px-8 py-4 rounded-2xl shadow-lg text-2xl font-bold text-[#1E88E5]">
            النقاط: {score} / {currentExercise + (isCorrect !== null ? 1 : 0)}
          </span>
        </div>
      </div>
    </div>
  );
}