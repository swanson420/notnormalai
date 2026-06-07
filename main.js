(function () {
  // --- Core State Storage ---
  let isRunning = false;
  let taskIdCounter = 4;

  const tasks = [
    { id: 'TASK-001', title: 'Implement Secure Core API Route Endpoints', lane: 'BACKLOG', version: 1, lastModifiedBy: 'USER', timestamp: Date.now() },
    { id: 'TASK-002', title: 'Draft Relational Database Schema Design', lane: 'BACKLOG', version: 1, lastModifiedBy: 'USER', timestamp: Date.now() },
    { id: 'TASK-003', title: 'Review System Architecture Telemetry Docs', lane: 'BACKLOG', version: 1, lastModifiedBy: 'USER', timestamp: Date.now() }
  ];

  // --- Dynamic Simulation Timing & Loops ---
  let alphaIntervalId = null;
  let betaIntervalId = null;
  let gammaIntervalId = null;

  let heartbeatIntervalId = null;
  const heartbeatTimers = { alpha: 0, beta: 0, gamma: 0 };

  // --- DOM Query Nodes ---
  const btnToggleSim = document.getElementById('btn-toggle-sim');
  const btnResetSim = document.getElementById('btn-reset-sim');
  const btnAddTask = document.getElementById('btn-add-task');
  const btnInjectChaos = document.getElementById('btn-inject-chaos');
  
  const statusText = document.getElementById('simulation-status-text');
  const simButtonText = document.getElementById('sim-button-text');
  const simIcon = document.getElementById('sim-icon');

  const containers = {
    'BACKLOG': document.getElementById('container-backlog'),
    'IN_PROGRESS': document.getElementById('container-in-progress'),
    'REVIEW': document.getElementById('container-review'),
    'DONE': document.getElementById('container-done')
  };

  const badges = {
    'BACKLOG': document.getElementById('badge-backlog'),
    'IN_PROGRESS': document.getElementById('badge-in-progress'),
    'REVIEW': document.getElementById('badge-review'),
    'DONE': document.getElementById('badge-done')
  };

  const trackAlpha = document.getElementById('track-alpha');
  const trackBeta = document.getElementById('track-beta');
  const trackGamma = document.getElementById('track-gamma');

  const logStreamContainer = document.getElementById('log-stream-container');
  const panelLogsContainer = document.getElementById('panel-logs-container');

  const filters = {
    'USER': document.getElementById('filter-user'),
    'ALPHA': document.getElementById('filter-alpha'),
    'BETA': document.getElementById('filter-beta'),
    'GAMMA': document.getElementById('filter-gamma')
  };

  // --- System Mechanics & Logging ---
  function getTimestampString() {
    const d = new Date();
    return d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
  }

  function appendLog(actor, message) {
    const card = document.createElement('div');
    card.className = `log-card ${actor.toLowerCase()}-log`;

    const topDiv = document.createElement('div');
    topDiv.className = 'log-top';
    
    const timeSpan = document.createElement('span');
    timeSpan.textContent = `[${getTimestampString()}]`;
    
    const actorSpan = document.createElement('span');
    actorSpan.textContent = `ACTOR: AGENT_${actor}`;
    
    topDiv.appendChild(timeSpan);
    topDiv.appendChild(actorSpan);

    const msgDiv = document.createElement('div');
    msgDiv.className = 'log-msg';
    msgDiv.textContent = message;

    card.appendChild(topDiv);
    card.appendChild(msgDiv);
    logStreamContainer.appendChild(card);

    logStreamContainer.scrollTop = logStreamContainer.scrollHeight;
  }

  // --- HTML UI Generation Renderers ---
  function renderBoard() {
    Object.keys(containers).forEach(key => {
      containers[key].innerHTML = '';
    });

    const counts = { 'BACKLOG': 0, 'IN_PROGRESS': 0, 'REVIEW': 0, 'DONE': 0 };

    tasks.forEach(task => {
      counts[task.lane]++;

      const card = document.createElement('div');
      const lowerActor = task.lastModifiedBy.toLowerCase();
      card.className = `task-card ${lowerActor}-lock`;
      card.id = `dom-${task.id}`;

      const cardTop = document.createElement('div');
      cardTop.className = 'card-top';

      const cardId = document.createElement('span');
      cardId.className = 'card-id';
      cardId.textContent = task.id;

      const cardVersion = document.createElement('span');
      cardVersion.className = 'card-version';
      cardVersion.textContent = `v${task.version}`;

      cardTop.appendChild(cardId);
      cardTop.appendChild(cardVersion);

      const cardTitle = document.createElement('div');
      cardTitle.className = 'card-title';
      cardTitle.textContent = task.title;

      const cardMeta = document.createElement('div');
      cardMeta.className = 'card-meta';

      const cardBadge = document.createElement('span');
      cardBadge.className = `card-badge ${lowerActor}-owned`;
      cardBadge.textContent = `AGNT_${task.lastModifiedBy}`;

      const cardTimestamp = document.createElement('span');
      cardTimestamp.className = 'card-timestamp';
      cardTimestamp.textContent = task.timestamp;

      cardMeta.appendChild(cardBadge);
      cardMeta.appendChild(cardTimestamp);

      card.appendChild(cardTop);
      card.appendChild(cardTitle);
      card.appendChild(cardMeta);

      if (containers[task.lane]) {
        containers[task.lane].appendChild(card);
      }
    });

    Object.keys(badges).forEach(key => {
      badges[key].textContent = `[${counts[key]}]`;
    });
  }

  function triggerVisualFlash(taskId, actor) {
    const element = document.getElementById(`dom-${taskId}`);
    if (element) {
      const flashClass = `flash-${actor.toLowerCase()}`;
      element.classList.add(flashClass);
      setTimeout(() => {
        element.classList.remove(flashClass);
      }, 600);
    }
  }

  // --- Automation Heartbeat UI Updater ---
  function updateHeartbars() {
    if (!isRunning) return;

    heartbeatTimers.alpha += 100;
    heartbeatTimers.beta += 100;
    heartbeatTimers.gamma += 100;

    const buildBar = (ms, total) => {
      let filled = Math.floor((ms % total) / (total / 10));
      if (filled === 0 && ms >= total) filled = 10;
      return '|'.repeat(filled) + '.'.repeat(10 - filled);
    };

    trackAlpha.textContent = buildBar(heartbeatTimers.alpha, 2000);
    trackBeta.textContent = buildBar(heartbeatTimers.beta, 3500);
    trackGamma.textContent = buildBar(heartbeatTimers.gamma, 5000);
  }

  // --- Execution Simulation Logic Routines ---
  function executeAlphaLoop() {
    const targets = tasks.filter(t => t.lane === 'BACKLOG' || t.lane === 'IN_PROGRESS' || t.lane === 'REVIEW');
    if (targets.length === 0) return;

    const selected = targets[Math.floor(Math.random() * targets.length)];
    const oldLane = selected.lane;
    
    if (selected.lane === 'BACKLOG') selected.lane = 'IN_PROGRESS';
    else if (selected.lane === 'IN_PROGRESS') selected.lane = 'REVIEW';
    else if (selected.lane === 'REVIEW') selected.lane = 'DONE';

    selected.version++;
    selected.lastModifiedBy = 'ALPHA';
    selected.timestamp = Date.now();

    renderBoard();
    triggerVisualFlash(selected.id, 'ALPHA');
    appendLog('ALPHA', `Moved ${selected.id} from ${oldLane} to ${selected.lane}. Incremented to v${selected.version}.`);
  }

  function executeBetaLoop() {
    const targets = tasks.filter(t => t.lane === 'REVIEW');
    if (targets.length === 0) {
      appendLog('BETA', `Evaluated tasks checking metrics. No operational anomalies detected.`);
      return;
    }

    targets.forEach(selected => {
      if (selected.version % 2 !== 0) {
        selected.lane = 'IN_PROGRESS';
        selected.version++;
        selected.lastModifiedBy = 'BETA';
        selected.timestamp = Date.now();
        
        renderBoard();
        triggerVisualFlash(selected.id, 'BETA');
        appendLog('BETA', `REVERTED: Task ${selected.id} from REVIEW to IN_PROGRESS. Reason: Odd State Version detected [v${selected.version - 1}]`);
      }
    });
  }

  function executeGammaLoop() {
    if (tasks.length === 0) return;
    
    const selected = tasks[Math.floor(Math.random() * tasks.length)];
    const oldLane = selected.lane;
    const lanes = ['BACKLOG', 'IN_PROGRESS', 'REVIEW', 'DONE'];
    
    let nextLane;
    do {
      nextLane = lanes[Math.floor(Math.random() * lanes.length)];
    } while (nextLane === oldLane);

    selected.lane = nextLane;
    selected.version++;
    selected.lastModifiedBy = 'GAMMA';
    selected.timestamp = Date.now();

    renderBoard();
    triggerVisualFlash(selected.id, 'GAMMA');
    appendLog('GAMMA', `Injected Chaos Displacement: Shifted ${selected.id} arbitrarily from ${oldLane} to ${selected.lane}. Version counter hit v${selected.version}.`);
  }

  // --- Operational Control Routines ---
  function startSimulation() {
    isRunning = true;
    statusText.textContent = 'STATUS: [ RUNNING ]';
    simButtonText.textContent = 'Stop Simulation';
    btnToggleSim.className = 'btn-toggle-sim running';
    simIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';

    heartbeatTimers.alpha = 0;
    heartbeatTimers.beta = 0;
    heartbeatTimers.gamma = 0;

    alphaIntervalId = setInterval(executeAlphaLoop, 2000);
    betaIntervalId = setInterval(executeBetaLoop, 3500);
    gammaIntervalId = setInterval(executeGammaLoop, 5000);
    heartbeatIntervalId = setInterval(updateHeartbars, 100);

    appendLog('USER', 'Simulation Sequence Initialized. All background processing actors armed.');
  }

  function stopSimulation() {
    isRunning = false;
    statusText.textContent = 'STATUS: [ STOPPED ]';
    simButtonText.textContent = 'Start Simulation';
    btnToggleSim.className = 'btn-toggle-sim stopped';
    simIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';

    clearInterval(alphaIntervalId);
    clearInterval(betaIntervalId);
    clearInterval(gammaIntervalId);
    clearInterval(heartbeatIntervalId);

    appendLog('USER', 'Simulation Sequence Halted. Active worker cycles paused safely.');
  }

  // --- Dynamic Live Filters Handler ---
  function applyFilterClasses() {
    panelLogsContainer.classList.toggle('hide-user', !filters.USER.checked);
    panelLogsContainer.classList.toggle('hide-alpha', !filters.ALPHA.checked);
    panelLogsContainer.classList.toggle('hide-beta', !filters.BETA.checked);
    panelLogsContainer.classList.toggle('hide-gamma', !filters.GAMMA.checked);
  }

  // --- Declarative Event Listeners ---
  btnToggleSim.addEventListener('click', () => {
    if (isRunning) stopSimulation();
    else startSimulation();
  });

  btnResetSim.addEventListener('click', () => {
    const originallyRunning = isRunning;
    if (originallyRunning) stopSimulation();

    tasks.length = 0;
    taskIdCounter = 4;
    
    tasks.push(
      { id: 'TASK-001', title: 'Implement Secure Core API Route Endpoints', lane: 'BACKLOG', version: 1, lastModifiedBy: 'USER', timestamp: Date.now() },
      { id: 'TASK-002', title: 'Draft Relational Database Schema Design', lane: 'BACKLOG', version: 1, lastModifiedBy: 'USER', timestamp: Date.now() },
      { id: 'TASK-003', title: 'Review System Architecture Telemetry Docs', lane: 'BACKLOG', version: 1, lastModifiedBy: 'USER', timestamp: Date.now() }
    );

    logStreamContainer.innerHTML = '';
    trackAlpha.textContent = '..........';
    trackBeta.textContent = '..........';
    trackGamma.textContent = '..........';

    renderBoard();
    appendLog('USER', 'System Baseline Re-Loaded. State matrices reverted smoothly to zero.');

    if (originallyRunning) startSimulation();
  });

  btnAddTask.addEventListener('click', () => {
    const idStr = `TASK-${String(taskIdCounter++).padStart(3, '0')}`;
    const newTask = {
      id: idStr,
      title: `Manually Generated Mutation Telemetry Module Sample ${idStr}`,
      lane: 'BACKLOG',
      version: 1,
      lastModifiedBy: 'USER',
      timestamp: Date.now()
    };

    tasks.push(newTask);
    renderBoard();
    triggerVisualFlash(idStr, 'USER');
    appendLog('USER', `Instantiated fresh context container record: ${idStr} directly allocated into BACKLOG.`);
  });

  btnInjectChaos.addEventListener('click', () => {
    appendLog('USER', 'Forcing Out-Of-Interval Chaos Intervention Command Route...');
    executeGammaLoop();
  });

  Object.keys(filters).forEach(key => {
    filters[key].addEventListener('change', applyFilterClasses);
  });

  // --- System Bootstrap Initialization ---
  renderBoard();
  appendLog('USER', 'System Control Console Initialization complete. Ready for target runtime execution loops.');
})();
                  
