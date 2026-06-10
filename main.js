// main.js

// Global Internal State Architecture[span_60](start_span)[span_60](end_span)[span_61](start_span)[span_61](end_span)
const state = {
  isSimulating: false,
  nextTaskId: 101,
  maxCapacity: 50, // Safety performance cap rule[span_62](start_span)[span_62](end_span)[span_63](start_span)[span_63](end_span)
  lanes: {
    backlog: [],
    'in-progress': [],
    review: [],
    done: []
  },
  intervals: []
};

// DOM Node References
const startSimBtn = document.getElementById('start-sim-btn');
const stopSimBtn = document.getElementById('stop-sim-btn');
const addTaskBtn = document.getElementById('add-task-btn');
const inlineInputContainer = document.getElementById('inline-input-container');
const taskTitleInput = document.getElementById('task-title-input');
const injectChaosBtn = document.getElementById('inject-chaos-btn');
const resetSystemBtn = document.getElementById('reset-system-btn');
const telemetryLog = document.getElementById('telemetry-log');

const laneTracks = {
  backlog: document.getElementById('lane-backlog-track'),
  'in-progress': document.getElementById('lane-in-progress-track'),
  review: document.getElementById('lane-review-track'),
  done: document.getElementById('lane-done-track')
};

const laneCounts = {
  backlog: document.getElementById('backlog-count'),
  'in-progress': document.getElementById('in-progress-count'),
  review: document.getElementById('review-count'),
  done: document.getElementById('done-count')
};

// Initialization Setup[span_64](start_span)[span_64](end_span)[span_65](start_span)[span_65](end_span)
function init() {
  setupEventListeners();
  appendLog('SYSTEM', 'Simulation environment initialized. Status: Idle.');
  // Seed sample tasks to display immediate operational canvas
  createTask('Refactor API Endpoint');
  createTask('Generate Test Assertions');
  createTask('Configure Browser Viewports');
}

function setupEventListeners() {
  startSimBtn.addEventListener('click', startSimulation);
  stopSimBtn.addEventListener('click', stopSimulation);
  
  addTaskBtn.addEventListener('click', () => {
    inlineInputContainer.classList.remove('hidden');
    taskTitleInput.focus();
  });

  taskTitleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const title = taskTitleInput.value.trim();
      if (title) {
        createTask(title);
        taskTitleInput.value = '';
        inlineInputContainer.classList.add('hidden');
      }
    }
  });

  injectChaosBtn.addEventListener('click', () => {
    appendLog('SYSTEM', 'Manual Override Triggered: Initiating Chaos Variable.');
    triggerAgentGamma();
  });

  resetSystemBtn.addEventListener('click', resetSystem);
}

// Telemetry Logic Pipeline[span_66](start_span)[span_66](end_span)[span_67](start_span)[span_67](end_span)
function appendLog(source, message) {
  const timestamp = new Date().toLocaleTimeString([], { hour12: false });
  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  
  let sourceClass = 'log-system';
  if (source === 'ALPHA') sourceClass = 'log-alpha';
  if (source === 'BETA') sourceClass = 'log-beta';
  if (source === 'GAMMA') sourceClass = 'log-gamma';

  logEntry.innerHTML = `<span class="log-time">[${timestamp}]</span> <span class="${sourceClass}">${source}:</span> ${message}`;
  telemetryLog.appendChild(logEntry);
  
  // Auto-scroll behavioral constraint execution[span_68](start_span)[span_68](end_span)[span_69](start_span)[span_69](end_span)
  telemetryLog.scrollTop = telemetryLog.scrollHeight;
}

// Task Factory Methods[span_70](start_span)[span_70](end_span)[span_71](start_span)[span_71](end_span)
function createTask(title) {
  if (state.lanes.backlog.length >= state.maxCapacity) {
    appendLog('SYSTEM', 'Task initialization aborted: Backlog lane max capacity reached.');
    return;
  }

  const idString = `#TSK-${state.nextTaskId++}`;
  const task = {
    id: idString,
    title: title,
    owner: 'NONE',
    flashClass: ''
  };

  state.lanes.backlog.push(task);
  appendLog('SYSTEM', `Task ${idString} created successfully within Backlog lane.`);
  renderLanes();
}

