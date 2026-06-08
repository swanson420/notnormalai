document.addEventListener("DOMContentLoaded", () => {
  let isRunning = false;
  let taskIdCounter = 4;

  const tasks = [
    { id: 'TASK-001', title: 'Implement Secure Core API Route Endpoints', lane: 'BACKLOG', version: 1, lastModifiedBy: 'USER', timestamp: Date.now() },
    { id: 'TASK-002', title: 'Draft Relational Database Schema Design', lane: 'BACKLOG', version: 1, lastModifiedBy: 'USER', timestamp: Date.now() },
    { id: 'TASK-003', title: 'Review System Architecture Telemetry Docs', lane: 'BACKLOG', version: 1, lastModifiedBy: 'USER', timestamp: Date.now() }
  ];

  let alphaIntervalId = null;
  let betaIntervalId = null;
  let gammaIntervalId = null;

  const btnToggleSim = document.getElementById('btn-toggle-sim');
  const btnResetSim = document.getElementById('btn-reset-sim');
  const btnAddTask = document.getElementById('btn-add-task');
  const btnInjectChaos = document.getElementById('btn-inject-chaos');

  const statusText = document.getElementById('simulation-status-text');
  const simButtonText = document.getElementById('sim-button-text');

  const trackAlpha = document.getElementById('track-alpha');
  const trackBeta = document.getElementById('track-beta');
  const trackGamma = document.getElementById('track-gamma');

  const containers = {
    BACKLOG: document.getElementById('container-backlog'),
    IN_PROGRESS: document.getElementById('container-in-progress'),
    REVIEW: document.getElementById('container-review'),
    DONE: document.getElementById('container-done')
  };

  const badges = {
    BACKLOG: document.getElementById('badge-backlog'),
    IN_PROGRESS: document.getElementById('badge-in-progress'),
    REVIEW: document.getElementById('badge-review'),
    DONE: document.getElementById('badge-done')
  };

  const logStream = document.getElementById("log-stream-container");

  function log(actor, msg) {
    const div = document.createElement("div");
    div.className = `log-card ${actor.toLowerCase()}-log`;
    div.textContent = `[${actor}] ${msg}`;
    logStream.appendChild(div);
    logStream.scrollTop = logStream.scrollHeight;
  }

  function render() {
    Object.values(containers).forEach(c => c.innerHTML = "");

    const counts = { BACKLOG: 0, IN_PROGRESS: 0, REVIEW: 0, DONE: 0 };

    tasks.forEach(t => {
      counts[t.lane]++;

      const el = document.createElement("div");
      el.className = "task-card";
      el.innerHTML = `<strong>${t.id}</strong><br>${t.title}`;

      containers[t.lane].appendChild(el);
    });

    Object.keys(badges).forEach(k => {
      badges[k].textContent = `[${counts[k]}]`;
    });
  }

  function alpha() {
    const t = tasks[Math.floor(Math.random() * tasks.length)];
    if (!t) return;

    if (t.lane === "BACKLOG") t.lane = "IN_PROGRESS";
    else if (t.lane === "IN_PROGRESS") t.lane = "REVIEW";
    else if (t.lane === "REVIEW") t.lane = "DONE";

    t.version++;
    t.lastModifiedBy = "ALPHA";

    render();
  }

  function beta() {
    tasks.forEach(t => {
      if (t.lane === "REVIEW" && t.version % 2 === 1) {
        t.lane = "IN_PROGRESS";
        t.lastModifiedBy = "BETA";
      }
    });
    render();
  }

  function gamma() {
    const t = tasks[Math.floor(Math.random() * tasks.length)];
    if (!t) return;

    const lanes = ["BACKLOG", "IN_PROGRESS", "REVIEW", "DONE"];
    t.lane = lanes[Math.floor(Math.random() * lanes.length)];
    t.lastModifiedBy = "GAMMA";
    t.version++;

    render();
  }

  function start() {
    isRunning = true;
    statusText.textContent = "STATUS: RUNNING";
    simButtonText.textContent = "STOP";

    alphaIntervalId = setInterval(alpha, 2000);
    betaIntervalId = setInterval(beta, 3500);
    gammaIntervalId = setInterval(gamma, 5000);

    log("USER", "SIM STARTED");
  }

  function stop() {
    isRunning = false;
    statusText.textContent = "STATUS: STOPPED";
    simButtonText.textContent = "START";

    clearInterval(alphaIntervalId);
    clearInterval(betaIntervalId);
    clearInterval(gammaIntervalId);

    log("USER", "SIM STOPPED");
  }

  // ✅ CHAOS BUTTON (THIS IS THE IMPORTANT PART)
  btnInjectChaos?.addEventListener("click", () => {
    log("USER", "⚡ CHAOS MODE");

    for (let i = 0; i < 5; i++) {
      tasks.push({
        id: `CHAOS-${Date.now()}-${i}`,
        title: "CHAOS LOAD TASK",
        lane: "BACKLOG",
        version: 1,
        lastModifiedBy: "GAMMA",
        timestamp: Date.now()
      });
    }

    const t = tasks[Math.floor(Math.random() * tasks.length)];
    if (t) t.lane = "REVIEW";

    render();
    log("GAMMA", "CHAOS APPLIED");
  });

  btnToggleSim?.addEventListener("click", () => {
    if (isRunning) stop();
    else start();
  });

  btnAddTask?.addEventListener("click", () => {
    tasks.push({
      id: `TASK-${taskIdCounter++}`,
      title: "USER TASK",
      lane: "BACKLOG",
      version: 1,
      lastModifiedBy: "USER",
      timestamp: Date.now()
    });

    render();
  });

  btnResetSim?.addEventListener("click", () => {
    tasks.length = 0;
    taskIdCounter = 4;
    location.reload();
  });

  render();
  log("USER", "SYSTEM READY");
});
