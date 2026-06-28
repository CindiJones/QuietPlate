const STORAGE_KEY = "quietPlateDataV1";

const defaultState = {
  onboarded: false,
  name: "",
  checkins: [],
  assessment: null,
  logs: [],
  plan: {},
  reflection: null,
  completedTools: []
};

const tools = [
  { id: "pause", icon: "◌", title: "90-second pause", time: "90 SEC", summary: "Breathe, notice the urge, and give yourself room to choose.", prompt: "Put both feet on the floor. Breathe out a little longer than you breathe in. You do not need to decide anything until the timer ends.", timer: 90 },
  { id: "wave", icon: "≈", title: "Craving wave", time: "2 MIN", summary: "Watch the craving rise, shift, and soften without fighting it.", prompt: "Name the sensations you notice. Imagine the urge as a wave: it can be intense without staying at its peak.", timer: 120 },
  { id: "hunger", icon: "◇", title: "Hunger check", time: "1 MIN", summary: "Separate physical hunger from appetite, emotion, and habit.", prompt: "Ask: What sensations are in my body? When did I last eat? Would several foods sound satisfying, or only one specific thing?" },
  { id: "stress", icon: "⌁", title: "Stress check", time: "1 MIN", summary: "Notice whether your nervous system needs care before a food decision.", prompt: "Unclench your jaw. Lower your shoulders. Ask: What feels pressured right now, and what is one small way to lower that pressure?" },
  { id: "hydrate", icon: "◒", title: "Hydration check", time: "1 MIN", summary: "Pause for a drink if it has been a while—without using water to suppress hunger.", prompt: "Have a glass of water if you are thirsty. Then check again: am I also hungry? Both needs are allowed." },
  { id: "move", icon: "↗", title: "Movement prompt", time: "2 MIN", summary: "Shift your setting with light, non-punitive movement.", prompt: "Stand, stretch, or walk to another room. Let movement change the moment—not compensate for eating.", timer: 120 },
  { id: "meal", icon: "＋", title: "Steady meal reminder", time: "1 MIN", summary: "Check whether a satisfying meal or snack would offer steadiness.", prompt: "Would a meal or snack with protein, fibre, carbohydrates, and enjoyable flavour help? Restriction can make food thoughts louder." },
  { id: "need", icon: "?", title: "What do I need?", time: "2 MIN", summary: "Look beneath the urge with one compassionate question.", prompt: "Finish this sentence without overthinking: Right now, I might need… Food may still be part of the answer.", reflection: true },
  { id: "breathe", icon: "∞", title: "Four slow breaths", time: "1 MIN", summary: "Use a longer exhale to settle your attention.", prompt: "Breathe in for four. Breathe out for six. Repeat four times, gently and without forcing." },
  { id: "delay", icon: "↻", title: "Delay and decide", time: "2 MIN", summary: "Choose a short pause, then make a fresh decision—without forbidding the food.", prompt: "Tell yourself: I can have this. I am choosing to check again in two minutes. When the timer ends, decide with the information you have.", timer: 120 },
  { id: "environment", icon: "□", title: "Environment reset", time: "2 MIN", summary: "Make the next supportive choice a little easier.", prompt: "Change rooms, put away visual cues, prepare a satisfying option, close a delivery app, or reduce one source of friction. Pick only one." }
];