// Layout Rendering Pipeline[span_72](start_span)[span_72](end_span)[span_73](start_span)[span_73](end_span)
function renderLanes() {
  Object.keys(state.lanes).forEach(laneKey => {
    const track = laneTracks[laneKey];
    const laneData = state.lanes[laneKey];
    
    // Update counters
    laneCounts[laneKey].textContent = laneData.length;
    
    // Virtual DOM diffing optimization loop
    const existingCards = Array.from(track.children);
    
    // Re-render lane items systematically to avoid layout thrashing[span_74](start_span)[span_74](end_span)
    track.innerHTML = '';
    
    laneData.forEach(task => {
      const card = document.createElement('article');
      card.className = `task-card ${task.flashClass}`;
      card.id = `dom-${task.id.replace('#', '')}`;
      card.setAttribute('aria-label', `Task card ${task.id}: ${task.title}`);

      let badgeType = 'badge-none';
      if (task.owner === 'ALPHA') badgeType = 'badge-alpha';
      if (task.owner === 'BETA') badgeType = 'badge-beta';
      if (task.owner === 'GAMMA') badgeType = 'badge-gamma';

      card.innerHTML = `
        <div class="card-header">
          <span class="task-id">${task.id}</span>
        </div>
        <div class="card-body">${task.title}</div>
        <div class="card-footer">
          <span class="owner-badge ${badgeType}">${task.owner}</span>
        </div>
      `;
      
      track.appendChild(card);
    });
  });
}

// Conflict / Collision Keyframe Animation Wrapper[span_75](start_span)[span_75](end_span)[span_76](start_span)[span_76](end_span)
function applyFlash(task, agentName) {
  // If visual collision prioritization collision hits Alpha over Beta at the same loop sequence[span_77](start_span)[span_77](end_span)[span_78](start_span)[span_78](end_span)
  if (task.flashClass === 'flash-alpha' && agentName === 'BETA') {
    return; // Enforce visual priority rule cleanly[span_79](start_span)[span_79](end_span)[span_80](start_span)[span_80](end_span)
  }
  
  task.flashClass = `flash-${agentName.toLowerCase()}`;
  renderLanes();
  
  setTimeout(() => {
    task.flashClass = '';
    const element = document.getElementById(`dom-${task.id.replace('#', '')}`);
    if (element) {
      element.classList.remove(`flash-${agentName.toLowerCase()}`);
    }
  }, 300); // 300ms transition standard contract[span_81](start_span)[span_81](end_span)[span_82](start_span)[span_82](end_span)
}

// Simulation Control Loops[span_83](start_span)[span_83](end_span)[span_84](start_span)[span_84](end_span)
function startSimulation() {
  if (state.isSimulating) return;
  state.isSimulating = true;
  
  startSimBtn.classList.add('active');
  stopSimBtn.classList.remove('active');
  appendLog('SYSTEM', 'Simulation loop initiated. Agent loops online.');

  // Alpha Pipeline: Processing cycle loop[span_85](start_span)[span_85](end_span)[span_86](start_span)[span_86](end_span)
  state.intervals.push(setInterval(triggerAgentAlpha, 2200));
  // Beta Pipeline: Processing cycle loop[span_87](start_span)[span_87](end_span)[span_88](start_span)[span_88](end_span)
  state.intervals.push(setInterval(triggerAgentBeta, 3500));
  // Gamma Pipeline: Automated stochastic interval checks[span_89](start_span)[span_89](end_span)[span_90](start_span)[span_90](end_span)
  state.intervals.push(setInterval(() => {
    if (Math.random() > 0.7) triggerAgentGamma();
  }, 6000));
}

function stopSimulation() {
  if (!state.isSimulating) return;
  state.isSimulating = false;
  
  startSimBtn.classList.remove('active');
  stopSimBtn.classList.add('active');
  
  state.intervals.forEach(clearInterval);
  state.intervals = [];
  appendLog('SYSTEM', 'Simulation loops paused. Active pipelines halted.');
}

function resetSystem() {
  stopSimulation();
  stopSimBtn.classList.remove('active');
  
  state.nextTaskId = 101;
  state.lanes = { backlog: [], 'in-progress': [], review: [], done: [] };
  telemetryLog.innerHTML = '';
  
  appendLog('SYSTEM', 'System parameters wiped. Internal registers cleared.');
  renderLanes();
}

// Agent Logic Implementations[span_91](start_span)[span_91](end_span)[span_92](start_span)[span_92](end_span)
function triggerAgentAlpha() {
  // Agent Alpha: Targets Backlog -> In Progress -> Review lanes[span_93](start_span)[span_93](end_span)[span_94](start_span)[span_94](end_span)
  if (state.lanes.backlog.length > 0 && state.lanes['in-progress'].length < state.maxCapacity) {
    const task = state.lanes.backlog.shift();
    task.owner = 'ALPHA';
    state.lanes['in-progress'].push(task);
    applyFlash(task, 'ALPHA');
    appendLog('ALPHA', `Moved task ${task.id} from Backlog to In Progress.`);
  } else if (state.lanes['in-progress'].length > 0 && state.lanes.review.length < state.maxCapacity) {
    const task = state.lanes['in-progress'].shift();
    task.owner = 'ALPHA';
    state.lanes.review.push(task);
    applyFlash(task, 'ALPHA');
    appendLog('ALPHA', `Pushed task ${task.id} from In Progress to Review for audit evaluation.`);
  }
  renderLanes();
}

