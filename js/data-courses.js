/* ============================================================
   FitDay 燃动日记 —— 训练课程库
   type:
     circuit  计时循环课：warmup[{ex,sec}] + rounds×main[{ex,work,rest}] + cooldown
     strength 组次力量课：blocks[{ex,sets,reps,rest}]，按组打卡+组间休息计时
     guide    节奏引导课：segments[{name,ex,min}]，按段秒表跟练
   课程消耗按用户体重由 MET 动态计算
   ============================================================ */

window.COURSE_CATS = [
  { id: "beginner", name: "新手入门", icon: "🌱" },
  { id: "fatloss",  name: "减脂燃脂", icon: "🔥" },
  { id: "shape",    name: "塑形专项", icon: "✨" },
  { id: "muscle",   name: "增肌力量", icon: "🏋️" },
  { id: "cardio",   name: "有氧心肺", icon: "🏃" },
  { id: "recovery", name: "拉伸恢复", icon: "🧘" },
  { id: "gentle",   name: "生理期舒缓", icon: "🌸" }
];

window.COURSES = [
  /* ============ 新手入门 ============ */
  { id:"w1_warmup", name:"零基础全身唤醒", cat:"beginner", level:1, type:"circuit",
    desc:"第一次运动就选它：低强度全身循环，学会基础动作模式，唤醒身体。",
    warmup:[{ex:"jumping_jack", sec:60}],
    rounds:2,
    main:[{ex:"squat", work:40, rest:20},{ex:"kneel_pushup", work:40, rest:20},{ex:"glute_bridge", work:40, rest:20},{ex:"plank", work:40, rest:20},{ex:"crunch", work:40, rest:20},{ex:"high_knees", work:30, rest:30}],
    cooldown:[{ex:"hamstring_stretch", sec:60},{ex:"piriformis", sec:60}] },

  { id:"w2_fullbody", name:"基础力量·全身", cat:"beginner", level:1, type:"circuit",
    desc:"徒手就能练全身：蹲、推、髋、核心全覆盖，每周2-3次打好力量地基。",
    warmup:[{ex:"jumping_jack", sec:60},{ex:"high_knees", sec:60}],
    rounds:2,
    main:[{ex:"squat", work:45, rest:20},{ex:"lunge", work:45, rest:20},{ex:"incline_pushup", work:45, rest:20},{ex:"glute_bridge", work:45, rest:20},{ex:"plank", work:40, rest:20},{ex:"superman", work:40, rest:20}],
    cooldown:[{ex:"quad_stretch", sec:45},{ex:"hamstring_stretch", sec:45},{ex:"chest_door", sec:45}] },

  /* ============ 减脂燃脂 ============ */
  { id:"w3_hiit20", name:"HIIT全身燃脂", cat:"fatloss", level:2, type:"circuit",
    desc:"20分钟高强度间歇，运动后持续燃脂(EPOC效应)，时间不够的首选。",
    warmup:[{ex:"jumping_jack", sec:60},{ex:"high_knees", sec:60}],
    rounds:2,
    main:[{ex:"jumping_jack", work:40, rest:20},{ex:"high_knees", work:40, rest:20},{ex:"mountain_climber", work:40, rest:20},{ex:"squat_jump", work:40, rest:20},{ex:"burpee", work:30, rest:30},{ex:"plank", work:40, rest:20},{ex:"lunge", work:40, rest:20},{ex:"russian_twist", work:40, rest:20}],
    cooldown:[{ex:"quad_stretch", sec:45},{ex:"hamstring_stretch", sec:45}] },

  { id:"w4_tabata", name:"Tabata极速燃脂", cat:"fatloss", level:2, type:"circuit",
    desc:"经典Tabata协议：20秒全力+10秒休息×8动作×2轮，8分钟高效爆汗。",
    warmup:[{ex:"jumping_jack", sec:60},{ex:"high_knees", sec:60}],
    rounds:2,
    main:[{ex:"jumping_jack", work:20, rest:10},{ex:"squat_jump", work:20, rest:10},{ex:"mountain_climber", work:20, rest:10},{ex:"high_knees", work:20, rest:10},{ex:"burpee", work:20, rest:10},{ex:"pushup", work:20, rest:10},{ex:"lunge", work:20, rest:10},{ex:"plank", work:20, rest:10}],
    cooldown:[{ex:"quad_stretch", sec:40},{ex:"calf_stretch", sec:40}] },

  { id:"w5_run30", name:"户外慢跑30分钟", cat:"cardio", level:1, type:"guide",
    desc:"热身-匀速-冷身的完整跑步课，保持能说话的配速，燃脂心率区间最有效。",
    segments:[{name:"热身快走", ex:"brisk_walk", min:5},{name:"匀速慢跑(能说话的配速)", ex:"jogging", min:20},{name:"冷身慢走+拉伸", ex:"brisk_walk", min:5}] },

  /* ============ 塑形专项 ============ */
  { id:"w6_glutes", name:"蜜桃臀腿塑形", cat:"shape", level:1, type:"circuit",
    desc:"臀中肌+臀大肌双管齐下，改善假胯宽，提升臀线。",
    warmup:[{ex:"high_knees", sec:60}],
    rounds:2,
    main:[{ex:"sumo_squat", work:40, rest:20},{ex:"glute_bridge", work:40, rest:20},{ex:"clamshell", work:40, rest:20},{ex:"glute_kick", work:40, rest:20},{ex:"single_glute_bridge", work:40, rest:20},{ex:"wall_sit", work:40, rest:20}],
    cooldown:[{ex:"quad_stretch", sec:45},{ex:"piriformis", sec:45}] },

  { id:"w7_abs", name:"马甲线核心训练", cat:"shape", level:1, type:"circuit",
    desc:"上腹、下腹、侧腹全覆盖，配合饮食控制才能露出腹肌线条。",
    warmup:[{ex:"high_knees", sec:60}],
    rounds:2,
    main:[{ex:"crunch", work:40, rest:20},{ex:"reverse_crunch", work:40, rest:20},{ex:"russian_twist", work:40, rest:20},{ex:"dead_bug", work:40, rest:20},{ex:"leg_raise", work:40, rest:20},{ex:"plank", work:40, rest:20}],
    cooldown:[{ex:"piriformis", sec:60}] },

  { id:"w8_back", name:"拯救圆肩驼背", cat:"shape", level:1, type:"circuit",
    desc:"强化上背与肩后束，打开胸椎，改善久坐圆肩驼背气质。",
    warmup:[{ex:"neck_shoulder", sec:60}],
    rounds:2,
    main:[{ex:"incline_pushup", work:45, rest:20},{ex:"band_row", work:45, rest:20},{ex:"superman", work:45, rest:20},{ex:"db_bent_raise", work:45, rest:20},{ex:"plank", work:45, rest:20},{ex:"chest_door", work:45, rest:20}],
    cooldown:[{ex:"neck_shoulder", sec:45},{ex:"piriformis", sec:45}] },

  /* ============ 增肌力量 ============ */
  { id:"w9_upper_db", name:"哑铃上肢力量", cat:"muscle", level:2, type:"strength",
    desc:"一副哑铃练遍上肢：推、拉、肩、臂一次到位。",
    warmup:[{ex:"jumping_jack", sec:60},{ex:"neck_shoulder", sec:60}],
    blocks:[
      {ex:"db_floor_press", sets:3, reps:"10次", rest:60},
      {ex:"db_row", sets:3, reps:"每侧10次", rest:60},
      {ex:"db_shoulder_press", sets:3, reps:"10次", rest:60},
      {ex:"db_lateral_raise", sets:3, reps:"12次", rest:60},
      {ex:"db_curl", sets:3, reps:"12次", rest:60}
    ],
    cooldown:[{ex:"chest_door", sec:45},{ex:"neck_shoulder", sec:45}] },

  { id:"w10_push", name:"增肌·推(胸肩三头)", cat:"muscle", level:2, type:"strength",
    desc:"推力日：所有\"推\"的动作模式，卧推+推肩+俯卧撑三头一把抓。",
    warmup:[{ex:"jumping_jack", sec:60},{ex:"incline_pushup", sec:45}],
    blocks:[
      {ex:"db_floor_press", sets:4, reps:"8-12次", rest:90},
      {ex:"db_shoulder_press", sets:4, reps:"8-12次", rest:90},
      {ex:"incline_pushup", sets:3, reps:"12-15次", rest:75},
      {ex:"db_lateral_raise", sets:3, reps:"12-15次", rest:60},
      {ex:"dip_bench", sets:3, reps:"10-12次", rest:60}
    ],
    cooldown:[{ex:"chest_door", sec:45},{ex:"neck_shoulder", sec:45}] },

  { id:"w11_pull", name:"增肌·拉(背二头)", cat:"muscle", level:2, type:"strength",
    desc:"拉力日：背阔肌、菱形肌、二头，打造倒三角与挺拔体态。",
    warmup:[{ex:"neck_shoulder", sec:60},{ex:"band_row", sec:45}],
    blocks:[
      {ex:"db_row", sets:4, reps:"每侧8-12次", rest:90},
      {ex:"band_row", sets:3, reps:"12-15次", rest:75},
      {ex:"pullup", sets:3, reps:"6-10次(辅助)", rest:90},
      {ex:"superman", sets:3, reps:"15次", rest:60},
      {ex:"db_curl", sets:3, reps:"10-12次", rest:60}
    ],
    cooldown:[{ex:"piriformis", sec:60},{ex:"neck_shoulder", sec:45}] },

  { id:"w12_legs", name:"增肌·腿(下肢)", cat:"muscle", level:2, type:"strength",
    desc:"腿日：深蹲+硬拉两大王牌，腿臀全面刺激，促全身激素水平。",
    warmup:[{ex:"jumping_jack", sec:60},{ex:"squat", sec:45}],
    blocks:[
      {ex:"db_goblet_squat", sets:4, reps:"8-12次", rest:90},
      {ex:"db_rdl", sets:4, reps:"8-12次", rest:90},
      {ex:"db_lunge", sets:3, reps:"每侧10次", rest:75},
      {ex:"calf_raise", sets:4, reps:"15-20次", rest:60},
      {ex:"glute_bridge", sets:3, reps:"15次", rest:60}
    ],
    cooldown:[{ex:"quad_stretch", sec:45},{ex:"hamstring_stretch", sec:45},{ex:"piriformis", sec:45}] },

  { id:"w13_fa", name:"增肌·全身A", cat:"muscle", level:1, type:"strength",
    desc:"新手增肌首选：蹲推拉基础模式，一周两练交替A/B，进步最快。",
    warmup:[{ex:"jumping_jack", sec:60}],
    blocks:[
      {ex:"db_goblet_squat", sets:3, reps:"10次", rest:75},
      {ex:"db_floor_press", sets:3, reps:"10次", rest:75},
      {ex:"db_row", sets:3, reps:"10次", rest:75},
      {ex:"db_shoulder_press", sets:3, reps:"10次", rest:75},
      {ex:"plank", sets:3, reps:"40秒", rest:45}
    ],
    cooldown:[{ex:"hamstring_stretch", sec:45},{ex:"chest_door", sec:45}] },

  { id:"w14_fb", name:"增肌·全身B", cat:"muscle", level:1, type:"strength",
    desc:"全身B日：髋铰链+俯卧撑+箭步蹲，与A日交替避免瓶颈。",
    warmup:[{ex:"jumping_jack", sec:60}],
    blocks:[
      {ex:"db_rdl", sets:3, reps:"10次", rest:75},
      {ex:"pushup", sets:3, reps:"10-15次", rest:75},
      {ex:"band_row", sets:3, reps:"12次", rest:75},
      {ex:"db_lunge", sets:3, reps:"每侧10次", rest:75},
      {ex:"db_lateral_raise", sets:2, reps:"15次", rest:60},
      {ex:"reverse_crunch", sets:3, reps:"15次", rest:45}
    ],
    cooldown:[{ex:"hamstring_stretch", sec:45},{ex:"quad_stretch", sec:45}] },

  /* ============ 拉伸恢复 ============ */
  { id:"w15_stretch_night", name:"睡前拉伸放松", cat:"recovery", level:1, type:"circuit",
    desc:"10分钟全身拉伸，缓解酸痛、放松神经，睡个好觉。",
    warmup:[],
    rounds:1,
    main:[{ex:"hip_flexor", work:60, rest:5},{ex:"full_body_stretch", work:60, rest:5},{ex:"neck_shoulder", work:30, rest:5},{ex:"chest_door", work:30, rest:5},{ex:"quad_stretch", work:30, rest:5},{ex:"hamstring_stretch", work:30, rest:5},{ex:"piriformis", work:30, rest:5},{ex:"calf_stretch", work:30, rest:5}],
    cooldown:[] },

  { id:"w16_recovery", name:"恢复日·散步放松", cat:"recovery", level:1, type:"guide",
    desc:"主动恢复比躺平恢复更快：低强度散步+全身舒展，促进血液循环。",
    segments:[{name:"轻松散步", ex:"brisk_walk", min:15},{name:"全身舒展跟练", ex:"full_body_stretch", min:8}] },

  /* ============ 生理期舒缓 ============ */
  { id:"w17_period_flow", name:"生理期舒缓·舒展循环", cat:"gentle", level:1, type:"circuit",
    desc:"专为经期设计：无跳跃、无倒置、不挤压腹腔，温和促进循环、缓解痛经与腰酸。量多的前1-2天可以只做热身段。",
    warmup:[{ex:"chest_door", sec:60},{ex:"neck_shoulder", sec:45}],
    rounds:2,
    main:[{ex:"full_body_stretch", work:45, rest:10},{ex:"piriformis", work:40, rest:10},{ex:"hamstring_stretch", work:40, rest:10},{ex:"glute_bridge", work:40, rest:15},{ex:"plank", work:40, rest:10},{ex:"calf_stretch", work:30, rest:10}],
    cooldown:[{ex:"piriformis", sec:60},{ex:"full_body_stretch", sec:60}] },

  { id:"w18_period_upper", name:"生理期·上肢轻力量", cat:"gentle", level:1, type:"circuit",
    desc:"经期第3天后状态回升？用轻重量上肢训练保持节奏：不涉及下肢跳跃和腹部挤压，练完神清气爽。",
    warmup:[{ex:"neck_shoulder", sec:45},{ex:"chest_door", sec:45}],
    rounds:2,
    main:[{ex:"db_curl", work:40, rest:20},{ex:"db_shoulder_press", work:40, rest:20},{ex:"incline_pushup", work:40, rest:15},{ex:"band_row", work:40, rest:20},{ex:"dip_bench", work:40, rest:20},{ex:"neck_shoulder", work:30, rest:10}],
    cooldown:[{ex:"piriformis", sec:45},{ex:"neck_shoulder", sec:45}] }
];

