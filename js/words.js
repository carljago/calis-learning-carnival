/**
 * WordLibrary - Complete word library for Cali's Learning Carnival
 * 120+ words organized by tier with tracking
 */
const WordLibrary = {
  words: [
    // Tier 1A - Basic Sight Words (25)
    { word: 'I', tier: '1A', sentence: 'I like to play.' },
    { word: 'like', tier: '1A', sentence: 'I like my dog.' },
    { word: 'am', tier: '1A', sentence: 'I am happy.' },
    { word: 'the', tier: '1A', sentence: 'The cat is big.' },
    { word: 'we', tier: '1A', sentence: 'We can play.' },
    { word: 'go', tier: '1A', sentence: 'Let us go outside.' },
    { word: 'see', tier: '1A', sentence: 'I see a bird.' },
    { word: 'at', tier: '1A', sentence: 'Look at me!' },
    { word: 'can', tier: '1A', sentence: 'I can do it!' },
    { word: 'she', tier: '1A', sentence: 'She is my friend.' },
    { word: 'a', tier: '1A', sentence: 'I see a dog.' },
    { word: 'is', tier: '1A', sentence: 'He is nice.' },
    { word: 'in', tier: '1A', sentence: 'The cat is in the box.' },
    { word: 'it', tier: '1A', sentence: 'I like it!' },
    { word: 'an', tier: '1A', sentence: 'I see an apple.' },
    { word: 'if', tier: '1A', sentence: 'See if you can.' },
    { word: 'he', tier: '1A', sentence: 'He can run fast.' },
    { word: 'has', tier: '1A', sentence: 'She has a cat.' },
    { word: 'on', tier: '1A', sentence: 'The book is on the desk.' },
    { word: 'not', tier: '1A', sentence: 'I am not sad.' },
    { word: 'and', tier: '1A', sentence: 'Mom and Dad.' },
    { word: 'you', tier: '1A', sentence: 'I like you!' },
    { word: 'with', tier: '1A', sentence: 'Come with me.' },
    { word: 'up', tier: '1A', sentence: 'Jump up high!' },
    { word: 'for', tier: '1A', sentence: 'This is for you.' },

    // Tier 1B - Common Sight Words (25)
    { word: 'no', tier: '1B', sentence: 'No, thank you.' },
    { word: 'one', tier: '1B', sentence: 'I have one cat.' },
    { word: 'get', tier: '1B', sentence: 'I can get it.' },
    { word: 'did', tier: '1B', sentence: 'I did it!' },
    { word: 'are', tier: '1B', sentence: 'We are friends.' },
    { word: 'have', tier: '1B', sentence: 'I have a dog.' },
    { word: 'said', tier: '1B', sentence: 'She said hello.' },
    { word: 'two', tier: '1B', sentence: 'I have two hands.' },
    { word: 'look', tier: '1B', sentence: 'Look at this!' },
    { word: 'me', tier: '1B', sentence: 'Help me please.' },
    { word: 'come', tier: '1B', sentence: 'Come and play!' },
    { word: 'here', tier: '1B', sentence: 'Come over here.' },
    { word: 'yes', tier: '1B', sentence: 'Yes, I can!' },
    { word: 'my', tier: '1B', sentence: 'This is my book.' },
    { word: 'to', tier: '1B', sentence: 'I like to run.' },
    { word: 'of', tier: '1B', sentence: 'A lot of fun.' },
    { word: 'what', tier: '1B', sentence: 'What is that?' },
    { word: 'put', tier: '1B', sentence: 'Put it here.' },
    { word: 'want', tier: '1B', sentence: 'I want to play.' },
    { word: 'saw', tier: '1B', sentence: 'I saw a bird.' },
    { word: 'this', tier: '1B', sentence: 'I like this one.' },
    { word: 'little', tier: '1B', sentence: 'A little puppy.' },
    { word: 'play', tier: '1B', sentence: 'Let us play!' },
    { word: 'big', tier: '1B', sentence: 'A big, big bear.' },
    { word: 'jump', tier: '1B', sentence: 'I can jump high!' },

    // Tier 1C - Challenge Sight Words (20)
    { word: 'eat', tier: '1C', sentence: 'I like to eat apples.' },
    { word: 'was', tier: '1C', sentence: 'It was fun!' },
    { word: 'her', tier: '1C', sentence: 'I like her hat.' },
    { word: 'down', tier: '1C', sentence: 'Sit down please.' },
    { word: 'friend', tier: '1C', sentence: 'She is my friend.' },
    { word: 'they', tier: '1C', sentence: 'They are playing.' },
    { word: 'very', tier: '1C', sentence: 'I am very happy.' },
    { word: 'out', tier: '1C', sentence: 'Let us go out.' },
    { word: 'good', tier: '1C', sentence: 'Good job!' },
    { word: 'all', tier: '1C', sentence: 'We all like it.' },
    { word: 'our', tier: '1C', sentence: 'This is our house.' },
    { word: 'your', tier: '1C', sentence: 'Is this your book?' },
    { word: 'girl', tier: '1C', sentence: 'The girl can run.' },
    { word: 'when', tier: '1C', sentence: 'When can we go?' },
    { word: 'love', tier: '1C', sentence: 'I love you!' },
    { word: 'away', tier: '1C', sentence: 'Run away fast!' },
    { word: 'yellow', tier: '1C', sentence: 'The sun is yellow.' },
    { word: 'happy', tier: '1C', sentence: 'I am so happy!' },
    { word: 'how', tier: '1C', sentence: 'How are you?' },
    { word: 'over', tier: '1C', sentence: 'Come over here.' },

    // Tier 2 - Instruction Words (40)
    { word: 'write', tier: '2', sentence: 'Write your name.' },
    { word: 'sound', tier: '2', sentence: 'What sound does it make?' },
    { word: 'circle', tier: '2', sentence: 'Circle the answer.' },
    { word: 'word', tier: '2', sentence: 'Read the word.' },
    { word: 'that', tier: '2', sentence: 'I like that one.' },
    { word: 'ends', tier: '2', sentence: 'The word ends with T.' },
    { word: 'picture', tier: '2', sentence: 'Look at the picture.' },
    { word: 'shown', tier: '2', sentence: 'The picture is shown.' },
    { word: 'missing', tier: '2', sentence: 'Find the missing number.' },
    { word: 'numbers', tier: '2', sentence: 'Write the numbers.' },
    { word: 'lines', tier: '2', sentence: 'Draw the lines.' },
    { word: 'count', tier: '2', sentence: 'Count to ten.' },
    { word: 'number', tier: '2', sentence: 'What number is it?' },
    { word: 'sounds', tier: '2', sentence: 'The letter sounds like...' },
    { word: 'color', tier: '2', sentence: 'Color it red.' },
    { word: 'many', tier: '2', sentence: 'How many are there?' },
    { word: 'boxes', tier: '2', sentence: 'Color the boxes.' },
    { word: 'crayon', tier: '2', sentence: 'Use your crayon.' },
    { word: 'correct', tier: '2', sentence: 'Pick the correct one.' },
    { word: 'solve', tier: '2', sentence: 'Solve the problem.' },
    { word: 'addition', tier: '2', sentence: 'Do the addition.' },
    { word: 'problems', tier: '2', sentence: 'Solve the problems.' },
    { word: 'sum', tier: '2', sentence: 'Find the sum.' },
    { word: 'letter', tier: '2', sentence: 'Write the letter.' },
    { word: 'correctly', tier: '2', sentence: 'Say it correctly.' },
    { word: 'across', tier: '2', sentence: 'Go across the page.' },
    { word: 'subtraction', tier: '2', sentence: 'Do the subtraction.' },
    { word: 'fill', tier: '2', sentence: 'Fill in the blank.' },
    { word: 'parts', tier: '2', sentence: 'Find the parts.' },
    { word: 'alphabet', tier: '2', sentence: 'Say the alphabet.' },
    { word: 'finish', tier: '2', sentence: 'Finish the sentence.' },
    { word: 'sentence', tier: '2', sentence: 'Read the sentence.' },
    { word: 'first', tier: '2', sentence: 'You are first!' },
    { word: 'name', tier: '2', sentence: 'Write your name.' },
    { word: 'read', tier: '2', sentence: 'Read the book.' },
    { word: 'together', tier: '2', sentence: 'Let us read together.' },
    { word: 'each', tier: '2', sentence: 'Read each word.' },
    { word: 'night', tier: '2', sentence: 'Good night!' },
    { word: 'draw', tier: '2', sentence: 'Draw a picture.' },
    { word: 'from', tier: '2', sentence: 'Pick from the list.' },

    // Tier 3 - Content Words (10)
    { word: 'sock', tier: '3', sentence: 'I lost my sock.' },
    { word: 'lock', tier: '3', sentence: 'Lock the door.' },
    { word: 'bug', tier: '3', sentence: 'I see a little bug.' },
    { word: 'drum', tier: '3', sentence: 'I play the drum.' },
    { word: 'frog', tier: '3', sentence: 'The frog can jump.' },
    { word: 'clock', tier: '3', sentence: 'Look at the clock.' },
    { word: 'plant', tier: '3', sentence: 'Water the plant.' },
    { word: 'red', tier: '3', sentence: 'I like the color red.' },
    { word: 'blue', tier: '3', sentence: 'The sky is blue.' },
    { word: 'green', tier: '3', sentence: 'The grass is green.' }
  ],

  _trackingData: null,

  /** Initialize or load tracking data for each word */
  _initTracking() {
    if (this._trackingData) return;
    const saved = localStorage.getItem('calis-word-tracking');
    if (saved) {
      this._trackingData = JSON.parse(saved);
    } else {
      this._trackingData = {};
      this.words.forEach(w => {
        this._trackingData[w.word] = {
          needs_practice: false,
          mastered: false,
          times_seen: 0,
          times_correct: 0
        };
      });
      this._saveTracking();
    }
  },

  _saveTracking() {
    localStorage.setItem('calis-word-tracking', JSON.stringify(this._trackingData));
  },

  /** Get tracking info for a word */
  getTracking(word) {
    this._initTracking();
    return this._trackingData[word] || { needs_practice: false, mastered: false, times_seen: 0, times_correct: 0 };
  },

  /** Get words filtered by difficulty setting */
  getWordsForDifficulty(difficulty) {
    this._initTracking();
    switch (difficulty) {
      case 'easy':
        return this.words.filter(w => w.tier === '1A');
      case 'medium':
        return this.words.filter(w => ['1A', '1B', '1C'].includes(w.tier));
      case 'hard':
        return this.words.filter(w => true);
      default:
        return this.words.filter(w => w.tier === '1A');
    }
  },

  /** Get a shuffled list of words for a game session, prioritizing needs_practice */
  getSessionWords(difficulty, count) {
    this._initTracking();
    const available = this.getWordsForDifficulty(difficulty);
    const needsPractice = available.filter(w => this._trackingData[w.word] && this._trackingData[w.word].needs_practice);
    const mastered = available.filter(w => this._trackingData[w.word] && this._trackingData[w.word].mastered);
    const normal = available.filter(w => {
      const t = this._trackingData[w.word];
      return t && !t.needs_practice && !t.mastered;
    });

    // Build session: needs_practice first, then normal, then some mastered
    let session = [];
    const shuffled = arr => [...arr].sort(() => Math.random() - 0.5);
    session = session.concat(shuffled(needsPractice));
    session = session.concat(shuffled(normal));
    session = session.concat(shuffled(mastered));
    return session.slice(0, count);
  },

  /** Record that a word was seen */
  recordSeen(word) {
    this._initTracking();
    if (this._trackingData[word]) {
      this._trackingData[word].times_seen++;
      this._saveTracking();
    }
  },

  /** Record correct answer */
  recordCorrect(word) {
    this._initTracking();
    if (this._trackingData[word]) {
      this._trackingData[word].times_correct++;
      this._saveTracking();
    }
  },

  /** Mark a word as mastered */
  markMastered(word) {
    this._initTracking();
    if (this._trackingData[word]) {
      this._trackingData[word].mastered = true;
      this._trackingData[word].needs_practice = false;
      this._saveTracking();
    }
  },

  /** Mark a word as needing practice */
  markNeedsPractice(word) {
    this._initTracking();
    if (this._trackingData[word]) {
      this._trackingData[word].needs_practice = true;
      this._trackingData[word].mastered = false;
      this._saveTracking();
    }
  },

  /** Get statistics */
  getStats() {
    this._initTracking();
    const total = this.words.length;
    let masteredCount = 0;
    let needsPracticeCount = 0;
    let totalSeen = 0;
    let totalCorrect = 0;
    const mostPracticed = [];
    const needsWork = [];

    this.words.forEach(w => {
      const t = this._trackingData[w.word];
      if (!t) return;
      if (t.mastered) masteredCount++;
      if (t.needs_practice) needsPracticeCount++;
      totalSeen += t.times_seen;
      totalCorrect += t.times_correct;
      if (t.times_seen > 0) mostPracticed.push({ word: w.word, times: t.times_seen });
      if (t.needs_practice) needsWork.push(w.word);
    });

    mostPracticed.sort((a, b) => b.times - a.times);

    return {
      total,
      mastered: masteredCount,
      needsPractice: needsPracticeCount,
      totalSeen,
      totalCorrect,
      accuracy: totalSeen > 0 ? Math.round((totalCorrect / totalSeen) * 100) : 0,
      mostPracticed: mostPracticed.slice(0, 5),
      needsWork: needsWork.slice(0, 5)
    };
  },

  /** Reset all tracking data */
  resetTracking() {
    this._trackingData = null;
    localStorage.removeItem('calis-word-tracking');
    this._initTracking();
  }
};

window.WordLibrary = WordLibrary;