function triggerAgentBeta() {
  // Agent Beta: Scans Review and Done columns for structural regression validation[span_95](start_span)[span_95](end_span)[span_96](start_span)[span_96](end_span)
  if (state.lanes.review.length > 0 && state.lanes['in-progress'].length < state.maxCapacity) {
    // 40% automated threshold assumption calculation to pull back tasks[span_97](start_span)[span_97](end_span)[span_98](start_span)[span_98](end_span)
    if (Math.random() > 0.6) {
      const task = state.lanes.review.shift();
      task.owner = 'BETA';
      state.lanes['in-progress'].push(task);
      applyFlash(task, 'BETA');
      appendLog('BETA', `Audit failure caught on ${task.id}! Regressed from Review down to In Progress.`);
    } else if (state.lanes.review.length > 0 && state.lanes.done.length < state.maxCapacity) {
      const task = state.lanes.review.shift();
      task.owner = 'BETA';
      state.lanes.done.push(task);
      applyFlash(task, 'BETA');
      appendLog('BETA', `Task ${task.id} verified passed. Completed into Done lane.`);
    }
  }
  renderLanes();
}

function triggerAgentGamma() {
  // Agent Gamma: The Chaos Variable[span_99](start_span)[span_99](end_span)[span_100](start_span)[span_100](end_span)
  const mutations = ['SWAP', 'REGRESS', 'DUPLICATE'];
  const activeMutation = mutations[Math.floor(Math.random() * mutations.length)];
  
  if (activeMutation === 'SWAP') {
    // Spatial positioning transformation routine[span_101](start_span)[span_101](end_span)[span_102](start_span)[span_102](end_span)
    const activeLanes = Object.keys(state.lanes).filter(l => state.lanes[l].length > 0);
    if (activeLanes.length >= 2) {
      const l1 = activeLanes[0];
      const l2 = activeLanes[1];
      const t1 = state.lanes[l1].shift();
      const t2 = state.lanes[l2].shift();
      
      t1.owner = 'GAMMA';
      t2.owner = 'GAMMA';
      
      state.lanes[l2].push(t1);
      state.lanes[l1].push(t2);
      
      applyFlash(t1, 'GAMMA');
      applyFlash(t2, 'GAMMA');
      appendLog('GAMMA', `Spatial mutation executed: Swapped spatial coordinates of ${t1.id} and ${t2.id}.`);
    }
  } else if (activeMutation === 'REGRESS') {
    // Drop task back down pipeline layout chain tracking[span_103](start_span)[span_103](end_span)[span_104](start_span)[span_104](end_span)
    if (state.lanes.done.length > 0 && state.lanes.backlog.length < state.maxCapacity) {
      const task = state.lanes.done.shift();
      task.owner = 'GAMMA';
      state.lanes.backlog.push(task);
      applyFlash(task, 'GAMMA');
      appendLog('GAMMA', `Anarchy inject! Transformed ${task.id} from Done all the way back to Backlog.`);
    }
  } else if (activeMutation === 'DUPLICATE') {
    // Chaos duplication tracking rule implementation[span_105](start_span)[span_105](end_span)[span_106](start_span)[span_106](end_span)
    const activeLanes = Object.keys(state.lanes).filter(l => state.lanes[l].length > 0);
    if (activeLanes.length > 0) {
      const chosenLane = activeLanes[Math.floor(Math.random() * activeLanes.length)];
      if (state.lanes[chosenLane].length < state.maxCapacity) {
        const original = state.lanes[chosenLane][0];
        const clone = {
          id: `${original.id}-DUP`, // Structural modifier token appended[span_107](start_span)[span_107](end_span)[span_108](start_span)[span_108](end_span)
          title: original.title,
          owner: 'GAMMA',
          flashClass: ''
        };
        state.lanes[chosenLane].push(clone);
        applyFlash(original, 'GAMMA');
        applyFlash(clone, 'GAMMA');
        appendLog('GAMMA', `Cloned task target mutation: Spawned entity ${clone.id} inside ${chosenLane} lane.`);
      }
    }
  }
  renderLanes();
}

// Core Execution Hook
window.addEventListener('DOMContentLoaded', init);
