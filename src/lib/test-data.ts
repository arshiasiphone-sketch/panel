export type PersonalityType = "paparoch" | "zhampin" | "fofino" | "gombak" | "bedone";

export interface Option {
  id: string;
  text: string;
  type: PersonalityType | null;
}

export interface Question {
  id: number;
  text: string;
  categorized: boolean;
  options: Option[];
  enabled?: boolean;
  order?: number;
}

export interface PersonalityProfile {
  type: PersonalityType;
  label: string;
  tagline: string;
  description: string;
  color: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  traits: string[];
  drink: string;
  spot: string;
}

export const PERSONALITY_PROFILES: Record<PersonalityType, PersonalityProfile> = {
  paparoch: {
    type: "paparoch",
    label: "پاپاروچ",
    tagline: "روح مجلس — همه دوستت دارن",
    description:
      "تو کسی هستی که با ورودش فضا عوض میشه. پرانرژی، اجتماعی و همیشه آماده‌ی یه تجربه‌ی جدید. خونه برات یه صحنه‌ست نه یه پناهگاه.",
    color: "#e11d48",
    accentColor: "#9f1239",
    bgColor: "rgba(225,29,72,0.1)",
    borderColor: "rgba(225,29,72,0.25)",
    traits: ["اجتماعی", "پرانرژی", "خلاق", "ریسک‌پذیر"],
    drink: "اسپرسو دوبل",
    spot: "میز وسط که همه ببیننت",
  },
  zhampin: {
    type: "zhampin",
    label: "ژامپین",
    tagline: "هدفمند — گرم و صمیمی",
    description:
      "برای تو خونه یه مرکز ارتباطیه. دوست داری فضا گرم باشه، آدم‌ها دور هم باشن و رابطه‌ها عمیق بشه. صمیمیت مهم‌ترین چیزه.",
    color: "#16a34a",
    accentColor: "#15803d",
    bgColor: "rgba(22,163,74,0.1)",
    borderColor: "rgba(22,163,74,0.25)",
    traits: ["صمیمی", "گرم", "ارتباطی", "معاشرتی"],
    drink: "چای شیرین",
    spot: "میز دور با دوستا",
  },
  fofino: {
    type: "fofino",
    label: "فوفینو",
    tagline: "آرام‌نفس — عمق زیر سطح",
    description:
      "تو آدمی هستی که ترجیح میدی عمیق باشی تا بلند. خونه یه فضای امن و شخصیه، جایی که میتونی خودت باشی بدون قضاوت.",
    color: "#2563eb",
    accentColor: "#1d4ed8",
    bgColor: "rgba(37,99,235,0.1)",
    borderColor: "rgba(37,99,235,0.25)",
    traits: ["عمیق", "آرام", "خلوت‌دوست", "تحلیل‌گر"],
    drink: "چای دم‌کرده",
    spot: "کنار پنجره با نور طبیعی",
  },
  gombak: {
    type: "gombak",
    label: "گومباک",
    tagline: "ماجراجو — دنیا صبرت رو داره",
    description:
      "برای تو خونه یه نقطه‌ی شروعه نه مقصد. همیشه یه ایده داری، دنبال تجربه‌های جدیدی، و خونه‌ات باید بتونه باهات نفس بکشه.",
    color: "#d97706",
    accentColor: "#b45309",
    bgColor: "rgba(217,119,6,0.1)",
    borderColor: "rgba(217,119,6,0.25)",
    traits: ["کنجکاو", "ماجراجو", "سریع", "شهودی"],
    drink: "کاپوچینو",
    spot: "هر جایی که دلت بخواد",
  },
  bedone: {
    type: "bedone",
    label: "ترکیبی",
    tagline: "منحصربه‌فرد — برچسب نمیخوری",
    description:
      "شخصیت تو از یه قالب خارجه. ترکیبی از چند تیپ هستی که بستگی به موقعیت داره. این قدرته نه ضعف.",
    color: "#d4af37",
    accentColor: "#b8962e",
    bgColor: "rgba(212,175,55,0.1)",
    borderColor: "rgba(212,175,55,0.25)",
    traits: ["متنوع", "انعطاف‌پذیر", "پیچیده", "چندوجهی"],
    drink: "هر چیزی که اون روز حست بخواد",
    spot: "هر جایی که فضا خوب باشه",
  },
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "رنج سنیت رو تعیین کن!",
    categorized: false,
    options: [
      { id: "1a", text: "بین ۱۴ تا ۲۰ سال", type: null },
      { id: "1b", text: "بین ۲۰ تا ۳۰ سال", type: null },
      { id: "1c", text: "بین ۳۰ تا ۴۰ سال", type: null },
      { id: "1d", text: "بالای ۴۰", type: null },
    ],
  },
  {
    id: 2,
    text: "خانه رو برای چی دوست داری؟",
    categorized: true,
    options: [
      { id: "2a", text: "انجام کارهای شخصی", type: "paparoch" },
      { id: "2b", text: "گپ و گفتار و دیدار", type: "zhampin" },
      { id: "2c", text: "امنیت و آرامش", type: "fofino" },
      { id: "2d", text: "ماجراجویی", type: "gombak" },
    ],
  },
  {
    id: 3,
    text: "انتظار چه شیوه تعاملی از بچه‌های خانه داری؟",
    categorized: true,
    options: [
      { id: "3a", text: "کوتاه و رسمی", type: "paparoch" },
      { id: "3b", text: "گرم و صمیمی", type: "zhampin" },
      { id: "3c", text: "آرام و محترمانه", type: "fofino" },
      { id: "3d", text: "هیجان‌انگیز و متفاوت", type: "gombak" },
    ],
  },
  {
    id: 4,
    text: "معمولا چطور میای کافه؟",
    categorized: true,
    options: [
      { id: "4a", text: "تنها برای انجام فعالیتی انفرادی", type: "paparoch" },
      { id: "4b", text: "با جمعی از دوستام", type: "zhampin" },
      { id: "4c", text: "تنها برای رهایی از جو و آرامش", type: "fofino" },
      { id: "4d", text: "دو نفره برای تجربه جدید", type: "gombak" },
    ],
  },
  {
    id: 5,
    text: "فضای ایده آلت برای خانه چطوریه؟",
    categorized: true,
    options: [
      { id: "5a", text: "رسمی", type: "paparoch" },
      { id: "5b", text: "شلوغ و پر انرژی", type: "zhampin" },
      { id: "5c", text: "خلوت و ساکت", type: "fofino" },
      { id: "5d", text: "خاص و متفاوت", type: "gombak" },
    ],
  },
  {
    id: 6,
    text: "وقتی منوی خانه رو نگاه میکنی:",
    categorized: true,
    options: [
      { id: "6a", text: "خیلی سریع انتخاب میکنم", type: "paparoch" },
      { id: "6b", text: "نظر بقیه رو میپرسم", type: "zhampin" },
      { id: "6c", text: "همون همیشگی رو سفارش میدم", type: "fofino" },
      { id: "6d", text: "دنبال آیتم جدید برای تست کردن میگردم", type: "gombak" },
    ],
  },
  {
    id: 7,
    text: "بیشتر تمایل به دریافت چه حسی از خانه داری؟",
    categorized: true,
    options: [
      { id: "7a", text: "راحتی", type: "paparoch" },
      { id: "7b", text: "ارتباط با بقیه", type: "zhampin" },
      { id: "7c", text: "آرامش", type: "fofino" },
      { id: "7d", text: "حس جدید", type: "gombak" },
    ],
  },
  {
    id: 8,
    text: "اگر خانه برنامه ویژه‌ای داشته باشه بیشتر کدوم یکی رو ترجیح میدی؟",
    categorized: true,
    options: [
      { id: "8a", text: "ورک‌اسپیس یا ساعت مطالعه", type: "paparoch" },
      { id: "8b", text: "ابونت و دورهمی", type: "zhampin" },
      { id: "8c", text: "آرام با موسیقی ملایم", type: "fofino" },
      { id: "8d", text: "معرفی آیتم یا فعالیتی که تاحالا تجربه نکردم", type: "gombak" },
    ],
  },
  {
    id: 9,
    text: "وقتی از خانه بیرون میای دوست داری چه وایبی داشته باشی؟",
    categorized: true,
    options: [
      { id: "9a", text: "مفید و پربازده", type: "paparoch" },
      { id: "9b", text: "خوشحال از معاشرت", type: "zhampin" },
      { id: "9c", text: "سبک و ریلکس", type: "fofino" },
      { id: "9d", text: "وایبی که تا حالا نداشتم", type: "gombak" },
    ],
  },
  {
    id: 10,
    text: "چه سبک آیتمی در خانه مد نظر داری؟",
    categorized: false,
    options: [
      { id: "10a", text: "گرم نوش", type: null },
      { id: "10b", text: "سرد نوش", type: null },
      { id: "10c", text: "چای یا قهوه", type: null },
      { id: "10d", text: "غذا و خوراکی", type: null },
    ],
  },
  {
    id: 11,
    text: "بیشتر کی دوست داری در خانه باشی؟",
    categorized: false,
    options: [
      { id: "11a", text: "شب", type: null },
      { id: "11b", text: "روز", type: null },
      { id: "11c", text: "فرقی نمیکنه", type: null },
      { id: "11d", text: "هر وقت دلم بخواد", type: null },
    ],
  },
];

