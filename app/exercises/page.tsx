'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Exercise {
  question: string;
  options: string[];
  answer: string;
}

const EXERCISES: Exercise[] = [
  { question: 'اختر الكلمة الصحيحة إملائيًا:', options: ['هاذا', 'هذا', 'هاذه', 'هاذ'], answer: 'هذا' },
  { question: 'أي كلمة مكتوبة بشكل صحيح؟', options: ['مدرسه', 'مدرسة', 'مدرست', 'مدرصة'], answer: 'مدرسة' },
  { question: 'اختر الكلمة المكتوبة بشكل صحيح:', options: ['دهب', 'ذهب', 'ذهت', 'دهت'], answer: 'ذهب' },
  { question: 'أي كلمة مكتوبة بشكل صحيح؟', options: ['حديقه', 'حديقة', 'حديقت', 'حديفة'], answer: 'حديقة' },
  { question: 'اختر الكلمة المكتوبة بشكل صحيح:', options: ['الشمس', 'الشمش', 'السمس', 'الشمص'], answer: 'الشمس' },
];

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const shuffledSet = (): Exercise[] =>
  shuffle(EXERCISES).map((e) => ({ ...e, options: shuffle(e.options) }));

// ---------- أيقونات SVG ----------
const ICONS = {
  check: 'M5 13l4 4L19 7',
  cross: 'M6 6l12 12M18 6L6 18',
  refresh: 'M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5',
  arrow: 'M19 12H5M11 6l-6 6 6 6',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  up: 'M12 19V5M6 11l6-6 6 6',
} as const;

