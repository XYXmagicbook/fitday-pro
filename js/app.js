/* ============================================================
   FitDay —— 主逻辑：状态 / 路由 / 训练执行 / 提醒 / 弹层
   ============================================================ */

(function () {
  "use strict";

  const $ = s => document.querySelector(s);
  const store = {
    load() { try { return JSON.parse(localStorage.getItem("fitday_state") || "null"); } catch (e) { return null; } },
    save() { try { localStorage.setItem("fitday_state", JSON.stringify(App.S)); } catch (e) { } }
  };

  const App = window.App = {
    S: null,
    stack: [],

    /* ---------- 主题 ---------- */
    applyTheme(id) {
      const themes = ["tangerine", "nailong", "baby", "sponge", "ocean", "dopamine", "duck", "peach", "night"];
      const t = themes.indexOf(id) >= 0 ? id : "tangerine";
      document.documentElement.setAttribute("data-theme", t);
      const mc = { tangerine: "#FF7A3D", nailong: "#F5A800", baby: "#FF9EB5", sponge: "#F0B820", ocean: "#FF7A45", dopamine: "#FF5DA2", duck: "#12B886", peach: "#F06692", night: "#9F8CFF" }[t];
      const meta = document.querySelector('meta[name=theme-color]');
      if (meta) meta.setAttribute("content", mc);
    },
    applyFont(sz) {
      const v = ["small", "std", "mid", "large", "xlarge"].indexOf(sz) >= 0 ? sz : "std";
      if (v === "std") document.documentElement.removeAttribute("data-fs");
      else document.documentElement.setAttribute("data-fs", v);
    },

    /* ---------- 日期工具 ---------- */
    dayKey(d) {
      const p = n => (n < 10 ? "0" + n : "" + n);
      return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
    },
    todayKey() { return this.dayKey(new Date()); },
    todayLog() {
      const k = this.todayKey();
      if (!this.S.logs[k]) this.S.logs[k] = {};
      return this.S.logs[k];
    },
    weekdayIdx() { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; },
    rangeLogs(n) {
      const out = [];
      for (let i = n - 1; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        out.push(this.S.logs[this.dayKey(d)] || null);
      }
      return out;
    },
    streakObj() {
      const days = window.FitEngine.computeStreak(this.S.logs, this.S.plan);
      const keys = Object.keys(this.S.logs).sort().reverse();
      let train = 0;
      for (let i = 0; i < keys.length; i++) {
        const l = this.S.logs[keys[i]];
        if ((l.workouts || []).length) train++;
        else if (i === 0 && keys[i] === this.todayKey()) continue;
        else break;
      }
      return { days, trainStreak: train };
    },
    guessMeal() {
      const h = new Date().getHours();
      return h < 10 ? "早餐" : h < 14 ? "午餐" : h < 21 ? "晚餐" : "加餐";
    },

    /* ---------- 路由 ---------- */
    view: "home", param: null,
    navigate(view, param, push) {
      if (push !== false && this.view && this.view !== view) this.stack.push({ view: this.view, param: this.param });
      if (push === false) this.stack = [];
      this.view = view; this.param = param;
      this.render();
    },
    back() {
      const prev = this.stack.pop();
      if (prev) { this.view = prev.view; this.param = prev.param; this.render(); }
      else this.navigate("home", null, false);
    },
    tabbarViews: ["home", "fitness", "diet", "calendar", "me"],

    render() {
      const S = this.S, V = window.Views;
      const appEl = $("#app");
      let html = "";
      if (!S.profile || !S.plan || !S.obDone) html = V.onboard(S.ui.obData, S.ui.obStep);
      else {
        switch (this.view) {
          case "home": html = V.home(); break;
          case "plan": html = V.planView(); break;
          case "fitness": html = V.fitness(); break;
          case "course": html = V.course(this.param); break;
          case "exercise": html = V.exercise(this.param); break;
          case "diet": html = V.diet(); break;
          case "water": html = V.water(); break;
          case "calendar": html = V.calendar(); break;
          case "report": html = V.report(); break;
          case "coach": html = V.coach(); break;
          case "album": html = V.album(); break;
          case "me": html = V.me(); break;
          default: html = V.home();
        }
      }
      appEl.innerHTML = html;
      appEl.scrollTop = 0;
      const showBar = S.profile && S.obDone && this.tabbarViews.indexOf(this.view) >= 0;
      $("#tabbar").classList.toggle("hidden", !showBar);
      document.querySelectorAll("#tabbar .tab").forEach(t => t.classList.toggle("on", t.dataset.nav === this.view));
      if (this.view === "coach") { const cl = $("#chat-list"); if (cl) cl.scrollTop = cl.scrollHeight; }
    },

    /* ---------- 弹层 ---------- */
    toast(msg, big) {
      const t = $("#toast");
      t.textContent = msg;
      t.classList.remove("hidden");
      t.classList.toggle("big", !!big);
      clearTimeout(this._tt);
      this._tt = setTimeout(() => t.classList.add("hidden"), big ? 3200 : 2400);
    },
    showSheet(html) { $("#sheet").innerHTML = html; $("#sheetwrap").classList.remove("hidden"); },
    closeSheet() { $("#sheetwrap").classList.add("hidden"); },
    showModal(html) { $("#modal").innerHTML = html; $("#modalwrap").classList.remove("hidden"); },
    closeModal() { $("#modalwrap").classList.add("hidden"); },

    /* ---------- 声音 ---------- */
    beep(times) {
      if (!this.S.settings.sound) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!this._ac) this._ac = new AC();
        const ac = this._ac;
        if (ac.state === "suspended") ac.resume();
        for (let i = 0; i < (times || 2); i++) {
          const o = ac.createOscillator(), g = ac.createGain();
          o.type = "sine"; o.frequency.value = i % 2 ? 660 : 880;
          const t0 = ac.currentTime + i * 0.22;
          g.gain.setValueAtTime(0.001, t0);
          g.gain.exponentialRampToValueAtTime(0.22, t0 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18);
          o.connect(g); g.connect(ac.destination);
          o.start(t0); o.stop(t0 + 0.2);
        }
      } catch (e) { }
    },

    /* ---------- 提醒 ---------- */
    notify(msg, force) {
      this.toast(msg, true);
      this.beep(2);
      try {
        if (force || document.hidden || true) {
          if (window.Notification && Notification.permission === "granted") {
            new Notification("FitDay 燃动日记", { body: msg, icon: "icons/icon.svg" });
          }
        }
      } catch (e) { }
    },
    askNotifPermission() {
      try { if (window.Notification && Notification.permission === "default") Notification.requestPermission(); } catch (e) { }
    },
    checkReminders() {
      const S = App.S;
      if (!S || !S.profile || !S.settings.remind) return;
      const now = new Date();
      const hm = (now.getHours() < 10 ? "0" : "") + now.getHours() + ":" + (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
      const dk = App.todayKey();
      if (!S.fired[dk]) S.fired[dk] = {};
      const fired = S.fired[dk];
      const fire = (key, msg) => {
        if (fired[key]) return;
        /* 只在当前分钟的前后70秒内触发，避免补弹一整天 */
        fired[key] = true;
        store.save();
        App.notify(msg);
      };
      const wd = App.weekdayIdx();
      const plan = S.plan;
      if (S.settings.water) plan.waterSlots.forEach(sl => {
        if (sl.time === hm) fire("water-" + sl.time, "该喝水啦💧 补充" + sl.ml + "ml，让身体保持最佳状态");
      });
      if (S.settings.train) {
        const dp = plan.week[wd];
        if (dp && (dp.type === "strength" || dp.type === "cardio") && dp.time === hm) {
          const cyc = App.cyc();
          if (cyc && cyc.isPeriod && cyc.periodDay <= 2)
            fire("train", "🌸 生理期第" + cyc.periodDay + "天：今天建议散步/拉伸就好，想动再来一节舒缓课");
          else
            fire("train", "该训练了💪 今天是【" + dp.title + "】(" + dp.time + ")，动起来！");
        }
      }
      if (S.settings.meal) plan.meals.forEach(m => {
        if (m.time === hm) fire("meal-" + m.name, "记得记录" + m.name + "饮食🍎 目标约" + m.kcal + "kcal");
      });
      if (S.settings.sleep && plan.sleepTime === hm) fire("sleep", "睡前回顾一下今天的打卡吧🌙 早睡才能睡出好状态");
    },

    /* ---------- 打卡/记录 ---------- */
    /* 生理期上下文（供训练入口拦截） */
    cyc() { return window.FitEngine.cycleInfo ? window.FitEngine.cycleInfo(this.S) : null; },
    /* 训练前检查：生理期前3天提示切换舒缓模式 */
    periodGate(goOn, gentleId) {
      const cyc = this.cyc();
      if (!cyc || !cyc.isPeriod || cyc.periodDay > 3) { goOn(); return; }
      const day = cyc.periodDay;
      this.showModal(`<h4>🌸 生理期第${day}天</h4>
        <div class="mp">今天身体在敏感期，高强度力量/跳跃训练容易加重不适。建议换成舒缓拉伸课，或者视状态继续。</div>
        <div class="mbtns"><button class="btn ghost" data-action="closeModal">再想想</button>
        ${gentleId ? `<button class="btn" data-action="startCourse|${gentleId}">练舒缓课 🧘</button>` : ""}
        <button class="btn ghost" data-action="goOnTrain">照常训练</button></div>`);
      this._goOn = goOn;
    },
    logWorkout(courseId, name, min, kcal, tag, day) {
      if (min < 1) return;
      const log = this.todayLog();
      if (!log.workouts) log.workouts = [];
      log.workouts.push({ courseId, name, min: Math.round(min), kcal: Math.round(kcal), tag: tag || "运动", day: day == null ? this.weekdayIdx() : day, t: new Date().toTimeString().slice(0, 5) });
      store.save();
    },
    /* 从分化课表开始某个力量日 */
    startPlanDay(wd) {
      const S = this.S, d = S.plan.week[wd];
      if (!d || d.type !== "strength") return;
      const go = () => {
        App.closeModal();
        const course = {
          id: "split_" + wd, name: d.title, type: "strength",
          blocks: d.exercises,
          warmup: [{ ex: "jumping_jack", sec: 180 }, { ex: "squat", sec: 60 }],
          cooldown: (d.stretches || ["quad_stretch", "hamstring_stretch"]).map(id => ({ ex: id, sec: 45 }))
        };
        const focus = window.FitEngine.FOCUS_META[d.focus] || {};
        startCourseObj(course, focus.short || "力量", wd);
      };
      this.periodGate(go, "w17_period_flow");
    },
    seedCoach() {
      const S = this.S;
      const streak = this.streakObj();
      const tips = window.FitEngine.coachDaily(this.todayLog(), S.plan, S.profile, streak, this.cyc());
      S.coachMsgs = [
        { role: "ai", text: "你好，我是你的 AI 健康教练🔥 我看过你今天的记录了，先说重点：" },
        { role: "ai", text: tips.map(t => t.icon + " " + t.text).join("\n") },
        { role: "ai", text: "下面可以问我：今天吃什么？今天练什么？为什么不掉秤？怎么增肌？生理期怎么练？" }
      ];
      store.save();
    },

    /* ---------- 海报 ---------- */
    makePoster() {
      const S = this.S;
      const streak = this.streakObj();
      const range = this.rangeLogs(30);
      let trainCnt = 0, trainMin = 0, fullDays = 0;
      range.forEach(l => {
        if (!l) return;
        if ((l.workouts || []).length) { trainCnt++; trainMin += l.workouts.reduce((a, b) => a + b.min, 0); }
        if (window.FitEngine.dayStatus(l, S.plan).full) fullDays++;
      });
      const hist = window.FitEngine.weightHistory(S.logs);
      const wTxt = hist.length >= 2 ? hist[0].w + " → " + hist[hist.length - 1].w + " kg" : (S.profile.weight + " kg");
      try {
        const cv = document.createElement("canvas");
        cv.width = 750; cv.height = 1000;
        const x = cv.getContext("2d");
        const grad = x.createLinearGradient(0, 0, 0, 1000);
        grad.addColorStop(0, "#FFF1E6"); grad.addColorStop(0.4, "#FAFBFF"); grad.addColorStop(1, "#F3F0FF");
        x.fillStyle = grad; x.fillRect(0, 0, 750, 1000);
        const og = x.createLinearGradient(0, 0, 750, 300);
        og.addColorStop(0, "#FF9A5A"); og.addColorStop(1, "#FF7A3D");
        x.fillStyle = og; x.fillRect(0, 0, 750, 10);
        x.fillStyle = "#FF7A3D"; x.font = "800 54px sans-serif";
        x.fillText("FitDay", 60, 120);
        x.fillStyle = "#2B2F3A"; x.font = "700 30px sans-serif";
        x.fillText("燃动日记 · 成长报告", 60, 170);
        x.fillStyle = "#8A90A3"; x.font = "400 22px sans-serif";
        x.fillText(new Date().toLocaleDateString("zh-CN") + " · 近30天", 60, 210);
        const rows = [
          ["🔥", "连续打卡", streak.days + " 天"],
          ["🏃", "完成训练", trainCnt + " 次 · " + trainMin + " 分钟"],
          ["✨", "三环全亮", fullDays + " 天"],
          ["⚖", "体重记录", wTxt],
          ["💧", "每日饮水", S.plan.water + " ml"]
        ];
        rows.forEach((r, i) => {
          const y = 300 + i * 108;
          x.fillStyle = "#FFFFFF";
          x.beginPath();
          if (x.roundRect) x.roundRect(60, y - 58, 630, 88, 22); else x.rect(60, y - 58, 630, 88);
          x.fill();
          x.strokeStyle = "#F0E4DC"; x.lineWidth = 2; x.stroke();
          x.font = "400 40px sans-serif"; x.fillText(r[0], 90, y + 8);
          x.fillStyle = "#8A90A3"; x.font = "400 24px sans-serif"; x.fillText(r[1], 160, y - 4);
          x.fillStyle = "#2B2F3A"; x.font = "800 30px sans-serif"; x.fillText(r[2], 160, y + 30);
        });
        x.fillStyle = "#8A90A3"; x.font = "400 24px sans-serif";
        x.fillText("每一天的坚持，都在塑造更好的自己。", 60, 900);
        x.fillStyle = "#C2C7D6"; x.font = "400 18px sans-serif";
        x.fillText("由 FitDay 燃动日记生成 · Start Today, Become Better.", 60, 944);
        const url = cv.toDataURL("image/png");
        App.showModal(`<h4>🖼 成长海报已生成</h4>
          <img src="${url}" style="width:100%;border-radius:14px;margin-bottom:14px">
          <a class="btn" href="${url}" download="fitday-report.png" style="text-decoration:none">保存/分享海报</a>
          <button class="btn ghost" data-action="closeModal" style="margin-top:10px">关闭</button>`);
      } catch (e) {
        App.toast("海报生成失败：" + e.message);
      }
    }
  };

  /* ============================================================
     训练执行引擎
     ============================================================ */
  let WO = null, woTimer = null;

  function buildSteps(course) {
    const steps = [];
    if (course.type === "circuit") {
      (course.warmup || []).forEach(b => steps.push({ phase: "work", ex: b.ex, sec: b.sec || 60, label: "热身" }));
      for (let r = 1; r <= (course.rounds || 1); r++)
        course.main.forEach(b => {
          steps.push({ phase: "work", ex: b.ex, sec: b.work, label: "第" + r + "/" + course.rounds + "轮" });
          steps.push({ phase: "rest", ex: b.ex, sec: b.rest, label: "第" + r + "/" + course.rounds + "轮" });
        });
      (course.cooldown || []).forEach(b => steps.push({ phase: "work", ex: b.ex, sec: b.sec || 45, label: "放松" }));
    } else if (course.type === "guide") {
      (course.segments || []).forEach(s => steps.push({ phase: "work", ex: s.ex, sec: s.min * 60, label: s.name }));
    } else { /* single */
      for (let r = 1; r <= 3; r++) {
        steps.push({ phase: "work", ex: course.singleEx, sec: 40, label: "第" + r + "/3组" });
        steps.push({ phase: "rest", ex: course.singleEx, sec: 20, label: "第" + r + "/3组" });
      }
    }
    return steps;
  }

  function startCourseObj(course, tag, wd) {
    if (!course) return;
    const steps = buildSteps(course);
    WO = {
      mode: course.type === "strength" ? "strength" : "timer",
      course, steps, idx: 0,
      remain: steps.length ? steps[0].sec : 0,
      total: steps.reduce((a, b) => a + b.sec, 0),
      elapsed: 0, paused: false, done: false,
      tag: tag || null, wd: wd == null ? App.weekdayIdx() : wd,
      setsDone: course.type === "strength" ? course.blocks.map(b => Array(b.sets).fill(false)) : null,
      rest: null
    };
    openWO();
    woTimer = setInterval(woTick, 1000);
  }

  function startCourseById(id) {
    const c = window.findCourse(id);
    if (!c) return;
    const go = () => {
      App.closeModal();
      const CAT_TAG = { beginner: "跟练", fatloss: "HIIT", shape: "塑形", muscle: "力量", cardio: "有氧", recovery: "拉伸", gentle: "舒缓" };
      startCourseObj(c, CAT_TAG[c.cat] || "运动", App.weekdayIdx());
    };
    if (c.type === "strength" || c.cat === "fatloss") App.periodGate(go, "w17_period_flow");
    else go();
  }

  /* 训练中看真人示范（暂停计时） */
  function exVideoModal(exId) {
    const ex = window.findEx(exId);
    if (!ex) return;
    if (WO && !WO.paused) { WO.paused = true; renderWOMain(); }
    const v = window.findExVideo ? window.findExVideo(exId) : null;
    const body = v && v.bvid
      ? `<div class="video-card"><iframe src="${window.biliEmbed(v.bvid)}" scrolling="no" frameborder="no" allowfullscreen="true" sandbox="allow-scripts allow-same-origin allow-presentation" referrerpolicy="no-referrer"></iframe>
         <div class="video-meta"><span class="vm-title">📺 ${ex.name} · 真人示范</span></div></div>`
      : `<div class="video-card video-empty"><div class="ve-tip">🎬 「${ex.name}」暂无精选视频</div>
         <a class="vid-btn bili" href="${window.biliSearch(ex.name + " 标准动作 教学")}" target="_blank" rel="noopener"><i>📺</i>去B站搜「${ex.name}」教学</a></div>`;
    App.showModal(`<h4>📹 ${ex.name} · 真人示范</h4>${body}
      <div class="mbtns" style="margin-top:10px"><button class="btn" data-action="closeModal">看完了，继续练</button></div>`);
  }

  function startSingleEx(id) {
    const ex = window.findEx(id);
    if (!ex) return;
    WO = {
      mode: "timer",
      course: { id: null, name: "单独练习 · " + ex.name, singleEx: id, type: "single" },
      steps: buildSteps({ singleEx: id, type: "single" }),
      idx: 0, remain: 40, total: 6 * 60, elapsed: 0, paused: false, done: false, rest: null
    };
    openWO();
    woTimer = setInterval(woTick, 1000);
  }

  function woCur() { return WO && WO.steps[WO.idx]; }
  function woEx(id) { return window.findEx(id); }

  function openWO() {
    let el = $("#wo");
    if (!el) {
      el = document.createElement("div");
      el.id = "wo"; el.className = "workout";
      $("#frame").appendChild(el);
    }
    el.classList.remove("hidden");
    renderWOMain();
  }
  function closeWO() {
    clearInterval(woTimer); woTimer = null;
    const el = $("#wo"); if (el) el.classList.add("hidden");
    WO = null;
    App.render();
  }

  function woTick() {
    if (!WO) return;
    if (WO.mode === "strength") {
      if (WO.rest && !WO.paused) {
        WO.rest.remain--;
        if (WO.rest.remain <= 0) {
          App.beep(3);
          const r = WO.rest; WO.rest = null;
          updateRestUI(null);
          App.toast("休息结束，继续下一组 💪");
          if (allSetsDone()) finishWO();
          return;
        }
        updateRestUI(WO.rest);
      }
      return;
    }
    if (WO.paused || WO.done) return;
    const cur = woCur();
    if (!cur) return;
    WO.remain--; WO.elapsed++;
    if (WO.remain <= 0) {
      if (cur.phase === "work") App.beep(1);
      advanceStep();
    } else updateTimerUI();
  }

  function advanceStep(auto) {
    if (!WO) return;
    WO.idx++;
    if (WO.idx >= WO.steps.length) { finishWO(); return; }
    WO.remain = WO.steps[WO.idx].sec;
    renderWOMain();
  }

  function allSetsDone() {
    if (!WO || WO.mode !== "strength") return false;
    return WO.setsDone.every(arr => arr.every(Boolean));
  }

  function finishWO() {
    if (!WO || WO.done) return;
    WO.done = true;
    const c = WO.course;
    let min, kcal;
    if (WO.mode === "strength") {
      const st = window.courseStats(c, App.S.profile.weight);
      const total = c.blocks.reduce((a, b, i) => a + b.sets, 0);
      const did = WO.setsDone.reduce((a, arr) => a + arr.filter(Boolean).length, 0);
      const frac = did / (total || 1);
      min = st.min * frac; kcal = st.kcal * frac;
    } else {
      const st = c.type === "single" ? { kcal: window.exKcal(woEx(c.singleEx), App.S.profile.weight, WO.elapsed / 60) } : window.courseStats(c, App.S.profile.weight);
      const frac = WO.total ? WO.elapsed / WO.total : 0;
      min = WO.elapsed / 60;
      kcal = c.type === "single" ? st.kcal : st.kcal * frac;
    }
    App.logWorkout(c.id || null, c.name, min, kcal, WO.tag, WO.wd);
    clearInterval(woTimer); woTimer = null;
    const el = $("#wo"); if (el) el.classList.add("hidden");
    WO = null;
    App.closeModal();
    App.render();
    App.toast("训练完成 🔥 已记录 " + Math.round(min) + " 分钟 / " + Math.round(kcal) + " kcal", true);
  }

  function woExitConfirm() {
    if (!WO) return;
    const did = WO.mode === "strength"
      ? WO.setsDone.reduce((a, arr) => a + arr.filter(Boolean).length, 0)
      : WO.idx;
    if (did === 0 && !WO.rest) {
      App.showModal(`<h4>放弃本次训练？</h4><div class="mp">还没有完成任何内容，进度将不会被记录。</div>
        <div class="mbtns"><button class="btn ghost" data-action="closeModal">继续训练</button>
        <button class="btn danger" data-action="woQuit">放弃</button></div>`);
    } else {
      App.showModal(`<h4>结束训练？</h4><div class="mp">已完成的部${WO.mode === "strength" ? "分组数" : "分时长"}会记录下来。</div>
        <div class="mbtns"><button class="btn ghost" data-action="closeModal">继续训练</button>
        <button class="btn" data-action="woFinishEarly">结束并记录</button>
        <button class="btn danger" data-action="woQuit">放弃</button></div>`);
    }
  }

  function renderWOMain() {
    const el = $("#wo"); if (!el || !WO) return;
    const V = window.Views;
    const step = woCur();
    if (WO.mode === "strength") { renderWOStrength(el); return; }
    const ex = step ? woEx(step.ex) : null;
    const isRest = step && step.phase === "rest";
    const pct = step ? 1 - WO.remain / (step.sec || 1) : 0;
    const C = 2 * Math.PI * 66;
    const next = WO.steps[WO.idx + 1];
    el.innerHTML = `
      <div class="wo-top"><span class="wo-title">${WO.course.name} · ${WO.idx + 1}/${WO.steps.length}</span>
        <button class="wo-exit" data-action="woExit">‹ 退出</button></div>
      <div class="wo-progress">${WO.steps.map((s, i) => `<i class="${i < WO.idx ? "on" : i === WO.idx ? "cur" : ""}"></i>`).join("")}</div>
      <div class="wo-body">
        <div class="wo-phase">${isRest ? "R E S T · 休息一下" : "W O R K · 跟上节奏"}</div>
        <div class="wo-name">${isRest ? "休息" : (ex ? ex.name : step.label)}</div>
        <div class="wo-sets">${step.label}${!isRest && ex ? " · " + ex.target.join("·") : ""}</div>
        <svg class="wo-ring" viewBox="0 0 150 150">
          <circle cx="75" cy="75" r="66" fill="none" stroke="#232936" stroke-width="10"/>
          <circle id="wo-arc" cx="75" cy="75" r="66" fill="none" stroke="${isRest ? "#C6FF4D" : "#FF6B2C"}" stroke-width="10"
            stroke-linecap="round" stroke-dasharray="${C.toFixed(0)}" stroke-dashoffset="${(C * (1 - pct)).toFixed(0)}" transform="rotate(-90 75 75)"/>
        </svg>
        <div class="wo-timer ${isRest ? "rest" : "work"}" id="wo-timer">${fmt(WO.remain)}</div>
        <div class="wo-next">${next ? "下一个：" + (next.phase === "rest" ? "休息 " + next.sec + "s" : (woEx(next.ex) || {}).name) : "即将完成 🎉"}</div>
        ${!isRest && ex && window.exGif && window.exGif(ex.id) ? `<div class="wo-demo"><div class="exa-card" style="width:170px;height:170px"><img src="${window.exGif(ex.id)}" alt="${ex.name} 演示" style="width:100%;height:100%;object-fit:contain;background:#fff"></div></div>`
          : !isRest && ex && window.exImg && window.exImg(ex.id) ? `<div class="wo-demo"><div class="exa-card" style="width:170px;height:150px"><img src="${window.exImg(ex.id)}" alt="${ex.name} 演示" style="width:100%;height:100%;object-fit:cover"></div></div>`
          : !isRest && ex && window.ExAnim ? `<div class="wo-demo">${window.ExAnim.demo(ex, { w: 170, h: 150 })}</div>` : ""}
        ${!isRest && ex ? `<div class="wo-tips"><b>${V.esc(ex.name)}</b>：${ex.tips[0]} · ${ex.tips[1] || ""}<br>🫁 ${ex.breath} · <button class="link" data-action="woVideo" data-id="${ex.id}" style="background:none;border:none;padding:0;cursor:pointer">📹 看真人示范</button></div>` : ""}
        <div class="wo-actions">
          <button class="btn ghost" data-action="woPrev">‹ 上一步</button>
          <button class="btn" data-action="woPause">${WO.paused ? "继续" : "暂停"}</button>
          <button class="btn ghost" data-action="woNext">跳过 ›</button>
        </div>
      </div>`;
  }

  function renderWOStrength(el) {
    const c = WO.course;
    el.innerHTML = `
      <div class="wo-top"><span class="wo-title">${c.name}</span>
        <button class="wo-exit" data-action="woExit">‹ 退出</button></div>
      <div id="wo-restbar" style="padding:0 22px">${WO.rest ? restBarHTML() : ""}</div>
      <div class="wo-body">
        <div class="sub" style="margin-bottom:6px">完成一组 → 点对应的组数按钮打卡，自动开始组间休息</div>
        <div class="wo-list">
        ${c.blocks.map((b, bi) => {
          const ex = woEx(b.ex);
          const doneAll = WO.setsDone[bi].every(Boolean);
          return `<div class="wo-exrow ${doneAll ? "resting" : ""}" >
            <div class="ex-ic">${window.Views.exIcon(ex)}</div>
            <div class="we-info"><b>${ex ? ex.name : b.ex}</b><span>${b.sets}组 × ${b.reps} · 休${b.rest}s ${ex ? "· " + ex.target.join("·") : ""}</span></div>
            ${ex ? `<button class="setbtn" data-action="woVideo" data-id="${ex.id}" title="看真人示范" style="width:auto;padding:0 9px;font-size:14px">📹</button>` : ""}
            <div class="ws">${WO.setsDone[bi].map((v, si) =>
              `<button class="setbtn ${v ? "on" : ""}" data-action="woSet" data-b="${bi}" data-s="${si}">${si + 1}</button>`).join("")}</div>
          </div>`;
        }).join("")}
        </div>
        ${c.warmup && c.warmup.length ? `<div class="wo-tips">🌅 热身：${c.warmup.map(b => (woEx(b.ex) || {}).name).join("、")}</div>` : ""}
        ${c.cooldown && c.cooldown.length ? `<div class="wo-tips">🌙 练完别走：${c.cooldown.map(b => (woEx(b.ex) || {}).name).join("、")}</div>` : ""}
        <div class="wo-actions">
          <button class="btn ghost" data-action="woFinishEarly">结束并记录</button>
          <button class="btn" data-action="woPause">${WO.paused ? "继续" : "暂停休息计时"}</button>
        </div>
      </div>`;
    if (WO.rest) updateRestUI(WO.rest);
  }

  function restBarHTML() {
    const C = 2 * Math.PI * 30;
    const pct = 1 - WO.rest.remain / WO.rest.sec;
    const ex = woEx(WO.rest.ex);
    return `<div style="display:flex;align-items:center;gap:12px;background:rgba(198,255,77,.08);border:1px solid rgba(198,255,77,.25);border-radius:14px;padding:10px 14px;margin:8px 0">
      <svg viewBox="0 0 80 80" style="width:56px;height:56px;flex:none">
        <circle cx="40" cy="40" r="30" fill="none" stroke="#232936" stroke-width="7"/>
        <circle id="rest-arc" cx="40" cy="40" r="30" fill="none" stroke="#C6FF4D" stroke-width="7" stroke-linecap="round"
          stroke-dasharray="${C.toFixed(0)}" stroke-dashoffset="${(C * (1 - pct)).toFixed(0)}" transform="rotate(-90 40 40)"/>
        <text x="40" y="46" text-anchor="middle" fill="#C6FF4D" font-size="17" font-weight="800" id="rest-num">${WO.rest.remain}</text>
      </svg>
      <div style="flex:1;font-size:13px"><b>组间休息</b> · ${WO.rest.sec}s<br><span class="small">休息结束自动响铃 · ${ex ? ex.name : ""} 下一组</span></div>
      <button class="btn small ghost" data-action="woSkipRest">跳过</button>
    </div>`;
  }
  function updateRestUI(rest) {
    const bar = $("#wo-restbar");
    if (!bar) return;
    if (!rest) { bar.innerHTML = ""; return; }
    bar.innerHTML = restBarHTML();
  }

  function updateTimerUI() {
    const t = $("#wo-timer");
    if (t && woCur()) t.textContent = fmt(WO.remain);
    const arc = $("#wo-arc");
    if (arc && woCur()) {
      const pct = 1 - WO.remain / (woCur().sec || 1);
      const C = 2 * Math.PI * 66;
      arc.setAttribute("stroke-dashoffset", (C * (1 - pct)).toFixed(0));
    }
  }

  function fmt(s) {
    s = Math.max(0, s);
    return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60);
  }

  /* ============================================================
     PhotoDB：IndexedDB 照片库（身材记录，自由拍·可多张）
     ============================================================ */
  window.PhotoDB = (function () {
    let dbp = null;
    function open() {
      if (dbp) return dbp;
      dbp = new Promise((res, rej) => {
        const rq = indexedDB.open("fitday-photos-pro", 1);
        rq.onupgradeneeded = e => { e.target.result.createObjectStore("photos", { keyPath: "id" }); };
        rq.onsuccess = e => res(e.target.result);
        rq.onerror = e => rej(e.target.error);
      });
      return dbp;
    }
    async function put(rec) {
      const db = await open();
      return new Promise((res, rej) => {
        const tx = db.transaction("photos", "readwrite");
        tx.objectStore("photos").put(rec);
        tx.oncomplete = res; tx.onerror = () => rej(tx.error);
      });
    }
    async function get(id) {
      const db = await open();
      return new Promise((res, rej) => {
        const rq = db.transaction("photos").objectStore("photos").get(id);
        rq.onsuccess = () => res(rq.result || null); rq.onerror = () => rej(rq.error);
      });
    }
    async function all() {
      const db = await open();
      return new Promise((res, rej) => {
        const rq = db.transaction("photos").objectStore("photos").getAll();
        rq.onsuccess = () => res(rq.result || []); rq.onerror = () => rej(rq.error);
      });
    }
    async function del(id) {
      const db = await open();
      return new Promise((res, rej) => {
        const tx = db.transaction("photos", "readwrite");
        tx.objectStore("photos").delete(id);
        tx.oncomplete = res; tx.onerror = () => rej(tx.error);
      });
    }
    return { put: put, get: get, all: all, del: del };
  })();

  /* 压缩图片：长边 1024，jpeg 0.82 */
  function compressImage(dataURL) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => {
        const long = Math.max(img.width, img.height);
        const scale = Math.min(1, 1024 / long);
        const cv = document.createElement("canvas");
        cv.width = Math.round(img.width * scale); cv.height = Math.round(img.height * scale);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        res(cv.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => rej(new Error("图片读取失败"));
      img.src = dataURL;
    });
  }

  function refreshPhotoCache() {
    return PhotoDB.all().then(list => {
      list.sort((a, b) => (a.date + a.takenAt < b.date + b.takenAt ? 1 : -1));
      App.photoCache = list;
      return list;
    }).catch(() => []);
  }

  /* ============================================================
     FitUI：搜索过滤与文件导入
     ============================================================ */
  window.FitUI = {
    _fcat: "all", _meal: null,
    exSearch(v) { const el = $("#ex-list"); if (el) el.innerHTML = window.Views.exListHTML(v); },
    foodSearch(v) { const el = $("#food-results"); if (el) el.innerHTML = window.Views.foodResultsHTML(this._fcat, v); },
    /* 自由拍照：想拍就拍，一天可多张（可选补记日期） */
    photoFile(input) {
      const f = input.files && input.files[0];
      input.value = "";
      if (!f) return;
      if (!/^image\//.test(f.type)) return App.toast("请选择图片文件");
      const date = ($("#ph-date") || {}).value || App.todayKey();
      const rd = new FileReader();
      rd.onload = () => {
        compressImage(rd.result).then(dataURL => {
          return PhotoDB.put({ id: "p" + Date.now() + Math.floor(Math.random() * 999), date: date, data: dataURL, takenAt: new Date().toISOString() });
        }).then(() => {
          const log = App.S.logs[date] || (App.S.logs[date] = {});
          log.photos = (log.photos || 0) + 1;
          store.save();
          return refreshPhotoCache();
        }).then(() => {
          App.closeSheet(); App.render();
          App.notify("📸 已记录！坚持拍，变化看得见", true);
        }).catch(e => App.toast("保存失败：" + e.message));
      };
      rd.readAsDataURL(f);
    },
    /* 头像上传：读图 → 居中裁方 → 压缩 480px JPEG → 存本机 */
    avatarFile(input) {
      const f = input.files && input.files[0];
      input.value = "";
      if (!f) return;
      if (!/^image\//.test(f.type)) return App.toast("请选择图片文件（JPG/PNG）");
      const rd = new FileReader();
      rd.onload = () => {
        const img = new Image();
        img.onload = () => {
          try {
            const S = 480;
            const side = Math.min(img.width, img.height);
            const cv = document.createElement("canvas");
            cv.width = S; cv.height = S;
            const x = cv.getContext("2d");
            x.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, S, S);
            const url = cv.toDataURL("image/jpeg", 0.82);
            if (url.length > 300000) return App.toast("图片太大，换一张小点的试试");
            App.S.profile.avatar = url;
            store.save();
            App.showSheet(window.Views.sheetAvatar());
            App.render();
            App.toast("头像已更新 ✓", true);
          } catch (e) { App.toast("处理失败：" + e.message); }
        };
        img.onerror = () => App.toast("图片读取失败");
        img.src = rd.result;
      };
      rd.readAsDataURL(f);
    },
    importFile(input) {
      const f = input.files && input.files[0];
      if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        try {
          const data = JSON.parse(rd.result);
          if (!data.profile || !data.plan) throw new Error("文件格式不对");
          const photos = data.photos || [];
          delete data.photos;
          App.S = data;
          store.save();
          App.closeSheet();
          App.applyTheme(App.S.settings.theme);
          App.applyFont(App.S.settings.fontSize);
          const restore = photos.length
            ? Promise.all(photos.map(p => PhotoDB.put({ id: "p" + (p.takenAt || p.date).replace(/[^0-9]/g, "") + Math.floor(Math.random() * 999), date: p.date, data: p.data, takenAt: p.takenAt || p.date + "T12:00:00.000Z" }))).then(() => refreshPhotoCache())
            : refreshPhotoCache();
          restore.then(list => {
            App.render();
            App.toast(list.length ? "导入成功，含 " + list.length + " 张照片 ✓" : "导入成功，数据已恢复 ✓", true);
          });
        } catch (e) { App.toast("导入失败：" + e.message); }
      };
      rd.readAsText(f);
    }
  };

  /* ============================================================
     动作分发
     ============================================================ */
  function dispatch(action, el) {
    const A = App, V = window.Views, E = window.FitEngine;
    const [act, arg] = action.split("|");

    switch (act) {
      /* 引导 */
      case "obNext":
        if (A.S.ui.obStep === 1) {
          const name = $("#ob-name").value.trim();
          const age = +$("#ob-age").value, h = +$("#ob-height").value, w = +$("#ob-weight").value;
          if (!name) return A.toast("先告诉我你的昵称吧");
          if (!age || age < 10 || age > 90 || !h || h < 100 || h > 250 || !w || w < 25 || w > 300)
            return A.toast("请填写正确的年龄/身高/体重");
          Object.assign(A.S.ui.obData, { name, age, height: h, weight: w });
        }
        A.S.ui.obStep = Math.min(3, A.S.ui.obStep + 1);
        store.save(); A.render(); break;
      case "obPrev": A.S.ui.obStep = Math.max(0, A.S.ui.obStep - 1); store.save(); A.render(); break;
      case "obSet": A.S.ui.obData[el.dataset.k] = el.dataset.v; store.save(); A.render(); break;
      case "obToggleDay": {
        const d = A.S.ui.obData;
        let arr = String(d.days || "1,3,5").split(",").map(s => parseInt(s, 10)).filter(n => n >= 0 && n <= 6);
        const day = +el.dataset.v;
        if (arr.includes(day)) {
          if (arr.length <= 2) return A.toast("至少留2天，AI才能安排分化哦");
          arr = arr.filter(x => x !== day);
        } else {
          if (arr.length >= 6) return A.toast("留一天休息吧——肌肉是在休息时生长的🌱");
          arr.push(day);
        }
        d.days = arr.sort((a, b) => a - b).join(",");
        store.save(); A.render(); break;
      }
      case "obDayTime": {
        const d = A.S.ui.obData;
        if (!d.dayTimes) d.dayTimes = {};
        d.dayTimes[+el.dataset.wd] = el.dataset.v;
        store.save(); A.render(); break;
      }
      case "obGen": {
        const d = A.S.ui.obData;
        const daysArr = String(d.days || "1,3,5").split(",").map(s => parseInt(s, 10)).filter(n => n >= 0 && n <= 6);
        if (!d.sex || !d.goal || !d.level || !d.activity || !d.timePref || !d.equip) return A.toast("还有选项没选完哦");
        if (daysArr.length < 2) return A.toast("至少选2天有时间，AI才能安排分化哦");
        A.S.ui.obStep = 3.5; A.render();
        const dayNames = daysArr.slice().sort((a, b) => a - b).map(x => "周" + "一二三四五六日"[x]).join("、");
        const seq = ["计算基础代谢 BMR →", "估算每日消耗 TDEE →", "确定热量与三大营养素 →", "在" + dayNames + "安排分化训练 →", "分配动作/组数/起始重量 →", "分配饮水与提醒 →"];
        let i = 0;
        const t = setInterval(() => {
          const gt = $("#gen-text");
          if (gt && seq[i]) gt.textContent = seq[i];
          i++;
          if (i > seq.length) {
            clearInterval(t);
            /* 收集按天时间：时段 chips + 精确钟点 */
            const dayTimes = Object.assign({}, d.dayTimes || {});
            const dayTimesExact = Object.assign({}, d.dayTimesExact || {});
            document.querySelectorAll("input[data-role=obExact]").forEach(inp => {
              if (inp.value) dayTimesExact[inp.dataset.wd] = inp.value;
            });
            A.S.profile = {
              name: d.name, sex: d.sex, age: +d.age, height: +d.height, weight: +d.weight,
              level: d.level, goal: d.goal, days: d.days, daysPerWeek: daysArr.length,
              timePref: d.timePref, equip: d.equip,
              activity: d.activity, trainPref: d.timePref,
              dayTimes: dayTimes, dayTimesExact: dayTimesExact
            };
            window._obPlan = E.buildPlan(A.S.profile);
            A.S.plan = window._obPlan;
            A.S.ui.obStep = 4;
            store.save(); A.render();
          }
        }, 700);
        break;
      }
      case "obFinish": {
        if (window._obPlan) A.S.plan = window._obPlan;
        if (!A.S.plan && A.S.profile) A.S.plan = E.buildPlan(A.S.profile);
        A.S.ui.obStep = 0;
        A.S.obDone = true;
        store.save();
        if (!A.S.coachMsgs || !A.S.coachMsgs.length) A.seedCoach();
        A.navigate("home", null, false);
        A.toast("欢迎来到 FitDay！今天就开始第一次训练吧 🔥", true);
        A.askNotifPermission();
        break;
      }

      /* 导航 */
      case "nav": A.navigate(arg || el.dataset.nav); break;
      case "back": A.back(); break;

      /* 训练 */
      case "course": A.closeSheet(); A.navigate("course", el.dataset.id); break;
      case "ex": A.closeSheet(); A.navigate("exercise", el.dataset.id); break;
      case "planDay": A.showSheet(V.sheetPlanDay(+el.dataset.wd)); break;
      case "startPlanDay": A.closeSheet(); A.startPlanDay(+el.dataset.wd || A.weekdayIdx()); break;
      case "courseCat": {
        A.S.ui.courseCat = el.dataset.v;
        document.querySelectorAll("#course-chips .chip").forEach(c => c.classList.toggle("on", c.dataset.v === el.dataset.v));
        $("#course-list").innerHTML = V.courseListHTML(el.dataset.v);
        break;
      }
      case "startCourse":
        startCourseById(arg || el.dataset.id); break;
      case "startSingle":
        startSingleEx(el.dataset.id); break;
      case "woExit": woExitConfirm(); break;
      case "woQuit": { const el2 = $("#wo"); if (el2) el2.classList.add("hidden"); clearInterval(woTimer); WO = null; A.closeModal(); A.render(); break; }
      case "woFinishEarly": finishWO(); break;
      case "woPause":
        if (WO) {
          WO.paused = !WO.paused;
          if (WO.mode === "strength") renderWOMain(); else renderWOMain();
        } break;
      case "woNext": advanceStep(); break;
      case "woPrev":
        if (WO && WO.idx > 0) { WO.idx--; WO.remain = WO.steps[WO.idx].sec; renderWOMain(); } break;
      case "woSet": {
        const b = +el.dataset.b, s = +el.dataset.s;
        if (!WO) break;
        WO.setsDone[b][s] = !WO.setsDone[b][s];
        if (WO.setsDone[b][s]) {
          const block = WO.course.blocks[b];
          WO.rest = { sec: block.rest || 60, remain: block.rest || 60, ex: block.ex, blockIdx: b };
          App.beep(1);
        } else WO.rest = null;
        store.save();
        renderWOMain();
        if (allSetsDone()) { App.toast("全部组数完成 🎉"); finishWO(); }
        break;
      }
      case "woSkipRest": if (WO) { WO.rest = null; updateRestUI(null); renderWOMain(); } break;
      case "woVideo": exVideoModal(el.dataset.id); break;
      case "goOnTrain": {
        A.closeModal();
        if (typeof A._goOn === "function") { const f = A._goOn; A._goOn = null; f(); }
        break;
      }

      /* 主题与生理期 */
      case "openTheme": A.showSheet(V.sheetTheme()); break;
      case "setTheme": {
        A.S.settings.theme = el.dataset.v;
        A.applyTheme(el.dataset.v);
        store.save();
        A.showSheet(V.sheetTheme());
        A.toast("已切换主题 🎨 " + el.dataset.v);
        break;
      }
      case "openFont": A.showSheet(V.sheetFont()); break;
      case "setFont": {
        A.S.settings.fontSize = el.dataset.v;
        A.applyFont(el.dataset.v);
        store.save();
        A.showSheet(V.sheetFont());
        A.render();
        break;
      }
      case "openCycle": A.showSheet(V.sheetCycle()); break;
      case "cycleSave": {
        if (!A.S.cycles) A.S.cycles = { enabled: true, starts: [], periodLen: 5, cycleLen: 28 };
        const cy = A.S.cycles;
        const last = ($("#cy-last") || {}).value;
        const plen = +($("#cy-plen") || {}).value;
        const clen = +($("#cy-clen") || {}).value;
        if (last) {
          cy.starts = (cy.starts || []).filter(s => s !== last);
          cy.starts.push(last);
        } else if (!(cy.starts || []).length) { A.toast("请先选择最近一次月经开始日期"); break; }
        if (plen >= 2 && plen <= 10) cy.periodLen = plen;
        if (clen >= 21 && clen <= 45) cy.cycleLen = clen;
        store.save();
        A.closeSheet(); A.render();
        A.toast("生理期管理已保存 🌸 训练会自动适配", true);
        break;
      }
      case "cycleDel": {
        if (!A.S.cycles) break;
        A.S.cycles.starts = (A.S.cycles.starts || []).filter(s => s !== el.dataset.v);
        store.save(); A.showSheet(V.sheetCycle());
        break;
      }

      /* 饮食 */
      case "foodCat": {
        FitUI._fcat = el.dataset.v;
        document.querySelectorAll("#food-chips .chip").forEach(c => c.classList.toggle("on", c.dataset.v === el.dataset.v));
        const kw = ($("#food-search") || {}).value || "";
        $("#food-results").innerHTML = V.foodResultsHTML(el.dataset.v, kw);
        break;
      }
      case "foodPick": {
        const f = window.findFood(el.dataset.id);
        if (!f) break;
        FitUI._meal = App.guessMeal();
        A.showSheet(V.sheetFood(f));
        break;
      }
      case "setGrams": {
        const inp = $("#sheet-grams"); if (inp) inp.value = el.dataset.g;
        updateSheetKcal();
        break;
      }
      case "pickMeal": {
        FitUI._meal = el.dataset.v;
        document.querySelectorAll("#meal-chips .chip").forEach(c => c.classList.toggle("on", c.dataset.v === el.dataset.v));
        break;
      }
      case "dietAddConfirm": {
        const f = window.findFood(el.dataset.id);
        const gEl = $("#sheet-grams");
        const g = Math.round(+(gEl ? gEl.value : 100));
        if (!f || !g || g <= 0) return A.toast("请输入正确的克数");
        const n = window.foodNutri(f, g);
        const log = A.todayLog();
        if (!log.diet) log.diet = [];
        log.diet.push({ foodId: f.id, name: f.name, g, kcal: n.kcal, p: n.p, f: n.f, c: n.c, meal: FitUI._meal || A.guessMeal(), t: new Date().toTimeString().slice(0, 5) });
        store.save();
        A.closeSheet();
        A.render();
        A.toast("已记录 " + f.name + " " + g + "g · +" + n.kcal + "kcal ✓");
        break;
      }
      case "dietDel": {
        const log = A.todayLog();
        (log.diet || []).splice(+el.dataset.idx, 1);
        store.save(); A.render();
        break;
      }
      case "focusSearch": {
        FitUI._meal = el.dataset.meal;
        const s = $("#food-search");
        if (s) { s.focus(); s.scrollIntoView({ behavior: "smooth", block: "center" }); }
        A.toast("已选中「" + el.dataset.meal + "」，搜索食物后点击＋即可记录");
        break;
      }
      case "customFoodOpen":
        A.showSheet(V.sheetCustomFood()); break;
      case "customFoodSave": {
        const name = $("#cf-name").value.trim();
        const kc = +$("#cf-kcal").value;
        if (!name || !kc) return A.toast("名称和热量必填");
        const f = { id: "cf_" + Date.now(), name, cat: "custom", kcal: kc, p: +$("#cf-p").value || 0, f: +$("#cf-f").value || 0, c: +$("#cf-c").value || 0, portion: { name: "1份", g: 100 } };
        let custom = [];
        try { custom = JSON.parse(localStorage.getItem("fitday_custom_foods") || "[]"); } catch (e) { }
        custom.push(f);
        localStorage.setItem("fitday_custom_foods", JSON.stringify(custom));
        A.closeSheet();
        const kw = ($("#food-search") || {}).value || "";
        $("#food-results").innerHTML = V.foodResultsHTML(FitUI._fcat, name);
        A.toast("已保存自定义食物，点击列表即可记录");
        break;
      }

      /* 饮水 */
      case "waterAdd": {
        const log = A.todayLog();
        if (!log.water) log.water = [];
        log.water.push({ ml: +el.dataset.ml, t: new Date().toTimeString().slice(0, 5) });
        store.save(); A.render(); App.beep(1);
        const total = log.water.reduce((a, b) => a + b.ml, 0);
        if (total >= A.S.plan.water) A.toast("今日饮水目标达成 ✓", true);
        break;
      }
      case "waterUndo": {
        const log = A.todayLog();
        if (log.water && log.water.length) { log.water.pop(); store.save(); A.render(); }
        break;
      }

      /* 日历/报告 */
      case "calPrev": A.S.ui.calM--; if (A.S.ui.calM < 0) { A.S.ui.calM = 11; A.S.ui.calY--; } store.save(); A.render(); break;
      case "calNext": A.S.ui.calM++; if (A.S.ui.calM > 11) { A.S.ui.calM = 0; A.S.ui.calY++; } store.save(); A.render(); break;
      case "calDay": {
        const key = el.dataset.date;
        const log = A.S.logs[key] || {};
        const st = E.dayStatus(log, A.S.plan);
        A.showSheet(`<div class="grab"></div><h3 style="margin:4px 0">${key} 的记录</h3>
          <div class="meal-line"><span class="mn">🏃 运动</span><span class="mk">${(log.workouts || []).map(w => w.name + " " + w.min + "min").join("、") || (st.fire ? "有训练" : "未记录")}</span></div>
          <div class="meal-line"><span class="mn">🍎 饮食</span><span class="mk">${(log.diet || []).length}条 · ${(log.diet || []).reduce((a, b) => a + b.kcal, 0)}kcal</span></div>
          <div class="meal-line"><span class="mn">💧 饮水</span><span class="mk">${(log.water || []).reduce((a, b) => a + b.ml, 0)}ml</span></div>
          ${log.weight ? `<div class="meal-line"><span class="mn">⚖ 体重</span><span class="mk">${log.weight}kg</span></div>` : ""}
          <div class="sub" style="margin-top:8px">${st.full ? "🎉 这一天三环全亮！" : "继续加油，三环全亮就能点亮这一天"}</div>`);
        break;
      }
      case "repSeg": A.S.ui.repSeg = el.dataset.v; store.save(); A.render(); break;
      case "repMetric": A.S.ui.repMetric = el.dataset.v; store.save(); A.render(); break;

      /* 身材记录（进阶）：自由拍照 + 三围 */
      case "openPhoto": A.showSheet(V.sheetPhotoTake()); break;
      case "photoPick": { const f = $("#ph-file"); if (f) f.click(); break; }
      case "openAlbum": A.navigate("album"); break;
      case "photoReveal": {
        A.S.ui.revealPhoto = !A.S.ui.revealPhoto;
        store.save(); A.render();
        break;
      }
      case "photoView": {
        const rec = (A.photoCache || []).find(p => p.id === el.dataset.id);
        if (!rec) break;
        const log = A.S.logs[rec.date] || {};
        A.showSheet(`<div class="grab"></div><h3 style="margin:4px 0">📸 ${rec.date}</h3>
          <img src="${rec.data}" style="width:100%;border-radius:14px" alt="身材照">
          <div class="small" style="margin:6px 0 10px">${log.measures && log.measures.weight ? "当日体重 " + log.measures.weight + "kg · " : ""}${(log.measures && log.measures.waist) ? "腰围 " + log.measures.waist + "cm" : ""} · 仅存于本机</div>
          <div class="mbtns"><button class="btn ghost" data-action="closeSheet">关闭</button>
          <button class="btn danger" data-action="photoDel" data-id="${rec.id}">删除</button></div>`);
        break;
      }
      case "photoDel": {
        const id = el.dataset.id;
        const rec = (A.photoCache || []).find(p => p.id === id);
        PhotoDB.del(id).then(() => {
          if (rec) {
            const log = A.S.logs[rec.date];
            if (log && log.photos) { log.photos--; if (log.photos <= 0) delete log.photos; store.save(); }
          }
          return refreshPhotoCache();
        }).then(() => {
          A.closeSheet(); A.render();
          A.toast("已删除");
        });
        break;
      }
      case "openCompare": {
        if (!A.photoCache || A.photoCache.length < 2) { A.toast("至少需要两张照片才能对比哦"); break; }
        A.showSheet(V.sheetCompare());
        break;
      }
      case "compareGo": {
        const a = $("#cmp-a"), b = $("#cmp-b");
        if (!a || !b || !a.value || !b.value || a.value === b.value) { A.toast("请选择两张不同的照片"); break; }
        A.showSheet(V.sheetCompareResult(a.value, b.value));
        break;
      }
      case "openMeasure": A.showSheet(V.sheetMeasure()); break;
      case "saveMeasure": {
        const log = A.todayLog();
        const keys = ["weight", "chest", "waist", "hip", "thigh", "arm"];
        const vals = {};
        let any = false;
        keys.forEach(k => {
          const v = +(($("#ms-" + k) || {}).value || 0);
          if (v > 0) { vals[k] = v; any = true; }
        });
        if (!any) { A.toast("至少填一项哦"); break; }
        log.measures = Object.assign(log.measures || {}, vals);
        if (vals.weight) log.weight = vals.weight;
        store.save();
        A.closeSheet(); A.render();
        A.toast("体型数据已记录 📏", true);
        break;
      }
      case "saveWeight": {
        const v = +($("#weight-in") || {}).value;
        if (!v || v < 25 || v > 300) return A.toast("请输入正确体重");
        const log = A.todayLog();
        log.weight = v;
        A.S.profile.weight = v;
        A.S.plan = E.buildPlan(A.S.profile);
        store.save(); A.render();
        A.toast("体重已记录，计划热量同步更新为 " + A.S.plan.intake + "kcal");
        break;
      }
      case "makePoster": A.makePoster(); break;

      /* AI教练 */
      case "coachQuick": sendCoach(el.dataset.v); break;
      case "coachSend": sendCoach(($("#coach-input") || {}).value); break;

      /* 我的 */
      case "editProfile":
        FitUI._pfDays = String(A.S.profile.days || "1,3,5").split(",").map(s => parseInt(s, 10)).filter(n => n >= 0 && n <= 6);
        A.showSheet(V.sheetProfile()); break;
      case "pfDay": {
        const day = +el.dataset.v;
        const arr = FitUI._pfDays;
        if (arr.includes(day)) {
          if (arr.length <= 2) { A.toast("至少留2天哦"); break; }
          FitUI._pfDays = arr.filter(x => x !== day);
        } else {
          if (arr.length >= 6) { A.toast("留一天休息吧🌱"); break; }
          FitUI._pfDays = [...arr, day].sort((a, b) => a - b);
        }
        A.showSheet(V.sheetProfile()); break;
      }
      case "pfDayTime": {
        const p = A.S.profile;
        if (!p.dayTimes) p.dayTimes = {};
        p.dayTimes[+el.dataset.wd] = el.dataset.v;
        store.save(); A.showSheet(V.sheetProfile()); break;
      }
      case "saveProfile": {
        const p = A.S.profile;
        const name = $("#pf-name").value.trim();
        const age = +$("#pf-age").value, h = +$("#pf-height").value, w = +$("#pf-weight").value;
        if (!name) return A.toast("昵称不能为空");
        if (!age || !h || !w) return A.toast("请填写完整");
        Object.assign(p, {
          name, sex: $("#pf-sex").value, age, height: h, weight: w,
          level: $("#pf-level").value, goal: $("#pf-goal").value,
          days: (FitUI._pfDays || []).join(","), daysPerWeek: (FitUI._pfDays || []).length,
          timePref: $("#pf-trainPref").value, trainPref: $("#pf-trainPref").value,
          equip: $("#pf-equip").value,
          activity: $("#pf-activity").value
        });
        if (!p.dayTimes) p.dayTimes = {};
        if (!p.dayTimesExact) p.dayTimesExact = {};
        document.querySelectorAll("input[data-role=pfExact]").forEach(inp => {
          if (inp.value) p.dayTimesExact[inp.dataset.wd] = inp.value;
          else delete p.dayTimesExact[inp.dataset.wd];
        });
        A.S.plan = E.buildPlan(p);
        store.save();
        A.closeSheet(); A.render();
        A.toast("档案已更新，计划已重新生成 ✓", true);
        break;
      }
      case "regenPlan":
        A.showModal(`<h4>重新生成计划？</h4><div class="mp">将按当前档案重新计算热量与课表，历史记录不受影响。</div>
          <div class="mbtns"><button class="btn ghost" data-action="closeModal">取消</button>
          <button class="btn" data-action="regenPlanGo">重新生成</button></div>`);
        break;
      case "regenPlanGo":
        A.S.plan = E.buildPlan(A.S.profile);
        store.save(); A.closeModal(); A.render();
        A.toast("计划已重新生成 ✓", true);
        break;
      case "openRemind":
        A.askNotifPermission();
        A.showSheet(V.sheetRemind()); break;
      case "testRemind": A.notify("测试提醒：该喝水啦💧 FitDay提醒正常工作！", true); break;
      case "openData": A.showSheet(V.sheetData()); break;
      case "exportData": {
        (async () => {
          try {
            A.toast("正在打包备份（含照片）…", true);
            const photos = (App.photoCache && App.photoCache.length) ? App.photoCache : await refreshPhotoCache();
            const payload = JSON.parse(JSON.stringify(App.S));
            payload.photos = photos.map(p => ({ date: p.date, data: p.data, takenAt: p.takenAt }));
            const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "fitday-backup-" + A.todayKey() + ".json";
            a.click();
            A.toast("备份已导出（含 " + photos.length + " 张照片）✓", true);
          } catch (e) { A.toast("导出失败：" + e.message); }
        })();
        break;
      }
      case "importData": { const f = $("#import-file"); if (f) f.click(); break; }
      case "clearData":
        A.showModal(`<h4>清空所有数据？</h4><div class="mp">档案、记录、计划将全部删除且无法恢复。建议先导出备份。</div>
          <div class="mbtns"><button class="btn ghost" data-action="closeModal">取消</button>
          <button class="btn danger" data-action="clearDataGo">确认清空</button></div>`);
        break;
      case "clearDataGo":
        localStorage.removeItem("fitday_state");
        localStorage.removeItem("fitday_custom_foods");
        location.reload();
        break;
      case "about":
        A.showModal(`<h4>🔥 FitDay 燃动日记 v1.0</h4>
          <div class="mp">每一天的坚持，都在塑造更好的自己。<br><br>
          · 运动教学知识库：${window.EXERCISES.length}个动作详解<br>
          · 食物卡路里库：${window.allFoods().length}种常见食物<br>
          · 智能计划：Mifflin-St Jeor代谢公式 + 目标热量法<br>
          · 训练理论：渐进超负荷 / 推拉腿分化 / HIIT间歇<br><br>
          数据口径说明：食物与消耗数据为公开营养数据库的常见均值，仅供健康管理参考，不能替代医疗建议。</div>
          <div class="mbtns"><button class="btn" data-action="closeModal">好的</button></div>`);
        break;
      /* 头像 */
      case "avatarOpen": A.showSheet(V.sheetAvatar()); break;
      case "avatarPick": { const f = $("#avatar-file"); if (f) f.click(); break; }      case "avatarReset": {
        delete A.S.profile.avatar;
        store.save();
        A.showSheet(V.sheetAvatar());
        A.render();
        A.toast("已恢复默认头像");
        break;
      }

      case "closeSheet": A.closeSheet(); break;
      case "closeModal": A.closeModal(); break;
    }
  }

  function updateSheetKcal() {
    const el = document.querySelector("[data-action=dietAddConfirm]");
    if (!el) return;
    const f = window.findFood(el.dataset.id);
    const g = +($("#sheet-grams") || {}).value;
    if (!f || !g) return;
    const n = window.foodNutri(f, g);
    const info = $("#sheet-kcal");
    if (info) info.textContent = "约 " + n.kcal + " kcal · 蛋白 " + n.p + "g";
  }

  function sendCoach(q) {
    q = (q || "").trim();
    if (!q) return;
    const A = App, S = A.S;
    if (!S.coachMsgs) S.coachMsgs = [];
    S.coachMsgs.push({ role: "me", text: q });
    const ctx = { log: A.todayLog(), plan: S.plan, profile: S.profile, streak: A.streakObj(), logs: S.logs, cyc: A.cyc() };
    S.coachMsgs.push({ role: "ai", text: window.FitEngine.coachAnswer(q, ctx) });
    if (S.coachMsgs.length > 60) S.coachMsgs = S.coachMsgs.slice(-60);
    store.save();
    A.render();
    setTimeout(() => { const inp = $("#coach-input"); if (inp) inp.focus(); }, 50);
  }

  /* ============================================================
     事件绑定与启动
     ============================================================ */
  document.addEventListener("click", e => {
    const navEl = e.target.closest("[data-nav]");
    const actEl = e.target.closest("[data-action]");
    if (actEl) {
      const act = actEl.dataset.action;
      if (act === "setToggle") return; /* 由change事件处理 */
      e.preventDefault();
      dispatch(act, actEl);
      return;
    }
    if (navEl && !navEl.dataset.action) {
      App.navigate(navEl.dataset.nav);
    }
  });

  document.addEventListener("change", e => {
    const el = e.target.closest("[data-action=setToggle]");
    if (el) {
      /* 生理期开关走专用逻辑 */
      if (el.dataset.k === "__cycle") {
        if (!App.S.cycles) App.S.cycles = { enabled: false, starts: [], periodLen: 5, cycleLen: 28 };
        App.S.cycles.enabled = el.checked;
        if (el.checked && !(App.S.cycles.starts || []).length) App.toast("开启后记得填最近一次月经开始日期 🌸");
        store.save(); App.showSheet(window.Views.sheetCycle());
        return;
      }
      App.S.settings[el.dataset.k] = el.checked;
      store.save();
      if (el.dataset.k === "remind" && el.checked) App.askNotifPermission();
      App.toast(el.checked ? "已开启 ✓" : "已关闭");
      if (el.dataset.k === "remind") App.render();
      return;
    }
    const exInp = e.target.closest("input[data-role=obExact]");
    if (exInp) {
      const d = App.S.ui.obData;
      if (!d.dayTimesExact) d.dayTimesExact = {};
      if (exInp.value) d.dayTimesExact[exInp.dataset.wd] = exInp.value;
      else delete d.dayTimesExact[exInp.dataset.wd];
      store.save();
    }
    const pfInp = e.target.closest("input[data-role=pfExact]");
    if (pfInp) {
      const p = App.S.profile;
      if (p) {
        if (!p.dayTimesExact) p.dayTimesExact = {};
        if (pfInp.value) p.dayTimesExact[pfInp.dataset.wd] = pfInp.value;
        else delete p.dayTimesExact[pfInp.dataset.wd];
        store.save();
      }
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target && e.target.id === "coach-input") {
      sendCoach(e.target.value);
    }
    if (e.key === "Enter" && e.target && e.target.id === "weight-in") {
      const btn = document.querySelector("[data-action=saveWeight]");
      if (btn) btn.click();
    }
  });

  /* 初始化 */
  const saved = store.load();
  const today = new Date();
  App.S = saved || {
    profile: null,
    plan: null,
    settings: { remind: true, sound: true, train: true, water: true, meal: true, sleep: true, theme: "tangerine" },
    logs: {}, customFoods: [], coachMsgs: [], fired: {},
    cycles: { enabled: false, starts: [], periodLen: 5, cycleLen: 28 },
    ui: {
      obStep: 0, obData: { name: "", sex: "female", age: "", height: "", weight: "", level: "beginner", goal: "fatloss", days: "1,3,5", timePref: "evening", equip: "dumbbell", activity: "mid", dayTimes: {}, dayTimesExact: {} },
      calY: today.getFullYear(), calM: today.getMonth(), repSeg: "week", courseCat: "all"
    },
    ver: 3
  };
  if (!App.S.ui) App.S.ui = {};
  if (!App.S.settings) App.S.settings = {};
  if (!App.S.settings.theme) App.S.settings.theme = "tangerine";
  if (!App.S.cycles) App.S.cycles = { enabled: false, starts: [], periodLen: 5, cycleLen: 28 };
  if (!App.S.ui.obData) App.S.ui.obData = {};
  if (!App.S.ui.obData.dayTimes) App.S.ui.obData.dayTimes = {};
  if (!App.S.ui.obData.dayTimesExact) App.S.ui.obData.dayTimesExact = {};
  if (App.S.ui.calY === undefined) { App.S.ui.calY = today.getFullYear(); App.S.ui.calM = today.getMonth(); }
  if (!App.S.fired) App.S.fired = {};
  App.applyTheme(App.S.settings.theme);
  App.applyFont(App.S.settings.fontSize);
  /* 状态自愈：有档案无计划（如旧版本存档/生成中断）时自动重建 */
  if (App.S.profile && !App.S.plan) {
    App.S.plan = window.FitEngine.buildPlan(App.S.profile);
    App.S.ui.obStep = 0;
    App.S.obDone = true;
    App.seedCoach();
    store.save();
  }
  /* v1/v2/v3/v4 → v5 迁移：按档案重建计划（保留所有记录；力量日尽量沿用旧安排） */
  if (App.S.profile && App.S.plan && App.S.plan.planVer !== 5) {
    const p2 = App.S.profile;
    if (p2.days == null || p2.days === "") {
      const oldStrength = (App.S.plan.week || []).filter(d => d.type === "strength").map(d => d.wd);
      p2.days = (oldStrength.length >= 2 ? oldStrength : [0, 2, 4]).join(",");
    }
    if (!p2.timePref) p2.timePref = p2.trainPref || "evening";
    if (!p2.dayTimes) p2.dayTimes = {};
    if (!p2.dayTimesExact) p2.dayTimesExact = {};
    p2.daysPerWeek = String(p2.days).split(",").length;
    App.S.plan = window.FitEngine.buildPlan(p2);
    App.S.obDone = true;
    store.save();
  }
  App.render();
  refreshPhotoCache(); /* 预热照片缓存（进阶版） */

  setInterval(() => App.checkReminders(), 20000);

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "127.0.0.1" || location.hostname === "localhost")) {
    try { navigator.serviceWorker.register("sw.js"); } catch (e) { }
  }
})();
