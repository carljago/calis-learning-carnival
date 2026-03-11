/**
 * CarnivalUtils - Shared utilities for Cali's Learning Carnival
 */
const CarnivalUtils = {
  SETTINGS_KEY: 'calis-carnival-settings',

  defaultSettings: {
    mmRatio: 10,
    difficulty: 'easy',
    gameLength: 10,
    soundEnabled: true,
    volume: 0.7,
    vibrationEnabled: true,
    sessionTimer: 0
  },

  /** Shuffle array in place (Fisher-Yates) */
  shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  /** Pick random element from array */
  randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  /** Get a random encouragement phrase */
  randomEncouragement() {
    const phrases = [
      'Amazing job, Cali!',
      "You're a reading superstar!",
      'Wow! You got it!',
      "Keep going, you're doing great!",
      "That's the way!",
      'Awesome reading!',
      'Super star!',
      'You rock!',
      'Brilliant!',
      'Way to go!'
    ];
    return this.randomFromArray(phrases);
  },

  /** Format seconds to mm:ss */
  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  },

  /** Create confetti particles */
  createConfetti(container) {
    if (!container) container = document.body;
    const colors = ['#FF6B6B', '#FFA06B', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6', '#FF69B4'];
    for (let i = 0; i < 40; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.cssText = `
        position: fixed;
        width: ${Math.random() * 10 + 6}px;
        height: ${Math.random() * 10 + 6}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        z-index: 9999;
        pointer-events: none;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation: confetti-fall ${Math.random() * 2 + 1.5}s linear forwards;
        animation-delay: ${Math.random() * 0.5}s;
        transform: rotate(${Math.random() * 360}deg);
      `;
      container.appendChild(confetti);
      setTimeout(() => confetti.remove(), 4000);
    }
  },

  /** Create star burst at position */
  createStarBurst(container, x, y) {
    if (!container) container = document.body;
    for (let i = 0; i < 8; i++) {
      const star = document.createElement('div');
      star.textContent = '\u2B50';
      const angle = (i / 8) * Math.PI * 2;
      const dist = 60 + Math.random() * 40;
      star.style.cssText = `
        position: absolute;
        font-size: 24px;
        left: ${x}px;
        top: ${y}px;
        z-index: 9999;
        pointer-events: none;
        transition: all 0.6s ease-out;
        opacity: 1;
      `;
      container.appendChild(star);
      requestAnimationFrame(() => {
        star.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0.3)`;
        star.style.opacity = '0';
      });
      setTimeout(() => star.remove(), 700);
    }
  },

  /** Show big encouragement text that pops and fades */
  showEncouragement(container, text) {
    if (!container) container = document.body;
    const el = document.createElement('div');
    el.className = 'encouragement-popup';
    el.textContent = text;
    el.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      font-family: 'Fredoka One', cursive;
      font-size: clamp(32px, 6vw, 72px);
      color: #FFD93D;
      text-shadow: 3px 3px 0 #FF6B6B, -1px -1px 0 #FF6B6B;
      z-index: 9998;
      pointer-events: none;
      white-space: nowrap;
      animation: encouragement-pop 1.5s ease-out forwards;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  },

  /** Get settings from localStorage */
  getSettings() {
    const saved = localStorage.getItem(this.SETTINGS_KEY);
    if (saved) {
      return { ...this.defaultSettings, ...JSON.parse(saved) };
    }
    return { ...this.defaultSettings };
  },

  /** Save settings */
  saveSettings(settings) {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    // Update dependent systems
    if (window.RewardSystem) RewardSystem.setRatio(settings.mmRatio);
    if (window.AudioManager) {
      AudioManager.setEnabled(settings.soundEnabled);
      AudioManager.setVolume(settings.volume);
    }
  },

  /** Initialize parent settings panel */
  initParentSettings() {
    const overlay = document.getElementById('parent-settings-overlay');
    if (!overlay) return;

    const settings = this.getSettings();

    // M&M Ratio slider
    const ratioSlider = document.getElementById('setting-mm-ratio');
    const ratioDisplay = document.getElementById('ratio-display');
    if (ratioSlider) {
      ratioSlider.value = settings.mmRatio;
      if (ratioDisplay) ratioDisplay.textContent = settings.mmRatio;
      ratioSlider.addEventListener('input', () => {
        const val = parseInt(ratioSlider.value);
        if (ratioDisplay) ratioDisplay.textContent = val;
        settings.mmRatio = val;
        this.saveSettings(settings);
      });
    }

    // Difficulty radios
    document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
      if (radio.value === settings.difficulty) radio.checked = true;
      radio.addEventListener('change', () => {
        settings.difficulty = radio.value;
        this.saveSettings(settings);
      });
    });

    // Game length radios
    document.querySelectorAll('input[name="gameLength"]').forEach(radio => {
      if (parseInt(radio.value) === settings.gameLength) radio.checked = true;
      radio.addEventListener('change', () => {
        settings.gameLength = parseInt(radio.value);
        this.saveSettings(settings);
      });
    });

    // Sound toggle
    const soundToggle = document.getElementById('setting-sound');
    if (soundToggle) {
      soundToggle.checked = settings.soundEnabled;
      soundToggle.addEventListener('change', () => {
        settings.soundEnabled = soundToggle.checked;
        this.saveSettings(settings);
      });
    }

    // Volume slider
    const volumeSlider = document.getElementById('setting-volume');
    if (volumeSlider) {
      volumeSlider.value = settings.volume;
      volumeSlider.addEventListener('input', () => {
        settings.volume = parseFloat(volumeSlider.value);
        this.saveSettings(settings);
      });
    }

    // Vibration toggle
    const vibToggle = document.getElementById('setting-vibration');
    if (vibToggle) {
      vibToggle.checked = settings.vibrationEnabled;
      vibToggle.addEventListener('change', () => {
        settings.vibrationEnabled = vibToggle.checked;
        this.saveSettings(settings);
      });
    }

    // Session timer
    const timerSelect = document.getElementById('setting-timer');
    if (timerSelect) {
      timerSelect.value = settings.sessionTimer;
      timerSelect.addEventListener('change', () => {
        settings.sessionTimer = parseInt(timerSelect.value);
        this.saveSettings(settings);
      });
    }

    // Close button
    const closeBtn = document.getElementById('settings-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        overlay.classList.add('hidden');
      });
    }

    // Reset progress
    const resetBtn = document.getElementById('settings-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
          if (window.ProgressTracker) ProgressTracker.resetProgress();
          alert('Progress has been reset.');
        }
      });
    }

    // Export report
    const exportBtn = document.getElementById('settings-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (window.ProgressTracker) ProgressTracker.exportReport();
      });
    }

    // View progress
    const viewBtn = document.getElementById('settings-view-progress');
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        this.showProgressModal();
      });
    }
  },

  /** Show progress modal */
  showProgressModal() {
    const modal = document.getElementById('progress-modal');
    if (!modal) return;

    const summary = window.ProgressTracker ? ProgressTracker.getSummary() : {};
    const content = document.getElementById('progress-content');
    if (content) {
      let html = `<h3>Cali's Progress</h3>`;
      html += `<p><strong>Total Sessions:</strong> ${summary.gamesPlayed || 0}</p>`;
      html += `<p><strong>Total Stars:</strong> ${summary.totalStars || 0} \u2B50</p>`;
      html += `<p><strong>Total M&Ms:</strong> ${summary.totalMMs || 0} \uD83C\uDF6C</p>`;

      if (summary.words) {
        html += `<h4>Words</h4>`;
        html += `<p>Mastered: ${summary.words.mastered}/${summary.words.total}</p>`;
        html += `<p>Accuracy: ${summary.words.accuracy}%</p>`;
        if (summary.words.needsWork.length) {
          html += `<p>Needs Work: ${summary.words.needsWork.join(', ')}</p>`;
        }
      }

      if (summary.math) {
        html += `<h4>Math</h4>`;
        html += `<p>Current Level: ${summary.math.currentLevel}</p>`;
        html += `<p>Accuracy: ${summary.math.accuracy}%</p>`;
      }

      content.innerHTML = html;
    }

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('progress-close');
    if (closeBtn) {
      closeBtn.onclick = () => modal.classList.add('hidden');
    }
  },

  /** Show end-of-game screen */
  showEndScreen(container, stats) {
    const settings = this.getSettings();
    container.innerHTML = `
      <div class="end-screen">
        <h1 class="end-title">Great Job, Cali!</h1>
        <div class="end-stats">
          <div class="end-stat"><span class="end-icon">\u2B50</span><span class="end-label">Stars Earned</span><span class="end-value">${stats.stars || 0}</span></div>
          <div class="end-stat"><span class="end-icon">\uD83C\uDF6C</span><span class="end-label">M&Ms Earned</span><span class="end-value">${stats.mms || 0}</span></div>
          ${stats.wordsCorrect !== undefined ? `<div class="end-stat"><span class="end-icon">\uD83D\uDCDA</span><span class="end-label">Words Correct</span><span class="end-value">${stats.wordsCorrect}</span></div>` : ''}
          ${stats.mathCorrect !== undefined ? `<div class="end-stat"><span class="end-icon">\uD83D\uDD22</span><span class="end-label">Math Correct</span><span class="end-value">${stats.mathCorrect}</span></div>` : ''}
          ${stats.totalQuestions !== undefined ? `<div class="end-stat"><span class="end-icon">\u2705</span><span class="end-label">Total Done</span><span class="end-value">${stats.totalQuestions}</span></div>` : ''}
        </div>
        <div class="end-buttons">
          <button class="btn btn-green" id="play-again-btn">Play Again</button>
          <button class="btn btn-blue" id="main-menu-btn">Main Menu</button>
        </div>
      </div>
    `;

    this.createConfetti(container);
    if (window.AudioManager) AudioManager.play('celebration');

    document.getElementById('play-again-btn').addEventListener('click', () => location.reload());
    document.getElementById('main-menu-btn').addEventListener('click', () => {
      const isInGames = location.pathname.includes('/games/');
      location.href = isInGames ? '../index.html' : 'index.html';
    });

    // Record session
    if (window.ProgressTracker) {
      ProgressTracker.recordSession(stats);
    }

    // Setup gamepad for end screen buttons
    if (window.GamepadManager) {
      GamepadManager.clearFocusGroups();
      GamepadManager.registerFocusGroup(
        document.querySelectorAll('.end-buttons .btn'),
        { id: 'end-buttons' }
      );
    }
  },

  /** Start session timer */
  startSessionTimer(minutes) {
    if (!minutes || minutes <= 0) return;
    let remaining = minutes * 60;
    const timerEl = document.getElementById('session-timer');
    if (timerEl) timerEl.classList.remove('hidden');

    const interval = setInterval(() => {
      remaining--;
      if (timerEl) timerEl.textContent = this.formatTime(remaining);

      if (remaining === 120) {
        this.showEncouragement(document.body, 'Almost done! 2 minutes left!');
      }

      if (remaining <= 0) {
        clearInterval(interval);
        this.showEncouragement(document.body, 'Great session! Time to take a break!');
      }
    }, 1000);

    return interval;
  }
};

/** Make button guide items clickable */
document.addEventListener('DOMContentLoaded', () => {
  const guide = document.getElementById('button-guide');
  if (!guide) return;

  // Map button class/label to the GamepadManager event
  const btnMap = {
    'xbox-a': 'a_press',
    'xbox-b': 'b_press',
    'xbox-x': 'x_press',
    'xbox-y': 'y_press'
  };

  guide.querySelectorAll('.guide-btn').forEach(btn => {
    // Skip the "Arrows: Navigate" button
    if (btn.textContent.toLowerCase().includes('arrow')) return;

    // Find which xbox button class is inside
    let event = null;
    for (const [cls, evt] of Object.entries(btnMap)) {
      if (btn.querySelector('.' + cls)) {
        event = evt;
        break;
      }
    }
    if (!event) return;

    btn.classList.add('clickable');
    btn.addEventListener('click', () => {
      if (window.GamepadManager) {
        // For A press, also click the focused element
        if (event === 'a_press') {
          const focused = GamepadManager.getFocused();
          GamepadManager._emit(event, focused);
          if (focused) focused.click();
        } else {
          GamepadManager._emit(event);
        }
      }
    });
  });
});

window.CarnivalUtils = CarnivalUtils;
