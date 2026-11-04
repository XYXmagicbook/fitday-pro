/* ============================================================
   FitDay 成就系统 —— 分层SVG徽章 + 里程碑检查
   ============================================================ */
window.FitAchv = (function () {

  /* 徽章等级颜色 */
  var TIER = {
    bronze:  { name: "青铜", c1: "#CD7F32", c2: "#E8B86D", text: "#8B5E14" },
    silver:  { name: "白银", c1: "#9EA9B5", c2: "#D4DAE0", text: "#5A6B7B" },
    gold:    { name: "黄金", c1: "#DAA520", c2: "#FFD700", text: "#8B6914" },
    diamond: { name: "钻石", c1: "#5BC0DE", c2: "#B9F2FF", text: "#2C7A9B" },
    legend:  { name: "传说", c1: "#9B59B6", c2: "#E8DAEF", text: "#6C3483" }
  };

  /* 徽章定义 */
  var BADGES = [
    /* 打卡连续 */
    { id: "streak_3",   cat: "streak", tier: "bronze",  icon: "🔥", name: "初燃之火",   desc: "连续打卡3天",       goal: 3 },
    { id: "streak_7",   cat: "streak", tier: "bronze",  icon: "🔥", name: "一周坚持",   desc: "连续打卡7天",       goal: 7 },
    { id: "streak_14",  cat: "streak", tier: "silver",  icon: "🔥", name: "双周毅力",   desc: "连续打卡14天",      goal: 14 },
    { id: "streak_30",  cat: "streak", tier: "gold",    icon: "🔥", name: "月度战神",   desc: "连续打卡30天",      goal: 30 },
    { id: "streak_60",  cat: "streak", tier: "gold",    icon: "🔥", name: "钢铁意志",   desc: "连续打卡60天",      goal: 60 },
    { id: "streak_100", cat: "streak", tier: "diamond", icon: "💎", name: "百日传奇",   desc: "连续打卡100天",     goal: 100 },
    { id: "streak_365", cat: "streak", tier: "legend",  icon: "👑", name: "年度燃王",   desc: "连续打卡365天",     goal: 365 },
    /* 运动次数 */
    { id: "workout_10",  cat: "workout", tier: "bronze",  icon: "🏃", name: "初出茅庐",   desc: "完成10次训练",      goal: 10 },
    { id: "workout_50",  cat: "workout", tier: "silver",  icon: "🏃", name: "进阶训练者", desc: "完成50次训练",      goal: 50 },
    { id: "workout_100", cat: "workout", tier: "gold",    icon: "🏅", name: "百练成钢",   desc: "完成100次训练",     goal: 100 },
    { id: "workout_200", cat: "workout", tier: "diamond", icon: "🏆", name: "两百里征途", desc: "完成200次训练",     goal: 200 },
    /* 体重变化 */
    { id: "weight_1",  cat: "weight", tier: "bronze",  icon: "⚖", name: "初见成效",   desc: "体重减少1kg",       goal: 1 },
    { id: "weight_3",  cat: "weight", tier: "silver",  icon: "⚖", name: "三公斤突破", desc: "体重减少3kg",       goal: 3 },
    { id: "weight_5",  cat: "weight", tier: "gold",    icon: "⚖", name: "五公斤蜕变", desc: "体重减少5kg",       goal: 5 },
    { id: "weight_10", cat: "weight", tier: "diamond", icon: "⚖", name: "十公斤重生", desc: "体重减少10kg",      goal: 10 },
    /* 围度变化 */
    { id: "waist_2",  cat: "measure", tier: "bronze",  icon: "📏", name: "腰围-2cm",   desc: "腰围减少2cm",       goal: 2 },
    { id: "waist_5",  cat: "measure", tier: "gold",    icon: "📏", name: "腰围-5cm",   desc: "腰围减少5cm",       goal: 5 },
    /* 拍照记录 */
    { id: "photo_7",  cat: "photo", tier: "bronze",  icon: "📸", name: "记录初心",   desc: "拍照记录7次",       goal: 7 },
    { id: "photo_30", cat: "photo", tier: "gold",    icon: "📸", name: "蜕变摄影师", desc: "拍照记录30次",      goal: 30 },
    /* 食物记录 */
    { id: "food_7",   cat: "food", tier: "bronze",  icon: "🍎", name: "饮食入门",   desc: "记录饮食7天",       goal: 7 },
    { id: "food_30",  cat: "food", tier: "silver",  icon: "🍎", name: "饮食达人",   desc: "记录饮食30天",      goal: 30 }
  ];

  /* SVG 徽章生成器 */
  function badgeSVG(badge, earned) {
    var t = TIER[badge.tier];
    var uid = badge.id.replace(/[^a-z0-9]/gi, "");
    var opacity = earned ? 1 : 0.25;
    var ring = earned ? t.c1 : "#C8CDD6";
    var fill = earned ? t.c2 : "#E8EAEF";
    var glow = earned ? ("filter:url(#glow" + uid + ")") : "";
    return '<svg viewBox="0 0 80 80" width="56" height="56" style="opacity:' + opacity + '">' +
      '<defs><radialGradient id="bg' + uid + '" cx="50%" cy="35%">' +
      '<stop offset="0%" stop-color="' + fill + '"/><stop offset="100%" stop-color="' + ring + '"/></radialGradient>' +
      (earned ? '<filter id="glow' + uid + '"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="' + t.c1 + '" flood-opacity="0.5"/></filter>' : '') +
      '</defs>' +
      '<circle cx="40" cy="40" r="36" fill="url(#bg' + uid + ')" stroke="' + ring + '" stroke-width="3" ' + glow + '/>' +
      '<circle cx="40" cy="40" r="30" fill="none" stroke="' + (earned ? "#FFFFFF" : "#B0B5BE") + '" stroke-width="1.5" opacity="0.5"/>' +
      '<text x="40" y="38" text-anchor="middle" font-size="20" opacity="' + opacity + '">' + badge.icon + '</text>' +
      '<text x="40" y="58" text-anchor="middle" font-size="10" font-weight="800" fill="' + (earned ? t.text : "#A0A5AE") + '">' + (earned ? t.name : "未达成") + '</text>' +
      '</svg>';
  }

  /* 检查所有成就 */
  function checkAll(S) {
    var streak = (window.FitEngine ? window.FitEngine.computeStreak(S.logs, S.plan) : 0);
    var workoutCnt = 0;
    var photoCnt = 0;
    var foodCnt = 0;
    Object.keys(S.logs || {}).forEach(function (k) {
      var l = S.logs[k];
      if (l.workouts && l.workouts.length) workoutCnt++;
      if (l.photos) photoCnt += l.photos;
      if (l.diet && l.diet.length) foodCnt++;
    });
    /* 体重变化：从最早记录到现在 */
    var weights = [];
    Object.keys(S.logs || {}).forEach(function (k) { if (S.logs[k].weight) weights.push({ date: k, w: S.logs[k].weight }); });
    weights.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var weightLoss = 0;
    if (weights.length >= 2) weightLoss = Math.max(0, weights[0].w - weights[weights.length - 1].w);
    /* 腰围变化 */
    var waistArr = [];
    Object.keys(S.logs || {}).forEach(function (k) {
      var m = S.logs[k].measures;
      if (m && m.waist) waistArr.push({ date: k, v: m.waist });
    });
    waistArr.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var waistLoss = 0;
    if (waistArr.length >= 2) waistLoss = Math.max(0, waistArr[0].v - waistArr[waistArr.length - 1].v);

    var stats = { streak: streak, workout: workoutCnt, weight: weightLoss, measure: waistLoss, photo: photoCnt, food: foodCnt };
    var results = [];
    BADGES.forEach(function (b) {
      var val = stats[b.cat] || 0;
      results.push({ badge: b, earned: val >= b.goal, progress: Math.min(1, val / b.goal), current: val });
    });
    return results;
  }

  /* 获取最新解锁的徽章 */
  function newUnlocks(S, lastCheck) {
    var all = checkAll(S);
    if (!lastCheck) return [];
    return all.filter(function (r) { return r.earned && !lastCheck[r.badge.id]; }).map(function (r) { return r.badge; });
  }

  return { BADGES: BADGES, TIER: TIER, badgeSVG: badgeSVG, checkAll: checkAll, newUnlocks: newUnlocks };
})();
