/* ============================================================
   FitDay —— 视图渲染层 v2（浅色青春风）
   ============================================================ */

window.Views = (function () {

  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MOTTOS = [
    "今天的努力，会成为未来的底气。",
    "所有改变，都来自今天的一个选择。",
    "你不是为了变瘦而运动，而是在成为更好的自己。",
    "自律不是苦行，是把选择权拿回自己手里。",
    "汗水不会辜负你，每一步都算数。",
    "坚持的意义，是让未来的你感谢现在的自己。",
    "每一次训练，都是在为梦想投票。"
  ];
  const WDN = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

  /* ============================================================
     IP 形象 & 主题（原创吉祥物：奶龙风奶黄龙 / 小黄鸭 / 火焰 / 蜜桃猫 / 夜猫子）
     ============================================================ */
  const MASCOTS = {
    flame: p => `<svg viewBox="0 0 100 100">
      <defs><linearGradient id="${p}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC53D"/><stop offset="1" stop-color="#FF7A3D"/></linearGradient></defs>
      <path d="M50 6C62 24 78 36 78 58a28 28 0 1 1-56 0C22 36 38 24 50 6Z" fill="url(#${p}f)"/>
      <path d="M50 32c6 9 12 13 12 24a12 12 0 1 1-24 0c0-11 6-15 12-24Z" fill="#FFEDC2" opacity=".95"/>
      <circle cx="43" cy="56" r="3" fill="#4A2E14"/><circle cx="57" cy="56" r="3" fill="#4A2E14"/>
      <circle cx="44" cy="55" r="1" fill="#fff"/><circle cx="58" cy="55" r="1" fill="#fff"/>
      <ellipse cx="37" cy="62" rx="3.4" ry="2.2" fill="#FF9A6B" opacity=".55"/><ellipse cx="63" cy="62" rx="3.4" ry="2.2" fill="#FF9A6B" opacity=".55"/>
      <path d="M46 62q4 4 8 0" fill="none" stroke="#4A2E14" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
    dragon: p => `<svg viewBox="0 0 100 100">
      <path d="M14 62q-8-2-9-10 7 2 11-2Z" fill="#F0B429"/>
      <ellipse cx="50" cy="60" rx="31" ry="28" fill="#FFD24D" stroke="#F0B429" stroke-width="2.5"/>
      <ellipse cx="50" cy="70" rx="19" ry="15" fill="#FFF3C9"/>
      <path d="M42 20l3 9-8 2Z" fill="#FFF7E3" stroke="#F0B429" stroke-width="2"/><path d="M58 20l-3 9 8 2Z" fill="#FFF7E3" stroke="#F0B429" stroke-width="2"/>
      <circle cx="20" cy="52" r="7" fill="#FFE79A" stroke="#F0B429" stroke-width="2"/><circle cx="80" cy="52" r="7" fill="#FFE79A" stroke="#F0B429" stroke-width="2"/>
      <ellipse cx="41" cy="54" rx="4.5" ry="5.5" fill="#fff"/><ellipse cx="59" cy="54" rx="4.5" ry="5.5" fill="#fff"/>
      <circle cx="41.6" cy="55" r="2.6" fill="#3A2E12"/><circle cx="59.6" cy="55" r="2.6" fill="#3A2E12"/>
      <circle cx="42.6" cy="54" r=".9" fill="#fff"/><circle cx="60.6" cy="54" r=".9" fill="#fff"/>
      <ellipse cx="34" cy="62" rx="3.6" ry="2.3" fill="#FFAB76" opacity=".6"/><ellipse cx="66" cy="62" rx="3.6" ry="2.3" fill="#FFAB76" opacity=".6"/>
      <path d="M46 63q4 3.5 8 0" fill="none" stroke="#3A2E12" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="48" cy="59" r=".8" fill="#3A2E12"/><circle cx="52" cy="59" r=".8" fill="#3A2E12"/>
      <ellipse cx="41" cy="88" rx="6" ry="3.4" fill="#F0B429"/><ellipse cx="59" cy="88" rx="6" ry="3.4" fill="#F0B429"/>
    </svg>`,
    duck: p => `<svg viewBox="0 0 100 100">
      <path d="M50 10q4 1 3 6" fill="none" stroke="#E8B93C" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="50" cy="36" r="19" fill="#FFE066" stroke="#E8B93C" stroke-width="2.4"/>
      <ellipse cx="50" cy="66" rx="26" ry="22" fill="#FFE066" stroke="#E8B93C" stroke-width="2.4"/>
      <path d="M42 60q-8 8-2 16" fill="none" stroke="#E8B93C" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="40" cy="34" rx="4.2" ry="5.4" fill="#fff"/><ellipse cx="60" cy="34" rx="4.2" ry="5.4" fill="#fff"/>
      <circle cx="40.6" cy="35" r="2.5" fill="#2E2A18"/><circle cx="60.6" cy="35" r="2.5" fill="#2E2A18"/>
      <circle cx="41.6" cy="34" r=".9" fill="#fff"/><circle cx="61.6" cy="34" r=".9" fill="#fff"/>
      <path d="M44 42h12l-6 6Z" fill="#FF9A3D" stroke="#F07F1F" stroke-width="1.6" stroke-linejoin="round"/>
      <ellipse cx="34" cy="41" rx="3.4" ry="2.2" fill="#FFAB76" opacity=".55"/><ellipse cx="66" cy="41" rx="3.4" ry="2.2" fill="#FFAB76" opacity=".55"/>
      <ellipse cx="41" cy="88" rx="7" ry="3.6" fill="#FF9A3D"/><ellipse cx="59" cy="88" rx="7" ry="3.6" fill="#FF9A3D"/>
    </svg>`,
    peach: p => `<svg viewBox="0 0 100 100">
      <path d="M50 16c2-8 10-11 16-9-3 6-9 9-16 9Z" fill="#7BC96F"/>
      <path d="M30 22 44 34M70 22 56 34" stroke="#F08CA8" stroke-width="2.4" stroke-linecap="round" fill="none"/>
      <circle cx="27" cy="18" r="8" fill="#FFB3C8" stroke="#F08CA8" stroke-width="2.4"/>
      <circle cx="73" cy="18" r="8" fill="#FFB3C8" stroke="#F08CA8" stroke-width="2.4"/>
      <circle cx="27" cy="18" r="3.6" fill="#FCD5E1"/><circle cx="73" cy="18" r="3.6" fill="#FCD5E1"/>
      <circle cx="50" cy="56" r="30" fill="#FFB3C8" stroke="#F08CA8" stroke-width="2.4"/>
      <ellipse cx="50" cy="66" rx="17" ry="14" fill="#FFD9E4"/>
      <ellipse cx="41" cy="52" rx="4.4" ry="5.6" fill="#fff"/><ellipse cx="59" cy="52" rx="4.4" ry="5.6" fill="#fff"/>
      <circle cx="41.6" cy="53" r="2.6" fill="#5A2438"/><circle cx="59.6" cy="53" r="2.6" fill="#5A2438"/>
      <circle cx="42.6" cy="52" r=".9" fill="#fff"/><circle cx="60.6" cy="52" r=".9" fill="#fff"/>
      <path d="M45 61q5 4 10 0" fill="none" stroke="#5A2438" stroke-width="1.8" stroke-linecap="round"/>
      <ellipse cx="35" cy="60" rx="3.4" ry="2.2" fill="#FF8FAE" opacity=".6"/><ellipse cx="65" cy="60" rx="3.4" ry="2.2" fill="#FF8FAE" opacity=".6"/>
      <path d="M82 70q10 2 8 12-8 0-10-8Z" fill="#FFB3C8" stroke="#F08CA8" stroke-width="2.2"/>
    </svg>`,
    cat: p => `<svg viewBox="0 0 100 100">
      <path d="M18 26 20 8l14 10Z" fill="#6B64A6" stroke="#57508F" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M82 26 80 8 66 18Z" fill="#6B64A6" stroke="#57508F" stroke-width="2.4" stroke-linejoin="round"/>
      <circle cx="50" cy="56" r="30" fill="#6B64A6" stroke="#57508F" stroke-width="2.4"/>
      <ellipse cx="41" cy="52" rx="4.6" ry="6" fill="#C9F5B8"/><ellipse cx="59" cy="52" rx="4.6" ry="6" fill="#C9F5B8"/>
      <ellipse cx="41" cy="53" rx="2.2" ry="4.4" fill="#2E2A18"/><ellipse cx="59" cy="53" rx="2.2" ry="4.4" fill="#2E2A18"/>
      <path d="M50 60l-2.4 2.6h4.8Z" fill="#FF9FB8"/>
      <path d="M45 66q5 3.6 10 0" fill="none" stroke="#C9C4F0" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M70 12a8 8 0 1 0 6 13 6.4 6.4 0 1 1-6-13Z" fill="#FFE9A0"/>
      <circle cx="82" cy="34" r="1.8" fill="#FFE9A0"/><circle cx="16" cy="40" r="1.4" fill="#C9F5B8"/><circle cx="88" cy="52" r="1.3" fill="#C9F5B8"/>
      <path d="M14 74q-8 4-4 14" fill="none" stroke="#57508F" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
    baby: p => `<svg viewBox="0 0 100 100">
      <path d="M30 18q20-14 40 0l-4 8q-16-10-32 0Z" fill="#FFF7F0" stroke="#F3C9BC" stroke-width="2.2"/>
      <circle cx="30" cy="22" r="3.2" fill="#FFC9D8" stroke="#F5AEC0" stroke-width="1.6"/><circle cx="70" cy="22" r="3.2" fill="#FFC9D8" stroke="#F5AEC0" stroke-width="1.6"/>
      <circle cx="50" cy="56" r="29" fill="#FFF7F0" stroke="#F3C9BC" stroke-width="2.6"/>
      <path d="M42 30q8-6 16 0" fill="none" stroke="#F3C9BC" stroke-width="2"/>
      <path d="M40 46q5-5 10 0M50 46q5-5 10 0" fill="none" stroke="#4A3B3A" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M44 58q6 5 12 0" fill="none" stroke="#4A3B3A" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="50" cy="55" rx="5" ry="4.2" fill="#FFD3DE" stroke="#F5AEC0" stroke-width="1.6"/>
      <circle cx="50" cy="55" r="1.4" fill="#F5AEC0"/>
      <ellipse cx="34" cy="54" rx="4" ry="2.6" fill="#FFD3DE" opacity=".85"/><ellipse cx="66" cy="54" rx="4" ry="2.6" fill="#FFD3DE" opacity=".85"/>
      <g transform="rotate(-18 76 66)"><rect x="68" y="58" width="17" height="24" rx="6" fill="#D8F1FF" stroke="#9CD2F0" stroke-width="2"/>
        <rect x="71" y="52" width="11" height="7" rx="2.4" fill="#FFF" stroke="#9CD2F0" stroke-width="2"/>
        <rect x="73.5" y="47" width="6" height="6" rx="2.6" fill="#FFB7C9"/>
        <rect x="71" y="72" width="11" height="7" rx="2.4" fill="#FFF" stroke="#9CD2F0" stroke-width="2" opacity=".9"/></g>
    </svg>`,
    sponge: p => `<svg viewBox="0 0 100 100">
      <defs><clipPath id="${p}sp"><rect x="22" y="24" width="56" height="56" rx="9"/></clipPath></defs>
      <rect x="22" y="24" width="56" height="56" rx="9" fill="#FFE45C" stroke="#E8C412" stroke-width="2.6"/>
      <g clip-path="url(#${p}sp)" fill="#F5D43A" opacity=".55"><circle cx="32" cy="36" r="3"/><circle cx="66" cy="30" r="2.4"/><circle cx="70" cy="66" r="3.2"/><circle cx="28" cy="68" r="2.2"/><circle cx="52" cy="76" r="2.6"/></g>
      <rect x="30" y="40" width="17" height="12" rx="6" fill="#fff"/><rect x="53" y="40" width="17" height="12" rx="6" fill="#fff"/>
      <rect x="30" y="38" width="40" height="10" rx="5" fill="#3A3A44"/>
      <circle cx="38.5" cy="46" r="3.2" fill="#2E5F8A"/><circle cx="61.5" cy="46" r="3.2" fill="#2E5F8A"/>
      <circle cx="39.5" cy="45" r="1.1" fill="#fff"/><circle cx="62.5" cy="45" r="1.1" fill="#fff"/>
      <path d="M42 62q8 7 16 0" fill="none" stroke="#4A4128" stroke-width="2.6" stroke-linecap="round"/>
      <ellipse cx="34" cy="60" rx="3.4" ry="2.2" fill="#FF9FB8" opacity=".7"/><ellipse cx="66" cy="60" rx="3.4" ry="2.2" fill="#FF9FB8" opacity=".7"/>
      <circle cx="82" cy="30" r="5" fill="none" stroke="#9CD2F0" stroke-width="2.2"/><circle cx="88" cy="20" r="3" fill="none" stroke="#9CD2F0" stroke-width="2"/>
      <circle cx="14" cy="34" r="4" fill="none" stroke="#9CD2F0" stroke-width="2.2"/><circle cx="10" cy="22" r="2.2" fill="none" stroke="#9CD2F0" stroke-width="1.8"/>
    </svg>`,
    clownfish: p => `<svg viewBox="0 0 100 100">
      <path d="M14 50q6-3 10-8l2 12-2 12q-4-5-10-8Z" fill="#FF9A55" stroke="#E8732E" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M46 24q6-10 14-10-1 8-4 13Z" fill="#FF9A55" stroke="#E8732E" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M52 82q2 8-2 12-4-4-4-10Z" fill="#FF9A55" stroke="#E8732E" stroke-width="2.2" stroke-linejoin="round"/>
      <ellipse cx="52" cy="52" rx="30" ry="27" fill="#FF8A47" stroke="#E8732E" stroke-width="2.6"/>
      <path d="M40 26q6 26-4 52" fill="none" stroke="#fff" stroke-width="7"/>
      <path d="M40 26q6 26-4 52" fill="none" stroke="#E8732E" stroke-width="2" stroke-dasharray="2 3"/>
      <path d="M66 28q8 24 2 48" fill="none" stroke="#fff" stroke-width="6.4"/>
      <path d="M66 28q8 24 2 48" fill="none" stroke="#E8732E" stroke-width="1.8" stroke-dasharray="2 3"/>
      <ellipse cx="61" cy="46" rx="7" ry="8.4" fill="#fff"/>
      <ellipse cx="62" cy="47" rx="4" ry="5.4" fill="#22404F"/>
      <circle cx="63.4" cy="44.8" r="1.4" fill="#fff"/>
      <path d="M70 60q-6 6-14 4" fill="none" stroke="#7A3A18" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="26" cy="30" r="4.4" fill="none" stroke="#9CD2F0" stroke-width="2.2"/><circle cx="20" cy="18" r="2.6" fill="none" stroke="#9CD2F0" stroke-width="2"/>
      <circle cx="86" cy="66" r="3.6" fill="none" stroke="#9CD2F0" stroke-width="2"/><circle cx="90" cy="52" r="2" fill="none" stroke="#9CD2F0" stroke-width="1.8"/>
    </svg>`,
    candy: p => `<svg viewBox="0 0 100 100">
      <path d="M50 12 60 30 44 34Z" fill="#FF8AC2"/><path d="M50 12 40 30 56 34Z" fill="#7ED6FF"/>
      <circle cx="50" cy="56" r="28" fill="#FFB3DE" stroke="#F27AB8" stroke-width="2.6"/>
      <path d="M50 32a24 24 0 0 1 24 24" fill="none" stroke="#FFE07A" stroke-width="6" opacity=".85"/>
      <path d="M26 60a24 24 0 0 1 8-18" fill="none" stroke="#8FF0B8" stroke-width="6" opacity=".85"/>
      <path d="M62 78a24 24 0 0 1-20 2" fill="none" stroke="#9CC8FF" stroke-width="6" opacity=".8"/>
      <ellipse cx="42" cy="52" rx="4.4" ry="5.4" fill="#fff"/><ellipse cx="58" cy="52" rx="4.4" ry="5.4" fill="#fff"/>
      <circle cx="42.8" cy="53" r="2.6" fill="#46314A"/><circle cx="58.8" cy="53" r="2.6" fill="#46314A"/>
      <circle cx="43.8" cy="52" r=".9" fill="#fff"/><circle cx="59.8" cy="52" r=".9" fill="#fff"/>
      <path d="M44 62q6 5 12 0" fill="none" stroke="#46314A" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="33" cy="61" rx="3.6" ry="2.4" fill="#FF8AC2" opacity=".8"/><ellipse cx="67" cy="61" rx="3.6" ry="2.4" fill="#FF8AC2" opacity=".8"/>
      <path d="M14 70q6-4 8-10M88 42q-6 4-8 10" fill="none" stroke="#FFD1EC" stroke-width="3.4" stroke-linecap="round"/>
    </svg>`
  };
  const THEMES = [
    { id: "tangerine", name: "活力橙", mascot: "flame", mascotName: "燃燃", desc: "元气火焰，燃就完了", sw: ["#FF7A3D", "#FFC53D", "#34C98E"] },
    { id: "nailong", name: "奶龙黄", mascot: "dragon", mascotName: "奶黄龙", desc: "奶凶奶凶的软萌龙", sw: ["#FFD24D", "#F5A800", "#FFAB76"] },
    { id: "baby", name: "奶娃白", mascot: "baby", mascotName: "奶宝", desc: "奶fufu的软软风", sw: ["#FFB7C9", "#8FC6F2", "#FFF0F3"] },
    { id: "sponge", name: "比奇堡黄", mascot: "sponge", mascotName: "黄小方", desc: "深海快乐块", sw: ["#FFE45C", "#3D9BD9", "#F0B820"] },
    { id: "ocean", name: "海底橙", mascot: "clownfish", mascotName: "泡泡鱼", desc: "小丑鱼游进健身房", sw: ["#FF8A47", "#3E9BFF", "#fff"] },
    { id: "dopamine", name: "多巴胺", mascot: "candy", mascotName: "糖豆", desc: "彩虹显眼包专属", sw: ["#FF5DA2", "#2ED573", "#4DB8FF"] },
    { id: "duck", name: "元气鸭", mascot: "duck", mascotName: "鸭鸭", desc: "嘎嘎冲鸭！", sw: ["#FFE066", "#12B886", "#FF9A3D"] },
    { id: "peach", name: "蜜桃粉", mascot: "peach", mascotName: "桃桃", desc: "又甜又飒的蜜桃猫", sw: ["#FFB3C8", "#F06692", "#7BC96F"] },
    { id: "night", name: "暗夜紫", mascot: "cat", mascotName: "夜猫子", desc: "夜晚开练的酷盖", sw: ["#6B64A6", "#9F8CFF", "#C9F5B8"] }
  ];
  const SLOGANS = {
    tangerine: ["汗水是脂肪的眼泪💧", "自律给我自由！", "今天的你，已经赢过昨天的自己", "练腿虽迟但到！", "别问，问就是在变强"],
    nailong: ["奶一口，练一组！", "软萌外壳，猛兽内核", "今天也是奶凶奶凶的训练日", "一口奶一口劲，练完再加餐", "懒洋洋地来，雄赳赳地练"],
    baby: ["奶fufu的一天，从运动开始～", "今天也要软软地变强", "奶宝陪你一起偷偷变美", "小口喝水，慢慢变好", "运动完的你，奶香奶香的"],
    sponge: ["准备好了吗，孩子们！", "是谁住在深海的健身房里呀～", "快乐练腿，永不下班！", "今天也是元气满满的一天噗噗", "海绵都懂坚持，你呢！"],
    ocean: ["游过千山万水，只为这条马甲线", "泡泡吐一圈，热量少一半", "海底的鱼都在运动，你还不冲？", "自由泳自由练，今天也是海王", "海的方向，是更好的你"],
    dopamine: ["多巴胺健身，快乐加倍！", "今天的汗水和穿搭一样鲜艳", "显眼包就要练得比谁都亮眼", "五颜六色地变强！", "快乐健身，情绪价值拉满"],
    duck: ["嘎！今天也要嘎嘎练！", "除了鸭力，还有动力！", "冲鸭——！！", "摇摇摆摆也要天天打卡", "鸭力再大，大不过我的决心"],
    peach: ["甜度满分，汗水超标！", "做个又甜又飒的女孩子", "蜜桃臀在向你招手～", "今天也是元气满满的小桃子", "可爱和力量我都要"],
    night: ["熬夜不如夜跑！", "深夜的坚持，月亮看得见", "月亮不睡你不睡，你是健身小宝贝", "夜色是最好的滤镜，汗水是高光", "白天摆烂，晚上开练"]
  };
  function themeOf() {
    const id = (window.App.S && window.App.S.settings.theme) || "tangerine";
    return THEMES.find(t => t.id === id) || THEMES[0];
  }
  function mascotSVG(themeId, count) {
    const t = THEMES.find(x => x.id === themeId) || THEMES[0];
    return MASCOTS[t.mascot]("mg" + t.id + (count || ""));
  }
  /* 随机但按日期稳定的标语 */
  function sloganOf() {
    const t = themeOf();
    const arr = SLOGANS[t.id];
    return arr[(new Date().getDate() + new Date().getHours()) % arr.length];
  }

  /* ---------- 头像（支持用户上传图片） ---------- */
  function avatarHTML(p) {
    if (p && p.avatar) return '<img class="av-img" src="' + p.avatar + '" alt="头像">';
    return p && p.name ? esc(p.name[0]) : "🔥";
  }
  function sheetAvatar() {
    const p = window.App.S.profile;
    return `
    <div class="grab"></div><h3 style="margin:4px 0">🖼 自定义头像</h3>
    <div class="av-preview">${avatarHTML(p)}</div>
    <div class="small" style="text-align:center;margin-bottom:12px">选一张喜欢的图片，自动裁成方形并压缩后<span style="color:var(--orange)">仅保存在本机</span></div>
    <input type="file" id="avatar-file" accept="image/*" style="display:none" onchange="FitUI.avatarFile(this)">
    <label class="btn" for="avatar-file" style="margin-bottom:10px">📷 选择图片</label>
    <button class="btn ghost" data-action="avatarReset">恢复默认首字母头像</button>
    <div class="small" style="margin-top:10px">💡 图片不会上传到任何服务器，只存在你设备的浏览器里，可随「数据备份」一起导出。</div>`;
  }

  /* ---------- 体型追踪：历史曲线（weight/waist/chest/hip/thigh/arm） ---------- */
  function measureHistory(logs, key) {
    const arr = [];
    Object.keys(logs || {}).forEach(k => {
      const m = logs[k].measures || {};
      const v = key === "weight" ? (m.weight || logs[k].weight) : m[key];
      if (v) arr.push({ date: k, w: v });
    });
    arr.sort((a, b) => a.date < b.date ? -1 : 1);
    return arr;
  }
  const METRICS = [
    { key: "weight", name: "体重", unit: "kg", icon: "⚖" },
    { key: "waist", name: "腰围", unit: "cm", icon: "🧘" },
    { key: "chest", name: "胸围", unit: "cm", icon: "💪" },
    { key: "hip", name: "臀围", unit: "cm", icon: "🍑" },
    { key: "thigh", name: "大腿围", unit: "cm", icon: "🦵" },
    { key: "arm", name: "手臂围", unit: "cm", icon: "💪" }
  ];

  /* ================= 相册页 ================= */
  function album() {
    const S = window.App.S;
    const list = window.App.photoCache || [];
    const reveal = S.ui.revealPhoto;
    const groups = {};
    list.forEach(p => { (groups[p.date] = groups[p.date] || []).push(p); });
    const dates = Object.keys(groups).sort().reverse();
    let body = "";
    if (!list.length) {
      body = `<div class="empty-tip" style="padding:60px 0">还没有照片 📷<br><span class="small">拍下现在的样子，30 天后回来对比</span></div>`;
    } else {
      body = dates.map(d => `
        <div class="album-date">${d} <span class="small">${groups[d].length}张</span></div>
        <div class="album-grid">
          ${groups[d].map(p => `<div class="ph-thumb ${reveal ? "reveal" : ""}" data-action="photoView" data-id="${p.id}"><img src="${p.data}" loading="lazy" alt="身材照"></div>`).join("")}
        </div>`).join("");
    }
    return `
    <div class="topbar"><button class="back" data-action="back">‹</button><h1>📸 身材相册</h1>
      <button class="bar-act" data-action="photoReveal">${reveal ? "🙈 打码" : "👀 显示"}</button></div>
    <div class="page nofoot">
      <div class="album-actions">
        <button class="btn" data-action="openPhoto">📷 拍一张</button>
        <button class="btn ghost" data-action="openCompare">🔀 前后对比</button>
      </div>
      ${body}
      <div class="notice">照片仅保存在本机浏览器（IndexedDB），不会上传到任何服务器；导出备份时会一起打包。</div>
    </div>`;
  }

  /* ================= 拍照 sheet ================= */
  function sheetPhotoTake() {
    const d = window.App.todayKey();
    return `
    <div class="grab"></div><h3 style="margin:4px 0">📸 拍一张</h3>
    <div class="small" style="margin-bottom:10px">正面/侧面全身照效果最好，光线充足；照片仅存本机</div>
    <label class="fl">记录日期（默认今天）</label>
    <input type="date" id="ph-date" value="${d}" max="${d}">
    <input type="file" id="ph-file" accept="image/*" style="display:none" onchange="FitUI.photoFile(this)">
    <label class="btn" for="ph-file" style="margin-top:14px">📷 打开相机 / 选择图片</label>
    <div class="small" style="margin-top:10px">拍照后自动压缩保存（约100KB/张），想拍几张拍几张。</div>`;
  }

  /* ================= 对比 sheet ================= */
  function sheetCompare() {
    const list = (window.App.photoCache || []).slice().sort((a, b) => a.date < b.date ? -1 : 1);
    const opts = list.map(p => `<option value="${p.id}">${p.date}${p.date === window.App.todayKey() ? "（今天）" : ""}</option>`).join("");
    return `
    <div class="grab"></div><h3 style="margin:4px 0">🔀 前后对比</h3>
    <div class="small" style="margin-bottom:10px">选最早的一张和最近的一张，见证变化</div>
    <label class="fl">之前（早）</label><select id="cmp-a">${opts}</select>
    <label class="fl">之后（近）</label><select id="cmp-b">${opts}</select>
    <button class="btn" data-action="compareGo" style="margin-top:14px">开始对比 ✨</button>`;
  }
  function sheetCompareResult(idA, idB) {
    const list = window.App.photoCache || [];
    const a = list.find(p => p.id === idA), b = list.find(p => p.id === idB);
    if (!a || !b) return `<div class="grab"></div><div class="empty-tip">照片找不到了</div>`;
    const ma = (window.App.S.logs[a.date] || {}).measures || {};
    const mb = (window.App.S.logs[b.date] || {}).measures || {};
    const days = Math.round((new Date(b.date) - new Date(a.date)) / 86400000);
    const rows = METRICS.filter(m => ma[m.key] || mb[m.key] || m.key === "weight").map(m => {
      const va = m.key === "weight" ? (ma.weight || (window.App.S.logs[a.date] || {}).weight) : ma[m.key];
      const vb = m.key === "weight" ? (mb.weight || (window.App.S.logs[b.date] || {}).weight) : mb[m.key];
      if (!va || !vb) return `<div class="cmp-row"><span>${m.icon} ${m.name}</span><span class="mk">${va ? va : "—"} → ${vb ? vb : "—"} ${m.unit}</span><span class="cmp-diff ${vb && va ? (vb - va <= 0 ? "good" : "up") : ""}">${vb && va ? ((vb - va > 0 ? "+" : "") + Math.round((vb - va) * 10) / 10 + m.unit) : ""}</span></div>`;
      const diff = Math.round((vb - va) * 10) / 10;
      return `<div class="cmp-row"><span>${m.icon} ${m.name}</span><span class="mk">${va} → ${vb} ${m.unit}</span><span class="cmp-diff ${diff <= 0 ? "good" : "up"}">${diff > 0 ? "+" : ""}${diff}${m.unit}</span></div>`;
    }).join("");
    return `
    <div class="grab"></div><h3 style="margin:4px 0">🔀 变化对比 <span class="small">间隔 ${days} 天</span></h3>
    <div class="cmp-wrap">
      <div class="cmp-col"><span class="cmp-tag">之前</span><img src="${a.data}" alt="之前"></div>
      <div class="cmp-col"><span class="cmp-tag now">之后</span><img src="${b.data}" alt="之后"></div>
    </div>
    ${rows ? `<div class="card" style="box-shadow:none;background:var(--card2);margin-top:12px">${rows}</div>` : `<div class="small" style="margin-top:8px">💡 在报告页记录体重和围度，对比时会自动算差值</div>`}
    <button class="btn ghost" data-action="closeSheet" style="margin-top:12px">关闭</button>`;
  }

  /* ================= 三围记录 sheet ================= */
  function sheetMeasure() {
    const log = window.App.todayLog();
    const m = log.measures || {};
    const field = (k, label, unit, ph) => `
      <div><label class="fl">${label} (${unit})</label><input type="number" id="ms-${k}" value="${m[k] || ""}" step="0.1" placeholder="${ph}"></div>`;
    return `
    <div class="grab"></div><h3 style="margin:4px 0">📏 记录体型</h3>
    <div class="small" style="margin-bottom:6px">晨起空腹量最准；围度软尺贴身不勒肉。只填想记的项也行。</div>
    <div class="ms-grid">
      ${field("weight", "体重", "kg", "55.0")}
      ${field("chest", "胸围", "cm", "88.0")}
      ${field("waist", "腰围", "cm", "68.0")}
      ${field("hip", "臀围", "cm", "92.0")}
      ${field("thigh", "大腿围", "cm", "52.0")}
      ${field("arm", "手臂围", "cm", "26.0")}
    </div>
    <button class="btn" data-action="saveMeasure" style="margin-top:14px">保存 📏</button>
    <div class="small" style="margin-top:8px">记录后可在「报告 → 体型追踪」看每周/每月曲线变化。</div>`;
  }

  function logo(size) {
    return `<svg viewBox="0 0 64 64" width="${size}" height="${size}">
      <defs><linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FF9A5A"/><stop offset="1" stop-color="#FF7A3D"/></linearGradient></defs>
      <rect x="2" y="2" width="60" height="60" rx="18" fill="#fff" stroke="#FFD9C2"/>
      <path d="M33 10c2 12-11 17-11 28 0 7 4 12 9 14-2-8 5-13 8-17 5 6 9 11 9 18 0 1 0 2-.3 3A18 18 0 0 0 52 41c0-14-14-19-19-31Z" fill="url(#lg1)"/>
      <path d="M22 44l7-5 4 4 6-9" fill="none" stroke="#34C98E" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }
  function exIcon(ex) {
    /* 优先真人演示图，没有的动作用火柴人兜底 */
    const img = ex && window.exImg && window.exImg(ex.id);
    if (img) {
      const cat = ex.cat || "strength";
      return `<div class="exa-ic ${cat} exa-photo" style="width:44px;height:44px"><img src="${img}" alt="" loading="lazy"></div>`;
    }
    return window.ExAnim ? window.ExAnim.icon(ex) : "🏋️";
  }
  function stars(lv) { return "★".repeat(lv) + "☆".repeat(3 - lv); }
  function lvName(lv) { return ["", "新手", "进阶", "高阶"][lv] || "新手"; }

  function ring(pct, color, label, value, icon) {
    const R = 40, C = +(2 * Math.PI * R).toFixed(1);
    const p = Math.min(1, Math.max(0, pct));
    const off = (C * (1 - p)).toFixed(1);
    const done = p >= 1;
    return `<div class="ringbox${done ? " ring-done" : ""}">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="${R}" fill="none" stroke="var(--card2)" stroke-width="9"/>
        <circle cx="50" cy="50" r="${R}" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round"
          stroke-dasharray="${C}" stroke-dashoffset="${off}" transform="rotate(-90 50 50)"/>
        <text x="50" y="44" text-anchor="middle" font-size="17" class="ring-ic">${icon || ""}</text>
        <text x="50" y="62" text-anchor="middle" font-size="13" font-weight="800" fill="var(--txt)" class="ring-val">${value}</text>
      </svg>
      <div class="lab">${label}${done ? " ✓" : ""}</div></div>`;
  }
  function cupSVG(pct) {
    const level = Math.round(158 * Math.min(1, pct));
    return `<svg viewBox="0 0 150 190">
      <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6FBCFF"/><stop offset="1" stop-color="#3E9BFF"/></linearGradient></defs>
      <rect x="15" y="8" width="120" height="172" rx="20" fill="#fff" stroke="#DDE4F0" stroke-width="3"/>
      <clipPath id="cupclip"><rect x="17" y="10" width="116" height="168" rx="18"/></clipPath>
      <g clip-path="url(#cupclip)">
        <rect x="17" y="${178 - level}" width="116" height="${level}" fill="url(#wg)" opacity=".9"/>
        <ellipse cx="75" cy="${178 - level}" rx="58" ry="6" fill="#A8D8FF" opacity=".9"/>
      </g>
      <g stroke="#DDE4F0" stroke-width="2">
        <line x1="24" y1="51" x2="42" y2="51"/><line x1="24" y1="93" x2="42" y2="93"/><line x1="24" y1="135" x2="42" y2="135"/>
      </g></svg>`;
  }
  function sparkline(pts, w, h) {
    if (!pts || pts.length < 2) return `<div class="empty-tip">记录3次以上体重即可看到曲线 📈</div>`;
    const ws = pts.map(p => p.w), min = Math.min(...ws) - 0.8, max = Math.max(...ws) + 0.8;
    const X = i => 10 + i * (w - 20) / (pts.length - 1);
    const Y = v => 10 + (h - 20) * (1 - (v - min) / (max - min || 1));
    const line = pts.map((p, i) => `${X(i).toFixed(1)},${Y(p.w).toFixed(1)}`).join(" ");
    const dots = pts.map((p, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(p.w).toFixed(1)}" r="3.4" fill="#FF7A3D"/>`).join("");
    const last = pts[pts.length - 1];
    return `<svg viewBox="0 0 ${w} ${h}" style="width:100%">
      <polyline points="${line}" fill="none" stroke="#FF7A3D" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      ${dots}
      <text x="${(w - 10)}" y="${Y(last.w) - 10}" fill="#34C98E" font-size="12" text-anchor="end">${last.w}kg</text></svg>`;
  }
  function goalTag(goal) { const g = window.FitEngine.GOALS[goal]; return `<span class="goal-tag">${g.icon} ${g.name}</span>`; }

  /* ---------- 肌群示意图（正面+背面，高亮目标肌群） ---------- */
  function muscleSVG(targets) {
    const t = (targets || []).join(" ");
    const all = /全身|心肺|协调|爆发/.test(t);
    const F = { chest: 0, sh: 0, arm: 0, abs: 0, quad: 0, calf: 0 };
    const B = { back: 0, lback: 0, sh: 0, arm: 0, glute: 0, ham: 0, calf: 0 };
    const light = (o) => { for (const k in o) o[k] = 1; };
    if (all) { light(F); light(B); }
    else {
      if (/胸/.test(t)) F.chest = 1;
      if (/三角肌后束/.test(t)) B.sh = 1;
      else if (/三角肌/.test(t)) F.sh = 1;
      if (/肱二头/.test(t)) F.arm = 1;
      if (/肱三头/.test(t)) B.arm = 1;
      if (/腹|核心|髋屈/.test(t)) F.abs = 1;
      if (/股四头/.test(t)) F.quad = 1;
      if (/腘绳/.test(t)) B.ham = 1;
      if (/臀/.test(t)) B.glute = 1;
      if (/背阔|菱形|斜方/.test(t)) B.back = 1;
      if (/竖脊/.test(t)) B.lback = 1;
      if (/小腿/.test(t)) { F.calf = 1; B.calf = 1; }
    }
    const C = "#EDF0F7", H = "#FF9A5A";
    const col = on => on ? H : C;
    const fig = `
      <svg viewBox="0 0 64 132">
        <circle cx="32" cy="10" r="7.5" fill="${C}"/>
        <rect x="28" y="17" width="8" height="5" rx="2.5" fill="${C}"/>
        <rect x="17" y="22" width="30" height="16" rx="6" fill="${col(F.chest)}"/>
        <rect x="20" y="39" width="24" height="17" rx="5" fill="${col(F.abs)}"/>
        <circle cx="15" cy="26" r="5" fill="${col(F.sh)}"/>
        <circle cx="49" cy="26" r="5" fill="${col(F.sh)}"/>
        <rect x="8" y="32" width="7" height="24" rx="3.5" fill="${col(F.arm)}"/>
        <rect x="49" y="32" width="7" height="24" rx="3.5" fill="${col(F.arm)}"/>
        <rect x="20" y="59" width="10" height="32" rx="4.5" fill="${col(F.quad)}"/>
        <rect x="34" y="59" width="10" height="32" rx="4.5" fill="${col(F.quad)}"/>
        <rect x="21" y="93" width="8" height="18" rx="3.5" fill="${col(F.calf)}"/>
        <rect x="35" y="93" width="8" height="18" rx="3.5" fill="${col(F.calf)}"/>
        <rect x="21" y="112" width="8" height="6" rx="2.5" fill="${C}"/>
        <rect x="35" y="112" width="8" height="6" rx="2.5" fill="${C}"/>
      </svg>`;
    const figB = `
      <svg viewBox="0 0 64 132">
        <circle cx="32" cy="10" r="7.5" fill="${C}"/>
        <rect x="28" y="17" width="8" height="5" rx="2.5" fill="${C}"/>
        <rect x="18" y="22" width="28" height="21" rx="6" fill="${col(B.back)}"/>
        <rect x="21" y="45" width="22" height="10" rx="4" fill="${col(B.lback)}"/>
        <circle cx="15" cy="26" r="5" fill="${col(B.sh)}"/>
        <circle cx="49" cy="26" r="5" fill="${col(B.sh)}"/>
        <rect x="8" y="32" width="7" height="24" rx="3.5" fill="${col(B.arm)}"/>
        <rect x="49" y="32" width="7" height="24" rx="3.5" fill="${col(B.arm)}"/>
        <rect x="20" y="57" width="24" height="11" rx="5" fill="${col(B.glute)}"/>
        <rect x="20" y="70" width="10" height="23" rx="4.5" fill="${col(B.ham)}"/>
        <rect x="34" y="70" width="10" height="23" rx="4.5" fill="${col(B.ham)}"/>
        <rect x="21" y="95" width="8" height="16" rx="3.5" fill="${col(B.calf)}"/>
        <rect x="35" y="95" width="8" height="16" rx="3.5" fill="${col(B.calf)}"/>
        <rect x="21" y="112" width="8" height="6" rx="2.5" fill="${C}"/>
        <rect x="35" y="112" width="8" height="6" rx="2.5" fill="${C}"/>
      </svg>`;
    return `<div class="muscle-map"><div style="display:flex;gap:4px"><div style="flex:1">${fig}</div><div style="flex:1">${figB}</div></div>
      <div class="small" style="text-align:center;margin-top:3px">🟠 目标肌群</div></div>`;
  }
  function vidLinks(name) {
    const kw = encodeURIComponent(name + " 标准动作 教学");
    const kw2 = encodeURIComponent(name + " 跟练");
    return `<a class="vid-btn bili" href="https://search.bilibili.com/all?keyword=${kw}" target="_blank" rel="noopener"><i>📺</i>B站搜「${esc(name)}」教学示范</a>
      <a class="vid-btn bili" href="https://search.bilibili.com/all?keyword=${kw2}" target="_blank" rel="noopener"><i>🎬</i>B站搜「${esc(name)}」跟练视频</a>`;
  }

  /* ---------- 力量日估算 ---------- */
  function dayEst(day, weightKg) {
    if (!day.exercises) return null;
    let sec = 300; /* 热身+放松 */
    let kcal = 0;
    day.exercises.forEach(b => {
      const ex = window.findEx(b.ex);
      const per = b.rest || 60;
      sec += b.sets * (45 + per);
      if (ex) kcal += window.exKcal(ex, weightKg, b.sets * 45 / 60);
      kcal += b.sets * per / 60 * (2 * 3.5 * weightKg / 200);
    });
    return { min: Math.round(sec / 60), kcal: Math.round(kcal), count: day.exercises.length };
  }

  /* ================= 引导流程 ================= */
  function onboard(ob, step) {
    const E = esc;
    let body = "";
    if (step === 0) {
      body = `
        <div class="ob-logo">${logo(74)}<h2>FitDay 燃动日记</h2>
        <div class="slogan">每一天的坚持，都在塑造更好的自己。</div></div>
        <div class="card" style="margin-top:22px">
          <div class="coach-tip"><span class="ci">🏋️</span><span class="ct">选好「每周练几次」，AI 自动帮你排好<b>三分化 / 四分化 / 五分化</b>课表：每天练哪个部位、做哪些动作、几组几次、用多重，全部安排好。</span></div>
        </div>
        <div class="card">
          <div class="coach-tip"><span class="ci">🍎</span><span class="ct">200种食物卡路里库 · 59个动作教学（含视频示范）<br>饮水提醒 · AI健康教练 · <b>纯本地离线，数据只在你手机里</b></span></div>
        </div>
        <div style="margin-top:auto"></div>
        <button class="btn" data-action="obNext">开始塑造自己 🔥</button>`;
    } else if (step === 1) {
      body = `
        <div class="ob-title">创建身体档案</div><div class="ob-sub">用于计算你的基础代谢与每日目标</div>
        <label class="fl">昵称</label><input type="text" id="ob-name" placeholder="怎么称呼你？" value="${E(ob.name)}" maxlength="10">
        <label class="fl">性别</label>
        <div class="opt-grid">
          <div class="opt ${ob.sex === "female" ? "on" : ""}" data-action="obSet" data-k="sex" data-v="female"><i>👩</i>女生</div>
          <div class="opt ${ob.sex === "male" ? "on" : ""}" data-action="obSet" data-k="sex" data-v="male"><i>👨</i>男生</div>
        </div>
        <div class="row3">
          <div><label class="fl">年龄</label><input type="number" id="ob-age" value="${E(ob.age)}" placeholder="22"></div>
          <div><label class="fl">身高 cm</label><input type="number" id="ob-height" value="${E(ob.height)}" placeholder="165"></div>
          <div><label class="fl">体重 kg</label><input type="number" id="ob-weight" value="${E(ob.weight)}" placeholder="55"></div>
        </div>`;
    } else if (step === 2) {
      const obDays = String(ob.days || "1,3,5").split(",").map(s => parseInt(s, 10)).filter(n => n >= 0 && n <= 6);
      const splitHint = { 2: "全身A/B交替", 3: "女生三分化", 4: "四分化", 5: "五分化", 6: "六练混合循环" }[Math.min(6, Math.max(2, obDays.length))] || "";
      const dts = ob.dayTimes || {};
      const PERIODS = [["morning", "🌅早"], ["midday", "☀️午"], ["evening", "🌆傍晚"], ["night", "🌙晚"]];
      const dayRows = obDays.length ? obDays.map(wd => `
        <div class="dt-row">
          <span class="dt-day">周${"一二三四五六日"[wd]}</span>
          <div class="dt-chips">${PERIODS.map(pp => `<span class="dt-chip ${(dts[wd] || ob.timePref) === pp[0] ? "on" : ""}" data-action="obDayTime" data-wd="${wd}" data-v="${pp[0]}">${pp[1]}</span>`).join("")}</div>
          <input type="time" class="dt-exact" data-wd="${wd}" data-role="obExact" value="${(ob.dayTimesExact || {})[wd] || ""}" placeholder="精确">
        </div>`).join("") : `<div class="small" style="padding:6px 0">先在上面点选你有空的日子，再为每一天定时间 ⏰</div>`;
      body = `
        <div class="ob-title">目标与你的时间</div><div class="ob-sub">精确到每一天：AI 只在你有空的日子、按你选的时间安排训练</div>
        <label class="fl">我的目标</label>
        <div class="opt-grid three">
          <div class="opt ${ob.goal === "fatloss" ? "on" : ""}" data-action="obSet" data-k="goal" data-v="fatloss"><i>🔥</i>减脂</div>
          <div class="opt ${ob.goal === "muscle" ? "on" : ""}" data-action="obSet" data-k="goal" data-v="muscle"><i>💪</i>增肌</div>
          <div class="opt ${ob.goal === "keep" ? "on" : ""}" data-action="obSet" data-k="goal" data-v="keep"><i>⚖</i>保持</div>
        </div>
        <label class="fl">一周里哪几天有时间？（点选/取消，选2-6天）</label>
        <div class="day-grid">
          ${["一", "二", "三", "四", "五", "六", "日"].map((n, i) => `<div class="opt ${obDays.includes(i) ? "on" : ""}" data-action="obToggleDay" data-v="${i}">${n}</div>`).join("")}
        </div>
        <div class="small" style="margin-top:8px;text-align:center">已选 <b style="color:var(--orange)">${obDays.length}天</b> → 将为你安排「${splitHint}」${obDays.some((d, i2, a) => a.includes(d + 1) || (i2 === a.length - 1 && a[0] === 0 && d === 6)) ? " · 日子相邻会自动穿插不同肌群" : ""}</div>
        <label class="fl">这些天分别什么时间练？（选时段即可，想更准就填具体钟点）</label>
        <div class="dt-rows">${dayRows}</div>`;
    } else if (step === 3) {
      body = `
        <div class="ob-title">基础与条件</div><div class="ob-sub">用于挑动作和算消耗</div>
        <label class="fl">运动基础</label>
        <div class="opt-grid">
          <div class="opt ${ob.level === "beginner" ? "on" : ""}" data-action="obSet" data-k="level" data-v="beginner"><i>🌱</i>新手<br><span class="small">刚开始/很少运动</span></div>
          <div class="opt ${ob.level === "adv" ? "on" : ""}" data-action="obSet" data-k="level" data-v="adv"><i>⚡</i>进阶<br><span class="small">有规律训练经验</span></div>
        </div>
        <label class="fl">训练条件（决定用哪些动作）</label>
        <div class="opt-grid three">
          <div class="opt ${ob.equip === "none" ? "on" : ""}" data-action="obSet" data-k="equip" data-v="none"><i>🤸</i>徒手<br><span class="small">无器械</span></div>
          <div class="opt ${ob.equip === "dumbbell" ? "on" : ""}" data-action="obSet" data-k="equip" data-v="dumbbell"><i>🏋</i>哑铃<br><span class="small">宿舍/家里</span></div>
          <div class="opt ${ob.equip === "gym" ? "on" : ""}" data-action="obSet" data-k="equip" data-v="gym"><i>🏟</i>健身房<br><span class="small">杠铃器械</span></div>
        </div>
        <label class="fl">日常活动量</label>
        <div class="opt-grid">
          <div class="opt ${ob.activity === "low" ? "on" : ""}" data-action="obSet" data-k="activity" data-v="low"><i>🪑</i>久坐</div>
          <div class="opt ${ob.activity === "mid" ? "on" : ""}" data-action="obSet" data-k="activity" data-v="mid"><i>🚶</i>轻度</div>
          <div class="opt ${ob.activity === "high" ? "on" : ""}" data-action="obSet" data-k="activity" data-v="high"><i>🏃</i>中度</div>
          <div class="opt ${ob.activity === "top" ? "on" : ""}" data-action="obSet" data-k="activity" data-v="top"><i>🔥</i>高强度</div>
        </div>`;
    } else if (step === 3.5) {
      body = `
        <div class="ob-gen">
          <svg class="gen-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="#EDF0F7" stroke-width="8"/>
          <circle cx="50" cy="50" r="42" fill="none" stroke="#FF7A3D" stroke-width="8" stroke-linecap="round" stroke-dasharray="180 264"/></svg>
          <div class="g-line">AI 正在生成你的专属计划…</div>
          <div class="g-sub" id="gen-text">计算基础代谢 BMR →</div>
        </div>`;
    } else if (step === 4) {
      const plan = window._obPlan || (window.App.S && window.App.S.plan) || {};
      body = `
        <div class="ob-title">你的计划已就绪！🎉</div>
        <div class="ob-sub">${plan.splitName} · 每周${plan.daysPerWeek}练 · ${plan.intake}kcal/天</div>
        <div class="card"><div class="split-grid">
          ${plan.week.map(d => {
            const fm = window.FitEngine.FOCUS_META[d.focus] || {};
            return `<div class="split-cell ${fm.color || ""} ${d.wd === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1) ? "today" : ""}">
              <span class="sc-d">${WDN[d.wd].slice(1)}</span><span class="sc-t">${fm.short || d.short || "休"}</span>
              <span class="sc-n">${d.type === "strength" ? d.exercises.length + "动作" : d.type === "cardio" ? "有氧" : d.type === "active" ? "恢复" : "休息"}</span></div>`;
          }).join("")}
        </div></div>
        <div class="card"><div class="bignums">
          <div class="bn"><b>${plan.intake}</b><div class="u">kcal</div><div class="ml">每日摄入</div></div>
          <div class="bn"><b>${plan.protein}<span class="u">g</span></b><div class="ml">蛋白质</div></div>
          <div class="bn"><b>${plan.water}</b><div class="u">ml</div><div class="ml">每日饮水</div></div>
        </div></div>
        <div class="card"><h3>📅 点开任何一天，动作都排好了</h3>
          <div class="small" style="line-height:1.8">比如周一的【${(plan.week[0].exercises ? (window.findEx(plan.week[0].exercises[0].ex) || {}).name : "——")}】开始，每个动作都带<b>组数×次数+组间休息+起始重量</b>，照着练就行，不用自己挑动作。</div></div>
        <button class="btn green" data-action="obFinish">开启我的每一天 🔥</button>`;
    }
    const stepDots = step >= 1 && step <= 3 ? `<div class="ob-step"><i class="${step >= 1 ? "on" : ""}"></i><i class="${step >= 2 ? "on" : ""}"></i><i class="${step >= 3 ? "on" : ""}"></i></div>` : "";
    const navBtns = step === 1 || step === 2 || step === 3 ? `
      <div style="display:flex;gap:10px;margin-top:18px">
        <button class="btn ghost" style="flex:none;width:96px" data-action="obPrev">上一步</button>
        <button class="btn" data-action="${step === 3 ? "obGen" : "obNext"}">${step === 3 ? "生成我的计划 ✨" : "下一步"}</button>
      </div>` : "";
    return `<div class="ob-wrap">${stepDots}${body}${navBtns}</div>`;
  }

  /* ================= 首页 ================= */
  function cycleBannerHTML(S, cyc) {
    if (!S.profile || S.profile.sex !== "female") return "";
    if (!S.cycles || !S.cycles.enabled) {
      return `<div class="cycle-banner">
        <div class="cb-mascot">${mascotSVG(themeOf().id, "cb")}</div>
        <div class="cb-info"><b>🌸 生理期管理</b>
          <div class="cb-sub">记录经期，App 自动在生理期切换舒缓训练、提醒补铁和温水</div></div>
        <button class="btn small" data-action="openCycle">去设置</button>
      </div>`;
    }
    if (!cyc) return "";
    const pm = window.FitEngine.PHASE_META[cyc.phase];
    const logged = (S.cycles.starts || []).some(s => {
      const d = window.FitEngine.dKey(new Date());
      return d >= s && ((new Date(d) - new Date(s)) / 86400000) < (S.cycles.periodLen || 5);
    });
    let main, sub;
    if (cyc.isPeriod) {
      main = `${pm.icon} 生理期第${cyc.periodDay}天 · ${logged ? "记录中" : "预测中"}`;
      sub = "今天自动切换舒缓模式：拉伸/散步/轻力量，避免倒置和腹部挤压";
    } else {
      main = `${pm.icon} ${pm.name} · 周期第${cyc.dayOfCycle}天`;
      sub = cyc.phase === "follicular" ? "能量回升期，适合加重量冲强度！" : cyc.phase === "ovulation" ? "状态巅峰期，注意动作稳定" : "黄体期：强度可降一档，想吃甜的用水果替代";
      sub += " · 下次经期约 " + cyc.nextStart;
    }
    return `<div class="cycle-banner">
      <div class="cb-mascot">${mascotSVG(themeOf().id, "cb2")}</div>
      <div class="cb-info"><b>${main}</b><div class="cb-sub">${sub}</div></div>
      <button class="btn small ghost" data-action="openCycle">详情</button>
    </div>`;
  }
  function home() {
    const app = window.App;
    const S = app.S, plan = S.plan, p = S.profile;
    const today = app.todayLog();
    const wd = app.weekdayIdx();
    const dayPlan = plan.week[wd];
    const cyc = window.FitEngine.cycleInfo ? window.FitEngine.cycleInfo(S) : null;
    const st = window.FitEngine.tasksFor(today, plan, wd, cyc);
    const s = st.summary;
    const hour = new Date().getHours();
    const hello = hour < 6 ? "夜深了" : hour < 11 ? "早上好" : hour < 14 ? "中午好" : hour < 18 ? "下午好" : "晚上好";
    const theme = themeOf();
    const est = dayEst(dayPlan, p.weight);
    const minTarget = est ? est.min : (dayPlan.type === "cardio" ? 20 : 15);
    const kcalPct = s.diet / plan.intake;
    const band = st.band;
    const inBand = s.diet >= band[0] && s.diet <= band[1];
    const streak = app.streakObj();
    const done = s.workout > 0;
    const fm = window.FitEngine.FOCUS_META[dayPlan.focus] || {};

    let goBtn = "";
    if (dayPlan.type === "strength") goBtn = `<button class="btn small ${done ? "ghost" : ""}" data-action="startPlanDay" data-wd="${wd}">${done ? "再练一次 💪" : "开始训练 ▶"}</button>`;
    else if (dayPlan.type === "cardio") goBtn = `<button class="btn small ${done ? "ghost" : ""}" data-action="startCourse" data-id="${dayPlan.courseId}">${done ? "再来一次 💪" : "开始训练 ▶"}</button>`;
    else goBtn = `<button class="btn small ghost" data-action="startCourse" data-id="w16_recovery">做个恢复日 🧘</button>`;

    return `
    <div class="home-wrap">
    <div class="home-head">
      <div class="avatar" data-action="avatarOpen">${avatarHTML(p)}</div>
      <div class="who"><b>${hello}，${esc(p.name || "FitDayer")}</b>${goalTag(plan.goal)}</div>
      <div class="streak"><b>${streak.days}</b>连续打卡(天)</div>
    </div>
    <div class="mascot-card">
      <div class="mascot">${mascotSVG(theme.id, "home")}</div>
      <div class="mascot-bubble">
        <div class="mb-name">${theme.mascotName} · 今日份打气</div>
        <div class="mb-text">${sloganOf()}</div>
        <div class="mb-sub">${MOTTOS[new Date().getDate() % MOTTOS.length]}</div>
      </div>
    </div>
    ${cycleBannerHTML(S, cyc)}

    <div class="card rings-card">
      ${ring(s.workout / minTarget, "var(--orange)", "运动", Math.round(s.workout) + "分", "🏃")}
      ${ring(s.water / plan.water, "var(--blue)", "饮水", Math.round(s.water / plan.water * 100) + "%", "💧")}
      ${ring(kcalPct, inBand ? "var(--green)" : "#F28A2E", "饮食", s.diet > 0 ? Math.round(kcalPct * 100) + "%" : "未记", "🍎")}
    </div>

    <div class="slim-entry">
      <button data-action="openPhoto"><span class="si">📸</span>身材记录<br><span class="ss">拍一张见证变化</span></button>
      <button data-action="nav|report"><span class="si">📏</span>体型追踪<br><span class="ss">体重·围度曲线</span></button>
    </div>

    <div class="card today-course">
      <div class="tc-info">
        <b>${fm.short ? fm.short + " " : ""}${dayPlan.title}</b>
        <div class="tc-meta">${est ? est.min + "分钟 · 约" + est.kcal + "kcal · " + est.count + "个动作 · " : ""}${dayPlan.time ? "安排在 " + dayPlan.time : "自由安排"}</div>
        ${goBtn}
      </div>
      <button class="go ${done ? "done" : ""}" data-action="${dayPlan.type === "strength" ? `startPlanDay|${wd}` : dayPlan.type === "cardio" ? `startCourse|${dayPlan.courseId}` : "nav|plan"}">${done ? "✓" : "GO"}</button>
    </div>

    <div class="card tasks">
      <h3>✅ 今日任务 <button class="more" data-action="nav|plan">查看计划 ›</button></h3>
      ${st.tasks.map(t => `
        <div class="task ${t.done ? "done" : ""}">
          <div class="tick">${t.done ? "✓" : ""}</div>
          <div class="t-lab">${t.icon} ${esc(t.label)}<div class="t-det">${esc(t.detail)}</div></div>
        </div>`).join("")}
    </div>

    <div class="card">
      <h3>🤖 AI教练说</h3>
      ${window.FitEngine.coachDaily(today, plan, S.profile, streak, cyc).map(t => `
        <div class="coach-tip" style="margin-bottom:8px"><span class="ci">${t.icon}</span><span class="ct">${t.text}</span></div>`).join("")}
      <button class="btn small ghost" data-action="nav|coach">和教练聊聊 ›</button>
    </div>

    <div class="quick">
      <button data-action="nav|fitness"><span class="qi" style="background:var(--orange-bg);color:var(--orange)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12h2m16 0h2M6 8v8m12-8v8M4 9.5v5m16-5v5M8 12h8"/></svg></span>开始训练</button>
      <button data-action="nav|diet"><span class="qi" style="background:var(--green-bg);color:var(--green)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 11a8 8 0 0 1 16 0Zm0 0h16M6 11v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7M12 3V1.5"/></svg></span>记录饮食</button>
      <button data-action="nav|water"><span class="qi" style="background:var(--blue-bg);color:var(--blue)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/></svg></span>喝水打卡</button>
      <button data-action="nav|calendar"><span class="qi" style="background:var(--purple-bg);color:var(--purple)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm4-4v4m8-4v4M3 11h18"/></svg></span>健康日历</button>
    </div>
    <div class="notice">热量与消耗基于《中国食物成分表》均值与MET代谢当量估算，仅供参考</div>
    </div>`;
  }

  /* ================= 计划页 ================= */
  function planView() {
    const plan = window.App.S.plan;
    const S = window.App.S;
    const p = S.profile;
    const wd = window.App.weekdayIdx();
    const g = window.FitEngine.GOALS[plan.goal];
    const eq = window.FitEngine.EQUIPS[plan.equip] || window.FitEngine.EQUIPS.dumbbell;
    return `
    <div class="topbar"><button class="back" data-action="back">‹</button><h1>我的计划 ${g.icon}</h1><button class="bar-act" data-action="regenPlan">重新生成</button></div>
    <div class="page nofoot">
      <div class="card">
        <h3>🗓 ${plan.splitName} <span class="pill o" style="margin-left:auto">每周${plan.daysPerWeek}练</span> <span class="pill p">${eq.icon} ${eq.name}</span></h3>
        <div class="split-grid">
          ${plan.week.map(d => {
            const fm = window.FitEngine.FOCUS_META[d.focus] || {};
            const est = dayEst(d, p.weight);
            return `<div class="split-cell ${fm.color || ""} ${d.type === "rest" ? "rest" : ""} ${d.wd === wd ? "today" : ""}" data-action="planDay" data-wd="${d.wd}">
              <span class="sc-d">${WDN[d.wd].slice(1)}</span>
              <span class="sc-t">${fm.short || "休"}</span>
              <span class="sc-n">${d.type === "strength" ? (est ? est.min + "分" : "") : d.type === "cardio" ? "有氧" : d.type === "active" ? "恢复" : "休息"}</span>
            </div>`;
          }).join("")}
        </div>
        <div class="small" style="margin-top:10px;line-height:1.7">${plan.splitNote}。点击任意格子查看当天的动作清单（含组数/重量）。</div>
      </div>

      <div class="card"><h3>⬆️ 重量怎么加</h3>
        <div class="small" style="line-height:1.8;color:#4A5063">${window.FitEngine.PROGRESS_RULE}</div>
      </div>

      <div class="card"><div class="bignums">
        <div class="bn"><b>${plan.bmr}</b><div class="u">kcal</div><div class="ml">基础代谢 BMR</div></div>
        <div class="bn"><b>${plan.tdee}</b><div class="u">kcal</div><div class="ml">每日消耗 TDEE</div></div>
        <div class="bn"><b>${plan.intake}</b><div class="u">kcal</div><div class="ml">每日建议摄入</div></div>
      </div>
      <div class="sub" style="margin-top:10px;text-align:center">${plan.goal === "fatloss" ? "TDEE−400kcal 温和缺口 · 一周约减0.4kg纯脂肪" : plan.goal === "muscle" ? "TDEE+350kcal 精瘦盈余 · 慢增肌少长脂" : "TDEE 维持热量 · 吃动平衡"}</div>
      <div class="macro">
        <div class="m"><b>${plan.protein}<span class="u">g</span></b><div class="ml">蛋白质<br>${plan.proteinPerKg}g/kg体重</div></div>
        <div class="m"><b>${plan.carb}<span class="u">g</span></b><div class="ml">碳水<br>训练供能主力</div></div>
        <div class="m"><b>${plan.fat}<span class="u">g</span></b><div class="ml">脂肪<br>0.8g/kg保激素</div></div>
      </div></div>

      <div class="card"><h3>🍽 三餐热量分配</h3>
        ${plan.meals.map(m => `<div class="meal-line"><span class="mt">${m.time}</span><span class="mn">${m.name}</span><span class="mk">约 ${m.kcal} kcal</span></div>`).join("")}
      </div>

      <div class="card"><h3>💧 饮水计划（${plan.water}ml/天）</h3>
        <div class="small" style="margin-bottom:4px">${plan.waterSlots.map(sl => sl.time).join(" · ")} 到点提醒</div>
        <button class="btn small ghost" data-action="openRemind">提醒设置 ›</button>
      </div>
    </div>`;
  }

  /* 当天训练清单 sheet */
  function sheetPlanDay(wd) {
    const plan = window.App.S.plan;
    const p = window.App.S.profile;
    const d = plan.week[wd];
    const fm = window.FitEngine.FOCUS_META[d.focus] || {};
    const est = dayEst(d, p.weight);
    let body = "";
    if (d.type === "strength") {
      const rx = window.FitEngine.dayPrescriptions(d, p);
      body = `
        <div style="margin:4px 0 10px"><span class="pill k">🎯 ${esc(d.goal)}</span> <span class="pill b">${d.exercises.length}个动作 × ${d.exercises[0].sets}组</span></div>
        <div class="card" style="box-shadow:none;background:var(--orange-bg);padding:11px 13px;margin-bottom:12px">
          <div class="small" style="color:#B05A1E;line-height:1.6">🌅 <b>热身：</b>${esc(d.warmup)}</div>
        </div>
        ${rx.map((b, i) => `
          <div class="wday" style="cursor:default">
            <div class="wd-chip">${i + 1}<b>${b.sets}组</b></div>
            <div class="w-info"><b data-action="ex" data-id="${b.ex}" style="color:var(--txt)">${b.name} ›</b>
              <div class="w-note">${b.sets}×${b.reps} · 休${b.rest}s · ${b.target}</div>
              <div class="small" style="color:var(--orange);font-weight:700;margin-top:2px">🏋 ${b.weight}</div></div>
          </div>`).join("")}
        <div class="card" style="box-shadow:none;background:var(--green-bg);padding:11px 13px;margin-top:6px">
          <div class="small" style="color:#1E7A5A;line-height:1.6">🌙 <b>拉伸放松：</b>${d.stretches.map(id => { const e = window.findEx(id); return e ? e.name : ""; }).filter(Boolean).join("、")}</div>
        </div>
        <div class="small" style="margin-top:10px;line-height:1.7">${window.FitEngine.PROGRESS_RULE}</div>
        <button class="btn" data-action="startPlanDay" data-wd="${wd}" style="margin-top:12px">开始这个训练 ▶（${est.min}分钟·约${est.kcal}kcal）</button>`;
    } else if (d.type === "cardio") {
      const c = window.findCourse(d.courseId);
      body = `
        <div class="sub" style="margin:2px 0 8px">${c ? c.desc : ""}</div>
        <button class="btn" data-action="startCourse" data-id="${d.courseId}">开始 ${d.title} ▶</button>
        <div class="small" style="margin-top:8px">不想做这个？换成任意有氧（快走/骑行/跳绳30分钟）都算完成。</div>`;
    } else {
      body = `
        <div class="sub" style="margin:2px 0 8px">${d.note}</div>
        <button class="btn ghost" data-action="startCourse" data-id="w15_stretch_night">做10分钟睡前拉伸 🧘</button>`;
    }
    return `<div class="grab"></div>
      <h3 style="margin:4px 0 2px">${fm.icon || ""} 周${WDN[wd].slice(1)} · ${d.title} <span class="small">${d.time || ""}</span></h3>
      ${body}`;
  }

  /* ================= 训练页（课程+动作库） ================= */
  function fitness() {
    const wd = window.App.weekdayIdx();
    const dayPlan = window.App.S.plan.week[wd];
    const isStrength = dayPlan.type === "strength";
    return `
    <div class="topbar"><h1>训练</h1></div>
    <div class="page">
      <div class="card today-course">
        <div class="tc-info"><b>今日课表 · ${dayPlan.title}</b>
          <div class="tc-meta">${isStrength ? dayPlan.exercises.length + "个动作已排好，点开看重量安排" : dayPlan.note}</div>
          <button class="btn small" data-action="${isStrength ? `startPlanDay|${wd}` : dayPlan.type === "cardio" ? `startCourse|${dayPlan.courseId}` : "planDay|" + wd}">${isStrength ? "开始 ▶" : dayPlan.type === "cardio" ? "开始 ▶" : "查看 ›"}</button></div>
        <button class="go" data-action="${isStrength ? `startPlanDay|${wd}` : dayPlan.type === "cardio" ? `startCourse|${dayPlan.courseId}` : "planDay|" + wd}">GO</button>
      </div>
      <div class="chips" id="course-chips">
        <span class="chip on" data-action="courseCat" data-v="all">全部课程</span>
        ${window.COURSE_CATS.map(c => `<span class="chip" data-action="courseCat" data-v="${c.id}">${c.icon} ${c.name}</span>`).join("")}
      </div>
      <div id="course-list">${courseListHTML("all")}</div>

      <div class="divider"></div>
      <h3 style="font-size:15px;margin:4px 0 10px">📚 动作教学库（${window.EXERCISES.length}个 · 含视频示范）</h3>
      <div class="searchbar"><input type="text" id="ex-search" placeholder="搜索动作 / 部位 / 器械，如：深蹲、臀、哑铃" oninput="FitUI.exSearch(this.value)"></div>
      <div id="ex-list">${exListHTML("")}</div>
    </div>`;
  }
  function courseListHTML(cat) {
    const p = window.App.S.profile;
    const list = window.COURSES.filter(c => cat === "all" || c.cat === cat);
    if (!list.length) return `<div class="empty-tip">这个分类暂无课程</div>`;
    return list.map(c => {
      const st = window.courseStats(c, p.weight);
      return `<div class="card course-card" data-action="course" data-id="${c.id}">
        <div class="cc-top"><span class="cc-name">${c.name}</span><span class="lv">${lvName(c.level)} ${stars(c.level)}</span></div>
        <div class="cc-desc">${c.desc}</div>
        <div class="cc-stats"><span>⏱ <b>${st.min}</b>分钟</span><span>🔥 <b>${st.kcal}</b>kcal</span><span>📋 ${st.exCount}个动作</span></div>
      </div>`;
    }).join("");
  }
  function exListHTML(kw) {
    const list = window.searchExercises(kw).slice(0, 40);
    if (!list.length) return `<div class="empty-tip">没有找到相关动作，换个关键词试试</div>`;
    return list.map(e => `
      <div class="exrow" data-action="ex" data-id="${e.id}">
        <div class="ex-ic">${exIcon(e)}</div>
        <div class="ex-mid"><b>${e.name}</b><div class="ex-meta">${e.target.join(" · ")} · ${lvName(e.level)}</div></div>
        <span class="ex-arrow">›</span>
      </div>`).join("");
  }

  /* ================= 课程详情 ================= */
  function course(id) {
    const c = window.findCourse(id);
    const p = window.App.S.profile;
    const st = window.courseStats(c, p.weight);
    let body = "";
    if (c.type === "circuit") {
      body = `
        ${c.warmup && c.warmup.length ? `<div class="card"><h3>🌅 热身</h3>${c.warmup.map(b => exLine(b.ex, (b.sec / 60).toFixed(1) + " 分钟")).join("")}</div>` : ""}
        <div class="card"><h3>💪 主体 × ${c.rounds}轮</h3>${c.main.map(b => exLine(b.ex, `${b.work}秒训练 + ${b.rest}秒休息`)).join("")}</div>
        ${c.cooldown && c.cooldown.length ? `<div class="card"><h3>🌙 放松</h3>${c.cooldown.map(b => exLine(b.ex, (b.sec / 60).toFixed(1) + " 分钟")).join("")}</div>` : ""}`;
    } else if (c.type === "strength") {
      body = `
        ${c.warmup && c.warmup.length ? `<div class="card"><h3>🌅 热身</h3>${c.warmup.map(b => exLine(b.ex, (b.sec / 60).toFixed(1) + " 分钟")).join("")}</div>` : ""}
        <div class="card"><h3>🏋️ 正式组（完成一组点一下打卡）</h3>
          ${c.blocks.map((b, i) => {
            const ex = window.findEx(b.ex);
            return `<div class="meal-line" data-action="ex" data-id="${b.ex}" style="cursor:pointer">
              <span class="mt">${i + 1}</span><span class="mn">${ex ? ex.name : b.ex}<div class="small">${b.sets}组 × ${b.reps} · 组间休${b.rest}秒</div></span>
              <span class="mk">${ex ? stars(ex.level) : ""}</span></div>`;
          }).join("")}
        </div>
        ${c.cooldown && c.cooldown.length ? `<div class="card"><h3>🌙 放松</h3>${c.cooldown.map(b => exLine(b.ex, (b.sec / 60).toFixed(1) + " 分钟")).join("")}</div>` : ""}`;
    } else {
      body = `<div class="card"><h3>🏃 节奏引导</h3>${c.segments.map(s => exLine(s.ex, s.name + " · " + s.min + " 分钟")).join("")}</div>`;
    }
    return `
    <div class="topbar"><button class="back" data-action="back">‹</button><h1>${c.name}</h1></div>
    <div class="page">
      <div class="card">
        <div class="cc-desc" style="font-size:13px">${c.desc}</div>
        <div class="cc-stats" style="margin-top:10px;font-size:13px">
          <span>⏱ <b>${st.min}</b>分钟</span><span>🔥 <b>${st.kcal}</b>kcal</span>
          <span>⭐ ${stars(c.level)}</span><span>📋 ${st.exCount}动作</span>
        </div>
      </div>
      ${body}
      <button class="btn" data-action="startCourse" data-id="${c.id}" style="margin:6px 0 20px">开始训练 ▶</button>
    </div>`;
  }
  function exLine(id, meta) {
    const e = window.findEx(id);
    if (!e) return "";
    return `<div class="exrow" data-action="ex" data-id="${e.id}">
      <div class="ex-ic">${exIcon(e)}</div>
      <div class="ex-mid"><b>${e.name}</b><div class="ex-meta">${meta}</div></div>
      <span class="ex-arrow">›</span></div>`;
  }

  /* ================= 动作详情（参考：大图演示 + 步骤要点并排） ================= */
  function videoBlock(e) {
    const v = window.findExVideo ? window.findExVideo(e.id) : null;
    if (v && v.bvid) {
      return `<div class="video-card">
        <iframe src="${window.biliEmbed(v.bvid)}" scrolling="no" frameborder="no" allowfullscreen="true"
          sandbox="allow-scripts allow-same-origin allow-presentation" referrerpolicy="no-referrer" loading="lazy"></iframe>
        <div class="video-meta"><span class="vm-title">📺 ${esc(v.title)}</span>
          <a class="vm-link" href="${window.biliSearch(e.name + " 教学")}" target="_blank" rel="noopener">更多版本 ›</a></div>
        <div class="small" style="margin-top:6px">视频来自B站（${e.name}·真人示范），联网时可直接播放；建议对着镜子对照模仿。</div>
      </div>`;
    }
    return `<div class="video-card video-empty">
      <div class="ve-tip">🎬 还没有为「${esc(e.name)}」精选真人视频</div>
      <a class="vid-btn bili" href="${window.biliSearch(e.name + " 标准动作 教学")}" target="_blank" rel="noopener"><i>📺</i>B站搜「${esc(e.name)}」真人教学</a>
      <a class="vid-btn bili" href="${window.biliSearch(e.name + " 跟练")}" target="_blank" rel="noopener"><i>🎬</i>B站搜「${esc(e.name)}」跟练视频</a>
    </div>`;
  }
  function exercise(id) {
    const e = window.findEx(id);
    const w = window.App.S.profile.weight;
    const kcal10 = window.exKcal(e, w, 10);
    const gif = window.exGif && window.exGif(e.id);
    const img = !gif && window.exImg && window.exImg(e.id);
    let hero;
    if (gif) {
      hero = `<div class="exhero exhero-gif"><img src="${gif}" alt="${esc(e.name)} 动作演示" loading="lazy"></div>
        <div class="exhero-note">▶ 动图演示 · 静态帧为准 · © Gym visual (gymvisual.com)</div>`;
    } else if (img) {
      hero = `<div class="exhero"><img src="${img}" alt="${esc(e.name)} 动作演示" loading="lazy"></div>`;
    } else {
      hero = `<div class="exhero exhero-fallback">${window.ExAnim ? window.ExAnim.demo(e, { w: 210, h: 190 }) : ""}</div>`;
    }
    return `
    <div class="topbar"><button class="back" data-action="back">‹</button><h1>${e.name}</h1></div>
    <div class="page nofoot">
      <div class="card exdetail">
        ${hero}
        <h2 class="ed-name">${e.name}</h2>
        <div class="ed-tags">
          <span class="pill o">🎯 ${e.target.join("·")}</span>
          <span class="pill b">🧰 ${e.equip}</span>
          <span class="pill g">🔥10分钟约${kcal10}kcal</span>
          <span class="pill k">⭐ ${lvName(e.level)}</span>
        </div>
        <div class="ed-desc">通过「${e.target[0]}」主导的${e.group}训练动作，配合下面的步骤与要点把动作做标准，再看视频对照真人示范。</div>
        <div class="ed-muscle">${muscleSVG(e.target)}</div>
      </div>

      <div class="ex-cols">
        <div class="card ex-col">
          <h3>📋 动作步骤</h3>
          <div class="step-cards">${e.steps.map((s, i) => `<div class="step-card"><span class="step-n">${i + 1}</span><span>${s}</span></div>`).join("")}</div>
          <div class="sub" style="margin-top:8px">🫁 呼吸：${e.breath}</div>
        </div>
        <div class="card ex-col">
          <h3>💡 动作要点</h3>
          <ul class="tiplist">${e.tips.map(t => `<li>${t}</li>`).join("")}</ul>
          <h3 style="margin-top:10px">⚠️ 常见错误</h3>
          <ul class="badlist">${e.mistakes.map(t => `<li>${t}</li>`).join("")}</ul>
        </div>
      </div>

      <div class="card"><h3>🎬 真人教学 · 看着学会</h3>
        ${videoBlock(e)}
      </div>

      <div class="card"><h3>📊 常见安排</h3>
        <div class="meal-line"><span class="mn">新手</span><span class="mk">${e.rx.beginner}</span></div>
        <div class="meal-line"><span class="mn">进阶</span><span class="mk">${e.rx.adv}</span></div>
      </div>
      <button class="btn" data-action="startSingle" data-id="${e.id}" style="margin-bottom:16px">开始单动作训练 ▶（3组×40秒）</button>
    </div>`;
  }

  /* ================= 饮食页 ================= */
  function diet() {
    const S = window.App.S, plan = S.plan;
    const log = window.App.todayLog();
    const s = window.FitEngine.todaySummary(log, plan);
    const band = window.FitEngine.kcalBand(plan);
    const remain = plan.intake - s.diet;
    const waterTotal = (log.water || []).reduce((a, b) => a + b.ml, 0);
    const waterPct = Math.min(100, Math.round(waterTotal / plan.water * 100));
    const meals = [
      { key: "早餐", icon: "🌅" }, { key: "午餐", icon: "☀️" }, { key: "晚餐", icon: "🌙" }, { key: "加餐", icon: "🍪" }
    ];
    return `
    <div class="topbar"><h1>饮食</h1><button class="bar-act" data-action="customFoodOpen">＋自定义</button></div>
    <div class="page">
      <div class="card">
        <div class="diet-head">
          <div class="diet-remain"><b class="${remain < 0 ? "over" : s.diet > 0 ? "ok" : ""}">${remain >= 0 ? "🔥 还可吃" : "😱 已超出"}</b>
            <div class="bignum ${remain < 0 ? "over" : ""}">${Math.abs(remain)} <span style="font-size:12px;color:var(--sub)">kcal</span></div>
            <div class="small">目标 ${band[0]}-${band[1]} · 已记录 ${s.diet}</div></div>
          <div class="diet-ring">${ring(s.diet / plan.intake, remain < 0 ? "var(--danger)" : "var(--green)", "今日", Math.round(s.diet / plan.intake * 100) + "%", "🍎")}</div>
        </div>
        <div class="macro-bars">
          ${mbar("蛋白质", s.p, plan.protein, "linear-gradient(90deg,#FF9A5A,#FF7A3D)")}
          ${mbar("脂肪", s.f, plan.fat, "linear-gradient(90deg,#FFD24D,#F5B70A)")}
          ${mbar("碳水", s.c, plan.carb, "linear-gradient(90deg,#6FBCFF,#3E9BFF)")}
        </div>
      </div>

      <div class="card">
        <h3>💧 饮水 <span class="small" style="margin-left:auto;font-weight:700;color:${waterPct >= 100 ? "var(--green)" : "var(--blue)"}">${waterTotal} / ${plan.water}ml · ${waterPct}%${waterPct >= 100 ? " ✓" : ""}</span></h3>
        <div class="wtrack"><div class="wfill" style="width:${waterPct}%"></div></div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn small ghost" data-action="waterAdd" data-ml="100" style="flex:1">+100</button>
          <button class="btn small" data-action="waterAdd" data-ml="250" style="flex:1.4">+250ml 💧</button>
          <button class="btn small ghost" data-action="waterAdd" data-ml="500" style="flex:1">+500</button>
          <button class="btn small ghost" data-action="nav|water" style="flex:none;padding:9px 12px">详情 ›</button>
        </div>
      </div>

      <div class="card">
        <h3>🔍 搜索食物（${window.allFoods().length}种）</h3>
        <div class="searchbar"><input type="text" id="food-search" placeholder="如：鸡胸肉、奶茶、螺蛳粉" oninput="FitUI.foodSearch(this.value)"></div>
        <div class="chips" id="food-chips">
          <span class="chip on" data-action="foodCat" data-v="all">常用</span>
          ${window.FOOD_CATS.map(c => `<span class="chip" data-action="foodCat" data-v="${c.id}">${c.icon}${c.name}</span>`).join("")}
        </div>
        <div id="food-results">${foodResultsHTML("all", "")}</div>
      </div>

      ${meals.map(m => {
        const items = (log.diet || []).filter(d => d.meal === m.key);
        const kc = items.reduce((a, b) => a + b.kcal, 0);
        const target = plan.meals.find(x => x.name.startsWith(m.key));
        return `<div class="card meal-block">
          <div class="mh"><b>${m.icon} ${m.key}</b>
            <span class="small" style="margin-right:8px">${kc}${target ? "/" + target.kcal : ""} kcal</span>
            <button class="add" data-action="focusSearch" data-meal="${m.key}">＋记录</button></div>
          ${items.length ? items.map(it => foodRow(it, log.diet.indexOf(it))).join("") : `<div class="small" style="padding:4px 0">还没有记录 · 建议摄入 ${target ? target.kcal : ""} kcal</div>`}
        </div>`;
      }).join("")}
    </div>`;
  }
  function mbar(name, v, target, bg) {
    const pct = Math.min(100, v / (target || 1) * 100);
    return `<div class="mbar"><span class="ml">${name}</span>
      <div class="track"><div class="fill" style="width:${pct}%;background:${bg}"></div></div>
      <span class="mv">${v}/${target}g</span></div>`;
  }
  function foodRow(it, idx) {
    return `<div class="foodrow">
      <div class="f-ic">${it.icon || "🍽"}</div>
      <div class="f-mid"><b>${esc(it.name)}</b><span>${it.g}g · 蛋白${it.p}g</span></div>
      <div class="f-kcal">${it.kcal}<i> kcal</i></div>
      <button class="f-del" data-action="dietDel" data-idx="${idx}">✕</button>
    </div>`;
  }
  function foodResultsHTML(cat, kw) {
    let list;
    if (cat === "all" && !kw) list = window.allFoods().filter(f => f.portion).slice(0, 30);
    else if (kw) list = window.allFoods().filter(f => f.name.toLowerCase().includes(kw.toLowerCase())).slice(0, 40);
    else list = window.allFoods().filter(f => f.cat === cat).slice(0, 40);
    if (!list.length) return `<div class="empty-tip">没找到？<a class="link" data-action="customFoodOpen">添加自定义食物 ›</a></div>`;
    return list.map(f => `
      <div class="foodrow result" data-action="foodPick" data-id="${f.id}">
        <div class="f-ic">${f.icon || "🍽"}</div>
        <div class="f-mid"><b>${f.name}</b><span>${f.kcal}kcal/100g · 蛋白${f.p} 脂${f.f} 碳${f.c}${f.note ? " · " + f.note : ""}</span></div>
        <span class="ex-arrow">＋</span>
      </div>`).join("");
  }

  /* ================= 饮水页 ================= */
  function water() {
    const S = window.App.S, plan = S.plan;
    const log = window.App.todayLog();
    const total = (log.water || []).reduce((a, b) => a + b.ml, 0);
    const pct = total / plan.water;
    const hour = new Date().getHours();
    let cum = 0;
    return `
    <div class="topbar"><button class="back" data-action="back">‹</button><h1>饮水</h1></div>
    <div class="page">
      <div class="water-hero">
        <div class="wt-num">${total}<span> / ${plan.water} ml</span></div>
        <div class="wt-goal">${pct >= 1 ? "今日饮水目标达成 ✓ 让身体保持最佳状态💧" : "目标：体重×50ml · 还差 " + Math.max(0, plan.water - total) + "ml"}</div>
        <div class="cup">${cupSVG(pct)}</div>
      </div>
      <div class="water-btns">
        <button class="btn ghost" data-action="waterAdd" data-ml="100">+100</button>
        <button class="btn" data-action="waterAdd" data-ml="250">+250ml 💧</button>
        <button class="btn ghost" data-action="waterAdd" data-ml="500">+500</button>
      </div>
      <button class="btn ghost" data-action="waterUndo" style="margin-top:10px">↩ 撤销上一次</button>
      <div class="card" style="margin-top:16px"><h3>⏰ 今日饮水时段</h3>
        ${plan.waterSlots.map(sl => {
          cum += sl.ml;
          const done = total >= cum;
          const past = hour >= +sl.time.split(":")[0];
          return `<div class="slot-row"><span class="st">${sl.time}</span>
            <span class="sd">${done ? "已完成" : past ? "该喝水啦" : "到点会提醒你"}</span>
            <span class="badge ${done ? "done" : ""}">${done ? "✓" : sl.ml + "ml"}</span></div>`;
        }).join("")}
      </div>
    </div>`;
  }

  /* ================= 日历（每天显示 千卡/分钟/类型/水） ================= */
  function dayTag(log) {
    const w = (log.workouts || [])[0];
    if (!w) return null;
    return w.tag || w.name.slice(0, 2) || "运动";
  }
  function calendar() {
    const app = window.App;
    const ui = app.S.ui;
    const y = ui.calY, m = ui.calM;
    const names = ["一", "二", "三", "四", "五", "六", "日"];
    const firstDow = new Date(y, m, 1).getDay();
    const first = (firstDow === 0 ? 7 : firstDow) - 1; /* 周一开头 */
    const days = new Date(y, m + 1, 0).getDate();
    /* 本月汇总 */
    let trainDays = 0, totalMin = 0, totalKcal = 0, fullCnt = 0;
    for (let d = 1; d <= days; d++) {
      const log = app.S.logs[app.dayKey(new Date(y, m, d))];
      if (!log) continue;
      if ((log.workouts || []).length) { trainDays++; totalMin += log.workouts.reduce((a, b) => a + b.min, 0); totalKcal += log.workouts.reduce((a, b) => a + b.kcal, 0); }
      if (window.FitEngine.dayStatus(log, app.S.plan).full) fullCnt++;
    }
    const todayKey = app.dayKey(new Date());
    const marks = window.FitEngine.cycleMonthMarks ? window.FitEngine.cycleMonthMarks(app.S, y, m) : {};
    let cells = "";
    for (let i = 0; i < first; i++) cells += `<div class="cal-day out" style="min-height:0;border:none;background:transparent"></div>`;
    for (let d = 1; d <= days; d++) {
      const key = app.dayKey(new Date(y, m, d));
      const log = app.S.logs[key];
      const st = window.FitEngine.dayStatus(log || {}, app.S.plan);
      const run = window.FitEngine.fullRunAt(app.S.logs, app.S.plan, key);
      const flame = st.full && run >= 3 ? `<span class="flame">🔥</span>` : "";
      const mk = marks[key];
      const mkDot = mk ? `<span class="cycle-dot ${mk === "predicted" ? "predicted" : mk === "fertile" ? "fertile" : ""}"></span>` : "";
      let chips = "";
      if (log) {
        const kcal = (log.diet || []).reduce((a, b) => a + b.kcal, 0);
        const min = (log.workouts || []).reduce((a, b) => a + b.min, 0);
        const water = (log.water || []).reduce((a, b) => a + b.ml, 0);
        const tag = dayTag(log);
        if (kcal > 0) chips += `<span class="pill o">${kcal >= 1000 ? Math.round(kcal / 100) / 10 + "k" : kcal}千卡</span>`;
        if (min > 0) chips += `<span class="pill b">${min}分钟</span>`;
        if (tag) chips += `<span class="pill p">${esc(tag)}</span>`;
        if (water >= app.S.plan.water) chips += `<span class="pill g">💧满</span>`;
        if (log.photos) chips += `<span class="pill k">📷×${log.photos}</span>`;
      }
      cells += `<div class="cal-day ${key === todayKey ? "today" : ""} ${mk === "period" || mk === "predicted" ? "is-period" : ""}" data-action="calDay" data-date="${key}">
        <span class="d">${d}${flame}${mkDot}</span>
        ${chips ? `<div class="chips-mini">${chips}</div>` : ""}
      </div>`;
    }
    return `
    <div class="topbar"><h1>健身日历</h1></div>
    <div class="page">
      <div class="card">
        <div class="cal-summary">
          <div class="cs p"><b>🏋 ${trainDays}</b>训练天数</div>
          <div class="cs b"><b>⏱ ${totalMin}</b>运动分钟</div>
          <div class="cs o"><b>🔥 ${totalKcal >= 10000 ? (Math.round(totalKcal / 1000 * 10) / 10) + "k" : totalKcal}</b>消耗千卡</div>
          <div class="cs g"><b>✨ ${fullCnt}</b>三环全亮</div>
        </div>
        <div class="cal-head"><button data-action="calPrev">‹</button><b>${y}年${m + 1}月</b><button data-action="calNext">›</button></div>
        <div class="cal-grid">
          ${names.map(n => `<div class="dow">${n}</div>`).join("")}
          ${cells}
        </div>
        <div class="cal-legend">
          <span><span class="pill o">千卡</span> 饮食记录</span>
          <span><span class="pill b">分钟</span> 运动时长</span>
          <span><span class="pill p">类型</span> 训练部位</span>
          <span><span class="pill g">💧满</span> 饮水达标</span>
          <span class="dot-legend"><i></i> 经期 <i style="background:none;border:2px solid var(--pink);width:4px;height:4px"></i> 预测 <i style="background:var(--purple)"></i> 排卵</span>
        </div>
      </div>
      <div class="card"><h3>🏅 打卡成就</h3>
        <div class="badge-grid">${badgeHTML()}</div>
      </div>
      <div class="notice">点击日期查看当天完整记录 · 🔥只有在连续打卡≥3天的日子里出现</div>
    </div>`;
  }
  function badgeHTML() {
    const days = window.App.streakObj().days;
    const list = [
      { d: 7, icon: "🌱", name: "坚持新人" }, { d: 30, icon: "🛡", name: "自律挑战者" },
      { d: 90, icon: "🦋", name: "蜕变达人" }, { d: 365, icon: "👑", name: "年度燃动者" }
    ];
    return list.map(b => `<div class="bd ${days >= b.d ? "on" : ""}"><span class="bi">${b.icon}</span><span>${b.name}</span><span class="small">${b.d}天</span></div>`).join("");
  }

  /* ================= 报告 ================= */
  function report() {
    const app = window.App;
    const seg = app.S.ui.repSeg || "week";
    const metric = app.S.ui.repMetric || "weight";
    const range = app.rangeLogs(seg === "week" ? 7 : 30);
    let trainCnt = 0, trainMin = 0, trainKcal = 0, waterOk = 0, logDays = 0, fullDays = 0, kcalSum = 0, kcalDays = 0;
    range.forEach(l => {
      if (!l) return;
      if ((l.workouts || []).length) { trainCnt++; trainMin += l.workouts.reduce((a, b) => a + b.min, 0); trainKcal += l.workouts.reduce((a, b) => a + b.kcal, 0); }
      if ((l.water || []).length) { logDays++; if (l.water.reduce((a, b) => a + b.ml, 0) >= app.S.plan.water) waterOk++; }
      const dk = (l.diet || []).reduce((a, b) => a + b.kcal, 0);
      if (dk > 0) { kcalDays++; kcalSum += dk; }
      if (window.FitEngine.dayStatus(l, app.S.plan).full) fullDays++;
    });
    /* 体型追踪：按当前指标取数据（周=近8次，月=近30次） */
    const met = METRICS.find(m => m.key === metric) || METRICS[0];
    const mAll = measureHistory(app.S.logs, metric);
    const mRecent = mAll.slice(seg === "week" ? -8 : -30);
    const mDiff = mRecent.length >= 2 ? Math.round((mRecent[mRecent.length - 1].w - mRecent[0].w) * 10) / 10 : null;
    const hist = window.FitEngine.weightHistory(app.S.logs);
    const streak = app.streakObj();
    const photoCnt = (app.photoCache || []).length;
    return `
    <div class="topbar"><button class="back" data-action="back">‹</button><h1>成长报告</h1></div>
    <div class="page nofoot">
      <div class="seg"><button class="${seg === "week" ? "on" : ""}" data-action="repSeg" data-v="week">周报</button>
      <button class="${seg === "month" ? "on" : ""}" data-action="repSeg" data-v="month">月报</button></div>

      <div class="card"><h3>📏 体型追踪
        <button class="more" data-action="openMeasure">＋记录 ›</button></h3>
        <div class="chips" id="metric-chips" style="margin-bottom:6px">
          ${METRICS.map(m => `<span class="chip ${metric === m.key ? "on" : ""}" data-action="repMetric" data-v="${m.key}">${m.icon} ${m.name}</span>`).join("")}
        </div>
        <div class="chart-wrap">${mRecent.length >= 2 ? sparkline(mRecent, 340, 130) : `<div class="empty-tip">记录 2 次以上即可看到${met.name}曲线 📈</div>`}</div>
        ${mRecent.length >= 2 && mDiff !== null ? `<div class="sub" style="text-align:center;margin-top:2px">这段时间${met.name}${mDiff <= 0 ? "减少了" : "增加了"} <b style="color:${mDiff <= 0 ? "var(--green)" : "var(--orange)"}">${Math.abs(mDiff)}${met.unit}</b>${metric !== "weight" && mDiff <= 0 ? "，继续保持！" : ""}</div>` : ""}
        <div class="small" style="margin-top:6px">${metric === "weight" ? "建议每天早晨空腹、同一状态称重，看趋势不看单日。" : "围度软尺贴身不勒肉，每周固定一天量最可比。"}</div>
      </div>

      <div class="card album-entry"><h3>📸 身材相册
        <button class="more" data-action="openAlbum">${photoCnt ? photoCnt + "张 · 查看 ›" : "去拍 ›"}</button></h3>
        ${(app.photoCache && app.photoCache.length) ? `<div class="album-strip">${app.photoCache.slice(0, 5).map(p => `<div class="ph-thumb" data-action="photoView" data-id="${p.id}"><img src="${p.data}" loading="lazy" alt=""></div>`).join("")}</div>
          <button class="btn small ghost" data-action="openCompare" style="margin-top:10px">🔀 前后对比</button>` : `<div class="sub">拍下现在的样子，30 天后回来对比，变化一目了然。</div>
          <button class="btn small" data-action="openPhoto" style="margin-top:10px">📷 拍一张</button>`}
      </div>

      <div class="stat-grid">
        <div class="sg"><b>${trainCnt}</b><span>训练次数</span></div>
        <div class="sg"><b>${trainMin}<span style="font-size:12px">分</span></b><span>运动时长 · 燃烧${trainKcal}kcal</span></div>
        <div class="sg"><b>${waterOk}/${logDays}</b><span>饮水达标/记录天数</span></div>
        <div class="sg"><b>${kcalDays ? Math.round(kcalSum / kcalDays) : 0}<span style="font-size:12px">kcal</span></b><span>日均摄入(${kcalDays}天记录)</span></div>
        <div class="sg"><b>${fullDays}</b><span>三环全亮天数</span></div>
        <div class="sg"><b>${streak.days}</b><span>连续打卡天数</span></div>
      </div>
      <div class="card" style="margin-top:14px"><h3>🏅 成就徽章</h3><div class="badge-grid">${badgeHTML()}</div></div>
      <button class="btn ghost" data-action="makePoster" style="margin-bottom:20px">🖼 生成成长海报（可分享）</button>
    </div>`;
  }

  /* ================= AI 教练 ================= */
  function coach() {
    const list = window.App.S.coachMsgs || [];
    return `
    <div class="topbar"><button class="back" data-action="back">‹</button><h1>🤖 AI健康教练</h1></div>
    <div style="display:flex;flex-direction:column;height:100%">
      <div class="chat-list" id="chat-list">
        ${list.map(m => m.role === "ai"
          ? `<div class="msg"><div class="mascot-mini">${mascotSVG(themeOf().id, "chat")}</div><div class="m-bubble">${esc(m.text)}</div></div>`
          : `<div class="msg m-me"><div class="m-bubble">${esc(m.text)}</div></div>`).join("")}
      </div>
      <div class="chat-quick">
        ${["今天练什么？", "今天吃什么？", "用多重的重量？", "为什么不掉秤？", "喝水计划"].map(q => `<span class="chip" data-action="coachQuick" data-v="${q}">${q}</span>`).join("")}
      </div>
      <div class="chat-inputbar">
        <input type="text" id="coach-input" placeholder="问我任何健康问题…" >
        <button class="send" data-action="coachSend">➤</button>
      </div>
    </div>`;
  }

  /* ================= 我的 ================= */
  function me() {
    const S = window.App.S, p = S.profile, plan = S.plan;
    const g = window.FitEngine.GOALS[plan.goal];
    const bmiV = window.FitEngine.bmi(p);
    const levelName = { beginner: "新手", adv: "进阶" }[p.level];
    const actName = { low: "久坐", mid: "轻度", high: "中度", top: "高强度" }[p.activity];
    const eq = window.FitEngine.EQUIPS[p.equip] || window.FitEngine.EQUIPS.dumbbell;
    return `
    <div class="topbar"><h1>我的</h1></div>
    <div class="page">
      <div class="card profile-card">
        <div class="avatar" style="width:56px;height:56px;font-size:24px" data-action="avatarOpen">${avatarHTML(p)}</div>
        <div class="pinfo"><b>${esc(p.name || "FitDayer")} ${g.icon}${g.name}中</b>
          <div class="pd">${p.sex === "male" ? "男" : "女"} · ${p.age}岁 · ${p.height}cm · ${p.weight}kg · BMI ${bmiV}<br>
          ${levelName} · ${eq.name} · 每周${plan.daysPerWeek}练(${String(p.days || "1,3,5").split(",").map(d => "周" + "一二三四五六日"[+d]).join("/")}) · 偏好${{ morning: "早晨", midday: "中午", evening: "傍晚", night: "夜间" }[p.timePref || p.trainPref]}训练</div></div>
        <button class="btn small ghost" data-action="avatarOpen" style="flex:none">换头像</button>
      </div>
      <div class="card me-list">
        <div class="ml-row" data-action="openTheme"><span class="mi">${mascotSVG(themeOf().id, "me")}</span><span class="mt">主题装扮 / 换IP伙伴</span><span class="mv">${themeOf().name} ›</span></div>
        <div class="ml-row" data-action="openFont"><span class="mi">🔠</span><span class="mt">字体大小</span><span class="mv">${{ small: "小", std: "标准", mid: "大", large: "特大", xlarge: "超大" }[S.settings.fontSize || "std"]} ›</span></div>
        ${p.sex === "female" ? `<div class="ml-row" data-action="openCycle"><span class="mi">🌸</span><span class="mt">生理期管理</span><span class="mv">${S.cycles && S.cycles.enabled ? "已开启 ›" : "去设置 ›"}</span></div>` : ""}
        <div class="ml-row" data-action="nav|plan"><span class="mi">🗓</span><span class="mt">我的分化课表</span><span class="mv">${plan.splitName} ›</span></div>
        <div class="ml-row" data-action="editProfile"><span class="mi">👤</span><span class="mt">修改档案 / 目标 / 每周次数</span><span class="mv">›</span></div>
        <div class="ml-row" data-action="openRemind"><span class="mi">⏰</span><span class="mt">提醒设置</span><span class="mv">${S.settings.remind ? "已开启" : "已关闭"} ›</span></div>
        <div class="ml-row" data-action="openData"><span class="mi">💾</span><span class="mt">数据管理（备份/导入）</span><span class="mv">›</span></div>
        <div class="ml-row" data-action="nav|coach"><span class="mi">🤖</span><span class="mt">AI健康教练</span><span class="mv">问答 ›</span></div>
        <div class="ml-row" data-action="about"><span class="mi">🔥</span><span class="mt">关于 FitDay</span><span class="mv">v3.0 ›</span></div>
      </div>
      <div class="card"><h3>🏆 当前成就</h3><div class="badge-grid">${badgeHTML()}</div>
        <div class="sub" style="margin-top:8px">连续打卡 = 当天训练+饮水+饮食三环全亮</div></div>
      <div class="notice">FitDay 燃动日记 · 每一天的坚持，都在塑造更好的自己。<br>所有数据仅保存在本设备，可随时导出备份。</div>
    </div>`;
  }

  /* ================= 字体大小 sheet ================= */
  function sheetFont() {
    const cur = window.App.S.settings.fontSize || "std";
    const opts = [
      { v: "small", name: "小", desc: "一屏看更多" },
      { v: "std", name: "标准", desc: "默认大小" },
      { v: "mid", name: "大", desc: "阅读更轻松" },
      { v: "large", name: "特大", desc: "适合长辈模式" },
      { v: "xlarge", name: "超大", desc: "一眼看清" }
    ];
    return `
    <div class="grab"></div><h3 style="margin:4px 0">🔠 字体大小</h3>
    <div class="small" style="margin-bottom:10px">立即生效，按你的眼睛舒服来</div>
    <div class="fs-grid">
      ${opts.map(o => `<div class="fs-card ${cur === o.v ? "on" : ""}" data-action="setFont" data-v="${o.v}">
        <span class="fs-sample" style="font-size:${o.v === "small" ? 13 : o.v === "std" ? 15 : o.v === "mid" ? 16.5 : o.v === "large" ? 18 : 20}px">Aa</span>
        <span class="fs-name">${o.name}</span><span class="fs-desc">${o.desc}</span>
      </div>`).join("")}
    </div>`;
  }

  /* ================= 主题装扮 sheet ================= */
  function sheetTheme() {
    const cur = (window.App.S.settings.theme) || "tangerine";
    return `
    <div class="grab"></div><h3 style="margin:4px 0">🎨 主题装扮 · 选你的IP伙伴</h3>
    <div class="small" style="margin-bottom:10px">每套主题有自己的吉祥物和专属打气标语（原创形象）</div>
    <div class="theme-grid">
      ${THEMES.map(t => `
        <div class="theme-card ${cur === t.id ? "on" : ""}" data-action="setTheme" data-v="${t.id}">
          <span class="tc-check">✓</span>
          <div class="tc-mascot">${MASCOTS[t.mascot]("th" + t.id)}</div>
          <div class="tc-name">${t.name}</div>
          <div class="tc-desc">${t.mascotName} · ${t.desc}</div>
          <div class="tc-swatches">${t.sw.map(c => `<i style="background:${c}"></i>`).join("")}</div>
        </div>`).join("")}
    </div>
    <div class="small" style="margin-top:10px">💡 标语示例：「${SLOGANS[cur][0]}」——切换主题后会换一批哦</div>`;
  }

  /* ================= 生理期管理 sheet ================= */
  function sheetCycle() {
    const S = window.App.S;
    const cy = S.cycles || { enabled: false, starts: [], periodLen: 5, cycleLen: 28 };
    const cyc = window.FitEngine.cycleInfo(S);
    const starts = (cy.starts || []).slice().sort().reverse();
    return `
    <div class="grab"></div><h3 style="margin:4px 0">🌸 生理期管理</h3>
    <div class="cycle-row">
      <span class="cr-lab">开启周期跟踪<div class="small">开启后自动判断经期/卵泡/排卵/黄体期，生理期自动切换舒缓训练</div></span>
      <label class="toggle"><input type="checkbox" ${cy.enabled ? "checked" : ""} data-action="setToggle" data-k="__cycle"><i></i></label>
    </div>
    ${cy.enabled ? `
    <div class="cycle-row">
      <span class="cr-lab">最近一次月经开始日期<div class="small">每次月经来了就更新这一项</div></span>
      <input type="date" id="cy-last" value="${starts[0] || ""}">
    </div>
    <div class="cycle-row">
      <span class="cr-lab">经期天数</span>
      <input type="number" id="cy-plen" value="${cy.periodLen || 5}" min="2" max="10">
    </div>
    <div class="cycle-row">
      <span class="cr-lab">周期长度（天）<div class="small">两次月经第一天之间的间隔，21-35天都正常</div></span>
      <input type="number" id="cy-clen" value="${cy.cycleLen || 28}" min="21" max="45">
    </div>
    ${starts.length > 1 ? `<div class="small" style="margin-top:8px">历史记录（App 会按平均间隔自动修正预测）</div>
      <div class="cycle-history">${starts.slice(0, 6).map(s => `<span class="ch-tag">${s.slice(5)} <button data-action="cycleDel" data-v="${s}">✕</button></span>`).join("")}</div>` : ""}
    ${cyc ? `
    <div class="card" style="box-shadow:none;background:var(--card2);margin-top:12px">
      <div class="phase-chip">${window.FitEngine.PHASE_META[cyc.phase].icon} 今天：${window.FitEngine.PHASE_META[cyc.phase].name} · 周期第${cyc.dayOfCycle}天</div>
      <div class="cycle-timeline">
        <span class="tl-m" style="flex:${cy.periodLen || 5}">经期</span>
        <span class="tl-f" style="flex:${Math.max(1, 13 - (cy.periodLen || 5))}">卵泡期</span>
        <span class="tl-o" style="flex:3">排卵</span>
        <span class="tl-l" style="flex:${Math.max(1, (cy.cycleLen || 28) - 16)}">黄体期</span>
      </div>
      <div class="small" style="margin-top:6px">📅 下次经期预计：${cyc.nextStart}</div>
      <div class="small" style="margin-top:8px;line-height:1.7">🏋 ${window.FitEngine.PHASE_ADVICE[cyc.phase].train}</div>
      <div class="small" style="margin-top:6px;line-height:1.7">🍎 ${window.FitEngine.PHASE_ADVICE[cyc.phase].diet}</div>
    </div>` : `<div class="small" style="margin-top:10px">填好最近一次月经开始日期后保存，立即生效。</div>`}
    <button class="btn" data-action="cycleSave" style="margin-top:14px">保存</button>
    <div class="small" style="margin-top:10px">⚠️ 周期预测仅供参考，不能替代医疗建议；痛经严重、周期长期紊乱请就医。</div>` : ""}`;
  }

  /* ================= 弹层内容 ================= */
  function sheetFood(food) {
    const p = food.portion || { name: "100g", g: 100 };
    const defMeal = window.App.guessMeal();
    return `
    <div class="grab"></div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px">
      <div class="f-ic" style="width:52px;height:52px;font-size:28px">${food.icon || "🍽"}</div>
      <div style="flex:1"><b style="font-size:17px">${food.name}</b><div class="small">${food.kcal}kcal/100g · 蛋白${food.p} 脂肪${food.f} 碳水${food.c}</div></div>
    </div>
    <label class="fl">份量（克）</label>
    <div style="display:flex;gap:8px;align-items:center">
      <input type="number" id="sheet-grams" value="${p.g}" style="flex:1">
      <button class="btn small ghost" data-action="setGrams" data-g="100">100g</button>
      ${food.portion ? `<button class="btn small ghost" data-action="setGrams" data-g="${p.g}">${p.name}(${p.g}g)</button>` : ""}
    </div>
    <label class="fl">加入哪一餐</label>
    <div class="chips" id="meal-chips">
      ${["早餐", "午餐", "晚餐", "加餐"].map(m => `<span class="chip ${m === defMeal ? "on" : ""}" data-action="pickMeal" data-v="${m}">${m}</span>`).join("")}
    </div>
    <div class="sub" id="sheet-kcal" style="margin:8px 2px">约 ${Math.round(food.kcal * p.g / 100)} kcal · 蛋白 ${window.foodNutri(food, p.g).p}g</div>
    <button class="btn" data-action="dietAddConfirm" data-id="${food.id}">记录到今日饮食 ✓</button>`;
  }
  function sheetCustomFood() {
    return `
    <div class="grab"></div><h3 style="margin:4px 0 4px">＋ 自定义食物</h3>
    <div class="small" style="margin-bottom:6px">按包装或APP查到的每100g营养填写</div>
    <label class="fl">食物名称</label><input type="text" id="cf-name" placeholder="如：妈妈牌蛋炒饭" maxlength="12">
    <div class="row2" style="margin-top:4px">
      <div><label class="fl">热量 kcal/100g</label><input type="number" id="cf-kcal" placeholder="200"></div>
      <div><label class="fl">蛋白质 g</label><input type="number" id="cf-p" placeholder="8" step="0.1"></div>
      <div><label class="fl">脂肪 g</label><input type="number" id="cf-f" placeholder="8" step="0.1"></div>
      <div><label class="fl">碳水 g</label><input type="number" id="cf-c" placeholder="20" step="0.1"></div>
    </div>
    <button class="btn" data-action="customFoodSave" style="margin-top:16px">保存并记录</button>`;
  }
  function sheetProfile() {
    const S = window.App.S, p = S.profile;
    const sel = (v, cur, label) => `<option value="${v}" ${cur === v ? "selected" : ""}>${label}</option>`;
    return `
    <div class="grab"></div><h3 style="margin:4px 0">👤 修改档案与目标</h3>
    <div class="row2">
      <div><label class="fl">昵称</label><input type="text" id="pf-name" value="${esc(p.name)}" maxlength="10"></div>
      <div><label class="fl">性别</label><select id="pf-sex">${sel("male", p.sex, "男")}${sel("female", p.sex, "女")}</select></div>
      <div><label class="fl">年龄</label><input type="number" id="pf-age" value="${p.age}"></div>
      <div><label class="fl">身高 cm</label><input type="number" id="pf-height" value="${p.height}"></div>
      <div><label class="fl">体重 kg</label><input type="number" id="pf-weight" value="${p.weight}" step="0.1"></div>
      <div><label class="fl">运动基础</label><select id="pf-level">${sel("beginner", p.level, "新手")}${sel("adv", p.level, "进阶")}</select></div>
      <div><label class="fl">目标</label><select id="pf-goal">${sel("fatloss", p.goal, "减脂")}${sel("muscle", p.goal, "增肌")}${sel("keep", p.goal, "保持")}</select></div>
      <div style="grid-column:1/-1"><label class="fl">训练日（点选/取消，2-6天）</label>
        <div class="day-grid">
          ${["一", "二", "三", "四", "五", "六", "日"].map((n, i) => `<div class="opt ${(window.FitUI._pfDays || []).includes(i) ? "on" : ""}" data-action="pfDay" data-v="${i}">${n}</div>`).join("")}
        </div></div>
      <div><label class="fl">训练条件</label><select id="pf-equip">${sel("none", p.equip, "徒手")}${sel("dumbbell", p.equip, "哑铃")}${sel("gym", p.equip, "健身房")}</select></div>
      <div><label class="fl">活动量</label><select id="pf-activity">${sel("low", p.activity, "久坐")}${sel("mid", p.activity, "轻度")}${sel("high", p.activity, "中度")}${sel("top", p.activity, "高强度")}</select></div>
      <div style="grid-column:1/-1"><label class="fl">默认训练时段</label><select id="pf-trainPref">${sel("morning", p.timePref, "早晨 06:00-09:00")}${sel("midday", p.timePref, "中午 11:00-14:00")}${sel("evening", p.timePref, "傍晚 17:00-19:30")}${sel("night", p.timePref, "晚上 19:30-22:00")}</select></div>
      <div style="grid-column:1/-1"><label class="fl">每天的训练时间（选时段，或填精确钟点）</label>
        <div class="dt-rows">${(window.FitUI._pfDays || []).map(wd => {
          const dts = p.dayTimes || {};
          const ex = (p.dayTimesExact || {})[wd] || "";
          const PERIODS = [["morning", "🌅早"], ["midday", "☀️午"], ["evening", "🌆傍晚"], ["night", "🌙晚"]];
          return `<div class="dt-row">
            <span class="dt-day">周${"一二三四五六日"[wd]}</span>
            <div class="dt-chips">${PERIODS.map(pp => `<span class="dt-chip ${(dts[wd] || p.timePref) === pp[0] ? "on" : ""}" data-action="pfDayTime" data-wd="${wd}" data-v="${pp[0]}">${pp[1]}</span>`).join("")}</div>
            <input type="time" class="dt-exact" data-wd="${wd}" data-role="pfExact" value="${ex}">
          </div>`;
        }).join("")}</div></div>
    </div>
    <div class="small" style="margin-top:10px">体重/目标/次数变更后，计划与课表将自动重新生成，历史记录不受影响。</div>
    <button class="btn" data-action="saveProfile" style="margin-top:14px">保存并更新计划</button>`;
  }
  function sheetRemind() {
    const S = window.App.S, st = S.settings;
    const row = (k, name, sub) => `
      <div class="ml-row" style="cursor:default">
        <span class="mt" style="flex:1">${name}<div class="small">${sub}</div></span>
        <label class="toggle"><input type="checkbox" ${st[k] ? "checked" : ""} data-action="setToggle" data-k="${k}"><i></i></label>
      </div>`;
    return `
    <div class="grab"></div><h3 style="margin:4px 0">⏰ 提醒设置</h3>
    ${row("remind", "总开关", "到点弹窗+响铃提醒（页面需保持打开）")}
    ${row("sound", "提示音", "提醒时播放清脆铃声")}
    ${row("train", "训练提醒", "训练日 " + S.plan.trainTime + " 提醒去运动")}
    ${row("water", "饮水提醒", "8个时段到点提醒喝水")}
    ${row("meal", "饮食记录提醒", "三餐后提醒记录")}
    ${row("sleep", "睡前提醒", S.plan.sleepTime + " 回顾打卡+早睡")}
    <button class="btn small ghost" data-action="testRemind" style="margin-top:12px">测试一下提醒效果</button>
    <div class="small" style="margin-top:10px">💡 网页版提醒需页面保持打开；安装到主屏幕后更稳定。系统级锁屏推送需要原生App，网页版无法实现，敬请理解。</div>`;
  }
  function sheetData() {
    return `
    <div class="grab"></div><h3 style="margin:4px 0">💾 数据管理</h3>
    <div class="small" style="margin:6px 0 12px">所有记录保存在本设备浏览器中。换设备/清缓存前，先导出备份！</div>
    <button class="btn ghost" data-action="exportData" style="margin-bottom:10px">📤 导出备份文件（JSON）</button>
    <button class="btn ghost" data-action="importData" style="margin-bottom:10px">📥 导入备份文件</button>
    <input type="file" id="import-file" accept=".json" style="display:none" onchange="FitUI.importFile(this)">
    <button class="btn danger" data-action="clearData">🗑 清空所有数据</button>`;
  }

  return {
    esc, logo, exIcon, stars, lvName, ring, cupSVG, sparkline, goalTag,
    muscleSVG, vidLinks, dayEst, MASCOTS, THEMES, mascotSVG, themeOf, sloganOf,
    avatarHTML, sheetAvatar, sheetFont, videoBlock, sheetTheme, sheetCycle,
    album, sheetPhotoTake, sheetCompare, sheetCompareResult, sheetMeasure, METRICS, measureHistory,
    onboard, home, planView, sheetPlanDay, fitness, courseListHTML, exListHTML,
    course, exercise, diet, foodResultsHTML, foodRow, water, calendar, dayTag,
    report, coach, me, sheetFood, sheetCustomFood, sheetProfile, sheetRemind, sheetData
  };
})();
