'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showWord, setShowWord] = useState(true);

  const questionsBank = [
    { correct: "مدرسة", wrong: ["مدرسه", "مدرست"] },
    { correct: "كتاب", wrong: ["كتايب", "كتّاب"] },
    { correct: "شمس", wrong: ["شمص", "شمسَ"] },
    { correct: "قمر", wrong: ["قمَر", "قمرَ"] },
    { correct: "بحر", wrong: ["بَحر", "بحرَ"] },
    { correct: "سماء", wrong: ["سما", "سماأ"] },
    { correct: "أرض", wrong: ["ارض", "أرْض"] },
    { correct: "قلم", wrong: ["قلمَ", "قلما"] },
    { correct: "بيت", wrong: ["بيتٌ", "بييت"] },
    { correct: "باب", wrong: ["بابٌ", "بااب"] },
    { correct: "تفاح", wrong: ["تفاحٌ", "تفّاح"] },
    { correct: "تفاحة", wrong: ["تفاحه", "تفاحت"] },
    { correct: "ولد", wrong: ["وَلَد", "ولدا"] },
    { correct: "بنت", wrong: ["بنتٌ", "بنتا"] },
    { correct: "شجرة", wrong: ["شجره", "شجرت"] },
    { correct: "زهرة", wrong: ["زهره", "زهرت"] },
    { correct: "سمكة", wrong: ["سمكه", "سمكت"] },
    { correct: "عصفور", wrong: ["عصفورٌ", "عصفورَ"] },
    { correct: "قطة", wrong: ["قطه", "قطت"] },
    { correct: "كلب", wrong: ["كلبٌ", "كلبا"] }
  ];

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = (gameType: string) => {
    setActiveGame(gameType);
    setScore(0);
    setMessage('');
    setSelectedOption(null);
    
    if (gameType === 'spelling') {
      loadNewSpellingQuestion();
    } else if (gameType === 'speed') {
      setTimeLeft(30);
      setShowWord(true);
      loadNewSpeedQuestion();
      setTimeout(() => setShowWord(false), 2000);
    } else if (gameType === 'findwrong') {
      loadNewFindWrongQuestion();
    }
  };

  const loadNewSpellingQuestion = () => {
    const randomQ = questionsBank[Math.floor(Math.random() * questionsBank.length)];
    setCurrentQuestion(randomQ);
    const allOptions = [randomQ.correct, ...randomQ.wrong];
    setOptions(shuffleArray(allOptions));
  };

  const loadNewSpeedQuestion = () => {
    const randomQ = questionsBank[Math.floor(Math.random() * questionsBank.length)];
    setCurrentQuestion(randomQ);
    const allOptions = [randomQ.correct, ...randomQ.wrong];
    setOptions(shuffleArray(allOptions));
    setShowWord(true);
    setTimeout(() => setShowWord(false), 2000);
  };

  const loadNewFindWrongQuestion = () => {
    const randomQ = questionsBank[Math.floor(Math.random() * questionsBank.length)];
    setCurrentQuestion(randomQ);
    const allOptions = [randomQ.correct, ...randomQ.wrong];
    setOptions(shuffleArray(allOptions));
  };

  useEffect(() => {
    let timer: any;
    if (activeGame === 'speed' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeGame, timeLeft]);

  const checkAnswer = (answer: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(answer);
    
    if (answer === currentQuestion.correct) {
      setScore(score + 10);
      setMessage('✅ إجابة صحيحة! أحسنت!');
    } else {
      setMessage(`❌ الإجابة الصحيحة هي: ${currentQuestion.correct}`);
    }
    
    setTimeout(() => {
      setMessage('');
      setSelectedOption(null);
      if (activeGame === 'spelling') {
        loadNewSpellingQuestion();
      } else if (activeGame === 'speed') {
        loadNewSpeedQuestion();
      } else if (activeGame === 'findwrong') {
        loadNewFindWrongQuestion();
      }
    }, 2000);
  };

  const resetGame = () => {
    setActiveGame(null);
    setScore(0);
    setTimeLeft(0);
    setMessage('');
    setSelectedOption(null);
    setCurrentQuestion(null);
    setShowWord(true);
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3] py-12 px-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-block mb-6 text-[#1E88E5] text-xl font-bold hover:underline">
          ← العودة للرئيسية
        </Link>

        <h1 className="text-5xl font-black text-center mb-4 text-[#E53935]">الألعاب التعليمية</h1>
        <p className="text-2xl text-center mb-12 text-[#2C3E50]/80">تعلّم والمرح في نفس الوقت!</p>

        {!activeGame ? (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:scale-105 transition-transform cursor-pointer" onClick={() => startGame('spelling')}>
              <div className="text-7xl mb-4">🧩</div>
              <h3 className="text-3xl font-bold text-[#1E88E5] mb-3">اختر الكلمة الصحيحة</h3>
              <p className="text-lg text-[#2C3E50]/70">اختر الإملاء الصحيح من بين الخيارات</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:scale-105 transition-transform cursor-pointer" onClick={() => startGame('speed')}>
              <div className="text-7xl mb-4"></div>
              <h3 className="text-3xl font-bold text-[#E53935] mb-3">القراءة السريعة</h3>
              <p className="text-lg text-[#2C3E50]/70">احفظ الكلمة في ثانيتين ثم اخترها!</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:scale-105 transition-transform cursor-pointer" onClick={() => startGame('findwrong')}>
              <div className="text-7xl mb-4"></div>
              <h3 className="text-3xl font-bold text-[#43A047] mb-3">اكتشف الخطأ</h3>
              <p className="text-lg text-[#2C3E50]/70">اضغط على الكلمة المكتوبة بشكل خاطئ</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
            <div className="flex justify-between items-center mb-8">
              <button onClick={resetGame} className="bg-gray-200 px-6 py-2 rounded-xl font-bold hover:bg-gray-300">خروج</button>
              <div className="text-2xl font-black text-[#1E88E5]">النقاط: {score}</div>
              {activeGame === 'speed' && <div className="text-2xl font-black text-[#E53935]">الوقت: {timeLeft}ث</div>}
            </div>

            {message && (
              <div className={`text-2xl font-bold mb-6 p-4 rounded-xl ${
                message.includes('✅') ? 'bg-[#43A047]/10 text-[#43A047]' : 'bg-[#E53935]/10 text-[#E53935]'
              }`}>
                {message}
              </div>
            )}

            {activeGame === 'spelling' && currentQuestion && (
              <div>
                <p className="text-3xl mb-6 font-bold">اختر الكلمة المكتوبة بشكل صحيح:</p>
                <div className="bg-[#FDF6E3] p-6 rounded-xl mb-8">
                  <p className="text-2xl text-[#2C3E50]">الكلمة المطلوبة: <span className="font-black text-[#1E88E5] text-4xl">{currentQuestion.correct}</span></p>
                </div>
                <div className="flex gap-4 justify-center flex-wrap">
                  {options.map((option, index) => {
                    let buttonClass = 'bg-[#1E88E5] text-white hover:bg-[#1565C0]';
                    if (selectedOption !== null) {
                      if (option === currentQuestion.correct) buttonClass = 'bg-[#43A047] text-white';
                      else if (option === selectedOption) buttonClass = 'bg-[#E53935] text-white';
                      else buttonClass = 'bg-gray-300 text-gray-500';
                    }
                    return (
                      <button key={index} onClick={() => checkAnswer(option)} disabled={selectedOption !== null} className={`px-8 py-4 rounded-2xl text-2xl font-bold transition-all ${buttonClass} disabled:cursor-not-allowed`}>
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeGame === 'speed' && currentQuestion && (
              <div>
                <p className="text-3xl mb-6 font-bold">احفظ الكلمة جيداً... ستختفي خلال ثانيتين!</p>
                <div className="bg-[#FDF6E3] p-10 rounded-xl mb-8 min-h-[120px] flex items-center justify-center">
                  {showWord ? (
                    <span className="text-7xl font-black text-[#E53935] animate-pulse">{currentQuestion.correct}</span>
                  ) : (
                    <span className="text-5xl font-black text-gray-400">??? اختفت الكلمة!</span>
                  )}
                </div>
                {!showWord && (
                  <div>
                    <p className="text-2xl mb-4 font-bold">ما هي الكلمة التي ظهرت؟</p>
                    <div className="flex gap-4 justify-center flex-wrap">
                      {options.map((option, index) => {
                        let buttonClass = 'bg-[#E53935] text-white hover:bg-[#C62828]';
                        if (selectedOption !== null) {
                          if (option === currentQuestion.correct) buttonClass = 'bg-[#43A047] text-white';
                          else if (option === selectedOption) buttonClass = 'bg-gray-500 text-white';
                          else buttonClass = 'bg-gray-300 text-gray-500';
                        }
                        return (
                          <button key={index} onClick={() => checkAnswer(option)} disabled={selectedOption !== null} className={`px-8 py-4 rounded-2xl text-2xl font-bold transition-all ${buttonClass} disabled:cursor-not-allowed`}>
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeGame === 'findwrong' && currentQuestion && (
              <div>
                <p className="text-3xl mb-6 font-bold">اضغط على الكلمة المكتوبة بشكل <span className="text-[#E53935]">خاطئ</span>:</p>
                <p className="text-xl mb-8 text-[#2C3E50]/70">بين هذه الكلمات، واحدة فقط مكتوبة بشكل غير صحيح</p>
                <div className="flex gap-4 justify-center flex-wrap">
                  {options.map((option, index) => {
                    let buttonClass = 'bg-[#43A047] text-white hover:bg-[#2E7D32]';
                    if (selectedOption !== null) {
                      if (option !== currentQuestion.correct) buttonClass = 'bg-[#E53935] text-white';
                      else if (option === selectedOption) buttonClass = 'bg-gray-500 text-white';
                      else buttonClass = 'bg-gray-300 text-gray-500';
                    }
                    return (
                      <button key={index} onClick={() => checkAnswer(option === currentQuestion.correct ? 'wrong' : option)} disabled={selectedOption !== null} className={`px-8 py-4 rounded-2xl text-2xl font-bold transition-all ${buttonClass} disabled:cursor-not-allowed`}>
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}