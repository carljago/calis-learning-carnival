/**
 * RewardSystem - Star and M&M tracking with animations
 * Stars display shows count TOWARD next M&M (resets to 0 when M&M earned)
 * All counts persist across games via ProgressTracker (localStorage)
 */
const RewardSystem = {
  sessionStars: 0,      // stars earned THIS session only (for end screen)
  sessionMMs: 0,        // MMs earned THIS session only (for end screen)
  _mmRatio: 10,
  _starsTowardMM: 0,    // displayed count - resets to 0 on M&M earn
  _totalMMs: 0,         // total MMs across all sessions

  /** Initialize - load persisted counts from ProgressTracker */
  init() {
    const settings = CarnivalUtils ? CarnivalUtils.getSettings() : {};
    this._mmRatio = settings.mmRatio || 10;
    this.sessionStars = 0;
    this.sessionMMs = 0;

    // Load persisted values
    if (window.ProgressTracker && ProgressTracker._data) {
      this._starsTowardMM = ProgressTracker._data.starsTowardMM || 0;
      this._totalMMs = ProgressTracker._data.totalMMs || 0;
    } else {
      this._starsTowardMM = 0;
      this._totalMMs = 0;
    }
  },

  /** Update ratio from settings */
  setRatio(ratio) {
    this._mmRatio = ratio;
  },

  /** Add a star and check for M&M conversion */
  addStar() {
    this.sessionStars++;
    this._starsTowardMM++;
    if (window.ProgressTracker) ProgressTracker.addStars(1);

    let mmEarned = false;
    if (this._starsTowardMM >= this._mmRatio) {
      this._starsTowardMM = 0; // Reset to 0 for counting toward next M&M
      this.sessionMMs++;
      this._totalMMs++;
      if (window.ProgressTracker) ProgressTracker.addMM(1);
      mmEarned = true;
    }

    // Persist starsTowardMM
    if (window.ProgressTracker) ProgressTracker.setStarsTowardMM(this._starsTowardMM);

    this.updateDisplay();
    return { starEarned: true, mmEarned };
  },

  /** Add multiple stars */
  addStars(n) {
    let result = { starEarned: true, mmEarned: false, mmsEarned: 0 };
    for (let i = 0; i < n; i++) {
      const r = this.addStar();
      if (r.mmEarned) {
        result.mmEarned = true;
        result.mmsEarned++;
      }
    }
    return result;
  },

  /** Animate star earned */
  animateStarEarned(container) {
    if (!container) container = document.body;
    const star = document.createElement('div');
    star.className = 'star-earned-anim';
    star.textContent = '\u2B50';
    star.style.cssText = 'position:fixed;font-size:80px;z-index:9999;pointer-events:none;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);';
    container.appendChild(star);

    requestAnimationFrame(() => {
      star.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      star.style.transform = 'translate(-50%,-50%) scale(1.2)';
      setTimeout(() => {
        const counter = document.getElementById('star-count');
        if (counter) {
          const rect = counter.getBoundingClientRect();
          star.style.transition = 'all 0.4s ease-in';
          star.style.transform = `translate(${rect.left - window.innerWidth/2}px, ${rect.top - window.innerHeight/2}px) scale(0.3)`;
          star.style.opacity = '0.5';
        } else {
          star.style.opacity = '0';
        }
        setTimeout(() => star.remove(), 500);
      }, 500);
    });

    if (window.AudioManager) AudioManager.play('starEarned');
  },

  /** Animate M&M earned */
  animateMMEarned(container) {
    if (!container) container = document.body;
    const mm = document.createElement('div');
    mm.className = 'mm-earned-anim';
    mm.textContent = '\uD83C\uDF6C';
    mm.style.cssText = 'position:fixed;font-size:100px;z-index:9999;pointer-events:none;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);';
    container.appendChild(mm);

    requestAnimationFrame(() => {
      mm.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      mm.style.transform = 'translate(-50%,-50%) scale(1.3)';
      setTimeout(() => {
        mm.style.transition = 'all 0.4s ease-in';
        mm.style.transform = 'translate(-50%,-50%) scale(0.8)';
        mm.style.opacity = '0';
        setTimeout(() => mm.remove(), 500);
      }, 800);
    });

    if (window.AudioManager) AudioManager.play('mmEarned');
    if (window.CarnivalUtils) CarnivalUtils.createConfetti(container);
  },

  /** Update the star/MM counter display - shows stars toward NEXT M&M and total MMs */
  updateDisplay() {
    const starEl = document.getElementById('star-count');
    const mmEl = document.getElementById('mm-count');
    const ratioEl = document.getElementById('star-ratio');
    if (starEl) starEl.textContent = this._starsTowardMM;
    if (mmEl) mmEl.textContent = this._totalMMs;
    if (ratioEl) ratioEl.textContent = this._mmRatio;
  },

  /** Render star counter into container - shows "X/Y stars toward next M&M" and total MMs */
  renderStarCounter(container) {
    container.innerHTML = `
      <div class="reward-counter">
        <div class="star-display">
          <span class="reward-icon">\u2B50</span>
          <span id="star-count" class="reward-num">${this._starsTowardMM}</span>
          <span style="font-size:16px;opacity:0.6;">/ <span id="star-ratio">${this._mmRatio}</span></span>
        </div>
        <div class="mm-display">
          <span class="reward-icon">\uD83C\uDF6C</span>
          <span id="mm-count" class="reward-num">${this._totalMMs}</span>
        </div>
      </div>
    `;
  },

  /** Get session summary for end screen */
  getSessionSummary() {
    return {
      stars: this.sessionStars,
      mms: this.sessionMMs,
      ratio: this._mmRatio
    };
  },

  /** Reset all counts (used when progress is reset) */
  reset() {
    this.sessionStars = 0;
    this.sessionMMs = 0;
    this._starsTowardMM = 0;
    this._totalMMs = 0;
    this.updateDisplay();
  }
};

window.RewardSystem = RewardSystem;
