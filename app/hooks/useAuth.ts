'use client';
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  email: string;
  name: string;
  loginTime: string;
}

const KEY = 'taysir_auth';
const CHANGE_EVENT = 'taysir-auth-change';
// تنتهي الجلسة التجريبية بعد 7 أيام من وقت الدخول
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** يُستدعى بعد الكتابة في التخزين من نفس التبويب (حدث storage لا يصل إليه). */
export function notifyAuthChange() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

// يعيد النص الخام (قيمة ثابتة بين الاستدعاءات) أو null إن لم توجد جلسة صالحة
function getSnapshot(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const time = Date.parse(String((parsed as { loginTime?: unknown }).loginTime));
    if (Number.isFinite(time) && Date.now() - time > MAX_AGE_MS) return null;
    return raw;
  } catch {
    return null;
  }
}

const getServerSnapshot = () => null;

// علم «اكتمل التحميل في المتصفح» دون setState داخل effect
const noopSubscribe = () => () => {};

export function useAuth({ redirect = true }: { redirect?: boolean } = {}) {
  const router = useRouter();
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const checked = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const user = useMemo<AuthUser | null>(() => {
    if (!raw) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null) return null;
      const p = parsed as Record<string, unknown>;
      if (typeof p.email !== 'string') return null;
      return {
        email: p.email,
        name: typeof p.name === 'string' ? p.name : '',
        loginTime: typeof p.loginTime === 'string' ? p.loginTime : '',
      };
    } catch {
      return null;
    }
  }, [raw]);

  // التحويل إلى صفحة الدخول (لا يغيّر أي state)
  useEffect(() => {
    if (checked && !user && redirect) router.replace('/login');
  }, [checked, user, redirect, router]);

  const logout = () => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // التخزين غير متاح
    }
    notifyAuthChange();
    router.replace('/login');
  };

  return { user, checked, logout };
}
