/* ============================================================
   FitDay —— 动作动图演示系统（离线 SVG 骨架动画）
   原理：单一侧面火柴人骨架（头/躯干/大小臂×2/大小腿×2），
   每个动作 = 一组关键帧角度表，由 JS 生成 CSS @keyframes，
   列表显示静态首帧彩色图标，详情/训练页循环播放。
   ============================================================ */

window.ExAnim = (function () {
  "use strict";

  /* ---------- 骨架几何（viewBox 0 0 200 200，人物朝右） ---------- */
  const G = {
    hip: [100, 118], knee: [100, 150], ankle: [100, 178],
    shoulder: [105, 70], elbow: [105, 98], hand: [105, 124],
    neck: [105, 63], headC: [105, 50], toe: [118, 178]
  };
  const ORIGIN = {
    fig: "100px 100px", torso: "100px 118px",
    arm: "105px 70px", forearm: "105px 98px",
    armB: "105px 70px", forearmB: "105px 98px",
    thigh: "100px 118px", shank: "100px 150px",
    thighB: "100px 118px", shankB: "100px 150px"
  };
  const GROUP_KEY = { fig: "fig", torso: "torso", arm: "arm", fore: "forearm", armB: "armB", foreB: "forearmB", tA: "thigh", sA: "shank", tB: "thighB", sB: "shankB" };

  /* ---------- 通用基础姿态 ---------- */
  const STAND = { fig: "translateY(0px)", torso: 0, arm: 4, fore: 0, armB: 4, foreB: 0, tA: 0, sA: 0, tB: 0, sB: 0 };
  const supine = () => ({ /* 仰卧：躯干放平(头朝右)，屈膝踩地 */
    fig: "translateY(40px)", torso: 88, arm: -50, fore: -20, armB: -50, foreB: -20, tA: -100, sA: 100, tB: -100, sB: 100
  });
  const plankHigh = () => ({ /* 直臂平板：身体斜线，手撑地 */
    fig: "translateY(26px)", torso: 60, arm: -112, fore: -4, armB: -112, foreB: -4, tA: 118, sA: -10, tB: 118, sB: -10
  });
  const kneelPose = () => ({ fig: "translateY(46px)", torso: 78, arm: -104, fore: 0, armB: -104, foreB: 0, tA: -95, sA: 100, tB: -95, sB: 100 });
  const seatedPose = () => ({ fig: "translateY(46px)", torso: 2, arm: 0, fore: 0, armB: 0, foreB: 0, tA: -86, sA: 2, tB: -86, sB: 2 });
  const hingePose = () => ({ fig: "translateY(6px)", torso: 72, arm: -74, fore: -6, armB: -74, foreB: -6, tA: -14, sA: 20, tB: -14, sB: 20 });
  const lungePose = () => ({ fig: "translateY(30px)", torso: 12, arm: 2, fore: 0, armB: 2, foreB: 0, tA: -55, sA: 95, tB: 38, sB: 105 });

  /* ============================================================
     动作模式：frames = { 0:{}, 50:{}, ... }（省略键沿用基础姿态）
     mirror: B 侧肢体复用 A 侧动画(reverse) 实现左右交替
     ============================================================ */
  const PATTERNS = {
    /* ---- 下肢 ---- */
    squat: { base: STAND, dur: 2.2, frames: {
      0: { fig: "translateY(2px)", torso: 6, arm: -68, fore: -8, tA: -8, sA: 12 },
      50: { fig: "translateY(50px)", torso: 30, arm: -80, fore: -6, tA: -74, sA: 118 } } },
    wallsit: { base: STAND, dur: 2.6, frames: {
      0: { fig: "translateY(50px)", torso: 32, arm: -76, fore: -8, tA: -74, sA: 118 },
      50: { fig: "translateY(52px)", torso: 34, arm: -74, fore: -10, tA: -72, sA: 116 } } },
    goblet: { base: STAND, dur: 2.2, prop: "db", frames: {
      0: { fig: "translateY(2px)", torso: 6, arm: -96, fore: -118, tA: -8, sA: 12 },
      50: { fig: "translateY(50px)", torso: 28, arm: -116, fore: -130, tA: -74, sA: 118 } } },
    lunge: { base: STAND, dur: 2.4, frames: {
      0: { fig: "translateY(2px)", torso: 8, arm: 2, fore: 0, tA: -14, sA: 18, tB: 10, sB: 14 },
      50: { fig: "translateY(30px)", torso: 14, arm: 2, fore: 0, tA: -58, sA: 100, tB: 42, sB: 110 } } },
    lungeJump: { base: STAND, dur: 2.2, frames: {
      0: { fig: "translateY(-14px)", torso: 10, arm: -30, fore: -20, tA: -50, sA: 90, tB: 30, sB: 100 },
      40: { fig: "translateY(28px)", torso: 14, arm: 10, fore: 0, tA: -58, sA: 100, tB: 42, sB: 110 },
      100: { fig: "translateY(-14px)", torso: 10, arm: -30, fore: -20, tA: -30, sA: 100, tB: 50, sB: 90 } } },
    bulgarian: { base: STAND, dur: 2.4, prop: "bench", frames: {
      0: { fig: "translateY(14px)", torso: 16, arm: 2, fore: 0, tA: -30, sA: 40, tB: 60, sB: 96 },
      50: { fig: "translateY(38px)", torso: 24, arm: 2, fore: 0, tA: -62, sA: 104, tB: 58, sB: 96 } } },
    hinge: { base: STAND, dur: 2.4, prop: "db", frames: {
      0: { fig: "translateY(2px)", torso: 8, arm: -10, fore: -4, tA: -6, sA: 10 },
      50: { fig: "translateY(8px)", torso: 82, arm: -84, fore: -4, tA: -16, sA: 24 } } },
    goat: { base: kneelPose(), dur: 2.4, frames: {
      0: { torso: 96, arm: -104, tA: -95, sA: 100 },
      50: { torso: 58, arm: -150, tA: -60, sA: 70 } } },
    bridge: { base: supine(), dur: 2.4, frames: {
      0: { torso: 88, tA: -100, sA: 100 },
      50: { torso: 60, tA: -78, sA: 86 } } },
    bridge1: { base: supine(), dur: 2.4, frames: {
      0: { torso: 88, tA: -100, sA: 100, tB: -102, sB: 6 },
      50: { torso: 62, tA: -78, sA: 86, tB: -150, sB: 4 } } },
    calf: { base: STAND, dur: 1.6, frames: {
      0: { fig: "translateY(0px)", arm: 2, tA: 0, sA: 0 },
      50: { fig: "translateY(-9px)", arm: -8, fore: -4, tA: -2, sA: -6 } } },
    legpress: { base: seatedPose(), dur: 2.2, prop: "seatback", frames: {
      0: { torso: -28, arm: -30, fore: -60, tA: -108, sA: 96 },
      50: { torso: -28, arm: -30, fore: -60, tA: -58, sA: 8 } } },
    /* ---- 推 ---- */
    pushup: { base: plankHigh(), dur: 2, frames: {
      0: { fig: "translateY(26px)", torso: 60, arm: -112, fore: -4 },
      50: { fig: "translateY(38px)", torso: 66, arm: -134, fore: -92 } } },
    pushupKneel: { base: plankHigh(), dur: 2.2, frames: {
      0: { fig: "translateY(46px)", torso: 52, arm: -104, fore: -4, tA: -95, sA: 100, tB: -95, sB: 100 },
      50: { fig: "translateY(56px)", torso: 58, arm: -124, fore: -88, tA: -95, sA: 100, tB: -95, sB: 100 } } },
    pushupIncline: { base: plankHigh(), dur: 2.2, prop: "desk", frames: {
      0: { fig: "translateY(10px)", torso: 34, arm: -86, fore: -4, tA: 108, sA: -8, tB: 108, sB: -8 },
      50: { fig: "translateY(20px)", torso: 40, arm: -106, fore: -86, tA: 108, sA: -8, tB: 108, sB: -8 } } },
    ohp: { base: STAND, dur: 2.2, prop: "db", frames: {
      0: { fig: "translateY(2px)", torso: -4, arm: -36, fore: -122, armB: 30, foreB: -122 },
      50: { fig: "translateY(-2px)", torso: -6, arm: -178, fore: -4, armB: -174, foreB: -4 } } },
    floorpress: { base: supine(), dur: 2.2, prop: "db", frames: {
      0: { torso: 88, arm: -86, fore: -172, tA: -100, sA: 100 },
      50: { torso: 88, arm: -140, fore: -6, tA: -100, sA: 100 } } },
    inclinepress: { base: supine(), dur: 2.2, prop: "db", frames: {
      0: { fig: "translateY(30px)", torso: 52, arm: -66, fore: -160, tA: -110, sA: 70 },
      50: { fig: "translateY(30px)", torso: 52, arm: -120, fore: -8, tA: -110, sA: 70 } } },
    chestpress: { base: seatedPose(), dur: 2.2, prop: "seatback", frames: {
      0: { torso: -6, arm: -14, fore: -96, tA: -96, sA: 92 },
      50: { torso: -6, arm: -96, fore: -4, tA: -96, sA: 92 } } },
    dip: { base: STAND, dur: 2.2, prop: "bench", frames: {
      0: { fig: "translateY(-8px)", torso: 4, arm: -128, fore: -18, tA: -10, sA: 24 },
      50: { fig: "translateY(14px)", torso: 10, arm: -146, fore: -96, tA: -18, sA: 30 } } },
    pushdown: { base: STAND, dur: 1.8, prop: "db", frames: {
      0: { torso: 4, arm: -16, fore: -108 },
      50: { torso: 4, arm: -6, fore: -6 } } },
    /* ---- 拉 ---- */
    raise: { base: STAND, dur: 2, prop: "db", frames: {
      0: { torso: 0, arm: 6, fore: -4 },
      50: { torso: 0, arm: -94, fore: -2 } } },
    raiseB: { base: hingePose(), dur: 2, prop: "db", frames: {
      0: { torso: 74, arm: -76, fore: -4, tA: -14, sA: 20 },
      50: { torso: 74, arm: -8, fore: -4, tA: -14, sA: 20 } } },
    machinefly: { base: seatedPose(), dur: 2, prop: "seatback", frames: {
      0: { torso: -4, arm: 42, fore: -6, tA: -96, sA: 92 },
      50: { torso: -4, arm: -88, fore: -4, tA: -96, sA: 92 } } },
    curl: { base: STAND, dur: 1.8, prop: "db", frames: {
      0: { torso: 2, arm: 8, fore: -8 },
      50: { torso: 2, arm: 16, fore: -138 } } },
    row: { base: hingePose(), dur: 2, prop: "db", frames: {
      0: { torso: 72, arm: -76, fore: -8 },
      50: { torso: 72, arm: -6, fore: -100 } } },
    seatedrow: { base: seatedPose(), dur: 2, prop: "seat", frames: {
      0: { torso: 6, arm: -92, fore: -6, tA: -86, sA: 2 },
      50: { torso: 6, arm: -16, fore: -96, tA: -86, sA: 2 } } },
    barbellrow: { base: hingePose(), dur: 2.2, prop: "bar", frames: {
      0: { torso: 76, arm: -78, fore: -6, tA: -14, sA: 20 },
      50: { torso: 70, arm: -22, fore: -92, tA: -14, sA: 20 } } },
    pulldown: { base: seatedPose(), dur: 2.2, prop: "seat", frames: {
      0: { torso: -8, arm: -176, fore: -6, tA: -96, sA: 92 },
      50: { torso: -8, arm: -116, fore: -118, tA: -96, sA: 92 } } },
    pullup: { base: STAND, dur: 2.2, prop: "bar", frames: {
      0: { fig: "translateY(-6px)", torso: -2, arm: -176, fore: -4, tA: -6, sA: 8 },
      50: { fig: "translateY(26px)", torso: -6, arm: -122, fore: -124, tA: -30, sA: 40 } } },
    /* ---- 核心/地面 ---- */
    plank: { base: plankHigh(), dur: 2.6, frames: {
      0: { fig: "translateY(26px)", torso: 60, arm: -112, fore: -4 },
      50: { fig: "translateY(29px)", torso: 62, arm: -114, fore: -5 } } },
    sideplank: { base: plankHigh(), dur: 2.6, frames: {
      0: { fig: "translateY(24px)", torso: 60, arm: -112, fore: -4, armB: 118, foreB: 0 },
      50: { fig: "translateY(27px)", torso: 60, arm: -112, fore: -4, armB: 122, foreB: 0 } } },
    crunch: { base: supine(), dur: 2, frames: {
      0: { torso: 90, arm: -66, fore: -84, tA: -100, sA: 100 },
      50: { torso: 62, arm: -60, fore: -92, tA: -100, sA: 100 } } },
    revcrunch: { base: supine(), dur: 2, frames: {
      0: { torso: 90, tA: -100, sA: 100 },
      50: { torso: 82, tA: -148, sA: 148 } } },
    legraise: { base: supine(), dur: 2.2, frames: {
      0: { torso: 90, tA: -98, sA: 4, tB: -98, sB: 4 },
      50: { torso: 90, tA: -172, sA: 2, tB: -172, sB: 2 } } },
    twist: { base: supine(), dur: 1.8, prop: "db", frames: {
      0: { fig: "translateY(34px)", torso: 52, arm: -58, fore: -30, tA: -100, sA: 100 },
      50: { fig: "translateY(34px)", torso: 58, arm: -118, fore: -34, tA: -100, sA: 100 } } },
    deadbug: { base: supine(), dur: 2.4, frames: {
      0: { torso: 90, arm: -168, fore: -4, tA: -172, sA: 2, tB: -100, sB: 100 },
      50: { torso: 90, arm: -70, fore: -80, tA: -100, sA: 100, tB: -172, sB: 2 } } },
    birddog: { base: kneelPose(), dur: 2.6, mirror: true, frames: {
      0: { torso: 84, arm: -108, fore: -4, tA: -95, sA: 100 },
      50: { torso: 84, arm: -176, fore: -2, tA: 30, sA: 10 } } },
    superman: { base: supine(), dur: 2.2, frames: {
      0: { fig: "translateY(44px) scaleY(-1)", torso: 88, arm: -120, fore: -4, tA: -104, sA: 6 },
      50: { fig: "translateY(44px) scaleY(-1)", torso: 88, arm: -168, fore: -2, tA: -118, sA: 4 } } },
    ytw: { base: supine(), dur: 2.2, frames: {
      0: { fig: "translateY(44px) scaleY(-1)", torso: 88, arm: -100, fore: -4, tA: -104, sA: 6 },
      50: { fig: "translateY(44px) scaleY(-1)", torso: 88, arm: -176, fore: -10, tA: -104, sA: 6 } } },
    clamshell: { base: supine(), dur: 2, frames: {
      0: { fig: "translateY(44px)", torso: 90, arm: -50, tA: -96, sA: 92, tB: -96, sB: 92 },
      50: { fig: "translateY(44px)", torso: 90, arm: -50, tA: -58, sA: 92, tB: -96, sB: 92 } } },
    sidelyleg: { base: supine(), dur: 2, frames: {
      0: { fig: "translateY(46px)", torso: 92, tA: -94, sA: 6, tB: -94, sB: 6 },
      50: { fig: "translateY(46px)", torso: 92, tA: -60, sA: 4, tB: -94, sB: 6 } } },
    donkeykick: { base: kneelPose(), dur: 2, frames: {
      0: { torso: 80, arm: -106, fore: -4, tA: -95, sA: 100, tB: -95, sB: 100 },
      50: { torso: 80, arm: -106, fore: -4, tA: 46, sA: 12, tB: -95, sB: 100 } } },
    /* ---- 全身/HIIT ---- */
    jack: { base: STAND, dur: 1.6, frames: {
      0: { fig: "translateY(0px)", arm: 8, fore: -4, armB: 8, foreB: -4, tA: -6, sA: 6, tB: 6, sB: -6 },
      50: { fig: "translateY(-12px)", arm: -172, fore: -2, armB: -172, foreB: -2, tA: -22, sA: 4, tB: 22, sB: -4 } } },
    run: { base: STAND, dur: 1.4, mirror: true, frames: {
      0: { fig: "translateY(0px)", torso: 10, arm: -42, fore: -70, tA: -62, sA: 40 },
      50: { fig: "translateY(-8px)", torso: 12, arm: 36, fore: -60, tA: 28, sA: 96 } } },
    runHigh: { base: STAND, dur: 1.2, mirror: true, frames: {
      0: { fig: "translateY(0px)", torso: 6, arm: -52, fore: -80, tA: -92, sA: 96 },
      50: { fig: "translateY(-10px)", torso: 8, arm: 44, fore: -70, tA: 24, sA: 110 } } },
    buttkick: { base: STAND, dur: 1.2, mirror: true, frames: {
      0: { fig: "translateY(0px)", torso: 12, arm: -38, fore: -64, tA: -18, sA: 130 },
      50: { fig: "translateY(-6px)", torso: 12, arm: 34, fore: -58, tA: 30, sA: 20 } } },
    walk: { base: STAND, dur: 2, mirror: true, frames: {
      0: { fig: "translateY(0px)", torso: 3, arm: -22, fore: -24, tA: -24, sA: 16 },
      50: { fig: "translateY(-3px)", torso: 4, arm: 22, fore: -22, tA: 22, sA: 40 } } },
    stairs: { base: STAND, dur: 1.3, mirror: true, frames: {
      0: { fig: "translateY(0px)", torso: 14, arm: -48, fore: -66, tA: -74, sA: 70 },
      50: { fig: "translateY(-12px)", torso: 14, arm: 40, fore: -60, tA: 20, sA: 100 } } },
    climb: { base: plankHigh(), dur: 1.4, mirror: true, frames: {
      0: { fig: "translateY(26px)", torso: 60, arm: -112, fore: -4, tA: -40, sA: 96 },
      50: { fig: "translateY(28px)", torso: 62, arm: -112, fore: -4, tA: -100, sA: 60 } } },
    jump: { base: STAND, dur: 1.8, frames: {
      0: { fig: "translateY(40px)", torso: 30, arm: -70, fore: -20, tA: -70, sA: 110 },
      40: { fig: "translateY(-26px)", torso: -4, arm: -176, fore: -6, tA: -4, sA: 6 },
      100: { fig: "translateY(40px)", torso: 30, arm: -70, fore: -20, tA: -70, sA: 110 } } },
    skip: { base: STAND, dur: 1.2, prop: "rope", mirror: true, frames: {
      0: { fig: "translateY(0px)", torso: 6, arm: -30, fore: -80, tA: -30, sA: 60 },
      50: { fig: "translateY(-14px)", torso: 6, arm: 26, fore: -84, tA: 26, sA: 90 } } },
    dance: { base: STAND, dur: 1.6, frames: {
      0: { fig: "translateY(0px)", torso: -8, arm: -150, fore: -30, armB: 30, foreB: -40, tA: -12, sA: 14 },
      50: { fig: "translateY(-8px)", torso: 12, arm: -20, fore: -120, armB: -170, foreB: -20, tA: -48, sA: 60 } } },
    swim: { base: supine(), dur: 2, mirror: true, frames: {
      0: { fig: "translateY(44px) scaleY(-1)", torso: 88, arm: -140, fore: -10, tA: -100, sA: 20 },
      50: { fig: "translateY(44px) scaleY(-1)", torso: 88, arm: -40, fore: -30, tA: -118, sA: 30 } } },
    bike: { base: STAND, dur: 1.6, prop: "bike", mirror: true, frames: {
      0: { fig: "translateY(26px)", torso: 34, arm: -66, fore: -40, tA: -80, sA: 100 },
      50: { fig: "translateY(26px)", torso: 34, arm: -66, fore: -40, tA: -20, sA: 20 } } },
    /* ---- 拉伸 ---- */
    neckroll: { base: STAND, dur: 2.6, frames: {
      0: { torso: -4, arm: -62, fore: -74, tA: -4, sA: 4 },
      50: { torso: 6, arm: -74, fore: -66, tA: -4, sA: 4 } } },
    doorstretch: { base: STAND, dur: 2.6, prop: "wall", frames: {
      0: { torso: -6, arm: -86, fore: 26, armB: 6, foreB: 4, tA: -4, sA: 4 },
      50: { torso: -14, arm: -96, fore: 40, armB: 6, foreB: 4, tA: -4, sA: 4 } } },
    quadstretch: { base: STAND, dur: 2.6, frames: {
      0: { torso: -4, arm: 36, fore: 118, tA: -4, sA: 4, tB: 18, sB: 138 },
      50: { torso: -10, arm: 44, fore: 128, tA: -4, sA: 4, tB: 14, sB: 148 } } },
    seatedfold: { base: seatedPose(), dur: 2.8, frames: {
      0: { torso: 10, arm: -20, fore: -20, tA: -86, sA: 2 },
      50: { torso: 56, arm: -60, fore: -30, tA: -86, sA: 2 } } },
    hipflexor: { base: lungePose(), dur: 2.6, frames: {
      0: { fig: "translateY(30px)", torso: 18, arm: -30, fore: -10, tA: -58, sA: 100, tB: 42, sB: 108 },
      50: { fig: "translateY(30px)", torso: -14, arm: -170, fore: -8, tA: -58, sA: 100, tB: 42, sB: 108 } } },
    figure4: { base: supine(), dur: 2.6, frames: {
      0: { torso: 92, arm: -60, fore: -80, tA: -100, sA: 100, tB: -104, sB: 104 },
      50: { torso: 84, arm: -68, fore: -96, tA: -112, sA: 118, tB: -96, sB: 96 } } },
    calfstretch: { base: lungePose(), dur: 2.6, prop: "wall", frames: {
      0: { fig: "translateY(28px)", torso: 20, arm: -80, fore: -4, tA: -46, sA: 60, tB: 30, sB: 90 },
      50: { fig: "translateY(30px)", torso: 24, arm: -84, fore: -4, tA: -50, sA: 52, tB: 32, sB: 96 } } },
    catcow: { base: kneelPose(), dur: 2.8, frames: {
      0: { fig: "translateY(46px)", torso: 72, arm: -108, fore: -4, tA: -95, sA: 100 },
      50: { fig: "translateY(46px)", torso: 98, arm: -96, fore: -10, tA: -95, sA: 100 } } },
    childpose: { base: kneelPose(), dur: 2.8, frames: {
      0: { fig: "translateY(46px)", torso: 96, arm: -120, fore: -4, tA: -98, sA: 118 },
      50: { fig: "translateY(48px)", torso: 106, arm: -128, fore: -6, tA: -98, sA: 120 } } },
    fullstretch: { base: STAND, dur: 2.8, frames: {
      0: { torso: -10, arm: -174, fore: -6, armB: -174, foreB: -6, tA: -4, sA: 4 },
      50: { torso: 12, arm: -172, fore: -6, armB: -176, foreB: -6, tA: -4, sA: 4 } } }
  };

  /* ---------- 动作 → 模式映射 ---------- */
  const MAP = {
    squat: "squat", sumo_squat: "squat", wall_sit: "wallsit", db_goblet_squat: "goblet",
    leg_press: "legpress", lunge: "lunge", db_lunge: "lunge",
    bulgarian_split: "bulgarian", db_rdl: "hinge", goat_hyper: "goat",
    glute_bridge: "bridge", single_glute_bridge: "bridge1", calf_raise: "calf",
    kneel_pushup: "pushupKneel", incline_pushup: "pushupIncline", pushup: "pushup",
    dip_bench: "dip", db_shoulder_press: "ohp", db_floor_press: "floorpress",
    incline_db_press: "inclinepress", machine_chest_press: "chestpress",
    triceps_pushdown: "pushdown",
    db_lateral_raise: "raise", db_front_raise: "raise", db_bent_raise: "raiseB",
    machine_fly: "machinefly", reverse_fly_machine: "machinefly",
    db_curl: "curl", db_row: "row", band_row: "seatedrow", seated_cable_row: "seatedrow",
    barbell_row: "barbellrow", lat_pulldown: "pulldown", pullup: "pullup",
    plank: "plank", side_plank: "sideplank", crunch: "crunch", reverse_crunch: "revcrunch",
    leg_raise: "legraise", russian_twist: "twist", dead_bug: "deadbug",
    superman: "superman", clamshell: "clamshell", side_lying_leg: "sidelyleg",
    glute_kick: "donkeykick",
    jumping_jack: "jack", high_knees: "runHigh", jogging: "run",
    brisk_walk: "walk", stairs: "stairs", mountain_climber: "climb", burpee: "jump",
    squat_jump: "jump", rope_skipping: "skip",
    swimming: "swim", cycling: "bike",
    neck_shoulder: "neckroll", chest_door: "doorstretch", quad_stretch: "quadstretch",
    hamstring_stretch: "seatedfold", hip_flexor: "hipflexor", piriformis: "figure4",
    calf_stretch: "calfstretch",
    full_body_stretch: "fullstretch"
  };
  const FALLBACK = { strength: "squat", core: "crunch", hiit: "run", cardio: "walk", stretch: "fullstretch" };

  /* ---------- 骨架绘制 ---------- */
  const limb = (x1, y1, x2, y2, near, w) =>
    '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="exa-limb ' + (near ? "exa-near" : "exa-far") + '" stroke-width="' + w + '"/>';
  const tf = v => (typeof v === "number" ? "rotate(" + v + "deg)" : (v || "none"));

  function group(cls, origin, pose, inner) {
    return '<g class="g-' + cls + '" style="transform-origin:' + origin + ";transform:" + tf(pose) + '">' + inner + "</g>";
  }

  function propsSVG(propKey) {
    switch (propKey) {
      case "bench": return '<rect x="150" y="150" width="36" height="8" rx="3" class="exa-prop"/>';
      case "desk": return '<rect x="118" y="96" width="60" height="8" rx="3" class="exa-prop"/>';
      case "wall": return '<line x1="22" y1="30" x2="22" y2="180" class="exa-prop" stroke-width="8" stroke-linecap="round"/>';
      case "seat": return '<rect x="126" y="152" width="52" height="8" rx="3" class="exa-prop"/><line x1="170" y1="156" x2="170" y2="186" class="exa-prop" stroke-width="7"/>';
      case "seatback": return '<rect x="126" y="152" width="52" height="8" rx="3" class="exa-prop"/><line x1="132" y1="156" x2="174" y2="112" class="exa-prop" stroke-width="8"/>';
      case "rope": return '<ellipse cx="100" cy="100" rx="86" ry="30" fill="none" class="exa-rope" stroke-width="4" stroke-dasharray="10 7"/>';
      case "bike": return '<circle cx="72" cy="164" r="22" fill="none" class="exa-prop" stroke-width="5"/><circle cx="132" cy="164" r="22" fill="none" class="exa-prop" stroke-width="5"/><line x1="72" y1="164" x2="132" y2="164" class="exa-prop" stroke-width="5"/>';
      default: return "";
    }
  }
  const DB_SVG = '<g class="exa-db"><line x1="' + (G.hand[0] - 12) + '" y1="' + G.hand[1] + '" x2="' + (G.hand[0] + 12) + '" y2="' + G.hand[1] + '"/><circle cx="' + (G.hand[0] - 12) + '" cy="' + G.hand[1] + '" r="6"/><circle cx="' + (G.hand[0] + 12) + '" cy="' + G.hand[1] + '" r="6"/></g>';
  const BAR_SVG = '<g class="exa-db"><line x1="' + (G.hand[0] - 26) + '" y1="' + G.hand[1] + '" x2="' + (G.hand[0] + 26) + '" y2="' + G.hand[1] + '"/><circle cx="' + (G.hand[0] - 26) + '" cy="' + G.hand[1] + '" r="9"/><circle cx="' + (G.hand[0] + 26) + '" cy="' + G.hand[1] + '" r="9"/></g>';

  function buildSVG(ex, opts) {
    const patName = MAP[ex && ex.id] || FALLBACK[ex && ex.cat] || "squat";
    const P = PATTERNS[patName];
    const animate = opts.animate !== false;
    const size = opts.size || 160;
    const base = Object.assign({}, STAND, P.base);
    const stops = Object.keys(P.frames).map(Number).sort((a, b) => a - b);
    const pose0 = Object.assign({}, base, P.frames[stops[0]] || {});
    const dbProp = P.prop === "db" ? DB_SVG : P.prop === "bar" ? BAR_SVG : "";

    const armA = limb(G.shoulder[0], G.shoulder[1], G.elbow[0], G.elbow[1], true, 7) +
      group("forearm", ORIGIN.forearm, pose0.fore, limb(G.elbow[0], G.elbow[1], G.hand[0], G.hand[1], true, 6) + dbProp);
    const armB = limb(G.shoulder[0], G.shoulder[1], G.elbow[0], G.elbow[1], false, 7) +
      group("forearmB", ORIGIN.forearmB, pose0.foreB, limb(G.elbow[0], G.elbow[1], G.hand[0], G.hand[1], false, 6));
    const legA = group("thigh", ORIGIN.thigh, pose0.tA,
      limb(G.hip[0], G.hip[1], G.knee[0], G.knee[1], true, 8) +
      group("shank", ORIGIN.shank, pose0.sA,
        limb(G.knee[0], G.knee[1], G.ankle[0], G.ankle[1], true, 7) +
        limb(G.ankle[0], G.ankle[1], G.toe[0], G.toe[1], true, 6)));
    const legB = group("thighB", ORIGIN.thighB, pose0.tB,
      limb(G.hip[0], G.hip[1], G.knee[0], G.knee[1], false, 8) +
      group("shankB", ORIGIN.shankB, pose0.sB,
        limb(G.knee[0], G.knee[1], G.ankle[0], G.ankle[1], false, 7) +
        limb(G.ankle[0], G.ankle[1], G.toe[0], G.toe[1], false, 6)));
    const torso = '<circle cx="' + G.headC[0] + '" cy="' + G.headC[1] + '" r="13" class="exa-head"/>' +
      limb(G.neck[0], G.neck[1], G.shoulder[0], G.shoulder[1], true, 6) +
      limb(G.shoulder[0], G.shoulder[1] - 2, G.hip[0], G.hip[1], true, 9) +
      group("arm", ORIGIN.arm, pose0.arm, armA) +
      group("armB", ORIGIN.armB, pose0.armB, armB);

    return '<svg viewBox="0 0 200 200" width="' + size + '" height="' + size + '" class="exa-svg' + (animate ? " exa-run exp-" + patName : "") + '" role="img" aria-label="动作演示">' +
      '<line x1="14" y1="186" x2="186" y2="186" class="exa-ground"/>' +
      propsSVG(P.prop) +
      group("fig", ORIGIN.fig, pose0.fig, legB + legA + group("torso", ORIGIN.torso, pose0.torso, torso)) +
      "</svg>";
  }

  /* ---------- 生成 keyframes（一次性注入 <style>） ---------- */
  const MIRROR_KEYS = [["tA", "tB", "thigh", "thighB"], ["sA", "sB", "shank", "shankB"], ["arm", "armB", "arm", "armB"], ["fore", "foreB", "forearm", "forearmB"]];

  function genCSS() {
    let css = "";
    for (const pat in PATTERNS) {
      const P = PATTERNS[pat];
      const base = Object.assign({}, STAND, P.base);
      const stops = Object.keys(P.frames).map(Number).sort((a, b) => a - b);
      const animated = {};
      Object.keys(GROUP_KEY).forEach(k => {
        const vals = stops.map(s => JSON.stringify(P.frames[s][k] !== undefined ? P.frames[s][k] : base[k]));
        if (new Set(vals).size > 1) animated[k] = true;
      });
      for (const k in animated) {
        const g = GROUP_KEY[k];
        let kf = "@keyframes exak-" + pat + "-" + g + "{";
        stops.forEach(s => {
          const v = P.frames[s][k] !== undefined ? P.frames[s][k] : base[k];
          kf += s + "%{transform:" + tf(v) + "}";
        });
        const last = stops[stops.length - 1];
        if (last !== 100) {
          const v0 = P.frames[stops[0]][k] !== undefined ? P.frames[stops[0]][k] : base[k];
          kf += "100%{transform:" + tf(v0) + "}";
        }
        kf += "}";
        css += kf + ".exp-" + pat + " .g-" + g + "{animation:exak-" + pat + "-" + g + " " + P.dur + "s ease-in-out infinite}";
      }
      if (P.mirror) MIRROR_KEYS.forEach(m => {
        if (animated[m[0]] && !animated[m[1]]) {
          const gA = GROUP_KEY[m[0]], gB = GROUP_KEY[m[1]];
          css += ".exp-" + pat + " .g-" + gB + "{animation:exak-" + pat + "-" + gA + " " + P.dur + "s ease-in-out infinite reverse}";
        }
      });
      if (P.prop === "rope") css += ".exp-" + pat + " .exa-rope{animation:exak-ropespin " + (P.dur / 2) + "s linear infinite;transform-origin:100px 100px}";
    }
    css += "@keyframes exak-ropespin{to{transform:rotate(360deg)}}" +
      ".exa-svg *{transform-box:view-box}" +
      ".exa-ic{border-radius:14px;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;flex:none}" +
      ".exa-ic .exa-svg{width:160%;height:160%}" +
      ".exa-ic.strength{background:var(--orange-bg)}" +
      ".exa-ic.core{background:var(--pink-bg)}" +
      ".exa-ic.hiit{background:var(--yellow-bg,#FFF6DE)}" +
      ".exa-ic.cardio{background:var(--blue-bg)}" +
      ".exa-ic.stretch{background:var(--green-bg)}" +
      ".exa-limb{stroke:var(--exa-limb);stroke-linecap:round;fill:none}" +
      ".exa-far{opacity:.42}" +
      ".exa-head{fill:var(--accent)}" +
      ".exa-ground{stroke:var(--line);stroke-width:3;stroke-linecap:round}" +
      ".exa-prop{stroke:#B9C0D4;fill:#D8DDEB}" +
      ".exa-db line{stroke:#8F97AC;stroke-width:4}" +
      ".exa-db circle{fill:var(--accent)}" +
      ".exa-card{background:var(--card2);border-radius:18px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;flex:none}" +
      ".exa-badge{position:absolute;right:9px;bottom:8px;font-size:10px;color:var(--sub);background:var(--card);border-radius:9px;padding:3px 8px;font-weight:700}";
    return css;
  }

  let cssInjected = false;
  function ensureCSS() {
    if (cssInjected) return;
    const st = document.createElement("style");
    st.textContent = genCSS();
    document.head.appendChild(st);
    cssInjected = true;
  }

  /* ---------- 对外接口 ---------- */
  function icon(exOrId, size) {
    const ex = typeof exOrId === "string" ? window.findEx(exOrId) : exOrId;
    if (!ex) return '<div class="exa-ic strength" style="width:' + (size || 44) + 'px;height:' + (size || 44) + 'px"></div>';
    ensureCSS();
    const s = size || 44;
    return '<div class="exa-ic ' + (ex.cat || "strength") + '" style="width:' + s + "px;height:" + s + 'px">' + buildSVG(ex, { animate: false, size: s }) + "</div>";
  }
  function demo(exOrId, opts) {
    opts = opts || {};
    const ex = typeof exOrId === "string" ? window.findEx(exOrId) : exOrId;
    if (!ex) return "";
    ensureCSS();
    const w = opts.w || 220, h = opts.h || 200;
    return '<div class="exa-card" style="width:' + w + "px;height:" + h + 'px">' +
      buildSVG(ex, { animate: true, size: Math.min(w, h) }) +
      (opts.label === false ? "" : '<span class="exa-badge">▶ 动图演示</span>') + "</div>";
  }

  return { icon: icon, demo: demo, patternOf: ex => MAP[ex && ex.id] || FALLBACK[ex && ex.cat] || "squat", PATTERNS: PATTERNS };
})();

