'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  ReactNode,
} from 'react';

interface ThemeContextType {
  /** هل الوضع الداكن مفعّل فعليًا الآن (يشمل الإجبار بسبب التباين العالي) */
  isDarkMode: boolean;
  /** هل الوضع الداكن مفروض بسبب تفعيل التباين العالي */
  isDarkForced: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'taysir_dark_mode';

// نقرأ الحالة من كلاسات <html> مباشرة، فتتبعها الواجهة أيًّا كان من غيّرها
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
}

const getDarkSnapshot = () =>
  document.documentElement.classList.contains('dark');
const getContrastSnapshot = () =>
  document.documentElement.classList.contains('high-contrast');
const getServerSnapshot = () => false;

// تفضيل المستخدم المحفوظ، وإن لم يوجد فتفضيل النظام (كما في سكربت layout.tsx)
function readStoredPreference(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === 'true';
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const isDarkMode = useSyncExternalStore(
    subscribe,
    getDarkSnapshot,
    getServerSnapshot,
  );
  const isHighContrast = useSyncExternalStore(
    subscribe,
    getContrastSnapshot,
    getServerSnapshot,
  );

  // تفضيل المستخدم نفسه، منفصل عن الإجبار الناتج عن التباين العالي
  const preferenceRef = useRef<boolean | null>(null);
  const getPreference = () => {
    if (preferenceRef.current === null) {
      preferenceRef.current = readStoredPreference();
    }
    return preferenceRef.current;
  };

  // يبقي كلاس dark = (تفضيل المستخدم || التباين العالي) عند أي تغيير في الكلاسات.
  // عند إيقاف التباين العالي يعود الوضع إلى تفضيل المستخدم تلقائيًا.
  useEffect(() => {
    const root = document.documentElement;
    const enforce = () => {
      const wantDark =
        getPreference() || root.classList.contains('high-contrast');
      if (root.classList.contains('dark') !== wantDark) {
        root.classList.toggle('dark', wantDark);
      }
    };
    enforce();
    const observer = new MutationObserver(enforce);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggleDarkMode = useCallback(() => {
    const next = !getPreference();
    preferenceRef.current = next;
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {}
    const root = document.documentElement;
    root.classList.toggle(
      'dark',
      next || root.classList.contains('high-contrast'),
    );
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        isDarkForced: isHighContrast,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
