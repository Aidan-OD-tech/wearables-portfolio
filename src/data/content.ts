// Everything the page shows, in one place. Numbers come from my notebook
// (sections noted next to each block), so update them here if the notebook changes.

// ---------- Links: fill these in before submitting ----------
export const LINKS = {
  dashboard: "https://wearables-portfolio-hmgmaecqh2rrjigame7xqj.streamlit.app/",
  github: "https://github.com/Aidan-OD-tech/wearables-portfolio",
  notebook: "", // link to the .ipynb (e.g. in the GitHub repo)
  colab: "", // Colab view link
  walkthrough: "/walkthrough.mp4", // my screen recording, in public/
  data: "https://amazon-reviews-2023.github.io/",
};

export type Role = "regret" | "neutral" | "love";

// Notebook 2.5 and 2.6: share of reviews mentioning each theme (n = 1,929 per group),
// plus 2.11: share of 96 listing feature bullets that mention it.
export const THEMES: { name: string; high: number; low: number; gap: number; role: Role; listing: number }[] = [
  { name: "Breaks or stops working", high: 6.1, low: 28.6, gap: 22.5, role: "regret", listing: 2 },
  { name: "App & syncing", high: 27.2, low: 34.5, gap: 7.3, role: "regret", listing: 45 },
  { name: "Charging", high: 15.5, low: 20.5, gap: 5.0, role: "regret", listing: 16 },
  { name: "Strap & materials", high: 5.8, low: 8.4, gap: 2.6, role: "regret", listing: 5 },
  { name: "Skin irritation", high: 1.4, low: 2.9, gap: 1.5, role: "neutral", listing: 4 },
  { name: "Tracking accuracy", high: 14.9, low: 16.1, gap: 1.2, role: "neutral", listing: 6 },
  { name: "Smart features", high: 20.5, low: 18.0, gap: -2.5, role: "love", listing: 35 },
  { name: "Health sensors", high: 36.6, low: 33.1, gap: -3.5, role: "love", listing: 38 },
  { name: "Fit & comfort", high: 10.4, low: 4.2, gap: -6.2, role: "love", listing: 7 },
  { name: "Battery life", high: 26.6, low: 18.9, gap: -7.7, role: "love", listing: 12 },
];

export const ROLES: Record<Role, { title: string; note: string }> = {
  regret: { title: "Regret drivers", note: "more common in 1–2★ reviews" },
  neutral: { title: "Neutral", note: "about the same in both" },
  love: { title: "Love drivers", note: "more common in 4–5★ reviews" },
};

// Notebook 2.6b: "breaks" gap for each product (points)
export const BREAKS_BY_PRODUCT: { name: string; tracker: boolean; gap: number }[] = [
  { name: "Garmin Vivoactive HR", tracker: false, gap: 35.0 },
  { name: "Fitbit Flex", tracker: true, gap: 34.2 },
  { name: "Fitbit Charge", tracker: true, gap: 33.3 },
  { name: "Fitbit Sense", tracker: false, gap: 31.7 },
  { name: "Garmin Vivoactive 3 Music", tracker: false, gap: 28.3 },
  { name: "AGPTEK Smart Watch", tracker: false, gap: 27.5 },
  { name: "Samsung Galaxy Watch 4", tracker: false, gap: 27.5 },
  { name: "Xiaomi Band 7 Pro", tracker: true, gap: 26.7 },
  { name: "Garmin Vivoactive 4S", tracker: false, gap: 22.5 },
  { name: "Garmin Forerunner 35", tracker: false, gap: 21.7 },
  { name: "Fitpolo Smart Watch", tracker: false, gap: 17.5 },
  { name: "Xiaomi Mi Band 6", tracker: true, gap: 15.6 },
  { name: "Apple Watch Series 7", tracker: false, gap: 15.0 },
  { name: "Amazfit Bip", tracker: false, gap: 13.3 },
  { name: "YoYoFit Fitness Watch", tracker: true, gap: 10.0 },
  { name: "Amazfit Bip U Pro", tracker: false, gap: 9.2 },
  { name: "Popglory Smart Watch", tracker: false, gap: 7.5 },
];

// Notebook 2.8: quotes from the reading sample
export const QUOTES = {
  low: [
    { text: "After six months, the watch is totally unresponsive. It doesn't charge and won't reset.", source: "1★ · Garmin Forerunner 35 · R02556" },
    { text: "It was terrific at first but after two months it would not keep its charge.", source: "1★ · Fitbit Flex · R02432" },
    { text: "This watch lasted exactly 8 months and 5 days… It fell apart in the shower.", source: "1★ · Garmin Forerunner 35 · R02624" },
  ],
  high: [
    { text: "Very light weight so really like wearing nothing on your wrist.", source: "5★ · Amazfit Bip U Pro · R02668" },
    { text: "I feel like the accuracy is a little off… Overall, I'm happy.", source: "5★ · Xiaomi Band 7 Pro · R04092" },
  ],
};