function Icon({ name, className = 'h-7 w-7' }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

// ---------- أنماط مشتركة ----------
const card = 'rounded-3xl bg-white shadow-2xl dark:bg-[#1a1a2e]';
const focusRing =
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-amber-300 dark:focus-visible:ring-offset-[#1a1a2e]';
const btnBlue =
  'bg-blue-800 text-white hover:bg-blue-900 dark:bg-blue-300 dark:text-blue-950 dark:hover:bg-blue-200';
const btnRed =
  'bg-red-700 text-white hover:bg-red-800 dark:bg-red-300 dark:text-red-950 dark:hover:bg-red-200';
const btnGreen =
  'bg-green-800 text-white hover:bg-green-900 dark:bg-green-300 dark:text-green-950 dark:hover:bg-green-200';
const bigBtn = `flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-2xl font-bold transition-colors ${focusRing}`;

function resultInfo(percentage: number) {
  if (percentage === 100) return { icon: 'star' as const, title: 'ممتاز! إجابات كاملة' };
  if (percentage >= 60) return { icon: 'star' as const, title: 'أحسنت!' };
  return { icon: 'up' as const, title: 'محاولة جيدة، جرّب مرة أخرى!' };
}

export default function ExercisesPage() {
  // الخلط يتم عند الضغط على «ابدأ» فقط، فلا حاجة لـ setState داخل effect
  // ولا يحدث اختلاف بين السيرفر والمتصفح (hydration).
  const [items, setItems] = useState<Exercise[]>(EXERCISES);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const nextRef = useRef<HTMLButtonElement>(null);

  const exercise = items[current];
  const answered = selected !== null;
  const isCorrect = answered && selected === exercise.answer;

  // بعد الإجابة ينتقل التركيز إلى زر «التالي»
  useEffect(() => {
    if (answered) nextRef.current?.focus();
  }, [answered]);

  const begin = () => {
    setItems(shuffledSet());
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setStarted(true);
  };

  const handleAnswer = (option: string) => {
    if (answered) return;
    setSelected(option);
    if (option === exercise.answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current < items.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  // ---------- شاشة البداية ----------
  if (!started) {
    return (
      <main className="flex items-center justify-center px-6 py-12">
        <div className={`${card} w-full max-w-2xl p-8 text-center md:p-12`}>
          <h1 className="mb-4 text-4xl font-black text-blue-800 dark:text-blue-300 md:text-5xl">
            التمارين التفاعلية
          </h1>
          <p className="mb-8 text-xl text-slate-700 dark:text-gray-300 md:text-2xl">
            {EXERCISES.length} أسئلة إملائية بسيطة. خذ وقتك في القراءة، ولا يوجد وقت محدد.
          </p>
          <button onClick={begin} className={`${bigBtn} ${btnBlue}`}>
            ابدأ التمرين
          </button>
        </div>
      </main>
    );
  }

  // ---------- شاشة النتيجة ----------
  if (showResult) {
    const percentage = Math.round((score / items.length) * 100);
    const { icon, title } = resultInfo(percentage);

    return (
      <main className="flex items-center justify-center px-6 py-12">
        <div className={`${card} w-full max-w-2xl p-8 text-center md:p-12`}>
          <Icon name={icon} className="mx-auto mb-6 h-24 w-24 text-amber-600 dark:text-amber-300" />
          <h1 className="mb-6 text-4xl font-black text-blue-800 dark:text-blue-300 md:text-5xl">
            {title}
          </h1>
          <p className="mb-4 text-2xl text-slate-800 dark:text-gray-200 md:text-3xl">
            نتيجتك:{' '}
            <span className="font-black text-green-800 dark:text-green-300">{score}</span> من {items.length}
          </p>
          <div className="mb-8 text-7xl font-black text-green-800 dark:text-green-300">{percentage}%</div>

          <div className="space-y-4">
            <button onClick={begin} className={`${bigBtn} ${btnBlue}`}>
              <Icon name="refresh" />
              إعادة التمارين
            </button>
            <Link href="/games" className={`${bigBtn} ${btnRed}`}>
              <Icon name="arrow" />
              انتقل إلى الألعاب
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ---------- شاشة السؤال ----------
  const optionClass = (option: string) => {
    if (!answered) {
      return 'border-2 border-blue-800/40 bg-amber-50 text-slate-900 hover:bg-blue-50 dark:border-blue-300/40 dark:bg-[#0f0f1e] dark:text-white dark:hover:bg-blue-950';
    }
    if (option === exercise.answer) {
      return 'border-2 border-green-800 bg-green-800 text-white dark:border-green-300 dark:bg-green-300 dark:text-green-950';
    }
    if (option === selected) {
      return 'border-2 border-red-700 bg-red-700 text-white dark:border-red-300 dark:bg-red-300 dark:text-red-950';
    }
    return 'border-2 border-gray-300 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300';
  };

  const isLast = current === items.length - 1;

  return (
    <main className="px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-center text-4xl font-black text-blue-800 dark:text-blue-300 md:text-5xl">
          التمارين التفاعلية
        </h1>
        <p className="mb-12 text-center text-xl text-slate-700 dark:text-gray-300 md:text-2xl">
          تمارين إملائية بسيطة للتدريب
        </p>

        {/* شريط التقدم */}
        <div
          role="progressbar"
          aria-label="التقدم في التمرين"
          aria-valuemin={1}
          aria-valuemax={items.length}
          aria-valuenow={current + 1}
          aria-valuetext={`السؤال ${current + 1} من ${items.length}`}
          className="mb-8 h-4 overflow-hidden rounded-full bg-white shadow-md dark:bg-gray-700"
        >
          <div
            className="h-full bg-blue-800 transition-all duration-500 motion-reduce:transition-none dark:bg-blue-300"
            style={{ width: `${((current + 1) / items.length) * 100}%` }}
          />
        </div>
        <p className="mb-8 text-center text-xl font-bold text-slate-800 dark:text-gray-200">
          السؤال {current + 1} من {items.length}
        </p>

        {/* بطاقة السؤال */}
        <div className={`${card} p-6 md:p-10`}>
          <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
            {exercise.question}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {exercise.options.map((option) => {
              const isAnswer = answered && option === exercise.answer;
              const isWrongPick = answered && option === selected && option !== exercise.answer;
              return (
                <button
                  key={`${current}-${option}`}
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className={`flex items-center justify-center gap-3 rounded-2xl p-6 text-2xl font-bold transition-colors disabled:cursor-not-allowed ${focusRing} ${optionClass(option)}`}
                >
                  {isAnswer && <Icon name="check" />}
                  {isWrongPick && <Icon name="cross" />}
                  {option}
                  {isAnswer && <span className="sr-only">(الإجابة الصحيحة)</span>}
                  {isWrongPick && <span className="sr-only">(اختيارك)</span>}
                </button>
              );
            })}
          </div>

          {/* رسالة التصحيح تبقى حتى يضغط الطفل «التالي» */}
          <div role="status" aria-live="polite">
            {answered && (
              <>
                <div
                  className={`mt-6 flex items-center justify-center gap-3 rounded-xl border-2 p-4 text-center text-xl font-bold md:text-2xl ${
                    isCorrect
                      ? 'border-green-800 bg-green-50 text-green-900 dark:border-green-300 dark:bg-green-950 dark:text-green-200'
                      : 'border-red-700 bg-red-50 text-red-900 dark:border-red-300 dark:bg-red-950 dark:text-red-200'
                  }`}
                >
                  <Icon name={isCorrect ? 'check' : 'cross'} className="h-7 w-7 shrink-0" />
                  <span>
                    {isCorrect
                      ? 'إجابة صحيحة! أحسنت!'
                      : `إجابة خاطئة، الإجابة الصحيحة: ${exercise.answer}`}
                  </span>
                </div>
              </>
            )}
          </div>

          {answered && (
            <button ref={nextRef} onClick={handleNext} className={`mt-6 ${bigBtn} ${btnGreen}`}>
              {isLast ? 'عرض النتيجة' : 'السؤال التالي'}
              <Icon name="arrow" />
            </button>
          )}
        </div>

        {/* النقاط */}
        <div className="mt-8 text-center">
          <span className="inline-block rounded-2xl bg-white px-8 py-4 text-2xl font-bold text-blue-800 shadow-lg dark:bg-[#1a1a2e] dark:text-blue-300">
            النقاط: {score} / {current + (answered ? 1 : 0)}
          </span>
        </div>
      </div>
    </main>
  );
}
