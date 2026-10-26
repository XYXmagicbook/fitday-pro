/* ============================================================
   FitDay —— B站真人教学视频库（BV号均经检索核实）
   bvid: 内嵌播放器直接播放；没有精确视频的动作留空，
         详情页展示「B站搜索」按钮兜底。
   ============================================================ */

/* 真人动作演示图（本地打包 · free-exercise-db MIT授权）
   图片在 icons/eximg/<id>.jpg，详情页/列表/训练页优先使用 */
window.EX_IMG = { band_row:1,barbell_row:1,brisk_walk:1,bulgarian_split:1,burpee:1,calf_raise:1,calf_stretch:1,chest_door:1,clamshell:1,crunch:1,cycling:1,db_bent_raise:1,db_curl:1,db_floor_press:1,db_front_raise:1,db_goblet_squat:1,db_lateral_raise:1,db_lunge:1,db_rdl:1,db_row:1,db_shoulder_press:1,dead_bug:1,dip_bench:1,full_body_stretch:1,glute_bridge:1,glute_kick:1,goat_hyper:1,hamstring_stretch:1,high_knees:1,hip_flexor:1,incline_db_press:1,incline_pushup:1,jogging:1,jumping_jack:1,kneel_pushup:1,lat_pulldown:1,leg_press:1,leg_raise:1,lunge:1,machine_chest_press:1,machine_fly:1,mountain_climber:1,neck_shoulder:1,piriformis:1,plank:1,pullup:1,pushup:1,quad_stretch:1,reverse_crunch:1,reverse_fly_machine:1,rope_skipping:1,russian_twist:1,seated_cable_row:1,side_lying_leg:1,side_plank:1,single_glute_bridge:1,squat:1,squat_jump:1,stairs:1,sumo_squat:1,superman:1,swimming:1,triceps_pushdown:1,wall_sit:1 };
window.exImg = function (exId) {
  return window.EX_IMG && window.EX_IMG[exId] ? "icons/eximg/" + exId + ".jpg" : null;
};

/* 真人GIF动图（本地打包 · 来源 exercises-dataset / © Gym visual — https://gymvisual.com/，180×180分发）
   详情页大图与训练页演示优先使用（会动），列表小图标用上面的静态图 */
window.EX_GIF = { band_row:1,barbell_row:1,brisk_walk:1,bulgarian_split:1,burpee:1,calf_raise:1,calf_stretch:1,chest_door:1,clamshell:1,crunch:1,cycling:1,db_bent_raise:1,db_curl:1,db_floor_press:1,db_front_raise:1,db_goblet_squat:1,db_lateral_raise:1,db_lunge:1,db_rdl:1,db_row:1,db_shoulder_press:1,dead_bug:1,dip_bench:1,full_body_stretch:1,glute_bridge:1,glute_kick:1,goat_hyper:1,hamstring_stretch:1,high_knees:1,hip_flexor:1,incline_db_press:1,incline_pushup:1,jogging:1,jumping_jack:1,kneel_pushup:1,lat_pulldown:1,leg_press:1,leg_raise:1,lunge:1,machine_chest_press:1,machine_fly:1,mountain_climber:1,neck_shoulder:1,piriformis:1,plank:1,pullup:1,pushup:1,quad_stretch:1,reverse_crunch:1,reverse_fly_machine:1,rope_skipping:1,russian_twist:1,seated_cable_row:1,side_lying_leg:1,side_plank:1,single_glute_bridge:1,squat:1,squat_jump:1,stairs:1,sumo_squat:1,superman:1,swimming:1,triceps_pushdown:1,wall_sit:1 };
window.exGif = function (exId) {
  return window.EX_GIF && window.EX_GIF[exId] ? "icons/exgif/" + exId + ".gif" : null;
};