export interface ScoreBreakdown {
  paparoch: number;
  zhampin: number;
  fofino: number;
  gombak: number;
  [key: string]: number;
}

export function calculateScores(answers: Record<number, string>): ScoreBreakdown {
  const counts: ScoreBreakdown = { paparoch: 0, zhampin: 0, fofino: 0, gombak: 0 };
  for (const [qIdStr, optId] of Object.entries(answers)) {
    const qId = Number(qIdStr);
    const question = QUESTIONS.find((q) => q.id === qId);
    if (!question || !question.categorized) continue;
    const option = question.options.find((o) => o.id === optId);
    if (option?.type && option.type !== "bedone" && option.type in counts) {
      counts[option.type as keyof ScoreBreakdown]++;
    }
  }
  return counts;
}

export function calculateResult(answers: Record<number, string>): PersonalityType {
  const counts = calculateScores(answers);
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const topScore = sorted[0][1];
  const topTied = sorted.filter(([, v]) => v === topScore);
  if (topTied.length > 1 || topScore === 0) return "bedone";
  return sorted[0][0] as PersonalityType;
}

/** Hybrid-aware: returns primary type plus all tied types when there's a tie. */
export interface DetailedResult {
  primary: PersonalityType;
  tied: PersonalityType[]; // length >= 1; if length > 1 → hybrid
  scores: ScoreBreakdown;
}

export function calculateDetailedResult(answers: Record<number, string>): DetailedResult {
  const scores = calculateScores(answers);
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topScore = sorted[0][1];
  if (topScore === 0) return { primary: "bedone", tied: ["bedone"], scores };
  const tied = sorted.filter(([, v]) => v === topScore).map(([k]) => k as PersonalityType);
  const primary = tied.length > 1 ? "bedone" : tied[0];
  return { primary, tied, scores };
}

export function hybridLabel(tied: PersonalityType[]): string {
  return tied.map((t) => PERSONALITY_PROFILES[t].label).join(" + ");
}