const articles = [
  {
    id: "food-noise", category: "basics", label: "Basics", title: "What is food noise?", excerpt: "A plain-language look at persistent food thoughts and why they can feel so consuming.",
    body: `<p>“Food noise” is an informal term for frequent or persistent thoughts about food—what to eat, when to eat, whether to eat, or how eating might feel. It can include cravings, mental planning, internal rules, or repeated negotiation.</p><h3>It is not a diagnosis</h3><p>Food thoughts exist on a spectrum and can be influenced by hunger, restriction, habits, stress, sleep, environment, medications, and many other factors. The useful question is not “What is wrong with me?” but “What might this pattern be telling me?”</p><h3>A place to begin</h3><ul><li>Notice when thoughts are loudest.</li><li>Check whether you are regularly and adequately nourished.</li><li>Look for emotional or environmental triggers.</li><li>Seek support if thoughts feel distressing or compulsive.</li></ul>`
  },
  {
    id: "four-signals", category: "basics", label: "Basics", title: "Hunger, appetite, craving, or habit?", excerpt: "These experiences can overlap. Learning their differences can make decisions feel less murky.",
    body: `<p><strong>Hunger</strong> often builds gradually and may come with body cues such as low energy or an empty feeling. <strong>Appetite</strong> is the desire to eat and can be present with or without physical hunger.</p><p>A <strong>craving</strong> is often more specific and can feel urgent. A <strong>habit</strong> is a learned link between a cue and an action—like wanting a snack when a show starts.</p><h3>More than one can be true</h3><p>You can be hungry and craving something specific. You can eat for comfort and still need food. The goal is not perfect labeling; it is gathering enough information to make an intentional choice.</p>`
  },
  {
    id: "restriction", category: "patterns", label: "Patterns", title: "Why restriction can turn up the volume", excerpt: "Not eating enough—or making foods feel forbidden—can make food thoughts more persistent.",
    body: `<p>When the body gets too little food, hunger and attention to food naturally increase. Mental restriction can have a similar effect: labeling a food as forbidden can make it feel unusually important.</p><h3>What may help</h3><ul><li>Eat at reasonably regular times.</li><li>Include enough food to feel satisfied.</li><li>Pair nutrition with pleasure instead of treating them as opposites.</li><li>Question rigid “good food/bad food” rules.</li></ul><p>If loosening restriction feels frightening or difficult, a registered dietitian or therapist with relevant experience can support you.</p>`
  },
  {
    id: "emotions", category: "patterns", label: "Patterns", title: "Food and emotional needs", excerpt: "Eating can soothe, celebrate, distract, or connect. Curiosity offers more choices than judgment.",
    body: `<p>Emotional eating is human. Food can genuinely comfort us. It becomes useful to explore when it is your only coping tool, feels automatic, or leaves you distressed.</p><h3>Widen the menu of support</h3><p>Ask what the feeling might need: rest, stimulation, connection, relief, expression, or practical help. You may still choose food. The aim is to add options, not remove comfort.</p>`
  },
  {
    id: "meal-structure", category: "basics", label: "Basics", title: "Steadier energy through meal structure", excerpt: "Regular, satisfying food can reduce the intensity created by getting overly hungry.",
    body: `<p>Long gaps between meals can make food decisions feel urgent. Many people feel steadier with regular meals and snacks that combine carbohydrates, protein, fat, fibre, and foods they enjoy.</p><p>There is no single ideal schedule. Medical needs vary, and individualized advice belongs with a qualified health professional. A simple experiment is to notice whether food thoughts change on days when you eat enough, earlier, and more consistently.</p>`
  },
  {
    id: "sleep-stress", category: "patterns", label: "Patterns", title: "Sleep, stress, and cravings", excerpt: "A tired or stressed brain often reaches for fast relief. That is adaptation, not failure.",
    body: `<p>Stress narrows attention toward immediate relief. Poor sleep can also influence appetite, energy, mood, and decision-making. Together, they can make cravings feel louder and pausing feel harder.</p><h3>Reduce the load</h3><p>On demanding days, simplify choices. Keep easy, satisfying food available. Lower expectations. Choose one short nervous-system reset. Supporting sleep and stress is not a guarantee that cravings disappear; it is one way to make the whole system less strained.</p>`
  },
  {
    id: "environment", category: "patterns", label: "Patterns", title: "Your environment makes suggestions", excerpt: "Visibility, convenience, cues, and social context all shape food decisions.",
    body: `<p>Human attention responds to what is visible, easy, repeated, and socially reinforced. That is not a lack of willpower.</p><h3>Design for less friction</h3><ul><li>Keep satisfying options easy to reach.</li><li>Make recurring decisions ahead of the most tiring part of the day.</li><li>Change one cue linked to automatic eating.</li><li>Create a pleasant place to eat when possible.</li></ul>`
  },
  {
    id: "pause", category: "basics", label: "Practice", title: "Build a pause without making a rule", excerpt: "A pause works best as an invitation to notice, not a test you must pass.",
    body: `<p>The pause between an urge and an action can be very short. Its purpose is not to stop you from eating. It is to let more information into the decision.</p><p>Try: “I am allowed to eat. Before I decide, I will take three breaths and ask what I need.” If the answer is food, eating can be the intentional choice.</p>`
  },
  {
    id: "support", category: "support", label: "Support", title: "When professional support may help", excerpt: "Some food thoughts deserve more support than an app can provide.",
    body: `<p>Consider reaching out if thoughts about food feel overwhelming, compulsive, highly distressing, or tied to secrecy, purging, bingeing, severe restriction, or fear of eating. Support is also appropriate simply because you want it.</p><h3>Who can help</h3><ul><li>A physician can assess health factors and make referrals.</li><li>A registered dietitian can offer individualized nutrition support.</li><li>A therapist or counsellor can help with emotions, compulsions, anxiety, and body image.</li><li>Eating disorder organizations can connect you with specialized resources.</li></ul><p>If you are in immediate danger, contact local emergency services or a crisis service in your area.</p>`
  }
];

