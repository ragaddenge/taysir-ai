'use client';
import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';

type GameType = 'spelling' | 'speed' | 'findwrong';

interface Question {
  word: string;
  hint: string;
  options: string[];
  answer: string; // الخيار الذي يجب على الطفل الضغط عليه
}

interface Feedback {
  ok: boolean;
  text: string;
}

// hint: دليل قصير لمعنى الكلمة، يُستخدم في لعبة الإملاء بدل عرض الكلمة نفسها
const WORDS = [
  { correct: 'مدرسة', hint: 'مكان نتعلّم فيه مع المعلّم', wrong: ['مدرسه', 'مدرست'] },
  { correct: 'كتاب', hint: 'نقرأ فيه الدروس والقصص', wrong: ['كتات', 'كناب'] },
  { correct: 'شمس', hint: 'تضيء لنا في النهار وتدفئنا', wrong: ['شمص', 'سمش'] },
  { correct: 'قمر', hint: 'يظهر لنا في السماء ليلاً', wrong: ['قمز', 'فمر'] },
  { correct: 'بحر', hint: 'ماء مالح واسع تسبح فيه الأسماك', wrong: ['بحز', 'بحرر'] },
  { correct: 'سماء', hint: 'فوقنا، نرى فيها الغيوم والنجوم', wrong: ['سما', 'سماأ'] },
  { correct: 'أرض', hint: 'نمشي عليها ونزرع فيها', wrong: ['ارض', 'أرظ'] },
  { correct: 'قلم', hint: 'نكتب به على الورق', wrong: ['قلن', 'قنم'] },
  { correct: 'بيت', hint: 'مكان تعيش فيه الأسرة', wrong: ['بيط', 'بييت'] },
  { correct: 'باب', hint: 'ندخل منه إلى الغرفة ونخرج منه', wrong: ['بأب', 'بابب'] },
  { correct: 'تفاح', hint: 'نوع من الفاكهة لونه أحمر أو أخضر', wrong: ['تفاخ', 'تقاح'] },
  { correct: 'تفاحة', hint: 'حبة واحدة من تلك الفاكهة الحمراء', wrong: ['تفاحه', 'تفاحت'] },
  { correct: 'ولد', hint: 'طفل ذكر', wrong: ['ولذ', 'وكد'] },
  { correct: 'بنت', hint: 'طفلة أنثى', wrong: ['بتن', 'ننت'] },
  { correct: 'شجرة', hint: 'نبات كبير له جذع وأغصان وأوراق', wrong: ['شجره', 'شجرت'] },
  { correct: 'زهرة', hint: 'نبات صغير جميل الألوان طيب الرائحة', wrong: ['زهره', 'زهرت'] },
  { correct: 'سمكة', hint: 'حيوان يسبح في الماء وله زعانف', wrong: ['سمكه', 'سمكت'] },
  { correct: 'عصفور', hint: 'طائر صغير يغرّد ويطير', wrong: ['عسفور', 'عصقور'] },
  { correct: 'قطة', hint: 'حيوان أليف صغير يموء', wrong: ['قطه', 'قطت'] },
  { correct: 'كلب', hint: 'حيوان أليف يحرس البيت وينبح', wrong: ['كلد', 'كلبب'] },
];

// أيقونات SVG بدل الإيموجي (نفس أسلوب بقية الصفحات)
const ICONS = {
  check: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  bolt: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  search:
    'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
  wrong: 'M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  clock: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  replay:
    'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99',
};

function Icon({ name, className }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[name]} />
    </svg>
  );
}

// ألوان بتباين مناسب (AA) للنص العادي والكبير في الوضعين الفاتح والداكن
const GAMES: {
  id: GameType;
  icon: keyof typeof ICONS;
  title: string;
  desc: string;
  titleColor: string;
  optionColor: string;
}[] = [
  {
    id: 'spelling',
    icon: 'check',
    title: 'اختر الكلمة الصحيحة',
    desc: 'اقرأ الدليل ثم اختر الكتابة الصحيحة للكلمة',
    titleColor: 'text-blue-800 dark:text-blue-300',
    optionColor:
      'bg-blue-800 text-white hover:bg-blue-900 dark:bg-blue-300 dark:text-blue-950 dark:hover:bg-blue-200',
  },
  {
    id: 'speed',
    icon: 'bolt',
    title: 'القراءة السريعة',
    desc: 'احفظ الكلمة قبل أن تختفي ثم اخترها',
    titleColor: 'text-red-800 dark:text-red-300',
    optionColor:
      'bg-red-700 text-white hover:bg-red-800 dark:bg-red-300 dark:text-red-950 dark:hover:bg-red-200',
  },
  {
    id: 'findwrong',
    icon: 'search',
    title: 'اكتشف الخطأ',
    desc: 'اضغط على الكلمة المكتوبة بشكل خاطئ',
    titleColor: 'text-green-800 dark:text-green-300',
    optionColor:
      'bg-green-800 text-white hover:bg-green-900 dark:bg-green-300 dark:text-green-950 dark:hover:bg-green-200',
  },
];

