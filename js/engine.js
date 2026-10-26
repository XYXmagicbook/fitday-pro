/* ============================================================
   FitDay 智能计划引擎 & AI健康教练 v3
   训练计划参考商业教练真人课表结构（小红书健身教练同款）：
   每天 = 训练目标 + 热身方案 + 6个动作(4组×12-15次,组间休30-60s) + 专属拉伸清单
   动作分三套：健身房(器械/杠铃) / 哑铃(宿舍家用) / 徒手，按用户条件自动匹配
   分化遵循肌群恢复规律：
   2练=全身A/B  3练=女生三分化(胸+三头/背+肩前中束/臀腿+肩后束)
   4练=四分化(胸/背/肩/臀腿)  5练=五分化(+手臂核心)  6练=三分化×2
   理论依据：Mifflin-St Jeor BMR、TDEE热量法、蛋白质2.0/1.8g/kg、渐进超负荷
   ============================================================ */

window.FitEngine = (function () {

  const GOALS = {
    fatloss: { name: "减脂", icon: "🔥" },
    muscle:  { name: "增肌", icon: "💪" },
    keep:    { name: "保持", icon: "⚖" }
  };
  const EQUIPS = {
    none:     { name: "徒手", icon: "🤸" },
    dumbbell: { name: "哑铃", icon: "🏋" },
    gym:      { name: "健身房", icon: "🏟" }
  };
  const FOCUS_META = {
    chestTri:   { name: "胸+手臂", short: "胸", icon: "🟠", color: "c-push" },
    backDelts:  { name: "背+肩前中束", short: "背肩", icon: "🔵", color: "c-pull" },
    glutesRear: { name: "臀腿+肩后束", short: "臀腿", icon: "🟣", color: "c-legs" },
    backBi:     { name: "背+手臂", short: "背", icon: "🔵", color: "c-pull" },
    shoulderDay:{ name: "肩+核心", short: "肩", icon: "🟣", color: "c-legs" },
    armsCore:   { name: "手臂+核心", short: "臂", icon: "🟡", color: "c-upper" },
    full:       { name: "全身", short: "全", icon: "🟢", color: "c-full" },
    cardio:     { name: "有氧", short: "氧", icon: "💚", color: "c-cardio" },
    active:     { name: "恢复", short: "恢", icon: "🧘", color: "c-full" },
    rest:       { name: "休息", short: "休", icon: "🛌", color: "rest" }
  };

  /* ---------- 起始重量建议（哑铃/自重口径，kg） ---------- */
  const WEIGHT_HINT = {
    db_floor_press:   { f: "每只 5-8kg", m: "每只 10-15kg" },
    incline_db_press: { f: "每只 4-6kg", m: "每只 8-12kg" },
    db_shoulder_press:{ f: "每只 4-6kg", m: "每只 8-12kg" },
    db_lateral_raise: { f: "每只 2-4kg", m: "每只 4-8kg" },
    db_front_raise:   { f: "每只 2-3kg", m: "每只 4-6kg" },
    db_bent_raise:    { f: "每只 2-3kg", m: "每只 4-6kg" },
    db_curl:          { f: "每只 4-6kg", m: "每只 8-10kg" },
    db_row:           { f: "单只 5-8kg", m: "单只 10-15kg" },
    db_goblet_squat:  { f: "共 10-15kg", m: "共 15-25kg" },
    db_rdl:           { f: "每只 5-8kg", m: "每只 10-15kg" },
    db_lunge:         { f: "每只 4-6kg", m: "每只 8-12kg" },
    bulgarian_split:  { f: "每只 4-8kg", m: "每只 10-15kg" },
    glute_bridge:     { f: "髋上放哑铃 5-10kg", m: "髋上放哑铃 10-20kg" },
    pushup:           { f: "自重(跪姿过渡)", m: "自重" },
    pullup:           { f: "弹力带辅助", m: "自重或弹力带辅助" }
  };
  function weightHint(exId, sex, equip) {
    if (equip === "none") return "自重 · 用速度/幅度/单腿变式调难度";
    if (equip === "gym") {
      const h = WEIGHT_HINT[exId];
      if (h) return (sex === "male" ? h.m : h.f).replace("每只", "哑铃每只").replace("单只", "哑铃单只") + "；器械动作插销选「能标准完成15次」的重量";
      return "插销/杠铃从轻重量开始：以能标准完成15次的重量为准";
    }
    const h = WEIGHT_HINT[exId];
    return h ? (sex === "male" ? h.m : h.f) : "选能标准完成15次的重量";
  }

  /* ============================================================
     分化日模板（教练课表结构：goal目标 / warmup热身 / moves三套 / stretches拉伸）
     ============================================================ */
  const T = {
    chestTri: {
      title: "胸+手臂(肱三头)", goal: "塑造胸线，收紧拜拜肉",
      warmup: "开合跳或坡度快走 5-8分钟，动态开肩活动胸椎",
      stretches: ["chest_door", "neck_shoulder", "piriformis"],
      moves: {
        gym: [
          { ex: "machine_chest_press", sets: 4, reps: "15次", rest: 45 },
          { ex: "incline_db_press", sets: 4, reps: "15次", rest: 45 },
          { ex: "machine_fly", sets: 4, reps: "15次", rest: 45 },
          { ex: "triceps_pushdown", sets: 4, reps: "15次", rest: 45 },
          { ex: "dip_bench", sets: 4, reps: "12次", rest: 45 },
          { ex: "pushup", sets: 4, reps: "力竭-2次", rest: 30 }
        ],
        dumbbell: [
          { ex: "db_floor_press", sets: 4, reps: "12次", rest: 45 },
          { ex: "incline_pushup", sets: 4, reps: "15次", rest: 45 },
          { ex: "dip_bench", sets: 4, reps: "12次", rest: 45 },
          { ex: "pushup", sets: 4, reps: "力竭-2次", rest: 45 },
          { ex: "kneel_pushup", sets: 4, reps: "15次", rest: 30 }
        ],
        none: [
          { ex: "incline_pushup", sets: 4, reps: "15次", rest: 45 },
          { ex: "kneel_pushup", sets: 4, reps: "15次", rest: 45 },
          { ex: "pushup", sets: 4, reps: "力竭-2次", rest: 45 },
          { ex: "dip_bench", sets: 4, reps: "12次", rest: 45 },
          { ex: "plank", sets: 3, reps: "45秒", rest: 30 }
        ]
      }
    },
    backDelts: {
      title: "背+肩(前中束)", goal: "改善圆肩驼背，打造直角肩",
      warmup: "开合跳 3分钟 + 猫牛式/肩绕环 2分钟，激活上背",
      stretches: ["neck_shoulder", "chest_door", "piriformis"],
      moves: {
        gym: [
          { ex: "lat_pulldown", sets: 4, reps: "15次", rest: 45 },
          { ex: "seated_cable_row", sets: 4, reps: "15次", rest: 45 },
          { ex: "barbell_row", sets: 4, reps: "12次", rest: 60 },
          { ex: "db_shoulder_press", sets: 4, reps: "12次", rest: 45 },
          { ex: "db_lateral_raise", sets: 4, reps: "15次", rest: 30 },
          { ex: "db_front_raise", sets: 4, reps: "15次", rest: 30 }
        ],
        dumbbell: [
          { ex: "db_row", sets: 4, reps: "每侧12次", rest: 45 },
          { ex: "band_row", sets: 4, reps: "15次", rest: 45 },
          { ex: "db_shoulder_press", sets: 4, reps: "12次", rest: 45 },
          { ex: "db_lateral_raise", sets: 4, reps: "15次", rest: 30 },
          { ex: "db_front_raise", sets: 4, reps: "15次", rest: 30 },
          { ex: "db_curl", sets: 4, reps: "12次", rest: 30 }
        ],
        none: [
          { ex: "dead_bug", sets: 4, reps: "每侧10次", rest: 30 },
          { ex: "superman", sets: 4, reps: "15次", rest: 45 },
          { ex: "crunch", sets: 4, reps: "15次", rest: 30 },
          { ex: "pushup", sets: 3, reps: "力竭-2次", rest: 45 },
          { ex: "plank", sets: 3, reps: "45秒", rest: 30 }
        ]
      }
    },
    glutesRear: {
      title: "臀腿+肩后束", goal: "打造饱满臀部，紧致大腿线条",
      warmup: "坡度快走或开合跳 5-8分钟，动态拉伸髋部和大腿后侧",
      stretches: ["piriformis", "hamstring_stretch", "quad_stretch"],
      moves: {
        gym: [
          { ex: "bulgarian_split", sets: 4, reps: "每侧12次", rest: 60 },
          { ex: "leg_press", sets: 4, reps: "15次", rest: 60 },
          { ex: "db_rdl", sets: 4, reps: "12次", rest: 60 },
          { ex: "goat_hyper", sets: 4, reps: "15次", rest: 45 },
          { ex: "reverse_fly_machine", sets: 4, reps: "15次", rest: 30 },
          { ex: "glute_bridge", sets: 4, reps: "15次", rest: 45 }
        ],
        dumbbell: [
          { ex: "db_goblet_squat", sets: 4, reps: "15次", rest: 60 },
          { ex: "bulgarian_split", sets: 4, reps: "每侧10次", rest: 60 },
          { ex: "db_rdl", sets: 4, reps: "12次", rest: 60 },
          { ex: "glute_bridge", sets: 4, reps: "15次", rest: 45 },
          { ex: "db_bent_raise", sets: 4, reps: "15次", rest: 30 },
          { ex: "calf_raise", sets: 4, reps: "20次", rest: 30 }
        ],
        none: [
          { ex: "squat", sets: 4, reps: "15次", rest: 45 },
          { ex: "lunge", sets: 4, reps: "每侧12次", rest: 45 },
          { ex: "single_glute_bridge", sets: 4, reps: "每侧12次", rest: 45 },
          { ex: "glute_bridge", sets: 4, reps: "15次", rest: 45 },
          { ex: "wall_sit", sets: 4, reps: "45秒", rest: 45 },
          { ex: "calf_raise", sets: 4, reps: "20次", rest: 30 }
        ]
      }
    },
    backBi: {
      title: "背+手臂(肱二头)", goal: "背部变薄，手臂线条更紧致",
      warmup: "开合跳 3分钟 + 弹力带肩外旋/猫牛式 2分钟",
      stretches: ["piriformis", "neck_shoulder", "chest_door"],
      moves: {
        gym: [
          { ex: "lat_pulldown", sets: 4, reps: "15次", rest: 45 },
          { ex: "barbell_row", sets: 4, reps: "12次", rest: 60 },
          { ex: "seated_cable_row", sets: 4, reps: "15次", rest: 45 },
          { ex: "goat_hyper", sets: 4, reps: "15次", rest: 45 },
          { ex: "db_curl", sets: 4, reps: "12次", rest: 30 }
        ],
        dumbbell: [
          { ex: "db_row", sets: 4, reps: "每侧12次", rest: 45 },
          { ex: "band_row", sets: 4, reps: "15次", rest: 45 },
          { ex: "db_bent_raise", sets: 4, reps: "15次", rest: 30 },
          { ex: "superman", sets: 4, reps: "15次", rest: 45 },
          { ex: "db_curl", sets: 4, reps: "12次", rest: 30 }
        ],
        none: [
          { ex: "dead_bug", sets: 4, reps: "每侧10次", rest: 30 },
          { ex: "superman", sets: 4, reps: "15次", rest: 45 },
          { ex: "crunch", sets: 4, reps: "每侧10次", rest: 30 },
          { ex: "plank", sets: 3, reps: "45秒", rest: 30 },
          { ex: "pushup", sets: 3, reps: "力竭-2次", rest: 45 }
        ]
      }
    },
    shoulderDay: {
      title: "肩全束+核心", goal: "肩线立体，核心更稳",
      warmup: "开合跳 3分钟 + 肩绕环/轻重量侧平举热身组 2分钟",
      stretches: ["neck_shoulder", "chest_door", "piriformis"],
      moves: {
        gym: [
          { ex: "db_shoulder_press", sets: 4, reps: "12次", rest: 45 },
          { ex: "db_lateral_raise", sets: 4, reps: "15次", rest: 30 },
          { ex: "db_front_raise", sets: 4, reps: "15次", rest: 30 },
          { ex: "reverse_fly_machine", sets: 4, reps: "15次", rest: 30 },
          { ex: "russian_twist", sets: 4, reps: "左右各15次", rest: 30 },
          { ex: "plank", sets: 4, reps: "45-60秒", rest: 30 }
        ],
        dumbbell: [
          { ex: "db_shoulder_press", sets: 4, reps: "12次", rest: 45 },
          { ex: "db_lateral_raise", sets: 4, reps: "15次", rest: 30 },
          { ex: "db_bent_raise", sets: 4, reps: "15次", rest: 30 },
          { ex: "russian_twist", sets: 4, reps: "左右各15次", rest: 30 },
          { ex: "leg_raise", sets: 4, reps: "12次", rest: 30 },
          { ex: "plank", sets: 4, reps: "45秒", rest: 30 }
        ],
        none: [
          { ex: "pushup", sets: 4, reps: "力竭-2次", rest: 45 },
          { ex: "incline_pushup", sets: 4, reps: "15次", rest: 30 },
          { ex: "superman", sets: 4, reps: "15次", rest: 45 },
          { ex: "russian_twist", sets: 4, reps: "左右各15次", rest: 30 },
          { ex: "dead_bug", sets: 4, reps: "每侧10次", rest: 30 },
          { ex: "plank", sets: 4, reps: "45秒", rest: 30 }
        ]
      }
    },
    armsCore: {
      title: "手臂+核心", goal: "拜拜肉紧致，腹部线条出现",
      warmup: "开合跳 3分钟 + 手腕手臂动态热身 1分钟",
      stretches: ["neck_shoulder", "piriformis"],
      moves: {
        gym: [
          { ex: "triceps_pushdown", sets: 4, reps: "15次", rest: 30 },
          { ex: "db_curl", sets: 4, reps: "12次", rest: 30 },
          { ex: "dip_bench", sets: 4, reps: "12次", rest: 45 },
          { ex: "crunch", sets: 4, reps: "20次", rest: 30 },
          { ex: "reverse_crunch", sets: 4, reps: "15次", rest: 30 },
          { ex: "plank", sets: 4, reps: "45-60秒", rest: 30 }
        ],
        dumbbell: [
          { ex: "db_curl", sets: 4, reps: "12次", rest: 30 },
          { ex: "dip_bench", sets: 4, reps: "12次", rest: 45 },
          { ex: "pushup", sets: 3, reps: "力竭-2次", rest: 45 },
          { ex: "crunch", sets: 4, reps: "20次", rest: 30 },
          { ex: "reverse_crunch", sets: 4, reps: "15次", rest: 30 },
          { ex: "plank", sets: 4, reps: "45秒", rest: 30 }
        ],
        none: [
          { ex: "dip_bench", sets: 4, reps: "12次", rest: 45 },
          { ex: "pushup", sets: 3, reps: "力竭-2次", rest: 45 },
          { ex: "crunch", sets: 4, reps: "20次", rest: 30 },
          { ex: "reverse_crunch", sets: 4, reps: "15次", rest: 30 },
          { ex: "russian_twist", sets: 4, reps: "左右各15次", rest: 30 },
          { ex: "plank", sets: 4, reps: "45秒", rest: 30 }
        ]
      }
    },
    fullA: {
      title: "全身A(蹲推拉)", goal: "新手打基础，全身刺激一遍",
      warmup: "开合跳 3分钟 + 徒手深蹲1组×15次找感觉",
      stretches: ["quad_stretch", "hamstring_stretch", "chest_door"],
      moves: {
        gym: [
          { ex: "db_goblet_squat", sets: 4, reps: "12次", rest: 60 },
          { ex: "machine_chest_press", sets: 4, reps: "12次", rest: 60 },
          { ex: "seated_cable_row", sets: 4, reps: "12次", rest: 60 },
          { ex: "db_shoulder_press", sets: 3, reps: "12次", rest: 45 },
          { ex: "plank", sets: 3, reps: "45秒", rest: 30 }
        ],
        dumbbell: [
          { ex: "db_goblet_squat", sets: 4, reps: "12次", rest: 60 },
          { ex: "db_floor_press", sets: 4, reps: "12次", rest: 60 },
          { ex: "db_row", sets: 4, reps: "每侧12次", rest: 60 },
          { ex: "db_shoulder_press", sets: 3, reps: "12次", rest: 45 },
          { ex: "plank", sets: 3, reps: "45秒", rest: 30 }
        ],
        none: [
          { ex: "squat", sets: 4, reps: "15次", rest: 45 },
          { ex: "incline_pushup", sets: 4, reps: "15次", rest: 45 },
          { ex: "superman", sets: 4, reps: "15次", rest: 45 },
          { ex: "crunch", sets: 3, reps: "每侧10次", rest: 30 },
          { ex: "plank", sets: 3, reps: "45秒", rest: 30 }
        ]
      }
    },
    fullB: {
      title: "全身B(髋铰链+核心)", goal: "和A日交替，避免瓶颈",
      warmup: "开合跳 3分钟 + 徒手臀桥1组×15次激活臀部",
      stretches: ["piriformis", "hamstring_stretch", "neck_shoulder"],
      moves: {
        gym: [
          { ex: "db_rdl", sets: 4, reps: "12次", rest: 60 },
          { ex: "pushup", sets: 4, reps: "力竭-2次", rest: 45 },
          { ex: "lat_pulldown", sets: 4, reps: "15次", rest: 45 },
          { ex: "bulgarian_split", sets: 3, reps: "每侧10次", rest: 60 },
          { ex: "db_lateral_raise", sets: 3, reps: "15次", rest: 30 },
          { ex: "reverse_crunch", sets: 3, reps: "15次", rest: 30 }
        ],
        dumbbell: [
          { ex: "db_rdl", sets: 4, reps: "12次", rest: 60 },
          { ex: "pushup", sets: 4, reps: "力竭-2次", rest: 45 },
          { ex: "band_row", sets: 4, reps: "15次", rest: 45 },
          { ex: "db_lunge", sets: 3, reps: "每侧10次", rest: 60 },
          { ex: "db_lateral_raise", sets: 3, reps: "15次", rest: 30 },
          { ex: "reverse_crunch", sets: 3, reps: "15次", rest: 30 }
        ],
        none: [
          { ex: "single_glute_bridge", sets: 4, reps: "每侧12次", rest: 45 },
          { ex: "pushup", sets: 4, reps: "力竭-2次", rest: 45 },
          { ex: "crunch", sets: 4, reps: "12次", rest: 30 },
          { ex: "lunge", sets: 3, reps: "每侧12次", rest: 45 },
          { ex: "superman", sets: 3, reps: "15次", rest: 45 },
          { ex: "reverse_crunch", sets: 3, reps: "15次", rest: 30 }
        ]
      }
    }
  };

  /* ---------- 按天数与紧凑度输出分化（compact=选的日子相邻时，穿插不同肌群） ---------- */
  function splitFor(days, compact) {
    if (days <= 2) return { name: "全身适应·A/B交替", days: 2, note: "全身A/B交替，两次之间尽量隔1-2天",
      order: [T.fullA, T.fullB] };
    if (days === 3) return compact
      ? { name: "女生三分化·胸/臀腿/背肩", days: 3, note: "你选的日子相邻，AI特意穿插了不同肌群：胸→臀腿→背肩，互不抢恢复",
          order: [T.chestTri, T.glutesRear, T.backDelts] }
      : { name: "女生三分化·胸/背肩/臀腿", days: 3, note: "胸+三头/背+肩前中束/臀腿+肩后束轮换，同一肌群72小时恢复再练，女生塑形黄金分化",
          order: [T.chestTri, T.backDelts, T.glutesRear] };
    if (days === 4) return compact
      ? { name: "四分化·胸/臀腿/背/肩", days: 4, note: "你选的日子较密集，AI按上肢→下肢交替排，避免相邻两天练同一区域",
          order: [T.chestTri, T.glutesRear, T.backBi, T.shoulderDay] }
      : { name: "四分化·胸/背/肩/腿", days: 4, note: "胸→背→肩→腿各练各的，每个部位一周两次内恢复充分",
          order: [T.chestTri, T.backBi, T.shoulderDay, T.glutesRear] };
    if (days === 5) return compact
      ? { name: "五分化·胸/臀腿/背/肩/臂", days: 5, note: "五个部位轮流练透，AI按上下肢交替排列帮你错开恢复",
          order: [T.chestTri, T.glutesRear, T.backBi, T.shoulderDay, T.armsCore] }
      : { name: "五分化·胸/背/肩/腿/臂", days: 5, note: "每个部位单独练透，一周一次高质量刺激+充分恢复",
          order: [T.chestTri, T.backBi, T.shoulderDay, T.glutesRear, T.armsCore] };
    return { name: "六练混合循环", days: 6, note: "胸→臀腿→背肩→背→肩→臂核心，上下交替着练，恢复能力强的进阶方案",
      order: [T.chestTri, T.glutesRear, T.backDelts, T.backBi, T.shoulderDay, T.armsCore] };
  }

  /* 时间段偏好 → 具体提醒时间 */
  const TIME_PREFS = {
    morning: { name: "早晨 06:00-09:00", time: "07:00" },
    midday:  { name: "中午 11:00-14:00", time: "12:30" },
    evening: { name: "傍晚 17:00-19:30", time: "18:30" },
    night:   { name: "晚上 19:30-22:00", time: "20:30" }
  };
  const PERIOD_DEFAULT_TIME = { morning: "07:30", midday: "12:30", evening: "18:00", night: "20:00" };
  /* 每天（周一=0…周日=6）的实际训练时间：优先精确时间，其次该天选择的时段 */
  function dayTrainTime(p, wd) {
    const dt = p.dayTimes || {};
    const ex = (p.dayTimesExact || {})[wd];
    if (ex) return ex;
    const pref = dt[wd] || p.timePref || "evening";
    return PERIOD_DEFAULT_TIME[pref] || "18:00";
  }
  function dayPrefName(p, wd) {
    const pref = (p.dayTimes || {})[wd] || p.timePref || "evening";
    return TIME_PREFS[pref].name;
  }

  /* ============================================================
     生理期周期引擎
     cycles: { enabled, cycleLen, periodLen, starts: ["YYYY-MM-DD"...] }
     ============================================================ */
  const PHASE_META = {
    menstrual: { name: "月经期", icon: "🌸", color: "var(--pink)" },
    follicular: { name: "卵泡期", icon: "🌱", color: "var(--green)" },
    ovulation: { name: "排卵期", icon: "⚡", color: "var(--purple)" },
    luteal: { name: "黄体期", icon: "🌙", color: "var(--blue)" }
  };
  function dKey(d) { const p = n => (n < 10 ? "0" + n : "" + n); return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()); }
  function keyToDate(k) { const a = k.split("-").map(Number); return new Date(a[0], a[1] - 1, a[2]); }
  function addDays(k, n) { const d = keyToDate(k); d.setDate(d.getDate() + n); return dKey(d); }
  function diffDays(a, b) { return Math.round((keyToDate(a) - keyToDate(b)) / 86400000); }

  /* 估算周期长度：最近几次记录的平均间隔（21-35天内） */
  function estCycleLen(cycles) {
    const s = (cycles.starts || []).slice().sort();
    if (s.length < 2) return cycles.cycleLen || 28;
    const gaps = [];
    for (let i = 1; i < Math.min(s.length, 7); i++) {
      const g = diffDays(s[i], s[i - 1]);
      if (g >= 18 && g <= 45) gaps.push(g);
    }
    if (!gaps.length) return cycles.cycleLen || 28;
    return Math.round(Math.max(21, Math.min(35, gaps.reduce((a, b) => a + b) / gaps.length)));
  }
  /* 指定日期的周期信息（dateKey 省略=今天） */
  function cycleInfo(S, dateKey) {
    const cy = S.cycles;
    if (!cy || !cy.enabled || !(cy.starts || []).length) return null;
    const key = dateKey || dKey(new Date());
    const starts = cy.starts.slice().sort();
    const last = starts[starts.length - 1];
    if (key < last) { /* 历史日期：找 <= key 的最近一次 */
      let prev = null;
      starts.forEach(s => { if (s <= key) prev = s; });
      if (!prev) return null;
      return cycleAt(S, key, prev);
    }
    return cycleAt(S, key, last);
  }
  function cycleAt(S, key, anchor) {
    const cy = S.cycles;
    const len = estCycleLen(cy);
    const plen = cy.periodLen || 5;
    const day = diffDays(key, anchor) + 1; /* 距最近一次开始过了几天+1 */
    const anchorDay = ((day - 1) % len + len) % len + 1; /* 折叠进一个周期内：第几天 */
    let phase;
    if (anchorDay <= plen) phase = "menstrual";
    else if (anchorDay <= 13) phase = "follicular";
    else if (anchorDay <= 16) phase = "ovulation";
    else phase = "luteal";
    return {
      phase, dayOfCycle: anchorDay, cycleLen: len, periodLen: plen,
      isPeriod: phase === "menstrual",
      periodDay: phase === "menstrual" ? anchorDay : 0,
      isPredictedPeriod: key > lastStartDate(S) && phase === "menstrual",
      nextStart: addDays(key, len - anchorDay + 1)
    };
  }
  function lastStartDate(S) { const s = (S.cycles.starts || []).slice().sort(); return s[s.length - 1] || null; }
  /* 某月的周期标记（供日历）：返回 { dateKey: {period|predicted|phase} } */
  function cycleMonthMarks(S, y, m) {
    const cy = S.cycles;
    const out = {};
    if (!cy || !cy.enabled || !(cy.starts || []).length) return out;
    const days = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= days; d++) {
      const key = dKey(new Date(y, m, d));
      const info = cycleInfo(S, key);
      if (!info) continue;
      const logged = (cy.starts || []).some(s => key >= s && diffDays(key, s) < (cy.periodLen || 5));
      if (info.isPeriod) out[key] = logged ? "period" : "predicted";
      else if (info.phase === "ovulation") out[key] = "fertile";
    }
    return out;
  }
  /* 各阶段训练/饮食建议 */
  const PHASE_ADVICE = {
    menstrual: { train: "舒缓模式：散步、瑜伽拉伸、上肢轻力量都可以，避免倒置、腹部挤压和高强度跳跃。前1-2天量多就安心休息，第3天起视状态逐渐恢复。", diet: "多补充含铁食物（瘦红肉、猪肝、鸭血、菠菜）+ 维C促吸收；温水代替冷饮，少吃过咸过甜，缓解痛经和水肿。" },
    follicular: { train: "能量回升窗口期！适合逐步加重量、挑战新动作，力量训练收益最高的阶段，别浪费。", diet: "蛋白质按目标吃足，训练日碳水可以适当多一点，恢复更快。" },
    ovulation: { train: "状态巅峰期，力量和耐觉都在线，适合冲击大重量/PR，但雌激素高会让韧带略松弛，动作控制要稳。", diet: "正常均衡饮食即可，注意别因为状态好就乱吃。" },
    luteal: { train: "可能出现疲劳、水肿、PMS，强度可以比平时低10-20%，多安排拉伸和中等有氧；睡眠优先。", diet: "想吃甜食是正常的，用水果、黑巧、坚果替代奶茶蛋糕；适当补镁（坚果、深绿蔬菜）和维生素B6缓解情绪波动。" }
  };

  /* ---------- 有氧课（减脂用） ---------- */
  const CARDIO_POOL = [
    { courseId: "w3_hiit20", note: "HIIT运动后持续燃脂" },
    { courseId: "w5_run30", note: "匀速有氧，燃脂心率区间" },
    { courseId: "w4_tabata", note: "Tabata冲刺，8分钟高效" },
    { courseId: "w7_abs", note: "核心强化+燃脂" }
  ];
  const ACTIVE_COURSE = "w16_recovery";
  const STRETCH_COURSE = "w15_stretch_night";

  function calcBMR(p) {
    const base = 10 * p.weight + 6.25 * p.height - 5 * p.age;
    return Math.round(p.sex === "male" ? base + 5 : base - 161);
  }
  function calcTDEE(p) {
    const factors = { low: 1.2, mid: 1.375, high: 1.55, top: 1.725 };
    return Math.round(calcBMR(p) * (factors[p.activity] || 1.375));
  }
  function bmi(p) { return +(p.weight / Math.pow(p.height / 100, 2)).toFixed(1); }
  function r50(x) { return Math.round(x / 50) * 50; }

  /* ---------- 生成周课表 ---------- */
  const MEAL_SPLIT = {
    fatloss: [{ name: "早餐", pct: 0.30, time: "07:30" }, { name: "午餐", pct: 0.40, time: "12:00" }, { name: "加餐", pct: 0.05, time: "15:30" }, { name: "晚餐", pct: 0.25, time: "18:30" }],
    muscle:  [{ name: "早餐", pct: 0.25, time: "07:30" }, { name: "午餐", pct: 0.35, time: "12:00" }, { name: "加餐(练后)", pct: 0.10, time: "15:30" }, { name: "晚餐", pct: 0.30, time: "18:30" }],
    keep:    [{ name: "早餐", pct: 0.30, time: "07:30" }, { name: "午餐", pct: 0.40, time: "12:00" }, { name: "加餐", pct: 0.05, time: "15:30" }, { name: "晚餐", pct: 0.25, time: "18:30" }]
  };

  function buildPlan(p) {
    const bmr = calcBMR(p);
    const tdee = calcTDEE(p);
    const goal = p.goal;
    let intake, proteinPerKg;
    if (goal === "fatloss") {
      intake = Math.max(r50(tdee - 400), Math.round(bmr * 1.05), p.sex === "male" ? 1500 : 1200);
      proteinPerKg = 2.0;
    } else if (goal === "muscle") {
      intake = r50(tdee + 350);
      proteinPerKg = 1.8;
    } else {
      intake = r50(tdee);
      proteinPerKg = 1.5;
    }
    const protein = Math.round(proteinPerKg * p.weight);
    const fat = Math.round(0.8 * p.weight);
    const carb = Math.max(50, Math.round((intake - protein * 4 - fat * 9) / 4));
    const water = Math.min(4500, Math.max(1500, r50(p.weight * 50)));
    const steps = goal === "fatloss" ? 10000 : 8000;

    const equip = p.equip || "dumbbell";
    let days = [];
    if (Array.isArray(p.days)) days = p.days.map(Number);
    else if (typeof p.days === "string" && p.days.trim()) days = p.days.split(",").map(s => parseInt(s, 10));
    days = [...new Set(days)].filter(n => n >= 0 && n <= 6).sort((a, b) => a - b);
    if (days.length < 2) days = [0, 2, 4];
    if (days.length > 6) days = days.slice(0, 6);
    const daysWanted = days.length;
    /* 选的日子是否相邻（含首尾跨周相邻）→ 决定是否用穿插顺序 */
    const compact = days.some((d, i) => {
      const next = i < days.length - 1 ? days[i + 1] : days[0] + 7;
      return next - d === 1;
    });
    const split = splitFor(daysWanted, compact);
    const tp = TIME_PREFS[p.timePref] || TIME_PREFS.evening;
    const trainTime = tp.time;

    const week = [];
    for (let i = 0; i < 7; i++) week.push({ wd: i, type: "rest", focus: "rest", title: "休息", exercises: null, courseId: null, time: null, note: "完全休息，睡好觉" });

    const T2FOCUS = [[T.chestTri, "chestTri"], [T.backDelts, "backDelts"], [T.glutesRear, "glutesRear"], [T.backBi, "backBi"], [T.shoulderDay, "shoulderDay"], [T.armsCore, "armsCore"], [T.fullA, "full"], [T.fullB, "full"]];
    split.order.forEach((t, i) => {
      const wd = days[i];
      const moves = t.moves[equip] || t.moves.dumbbell;
      const focus = (T2FOCUS.find(p2 => p2[0] === t) || [null, "full"])[1];
      week[wd] = {
        wd, type: "strength", focus,
        title: t.title,
        goal: t.goal, warmup: t.warmup, stretches: t.stretches,
        exercises: moves, courseId: null, time: dayTrainTime(p, wd),
        note: t.goal + " · 每动作" + moves[0].sets + "组，组间休" + moves[0].rest + "秒"
      };
    });

    const freeWds = [0, 1, 2, 3, 4, 5, 6].filter(i => !days.includes(i));
    let ci = 0;
    freeWds.forEach((wd, idx) => {
      const isLast = idx === freeWds.length - 1;
      if (goal === "fatloss" && !isLast && ci < CARDIO_POOL.length) {
        const c = CARDIO_POOL[ci % CARDIO_POOL.length]; ci++;
        week[wd] = { wd, type: "cardio", focus: "cardio", title: window.findCourse(c.courseId).name, exercises: null, courseId: c.courseId, time: dayTrainTime(p, wd), note: c.note + "（可换自己喜欢有氧）" };
      } else if (goal === "keep" && idx % 2 === 1 && !isLast && ci < CARDIO_POOL.length) {
        const c = CARDIO_POOL[ci % CARDIO_POOL.length]; ci++;
        week[wd] = { wd, type: "cardio", focus: "cardio", title: window.findCourse(c.courseId).name, exercises: null, courseId: c.courseId, time: dayTrainTime(p, wd), note: c.note };
      } else {
        week[wd] = { wd, type: "active", focus: "active", title: "主动恢复", exercises: null, courseId: isLast ? null : STRETCH_COURSE, time: null, note: isLast ? "完全休息日：睡好觉，体重才会变化" : "拉伸放松/散步30分钟，帮助肌肉恢复" };
      }
    });

    const meals = MEAL_SPLIT[goal].map(m => ({
      name: m.name, time: m.time, pct: m.pct, kcal: r50(intake * m.pct)
    }));

    const times = ["07:00", "09:30", "11:00", "13:30", "15:00", "16:30", "19:00", "20:30"];
    const base = Math.floor(water / 8 / 50) * 50;
    let slots = times.map((t, i) => ({ time: t, ml: i === 0 ? 300 : base }));
    let sum = slots.reduce((s, x) => s + x.ml, 0);
    let i2 = 1;
    while (sum < water && i2 < 7) { slots[i2].ml += 50; sum += 50; i2++; }

    return {
      planVer: 5,
      goal, level: p.level === "adv" ? "adv" : "beginner",
      daysPerWeek: daysWanted, days, timePref: p.timePref || "evening", equip,
      splitName: split.name,
      splitNote: split.note + "。训练安排在你选的日子：" + days.map(d => "周" + "一二三四五六日"[d] + " " + dayTrainTime(p, d)).join("、"),
      bmr, tdee, intake, protein, fat, carb, proteinPerKg,
      water, steps, week, meals, waterSlots: slots,
      trainTime, sleepTime: "22:30", createdAt: Date.now()
    };
  }

  /* ---------- 当天动作清单（含起始重量） ---------- */
  function dayPrescriptions(day, profile) {
    if (!day.exercises) return [];
    return day.exercises.map(b => {
      const ex = window.findEx(b.ex);
      return {
        ex: b.ex, name: ex ? ex.name : b.ex,
        sets: b.sets, reps: b.reps, rest: b.rest,
        weight: weightHint(b.ex, profile.sex, profile.equip || "dumbbell"),
        target: ex ? ex.target.join("·") : ""
      };
    });
  }

  const PROGRESS_RULE = "渐进超负荷：同一动作连续两次训练都能标准完成「组数×次数上限」且留有余力 → 下次加重：上肢动作每只+2.5kg，下肢/复合动作+5kg。第一周先用轻重量把动作学标准，姿势优先于重量。";

  /* ---------- 今日任务与完成度 ---------- */
  function kcalBand(plan) {
    if (plan.goal === "fatloss") return [Math.round(plan.intake * 0.85), Math.round(plan.intake * 1.05)];
    if (plan.goal === "muscle") return [Math.round(plan.intake * 0.95), Math.round(plan.intake * 1.10)];
    return [Math.round(plan.intake * 0.90), Math.round(plan.intake * 1.10)];
  }

  function todaySummary(log, plan) {
    const water = (log.water || []).reduce((s, x) => s + x.ml, 0);
    const diet = (log.diet || []).reduce((s, x) => s + x.kcal, 0);
    const p = (log.diet || []).reduce((s, x) => s + (x.p || 0), 0);
    const f = (log.diet || []).reduce((s, x) => s + (x.f || 0), 0);
    const c = (log.diet || []).reduce((s, x) => s + (x.c || 0), 0);
    const workout = (log.workouts || []).reduce((s, x) => s + (x.min || 0), 0);
    const workoutKcal = (log.workouts || []).reduce((s, x) => s + (x.kcal || 0), 0);
    return { water, diet, p: Math.round(p), f: Math.round(f), c: Math.round(c), workout, workoutKcal };
  }

  function tasksFor(log, plan, todayWd, cyc) {
    const s = todaySummary(log, plan);
    const dayPlan = plan.week[todayWd] || plan.week[1];
    const band = kcalBand(plan);
    const tasks = [];
    const hasTrain = dayPlan.type === "strength" || dayPlan.type === "cardio";
    const done = (log.workouts || []).length > 0;
    if (cyc && cyc.isPeriod && cyc.periodDay <= 3 && hasTrain) {
      /* 生理期前3天：自动切换为舒缓任务 */
      tasks.push({ key: "train", icon: "🌸", label: "生理期舒缓：" + PHASE_META.menstrual.name + "第" + cyc.periodDay + "天", detail: "拉伸/散步/轻力量任选，状态不好休息也是打卡", done, gentle: true });
    } else if (hasTrain) {
      tasks.push({ key: "train", icon: "🏃", label: "完成训练：" + dayPlan.title, detail: (dayPlan.time || "") + " · " + (dayPlan.type === "strength" ? dayPlan.exercises.length + "个动作" : "有氧日"), done });
    } else {
      tasks.push({ key: "recover", icon: dayPlan.type === "active" ? "🧘" : "🛌", label: dayPlan.type === "active" ? "主动恢复：拉伸/散步30分钟" : "休息日：好好休息", detail: "恢复也是训练的一部分", done });
    }
    tasks.push({ key: "water", icon: "💧", label: "饮水 " + plan.water + "ml" + (cyc && cyc.isPeriod ? "（建议温热）" : ""), detail: s.water + "/" + plan.water + "ml", done: s.water >= plan.water });
    tasks.push({ key: "kcal", icon: "🍎", label: "热量控制在 " + band[0] + "-" + band[1] + " kcal", detail: "已记录 " + s.diet + " kcal", done: s.diet > 0 && s.diet >= band[0] && s.diet <= band[1] });
    tasks.push({ key: "protein", icon: "🍗", label: "蛋白质达标 " + plan.protein + "g", detail: "已摄入 " + s.p + "g", done: s.p >= plan.protein * 0.9 });
    return { tasks, summary: s, dayPlan, band };
  }

  /* ---------- 打卡状态 ---------- */
  function dayStatus(log, plan) {
    if (!log || (!log.water || !log.water.length) && (!log.diet || !log.diet.length) && (!log.workouts || !log.workouts.length)) return { fire: false, water: false, diet: false, run: false, full: false };
    const s = todaySummary(log, plan);
    const band = kcalBand(plan);
    const fire = (log.workouts || []).length > 0;
    const water = s.water >= plan.water * 0.99;
    const diet = s.diet > 0 && s.diet >= band[0] && s.diet <= band[1];
    return { fire, water, diet, run: fire, full: fire && water && diet };
  }

  function computeStreak(logs, plan) {
    const keys = Object.keys(logs).sort().reverse();
    let streak = 0;
    for (let i = 0; i < keys.length; i++) {
      const st = dayStatus(logs[keys[i]], plan);
      if (st.full) streak++;
      else if (i === 0) continue;
      else break;
    }
    return streak;
  }
  function fullRunAt(logs, plan, key) {
    let n = 0;
    let d = new Date(key + "T00:00:00");
    for (;;) {
      const p2 = n => (n < 10 ? "0" + n : "" + n);
      const k = d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate());
      const log = logs[k];
      if (log && dayStatus(log, plan).full) { n++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return n;
  }

  /* ---------- AI 教练：每日分析 ---------- */
  function coachDaily(log, plan, profile, streak, cyc) {
    const s = todaySummary(log, plan);
    const tips = [];
    const hour = new Date().getHours();
    if (cyc && cyc.isPeriod) {
      const day = cyc.periodDay;
      tips.push({ icon: "🌸", text: "生理期第" + day + "天，身体正在排毒修复。" + (day <= 2 ? "量多的前两天安心休息或散步就好，" : "状态回升可以练上肢/拉伸，") + PHASE_ADVICE.menstrual.diet });
    } else if (cyc && cyc.phase === "luteal" && cyc.dayOfCycle >= cyc.cycleLen - 4) {
      tips.push({ icon: "🌙", text: "黄体后期，可能会水肿、想吃甜食——这是正常的PMS。训练强度降一档，想吃甜的用水果/黑巧替代，" + PHASE_ADVICE.luteal.diet });
    } else if (cyc && cyc.phase === "follicular" && cyc.dayOfCycle >= 6) {
      tips.push({ icon: "🌱", text: "卵泡期是增肌黄金窗口！这周训练可以大胆加重量（上肢+2.5kg/下肢+5kg），身体恢复和合成能力都在线。" });
    }
    if (s.p > 0 && s.p < plan.protein * 0.8) {
      const need = Math.round(plan.protein - s.p);
      tips.push({ icon: "🍗", text: "今天蛋白质还差约" + need + "g，可以加：鸡蛋1个(7g)、牛奶250ml(8g)、鸡胸肉100g(31g)或蛋白粉1勺(24g)。" });
    }
    if (hour >= 15 && s.water < plan.water * 0.5) {
      tips.push({ icon: "💧", text: "已经" + hour + "点啦，水只喝了" + s.water + "ml（目标" + plan.water + "ml）。现在来一大杯250ml，追上进度。" + (cyc && cyc.isPeriod ? "生理期建议喝温水哦～" : "") });
    }
    const band = kcalBand(plan);
    if (s.diet > band[1]) {
      tips.push({ icon: "⚠️", text: "热量已超目标约" + (s.diet - band[1]) + "kcal。今晚就到这吧，想吃东西先喝水+吃点黄瓜/圣女果。" });
    } else if (s.diet > 0 && s.diet < plan.bmr * 0.8 && hour >= 18) {
      tips.push({ icon: "⚠️", text: "今天吃得太少了(" + s.diet + "kcal)。吃太少会掉肌肉、降代谢，减脂反而更难，晚餐好好吃。" });
    }
    if (streak && streak.trainStreak >= 4 && !(cyc && cyc.isPeriod)) {
      tips.push({ icon: "🛌", text: "已连续训练" + streak.trainStreak + "天，安排一次拉伸恢复日吧——肌肉在休息时生长。" });
    }
    if (!tips.length) {
      const dayPlan = plan.week[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
      tips.push({ icon: "✨", text: dayPlan.type === "strength" ? "今天" + dayPlan.title + "（" + (dayPlan.time || "") + "），目标：" + dayPlan.goal + "。" : dayPlan.type === "cardio" ? "今天有氧日：" + dayPlan.title + "。" : "今天" + dayPlan.title + "，恢复也是训练的一部分。" });
    }
    return tips.slice(0, 3);
  }

  /* ---------- AI 教练：问答 ---------- */
  function coachAnswer(q, ctx) {
    const { log, plan, profile, streak, logs, cyc } = ctx;
    const s = todaySummary(log, plan);
    const w = profile.weight;
    const has = (...kws) => kws.some(k => q.includes(k));

    if (has("你是谁", "介绍", "帮助", "你好", "hi", "hello")) {
      return "我是 FitDay 的 AI 教练🔥 你的档案：\n· 目标：" + GOALS[plan.goal].name + " · " + plan.splitName + "（每周" + plan.daysPerWeek + "练·" + (EQUIPS[plan.equip] || EQUIPS.dumbbell).name + "）\n· 每日：" + plan.intake + "kcal / 蛋白" + plan.protein + "g / 水" + plan.water + "ml\n可以问我：今天练什么？今天吃什么？用多重？为什么不掉秤？生理期怎么练？";
    }
    if (has("生理期", "经期", "大姨妈", "月经", "姨妈")) {
      if (!cyc) return "在「我的 → 生理期管理」里开启周期跟踪并记录最近一次经期开始日期，我就能帮你自动调整训练和饮食建议啦。前1-2天建议休息或散步，第3天起可以做上肢轻力量和拉伸，避免倒置、腹部挤压和高强度跳跃。";
      const pm = PHASE_META[cyc.phase];
      let ans = "你现在是" + pm.icon + pm.name + "第" + cyc.dayOfCycle + "天（周期约" + cyc.cycleLen + "天）。\n";
      ans += "🏋 " + PHASE_ADVICE[cyc.phase].train + "\n";
      ans += "🍎 " + PHASE_ADVICE[cyc.phase].diet;
      if (cyc.phase !== "menstrual") ans += "\n📅 下次经期预计：" + cyc.nextStart + "，快到的那几天我会自动帮你切换成舒缓训练。";
      return ans;
    }
    if (has("吃", "餐", "饭", "食物", "热量", "饿")) {
      const remain = plan.intake - s.diet;
      if (!s.diet) {
        return "今天还没记录饮食。按计划你今天要吃约 " + plan.intake + "kcal：\n· 早餐" + plan.meals[0].kcal + "kcal(如：燕麦40g+鸡蛋1个+牛奶250ml)\n· 午餐" + plan.meals[1].kcal + "kcal(如：米饭1碗+鸡胸肉150g+西兰花)\n· 晚餐" + plan.meals[3].kcal + "kcal(如：红薯+虾仁炒蛋)\n去「饮食」页搜索记录哦。";
      }
      let ans = "今天已吃 " + s.diet + "kcal，还剩 " + Math.max(0, remain) + "kcal 额度。";
      if (s.p < plan.protein) ans += "\n蛋白质 " + s.p + "/" + plan.protein + "g，还差 " + (plan.protein - s.p) + "g —— 推荐加一份鸡胸肉100g(31g蛋白)或2个鸡蛋+1杯牛奶(22g蛋白)。";
      if (remain < 0) ans += "\n今天超了 " + (-remain) + "kcal，晚上就别加餐了，多喝水早睡觉。";
      else ans += "\n剩余额度安排：主食(米饭/红薯) + 蛋白(肉/蛋/奶) + 大量蔬菜。";
      return ans;
    }
    if (has("练", "训练", "运动", "分化", "课程")) {
      const wd = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
      const d = plan.week[wd];
      let ans = "你的分化：" + plan.splitName + "（每周" + plan.daysPerWeek + "练）。\n";
      if (d.type === "strength") {
        ans += "今天【" + d.title + "】" + (d.time || "") + "，目标：" + d.goal + "\n" + d.exercises.map((b, i) => (i + 1) + ". " + (window.findEx(b.ex) || {}).name + " " + b.sets + "×" + b.reps).join("\n") + "\n热身：" + d.warmup + "\n去「计划」页点今天格子就能开始。";
      } else if (d.type === "cardio") {
        ans += "今天是【" + d.title + "】有氧日" + (d.time || "") + "，" + d.note;
      } else {
        ans += "今天" + d.title + "：" + d.note;
      }
      if (streak && streak.trainStreak >= 5) ans += "\n注意：已连续训练" + streak.trainStreak + "天，明天建议恢复日。";
      return ans;
    }
    if (has("重", "重量", "几公斤", "kg")) {
      return "起始重量原则：用「能标准完成15次」的重量找感觉，宁轻勿重。\n" + (plan.equip === "gym" ? "健身房版：器械插销从轻开始，杠铃从空杆学动作，每周+2.5kg很正常。" : "哑铃版：大肌群(深蹲/硬拉/卧推)女生10-15kg、男生15-25kg起；小肌群(弯举/侧平举)女生2-6kg、男生4-10kg起。\n") + PROGRESS_RULE;
    }
    if (has("水", "喝")) {
      const pct = Math.round(s.water / plan.water * 100);
      return "今天已喝 " + s.water + "/" + plan.water + "ml（" + pct + "%）。" + (pct >= 100 ? "达成✓ 太棒了！" : "饮水时段：" + plan.waterSlots.map(x => x.time).join("、") + "，每次" + plan.waterSlots[1].ml + "ml 左右。");
    }
    if (has("不掉", "平台", "体重", "称", "瘦", "掉秤")) {
      const hist = (logs && weightHistory(logs)) || [];
      if (hist.length >= 3) {
        const first = hist[0], last = hist[hist.length - 1];
        const diff = +(last.w - first.w).toFixed(1);
        let ans = "最近记录体重：" + first.w + "kg → " + last.w + "kg（" + (diff <= 0 ? diff : "+" + diff) + "kg）。";
        if (plan.goal === "fatloss") {
          if (diff >= -0.3) ans += "变化不大先自查：①热量真的在缺口内吗(记录诚实吗)②蛋白质够吗③睡够7小时吗。连续2周不动可再减100-150kcal或加一次有氧。";
          else ans += "保持节奏，健康减脂速度是每周0.5-1kg，慢就是快。";
        } else {
          ans += diff > 0 ? "稳步上升，慢增肌(每月+0.5-1kg)避免长太多脂肪。" : "增肌期体重应缓涨，检查是否吃够 " + plan.intake + "kcal。";
        }
        return ans;
      }
      return "先去「报告」页记录几次体重(隔天早上空腹称)，积累3次以上我就能帮你分析趋势啦。";
    }
    if (has("增肌", "长肌肉", "肌肉")) {
      return "增肌三要素，你的计划已配好：\n① 热量盈余：每天 " + plan.intake + "kcal\n② 蛋白质：" + plan.protein + "g/天(" + plan.proteinPerKg + "g/kg)\n③ " + plan.splitName + "，每次试着比上次多1-2次或加2.5kg\n" + PROGRESS_RULE + "\n睡眠7.5h+，肌肉是睡觉时长的。";
    }
    if (has("减脂", "脂肪", "变瘦")) {
      return "减脂核心：持续热量缺口+保住肌肉：\n① 每天缺口 " + (plan.tdee - plan.intake) + "kcal，一周约减0.4-0.5kg纯脂肪\n② 蛋白质 " + plan.protein + "g/天防掉肌肉\n③ 力量(" + plan.daysPerWeek + "练" + plan.splitName + ")已排好，非力量日安排了有氧\n④ 每周掉超过1kg就开始掉肌肉掉代谢，看周平均别看单日。";
    }
    if (has("睡")) {
      return "睡眠是隐形训练量：睡不够会升高饥饿素(更想吃)、降低生长激素(更难恢复)。建议23:00前入睡、7-8小时。睡前1小时放下手机，做一组「睡前拉伸放松」效果更好🌙";
    }
    if (has("酸", "疼", "拉伸", "恢复")) {
      return "训练后24-72小时延迟性酸痛(DOMS)是正常的：①轻度活动(散步/拉伸)比躺着恢复更快 ②蛋白质和睡眠到位 ③酸痛严重的部位暂停训练。关节出现锐痛(非肌肉酸)请就医。";
    }
    if (has("计划", "安排", "课表", "目标")) {
      const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
      let ans = "你的" + GOALS[plan.goal].name + "计划（" + plan.intake + "kcal/天，蛋白" + plan.protein + "g，水" + plan.water + "ml）\n分化：" + plan.splitName + "：\n";
      plan.week.forEach((d, i) => { ans += days[i] + "：" + d.title + (d.type === "strength" ? " " + d.exercises.length + "动作" : "") + "\n"; });
      return ans;
    }
    const tips = coachDaily(log, plan, profile, streak);
    return tips.map(t => t.icon + " " + t.text).join("\n");
  }

  function weightHistory(logs) {
    const arr = [];
    Object.keys(logs || {}).forEach(k => { if (logs[k].weight) arr.push({ date: k, w: logs[k].weight }); });
    arr.sort((a, b) => a.date < b.date ? -1 : 1);
    return arr;
  }

  return {
    GOALS, EQUIPS, FOCUS_META, TIME_PREFS, PHASE_META, PHASE_ADVICE,
    calcBMR, calcTDEE, bmi, buildPlan, splitFor, dayPrescriptions, PROGRESS_RULE,
    dayTrainTime, dayPrefName, cycleInfo, cycleMonthMarks, estCycleLen, dKey, addDays,
    kcalBand, todaySummary, tasksFor, dayStatus, computeStreak, fullRunAt,
    coachDaily, coachAnswer, weightHistory
  };
})();
