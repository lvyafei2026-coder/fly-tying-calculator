function t() { return (window.__i18n && window.__i18n.t) || {}; }

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

window.calculate = calculate;