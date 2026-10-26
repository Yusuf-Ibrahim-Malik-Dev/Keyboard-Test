(function () {
  "use strict";

  /* ============ KONFIGURASI TOMBOL ============ */
  const K = (code, label, extra) => Object.assign({ code, label }, extra || {});
  const SKIP = new Set(['PrintScreen', 'ScrollLock', 'Pause', 'MetaLeft', 'MetaRight', 'ContextMenu']);

  const BLOCKS = [
    { rows: [
      { zone: 'fn', keys: [
        K('Escape', 'Esc', { zone: 'main' }),
        K('F1','F1'), K('F2','F2'), K('F3','F3'), K('F4','F4'), K('F5','F5'), K('F6','F6'),
        K('F7','F7'), K('F8','F8'), K('F9','F9'), K('F10','F10'), K('F11','F11'), K('F12','F12'),
        K('PrintScreen','PrtSc',{ cls:'small' }), K('ScrollLock','ScrLk',{ cls:'small' }), K('Pause','Pause',{ cls:'small' })
      ]},
      { zone: 'main', keys: [
        K('Backquote','`'), K('Digit1','1'), K('Digit2','2'), K('Digit3','3'), K('Digit4','4'),
        K('Digit5','5'), K('Digit6','6'), K('Digit7','7'), K('Digit8','8'), K('Digit9','9'),
        K('Digit0','0'), K('Minus','-'), K('Equal','='), K('Backspace','Backspace',{ w:2 })
      ]},
      { zone: 'main', keys: [
        K('Tab','Tab',{ w:15 }), K('KeyQ','Q'), K('KeyW','W'), K('KeyE','E'), K('KeyR','R'),
        K('KeyT','T'), K('KeyY','Y'), K('KeyU','U'), K('KeyI','I'), K('KeyO','O'), K('KeyP','P'),
        K('BracketLeft','['), K('BracketRight',']'), K('Backslash','\\',{ w:15 })
      ]},
      { zone: 'main', keys: [
        K('CapsLock','Caps',{ w:18 }), K('KeyA','A'), K('KeyS','S'), K('KeyD','D'), K('KeyF','F'),
        K('KeyG','G'), K('KeyH','H'), K('KeyJ','J'), K('KeyK','K'), K('KeyL','L'),
        K('Semicolon',';'), K('Quote',"'"), K('Enter','Enter',{ w:25 })
      ]},
      { zone: 'main', keys: [
        K('ShiftLeft','Shift',{ w:25 }), K('IntlBackslash','\\',{ optional:true }),
        K('KeyZ','Z'), K('KeyX','X'), K('KeyC','C'), K('KeyV','V'), K('KeyB','B'),
        K('KeyN','N'), K('KeyM','M'), K('Comma',','), K('Period','.'), K('Slash','/'),
        K('ShiftRight','Shift',{ w:25 })
      ]},
      { zone: 'main', keys: [
        K('ControlLeft','Ctrl',{ w:18 }), K('MetaLeft','Win',{ w:15 }), K('AltLeft','Alt',{ w:15 }),
        K('Space','Space',{ w:6 }), K('AltRight','Alt',{ w:15 }), K('MetaRight','Win',{ w:15 }),
        K('ContextMenu','Menu',{ w:15 }), K('ControlRight','Ctrl',{ w:18 })
      ]}
    ]},
    { rows: [
      { zone:'nav', keys:[ K('Insert','Ins'), K('Home','Home'), K('PageUp','PgUp') ] },
      { zone:'nav', keys:[ K('Delete','Del'), K('End','End'), K('PageDown','PgDn') ] },
      { zone:'nav', keys:[ null ] },
      { zone:'nav', keys:[ null, K('ArrowUp','▲'), null ] },
      { zone:'nav', keys:[ K('ArrowLeft','◀'), K('ArrowDown','▼'), K('ArrowRight','▶') ] }
    ]},
    { rows: [
      { zone:'numpad', cls:'np-grid', keys:[
        K('NumLock','Num',{ col:1,row:1 }), K('NumpadDivide','/',{ col:2,row:1 }),
        K('NumpadMultiply','*',{ col:3,row:1 }), K('NumpadSubtract','-',{ col:4,row:1 }),
        K('Numpad7','7',{ col:1,row:2 }), K('Numpad8','8',{ col:2,row:2 }), K('Numpad9','9',{ col:3,row:2 }),
        K('NumpadAdd','+',{ col:4,row:2, rs:2 }),
        K('Numpad4','4',{ col:1,row:3 }), K('Numpad5','5',{ col:2,row:3 }), K('Numpad6','6',{ col:3,row:3 }),
        K('Numpad1','1',{ col:1,row:4 }), K('Numpad2','2',{ col:2,row:4 }), K('Numpad3','3',{ col:3,row:4 }),
        K('NumpadEnter','Enter',{ col:4,row:4, rs:2 }),
        K('Numpad0','0',{ col:1,row:5, cs:2 }), K('NumpadDecimal','.',{ col:3,row:5 })
      ]}
    ]}
  ];

  const LAYOUT_ZONES = {
    full: ['fn','main','nav','numpad'],
    tkl:  ['fn','main','nav'],
    '75': ['fn','main'],
    '60': ['main']
  };

  const TYPE_TEXT = "Tes mengetik cepat: kecepatan jari adalah kunci produktivitas. Latih ritme yang stabil, jangan mengejar kecepatan sebelum akurasi tercapai.";

  /* ============ STATE ============ */
  const LS = 'kbTestUltimateV1';
  const state = {
    pressed: new Set(),
    counts: {},
    layout: 'full',
    iso: false,
    sound: true,
    heat: false,
    theme: 'dark',
    maxRollover: 0,
    events: 0
  };
  const keyMap = {}, codeLabel = {};
  const pressedNow = new Set();
  let activeTab = 'keys';
  let celebrated = false;
  let allowCelebrate = false;
  let startTs = null, timerId = null, finished = false;
  let typeStart = null;

  /* ============ UTIL ============ */
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const fmtTime = ms => {
    const s = Math.floor(ms / 1000), m = Math.floor(s / 60);
    return m + ':' + String(s % 60).padStart(2, '0');
  };

  let toastTimer = null;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  let ac = null;
  function beep(freq, dur) {
    if (!state.sound) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'square';
      o.frequency.value = freq || 560;
      g.gain.setValueAtTime(0.045, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + (dur || 0.035));
      o.connect(g); g.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + (dur || 0.035));
    } catch (e) { /* audio tidak tersedia */ }
  }

  function save() {
    try {
      localStorage.setItem(LS, JSON.stringify({
        pressed: Array.from(state.pressed), counts: state.counts,
        layout: state.layout, iso: state.iso, sound: state.sound,
        heat: state.heat, theme: state.theme,
        maxRollover: state.maxRollover, events: state.events
      }));
    } catch (e) {}
  }

  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(LS) || '{}');
      if (Array.isArray(d.pressed)) state.pressed = new Set(d.pressed);
      if (d.counts && typeof d.counts === 'object') state.counts = d.counts;
      if (LAYOUT_ZONES[d.layout]) state.layout = d.layout;
      state.iso = !!d.iso;
      state.sound = d.sound !== false;
      state.heat = !!d.heat;
      state.theme = d.theme === 'light' ? 'light' : 'dark';
      state.maxRollover = d.maxRollover | 0;
      state.events = d.events | 0;
    } catch (e) {}
  }

  /* ============ RENDER KEYBOARD ============ */
  function makeKey(spec, rowZone) {
    const el = document.createElement('div');
    el.className = 'key';
    if (spec.cls) el.classList.add(spec.cls);
    if (spec.w) el.classList.add('w' + spec.w);
    el.dataset.code = spec.code;
    el.dataset.zone = spec.zone || rowZone;
    el.textContent = spec.label;
    el.title = spec.code;
    if (spec.optional) el.dataset.optional = '1';
    if (spec.col) {
      el.style.gridColumn = spec.col + ' / span ' + (spec.cs || 1);
      el.style.gridRow = spec.row + ' / span ' + (spec.rs || 1);
    }
    keyMap[spec.code] = el;
    codeLabel[spec.code] = spec.label;

    el.addEventListener('contextmenu', ev => {
      ev.preventDefault();
      ev.stopPropagation();
      state.pressed.delete(spec.code);
      delete state.counts[spec.code];
      el.classList.remove('done', 'hit', 'untested');
      refresh(); paintHeat(); save();
      toast('Status "' + spec.label + '" dihapus');
    });
    return el;
  }

  function spacer() {
    const s = document.createElement('div');
    s.className = 'key spacer';
    return s;
  }

  function render() {
    const kbd = $('kbd');
    BLOCKS.forEach(block => {
      const cluster = document.createElement('div');
      cluster.className = 'cluster';
      block.rows.forEach(rowDef => {
        const row = document.createElement('div');
        row.className = rowDef.cls || 'row';
        rowDef.keys.forEach(spec => {
          row.appendChild(spec ? makeKey(spec, rowDef.zone) : spacer());
        });
        cluster.appendChild(row);
      });
      kbd.appendChild(cluster);
    });
  }

  /* ============ LAYOUT / VISIBILITY ============ */
  function applyLayout() {
    const zones = new Set(LAYOUT_ZONES[state.layout] || LAYOUT_ZONES.full);
    document.querySelectorAll('.key[data-code]').forEach(el => {
      let show = zones.has(el.dataset.zone);
      if (el.dataset.optional === '1') show = show && state.iso;
      el.style.display = show ? '' : 'none';
    });
    document.querySelectorAll('.row').forEach(row => {
      if (row.classList.contains('np-grid')) return;
      const any = Array.from(row.querySelectorAll('.key[data-code]')).some(k => k.style.display !== 'none');
      row.style.display = any ? '' : 'none';
    });
    document.querySelectorAll('.cluster').forEach(cl => {
      const any = Array.from(cl.querySelectorAll('.key[data-code]')).some(k => k.style.display !== 'none');
      cl.style.display = any ? '' : 'none';
    });
    celebrated = false;
    allowCelebrate = false;
    paintHeat();
    refresh();
    updateGhost();
  }

  function visibleTestable() {
    const out = [];
    document.querySelectorAll('.key[data-code]').forEach(el => {
      if (el.style.display === 'none') return;
      const code = el.dataset.code;
      if (SKIP.has(code)) return;
      out.push(code);
    });
    return out;
  }

  function missingList() {
    return visibleTestable().filter(c => !state.pressed.has(c));
  }

  /* ============ STATISTIK ============ */
  function refresh() {
    const testable = visibleTestable();
    const done = testable.filter(c => state.pressed.has(c));
    const total = testable.length;
    const pct = total ? Math.round(done.length / total * 100) : 0;

    $('sDone').textContent = done.length + '/' + total;
    $('sPct').textContent = pct + '%';
    $('sMiss').textContent = total - done.length;
    $('bar').style.width = pct + '%';

    let presses = 0;
    testable.forEach(c => { presses += state.counts[c] || 0; });
    $('sPress').textContent = presses;
    $('sRoll').textContent = state.maxRollover;

    if (total > 0 && done.length === total && !celebrated && allowCelebrate) {
      celebrated = true;
      allowCelebrate = false;
      finish();
      confetti();
      toast('Sempurna! Semua ' + total + ' tombol terdeteksi 🎉');
      log('<b>SELESAI:</b> semua ' + total + ' tombol terdeteksi dalam ' + fmtTime(elapsedMs()) + '.', 'ok');
    }
  }

  function elapsedMs() {
    if (startTs) return Date.now() - startTs;
    return 0;
  }

  function startTimer() {
    if (startTs || finished) return;
    startTs = Date.now();
    timerId = setInterval(() => {
      $('sTime').textContent = fmtTime(elapsedMs());
    }, 250);
  }

  function finish() {
    if (timerId) clearInterval(timerId);
    timerId = null;
    finished = true;
    if (startTs) $('sTime').textContent = fmtTime(elapsedMs());
  }

  function resetTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null; startTs = null; finished = false;
    $('sTime').textContent = '0:00';
  }

  /* ============ LOG & LIVE ============ */
  function log(html, cls) {
    const l = $('log');
    const d = document.createElement('div');
    if (cls) d.className = cls;
    d.innerHTML = html;
    l.prepend(d);
    while (l.children.length > 100) l.lastChild.remove();
  }

  function paintHeat() {
    const testable = visibleTestable();
    let max = 1;
    testable.forEach(c => { max = Math.max(max, state.counts[c] || 0); });

    document.querySelectorAll('.key[data-code]').forEach(el => {
      el.style.background = '';
      if (!state.heat) return;
      const c = state.counts[el.dataset.code] || 0;
      if (!c) return;
      const t = c / max;
      el.style.background = 'rgba(46,160,67,' + (0.16 + 0.74 * t).toFixed(3) + ')';
    });
  }

  function locationName(loc) {
    return ['Standar', 'Kiri', 'Kanan', 'Numpad'][loc] || ('Lokasi ' + loc);
  }

  function mods(e) {
    const m = [];
    if (e.ctrlKey) m.push('Ctrl');
    if (e.altKey) m.push('Alt');
    if (e.shiftKey) m.push('Shift');
    if (e.metaKey) m.push('Meta');
    return m.length ? m.join('+') : '—';
  }

  function keyLabel(e) {
    if (e.key === ' ') return 'Space';
    if (e.key === 'Dead') return 'Dead key';
    return e.key;
  }

  /* ============ GHOSTING ============ */
  function updateGhost() {
    $('gNow').textContent = pressedNow.size;
    $('gMax').textContent = state.maxRollover;
    $('gEvents').textContent = state.events;
    const chips = $('gChips');
    if (!pressedNow.size) {
      chips.innerHTML = '<span style="color:var(--dim);font-size:13px">Tahan beberapa tombol sekaligus…</span>';
      return;
    }
    chips.innerHTML = Array.from(pressedNow)
      .map(c => '<span class="chip">' + esc(codeLabel[c] || c) + '</span>')
      .join('');
  }

  /* ============ CONFETTI ============ */
  function confetti() {
    const cv = $('confetti');
    const ctx = cv.getContext('2d');
    cv.width = innerWidth; cv.height = innerHeight;
    cv.style.display = 'block';
    const colors = ['#57d36b', '#58a6ff', '#f0b429', '#f85149', '#d2a8ff', '#7ee787'];
    const parts = Array.from({ length: 160 }, () => ({
      x: Math.random() * cv.width,
      y: -20 - Math.random() * cv.height * 0.4,
      w: 5 + Math.random() * 7,
      h: 7 + Math.random() * 9,
      vy: 2.5 + Math.random() * 4.5,
      vx: -1.5 + Math.random() * 3,
      rot: Math.random() * Math.PI,
      vr: -0.15 + Math.random() * 0.3,
      color: colors[(Math.random() * colors.length) | 0]
    }));
    const t0 = performance.now();
    (function frame(now) {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (now - t0 < 3000) requestAnimationFrame(frame);
      else { ctx.clearRect(0, 0, cv.width, cv.height); cv.style.display = 'none'; }
    })(t0);
  }

  /* ============ TYPING TEST ============ */
  function renderPrompt(typed) {
    const box = $('typePrompt');
    box.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (let i = 0; i < TYPE_TEXT.length; i++) {
      const span = document.createElement('span');
      const ch = TYPE_TEXT[i];
      span.textContent = ch;
      if (i < typed.length) span.className = typed[i] === ch ? 'ok' : 'err';
      else if (i === typed.length) span.className = 'cur';
      frag.appendChild(span);
    }
    box.appendChild(frag);
  }

  function updateTyping() {
    const v = $('typeInput').value;
    renderPrompt(v);
    let correct = 0;
    for (let i = 0; i < v.length; i++) if (v[i] === TYPE_TEXT[i]) correct++;

    const mins = typeStart ? (Date.now() - typeStart) / 60000 : 0;
    const wpm = mins > 0.001 ? Math.round((correct / 5) / mins) : 0;
    const acc = v.length ? Math.round(correct / v.length * 100) : 100;
    const secs = typeStart ? Math.floor((Date.now() - typeStart) / 1000) : 0;

    $('tWpm').textContent = wpm;
    $('tAcc').textContent = acc + '%';
    $('tChar').textContent = v.length;
    $('tTime').textContent = secs + 's';

    if (v.length >= TYPE_TEXT.length && correct === TYPE_TEXT.length) {
      toast('Selesai! ' + wpm + ' WPM, akurasi ' + acc + '%');
    }
  }

  function resetTyping() {
    typeStart = null;
    $('typeInput').value = '';
    $('tWpm').textContent = '0';
    $('tAcc').textContent = '100%';
    $('tChar').textContent = '0';
    $('tTime').textContent = '0s';
    renderPrompt('');
    $('typeInput').focus();
  }

  /* ============ EVENT KEYBOARD ============ */
  addEventListener('keydown', function (e) {
    const tag = (e.target.tagName || '').toUpperCase();
    if (tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SELECT') return;

    const code = e.code;
    const el = keyMap[code];

    pressedNow.add(code);
    state.events++;
    if (pressedNow.size > state.maxRollover) state.maxRollover = pressedNow.size;
    updateGhost();

    if (!e.repeat) {
      state.pressed.add(code);
      state.counts[code] = (state.counts[code] || 0) + 1;
      startTimer();
      allowCelebrate = true;
      if (el) el.classList.add('done');
      log('<b>' + new Date().toLocaleTimeString() + '</b> &nbsp; key=<b>' + esc(keyLabel(e)) +
          '</b> &nbsp; code=<b>' + esc(code) + '</b> &nbsp; keyCode=<b>' + e.keyCode + '</b>' +
          ' &nbsp; lokasi=' + locationName(e.location));
      save();
    } else {
      state.counts[code] = (state.counts[code] || 0) + 1;
    }

    if (el) {
      el.classList.add('hit');
      paintHeat();
    }

    $('live').innerHTML = 'Terakhir: <b>' + esc(keyLabel(e)) + '</b> · code=<b>' + esc(code) +
      '</b> · keyCode=<b>' + e.keyCode + '</b> · lokasi=<b>' + locationName(e.location) +
      '</b> · modifier=<b>' + mods(e) + '</b>' + (e.repeat ? ' · <b style="color:var(--warn)">repeat</b>' : '');

    beep(code.indexOf('Shift') === 0 || code.indexOf('Control') === 0 || code.indexOf('Alt') === 0 ? 420 : 580);
    refresh();

    const combo = (e.ctrlKey || e.metaKey) && !/^(Control|Meta)/.test(code);
    if (!combo) e.preventDefault();
  }, true);

  addEventListener('keyup', function (e) {
    pressedNow.delete(e.code);
    const el = keyMap[e.code];
    if (el) el.classList.remove('hit');
    updateGhost();
  }, true);

  addEventListener('blur', function () {
    pressedNow.clear();
    updateGhost();
  });

  addEventListener('contextmenu', function (e) { e.preventDefault(); });

  /* ============ TABS ============ */
  document.querySelectorAll('.tabs button').forEach(btn => {
    btn.addEventListener('click', function () {
      activeTab = this.dataset.tab;
      document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      $('panel-' + activeTab).classList.add('active');
      if (activeTab === 'type') {
        renderPrompt($('typeInput').value);
        $('typeInput').focus();
      }
    });
  });

  /* ============ TOMBOL AKSI ============ */
  $('check').addEventListener('click', function () {
    const miss = missingList();
    document.querySelectorAll('.key.untested').forEach(k => k.classList.remove('untested'));
    miss.forEach(c => { if (keyMap[c]) keyMap[c].classList.add('untested'); });
    if (miss.length) {
      log('<b>CEK:</b> BELUM TERDETEKSI (' + miss.length + '): ' + esc(miss.join(', ')), 'warn');
      const first = keyMap[miss[0]];
      if (first && first.scrollIntoView) first.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      toast(miss.length + ' tombol belum terdeteksi');
    } else {
      log('<b>CEK:</b> Semua tombol sudah terdeteksi!', 'ok');
      toast('Semua tombol sudah terdeteksi');
    }
  });

  function resultText() {
    const testable = visibleTestable();
    const done = testable.filter(c => state.pressed.has(c));
    const miss = missingList();
    let presses = 0;
    testable.forEach(c => { presses += state.counts[c] || 0; });
    return [
      'KEYBOARD TEST ULTIMATE',
      'Waktu      : ' + new Date().toLocaleString(),
      'Layout     : ' + state.layout + (state.iso ? ' + ISO' : ''),
      'Durasi     : ' + fmtTime(elapsedMs()),
      'Rollover   : ' + state.maxRollover + ' tombol serentak',
      '',
      'TERDETEKSI (' + done.length + '/' + testable.length + '):',
      done.join(', ') || '(belum ada)',
      '',
      'BELUM TERDETEKSI (' + miss.length + '):',
      miss.join(', ') || '(tidak ada)',
      '',
      'TOTAL TEKAN: ' + presses
    ].join('\n');
  }

  $('copy').addEventListener('click', async function () {
    const txt = resultText();
    try {
      await navigator.clipboard.writeText(txt);
      log('<b>COPIED:</b> hasil disalin ke clipboard.', 'ok');
      toast('Hasil disalin ke clipboard');
    } catch (err) {
      const ta = document.createElement('textarea');
      ta.value = txt;
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e2) {}
      ta.remove();
      if (ok) { log('<b>COPIED:</b> hasil disalin (fallback).', 'ok'); toast('Hasil disalin'); }
      else { log('<b>COPY GAGAL:</b> ' + esc(err.message), 'warn'); toast('Gagal menyalin'); }
    }
    console.log(txt);
  });

  $('export').addEventListener('click', function () {
    const testable = visibleTestable();
    const data = {
      app: 'Keyboard Test Ultimate',
      version: 3,
      generatedAt: new Date().toISOString(),
      layout: state.layout,
      iso: state.iso,
      durationMs: elapsedMs(),
      maxRollover: state.maxRollover,
      totalPresses: testable.reduce((a, c) => a + (state.counts[c] || 0), 0),
      detected: testable.filter(c => state.pressed.has(c)),
      missing: missingList(),
      counts: state.counts
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyboard-test-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    log('<b>EXPORT:</b> file JSON diunduh.', 'ok');
    toast('JSON berhasil diekspor');
  });

  $('reset').addEventListener('click', function () {
    state.pressed.clear();
    state.counts = {};
    state.maxRollover = 0;
    state.events = 0;
    celebrated = false;
    allowCelebrate = false;
    document.querySelectorAll('.key').forEach(k => k.classList.remove('done', 'hit', 'untested'));
    document.querySelectorAll('.key[data-code]').forEach(k => { k.style.background = ''; });
    $('log').innerHTML = '';
    $('live').textContent = 'Menunggu input…';
    resetTimer();
    updateGhost();
    refresh();
    save();
    try { localStorage.removeItem(LS); } catch (e) {}
    toast('Tes direset');
    log('<b>RESET:</b> semua status dihapus.', 'warn');
  });

  /* ============ TOOLBAR ============ */
  const layoutSel = $('layoutSel');
  layoutSel.addEventListener('change', function () {
    state.layout = this.value;
    applyLayout();
    refresh();
    save();
    log('<b>LAYOUT:</b> ' + esc(this.options[this.selectedIndex].text), 'ok');
  });

  const isoChk = $('isoChk');
  isoChk.addEventListener('change', function () {
    state.iso = this.checked;
    applyLayout();
    refresh();
    save();
    toast('Layout ISO ' + (state.iso ? 'aktif' : 'nonaktif'));
  });

  const soundBtn = $('soundBtn');
  soundBtn.addEventListener('click', function () {
    state.sound = !state.sound;
    soundBtn.textContent = 'Suara: ' + (state.sound ? 'ON' : 'OFF');
    soundBtn.classList.toggle('on', state.sound);
    if (state.sound) beep(640);
    save();
  });

  const themeBtn = $('themeBtn');
  themeBtn.addEventListener('click', function () {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('light', state.theme === 'light');
    themeBtn.textContent = 'Tema: ' + (state.theme === 'light' ? 'Terang' : 'Gelap');
    save();
  });

  const heatBtn = $('heatBtn');
  heatBtn.addEventListener('click', function () {
    state.heat = !state.heat;
    heatBtn.textContent = 'Heatmap: ' + (state.heat ? 'ON' : 'OFF');
    heatBtn.classList.toggle('on', state.heat);
    paintHeat();
    save();
  });

  /* ============ TYPING EVENTS ============ */
  const typeInput = $('typeInput');
  typeInput.addEventListener('input', function () {
    if (!typeStart) typeStart = Date.now();
    updateTyping();
  });
  $('tReset').addEventListener('click', resetTyping);

  /* ============ OVERLAY ============ */
  function begin() {
    $('overlay').style.display = 'none';
    beep(720, 0.08);
    window.focus();
    if (activeTab === 'keys') log('<b>MULAI:</b> tekan semua tombol satu per satu.', 'ok');
  }
  $('startBtn').addEventListener('click', begin);
  $('skipBtn').addEventListener('click', function () { $('overlay').style.display = 'none'; });

  /* ============ FOCUS BAR ============ */
  const fb = $('focusbar');
  addEventListener('focus', function () {
    fb.textContent = 'FOKUS AKTIF — semua tombol akan terbaca';
    fb.classList.remove('blur');
  });
  addEventListener('blur', function () {
    fb.textContent = 'HALAMAN TIDAK FOKUS — KLIK DI SINI DULU';
    fb.classList.add('blur');
  });

  /* ============ INIT ============ */
  load();
  document.body.classList.toggle('light', state.theme === 'light');
  themeBtn.textContent = 'Tema: ' + (state.theme === 'light' ? 'Terang' : 'Gelap');
  soundBtn.textContent = 'Suara: ' + (state.sound ? 'ON' : 'OFF');
  soundBtn.classList.toggle('on', state.sound);
  heatBtn.textContent = 'Heatmap: ' + (state.heat ? 'ON' : 'OFF');
  heatBtn.classList.toggle('on', state.heat);
  layoutSel.value = state.layout;
  isoChk.checked = state.iso;

  render();
  renderPrompt('');
  state.pressed.forEach(c => { if (keyMap[c]) keyMap[c].classList.add('done'); });
  applyLayout();
  updateGhost();
  refresh();
  $('sRoll').textContent = state.maxRollover;
  window.focus();
})();
