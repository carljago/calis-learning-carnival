/**
 * MathEngine - Math problem generator for Cali's Learning Carnival
 */
const MathEngine = {
  _tracking: null,
  _correctStreak: 0,
  _currentLevel: 'add5',
  levels: ['add5', 'sub5', 'add10', 'sub10', 'bonds'],

  _initTracking() {
    if (this._tracking) return;
    const saved = localStorage.getItem('calis-math-tracking');
    if (saved) {
      const data = JSON.parse(saved);
      this._tracking = data.tracking;
      this._correctStreak = data.correctStreak || 0;
      this._currentLevel = data.currentLevel || 'add5';
    } else {
      this._tracking = {};
      this.levels.forEach(l => {
        this._tracking[l] = { seen: 0, correct: 0 };
      });
      this._saveTracking();
    }
  },

  _saveTracking() {
    localStorage.setItem('calis-math-tracking', JSON.stringify({
      tracking: this._tracking,
      correctStreak: this._correctStreak,
      currentLevel: this._currentLevel
    }));
  },

  /** Generate a random problem of a given type */
  generateProblem(type) {
    let a, b, op, answer, display;
    switch (type) {
      case 'add5':
        a = Math.floor(Math.random() * 5) + 1;
        b = Math.floor(Math.random() * (5 - a)) + (a === 5 ? 0 : 0);
        b = Math.min(b, 5 - a);
        if (b < 0) b = 0;
        op = '+';
        answer = a + b;
        break;
      case 'sub5':
        a = Math.floor(Math.random() * 4) + 2; // 2-5
        b = Math.floor(Math.random() * a) + 1; // 1 to a
        if (b >= a) b = a - 1;
        if (b < 1) b = 1;
        op = '-';
        answer = a - b;
        break;
      case 'add10':
        a = Math.floor(Math.random() * 9) + 1;
        b = Math.floor(Math.random() * (10 - a)) + 1;
        if (a + b > 10) b = 10 - a;
        op = '+';
        answer = a + b;
        break;
      case 'sub10':
        a = Math.floor(Math.random() * 5) + 6; // 6-10
        b = Math.floor(Math.random() * (a - 1)) + 1;
        op = '-';
        answer = a - b;
        break;
      case 'bonds':
        const target = Math.random() < 0.5 ? 5 : 10;
        b = Math.floor(Math.random() * (target - 1)) + 1;
        a = target;
        op = 'bond';
        answer = target - b;
        display = `${target} = ${b} + ?`;
        break;
      default:
        return this.generateProblem('add5');
    }

    if (!display) {
      display = `${a} ${op} ${b} = ?`;
    }

    return { a, b, op, answer, type, display };
  },

  /** Check if answer is correct */
  checkAnswer(problem, userAnswer) {
    return parseInt(userAnswer) === problem.answer;
  },

  /** Get next problem based on progressive difficulty */
  getNextProblem() {
    this._initTracking();
    return this.generateProblem(this._currentLevel);
  },

  /** Record a correct answer and potentially advance level */
  recordCorrect() {
    this._initTracking();
    this._correctStreak++;
    if (this._tracking[this._currentLevel]) {
      this._tracking[this._currentLevel].correct++;
    }
    // Progressive difficulty
    if (this._correctStreak >= 20 && this._currentLevel === 'sub10') {
      this._currentLevel = 'bonds';
    } else if (this._correctStreak >= 15 && this._currentLevel === 'add10') {
      this._currentLevel = 'sub10';
    } else if (this._correctStreak >= 10 && this._currentLevel === 'sub5') {
      this._currentLevel = 'add10';
    } else if (this._correctStreak >= 5 && this._currentLevel === 'add5') {
      this._currentLevel = 'sub5';
    }
    this._saveTracking();
  },

  /** Record that a problem was seen */
  recordSeen() {
    this._initTracking();
    if (this._tracking[this._currentLevel]) {
      this._tracking[this._currentLevel].seen++;
    }
    this._saveTracking();
  },

  /** Record incorrect - doesn't break streak for retries */
  recordIncorrect() {
    // No streak break - they can retry
  },

  /** Force level up */
  levelUp() {
    this._initTracking();
    const idx = this.levels.indexOf(this._currentLevel);
    if (idx < this.levels.length - 1) {
      this._currentLevel = this.levels[idx + 1];
      this._saveTracking();
    }
  },

  /** Force level down */
  levelDown() {
    this._initTracking();
    const idx = this.levels.indexOf(this._currentLevel);
    if (idx > 0) {
      this._currentLevel = this.levels[idx - 1];
      this._saveTracking();
    }
  },

  /** Generate ten frame data for a number */
  generateTenFrameData(total, highlight, crossOut) {
    // Returns array of 10 cells: 'filled', 'highlight', 'crossout', 'empty'
    const cells = [];
    for (let i = 0; i < 10; i++) {
      if (crossOut && i >= (total - crossOut) && i < total) {
        cells.push('crossout');
      } else if (i < total) {
        cells.push(highlight && i >= (total - highlight) ? 'highlight' : 'filled');
      } else {
        cells.push('empty');
      }
    }
    return cells;
  },

  /** Generate number line data */
  generateNumberLineData(start, end, hops, direction) {
    return { start, end, hops, direction: direction || 'forward' };
  },

  /** Get statistics */
  getStats() {
    this._initTracking();
    let totalSeen = 0, totalCorrect = 0;
    const byLevel = {};
    this.levels.forEach(l => {
      const t = this._tracking[l] || { seen: 0, correct: 0 };
      totalSeen += t.seen;
      totalCorrect += t.correct;
      byLevel[l] = { ...t, accuracy: t.seen > 0 ? Math.round((t.correct / t.seen) * 100) : 0 };
    });
    return {
      currentLevel: this._currentLevel,
      correctStreak: this._correctStreak,
      totalSeen,
      totalCorrect,
      accuracy: totalSeen > 0 ? Math.round((totalCorrect / totalSeen) * 100) : 0,
      byLevel
    };
  },

  /** Reset tracking */
  resetTracking() {
    this._tracking = null;
    this._correctStreak = 0;
    this._currentLevel = 'add5';
    localStorage.removeItem('calis-math-tracking');
    this._initTracking();
  }
};

window.MathEngine = MathEngine;
