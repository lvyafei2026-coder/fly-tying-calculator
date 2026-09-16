const fs = require('fs');
const path = require('path');

// ============================================================
// HTML 模板
// ============================================================
function buildIndexHtml(forceLang, htmlLang, canonicalPath) {
  const forceLine = forceLang
    ? `<script>window.__FORCE_LANG__ = '${forceLang}';<\/script>\n`
    : '';
  const canonical = `https://toolara.dev${canonicalPath}`;

  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fly Tying Material Calculator — Estimate Thread, Feathers and Wire</title>
<meta name="description" content="Free fly tying calculator. Estimate how much thread, hackle, dubbing, and lead wire you need for any pattern — based on hook size, style, and quantity.">
<meta name="keywords" content="fly tying calculator, fly tying materials, how much thread for flies, hackle calculator, fly tying cost estimator">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta name="theme-color" content="#1a3d2e">

<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="https://toolara.dev/fly-tying-calculator/">
<link rel="alternate" hreflang="zh-Hans" href="https://toolara.dev/fly-tying-calculator/zh/">
<link rel="alternate" hreflang="zh-Hant" href="https://toolara.dev/fly-tying-calculator/zh-tw/">
<link rel="alternate" hreflang="ja" href="https://toolara.dev/fly-tying-calculator/ja/">
<link rel="alternate" hreflang="ko" href="https://toolara.dev/fly-tying-calculator/ko/">
<link rel="alternate" hreflang="de" href="https://toolara.dev/fly-tying-calculator/de/">
<link rel="alternate" hreflang="ru" href="https://toolara.dev/fly-tying-calculator/ru/">
<link rel="alternate" hreflang="es" href="https://toolara.dev/fly-tying-calculator/es/">
<link rel="alternate" hreflang="x-default" href="https://toolara.dev/fly-tying-calculator/">

<meta property="og:type" content="website">
<meta property="og:title" content="Fly Tying Material Calculator">
<meta property="og:description" content="Estimate thread, hackle, dubbing, and wire for any fly pattern.">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Fly Tying Material Calculator",
  "url": "${canonical}",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "description": "Free calculator that estimates fly tying material quantities and costs.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
<\/script>

${forceLine}<link rel="stylesheet" href="css/style.css">
</head>
<body>

<header class="hero">
  <div class="lang-switch">
    <select id="langSelect" onchange="setLang(this.value)" aria-label="Language">
      <option value="en">English</option>
      <option value="zh">简体中文</option>
      <option value="zh-TW">繁體中文</option>
      <option value="ja">日本語</option>
      <option value="ko">한국어</option>
      <option value="de">Deutsch</option>
      <option value="ru">Русский</option>
      <option value="es">Español</option>
    </select>
  </div>
  <div class="hero-inner">
    <div class="hero-badge">🪝 Fly Tying</div>
    <h1 data-i18n="title">Fly Tying Material Calculator</h1>
    <p data-i18n="subtitle">Estimate thread, hackle, dubbing, and wire for any pattern — before you tie a single fly.</p>
  </div>
</header>

<main class="wrap">
  <section class="card">
    <h2 class="visually-hidden" data-i18n="calcHeading">Calculator</h2>

    <div class="row">
      <div>
        <label for="quantity" data-i18n="qtyLabel">Number of flies</label>
        <input type="number" id="quantity" min="1" step="1" placeholder="24" value="24" inputmode="numeric">
      </div>
      <div>
        <label for="hookSize" data-i18n="hookLabel">Hook size</label>
        <select id="hookSize">
          <option value="2">#2</option>
          <option value="4">#4</option>
          <option value="6">#6</option>
          <option value="8">#8</option>
          <option value="10">#10</option>
          <option value="12">#12</option>
          <option value="14" selected>#14</option>
          <option value="16">#16</option>
          <option value="18">#18</option>
          <option value="20">#20</option>
          <option value="22">#22</option>
        </select>
      </div>
    </div>

    <label for="style" data-i18n="styleLabel">Fly style</label>
    <select id="style">
      <option value="dry" selected data-i18n="styleDry">Dry fly</option>
      <option value="wet" data-i18n="styleWet">Wet fly</option>
      <option value="nymph" data-i18n="styleNymph">Nymph</option>
      <option value="streamer" data-i18n="styleStreamer">Streamer</option>
    </select>

    <div class="row">
      <div>
        <label for="threadPrice" data-i18n="threadLabel">Thread spool price ($)</label>
        <input type="number" id="threadPrice" min="0" step="0.5" placeholder="4" value="4" inputmode="decimal">
      </div>
      <div>
        <label for="hacklePrice" data-i18n="hackleLabel">Hackle price ($ per pack)</label>
        <input type="number" id="hacklePrice" min="0" step="0.5" placeholder="12" value="12" inputmode="decimal">
      </div>
    </div>

    <button class="calc" type="button" onclick="calculate()" data-i18n="calcBtn">Calculate materials</button>

    <div id="result" role="region" aria-live="polite">
      <div class="result-label" data-i18n="resultLabel">Materials needed for</div>
      <div class="total-flies"><span id="totalFlies">—</span></div>

      <div class="breakdown">
        <div class="bd-row"><span data-i18n="bdThread">Thread</span><strong id="bdThread">—</strong></div>
        <div class="bd-row"><span data-i18n="bdHackle">Hackle feathers</span><strong id="bdHackle">—</strong></div>
        <div class="bd-row"><span data-i18n="bdDubbing">Dubbing</span><strong id="bdDubbing">—</strong></div>
        <div class="bd-row"><span data-i18n="bdWire">Lead wire</span><strong id="bdWire">—</strong></div>
        <div class="bd-row"><span data-i18n="bdHooks">Hooks</span><strong id="bdHooks">—</strong></div>
        <div class="bd-divider"></div>
        <div class="bd-row bd-total"><span data-i18n="bdCost">Estimated material cost</span><strong id="bdCost">—</strong></div>
      </div>
      <div class="result-disclaimer" data-i18n="resultDisclaimer">Estimate only. Actual material usage varies by pattern, tying style, and individual technique. Always buy a little extra.</div>
    </div>
  </section>

  <section>
    <h2 data-i18n="whatIsTitle">How material usage is estimated</h2>
    <p data-i18n="whatIsText">Fly tying material consumption depends on three main factors: the hook size (which determines the scale of the fly), the style of fly (dry, wet, nymph, or streamer), and the total quantity you plan to tie. This calculator combines these into a practical material shopping list so you can plan your session and budget before you sit at the vise.</p>
  </section>

  <section>
    <h2 data-i18n="factorsTitle">What affects material usage</h2>
    <h3 data-i18n="f1Title">Hook size</h3>
    <p data-i18n="f1Text">A #4 streamer hook uses roughly 4 times the thread and materials of a #16 dry fly hook. As hook size increases (lower number), material needs scale up significantly.</p>

    <h3 data-i18n="f2Title">Fly style</h3>
    <ul>
      <li data-i18n="f2a"><strong>Dry fly:</strong> baseline — light materials, hackle-heavy</li>
      <li data-i18n="f2b"><strong>Wet fly:</strong> ~10% more thread, slightly more dubbing</li>
      <li data-i18n="f2c"><strong>Nymph:</strong> ~20% more, plus lead wire for weight</li>
      <li data-i18n="f2d"><strong>Streamer:</strong> ~60% more — larger hooks, more materials per fly</li>
    </ul>

    <h3 data-i18n="f3Title">Materials tracked</h3>
    <ul>
      <li data-i18n="f3a"><strong>Thread:</strong> measured in meters — the backbone of every fly</li>
      <li data-i18n="f3b"><strong>Hackle:</strong> feathers wrapped around the hook for legs and movement</li>
      <li data-i18n="f3c"><strong>Dubbing:</strong> fur or synthetic blend for the body</li>
      <li data-i18n="f3d"><strong>Lead wire:</strong> for weight, used mainly in nymphs and streamers</li>
      <li data-i18n="f3e"><strong>Hooks:</strong> one per fly (plus a few for practice)</li>
    </ul>
  </section>

  <section>
    <h2 data-i18n="howToTitle">How to use this calculator</h2>
    <ol>
      <li data-i18n="howTo1">Enter the number of flies you plan to tie.</li>
      <li data-i18n="howTo2">Choose your hook size — this is the biggest factor.</li>
      <li data-i18n="howTo3">Select the fly style you're tying.</li>
      <li data-i18n="howTo4">Enter current prices for thread and hackle to see material cost.</li>
      <li data-i18n="howTo5">Click "Calculate materials" to see your shopping list.</li>
    </ol>
  </section>

  <section>
    <h2 data-i18n="faqTitle">Frequently asked questions</h2>
    <h3 data-i18n="faq1q">How much thread does one fly use?</h3>
    <p data-i18n="faq1a">A typical #14 dry fly uses about 40–60 cm of thread. A #4 streamer can use 1.5–2 meters. A standard 100-meter spool of 8/0 thread can tie roughly 200–300 dry flies or 50–70 streamers.</p>

    <h3 data-i18n="faq2q">How many flies can I tie with one hackle pack?</h3>
    <p data-i18n="faq2a">A quality dry fly hackle pack (like Whiting or Metz) contains enough feathers for 100–300 flies, depending on hook size. Smaller hooks (#18–22) use less hackle per fly and stretch farther.</p>

    <h3 data-i18n="faq3q">Do I really need lead wire?</h3>
    <p data-i18n="faq3a">For nymphs and streamers that need to sink quickly, yes. For dry flies, never — weight would prevent them from floating. Many modern tyers use tungsten or lead-free wire alternatives, which are denser and more environmentally friendly.</p>

    <h3 data-i18n="faq4q">Why buy extra materials?</h3>
    <p data-i18n="faq4a">Materials get wasted in three ways: mistakes while learning a new pattern, variation between flies (some come out heavier than others), and loss during fishing. Buy 20–30% more than the calculator suggests, especially for a new pattern.</p>

    <div class="disclaimer" data-i18n="disclaimer"><strong>Note:</strong> This is an estimate for planning purposes. Actual material usage varies by pattern and individual tying style. Always start with a little extra on hand.</div>
  </section>
</main>

<footer class="footer" data-i18n="footer">Runs entirely in your browser. No data is collected or stored.</footer>

<script src="js/i18n.js"><\/script>
<script src="js/calculator.js"><\/script>
</body>
</html>`;
}

// ============================================================
// CSS — 户外钓鱼风
// ============================================================
const STYLE_CSS = `:root {
  --bg: #f0f7f4; --card: #ffffff; --text: #1a2e26; --muted: #5c7a6e;
  --accent: #0d7377; --accent-dark: #095457; --water: #14a098; --brown: #8b5a3c;
  --border: #d5e5dc; --radius: 14px;
  --shadow: 0 1px 3px rgba(26,46,38,0.06), 0 8px 24px rgba(13,115,119,0.08);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", Roboto, sans-serif; background: var(--bg); color: var(--text); line-height: 1.65; -webkit-font-smoothing: antialiased; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* ---------- Hero ---------- */
.hero {
  position: relative;
  overflow: hidden;
  color: #fff;
  padding: 64px 20px 96px;
  background:
    radial-gradient(circle at 20% 20%, rgba(20,160,152,0.35) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(139,90,60,0.30) 0%, transparent 55%),
    linear-gradient(135deg, #0a2e2a 0%, #0d4a45 45%, #0d7377 100%);
}
.hero::before {
  content: "";
  position: absolute; inset: 0;
  background-image:
    repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 42px),
    radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: auto, 24px 24px;
  pointer-events: none;
}
.hero::after {
  content: "";
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0,20,15,0.40) 100%);
  pointer-events: none;
}
.hero-inner { max-width: 720px; margin: 0 auto; position: relative; z-index: 2; text-align: center; }
.hero-badge {
  display: inline-block;
  background: rgba(20,160,152,0.20);
  border: 1px solid rgba(20,160,152,0.50);
  color: #7fdbd0;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 18px;
}
.hero h1 { font-size: 2.1rem; margin: 0 0 12px; font-weight: 800; letter-spacing: -0.02em; }
.hero p { margin: 0 auto; opacity: 0.92; font-size: 1rem; max-width: 560px; }

/* ---------- Lang switcher ---------- */
.lang-switch { position: absolute; top: 16px; right: 16px; z-index: 3; }
.lang-switch select {
  appearance: none; -webkit-appearance: none;
  background-color: rgba(255,255,255,0.12);
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat; background-position: right 10px center; background-size: 14px;
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff; padding: 7px 32px 7px 12px; border-radius: 8px;
  font-size: 0.85rem; font-family: inherit; cursor: pointer;
}
.lang-switch select:hover { background-color: rgba(255,255,255,0.25); }
.lang-switch select option { color: #1a2e26; background: #fff; }

/* ---------- Layout ---------- */
.wrap { max-width: 720px; margin: -56px auto 0; padding: 0 20px 64px; position: relative; z-index: 2; }
.card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; margin-bottom: 22px; box-shadow: var(--shadow); }

label { display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; }
input, select { width: 100%; padding: 11px 13px; border: 1px solid #c5d8ce; border-radius: 9px; font-size: 1rem; margin-bottom: 18px; background: #fff; color: var(--text); transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
input:focus, select:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(13,115,119,0.15); }
.row { display: flex; gap: 14px; }
.row > div { flex: 1; }
button.calc { width: 100%; padding: 15px; background: var(--accent); color: #fff; border: none; border-radius: 9px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.15s, transform 0.1s; font-family: inherit; }
button.calc:hover { background: var(--accent-dark); }
button.calc:active { transform: scale(0.99); }

/* ---------- Result ---------- */
#result { margin-top: 24px; padding: 24px; border-radius: 14px; background: linear-gradient(135deg, #ecfaf7 0%, #f0f7f4 100%); border: 2px solid var(--accent); display: none; animation: fadeIn 0.35s ease; }
#result.show { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.result-label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.07em; font-weight: 700; color: #0d7377; margin-bottom: 4px; }
.total-flies { font-size: 2.6rem; font-weight: 800; color: #0a2e2a; line-height: 1; letter-spacing: -0.02em; }
.total-flies::after { content: " flies"; font-size: 1rem; font-weight: 500; color: var(--muted); margin-left: 8px; }
.breakdown { margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(13,115,119,0.20); }
.bd-row { display: flex; justify-content: space-between; padding: 7px 0; font-size: 0.9rem; color: #1a2e26; }
.bd-row strong { color: #0a2e2a; font-weight: 600; }
.bd-divider { height: 1px; background: rgba(13,115,119,0.15); margin: 10px 0; }
.bd-total { font-size: 1rem; padding-top: 10px; }
.bd-total strong { color: #0d7377; font-size: 1.15rem; }
.result-disclaimer { margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(13,115,119,0.15); font-size: 0.78rem; color: var(--muted); }

/* ---------- Content ---------- */
h2 { font-size: 1.25rem; margin: 36px 0 12px; letter-spacing: -0.01em; }
h3 { font-size: 1rem; margin: 22px 0 6px; }
p { margin: 0 0 14px; }
ul, ol { margin: 0 0 16px; padding-left: 22px; }
li { margin-bottom: 8px; line-height: 1.65; }
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; margin: 14px 0; }
th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #d5e5dc; }
th { background: #ecfaf7; font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; color: #0d7377; }
tr:last-child td { border-bottom: none; }
.disclaimer { font-size: 0.85rem; color: var(--muted); border-left: 3px solid var(--accent); padding: 4px 0 4px 14px; margin-top: 18px; }
.footer { text-align: center; font-size: 0.8rem; color: var(--muted); padding: 24px 20px 48px; }

@media (max-width: 560px) {
  .hero { padding: 48px 16px 80px; }
  .hero h1 { font-size: 1.5rem; }
  .lang-switch { position: static; display: flex; justify-content: center; margin-bottom: 16px; }
  .wrap { padding: 0 14px 48px; }
  .card { padding: 20px; }
  .row { flex-direction: column; gap: 0; }
  .total-flies { font-size: 2.1rem; }
}`;

// ============================================================
// i18n.js
// ============================================================
const I18N_JS = `const SUPPORTED_LANGS = ['en','zh','zh-TW','ja','ko','de','ru','es'];
const DEFAULT_LANG = 'en';
const MARKER = '/fly-tying-calculator';

const LANG_TO_PATH = { 'en':'/', 'zh':'/zh/', 'zh-TW':'/zh-tw/', 'ja':'/ja/', 'ko':'/ko/', 'de':'/de/', 'ru':'/ru/', 'es':'/es/' };
const SEG_TO_LANG = { 'zh':'zh', 'zh-tw':'zh-TW', 'ja':'ja', 'ko':'ko', 'de':'de', 'ru':'ru', 'es':'es' };

let currentLang = DEFAULT_LANG;
let translations = {};
const cache = {};

function getBase() {
  const p = window.location.pathname;
  const idx = p.indexOf(MARKER);
  if (idx !== -1) return p.slice(0, idx + MARKER.length);
  return '';
}

function detectPageLang() {
  if (window.__FORCE_LANG__ && SUPPORTED_LANGS.includes(window.__FORCE_LANG__)) return window.__FORCE_LANG__;
  const p = window.location.pathname;
  const base = getBase();
  const rest = base ? p.slice(base.length) : p;
  const segs = rest.split('/').filter(Boolean);
  if (segs.length > 0) {
    const first = segs[0].toLowerCase();
    if (SEG_TO_LANG[first]) return SEG_TO_LANG[first];
  }
  return DEFAULT_LANG;
}

async function loadLocale(lang) {
  if (cache[lang]) return cache[lang];
  const base = getBase();
  const res = await fetch(base + '/locales/' + lang + '.json');
  if (!res.ok) throw new Error('Failed to load locale: ' + lang);
  const data = await res.json();
  cache[lang] = data;
  return data;
}

function applyTranslations(t) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] === undefined) return;
    if (key === 'disclaimer') el.innerHTML = t[key];
    else el.textContent = t[key];
  });
}

async function initPage() {
  const lang = detectPageLang();
  try { translations = await loadLocale(lang); }
  catch (err) { console.error(err); return; }
  currentLang = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang === 'zh-TW' ? 'zh-Hant' : lang;
  applyTranslations(translations);
  const select = document.getElementById('langSelect');
  if (select) select.value = lang;
  window.__i18n = { t: translations, lang: currentLang };
}

function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
  const base = getBase();
  window.location.href = base + (LANG_TO_PATH[lang] || '/');
}

