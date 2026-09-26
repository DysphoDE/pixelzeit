/* PIXELZEIT – Hilfsfunktionen (Zahlen, Zeit, Zufall, Events) */
(function () {
  'use strict';
  const PZ = (window.PZ = window.PZ || {});

  // Deutsche lange Skala
  const SHORT = ['', 'Tsd.', 'Mio.', 'Mrd.', 'Bio.', 'Brd.', 'Trio.', 'Trd.', 'Quadr.', 'Quadrd.', 'Quint.', 'Quintd.',
    'Sext.', 'Sextd.', 'Sept.', 'Septd.', 'Okt.', 'Oktd.', 'Non.', 'Nond.', 'Dez.', 'Dezd.'];
  const LONG = ['', 'Tausend', 'Millionen', 'Milliarden', 'Billionen', 'Billiarden', 'Trillionen', 'Trilliarden',
    'Quadrillionen', 'Quadrilliarden', 'Quintillionen', 'Quintilliarden', 'Sextillionen', 'Sextilliarden',
    'Septillionen', 'Septilliarden', 'Oktillionen', 'Oktilliarden', 'Nonillionen', 'Nonilliarden', 'Dezillionen', 'Dezilliarden'];

  const U = (PZ.U = {});
  U.numFormat = 'short'; // 'short' | 'long' | 'sci'

  function groupDE(intStr) {
    return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function fixedDE(n, d) {
    return n.toFixed(d).replace('.', ',');
  }

  /** Formatiert eine Zahl deutsch. dec = Nachkommastellen für kleine Werte. */
  U.fmt = function (n, dec) {
    if (n === Infinity) return '∞';
    if (n !== n) return '0';
    if (n < 0) return '-' + U.fmt(-n, dec);
    dec = dec || 0;
    if (n < 1000) {
      if (dec > 0 && n < 100 && n % 1 !== 0) {
        return fixedDE(Math.floor(n * Math.pow(10, dec)) / Math.pow(10, dec), dec).replace(/,?0+$/, '');
      }
      return String(Math.floor(n));
    }
    if (n < 1e6 && U.numFormat !== 'sci') return groupDE(String(Math.floor(n)));
    const e = Math.floor(Math.log10(n));
    if (U.numFormat === 'sci' || e >= SHORT.length * 3) {
      const m = n / Math.pow(10, e);
      return fixedDE(Math.floor(m * 100) / 100, 2) + 'e' + e;
    }
    const tier = Math.floor(e / 3);
    const v = n / Math.pow(10, tier * 3);
    const digits = v >= 100 ? 1 : v >= 10 ? 2 : 3;
    let txt = fixedDE(Math.floor(v * Math.pow(10, digits)) / Math.pow(10, digits), digits);
    if (/,0+$/.test(txt)) txt = txt.replace(/,0+$/, '');
    return txt + ' ' + (U.numFormat === 'long' ? LONG[tier] : SHORT[tier]);
  };

  /** Kurzform für enge Stellen (z. B. 1,2 Mio.) */
  U.fmtShort = function (n) {
    if (n < 1e4) return U.fmt(n);
    const saved = U.numFormat;
    if (saved === 'long') U.numFormat = 'short';
    const e = Math.floor(Math.log10(n));
    let r;
    if (U.numFormat === 'sci' || e >= SHORT.length * 3) r = U.fmt(n);
    else if (n < 1e6) r = fixedDE(Math.floor(n / 100) / 10, 1) + ' Tsd.';
    else {
      const tier = Math.floor(e / 3);
      const v = n / Math.pow(10, tier * 3);
      r = fixedDE(Math.floor(v * 10) / 10, 1).replace(',0', '') + ' ' + SHORT[tier];
    }
    U.numFormat = saved;
    return r;
  };

  U.pct = function (x, d) {
    return fixedDE(x * 100, d === undefined ? 0 : d).replace(/,0+$/, '') + ' %';
  };

  U.time = function (sec) {
    sec = Math.max(0, Math.floor(sec));
    if (sec < 60) return sec + ' s';
    const m = Math.floor(sec / 60), s = sec % 60;
    if (sec < 3600) return m + ' min ' + (s ? s + ' s' : '');
    const h = Math.floor(sec / 3600), mm = Math.floor((sec % 3600) / 60);
    if (sec < 86400) return h + ' h ' + (mm ? mm + ' min' : '');
    const d = Math.floor(sec / 86400), hh = Math.floor((sec % 86400) / 3600);
    return d + ' T ' + (hh ? hh + ' h' : '');
  };

  U.clock = function (sec) {
    sec = Math.max(0, Math.ceil(sec));
    const m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  };

  U.roman = function (n) {
    const map = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    let r = '';
    for (const [v, s] of map) while (n >= v) { r += s; n -= v; }
    return r;
  };

  U.clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  U.lerp = (a, b, t) => a + (b - a) * t;
  U.rand = (a, b) => a + Math.random() * (b - a);
  U.randInt = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
  U.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  U.weighted = function (items, weightFn) {
    let total = 0;
    for (const it of items) total += weightFn(it);
    let r = Math.random() * total;
    for (const it of items) { r -= weightFn(it); if (r <= 0) return it; }
    return items[items.length - 1];
  };
  U.shuffle = function (a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  // Mini-Event-Bus
  const listeners = {};
  PZ.on = function (ev, fn) { (listeners[ev] = listeners[ev] || []).push(fn); };
  PZ.emit = function (ev, a, b, c) { const l = listeners[ev]; if (l) for (const fn of l) { try { fn(a, b, c); } catch (e) { console.error(ev, e); } } };

  // Sichere Speicherzugriffe
  U.lsGet = function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } };
  U.lsSet = function (k, v) { try { window.localStorage.setItem(k, v); return true; } catch (e) { return false; } };
  U.lsDel = function (k) { try { window.localStorage.removeItem(k); } catch (e) { /* ignore */ } };

  // Base64 (UTF-8 sicher)
  U.b64enc = function (str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  };
  U.b64dec = function (b64) {
    const bin = atob(b64.trim());
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  };

  U.esc = function (s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  };
})();
