btnInjectChaos.addEventListener('click', () => {
  appendLog('USER', '⚡ CRITICAL CHAOS INJECTION: Simulating Core Worker Failure...');

  // Stop Alpha worker (simulate crash)
  if (alphaIntervalId !== null) {
    clearInterval(alphaIntervalId);
    alphaIntervalId = null;

    appendLog('GAMMA', '🚨 ALERT: AGENT_ALPHA thread has crashed and stopped processing!');
  }

  // Update UI to show crash state
  if (trackAlpha) {
    trackAlpha.textContent = "CRASHED [X_X]";
    trackAlpha.style.color = "#F85149";
  }

  // Inject system stress tasks
  appendLog('USER', '⚠️ SYSTEM STRESS: Injecting 5 emergency backlog tasks...');

  for (let i = 1; i <= 5; i++) {
    const idStr = `TASK-STRESS-${taskIdCounter++}`;

    tasks.push({
      id: idStr,
      title: `High-Stress Outage Telemetry Task ${idStr}`,
      lane: 'BACKLOG',
      version: 1,
      lastModifiedBy: 'USER',
      timestamp: Date.now()
    });
  }

  renderBoard();

  appendLog('GAMMA', 'SYSTEM DEGRADED: backlog overflow detected after ALPHA failure.');
});