document.addEventListener('DOMContentLoaded', initPage);`;

// ============================================================
// calculator.js
// ============================================================
const CALCULATOR_JS = `function t() { return (window.__i18n && window.__i18n.t) || {}; }

// 钩号系数（以 #14 为基准 1.0）
const HOOK_FACTOR = {
  '2': 4.0, '4': 3.0, '6': 2.2, '8': 1.6, '10': 1.25, '12': 1.1,
  '14': 1.0, '16': 0.8, '18': 0.65, '20': 0.5, '22': 0.4
};

// 风格系数
const STYLE_FACTOR = {
  dry: 1.0,
  wet: 1.1,
  nymph: 1.2,
  streamer: 1.6
};

// 基础材料用量（每只 #14 干蝇）
const BASE = {
  threadCm: 50,        // 绑线 50 cm
  hacklePerFly: 1.5,   // 1.5 片羽毛
  dubbingGrams: 0.02,  // 0.02 g 毛绒
  wireCm: 0,           // 干蝇不用铅丝
  hooksPerFly: 1
};

// 特殊风格额外用量
function getStyleAdjust(style) {
  if (style === 'nymph') return { wireCm: 5 };
  if (style === 'streamer') return { wireCm: 8 };
  return { wireCm: 0 };
}

function calculate() {
  const tr = t();
  const qty = parseInt(document.getElementById('quantity').value);
  const hookSize = document.getElementById('hookSize').value;
  const style = document.getElementById('style').value;
  const threadPrice = parseFloat(document.getElementById('threadPrice').value) || 0;
  const hacklePrice = parseFloat(document.getElementById('hacklePrice').value) || 0;

  if (!qty || qty <= 0) {
    alert(tr.alertQty || 'Please enter the number of flies.');
    return;
  }

  const hookF = HOOK_FACTOR[hookSize] || 1.0;
  const styleF = STYLE_FACTOR[style] || 1.0;
  const adjust = getStyleAdjust(style);

  // 每只飞蝇的材料用量
  const threadPerFlyCm = BASE.threadCm * hookF * styleF;
  const hacklePerFly = BASE.hacklePerFly * hookF * styleF;
  const dubbingPerFlyG = BASE.dubbingGrams * hookF * styleF;
  const wirePerFlyCm = (adjust.wireCm * hookF);

  // 总量
  const totalThreadM = (threadPerFlyCm * qty) / 100;
  const totalHackle = Math.ceil(hacklePerFly * qty);
  const totalDubbingG = dubbingPerFlyG * qty;
  const totalWireCm = wirePerFlyCm * qty;
  const totalHooks = qty + 2; // 多备 2 个钩子

  // 成本估算（每卷绑线 100m，每包羽毛 100 片）
  const threadCost = (totalThreadM / 100) * threadPrice;
  const hackleCost = (totalHackle / 100) * hacklePrice;
  const hookCost = qty * 0.15; // 假设每个钩子 $0.15
  const totalCost = threadCost + hackleCost + hookCost;

  const fmtThread = totalThreadM < 1
    ? (totalThreadM * 100).toFixed(0) + ' cm'
    : totalThreadM.toFixed(1) + ' m';

  document.getElementById('totalFlies').textContent = qty;
  document.getElementById('bdThread').textContent = fmtThread;
  document.getElementById('bdHackle').textContent = totalHackle + ' ' + (tr.unitFeathers || 'feathers');
  document.getElementById('bdDubbing').textContent = totalDubbingG.toFixed(2) + ' g';
  document.getElementById('bdWire').textContent = totalWireCm > 0
    ? totalWireCm.toFixed(0) + ' cm'
    : (tr.none || '—');
  document.getElementById('bdHooks').textContent = totalHooks + ' ' + (tr.unitHooks || 'hooks');
  document.getElementById('bdCost').textContent = '$' + totalCost.toFixed(2);

  document.getElementById('result').classList.add('show');
}

