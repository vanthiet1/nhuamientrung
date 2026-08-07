/** ISO 639-1 world languages (code, English name, native name) */
export type WorldLanguage = {
  code: string;
  name: string;
  native: string;
};

/** Default site language */
export const DEFAULT_LANG = "vi";

export const WORLD_LANGUAGES: WorldLanguage[] = [
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt" },
  { code: "en", name: "English", native: "English" },
  { code: "zh-CN", name: "Chinese (Simplified)", native: "简体中文" },
  { code: "zh-TW", name: "Chinese (Traditional)", native: "繁體中文" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "th", name: "Thai", native: "ไทย" },
  { code: "lo", name: "Lao", native: "ລາວ" },
  { code: "km", name: "Khmer", native: "ខ្មែរ" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu" },
  { code: "tl", name: "Filipino", native: "Filipino" },
  { code: "my", name: "Myanmar (Burmese)", native: "မြန်မာ" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "ur", name: "Urdu", native: "اردو" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "ne", name: "Nepali", native: "नेपाली" },
  { code: "si", name: "Sinhala", native: "සිංහල" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "nl", name: "Dutch", native: "Nederlands" },
  { code: "pl", name: "Polish", native: "Polski" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "uk", name: "Ukrainian", native: "Українська" },
  { code: "cs", name: "Czech", native: "Čeština" },
  { code: "sk", name: "Slovak", native: "Slovenčina" },
  { code: "hu", name: "Hungarian", native: "Magyar" },
  { code: "ro", name: "Romanian", native: "Română" },
  { code: "bg", name: "Bulgarian", native: "Български" },
  { code: "el", name: "Greek", native: "Ελληνικά" },
  { code: "tr", name: "Turkish", native: "Türkçe" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "he", name: "Hebrew", native: "עברית" },
  { code: "fa", name: "Persian", native: "فارسی" },
  { code: "sw", name: "Swahili", native: "Kiswahili" },
  { code: "af", name: "Afrikaans", native: "Afrikaans" },
  { code: "am", name: "Amharic", native: "አማርኛ" },
  { code: "az", name: "Azerbaijani", native: "Azərbaycan" },
  { code: "be", name: "Belarusian", native: "Беларуская" },
  { code: "bs", name: "Bosnian", native: "Bosanski" },
  { code: "ca", name: "Catalan", native: "Català" },
  { code: "ceb", name: "Cebuano", native: "Cebuano" },
  { code: "co", name: "Corsican", native: "Corsu" },
  { code: "cy", name: "Welsh", native: "Cymraeg" },
  { code: "da", name: "Danish", native: "Dansk" },
  { code: "eo", name: "Esperanto", native: "Esperanto" },
  { code: "et", name: "Estonian", native: "Eesti" },
  { code: "eu", name: "Basque", native: "Euskara" },
  { code: "fi", name: "Finnish", native: "Suomi" },
  { code: "fy", name: "Frisian", native: "Frysk" },
  { code: "ga", name: "Irish", native: "Gaeilge" },
  { code: "gd", name: "Scottish Gaelic", native: "Gàidhlig" },
  { code: "gl", name: "Galician", native: "Galego" },
  { code: "ha", name: "Hausa", native: "Hausa" },
  { code: "haw", name: "Hawaiian", native: "ʻŌlelo Hawaiʻi" },
  { code: "hmn", name: "Hmong", native: "Hmoob" },
  { code: "hr", name: "Croatian", native: "Hrvatski" },
  { code: "ht", name: "Haitian Creole", native: "Kreyòl ayisyen" },
  { code: "hy", name: "Armenian", native: "Հայերեն" },
  { code: "ig", name: "Igbo", native: "Igbo" },
  { code: "is", name: "Icelandic", native: "Íslenska" },
  { code: "jw", name: "Javanese", native: "Basa Jawa" },
  { code: "ka", name: "Georgian", native: "ქართული" },
  { code: "kk", name: "Kazakh", native: "Қазақ" },
  { code: "ku", name: "Kurdish", native: "Kurdî" },
  { code: "ky", name: "Kyrgyz", native: "Кыргызча" },
  { code: "la", name: "Latin", native: "Latina" },
  { code: "lb", name: "Luxembourgish", native: "Lëtzebuergesch" },
  { code: "lt", name: "Lithuanian", native: "Lietuvių" },
  { code: "lv", name: "Latvian", native: "Latviešu" },
  { code: "mg", name: "Malagasy", native: "Malagasy" },
  { code: "mi", name: "Maori", native: "Māori" },
  { code: "mk", name: "Macedonian", native: "Македонски" },
  { code: "mn", name: "Mongolian", native: "Монгол" },
  { code: "mt", name: "Maltese", native: "Malti" },
  { code: "no", name: "Norwegian", native: "Norsk" },
  { code: "ny", name: "Chichewa", native: "Chichewa" },
  { code: "ps", name: "Pashto", native: "پښتو" },
  { code: "sd", name: "Sindhi", native: "سنڌي" },
  { code: "sl", name: "Slovenian", native: "Slovenščina" },
  { code: "sm", name: "Samoan", native: "Gagana Samoa" },
  { code: "sn", name: "Shona", native: "ChiShona" },
  { code: "so", name: "Somali", native: "Soomaali" },
  { code: "sq", name: "Albanian", native: "Shqip" },
  { code: "sr", name: "Serbian", native: "Српски" },
  { code: "st", name: "Sesotho", native: "Sesotho" },
  { code: "su", name: "Sundanese", native: "Basa Sunda" },
  { code: "sv", name: "Swedish", native: "Svenska" },
  { code: "tg", name: "Tajik", native: "Тоҷикӣ" },
  { code: "uz", name: "Uzbek", native: "Oʻzbek" },
  { code: "xh", name: "Xhosa", native: "isiXhosa" },
  { code: "yi", name: "Yiddish", native: "ייִדיש" },
  { code: "yo", name: "Yoruba", native: "Yorùbá" },
  { code: "zu", name: "Zulu", native: "isiZulu" },
];

export function findLanguage(code: string) {
  return WORLD_LANGUAGES.find((l) => l.code === code) || WORLD_LANGUAGES[0];
}

export function searchLanguages(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return WORLD_LANGUAGES;
  return WORLD_LANGUAGES.filter(
    (l) =>
      l.code.toLowerCase().includes(q) ||
      l.name.toLowerCase().includes(q) ||
      l.native.toLowerCase().includes(q)
  );
}

/** Comma list for Google Translate includedLanguages */
export function googleIncludedLanguages() {
  return WORLD_LANGUAGES.map((l) => l.code).join(",");
}