window.EX_VIDEOS = {
  /* 下肢 */
  squat:              { bvid: "BV1fi4y1t7op", title: "如何做一个标准的深蹲？不伤腰" },
  sumo_squat:         { bvid: "BV1fi4y1t7op", title: "标准深蹲教学（相扑蹲同理：膝盖对脚尖）" },
  wall_sit:           { bvid: "BV1fi4y1t7op", title: "标准深蹲教学（靠墙静蹲=静态深蹲）" },
  db_goblet_squat:    { bvid: "BV1xxdfYxEYP", title: "高脚杯深蹲标准动作与常见错误" },
  leg_press:          { bvid: "BV1Ep4y1o7n9", title: "坐姿腿举 LEG PRESS 保姆级教程" },
  lunge:              { bvid: "BV1fK4y1Q7XE", title: "弓步蹲详细讲解：练臀最爱动作" },
  db_lunge:           { bvid: "BV1fK4y1Q7XE", title: "弓步蹲详细讲解（持哑铃同原理）" },
  bulgarian_split:    { bvid: "BV1fK4y1Q7XE", title: "弓步蹲家族：保加利亚分腿蹲同原理" },
  db_rdl:             { bvid: "BV1wg4y1j7dk", title: "罗马尼亚硬拉（看完必会）" },
  glute_bridge:       { bvid: "BV1Zb41147nN", title: "仰卧臀桥：零基础标准教学" },
  single_glute_bridge:{ bvid: "BV1ce6sBBEbU", title: "臀桥训练3个动作（含单腿变式）" },
  clamshell:          { bvid: "BV1gU4y1p7UC", title: "臀肌训练大杀招——蚌式" },
  side_lying_leg:     { bvid: "BV14Z4y1d7Xg", title: "8分钟蚌式臀中肌训练（侧卧抬腿同理）" },
  calf_raise:         null,

  /* 胸/肩/臂 */
  pushup:             { bvid: "BV1zZ4y1j7ip", title: "标准俯卧撑怎么突破+常见错误" },
  kneel_pushup:       { bvid: "BV1p3411t7y8", title: "力量很弱如何解锁俯卧撑？3步从0到20" },
  incline_pushup:     { bvid: "BV1p3411t7y8", title: "俯卧撑进阶路径：上斜→跪姿→标准" },
  db_floor_press:     null,
  incline_db_press:   null,
  machine_chest_press:{ bvid: "BV1PZ4y1V7A7", title: "坐姿推胸器细节讲解（固定器械胸训）" },
  machine_fly:        null,
  db_shoulder_press:  null,
  db_lateral_raise:   { bvid: "BV1ht4y1M7tY", title: "哑铃侧平举：三角肌中束王牌动作" },
  db_front_raise:     { bvid: "BV1ht4y1M7tY", title: "哑铃侧平举教学（前平举同原理）" },
  db_bent_raise:      { bvid: "BV1ht4y1M7tY", title: "哑铃俯身飞鸟（后束）讲解" },
  reverse_fly_machine:null,
  db_curl:            { bvid: "BV14P411g7rP", title: "哑铃弯举详细拆解：你真的练对了吗" },
  dip_bench:          { bvid: "BV1mj5y6gEG9", title: "臂屈伸肱三头肌教学" },
  triceps_pushdown:   null,

  /* 背 */
  db_row:             { bvid: "BV1WV9wYnELR", title: "哑铃划船：练背常见问题与发力技巧" },
  band_row:           { bvid: "BV1N1aTeMEzd", title: "坐姿划船动作细节讲解" },
  seated_cable_row:   { bvid: "BV1N1aTeMEzd", title: "龙门架坐姿划船细节讲解" },
  barbell_row:        { bvid: "BV11f4y1877G", title: "杠铃划船你真的做对了吗" },
  lat_pulldown:       { bvid: "BV16f4y1k7r3", title: "坐姿高位下拉：打造背部倒三角" },
  pullup:             null,
  superman:           null,
  goat_hyper:         null,

  /* 核心 */
  plank:              { bvid: "BV1KE411u7sq", title: "卷腹/平板支撑不腰酸的正确做法" },
  side_plank:         null,
  crunch:             { bvid: "BV1Zf4y1S7V7", title: "腹肌经典动作：卷腹你不知道的秘密" },
  reverse_crunch:     { bvid: "BV1LJ411R7Za", title: "正确的反向卷腹：练小腹+改善骨盆前倾" },
  leg_raise:          null,
  russian_twist:      null,
  dead_bug:           { bvid: "BV19p411f7Se", title: "核心稳定三连：死虫/鸟狗/猫牛" },

  /* HIIT / 有氧 */
  jumping_jack:       { bvid: "BV1TY4y1i7sR", title: "开合跳正确姿势及作用教学" },
  high_knees:         { bvid: "BV1TY4y1i7sR", title: "HIIT动作分解教学（高抬腿同理）" },
  mountain_climber:   { bvid: "BV1TY4y1i7sR", title: "俯身登山跑标准动作教程" },
  burpee:             { bvid: "BV1TW4y1m71H", title: "波比跳10种变式：从初级到高级" },
  squat_jump:         null,
  rope_skipping:      { bvid: "BV1TM4m1m7XY", title: "正确的跳绳姿势是长期跳绳的关键" },
  jogging:            null,
  brisk_walk:         null,
  cycling:            null,
  swimming:           null,
  stairs:             null,

  /* 拉伸 */
  neck_shoulder:      { bvid: "BV1gf4y1p78A", title: "帕梅拉10分钟全身拉伸（跟练）" },
  chest_door:         { bvid: "BV1gf4y1p78A", title: "帕梅拉10分钟全身拉伸（跟练）" },
  quad_stretch:       { bvid: "BV1gf4y1p78A", title: "帕梅拉10分钟全身拉伸（跟练）" },
  hamstring_stretch:  { bvid: "BV1gf4y1p78A", title: "帕梅拉10分钟全身拉伸（跟练）" },
  hip_flexor:         { bvid: "BV1gf4y1p78A", title: "帕梅拉10分钟全身拉伸（跟练）" },
  piriformis:         { bvid: "BV1gf4y1p78A", title: "帕梅拉10分钟全身拉伸（跟练）" },
  calf_stretch:       { bvid: "BV1gf4y1p78A", title: "帕梅拉10分钟全身拉伸（跟练）" },
  full_body_stretch:  { bvid: "BV1gf4y1p78A", title: "帕梅拉10分钟全身拉伸（跟练）" }
};

/* 拿某动作的视频配置（无则 null） */
window.findExVideo = function (exId) {
  return window.EX_VIDEOS[exId] || null;
};
/* B站内嵌播放器地址 */
window.biliEmbed = function (bvid) {
  return "https://player.bilibili.com/player.html?bvid=" + bvid + "&page=1&high_quality=1&danmaku=0&autoplay=0&preload=metadata";
};
/* B站搜索地址 */
window.biliSearch = function (kw) {
  return "https://search.bilibili.com/all?keyword=" + encodeURIComponent(kw);
};