const SPEED_GAME_SECONDS = 30;

// مدة ظهور الكلمة في لعبة القراءة السريعة: قابلة للضبط ومحفوظة على الجهاز
const WORD_MS_KEY = 'taysir_games_word_ms';
const WORD_MS_OPTIONS = [2000, 4000, 6000];
const DEFAULT_WORD_MS = 4000;

const secondsLabel = (ms: number) => (ms === 2000 ? 'ثانيتين' : `${ms / 1000} ثوانٍ`);
const secondsChoiceLabel = (ms: number) => (ms === 2000 ? 'ثانيتان' : `${ms / 1000} ثوانٍ`);

const wordMsListeners = new Set<() => void>();
let wordMsInMemory: number | null = null;

function subscribeWordMs(callback: () => void) {
  wordMsListeners.add(callback);
  window.addEventListener('storage', callback);
  return () => {
    wordMsListeners.delete(callback);
    window.removeEventListener('storage', callback);
  };
}

function getWordMs(): number {
  if (wordMsInMemory !== null) return wordMsInMemory;
  try {
    const v = Number(localStorage.getItem(WORD_MS_KEY));
    return WORD_MS_OPTIONS.includes(v) ? v : DEFAULT_WORD_MS;
  } catch {
    return DEFAULT_WORD_MS;
  }
}

function saveWordMs(ms: number) {
  wordMsInMemory = ms; // يعمل حتى لو تعذّر التخزين المحلي
  try {
    localStorage.setItem(WORD_MS_KEY, String(ms));
  } catch {}
  wordMsListeners.forEach((l) => l());
}

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function buildQuestion(game: GameType): Question {
  const entry = pick(WORDS);

  if (game === 'findwrong') {
    // كلمة خاطئة واحدة + كلمتان صحيحتان
    const wrong = pick(entry.wrong);
    const others = shuffle(WORDS.filter((w) => w !== entry))
      .slice(0, 2)
      .map((w) => w.correct);
    return {
      word: entry.correct,
      hint: entry.hint,
      options: shuffle([wrong, ...others]),
      answer: wrong,
    };
  }

  return {
    word: entry.correct,
    hint: entry.hint,
    options: shuffle([entry.correct, ...entry.wrong]),
    answer: entry.correct,
  };
}