/* ============ 课程统计（分钟/消耗/动作数） ============ */
window.courseStats = function (course, weightKg) {
  const w = weightKg || 60;
  let sec = 0, kcal = 0, exs = [];
  const addWork = (exId, workSec, restSec) => {
    const ex = window.findEx(exId);
    if (!ex) return;
    const activeMin = workSec / 60;
    kcal += window.exKcal(ex, w, activeMin);
    kcal += (restSec || 0) / 60 * (2.0 * 3.5 * w / 200);
    sec += (workSec + (restSec || 0));
    if (exs.indexOf(exId) < 0) exs.push(exId);
  };
  if (course.type === "circuit") {
    (course.warmup || []).forEach(b => addWork(b.ex, b.sec || 60, 0));
    for (let r = 0; r < (course.rounds || 1); r++) course.main.forEach(b => addWork(b.ex, b.work, b.rest));
    (course.cooldown || []).forEach(b => addWork(b.ex, b.sec || 45, 0));
  } else if (course.type === "strength") {
    (course.warmup || []).forEach(b => addWork(b.ex, b.sec || 45, 0));
    course.blocks.forEach(b => {
      const ex = window.findEx(b.ex);
      const perSet = 45;
      for (let i = 0; i < b.sets; i++) {
        if (ex) kcal += window.exKcal(ex, w, perSet / 60);
        kcal += (b.rest || 60) / 60 * (2.0 * 3.5 * w / 200);
        sec += perSet + (b.rest || 60);
      }
      if (ex && exs.indexOf(b.ex) < 0) exs.push(b.ex);
    });
    (course.cooldown || []).forEach(b => addWork(b.ex, b.sec || 45, 0));
  } else if (course.type === "guide") {
    (course.segments || []).forEach(s => {
      const ex = window.findEx(s.ex);
      if (ex) kcal += window.exKcal(ex, w, s.min);
      sec += s.min * 60;
      if (ex && exs.indexOf(s.ex) < 0) exs.push(s.ex);
    });
  }
  return { min: Math.max(1, Math.round(sec / 60)), kcal: Math.round(kcal), exCount: exs.length, sec };
};
window.findCourse = function (id) { return window.COURSES.find(c => c.id === id) || null; };
window.courseBlocksFlat = function (course) {
  /* 返回课程全部动作引用（用于详情页动作列表） */
  const out = [];
  if (course.type === "circuit") {
    (course.warmup || []).forEach(b => out.push(b.ex));
    course.main.forEach(b => out.push(b.ex));
    (course.cooldown || []).forEach(b => out.push(b.ex));
  } else if (course.type === "strength") {
    (course.warmup || []).forEach(b => out.push(b.ex));
    course.blocks.forEach(b => out.push(b.ex));
    (course.cooldown || []).forEach(b => out.push(b.ex));
  } else if (course.type === "guide") {
    (course.segments || []).forEach(s => out.push(s.ex));
  }
  return out.filter((v, i, a) => v && a.indexOf(v) === i && window.findEx(v));
};


