'use client';
import { useRef, useState, useSyncExternalStore } from 'react';
import { useTheme } from '../context/ThemeContext';

const FONT_SIZES = [
  { label: 'صغير', value: 90 },
  { label: 'عادي', value: 100 },
  { label: 'كبير', value: 120 },
];

// ---------- أيقونات SVG ----------
const ICONS = {
  access: [
    'M12 5.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
    'M5 8.5h14M12 8.5v5.5m0 0l-3 6m3-6l3 6',
  ],
  sun: [
    'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z',
  ],
  moon: [
    'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z',
  ],
} as const;

function Icon({ name, className = 'h-5 w-5' }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

// ---------- الحالة تُقرأ من <html> مباشرة ----------
// السكربت في layout.tsx يطبّق الإعدادات المحفوظة قبل الرسم،
// فتبقى الصفحة هي المصدر الوحيد للحقيقة ولا حاجة لنسخها إلى state.
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'style'],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  const root = document.documentElement;
  const fs = Math.round(parseFloat(root.style.fontSize)) || 100;
  const hc = root.classList.contains('high-contrast') ? 1 : 0;
  const df = root.classList.contains('dyslexia-font') ? 1 : 0;
  return `${fs}|${hc}|${df}`;
}

const getServerSnapshot = () => '100|0|0';

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // التخزين غير متاح (التصفح الخاص): يبقى الإعداد للجلسة الحالية فقط
  }
}

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:focus-visible:outline-blue-300';

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-block h-6 w-12 shrink-0 rounded-full transition-colors motion-reduce:transition-none ${
        on ? 'bg-blue-800 dark:bg-blue-300' : 'bg-gray-500'
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all motion-reduce:transition-none ${
          on ? 'end-1 dark:bg-blue-950' : 'start-1'
        }`}
      />
    </span>
  );
}

export default function AccessibilityMenu() {
  const { isDarkMode, toggleDarkMode, isDarkForced } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [fs, hc, df] = snapshot.split('|');
  const fontSize = Number(fs);
  const highContrast = hc === '1';
  const dyslexiaFont = df === '1';

  const handleFontSizeChange = (size: number) => {
    // setProperty بدل الإسناد المباشر لـ style.fontSize الذي تعترض عليه قاعدة المترجم
    document.documentElement.style.setProperty('font-size', `${size}%`);
    save('taysir_font_size', String(size));
  };

  const handleHighContrast = () => {
    const next = !highContrast;
    document.documentElement.classList.toggle('high-contrast', next);
    save('taysir_high_contrast', String(next));
  };

  const handleDyslexiaFont = () => {
    const next = !dyslexiaFont;
    document.documentElement.classList.toggle('dyslexia-font', next);
    save('taysir_dyslexia_font', String(next));
  };

  // Escape يغلق القائمة ويعيد التركيز إلى زر فتحها
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  const rowClass = `flex w-full items-center justify-between gap-3 rounded-lg p-2 text-base font-bold text-slate-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 ${focusRing}`;

  return (
    <div onKeyDown={handleKeyDown}>
      {/* زر القائمة */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-controls="a11y-panel"
        aria-label="إعدادات إمكانية الوصول"
        title="إعدادات إمكانية الوصول"
        className={`fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-800 text-white shadow-2xl transition-colors hover:bg-blue-900 dark:bg-blue-300 dark:text-blue-950 dark:hover:bg-blue-200 ${focusRing}`}
      >
        <Icon name="access" className="h-8 w-8" />
      </button>

      {/* القائمة */}
      {isOpen && (
        <div
          id="a11y-panel"
          role="group"
          aria-label="إعدادات إمكانية الوصول"
          className="fixed bottom-24 left-6 z-50 w-72 rounded-2xl border-2 border-blue-800 bg-white p-6 shadow-2xl dark:border-blue-300 dark:bg-[#1a1a2e]"
        >
          <h3 className="mb-4 text-xl font-black text-slate-900 dark:text-white">إمكانية الوصول</h3>

          {/* الوضع الداكن: يُفرض مع التباين العالي */}
          <div className="mb-3">
            <button
              type="button"
              onClick={() => {
                if (!isDarkForced) toggleDarkMode();
              }}
              role="switch"
              aria-checked={isDarkMode}
              aria-disabled={isDarkForced}
              aria-describedby={isDarkForced ? 'dark-forced-hint' : undefined}
              className={`${rowClass} ${isDarkForced ? 'cursor-not-allowed opacity-80' : ''}`}
            >
              <span className="flex items-center gap-2">
                <Icon name={isDarkMode ? 'moon' : 'sun'} />
                {isDarkMode ? 'الوضع الداكن' : 'الوضع الفاتح'}
              </span>
              <Toggle on={isDarkMode} />
            </button>
            {isDarkForced && (
              <p id="dark-forced-hint" className="px-2 pt-1 text-sm text-slate-700 dark:text-gray-300">
                مفعّل تلقائيًا مع التباين العالي
              </p>
            )}
          </div>

          {/* حجم الخط */}
          <div className="mb-4" role="group" aria-labelledby="font-size-label">
            <span
              id="font-size-label"
              className="mb-2 block text-base font-bold text-slate-900 dark:text-gray-200"
            >
              حجم الخط
            </span>
            <div className="flex gap-2">
              {FONT_SIZES.map((f) => {
                const active = fontSize === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => handleFontSizeChange(f.value)}
                    aria-pressed={active}
                    className={`flex-1 rounded-lg py-2 text-base font-bold ${focusRing} ${
                      active
                        ? 'bg-blue-800 text-white dark:bg-blue-300 dark:text-blue-950'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* التباين العالي */}
          <div className="mb-3">
            <button
              type="button"
              onClick={handleHighContrast}
              role="switch"
              aria-checked={highContrast}
              className={rowClass}
            >
              <span>تباين عالٍ</span>
              <Toggle on={highContrast} />
            </button>
          </div>

          {/* الخط المريح */}
          <div>
            <button
              type="button"
              onClick={handleDyslexiaFont}
              role="switch"
              aria-checked={dyslexiaFont}
              className={rowClass}
            >
              <span>خط مريح للقراءة</span>
              <Toggle on={dyslexiaFont} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