const card = 'rounded-3xl bg-white shadow-xl dark:bg-[#1a1a2e]';
const panel = 'rounded-xl bg-[#FDF6E3] dark:bg-[#0f0f1e]';
const secondaryButton =
  'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600';

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showWord, setShowWord] = useState(true);
  const wordMs = useSyncExternalStore(subscribeWordMs, getWordMs, () => DEFAULT_WORD_MS);

  const timeouts = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timeouts.current.push(window.setTimeout(fn, ms));
  }, []);

  const clearTimers = useCallback(() => {
    timeouts.current.forEach((id) => window.clearTimeout(id));
    timeouts.current = [];
  }, []);

  // تنظيف المؤقتات عند مغادرة الصفحة
  useEffect(() => clearTimers, [clearTimers]);

  const loadQuestion = useCallback(
    (game: GameType) => {
      setQuestion(buildQuestion(game));
      setSelected(null);
      setFeedback(null);
      if (game === 'speed') {
        setShowWord(true);
        later(() => setShowWord(false), wordMs);
      }
    },
    [later, wordMs]
  );

  const startGame = (game: GameType) => {
    clearTimers();
    setActiveGame(game);
    setScore(0);
    setTimeLeft(game === 'speed' ? SPEED_GAME_SECONDS : 0);
    loadQuestion(game);
  };

  const resetGame = () => {
    clearTimers();
    setActiveGame(null);
    setScore(0);
    setTimeLeft(0);
    setQuestion(null);
    setSelected(null);
    setFeedback(null);
    setShowWord(true);
  };

  const gameOver = activeGame === 'speed' && timeLeft === 0;

  // الوقت يجري أثناء الإجابة فقط: يتوقف أثناء عرض الكلمة وأثناء قراءة التصحيح،
  // حتى لا يُعاقَب الطفل البطيء في القراءة
  const timerRunning = activeGame === 'speed' && timeLeft > 0 && !showWord && selected === null;
  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => window.clearTimeout(id);
  }, [timerRunning, timeLeft]);

  const checkAnswer = (option: string) => {
    if (!question || !activeGame || selected !== null || gameOver) return;

    const ok = option === question.answer;
    setSelected(option);
    if (ok) setScore((s) => s + 10);

    setFeedback({
      ok,
      text: ok
        ? 'إجابة صحيحة! أحسنت!'
        : activeGame === 'findwrong'
        ? `الكلمة الخاطئة هي: ${question.answer}`
        : `الإجابة الصحيحة هي: ${question.answer}`,
    });
  };

  const nextQuestion = () => {
    if (activeGame) loadQuestion(activeGame);
  };

  const optionClass = (option: string, base: string) => {
    if (!question || selected === null) return base;
    if (option === question.answer)
      return 'bg-green-800 text-white dark:bg-green-300 dark:text-green-950';
    if (option === selected) return 'bg-red-800 text-white dark:bg-red-300 dark:text-red-950';
    return 'bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  };

  const renderOptions = (base: string) => (
    <>
      <div className="flex flex-wrap justify-center gap-4">
        {question?.options.map((option) => {
          const isAnswer = selected !== null && option === question.answer;
          const isWrongPick = selected !== null && option === selected && option !== question.answer;
          return (
            <button
              key={option}
              onClick={() => checkAnswer(option)}
              disabled={selected !== null}
              className={`inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-2xl font-bold transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed motion-reduce:transition-none dark:focus-visible:outline-white ${optionClass(
                option,
                base
              )}`}
            >
              {/* رمز إضافي حتى لا يعتمد المعنى على اللون وحده */}
              {isAnswer && <Icon name="check" className="h-7 w-7" />}
              {isWrongPick && <Icon name="wrong" className="h-7 w-7" />}
              {option}
            </button>
          );
        })}
      </div>

      {selected !== null && !gameOver && (
        <button
          onClick={nextQuestion}
          autoFocus
          className="mt-8 rounded-2xl bg-slate-800 px-10 py-4 text-xl font-bold text-white shadow-lg hover:bg-slate-900 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white dark:focus-visible:outline-slate-200"
        >
          السؤال التالي
        </button>
      )}
    </>
  );

  const current = GAMES.find((g) => g.id === activeGame);

  return (
    <main className="px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-center text-4xl font-black text-red-800 dark:text-red-300 md:text-5xl">
          الألعاب التعليمية
        </h1>
        <p className="mb-12 text-center text-xl text-slate-700 dark:text-gray-300 md:text-2xl">
          تعلّم والعب في الوقت نفسه!
        </p>

        {!activeGame ? (
          <>
            <div className="grid gap-8 md:grid-cols-3">
              {GAMES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => startGame(g.id)}
                  className={`${card} flex flex-col items-center p-8 text-center transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-slate-900 motion-reduce:transition-none motion-reduce:hover:scale-100 dark:focus-visible:outline-white`}
                >
                  <Icon name={g.icon} className={`mb-4 h-16 w-16 ${g.titleColor}`} />
                  <h3 className={`mb-3 text-2xl font-bold ${g.titleColor}`}>{g.title}</h3>
                  <p className="text-lg text-slate-700 dark:text-gray-300">{g.desc}</p>
                </button>
              ))}
            </div>

            {/* إعداد مدة ظهور الكلمة */}
            <section
              aria-labelledby="word-time-label"
              className={`${card} mx-auto mt-10 max-w-xl p-6 text-center`}
            >
              <h2
                id="word-time-label"
                className="mb-1 text-xl font-bold text-slate-900 dark:text-white"
              >
                مدة ظهور الكلمة
              </h2>
              <p className="mb-4 text-base text-slate-700 dark:text-gray-300">
                في لعبة القراءة السريعة. اختر مدة تناسب سرعة قراءتك.
              </p>
              <div className="flex justify-center gap-3">
                {WORD_MS_OPTIONS.map((ms) => (
                  <button
                    key={ms}
                    onClick={() => saveWordMs(ms)}
                    aria-pressed={wordMs === ms}
                    className={`flex-1 rounded-xl py-3 text-lg font-bold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:focus-visible:outline-white ${
                      wordMs === ms
                        ? 'bg-blue-800 text-white dark:bg-blue-300 dark:text-blue-950'
                        : secondaryButton
                    }`}
                  >
                    {secondsChoiceLabel(ms)}
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className={`${card} p-10 text-center shadow-2xl`}>
            <div className="mb-8 flex items-center justify-between">
              <button
                onClick={resetGame}
                className={`rounded-xl px-6 py-2 font-bold ${secondaryButton}`}
              >
                خروج
              </button>
              <div className="text-2xl font-black text-blue-800 dark:text-blue-300">
                النقاط: {score}
              </div>
              {activeGame === 'speed' && (
                <div className="text-2xl font-black text-red-800 dark:text-red-300">
                  الوقت: {timeLeft}ث
                </div>
              )}
            </div>

            <div aria-live="polite" className="min-h-[4rem]">
              {feedback && !gameOver && (
                <div
                  className={`mb-6 flex items-center justify-center gap-2 rounded-xl border-2 p-4 text-2xl font-bold ${
                    feedback.ok
                      ? 'border-green-800 bg-green-50 text-green-900 dark:border-green-300 dark:bg-green-950 dark:text-green-100'
                      : 'border-red-800 bg-red-50 text-red-900 dark:border-red-300 dark:bg-red-950 dark:text-red-100'
                  }`}
                >
                  <Icon name={feedback.ok ? 'check' : 'wrong'} className="h-8 w-8 shrink-0" />
                  <span>{feedback.text}</span>
                </div>
              )}
            </div>

            {gameOver ? (
              <div>
                <p className="mb-4 flex items-center justify-center gap-3 text-4xl font-black text-slate-900 dark:text-white">
                  <Icon name="clock" className="h-10 w-10" />
                  انتهى الوقت!
                </p>
                <p className="mb-8 text-2xl text-slate-700 dark:text-gray-300">
                  مجموع نقاطك: <span className="font-black">{score}</span>
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => startGame('speed')}
                    className="inline-flex items-center gap-2 rounded-2xl bg-red-700 px-8 py-4 text-xl font-bold text-white hover:bg-red-800 dark:bg-red-300 dark:text-red-950 dark:hover:bg-red-200"
                  >
                    <Icon name="replay" className="h-6 w-6" />
                    العب مرة أخرى
                  </button>
                  <button
                    onClick={resetGame}
                    className={`rounded-2xl px-8 py-4 text-xl font-bold ${secondaryButton}`}
                  >
                    الألعاب
                  </button>
                </div>
              </div>
            ) : (
              question &&
              current && (
                <>
                  {activeGame === 'spelling' && (
                    <div>
                      <p className="mb-6 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                        اقرأ الدليل ثم اختر الكتابة الصحيحة للكلمة:
                      </p>
                      <div className={`${panel} mb-8 p-6`}>
                        <p className="text-xl text-slate-800 dark:text-gray-200">الكلمة التي معناها:</p>
                        <p className="mt-2 text-3xl font-black text-blue-800 dark:text-blue-300 md:text-4xl">
                          {question.hint}
                        </p>
                      </div>
                      {renderOptions(current.optionColor)}
                    </div>
                  )}

                  {activeGame === 'speed' && (
                    <div>
                      <p className="mb-2 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                        احفظ الكلمة جيداً... ستختفي خلال {secondsLabel(wordMs)}!
                      </p>
                      <p className="mb-6 text-base text-slate-700 dark:text-gray-300">
                        الوقت يتوقف أثناء عرض الكلمة وأثناء قراءة التصحيح.
                      </p>
                      <div className={`${panel} mb-8 flex min-h-[120px] items-center justify-center p-10`}>
                        {showWord ? (
                          <span className="text-6xl font-black text-red-800 dark:text-red-300 md:text-7xl">
                            {question.word}
                          </span>
                        ) : (
                          <span className="text-4xl font-black text-slate-600 dark:text-gray-300 md:text-5xl">
                            اختفت الكلمة!
                          </span>
                        )}
                      </div>
                      {!showWord && (
                        <div>
                          <p className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                            ما هي الكلمة التي ظهرت؟
                          </p>
                          {renderOptions(current.optionColor)}
                        </div>
                      )}
                    </div>
                  )}

                  {activeGame === 'findwrong' && (
                    <div>
                      <p className="mb-6 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                        اضغط على الكلمة المكتوبة بشكل{' '}
                        <span className="text-red-800 dark:text-red-300">خاطئ</span>:
                      </p>
                      <p className="mb-8 text-xl text-slate-700 dark:text-gray-300">
                        بين هذه الكلمات، واحدة فقط مكتوبة بشكل غير صحيح
                      </p>
                      {renderOptions(current.optionColor)}
                    </div>
                  )}
                </>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}
