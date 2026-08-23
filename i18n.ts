/**
 * FILE: lib/i18n.ts
 * Minimal i18n string lookup used for the language switcher (en/ar/ur). Add new translated strings here.
 */
export const dictionaries = {
  en: { home:"Home", parts:"Parts", services:"Services", cart:"Cart", wishlist:"Wishlist", account:"Account", search:"Search", login:"Login", signup:"Sign up", garage:"My Garage" },
  ar: { home:"الرئيسية", parts:"قطع الغيار", services:"الخدمات", cart:"السلة", wishlist:"المفضلة", account:"الحساب", search:"بحث", login:"تسجيل الدخول", signup:"إنشاء حساب", garage:"كراج السيارات" },
  ur: { home:"ہوم", parts:"پارٹس", services:"سروسز", cart:"کارٹ", wishlist:"پسندیدہ", account:"اکاؤنٹ", search:"تلاش", login:"لاگ اِن", signup:"سائن اَپ", garage:"میرا گیراج" },
} as const;
export type Language = keyof typeof dictionaries;
export function t(lang: Language, key: keyof typeof dictionaries.en) { return dictionaries[lang][key] ?? dictionaries.en[key]; }
export function direction(lang: Language) { return lang === "en" ? "ltr" : "rtl"; }
