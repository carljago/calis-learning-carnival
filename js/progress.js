/**
 * ProgressTracker - Save/load progress for Cali's Learning Carnival
 */
const ProgressTracker = {
  _data: null,
  STORAGE_KEY: 'calis-carnival-progress',

  /** Load progress from localStorage */
  load() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this._data = JSON.parse(saved);
      // Migrate: ensure starsTowardMM field exists
      if (this._data.starsTowardMM === undefined) {
        this._data.starsTowardMM = 0;
        this.save();
      }
    } else {
      this._data = {
        totalStars: 0,
        totalMMs: 0,
        starsTowardMM: 0,
        gamesPlayed: 0,
        sessionHistory: [],
        lastPlayed: null
      };
      this.save();
    }
    return this._data;
  },

  /** Save progress to localStorage */
  save() {
    if (!this._data) this.load();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._data));
  },

  /** Add stars to total */
  addStars(count) {
    if (!this._data) this.load();
    this._data.totalStars += count;
    this.save();
  },

  /** Add M&M to total */
  addMM(count) {
    if (!this._data) this.load();
    this._data.totalMMs += (count || 1);
    this.save();
  },

  /** Set stars-toward-next-MM count */
  setStarsTowardMM(count) {
    if (!this._data) this.load();
    this._data.starsTowardMM = count;
    this.save();
  },

  /** Record a completed game session */
  recordSession(session) {
    if (!this._data) this.load();
    this._data.gamesPlayed++;
    this._data.lastPlayed = new Date().toISOString();
    this._data.sessionHistory.unshift({
      ...session,
      date: new Date().toISOString()
    });
    // Keep only last 10 sessions
    if (this._data.sessionHistory.length > 10) {
      this._data.sessionHistory = this._data.sessionHistory.slice(0, 10);
    }
    this.save();
  },

  /** Get words report */
  getWordsReport() {
    if (window.WordLibrary) {
      return WordLibrary.getStats();
    }
    return null;
  },

  /** Get math report */
  getMathReport() {
    if (window.MathEngine) {
      return MathEngine.getStats();
    }
    return null;
  },

  /** Get full progress summary */
  getSummary() {
    if (!this._data) this.load();
    return {
      totalStars: this._data.totalStars,
      totalMMs: this._data.totalMMs,
      gamesPlayed: this._data.gamesPlayed,
      lastPlayed: this._data.lastPlayed,
      recentSessions: this._data.sessionHistory.slice(0, 5),
      words: this.getWordsReport(),
      math: this.getMathReport()
    };
  },

  /** Reset all progress */
  resetProgress() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('calis-word-tracking');
    localStorage.removeItem('calis-math-tracking');
    localStorage.removeItem('calis-carnival-settings');
    localStorage.removeItem('calis-daily-bonus');
    this._data = null;
    if (window.WordLibrary) WordLibrary.resetTracking();
    if (window.MathEngine) MathEngine.resetTracking();
    this.load();
  },

  /** Export a simple text report */
  exportReport() {
    const s = this.getSummary();
    let report = "=== Cali's Learning Carnival - Progress Report ===\n";
    report += `Date: ${new Date().toLocaleDateString()}\n\n`;
    report += `Total Sessions: ${s.gamesPlayed}\n`;
    report += `Total Stars: ${s.totalStars}\n`;
    report += `Total M&Ms: ${s.totalMMs}\n\n`;

    if (s.words) {
      report += `--- Words ---\n`;
      report += `Mastered: ${s.words.mastered}/${s.words.total}\n`;
      report += `Accuracy: ${s.words.accuracy}%\n`;
      if (s.words.mostPracticed.length) {
        report += `Most Practiced: ${s.words.mostPracticed.map(w => `${w.word}(${w.times}x)`).join(', ')}\n`;
      }
      if (s.words.needsWork.length) {
        report += `Needs Work: ${s.words.needsWork.join(', ')}\n`;
      }
      report += '\n';
    }

    if (s.math) {
      report += `--- Math ---\n`;
      report += `Current Level: ${s.math.currentLevel}\n`;
      report += `Accuracy: ${s.math.accuracy}%\n`;
      report += `Streak: ${s.math.correctStreak}\n`;
    }

    // Download as text file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calis-progress-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

window.ProgressTracker = ProgressTracker;
