/**
 * GamepadManager - Xbox controller + keyboard handler
 * Polls gamepad at 60fps, manages focus navigation, button events
 */
const GamepadManager = {
  _listeners: {},
  _prevButtons: {},
  _holdTimers: {},
  _focusGroups: [],
  _currentGroupIdx: 0,
  _currentFocusIdx: 0,
  _active: false,
  _holdThreshold: 2000, // 2 seconds for hold actions
  _repeatDelay: 250,
  _lastDpad: 0,

  /** Start polling for gamepad input */
  init() {
    if (this._active) return;
    this._active = true;
    this._setupKeyboard();
    this._suppressBrowserGamepad();
    this._poll();
  },

  /** Stop polling */
  destroy() {
    this._active = false;
  },

  /** Register a focus group - array of DOM elements navigable with dpad */
  registerFocusGroup(elements, options) {
    const group = {
      elements: Array.from(elements),
      wrap: (options && options.wrap) !== false,
      columns: (options && options.columns) || 0, // 0 = horizontal only
      id: (options && options.id) || 'group_' + this._focusGroups.length
    };
    this._focusGroups.push(group);
    if (this._focusGroups.length === 1) {
      this._currentGroupIdx = 0;
      this._currentFocusIdx = 0;
      this._updateFocus();
    }
    return group.id;
  },

  /** Clear all focus groups */
  clearFocusGroups() {
    document.querySelectorAll('.gp-focused').forEach(el => el.classList.remove('gp-focused'));
    this._focusGroups = [];
    this._currentGroupIdx = 0;
    this._currentFocusIdx = 0;
  },

  /** Set active focus group by id */
  setActiveGroup(id) {
    const idx = this._focusGroups.findIndex(g => g.id === id);
    if (idx >= 0) {
      this._currentGroupIdx = idx;
      this._currentFocusIdx = 0;
      this._updateFocus();
    }
  },

  /** Set focus to a specific element */
  setFocus(element) {
    for (let gi = 0; gi < this._focusGroups.length; gi++) {
      const idx = this._focusGroups[gi].elements.indexOf(element);
      if (idx >= 0) {
        this._currentGroupIdx = gi;
        this._currentFocusIdx = idx;
        this._updateFocus();
        return;
      }
    }
  },

  /** Get currently focused element */
  getFocused() {
    const group = this._focusGroups[this._currentGroupIdx];
    if (!group) return null;
    return group.elements[this._currentFocusIdx] || null;
  },

  /** Register event listener */
  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
  },

  /** Remove event listener */
  off(event, callback) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
  },

  /** Emit event */
  _emit(event, data) {
    if (!this._listeners[event]) return;
    this._listeners[event].forEach(cb => cb(data));
  },

  /** Update visual focus indicator */
  _updateFocus() {
    document.querySelectorAll('.gp-focused').forEach(el => el.classList.remove('gp-focused'));
    const el = this.getFocused();
    if (el) {
      el.classList.add('gp-focused');
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  },

  /** Navigate focus */
  _navigate(direction) {
    const group = this._focusGroups[this._currentGroupIdx];
    if (!group || group.elements.length === 0) return;

    const cols = group.columns || group.elements.length;
    let idx = this._currentFocusIdx;

    // Filter out hidden/disabled elements
    const validIndices = group.elements.map((el, i) => {
      if (el.style.display === 'none' || el.disabled || el.classList.contains('hidden')) return -1;
      return i;
    }).filter(i => i >= 0);

    if (validIndices.length === 0) return;
    const currentValidIdx = validIndices.indexOf(idx);

    switch (direction) {
      case 'right':
        if (currentValidIdx < validIndices.length - 1) {
          idx = validIndices[currentValidIdx + 1];
        } else if (group.wrap) {
          idx = validIndices[0];
        }
        break;
      case 'left':
        if (currentValidIdx > 0) {
          idx = validIndices[currentValidIdx - 1];
        } else if (group.wrap) {
          idx = validIndices[validIndices.length - 1];
        }
        break;
      case 'down':
        if (cols > 0) {
          const nextIdx = currentValidIdx + cols;
          if (nextIdx < validIndices.length) {
            idx = validIndices[nextIdx];
          } else if (group.wrap) {
            idx = validIndices[currentValidIdx % cols] || validIndices[0];
          }
        }
        // Also try switching to next focus group
        if (idx === this._currentFocusIdx && this._focusGroups.length > 1) {
          const nextGroup = (this._currentGroupIdx + 1) % this._focusGroups.length;
          if (nextGroup !== this._currentGroupIdx) {
            this._currentGroupIdx = nextGroup;
            this._currentFocusIdx = 0;
            this._updateFocus();
            return;
          }
        }
        break;
      case 'up':
        if (cols > 0) {
          const prevIdx = currentValidIdx - cols;
          if (prevIdx >= 0) {
            idx = validIndices[prevIdx];
          } else if (group.wrap) {
            const lastRow = validIndices.length - cols + (currentValidIdx % cols);
            idx = validIndices[Math.min(lastRow, validIndices.length - 1)];
          }
        }
        // Try switching to previous focus group
        if (idx === this._currentFocusIdx && this._focusGroups.length > 1) {
          const prevGroup = (this._currentGroupIdx - 1 + this._focusGroups.length) % this._focusGroups.length;
          if (prevGroup !== this._currentGroupIdx) {
            this._currentGroupIdx = prevGroup;
            const pg = this._focusGroups[prevGroup];
            this._currentFocusIdx = pg.elements.length - 1;
            this._updateFocus();
            return;
          }
        }
        break;
    }

    this._currentFocusIdx = idx;
    this._updateFocus();
  },

  /** Update button guide display */
  updateButtonGuide(actions) {
    const guide = document.getElementById('button-guide');
    if (!guide) return;
    let html = '';
    if (actions.a) html += `<span class="guide-btn"><span class="xbox-a">A</span> ${actions.a}</span>`;
    if (actions.b) html += `<span class="guide-btn"><span class="xbox-b">B</span> ${actions.b}</span>`;
    if (actions.x) html += `<span class="guide-btn"><span class="xbox-x">X</span> ${actions.x}</span>`;
    if (actions.y) html += `<span class="guide-btn"><span class="xbox-y">Y</span> ${actions.y}</span>`;
    guide.innerHTML = html;
  },

  /** Suppress Xbox browser's native gamepad-to-mouse behavior */
  _suppressBrowserGamepad() {
    // Xbox Edge maps A button to context menu / long-press — block it
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Xbox Edge fires pointer/click events from A button — block these
    // when a gamepad is connected so our Gamepad API poll handler takes over
    const blockIfGamepad = (e) => {
      if (e.pointerType === 'gamepad' || e.pointerType === '') {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener('pointerdown', blockIfGamepad, true);
    document.addEventListener('pointerup', blockIfGamepad, true);
  },

  /** Setup keyboard fallback */
  _setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      // Don't intercept letter keys when an input/select/textarea is focused
      const tag = document.activeElement && document.activeElement.tagName;
      const inInput = tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';

      switch (e.key) {
        case 'ArrowRight': this._navigate('right'); this._emit('dpad_right'); e.preventDefault(); break;
        case 'ArrowLeft': this._navigate('left'); this._emit('dpad_left'); e.preventDefault(); break;
        case 'ArrowDown': this._navigate('down'); this._emit('dpad_down'); e.preventDefault(); break;
        case 'ArrowUp': this._navigate('up'); this._emit('dpad_up'); e.preventDefault(); break;
        case 'Enter':
          this._emit('a_press', this.getFocused());
          if (this.getFocused()) this.getFocused().click();
          e.preventDefault();
          break;
        case 'Escape':
          this._emit('b_press'); e.preventDefault(); break;
        case 'b':
        case 'B':
          if (!inInput) { this._emit('b_press'); e.preventDefault(); }
          break;
        case ' ':
          this._emit('x_press');
          e.preventDefault();
          break;
        case 'x':
        case 'X':
          if (!inInput) { this._emit('x_press'); e.preventDefault(); }
          break;
        case 'Tab':
          this._emit('y_press');
          e.preventDefault();
          break;
        case 'a':
        case 'A':
          if (!inInput) {
            this._emit('a_press', this.getFocused());
            if (this.getFocused()) this.getFocused().click();
            e.preventDefault();
          }
          break;
        case 's':
        case 'S':
          if (!inInput) { this._emit('parent_settings'); e.preventDefault(); }
          break;
        case 'q':
        case 'Q':
          if (!inInput) { this._emit('exit_game'); e.preventDefault(); }
          break;
        case 'n':
        case 'N':
          if (!inInput) { this._emit('skip_question'); e.preventDefault(); }
          break;
      }
    });
  },

  /** Main polling loop */
  _poll() {
    if (!this._active) return;

    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[0];

    if (gp) {
      const now = Date.now();
      const buttons = gp.buttons;

      // Button mapping
      const mapping = {
        0: 'a', 1: 'b', 2: 'x', 3: 'y',
        4: 'lb', 5: 'rb', 9: 'start',
        12: 'dpad_up', 13: 'dpad_down', 14: 'dpad_left', 15: 'dpad_right'
      };

      for (const [idx, name] of Object.entries(mapping)) {
        const btn = buttons[idx];
        if (!btn) continue;
        const pressed = btn.pressed || btn.value > 0.5;
        const wasPressed = this._prevButtons[idx] || false;

        if (pressed && !wasPressed) {
          // Just pressed
          this._holdTimers[idx] = now;

          switch (name) {
            case 'a':
              this._emit('a_press', this.getFocused());
              if (this.getFocused()) this.getFocused().click();
              break;
            case 'b': this._emit('b_press'); break;
            case 'x': this._emit('x_press'); break;
            case 'y': this._emit('y_press'); break;
            case 'start': this._emit('start_press'); break;
            case 'dpad_up': this._navigate('up'); this._emit('dpad_up'); break;
            case 'dpad_down': this._navigate('down'); this._emit('dpad_down'); break;
            case 'dpad_left': this._navigate('left'); this._emit('dpad_left'); break;
            case 'dpad_right': this._navigate('right'); this._emit('dpad_right'); break;
          }
        }

        // Hold detection for Y (mastered) and X (needs practice)
        if (pressed && this._holdTimers[idx]) {
          const held = now - this._holdTimers[idx];
          if (held >= this._holdThreshold) {
            if (name === 'y') {
              this._emit('y_hold');
              this._holdTimers[idx] = 0; // Reset so it doesn't fire again
            } else if (name === 'x') {
              this._emit('x_hold');
              this._holdTimers[idx] = 0;
            }
          }
        }

        // D-pad repeat for held dpad
        if (pressed && wasPressed && ['dpad_up', 'dpad_down', 'dpad_left', 'dpad_right'].includes(name)) {
          if (now - (this._lastDpad || 0) > this._repeatDelay) {
            this._lastDpad = now;
            const dir = name.replace('dpad_', '');
            this._navigate(dir);
          }
        }

        if (!pressed) {
          this._holdTimers[idx] = 0;
        }

        this._prevButtons[idx] = pressed;
      }

      // LB + RB held together = parent settings
      if (buttons[4] && buttons[5] && buttons[4].pressed && buttons[5].pressed) {
        if (!this._parentSettingsTriggered) {
          this._parentSettingsTriggered = true;
          this._emit('parent_settings');
        }
      } else {
        this._parentSettingsTriggered = false;
      }
    }

    requestAnimationFrame(() => this._poll());
  }
};

window.GamepadManager = GamepadManager;