window.calculate = calculate;`;

// ============================================================
// Locales
// ============================================================
const LOCALES = {
  'en': {
    title: "Fly Tying Material Calculator",
    subtitle: "Estimate thread, hackle, dubbing, and wire for any pattern — before you tie a single fly.",
    calcHeading: "Calculator",
    qtyLabel: "Number of flies", hookLabel: "Hook size", styleLabel: "Fly style",
    styleDry: "Dry fly", styleWet: "Wet fly", styleNymph: "Nymph", styleStreamer: "Streamer",
    threadLabel: "Thread spool price ($)", hackleLabel: "Hackle price ($ per pack)",
    calcBtn: "Calculate materials",
    resultLabel: "Materials needed for",
    bdThread: "Thread", bdHackle: "Hackle feathers", bdDubbing: "Dubbing",
    bdWire: "Lead wire", bdHooks: "Hooks", bdCost: "Estimated material cost",
    unitFeathers: "feathers", unitHooks: "hooks", none: "—",
    resultDisclaimer: "Estimate only. Actual material usage varies by pattern, tying style, and individual technique. Always buy a little extra.",
    whatIsTitle: "How material usage is estimated",
    whatIsText: "Fly tying material consumption depends on three main factors: the hook size (which determines the scale of the fly), the style of fly (dry, wet, nymph, or streamer), and the total quantity you plan to tie. This calculator combines these into a practical material shopping list so you can plan your session and budget before you sit at the vise.",
    factorsTitle: "What affects material usage",
    f1Title: "Hook size",
    f1Text: "A #4 streamer hook uses roughly 4 times the thread and materials of a #16 dry fly hook. As hook size increases (lower number), material needs scale up significantly.",
    f2Title: "Fly style",
    f2a: "Dry fly: baseline — light materials, hackle-heavy",
    f2b: "Wet fly: ~10% more thread, slightly more dubbing",
    f2c: "Nymph: ~20% more, plus lead wire for weight",
    f2d: "Streamer: ~60% more — larger hooks, more materials per fly",
    f3Title: "Materials tracked",
    f3a: "Thread: measured in meters — the backbone of every fly",
    f3b: "Hackle: feathers wrapped around the hook for legs and movement",
    f3c: "Dubbing: fur or synthetic blend for the body",
    f3d: "Lead wire: for weight, used mainly in nymphs and streamers",
    f3e: "Hooks: one per fly (plus a few for practice)",
    howToTitle: "How to use this calculator",
    howTo1: "Enter the number of flies you plan to tie.",
    howTo2: "Choose your hook size — this is the biggest factor.",
    howTo3: "Select the fly style you're tying.",
    howTo4: "Enter current prices for thread and hackle to see material cost.",
    howTo5: "Click \"Calculate materials\" to see your shopping list.",
    faqTitle: "Frequently asked questions",
    faq1q: "How much thread does one fly use?",
    faq1a: "A typical #14 dry fly uses about 40–60 cm of thread. A #4 streamer can use 1.5–2 meters. A standard 100-meter spool of 8/0 thread can tie roughly 200–300 dry flies or 50–70 streamers.",
    faq2q: "How many flies can I tie with one hackle pack?",
    faq2a: "A quality dry fly hackle pack (like Whiting or Metz) contains enough feathers for 100–300 flies, depending on hook size. Smaller hooks (#18–22) use less hackle per fly and stretch farther.",
    faq3q: "Do I really need lead wire?",
    faq3a: "For nymphs and streamers that need to sink quickly, yes. For dry flies, never — weight would prevent them from floating. Many modern tyers use tungsten or lead-free wire alternatives, which are denser and more environmentally friendly.",
    faq4q: "Why buy extra materials?",
    faq4a: "Materials get wasted in three ways: mistakes while learning a new pattern, variation between flies (some come out heavier than others), and loss during fishing. Buy 20–30% more than the calculator suggests, especially for a new pattern.",
    disclaimer: "<strong>Note:</strong> This is an estimate for planning purposes. Actual material usage varies by pattern and individual tying style. Always start with a little extra on hand.",
    footer: "Runs entirely in your browser. No data is collected or stored.",
    alertQty: "Please enter the number of flies."
  },
  'zh': {
    title: "飞蝇绑制材料计算器",
    subtitle: "在绑制每一只飞蝇之前，估算所需的绑线、羽毛、毛绒和铅丝。",
    calcHeading: "计算器",
    qtyLabel: "飞蝇数量", hookLabel: "鱼钩型号", styleLabel: "飞蝇类型",
    styleDry: "干蝇", styleWet: "湿蝇", styleNymph: "若虫", styleStreamer: "饰带蝇",
    threadLabel: "绑线卷价格（美元）", hackleLabel: "羽毛包价格（美元）",
    calcBtn: "计算材料用量",
    resultLabel: "所需材料",
    bdThread: "绑线", bdHackle: "羽毛", bdDubbing: "毛绒",
    bdWire: "铅丝", bdHooks: "鱼钩", bdCost: "预估材料成本",
    unitFeathers: "片", unitHooks: "个", none: "—",
    resultDisclaimer: "仅为估算值。实际用量会因图案、绑制风格和个人技法而不同。建议多买一些备用。",
    whatIsTitle: "材料用量是如何估算的",
    whatIsText: "飞蝇绑制材料消耗量取决于三个主要因素：鱼钩型号（决定飞蝇的尺寸）、飞蝇类型（干蝇、湿蝇、若虫或饰带蝇）以及计划绑制的总数量。本计算器综合这些因素，生成实用的材料清单，帮助您在坐到绑制台前做好预算和规划。",
    factorsTitle: "影响材料用量的因素",
    f1Title: "鱼钩型号",
    f1Text: "一个 #4 饰带蝇鱼钩使用的绑线和材料，大约是 #16 干蝇鱼钩的 4 倍。钩号越大（数字越小），材料需求显著增加。",
    f2Title: "飞蝇类型",
    f2a: "干蝇：基准——材料轻，羽毛用量大",
    f2b: "湿蝇：绑线约多 10%，毛绒略多",
    f2c: "若虫：约多 20%，并需要铅丝配重",
    f2d: "饰带蝇：约多 60%——钩子更大，每只飞蝇用材更多",
    f3Title: "跟踪的材料",
    f3a: "绑线：以米计量——每只飞蝇的骨架",
    f3b: "羽毛：缠绕在鱼钩上，形成腿部和动态",
    f3c: "毛绒：用于身体的毛皮或合成混纺材料",
    f3d: "铅丝：用于配重，主要用于若虫和饰带蝇",
    f3e: "鱼钩：每只飞蝇一个（另备几个练习用）",
    howToTitle: "如何使用本计算器",
    howTo1: "输入计划绑制的飞蝇数量。",
    howTo2: "选择鱼钩型号——这是最重要的因素。",
    howTo3: "选择要绑制的飞蝇类型。",
    howTo4: "输入绑线和羽毛的当前价格，查看材料成本。",
    howTo5: "点击“计算材料用量”，查看购物清单。",
    faqTitle: "常见问题",
    faq1q: "一只飞蝇用多少绑线？",
    faq1a: "一只典型的 #14 干蝇使用约 40–60 厘米绑线。一只 #4 饰带蝇可能使用 1.5–2 米。一卷标准的 100 米 8/0 绑线大约可绑 200–300 只干蝇或 50–70 只饰带蝇。",
    faq2q: "一包羽毛能绑多少只飞蝇？",
    faq2a: "一包优质的干蝇羽毛（如 Whiting 或 Metz）含有的羽毛可供绑制 100–300 只飞蝇，具体取决于钩号。较小的钩子（#18–22）每只飞蝇用的羽毛更少，能绑更多。",
    faq3q: "真的需要铅丝吗？",
    faq3a: "对于需要快速下沉的若虫和饰带蝇，是的。对于干蝇，绝对不需要——配重会让它们无法漂浮。许多现代绑制者使用钨丝或无铅金属丝替代品，密度更高且更环保。",
    faq4q: "为什么要多买材料？",
    faq4a: "材料会在三个方面被浪费：学习新图案时的失误、飞蝇之间的差异（有些做得更重），以及钓鱼时的丢失。建议比计算器建议的多买 20–30%，尤其是新图案。",
    disclaimer: "<strong>注意：</strong>本结果仅供计划参考。实际用量会因图案和个人绑制风格而不同。建议始终多准备一些。",
    footer: "完全在您的浏览器中运行。不收集、不存储任何数据。",
    alertQty: "请输入飞蝇数量。"
  },
  'zh-TW': {
    title: "飛蠅綁製材料計算器",
    subtitle: "在綁製每一隻飛蠅之前，估算所需的綁線、羽毛、毛絨和鉛絲。",
    calcHeading: "計算器",
    qtyLabel: "飛蠅數量", hookLabel: "魚鉤型號", styleLabel: "飛蠅類型",
    styleDry: "乾蠅", styleWet: "濕蠅", styleNymph: "若蟲", styleStreamer: "飾帶蠅",
    threadLabel: "綁線捲價格（美元）", hackleLabel: "羽毛包價格（美元）",
    calcBtn: "計算材料用量",
    resultLabel: "所需材料",
    bdThread: "綁線", bdHackle: "羽毛", bdDubbing: "毛絨",
    bdWire: "鉛絲", bdHooks: "魚鉤", bdCost: "預估材料成本",
    unitFeathers: "片", unitHooks: "個", none: "—",
    resultDisclaimer: "僅為估算值。實際用量會因圖案、綁製風格和個人技法而不同。建議多買一些備用。",
    whatIsTitle: "材料用量是如何估算的",
    whatIsText: "飛蠅綁製材料消耗量取決於三個主要因素：魚鉤型號（決定飛蠅的尺寸）、飛蠅類型（乾蠅、濕蠅、若蟲或飾帶蠅）以及計畫綁製的總數量。本計算器綜合這些因素，生成實用的材料清單，幫助您在坐到綁製台前做好預算和規劃。",
    factorsTitle: "影響材料用量的因素",
    f1Title: "魚鉤型號",
    f1Text: "一個 #4 飾帶蠅魚鉤使用的綁線和材料，大約是 #16 乾蠅魚鉤的 4 倍。鉤號越大（數字越小），材料需求顯著增加。",
    f2Title: "飛蠅類型",
    f2a: "乾蠅：基準——材料輕，羽毛用量大",
    f2b: "濕蠅：綁線約多 10%，毛絨略多",
    f2c: "若蟲：約多 20%，並需要鉛絲配重",
    f2d: "飾帶蠅：約多 60%——鉤子更大，每隻飛蠅用材更多",
    f3Title: "追蹤的材料",
    f3a: "綁線：以公尺計量——每隻飛蠅的骨架",
    f3b: "羽毛：纏繞在魚鉤上，形成腿部和動態",
    f3c: "毛絨：用於身體的毛皮或合成混紡材料",
    f3d: "鉛絲：用於配重，主要用於若蟲和飾帶蠅",
    f3e: "魚鉤：每隻飛蠅一個（另備幾個練習用）",
    howToTitle: "如何使用本計算器",
    howTo1: "輸入計畫綁製的飛蠅數量。",
    howTo2: "選擇魚鉤型號——這是最重要的因素。",
    howTo3: "選擇要綁製的飛蠅類型。",
    howTo4: "輸入綁線和羽毛的當前價格，查看材料成本。",
    howTo5: "點擊「計算材料用量」，查看購物清單。",
    faqTitle: "常見問題",
    faq1q: "一隻飛蠅用多少綁線？",
    faq1a: "一隻典型的 #14 乾蠅使用約 40–60 公分綁線。一隻 #4 飾帶蠅可能使用 1.5–2 公尺。一捲標準的 100 公尺 8/0 綁線大約可綁 200–300 隻乾蠅或 50–70 隻飾帶蠅。",
    faq2q: "一包羽毛能綁多少隻飛蠅？",
    faq2a: "一包優質的乾蠅羽毛（如 Whiting 或 Metz）含有的羽毛可供綁製 100–300 隻飛蠅，具體取決於鉤號。較小的鉤子（#18–22）每隻飛蠅用的羽毛更少，能綁更多。",
    faq3q: "真的需要鉛絲嗎？",
    faq3a: "對於需要快速下沉的若蟲和飾帶蠅，是的。對於乾蠅，絕對不需要——配重會讓它們無法漂浮。許多現代綁製者使用鎢絲或無鉛金屬絲替代品，密度更高且更環保。",
    faq4q: "為什麼要多買材料？",
    faq4a: "材料會在三個方面被浪費：學習新圖案時的失誤、飛蠅之間的差異（有些做得更重），以及釣魚時的丟失。建議比計算器建議的多買 20–30%，尤其是新圖案。",
    disclaimer: "<strong>注意：</strong>本結果僅供計畫參考。實際用量會因圖案和個人綁製風格而不同。建議始終多準備一些。",
    footer: "完全在您的瀏覽器中運行。不收集、不儲存任何資料。",
    alertQty: "請輸入飛蠅數量。"
  },
  'ja': {
    title: "フライタイイング材料計算ツール",
    subtitle: "1匹のフライを巻く前に、必要なスレッド、ハックル、ダビング、ワイヤーを推定します。",
    calcHeading: "計算ツール",
    qtyLabel: "フライの数", hookLabel: "フックサイズ", styleLabel: "フライのスタイル",
    styleDry: "ドライフライ", styleWet: "ウェットフライ", styleNymph: "ニンフ", styleStreamer: "ストリーマー",
    threadLabel: "スレッドスプール価格（$）", hackleLabel: "ハックル価格（$ / パック）",
    calcBtn: "材料を計算",
    resultLabel: "必要な材料",
    bdThread: "スレッド", bdHackle: "ハックル", bdDubbing: "ダビング",
    bdWire: "鉛ワイヤー", bdHooks: "フック", bdCost: "推定材料費",
    unitFeathers: "枚", unitHooks: "個", none: "—",
    resultDisclaimer: "あくまで推定値です。実際の材料使用量はパターン、タイイングスタイル、個人の技法により異なります。常に少し多めに購入してください。",
    whatIsTitle: "材料使用量の推定方法",
    whatIsText: "フライタイイングの材料消費量は3つの主要因で決まります：フックサイズ（フライの大きさを決定）、フライのスタイル（ドライ、ウェット、ニンフ、ストリーマー）、そして巻く予定の総数。この計算ツールはこれらを組み合わせて、バイスに向かう前に計画と予算を立てられるようにします。",
    factorsTitle: "材料使用量に影響する要因",
    f1Title: "フックサイズ",
    f1Text: "#4 ストリーマーフックは、#16 ドライフライフックの約4倍のスレッドと材料を使います。フックサイズが大きくなる（数字が小さくなる）と、材料の必要性が大幅に増えます。",
    f2Title: "フライのスタイル",
    f2a: "ドライフライ：基準 — 軽い材料、ハックル多め",
    f2b: "ウェットフライ：スレッド約10%増、ダビングやや多め",
    f2c: "ニンフ：約20%増、おもり用の鉛ワイヤーが必要",
    f2d: "ストリーマー：約60%増 — フックが大きく、1匹あたりの材料が多い",
    f3Title: "追跡する材料",
    f3a: "スレッド：メートル単位 — すべてのフライの骨格",
    f3b: "ハックル：フックに巻き付けて脚と動きを作る羽",
    f3c: "ダビング：ボディ用のファーまたは合成ブレンド",
    f3d: "鉛ワイヤー：おもり用、主にニンフとストリーマーに使用",
    f3e: "フック：1匹につき1個（練習用に予備も）",
    howToTitle: "使い方",
    howTo1: "巻く予定のフライの数を入力します。",
    howTo2: "フックサイズを選択します — これが最大の要因です。",
    howTo3: "巻くフライのスタイルを選択します。",
    howTo4: "スレッドとハックルの現在価格を入力して、材料費を確認します。",
    howTo5: "「材料を計算」をクリックして、ショッピングリストを表示します。",
    faqTitle: "よくある質問",
    faq1q: "フライ1匹にスレッドはどのくらい必要ですか？",
    faq1a: "典型的な #14 ドライフライは約40〜60 cmのスレッドを使います。#4 ストリーマーは1.5〜2メートル使うこともあります。標準的な100メートルの8/0スレッド1巻で、ドライフライ約200〜300匹、またはストリーマー50〜70匹が巻けます。",
    faq2q: "ハックル1パックで何匹のフライが巻けますか？",
    faq2a: "高品質のドライフライハックルパック（WhitingやMetzなど）は、フックサイズにもよりますが、100〜300匹分の羽が含まれています。小さなフック（#18〜22）は1匹あたりのハックル使用量が少ないので、より長持ちします。",
    faq3q: "鉛ワイヤーは本当に必要ですか？",
    faq3a: "素早く沈む必要があるニンフやストリーマーには必要です。ドライフライには絶対に不要 — おもりがあると浮かなくなります。多くの現代のタイヤーはタングステンや鉛フリーワイヤーを使用しており、密度が高く環境にも優しいです。",
    faq4q: "なぜ材料を多めに買うのですか？",
    faq4a: "材料は3つの方法で無駄になります：新しいパターンを学ぶときのミス、フライごとのばらつき（重いものもある）、釣り中のロスト。計算ツールの提案より20〜30%多く購入することをお勧めします。特に新しいパターンでは。",
    disclaimer: "<strong>注意：</strong>これは計画目的の推定値です。実際の材料使用量はパターンと個人のタイイングスタイルによって異なります。常に少し多めに用意してください。",
    footer: "すべてブラウザ内で実行されます。データの収集・保存は行いません。",
    alertQty: "フライの数を入力してください。"
  },
  'ko': {
    title: "플라이 타이잉 재료 계산기",
    subtitle: "플라이 한 마리를 묶기 전에 필요한 스레드, 해클, 더빙, 와이어를 추정합니다.",
    calcHeading: "계산기",
    qtyLabel: "플라이 수", hookLabel: "훅 사이즈", styleLabel: "플라이 스타일",
    styleDry: "드라이 플라이", styleWet: "웻 플라이", styleNymph: "님프", styleStreamer: "스트리머",
    threadLabel: "스레드 스풀 가격 ($)", hackleLabel: "해클 가격 ($/팩)",
    calcBtn: "재료 계산",
    resultLabel: "필요한 재료",
    bdThread: "스레드", bdHackle: "해클", bdDubbing: "더빙",
    bdWire: "리드 와이어", bdHooks: "훅", bdCost: "예상 재료비",
    unitFeathers: "장", unitHooks: "개", none: "—",
    resultDisclaimer: "추정치입니다. 실제 재료 사용량은 패턴, 타이잉 스타일, 개인 기술에 따라 다릅니다. 항상 조금 더 구매하세요.",
    whatIsTitle: "재료 사용량 추정 방법",
    whatIsText: "플라이 타이잉 재료 소비량은 세 가지 주요 요인에 따라 결정됩니다: 훅 사이즈(플라이의 크기 결정), 플라이 스타일(드라이, 웻, 님프, 스트리머), 그리고 묶을 총 개수. 이 계산기는 이를 결합하여 바이스에 앉기 전에 계획과 예산을 세울 수 있도록 합니다.",
    factorsTitle: "재료 사용량에 영향을 미치는 요인",
    f1Title: "훅 사이즈",
    f1Text: "#4 스트리머 훅은 #16 드라이 플라이 훅의 약 4배의 스레드와 재료를 사용합니다. 훅 사이즈가 커질수록(숫자가 작아질수록) 재료 필요량이 크게 증가합니다.",
    f2Title: "플라이 스타일",
    f2a: "드라이 플라이: 기준 — 가벼운 재료, 해클 위주",
    f2b: "웻 플라이: 스레드 약 10% 증가, 더빙 약간 증가",
    f2c: "님프: 약 20% 증가, 무게용 리드 와이어 필요",
    f2d: "스트리머: 약 60% 증가 — 더 큰 훅, 플라이당 더 많은 재료",
    f3Title: "추적되는 재료",
    f3a: "스레드: 미터 단위 — 모든 플라이의 골격",
    f3b: "해클: 훅에 감아 다리와 움직임을 만드는 깃털",
    f3c: "더빙: 몸통용 모피 또는 합성 블렌드",
    f3d: "리드 와이어: 무게용, 주로 님프와 스트리머에 사용",
    f3e: "훅: 플라이당 1개 (연습용 몇 개 추가)",
    howToTitle: "사용 방법",
    howTo1: "묶을 플라이 수를 입력합니다.",
    howTo2: "훅 사이즈를 선택합니다 — 가장 큰 요인입니다.",
    howTo3: "묶을 플라이 스타일을 선택합니다.",
    howTo4: "스레드와 해클의 현재 가격을 입력하여 재료비를 확인합니다.",
    howTo5: "\"재료 계산\"을 클릭하여 쇼핑 목록을 확인합니다.",
    faqTitle: "자주 묻는 질문",
    faq1q: "플라이 한 마리에 스레드가 얼마나 필요하나요?",
    faq1a: "일반적인 #14 드라이 플라이는 약 40~60 cm의 스레드를 사용합니다. #4 스트리머는 1.5~2 미터를 사용할 수 있습니다. 표준 100미터 8/0 스레드 한 스풀로 드라이 플라이 약 200~300마리 또는 스트리머 50~70마리를 묶을 수 있습니다.",
    faq2q: "해클 한 팩으로 몇 마리의 플라이를 묶을 수 있나요?",
    faq2a: "고품질 드라이 플라이 해클 팩(Whiting 또는 Metz 등)은 훅 사이즈에 따라 100~300마리 분의 깃털을 포함합니다. 작은 훅(#18~22)은 플라이당 해클 사용량이 적어 더 오래갑니다.",
    faq3q: "리드 와이어가 정말 필요한가요?",
    faq3a: "빠르게 가라앉아야 하는 님프와 스트리머에는 필요합니다. 드라이 플라이에는 절대 불필요 — 무게가 있으면 뜨지 않습니다. 많은 현대 타이어는 텅스텐이나 무연 와이어 대안을 사용하며, 밀도가 높고 환경 친화적입니다.",
    faq4q: "왜 재료를 더 사야 하나요?",
    faq4a: "재료는 세 가지 방식으로 낭비됩니다: 새로운 패턴을 배울 때의 실수, 플라이 간의 차이(일부는 더 무겁게 나옴), 낚시 중 손실. 계산기가 제안하는 것보다 20~30% 더 구매하세요, 특히 새로운 패턴의 경우.",
    disclaimer: "<strong>참고:</strong> 이것은 계획 목적의 추정치입니다. 실제 재료 사용량은 패턴과 개인 타이잉 스타일에 따라 다릅니다. 항상 조금 더 준비하세요.",
    footer: "전적으로 브라우저에서 실행됩니다. 데이터를 수집하거나 저장하지 않습니다.",
    alertQty: "플라이 수를 입력하세요."
  },
  'de': {
    title: "Fliegenbinden-Materialrechner",
    subtitle: "Schätzen Sie Faden, Hechel, Dubbing und Draht für jedes Muster — bevor Sie eine einzige Fliege binden.",
    calcHeading: "Rechner",
    qtyLabel: "Anzahl der Fliegen", hookLabel: "Hakengröße", styleLabel: "Fliegenstil",
    styleDry: "Trockenfliege", styleWet: "Nassfliege", styleNymph: "Nymphe", styleStreamer: "Streamer",
    threadLabel: "Bindfaden-Preis ($)", hackleLabel: "Hechel-Preis ($ pro Packung)",
    calcBtn: "Material berechnen",
    resultLabel: "Benötigtes Material für",
    bdThread: "Bindfaden", bdHackle: "Hecheln", bdDubbing: "Dubbing",
    bdWire: "Bleidraht", bdHooks: "Haken", bdCost: "Geschätzte Materialkosten",
    unitFeathers: "Federn", unitHooks: "Haken", none: "—",
    resultDisclaimer: "Nur eine Schätzung. Der tatsächliche Materialverbrauch variiert je nach Muster, Bindestil und individueller Technik. Kaufen Sie immer etwas extra.",
    whatIsTitle: "Wie der Materialverbrauch geschätzt wird",
    whatIsText: "Der Materialverbrauch beim Fliegenbinden hängt von drei Hauptfaktoren ab: der Hakengröße (die die Größe der Fliege bestimmt), dem Fliegenstil (Trocken, Nass, Nymphe oder Streamer) und der Gesamtmenge, die Sie binden möchten. Dieser Rechner kombiniert diese zu einer praktischen Materialliste, damit Sie Ihre Sitzung und Ihr Budget planen können, bevor Sie sich an den Stock setzen.",
    factorsTitle: "Was den Materialverbrauch beeinflusst",
    f1Title: "Hakengröße",
    f1Text: "Ein #4 Streamer-Haken verbraucht etwa das 4-fache an Faden und Material eines #16 Trockenfliegen-Hakens. Mit zunehmender Hakengröße (kleinere Zahl) steigt der Materialbedarf deutlich.",
    f2Title: "Fliegenstil",
    f2a: "Trockenfliege: Basis — leichtes Material, hechellastig",
    f2b: "Nassfliege: ~10% mehr Faden, etwas mehr Dubbing",
    f2c: "Nymphe: ~20% mehr, plus Bleidraht für Gewicht",
    f2d: "Streamer: ~60% mehr — größere Haken, mehr Material pro Fliege",
    f3Title: "Verfolgte Materialien",
    f3a: "Faden: in Metern gemessen — das Rückgrat jeder Fliege",
    f3b: "Hechel: Federn, die um den Haken gewickelt werden, für Beine und Bewegung",
    f3c: "Dubbing: Fell oder synthetische Mischung für den Körper",
    f3d: "Bleidraht: für Gewicht, hauptsächlich bei Nymphen und Streamern",
    f3e: "Haken: einer pro Fliege (plus ein paar zum Üben)",
    howToTitle: "Verwendung",
    howTo1: "Geben Sie die Anzahl der Fliegen ein, die Sie binden möchten.",
    howTo2: "Wählen Sie Ihre Hakengröße — dies ist der größte Faktor.",
    howTo3: "Wählen Sie den Fliegenstil, den Sie binden.",
    howTo4: "Geben Sie aktuelle Preise für Faden und Hechel ein, um die Materialkosten zu sehen.",
    howTo5: "Klicken Sie auf \"Material berechnen\", um Ihre Einkaufsliste zu sehen.",
    faqTitle: "Häufig gestellte Fragen",
    faq1q: "Wie viel Faden verbraucht eine Fliege?",
    faq1a: "Eine typische #14 Trockenfliege verbraucht etwa 40–60 cm Faden. Ein #4 Streamer kann 1,5–2 Meter verbrauchen. Eine Standard-100-Meter-Spule 8/0 Faden reicht für etwa 200–300 Trockenfliegen oder 50–70 Streamer.",
    faq2q: "Wie viele Fliegen kann ich mit einer Hechelpackung binden?",
    faq2a: "Eine hochwertige Trockenfliegen-Hechelpackung (wie Whiting oder Metz) enthält genug Federn für 100–300 Fliegen, je nach Hakengröße. Kleinere Haken (#18–22) verbrauchen weniger Hechel pro Fliege und reichen weiter.",
    faq3q: "Brauche ich wirklich Bleidraht?",
    faq3a: "Für Nymphen und Streamer, die schnell sinken müssen, ja. Für Trockenfliegen niemals — Gewicht würde sie am Schwimmen hindern. Viele moderne Binder verwenden Tungsten- oder bleifreie Drahtalternativen, die dichter und umweltfreundlicher sind.",
    faq4q: "Warum extra Material kaufen?",
    faq4a: "Material wird auf drei Arten verschwendet: Fehler beim Erlernen eines neuen Musters, Variationen zwischen Fliegen (manche werden schwerer), und Verlust beim Fischen. Kaufen Sie 20–30% mehr als der Rechner vorschlägt, besonders bei einem neuen Muster.",
    disclaimer: "<strong>Hinweis:</strong> Dies ist eine Schätzung zu Planungszwecken. Der tatsächliche Materialverbrauch variiert je nach Muster und individuellem Bindestil. Beginnen Sie immer mit etwas extra.",
    footer: "Läuft vollständig in Ihrem Browser. Es werden keine Daten gesammelt oder gespeichert.",
    alertQty: "Bitte geben Sie die Anzahl der Fliegen ein."
  },
  'ru': {
    title: "Калькулятор материалов для вязания мушек",
    subtitle: "Оцените нить, перья, даббинг и проволоку для любого узора — до того, как свяжете первую мушку.",
    calcHeading: "Калькулятор",
    qtyLabel: "Количество мушек", hookLabel: "Размер крючка", styleLabel: "Стиль мушки",
    styleDry: "Сухая мушка", styleWet: "Мокрая мушка", styleNymph: "Нимфа", styleStreamer: "Стример",
    threadLabel: "Цена катушки нити ($)", hackleLabel: "Цена пера ($ за упаковку)",
    calcBtn: "Рассчитать материалы",
    resultLabel: "Необходимые материалы для",
    bdThread: "Нить", bdHackle: "Перья", bdDubbing: "Даббинг",
    bdWire: "Свинцовая проволока", bdHooks: "Крючки", bdCost: "Ориентировочная стоимость материалов",
    unitFeathers: "перьев", unitHooks: "крючков", none: "—",
    resultDisclaimer: "Только оценка. Фактический расход зависит от узора, стиля вязания и индивидуальной техники. Всегда покупайте немного больше.",
    whatIsTitle: "Как оценивается расход материалов",
    whatIsText: "Расход материалов при вязании мушек зависит от трёх основных факторов: размера крючка (определяет масштаб мушки), стиля мушки (сухая, мокрая, нимфа или стример) и общего количества, которое вы планируете связать. Этот калькулятор объединяет их в практический список покупок, чтобы вы могли спланировать сессию и бюджет до того, как сядете за станок.",
    factorsTitle: "Что влияет на расход материалов",
    f1Title: "Размер крючка",
    f1Text: "Крючок #4 для стримера расходует примерно в 4 раза больше нити и материалов, чем крючок #16 для сухой мушки. С увеличением размера крючка (меньшее число) потребность в материалах значительно возрастает.",
    f2Title: "Стиль мушки",
    f2a: "Сухая мушка: базовый уровень — лёгкие материалы, много пера",
    f2b: "Мокрая мушка: на ~10% больше нити, чуть больше даббинга",
    f2c: "Нимфа: на ~20% больше, плюс свинцовая проволока для веса",
    f2d: "Стример: на ~60% больше — крупные крючки, больше материалов на мушку",
    f3Title: "Отслеживаемые материалы",
    f3a: "Нить: измеряется в метрах — основа каждой мушки",
    f3b: "Перо: обматывается вокруг крючка для ножек и движения",
    f3c: "Даббинг: мех или синтетическая смесь для тела",
    f3d: "Свинцовая проволока: для веса, в основном для нимф и стримеров",
    f3e: "Крючки: по одному на мушку (плюс несколько для практики)",
    howToTitle: "Как пользоваться",
    howTo1: "Введите количество мушек, которое планируете связать.",
    howTo2: "Выберите размер крючка — это главный фактор.",
    howTo3: "Выберите стиль мушки, который вяжете.",
    howTo4: "Введите текущие цены на нить и перо, чтобы увидеть стоимость материалов.",
    howTo5: "Нажмите «Рассчитать материалы», чтобы увидеть список покупок.",
    faqTitle: "Часто задаваемые вопросы",
    faq1q: "Сколько нити расходует одна мушка?",
    faq1a: "Типичная сухая мушка #14 расходует около 40–60 см нити. Стример #4 может использовать 1,5–2 метра. Стандартной катушки 8/0 длиной 100 метров хватает примерно на 200–300 сухих мушек или 50–70 стримеров.",
    faq2q: "Сколько мушек можно связать из одной упаковки пера?",
    faq2a: "Качественная упаковка пера для сухих мушек (например, Whiting или Metz) содержит достаточно перьев для 100–300 мушек, в зависимости от размера крючка. Маленькие крючки (#18–22) расходуют меньше пера на мушку.",
    faq3q: "Действительно ли нужна свинцовая проволока?",
    faq3a: "Для нимф и стримеров, которым нужно быстро тонуть, да. Для сухих мушек — никогда: вес не даст им плавать. Многие современные вязальщики используют вольфрам или бессвинцовые альтернативы, которые плотнее и экологичнее.",
    faq4q: "Почему стоит покупать материалы с запасом?",
    faq4a: "Материалы тратятся впустую тремя способами: ошибки при изучении нового узора, различия между мушками (некоторые получаются тяжелее), и потери при рыбалке. Покупайте на 20–30% больше, чем предлагает калькулятор, особенно для нового узора.",
    disclaimer: "<strong>Примечание:</strong> Это оценка для планирования. Фактический расход зависит от узора и индивидуального стиля вязания. Всегда начинайте с небольшим запасом.",
    footer: "Полностью работает в вашем браузере. Данные не собираются и не хранятся.",
    alertQty: "Пожалуйста, введите количество мушек."
  },
  'es': {
    title: "Calculadora de Materiales para Montaje de Moscas",
    subtitle: "Estime hilo, pluma, dubbing y alambre para cualquier patrón — antes de montar una sola mosca.",
    calcHeading: "Calculadora",
    qtyLabel: "Número de moscas", hookLabel: "Tamaño del anzuelo", styleLabel: "Estilo de mosca",
    styleDry: "Mosca seca", styleWet: "Mosca ahogada", styleNymph: "Ninfa", styleStreamer: "Streamer",
    threadLabel: "Precio del carrete de hilo ($)", hackleLabel: "Precio de pluma ($ por paquete)",
    calcBtn: "Calcular materiales",
    resultLabel: "Materiales necesarios para",
    bdThread: "Hilo", bdHackle: "Plumas", bdDubbing: "Dubbing",
    bdWire: "Alambre de plomo", bdHooks: "Anzuelos", bdCost: "Coste estimado de materiales",
    unitFeathers: "plumas", unitHooks: "anzuelos", none: "—",
    resultDisclaimer: "Solo una estimación. El uso real varía según el patrón, el estilo de montaje y la técnica individual. Siempre compre un poco más.",
    whatIsTitle: "Cómo se estima el uso de materiales",
    whatIsText: "El consumo de materiales en el montaje de moscas depende de tres factores principales: el tamaño del anzuelo (que determina la escala de la mosca), el estilo de la mosca (seca, ahogada, ninfa o streamer) y la cantidad total que planea montar. Esta calculadora los combina en una lista práctica de compras para que pueda planificar su sesión y presupuesto antes de sentarse al tornillo.",
    factorsTitle: "Qué afecta al uso de materiales",
    f1Title: "Tamaño del anzuelo",
    f1Text: "Un anzuelo #4 para streamer usa aproximadamente 4 veces el hilo y materiales de un anzuelo #16 para mosca seca. A medida que aumenta el tamaño del anzuelo (número menor), la necesidad de materiales crece significativamente.",
    f2Title: "Estilo de mosca",
    f2a: "Mosca seca: base — materiales ligeros, mucha pluma",
    f2b: "Mosca ahogada: ~10% más hilo, algo más de dubbing",
    f2c: "Ninfa: ~20% más, más alambre de plomo para peso",
    f2d: "Streamer: ~60% más — anzuelos más grandes, más materiales por mosca",
    f3Title: "Materiales rastreados",
    f3a: "Hilo: medido en metros — la columna vertebral de cada mosca",
    f3b: "Pluma: envuelta alrededor del anzuelo para patas y movimiento",
    f3c: "Dubbing: piel o mezcla sintética para el cuerpo",
    f3d: "Alambre de plomo: para peso, usado principalmente en ninfas y streamers",
    f3e: "Anzuelos: uno por mosca (más algunos para practicar)",
    howToTitle: "Cómo usar esta calculadora",
    howTo1: "Introduzca el número de moscas que planea montar.",
    howTo2: "Elija el tamaño del anzuelo — este es el factor más importante.",
    howTo3: "Seleccione el estilo de mosca que está montando.",
    howTo4: "Introduzca los precios actuales de hilo y pluma para ver el coste de materiales.",
    howTo5: "Haga clic en \"Calcular materiales\" para ver su lista de compras.",
    faqTitle: "Preguntas frecuentes",
    faq1q: "¿Cuánto hilo usa una mosca?",
    faq1a: "Una mosca seca típica #14 usa unos 40–60 cm de hilo. Un streamer #4 puede usar 1,5–2 metros. Un carrete estándar de 100 metros de hilo 8/0 puede montar aproximadamente 200–300 moscas secas o 50–70 streamers.",
    faq2q: "¿Cuántas moscas puedo montar con un paquete de pluma?",
    faq2a: "Un paquete de pluma de calidad para mosca seca (como Whiting o Metz) contiene suficientes plumas para 100–300 moscas, según el tamaño del anzuelo. Los anzuelos pequeños (#18–22) usan menos pluma por mosca y duran más.",
    faq3q: "¿Realmente necesito alambre de plomo?",
    faq3a: "Para ninfas y streamers que necesitan hundirse rápidamente, sí. Para moscas secas, nunca — el peso les impediría flotar. Muchos montadores modernos usan tungsteno o alternativas sin plomo, que son más densas y respetuosas con el medio ambiente.",
    faq4q: "¿Por qué comprar materiales extra?",
    faq4a: "Los materiales se desperdician de tres maneras: errores al aprender un nuevo patrón, variación entre moscas (algunas salen más pesadas), y pérdida durante la pesca. Compre un 20–30% más de lo que sugiere la calculadora, especialmente para un patrón nuevo.",
    disclaimer: "<strong>Nota:</strong> Esta es una estimación para fines de planificación. El uso real varía según el patrón y el estilo de montaje individual. Siempre empiece con un poco extra a mano.",
    footer: "Se ejecuta completamente en su navegador. No se recopilan ni almacenan datos.",
    alertQty: "Por favor introduzca el número de moscas."
  }
};

// ============================================================
// 生成文件
// ============================================================
const files = {};

files['index.html'] = buildIndexHtml(null, 'en', '/fly-tying-calculator/');
files['zh/index.html'] = buildIndexHtml('zh', 'zh-Hans', '/fly-tying-calculator/zh/');
files['zh-tw/index.html'] = buildIndexHtml('zh-TW', 'zh-Hant', '/fly-tying-calculator/zh-tw/');
files['ja/index.html'] = buildIndexHtml('ja', 'ja', '/fly-tying-calculator/ja/');
files['ko/index.html'] = buildIndexHtml('ko', 'ko', '/fly-tying-calculator/ko/');
files['de/index.html'] = buildIndexHtml('de', 'de', '/fly-tying-calculator/de/');
files['ru/index.html'] = buildIndexHtml('ru', 'ru', '/fly-tying-calculator/ru/');
files['es/index.html'] = buildIndexHtml('es', 'es', '/fly-tying-calculator/es/');

files['css/style.css'] = STYLE_CSS;
files['js/i18n.js'] = I18N_JS;
files['js/calculator.js'] = CALCULATOR_JS;

for (const [lang, data] of Object.entries(LOCALES)) {
  files[`locales/${lang}.json`] = JSON.stringify(data, null, 2);
}

files['.gitignore'] = `node_modules/
.wrangler/
.dev.vars
.DS_Store
*.log
.vscode/
.idea/
dist/
build/
`;

// ============================================================
// 写入
// ============================================================
const root = '.';
let count = 0;
for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(root, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created: ' + filePath);
  count++;
}
console.log(`\nDone. ${count} files generated.`);
console.log('\nNext steps:');
console.log('  1. git init && git add . && git commit -m "Initial: fly tying calculator"');
console.log('  2. Push to a new GitHub repo "fly-tying-calculator"');
console.log('  3. Deploy as a new Cloudflare Worker');
console.log('  4. In tool-proxy/src/index.js PROXY_MAP, add:');
console.log('     \'/fly-tying-calculator\': \'https://fly-tying-calculator.lvyafei2026.workers.dev\'');
console.log('  5. In tool-proxy/wrangler.toml run_worker_first, add:');
console.log('     "/fly-tying-calculator/*"');
console.log('  6. In Cloudflare tool-proxy Domains & Routes, add:');
console.log('     toolara.dev/fly-tying-calculator/*');
console.log('     www.toolara.dev/fly-tying-calculator/*');
console.log('  7. Update tool-proxy/public/sitemap.xml and index.html');