let state = loadState();
let timerInterval = null;

function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2400);
}

function openModal(html) {
  const backdrop = document.getElementById("modal-backdrop");
  document.getElementById("modal-content").innerHTML = html;
  backdrop.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("modal-close").focus();
}

function closeModal() {
  clearInterval(timerInterval);
  document.getElementById("modal-backdrop").hidden = true;
  document.body.style.overflow = "";
}

function routeTo(route) {
  if (route === "more") return openMoreMenu();
  const page = document.querySelector(`[data-page="${route}"]`);
  if (!page) return;
  document.body.classList.toggle("welcome-mode", route === "welcome");
  document.querySelectorAll(".page").forEach(el => el.classList.remove("active"));
  page.classList.add("active");
  document.querySelectorAll("[data-route]").forEach(el => {
    el.classList.toggle("active", el.dataset.route === route);
  });
  history.replaceState(null, "", `#${route}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (route === "patterns") renderPatterns();
  if (route === "track") renderLogs();
}

function setToday() {
  const date = new Date();
  document.getElementById("today-label").textContent = date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }).toUpperCase();
  document.getElementById("greeting").textContent = state.name
    ? `Hello, ${state.name}. A quieter moment starts here.`
    : "A quieter moment starts here.";
}

function renderDashboard() {
  setToday();
  const today = new Date().toDateString();
  const checkin = [...state.checkins].reverse().find(item => new Date(item.date).toDateString() === today);
  document.querySelectorAll("[data-checkin]").forEach(button => {
    button.classList.toggle("selected", checkin?.value === Number(button.dataset.checkin));
  });
  if (checkin) {
    const messages = {
      1: "Food feels relatively quiet today. Notice what may be supporting that.",
      2: "There is a little food noise today. A gentle check-in may help it stay manageable.",
      3: "Food thoughts are present. Consider one short reset before your next decision.",
      4: "Food feels loud today. Simplify choices and offer yourself extra support.",
      5: "Food feels very loud today. Go gently—and consider reaching out if this feels distressing."
    };
    document.getElementById("checkin-response").textContent = messages[checkin.value];
  }

  const scoreContent = document.getElementById("score-content");
  if (state.assessment) {
    scoreContent.innerHTML = `<div class="score-orb"><strong>${escapeHTML(state.assessment.level)}</strong><span>${state.assessment.total} / 24</span></div><p>${escapeHTML(state.assessment.explanation)}</p>`;
    document.getElementById("assessment-button").textContent = "Retake";
  }

  const recent = state.logs.slice(0, 3);
  document.getElementById("recent-logs").outerHTML = recent.length
    ? `<div id="recent-logs">${recent.map(logRow).join("")}</div>`
    : `<div id="recent-logs" class="empty-state"><span>○</span><p>No moments logged yet.</p><small>Tracking without judgment helps patterns emerge.</small></div>`;

  const suggestion = chooseSuggestion();
  document.getElementById("suggestion-title").textContent = suggestion.title;
  document.getElementById("suggestion-text").textContent = suggestion.summary;
  document.querySelector(".suggestion-card [data-tool]").dataset.tool = suggestion.id;
}

function chooseSuggestion() {
  const latest = state.logs[0];
  if (!latest) return tools[0];
  const map = { Stress: "breathe", Boredom: "need", Fatigue: "stress", Loneliness: "need", Habit: "environment", Restriction: "meal", "Social pressure": "pause" };
  return tools.find(tool => tool.id === (map[latest.trigger] || "wave")) || tools[0];
}

function logRow(log) {
  return `<div class="log-row">
    <div class="log-icon">${escapeHTML(log.trigger.slice(0, 1))}</div>
    <div><strong>${escapeHTML(log.trigger)}</strong><small>${escapeHTML(log.time)} · ${formatDate(log.date)}</small></div>
    <span class="intensity-badge">${log.intensity}/10</span>
  </div>`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function renderLogs() {
  const list = document.getElementById("log-list");
  list.className = state.logs.length ? "" : "empty-state compact";
  list.innerHTML = state.logs.length ? state.logs.map(logRow).join("") : "<p>No logs yet.</p>";
}

function renderPatterns() {
  const logs = state.logs;
  if (!logs.length) {
    document.getElementById("pattern-stats").innerHTML = [
      ["Most common trigger", "Not enough data"],
      ["Most common time", "Not enough data"],
      ["Average intensity", "—"],
      ["Strategies helped", "—"]
    ].map(([label, value]) => `<article class="card stat-card"><span>${label}</span><strong>${value}</strong></article>`).join("");
    document.getElementById("trigger-chart").innerHTML = `<div class="empty-state"><p>Log a few moments to reveal patterns.</p></div>`;
    document.getElementById("pattern-insights").innerHTML = `<div class="insight-item"><span>i</span><p>Your patterns will appear here without judgment as you add logs.</p></div>`;
    return;
  }

  const triggerCounts = countBy(logs, "trigger");
  const timeCounts = countBy(logs, "time");
  const topTrigger = topEntry(triggerCounts);
  const topTime = topEntry(timeCounts);
  const average = (logs.reduce((sum, log) => sum + Number(log.intensity), 0) / logs.length).toFixed(1);
  const tried = logs.filter(log => log.helped !== "Not tried");
  const helpful = tried.filter(log => log.helped === "Yes" || log.helped === "A little").length;
  const helpfulPercent = tried.length ? Math.round((helpful / tried.length) * 100) : null;

  const stats = [
    ["Most common trigger", topTrigger[0]],
    ["Most common time", topTime[0]],
    ["Average intensity", `${average} / 10`],
    ["Strategies helped", helpfulPercent === null ? "No data yet" : `${helpfulPercent}%`]
  ];
  document.getElementById("pattern-stats").innerHTML = stats.map(([label, value]) =>
    `<article class="card stat-card"><span>${label}</span><strong>${escapeHTML(value)}</strong></article>`
  ).join("");

  const max = Math.max(...Object.values(triggerCounts));
  document.getElementById("trigger-chart").innerHTML = Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => `<div class="bar-row"><span>${escapeHTML(name)}</span><div class="bar-track"><div class="bar-fill" style="width:${(count / max) * 100}%"></div></div><strong>${count}</strong></div>`).join("");

  const highContext = logs.filter(log => Number(log.intensity) >= 7);
  const highTime = highContext.length ? topEntry(countBy(highContext, "time"))[0] : topTime[0];
  const insights = [
    `Your food noise has appeared most often around <strong>${escapeHTML(topTrigger[0].toLowerCase())}</strong>.`,
    `Your logs are most frequent in the <strong>${escapeHTML(topTime[0].toLowerCase())}</strong>.`,
    highContext.length ? `Higher-intensity moments tend to show up in the <strong>${escapeHTML(highTime.toLowerCase())}</strong>.` : "As you log stronger moments, more context will emerge.",
    helpfulPercent !== null ? `A pause or strategy offered some help in <strong>${helpfulPercent}%</strong> of the moments when you tried one.` : "Try one reset during a future moment to learn what supports you."
  ];
  document.getElementById("pattern-insights").innerHTML = insights.map(text => `<div class="insight-item"><span>✓</span><p>${text}</p></div>`).join("");
}

function countBy(items, key) {
  return items.reduce((result, item) => {
    result[item[key]] = (result[item[key]] || 0) + 1;
    return result;
  }, {});
}

function topEntry(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || ["Not enough data", 0];
}

function renderTools() {
  document.getElementById("tool-grid").innerHTML = tools.map(tool => `
    <button class="card tool-card" data-tool="${tool.id}">
      <div class="tool-top"><span class="tool-icon">${tool.icon}</span><span class="tool-time">${tool.time}</span></div>
      <h2>${tool.title}</h2><p>${tool.summary}</p><span class="arrow">Try this <span>→</span></span>
    </button>`).join("");
}

function openTool(id) {
  const tool = tools.find(item => item.id === id);
  if (!tool) return;
  openModal(`<div class="tool-modal-body">
    <div class="modal-header"><span class="modal-step">${tool.time}</span><h2 id="modal-title">${tool.icon} ${tool.title}</h2><p>${tool.summary}</p></div>
    ${tool.timer ? `<div class="timer" id="timer-display">${formatTimer(tool.timer)}</div>` : ""}
    <div class="prompt-box"><p>${tool.prompt}</p></div>
    ${tool.reflection ? `<textarea id="tool-reflection" rows="3" placeholder="Right now, I might need…"></textarea>` : ""}
    <button class="primary-button full" id="${tool.timer ? "start-timer" : "complete-tool"}">${tool.timer ? "Start" : "Complete reset"}</button>
  </div>`);
  const start = document.getElementById("start-timer");
  if (start) start.addEventListener("click", () => startTimer(tool));
  const complete = document.getElementById("complete-tool");
  if (complete) complete.addEventListener("click", () => completeTool(tool));
}

function startTimer(tool) {
  let remaining = tool.timer;
  const display = document.getElementById("timer-display");
  const button = document.getElementById("start-timer");
  button.disabled = true;
  button.textContent = "Take your time…";
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    remaining -= 1;
    if (display) display.textContent = formatTimer(remaining);
    if (remaining <= 0) {
      clearInterval(timerInterval);
      button.disabled = false;
      button.textContent = "Complete reset";
      button.onclick = () => completeTool(tool);
      showToast("Pause complete. Notice what you need now.");
    }
  }, 1000);
}

function formatTimer(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function completeTool(tool) {
  state.completedTools.unshift({ id: tool.id, date: new Date().toISOString() });
  state.completedTools = state.completedTools.slice(0, 50);
  saveState();
  closeModal();
  showToast("Reset complete. No particular outcome required.");
}

function renderArticles(filter = "all") {
  const visible = filter === "all" ? articles : articles.filter(article => article.category === filter);
  document.getElementById("article-grid").innerHTML = visible.map(article => `
    <article class="card article-card" data-article="${article.id}">
      <span class="article-category">${article.label}</span>
      <h2>${article.title}</h2><p>${article.excerpt}</p><span class="read-link">Read · 2 min →</span>
    </article>`).join("");
}

function openArticle(id) {
  const article = articles.find(item => item.id === id);
  if (!article) return;
  openModal(`<div class="modal-header"><span class="article-category">${article.label}</span><h2 id="modal-title">${article.title}</h2><p>${article.excerpt}</p></div><div class="article-body">${article.body}</div>`);
}

function openAssessment() {
  const questions = [
    "How often do you think about food when you are not physically hungry?",
    "How intense do cravings tend to feel?",
    "How often do you eat in response to stress, boredom, loneliness, reward, or fatigue?",
    "How much mental space do food decisions occupy?",
    "How often do you feel guilt or frustration after eating?",
    "How difficult is it to pause before acting on a craving?"
  ];
  const options = ["Rarely", "Sometimes", "Often", "Very often"];
  openModal(`<form id="assessment-form">
    <div class="modal-header"><span class="modal-step">6 QUESTIONS · ABOUT 2 MINUTES</span><h2 id="modal-title">Food Noise Assessment</h2><p>Answer based on your recent experience. This is a reflection tool, not a diagnosis.</p></div>
    ${questions.map((question, index) => `<fieldset class="assessment-question"><legend>${index + 1}. ${question}</legend><div class="answer-scale">${options.map((option, optionIndex) => `<label><input type="radio" name="q${index}" value="${optionIndex + 1}" required><span>${option}</span></label>`).join("")}</div></fieldset>`).join("")}
    <button class="primary-button full" type="submit">See my reflection</button>
  </form>`);
  document.getElementById("assessment-form").addEventListener("submit", handleAssessment);
}

function handleAssessment(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const total = Array.from({ length: 6 }, (_, index) => Number(form.get(`q${index}`))).reduce((a, b) => a + b, 0);
  let level;
  let explanation;
  if (total <= 9) {
    level = "Low";
    explanation = "Food thoughts appear to take up relatively little space right now. Tracking what supports this may be useful.";
  } else if (total <= 14) {
    level = "Moderate";
    explanation = "Food thoughts may be present often enough to deserve attention. Small pauses and regular nourishment may help you learn more.";
  } else if (total <= 19) {
    level = "High";
    explanation = "Food thoughts may be occupying meaningful mental space. Consider adding support and discussing this with a qualified professional if it feels distressing.";
  } else {
    level = "Very High";
    explanation = "Food thoughts may feel persistent or difficult to step away from. This is not a diagnosis; compassionate professional support could be a helpful next step.";
  }
  state.assessment = { total, level, explanation, date: new Date().toISOString() };
  saveState();
  renderDashboard();
  openModal(`<div class="tool-modal-body"><div class="modal-header"><span class="modal-step">YOUR REFLECTION</span><h2 id="modal-title">${level} food noise</h2><p>${explanation}</p></div><div class="score-orb" style="margin:15px auto"><strong>${total}</strong><span>out of 24</span></div><div class="prompt-box"><p>This score is a starting point, not a label. Notice patterns over time and seek qualified support if thoughts feel overwhelming, compulsive, or connected to disordered eating.</p></div><button class="primary-button full" id="assessment-done">Return to today</button></div>`);
  document.getElementById("assessment-done").addEventListener("click", closeModal);
}

function openOnboarding() {
  openModal(`<form id="onboarding-form">
    <div class="modal-header"><span class="modal-step">WELCOME TO QUIET PLATE</span><h2 id="modal-title">Less judgment. More room to choose.</h2><p>Quiet Plate helps you notice food thoughts, understand patterns, and try brief supportive tools.</p></div>
    <div class="prompt-box"><p><strong>This is not a medical tool.</strong><br>Quiet Plate offers education and self-reflection, not medical advice, diagnosis, or treatment.</p></div>
    <label>What should we call you? <span style="font-weight:400;color:var(--muted)">(optional)</span><input type="text" name="name" maxlength="30" placeholder="Your first name"></label>
    <button class="primary-button full" type="submit">Begin gently</button>
  </form>`);
  document.getElementById("onboarding-form").addEventListener("submit", event => {
    event.preventDefault();
    state.name = new FormData(event.currentTarget).get("name").trim();
    state.onboarded = true;
    saveState();
    setToday();
    closeModal();
    routeTo("home");
  });
}

function openMoreMenu() {
  openModal(`<div class="modal-header"><span class="modal-step">EXPLORE</span><h2 id="modal-title">More from Quiet Plate</h2></div><div class="more-menu">
    <button data-modal-route="learn">□ &nbsp; Education library</button>
    <button data-modal-route="plan">✓ &nbsp; My Quiet Plan</button>
    <button data-modal-route="reflect">↻ &nbsp; Weekly reflection</button>
    <button data-modal-route="support">♡ &nbsp; Support & resources</button>
  </div>`);
}

function openProfile() {
  openModal(`<div class="modal-header"><span class="modal-step">YOUR SPACE</span><h2 id="modal-title">${state.name ? `Hello, ${escapeHTML(state.name)}` : "Quiet Plate"}</h2><p>Your entries stay in this browser on this device. Quiet Plate does not send them to a server.</p></div>
    <div class="prompt-box"><p><strong>${state.logs.length}</strong> moments logged · <strong>${state.completedTools.length}</strong> resets completed</p></div>
    <div class="more-menu"><button id="edit-name">Edit name</button><button id="reset-data" style="color:var(--coral-deep)">Erase all local data</button></div>`);
  document.getElementById("edit-name").addEventListener("click", openOnboarding);
  document.getElementById("reset-data").addEventListener("click", () => {
    if (!confirm("Erase all Quiet Plate entries from this browser? This cannot be undone.")) return;
    state = { ...defaultState, checkins: [], logs: [], plan: {}, completedTools: [] };
    saveState();
    closeModal();
    renderAll();
    setTimeout(openOnboarding, 250);
  });
}

function handleTriggerSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  state.logs.unshift({
    id: Date.now(),
    date: new Date().toISOString(),
    time: data.get("time"),
    hunger: Number(data.get("hunger")),
    intensity: Number(data.get("intensity")),
    trigger: data.get("trigger"),
    wanted: data.get("wanted").trim(),
    action: data.get("action").trim(),
    helped: data.get("helped")
  });
  state.logs = state.logs.slice(0, 100);
  saveState();
  event.currentTarget.reset();
  document.getElementById("hunger-output").textContent = "5 / 10";
  document.getElementById("intensity-output").textContent = "5 / 10";
  renderLogs();
  renderDashboard();
  showToast("Moment saved—without judgment.");
}

function loadPlan() {
  const form = document.getElementById("plan-form");
  Object.entries(state.plan || {}).forEach(([key, value]) => {
    if (form.elements[key]) form.elements[key].value = value;
  });
}

function handlePlanSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  state.plan = Object.fromEntries(data.entries());
  saveState();
  document.getElementById("plan-status").textContent = `Saved ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  showToast("Your Quiet Plan is saved.");
}

function handleReflectionSubmit(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  state.reflection = { ...data, date: new Date().toISOString() };
  saveState();
  renderReflection();
  showToast("Weekly summary created.");
}

function renderReflection() {
  const container = document.getElementById("reflection-summary");
  const reflection = state.reflection;
  if (!reflection) return;
  const fields = [
    ["What showed up", reflection.trigger],
    ["What helped", reflection.helped],
    ["What made it harder", reflection.harder],
    ["A small experiment", reflection.improvement],
    ["Support to consider", reflection.support]
  ];
  container.innerHTML = `<span class="card-kicker">WEEK OF ${formatDate(reflection.date).toUpperCase()}</span><h2 style="margin-top:8px">Your week, in your words</h2>${fields.map(([label, value]) => `<div class="summary-block"><span>${label.toUpperCase()}</span><p>${escapeHTML(value) || "Nothing added yet."}</p></div>`).join("")}`;
  const form = document.getElementById("reflection-form");
  Object.keys(reflection).forEach(key => {
    if (form.elements[key]) form.elements[key].value = reflection[key];
  });
}

function renderAll() {
  renderDashboard();
  renderLogs();
  renderPatterns();
  renderTools();
  renderArticles();
  loadPlan();
  renderReflection();
}

document.addEventListener("click", event => {
  const route = event.target.closest("[data-route]");
  if (route) routeTo(route.dataset.route);

  const tool = event.target.closest("[data-tool]");
  if (tool) openTool(tool.dataset.tool);

  const article = event.target.closest("[data-article]");
  if (article) openArticle(article.dataset.article);

  const modalRoute = event.target.closest("[data-modal-route]");
  if (modalRoute) {
    closeModal();
    routeTo(modalRoute.dataset.modalRoute);
  }

  const checkin = event.target.closest("[data-checkin]");
  if (checkin) {
    const value = Number(checkin.dataset.checkin);
    const today = new Date().toDateString();
    state.checkins = state.checkins.filter(item => new Date(item.date).toDateString() !== today);
    state.checkins.push({ value, date: new Date().toISOString() });
    saveState();
    renderDashboard();
  }
});

document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-backdrop").addEventListener("click", event => {
  if (event.target.id === "modal-backdrop") closeModal();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !document.getElementById("modal-backdrop").hidden) closeModal();
});
document.getElementById("quick-log").addEventListener("click", () => routeTo("track"));
document.getElementById("welcome-begin").addEventListener("click", openOnboarding);
document.getElementById("welcome-begin-bottom").addEventListener("click", openOnboarding);
document.getElementById("assessment-button").addEventListener("click", openAssessment);
document.getElementById("trigger-form").addEventListener("submit", handleTriggerSubmit);
document.getElementById("clear-logs").addEventListener("click", () => {
  if (!state.logs.length || !confirm("Clear all trigger logs from this browser?")) return;
  state.logs = [];
  saveState();
  renderAll();
  showToast("Logs cleared.");
});
document.getElementById("hunger").addEventListener("input", event => document.getElementById("hunger-output").textContent = `${event.target.value} / 10`);
document.getElementById("intensity").addEventListener("input", event => document.getElementById("intensity-output").textContent = `${event.target.value} / 10`);
document.getElementById("plan-form").addEventListener("submit", handlePlanSubmit);
document.getElementById("reflection-form").addEventListener("submit", handleReflectionSubmit);
document.getElementById("profile-button").addEventListener("click", openProfile);
document.getElementById("export-button").addEventListener("click", () => {
  showToast("Choose “Save as PDF” in the print window.");
  setTimeout(() => window.print(), 400);
});
document.getElementById("article-filters").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item === button));
  renderArticles(button.dataset.filter);
});

const initialRoute = location.hash.replace("#", "");
renderAll();
const startRoute = document.querySelector(`[data-page="${initialRoute}"]`)
  ? initialRoute
  : (state.onboarded ? "home" : "welcome");
routeTo(startRoute);
