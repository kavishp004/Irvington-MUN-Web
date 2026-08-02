/* ============================================================================
   IRVINGTON MODEL UNITED NATIONS
   main.js — shared shell behaviour. No dependencies, no build step.

     SITE_DATA  ← edit this; everything below it is machinery
     01. Header scroll state
     02. Mobile overlay menu
     03. Scroll reveal
     04. Footer year
     05. Stat counters
     06. Timeline progress
     07. Conference lists + year filter
     08. Officer grid
     09. Page transition

   The `has-js` class is added to <html> by an inline script in each page's
   <head> so reveal elements start hidden before first paint. If this file
   fails to load, nothing is ever hidden and the site degrades to plain HTML.
   ========================================================================= */


/* ============================================================================
   ██  EDIT HERE  ██
   Everything a club officer needs to change lives in this one object. Adding a
   conference means adding an entry to an array below — no HTML edits, no
   classes to remember.

   Anything not yet known is the string "TBD" (or null for a number), and the
   page renders that honestly rather than inventing a value.
   ========================================================================= */

var SITE_DATA = {

  /* ---- Home page: BY THE NUMBERS -------------------------------------
     value: a whole number, or null to display "TBD" and skip the count-up.
     suffix: optional, e.g. "+" — rendered in accent blue after the number.
     The numbers below are PLACEHOLDERS. Replace them with real figures. */
  stats: [
    { label: 'Delegates',             value: null, suffix: '+' },
    { label: 'Conferences Attended',  value: null, suffix: '' },
    { label: 'Awards Won',            value: null, suffix: '' },
    { label: 'Years Active',          value: null, suffix: '' }
  ],

  /* ---- Conferences page: UPCOMING ------------------------------------
     The 2026–27 schedule from the club spreadsheet. The spreadsheet rows were
     not in date order (SMUNC in November sat below IndeMUN in February), so
     these are sorted by date instead — a timeline that jumps backwards reads
     as a bug. Reorder freely; the page renders them top to bottom as listed.

     TWO THINGS TO CHECK: several rows carry years that look inconsistent for
     a 2026–27 season — IndeMUN (Feb 28, 2026), FHSMUN (April 17–18, 2026) and
     DavisMUN (May 2–3, 2026) are transcribed exactly as the sheet had them,
     but sit among January–March 2027 dates. And two cells were cut off in the
     screenshot: BearMUN's year and NHSMUN's spring-break date.

     status must be one of: 'registered' | 'open' | 'tbd'
       registered → "Registered"          (we are going)
       open       → "Applications Open"   (sign-ups running)
       tbd        → "TBD"                 (not confirmed)
     committees: an array of strings; use ["TBD"] if not yet assigned. */
  upcomingConferences: [
    { name: 'FREMUNC',     date: 'September 26',        location: 'Irvington High School', committees: ['TBD'], status: 'tbd' },
    { name: 'GunnMUN',     date: 'October 24, 2026',    location: 'TBD', committees: ['TBD'], status: 'tbd' },
    { name: 'SMUNC',       date: 'November 6–8, 2026',  location: 'TBD', committees: ['TBD'], status: 'tbd' },
    { name: 'BearMUN',     date: 'December 5–6, 2026',  location: 'TBD', committees: ['TBD'], status: 'tbd' },
    { name: 'NorCal MUN',  date: 'January 22–23, 2027', location: 'TBD', committees: ['TBD'], status: 'tbd' },
    { name: 'Harvard MUN', date: 'January 28–31, 2027', location: 'TBD', committees: ['TBD'], status: 'tbd' },
    { name: 'SCVMUN',      date: 'January 29–30, 2027', location: 'TBD', committees: ['TBD'], status: 'tbd' },
    { name: 'SFMUN',       date: 'February 21 (approx.)', location: 'TBD', committees: ['TBD'], status: 'tbd' },
    { name: 'IndeMUN',     date: 'February 28, 2026',   location: 'TBD', committees: ['TBD'], status: 'tbd' },
    { name: 'BMUN',        date: 'March 5–7, 2027',     location: 'TBD', committees: ['TBD'], status: 'tbd' },
    { name: 'NHSMUN',      date: 'Spring break — TBD',  location: 'TBD', committees: ['TBD'], status: 'tbd' },
    { name: 'FHSMUN',      date: 'April 17–18, 2026',   location: 'TBD', committees: ['TBD'], status: 'tbd' },
    { name: 'DavisMUN',    date: 'May 2–3, 2026',       location: 'TBD', committees: ['TBD'], status: 'tbd' },
    { name: 'MiniMUN',     date: 'TBD',                 location: 'Irvington High School', committees: ['TBD'], status: 'tbd' }
  ],

  /* ---- Conferences page: PAST ----------------------------------------
     Grouped by SEASON (school year), not calendar year — a MUN season runs
     autumn to spring, so a calendar year would split it in half. The filter
     chips are derived from these `season` values, and the whole filter bar
     hides itself while only one season exists.

     awards: ['TBD'] means not yet filled in; [] renders "No awards recorded"
     which is a positive claim that none were won — only use it when true.
     photo: a path under assets/, or null for the styled placeholder box.
     link / linkLabel: optional, renders a button on the card. */
  pastConferences: [
    {
      name: 'FREMUNC',
      season: '2025–26',
      awards: ['TBD'],
      photo: 'assets/fremunc-2025.jpg',
      photoAlt: 'The FREMUNC secretariat on stage at the close of the conference, ' +
                'holding bouquets in front of a "Thank you for attending FREMUNC" slide.',
      photoW: 2200, photoH: 1466,
      /* TODO: point this at the real FREMUNC site once it is published. While
         it reads TBD the button is suppressed rather than rendered dead. */
      link: 'TBD',
      linkLabel: 'Visit the FREMUNC site'
    },
    { name: 'Stanford MUN', season: '2025–26', awards: ['TBD'], photo: null, photoAlt: '' },
    {
      name: 'BearMUN',
      season: '2025–26',
      awards: ['Best Large Delegation'],
      photo: 'assets/team-bearmun.jpg?v=2',
      photoAlt: 'Irvington delegates at BearMUN 2025 with their award certificates.',
      photoW: 2200, photoH: 1650
    },
    { name: 'SCVMUN',     season: '2025–26', awards: ['TBD'], photo: null, photoAlt: '' },
    { name: 'IndeMUN',    season: '2025–26', awards: ['TBD'], photo: null, photoAlt: '' },
    { name: 'Titan MUNC', season: '2025–26', awards: ['TBD'], photo: null, photoAlt: '' },
    { name: 'BMUN',       season: '2025–26', awards: ['TBD'], photo: null, photoAlt: '' },
    { name: 'NHSMUN',     season: '2025–26', awards: ['TBD'], photo: null, photoAlt: '' }
  ],

  /* ---- Officers page --------------------------------------------------
     `officerGroups` sets both the order the sections appear in and their
     headings; `group` on each officer points at one of those keys. Adding a
     new group is two edits: a row here and the key on the people in it.
     photo: a path under assets/, or null for the initials tile.
     grade / bio are TBD until someone fills them in. */
  officerGroups: [
    { key: 'exec',       title: 'Executive Board' },
    { key: 'captains',   title: 'Committee Captains' },
    { key: 'conference', title: 'Conference Leadership' },
    { key: 'junior',     title: 'Junior Officers' },
    { key: 'middle',     title: 'Middle School MUN' }
  ],

  officers: [
    /* --- Executive Board --- */
    { group: 'exec', name: 'Sonia Puri',      role: 'President',      grade: 'TBD', bio: 'TBD', photo: null },
    { group: 'exec', name: 'Shriya Surana',   role: 'President',      grade: 'TBD', bio: 'TBD', photo: null },
    { group: 'exec', name: 'Utkarsh Sinha',   role: 'Vice President', grade: 'TBD', bio: 'TBD', photo: null },
    { group: 'exec', name: 'Nitya Misra',     role: 'Vice President', grade: 'TBD', bio: 'TBD', photo: null },

    /* --- Committee Captains ---
       NOTE: Utkarsh Sinha appears here as well as on the Executive Board,
       holding both Vice President and Captain of Crisis. If he should only
       be listed once, delete whichever entry is redundant. */
    { group: 'captains', name: 'Anantiga Ramesh', role: 'Captain, Travel Team',      grade: 'TBD', bio: 'TBD', photo: null },
    { group: 'captains', name: 'Shaan Sood',      role: 'Captain, General Assembly', grade: 'TBD', bio: 'TBD', photo: null },
    { group: 'captains', name: 'Naisha Vora',     role: 'Captain, General Assembly', grade: 'TBD', bio: 'TBD', photo: null },
    { group: 'captains', name: 'Utkarsh Sinha',   role: 'Captain, Crisis',           grade: 'TBD', bio: 'TBD', photo: null },

    /* --- Conference Leadership --- */
    { group: 'conference', name: 'Matthew Miu',   role: 'Director General, FREMUNC & MiniMUN', grade: 'TBD', bio: 'TBD', photo: null },
    { group: 'conference', name: 'Yumna Zainab',  role: 'Director General, FREMUNC & MiniMUN', grade: 'TBD', bio: 'TBD', photo: null },
    { group: 'conference', name: 'Kavish Poddar', role: 'Technical Projects Director',         grade: 'TBD', bio: 'TBD', photo: null },

    /* --- Junior Officers --- */
    { group: 'junior', name: 'Elina Mangla',      role: 'Junior Officer', grade: 'TBD', bio: 'TBD', photo: null },
    { group: 'junior', name: 'Sahil Markandeya',  role: 'Junior Officer', grade: 'TBD', bio: 'TBD', photo: null },
    { group: 'junior', name: 'Pradyun Adabala',   role: 'Junior Officer', grade: 'TBD', bio: 'TBD', photo: null },

    /* --- Middle School MUN --- */
    { group: 'middle', name: 'Kshitij Markandeya', role: 'Middle School MUN Leader', grade: 'TBD', bio: 'TBD', photo: null },
    { group: 'middle', name: 'Riya Vyas',          role: 'Middle School MUN Leader', grade: 'TBD', bio: 'TBD', photo: null }
  ]

};


(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');


  /* ==========================================================================
     01. HEADER SCROLL STATE
     Transparent over the hero; blurred dark bar past 80px.

     Implemented with a zero-height sentinel pinned to the top of the page
     rather than a scroll listener. The sentinel is exactly THRESHOLD tall, so
     "sentinel has left the viewport" is precisely "scrolled past 80px" — and
     it costs nothing during scroll, because the browser reports the crossing
     instead of us sampling position every frame.
     ====================================================================== */

  var HEADER_THRESHOLD = 80;

  function initHeader() {
    var header = document.getElementById('siteHeader');
    if (!header) return;

    function setState(scrolled) {
      header.classList.toggle('is-scrolled', scrolled);
    }

    if (!('IntersectionObserver' in window)) {
      initHeaderFallback(setState);
      return;
    }

    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    // No visibility:hidden here — an empty, transparent 1px box already
    // renders nothing, and hidden elements are easy to get wrong with IO.
    sentinel.style.cssText =
      'position:absolute;top:0;left:0;width:1px;height:' +
      HEADER_THRESHOLD + 'px;pointer-events:none;';
    document.body.insertBefore(sentinel, document.body.firstChild);

    new IntersectionObserver(function (entries) {
      setState(!entries[0].isIntersecting);
    }, { threshold: 0 }).observe(sentinel);
  }

  // Legacy path only. Throttled to one read per frame so it cannot thrash
  // layout on scroll.
  function initHeaderFallback(setState) {
    var ticking = false;

    function apply() {
      ticking = false;
      setState(window.pageYOffset > HEADER_THRESHOLD);
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(apply);
    }, { passive: true });

    apply();
  }


  /* ==========================================================================
     02. MOBILE OVERLAY MENU
     Full-screen dark panel. Handles: aria-expanded, body scroll lock, Escape
     to close, focus moved into the panel and restored on close, and a focus
     trap so Tab cannot reach the page behind it.
     ====================================================================== */

  function initMenu() {
    var toggle  = document.getElementById('navToggle');
    var overlay = document.getElementById('navOverlay');
    if (!toggle || !overlay) return;

    var FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var isOpen = false;

    // The close button is the hamburger itself, which lives in the header
    // rather than inside the panel — so it has to be spliced into the trap
    // order or keyboard users could never reach it.
    function focusables() {
      var items = Array.prototype.slice.call(overlay.querySelectorAll(FOCUSABLE));
      items.unshift(toggle);
      return items;
    }

    function open() {
      if (isOpen) return;
      isOpen = true;

      overlay.removeAttribute('inert');
      overlay.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('is-menu-open');

      // Land on the first menu destination, not the close button.
      var firstLink = overlay.querySelector(FOCUSABLE);
      if (firstLink) firstLink.focus();

      document.addEventListener('keydown', onKeydown);
    }

    function close(restoreFocus) {
      if (!isOpen) return;
      isOpen = false;

      overlay.classList.remove('is-open');
      overlay.setAttribute('inert', '');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('is-menu-open');

      document.removeEventListener('keydown', onKeydown);

      // Always hand focus back to the toggle rather than to whatever was
      // focused before. The toggle is the only way in, it is guaranteed
      // visible and focusable, and it is where a keyboard user expects to
      // land. Skipped when closing because a link was followed, or because
      // the viewport grew past the breakpoint.
      if (restoreFocus !== false) toggle.focus();
    }

    function onKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab') return;

      // Focus trap: wrap at both ends of the panel.
      var items = focusables();
      if (!items.length) return;

      var first = items[0];
      var last  = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    toggle.addEventListener('click', function () {
      if (isOpen) { close(); } else { open(); }
    });

    // Tapping a destination closes the panel. Same-page links would otherwise
    // leave it covering the content they just jumped to.
    overlay.addEventListener('click', function (event) {
      if (event.target.closest('a[href]')) close(false);
    });

    // Returning to desktop width while open would leave the panel stranded
    // over a nav bar that is already visible.
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) {
      if (e.matches) close(false);
    });
  }


  /* ==========================================================================
     03. SCROLL REVEAL
     Any element with class `reveal` fades up 24px as it enters the viewport.
     Per-element stagger via data-reveal-delay="120" (milliseconds).

     Reduced motion and missing IntersectionObserver both short-circuit to
     "show everything immediately" rather than degrading to hidden content.
     ====================================================================== */

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    function showAll() {
      Array.prototype.forEach.call(items, function (el) {
        el.classList.add('is-visible');
      });
    }

    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        var delay = el.getAttribute('data-reveal-delay');
        if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');

        el.classList.add('is-visible');
        observer.unobserve(el);   // reveal once, then stop watching
      });
    }, {
      // Fire slightly before the element is fully on screen, and ignore the
      // bottom 10% so items do not pop in right at the fold.
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12
    });

    Array.prototype.forEach.call(items, function (el) { observer.observe(el); });

    // If the user turns on Reduce Motion mid-session, stop animating and
    // show whatever is still pending.
    prefersReducedMotion.addEventListener('change', function (e) {
      if (e.matches) {
        observer.disconnect();
        showAll();
      }
    });
  }


  /* ==========================================================================
     04. FOOTER YEAR
     ====================================================================== */

  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = String(new Date().getFullYear());
  }


  /* ==========================================================================
     SHARED HELPERS
     ====================================================================== */

  // The data in SITE_DATA is author-written, but it still gets escaped on the
  // way into markup — a stray & or < in a conference name should render, not
  // break the document.
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function data(key) {
    var root = window.SITE_DATA;
    return (root && Array.isArray(root[key])) ? root[key] : [];
  }

  // Placeholder box, or a real photo if one has been supplied.
  function photoMarkup(item, ratio) {
    var style = ratio ? ' style="--ph-ratio: ' + ratio + '"' : '';
    if (item.photo) {
      // width/height when known: the .ph box already reserves space via
      // aspect-ratio, but the intrinsic size lets the browser reason about
      // the image before it decodes.
      var dims = (item.photoW && item.photoH)
        ? ' width="' + esc(item.photoW) + '" height="' + esc(item.photoH) + '"' : '';
      return '<div class="ph"' + style + '><img src="' + esc(item.photo) + '"' + dims +
             ' alt="' + esc(item.photoAlt || '') + '" loading="lazy" decoding="async"></div>';
    }
    return '<div class="ph"' + style + ' role="img" aria-label="Photograph coming soon"></div>';
  }


  /* ==========================================================================
     05. STAT COUNTERS
     Rendered from SITE_DATA.stats, then counted up from zero the first time
     the row enters the viewport. A null value renders "TBD" and is skipped.
     ====================================================================== */

  function initStats() {
    var row = document.getElementById('statRow');
    if (!row) return;

    var stats = data('stats');
    if (!stats.length) return;

    row.innerHTML = stats.map(function (s) {
      var known = typeof s.value === 'number' && isFinite(s.value);
      var shown = known ? '0' : 'TBD';
      var suffix = (known && s.suffix)
        ? '<span class="stat__suffix">' + esc(s.suffix) + '</span>' : '';
      return '<div class="stat">' +
               '<span class="stat__value"' +
                 (known ? ' data-target="' + s.value + '"' : '') + '>' +
                 shown + suffix +
               '</span>' +
               '<span class="stat__label">' + esc(s.label) + '</span>' +
             '</div>';
    }).join('');

    var targets = row.querySelectorAll('.stat__value[data-target]');
    if (!targets.length) return;

    function run(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suffix = el.querySelector('.stat__suffix');
      var suffixHTML = suffix ? suffix.outerHTML : '';

      if (prefersReducedMotion.matches) {
        el.innerHTML = target + suffixHTML;
        return;
      }

      var DURATION = 1400;
      var startTime = null;

      function frame(now) {
        if (startTime === null) startTime = now;
        var p = Math.min((now - startTime) / DURATION, 1);
        var eased = 1 - Math.pow(1 - p, 3);          // easeOutCubic
        el.innerHTML = Math.round(target * eased) + suffixHTML;
        if (p < 1) window.requestAnimationFrame(frame);
      }

      window.requestAnimationFrame(frame);
    }

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, run);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        observer.unobserve(entry.target);     // count once, not on every pass
      });
    }, { threshold: 0.4 });

    Array.prototype.forEach.call(targets, function (el) { observer.observe(el); });
  }


  /* ==========================================================================
     06. TIMELINE PROGRESS
     The blue rail fills as the list scrolls past a fixed line on screen, and
     each node lights up once the fill reaches it.

     This one genuinely needs scroll position rather than an observer, because
     the fill is continuous rather than a set of thresholds — so it is
     rAF-throttled to one measurement per frame.
     ====================================================================== */

  function initTimeline() {
    var timeline = document.getElementById('timeline');
    if (!timeline) return;

    var fill = timeline.querySelector('.timeline__fill');
    var items = timeline.querySelectorAll('.tl-item');
    if (!fill) return;

    var ticking = false;

    function measure() {
      ticking = false;

      var box = timeline.getBoundingClientRect();
      // The fill tracks a line 55% down the viewport: content above it is
      // "read", content below is not.
      var mark = window.innerHeight * 0.55;
      var progress = (mark - box.top) / (box.height || 1);
      progress = Math.max(0, Math.min(1, progress));

      fill.style.height = (progress * 100).toFixed(2) + '%';

      var reachedPx = progress * box.height;
      Array.prototype.forEach.call(items, function (item) {
        item.classList.toggle('is-reached', item.offsetTop <= reachedPx + 12);
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(measure);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    measure();

    // Exposed so the state can be asserted without synthesising scroll events.
    timeline.__measure = measure;
  }


  /* ==========================================================================
     07. CONFERENCE LISTS + YEAR FILTER
     Both lists are rendered from SITE_DATA. The year chips are derived from
     the data itself, so adding a conference in a new year adds its chip.
     ====================================================================== */

  var STATUS_LABELS = {
    registered: 'Registered',
    open: 'Applications Open',
    tbd: 'TBD'
  };

  function renderUpcoming() {
    var list = document.getElementById('timelineList');
    if (!list) return;

    var items = data('upcomingConferences');
    if (!items.length) {
      list.innerHTML = '<li class="tl-item"><p class="muted">No conferences announced yet.</p></li>';
      return;
    }

    list.innerHTML = items.map(function (c) {
      var key = STATUS_LABELS[c.status] ? c.status : 'tbd';
      var committees = (c.committees && c.committees.length ? c.committees : ['TBD'])
        .map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('');

      return '<li class="tl-item reveal">' +
               '<div class="tl-item__head">' +
                 '<h3 class="tl-item__name">' + esc(c.name) + '</h3>' +
                 '<span class="chip chip--' + key + '">' + esc(STATUS_LABELS[key]) + '</span>' +
               '</div>' +
               '<p class="tl-item__when">' + esc(c.date) +
                 '<span class="sep" aria-hidden="true">/</span>' + esc(c.location) + '</p>' +
               '<ul class="tl-item__committees">' + committees + '</ul>' +
             '</li>';
    }).join('');
  }

  function renderPast() {
    var grid = document.getElementById('confGrid');
    var filterBar = document.getElementById('confFilter');
    if (!grid) return;

    var items = data('pastConferences');
    if (!items.length) {
      grid.innerHTML = '<p class="conf-empty">No past conferences recorded yet.</p>';
      return;
    }

    // Most recent season first.
    var sorted = items.slice().sort(function (a, b) {
      return String(b.season || '').localeCompare(String(a.season || ''));
    });

    grid.innerHTML = sorted.map(function (c) {
      var awards = (c.awards && c.awards.length)
        ? c.awards.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('')
        : '<li class="is-none">No awards recorded</li>';

      // Optional call to action, e.g. the FREMUNC site.
      // A placeholder URL must not become a live button: href="TBD" resolves
      // to a 404 relative to the page, which is worse than no button at all.
      var hasLink = c.link && !/^tbd$/i.test(String(c.link).trim());
      var link = hasLink
        ? '<a class="conf-card__link" href="' + esc(c.link) + '">' +
            esc(c.linkLabel || 'Learn more') + '</a>'
        : '';

      return '<article class="conf-card reveal" data-season="' + esc(c.season) + '">' +
               photoMarkup(c, '4 / 3') +
               '<div class="conf-card__body">' +
                 '<span class="conf-card__year">' + esc(c.season) + '</span>' +
                 '<h3 class="conf-card__name">' + esc(c.name) + '</h3>' +
                 '<ul class="conf-card__awards">' + awards + '</ul>' +
                 link +
               '</div>' +
             '</article>';
    }).join('');

    if (!filterBar) return;

    var seasons = [];
    sorted.forEach(function (c) {
      if (c.season != null && seasons.indexOf(c.season) === -1) seasons.push(c.season);
    });

    // A filter offering exactly one choice is furniture, not a control.
    if (seasons.length < 2) {
      filterBar.hidden = true;
      return;
    }

    filterBar.innerHTML =
      '<button class="filter__btn" type="button" data-season="all" aria-pressed="true">All</button>' +
      seasons.map(function (y) {
        return '<button class="filter__btn" type="button" data-season="' + esc(y) +
               '" aria-pressed="false">' + esc(y) + '</button>';
      }).join('');

    var empty = document.createElement('p');
    empty.className = 'conf-empty';
    empty.hidden = true;
    empty.textContent = 'No conferences recorded for that season yet.';
    grid.parentNode.insertBefore(empty, grid.nextSibling);

    filterBar.addEventListener('click', function (event) {
      var btn = event.target.closest('.filter__btn');
      if (!btn) return;

      var season = btn.getAttribute('data-season');

      Array.prototype.forEach.call(filterBar.querySelectorAll('.filter__btn'), function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });

      var shown = 0;
      Array.prototype.forEach.call(grid.querySelectorAll('.conf-card'), function (card) {
        var match = (season === 'all' || card.getAttribute('data-season') === season);
        card.hidden = !match;
        if (match) shown++;
      });

      empty.hidden = shown > 0;
    });
  }

  function initConferences() {
    renderUpcoming();
    renderPast();
  }


  /* ==========================================================================
     08. OFFICER GRID
     Rendered from SITE_DATA.officers, split into the two named groups.
     ====================================================================== */

  // "Ana Ruiz" → "AR". A name still reading TBD has no meaningful initial, so
  // it gets an em dash instead of a stray "T".
  function initialsFor(name) {
    var clean = String(name || '').trim();
    if (!clean || /^tbd\b/i.test(clean)) return '—';
    return clean.split(/\s+/).slice(0, 2)
      .map(function (w) { return w.charAt(0).toUpperCase(); })
      .join('');
  }

  function initOfficers() {
    var root = document.getElementById('officerGroups');
    if (!root) return;

    var officers = data('officers');
    if (!officers.length) {
      root.innerHTML = '<p class="muted">Officer team to be announced.</p>';
      return;
    }

    root.innerHTML = data('officerGroups').map(function (group) {
      var members = officers.filter(function (o) { return o.group === group.key; });
      if (!members.length) return '';

      var cards = members.map(function (o, i) {
        var portrait = o.photo
          ? '<img src="' + esc(o.photo) + '" alt="' + esc(o.name) + ', ' + esc(o.role) +
            '" loading="lazy" decoding="async">'
          : '<span class="officer__initials" aria-hidden="true">' + esc(initialsFor(o.name)) + '</span>';

        return '<article class="officer reveal" data-reveal-delay="' + (i * 70) + '">' +
                 '<div class="officer__portrait">' + portrait + '</div>' +
                 '<div class="officer__body">' +
                   '<h3 class="officer__name">' + esc(o.name) + '</h3>' +
                   '<span class="officer__role">' + esc(o.role) + '</span>' +
                   (o.grade && !/^tbd$/i.test(String(o.grade).trim())
                      ? '<span class="officer__grade">' + esc(o.grade) + '</span>' : '') +
                   (o.bio && !/^tbd$/i.test(String(o.bio).trim())
                      ? '<p class="officer__bio">' + esc(o.bio) + '</p>' : '') +
                 '</div>' +
               '</article>';
      }).join('');

      return '<section class="officer-group">' +
               '<h2 class="officer-group__title reveal">' + esc(group.title) + '</h2>' +
               '<div class="officer-grid">' + cards + '</div>' +
             '</section>';
    }).join('');
  }


  /* ==========================================================================
     09. PAGE TRANSITION
     A 250ms dark wipe on internal navigation. Deliberately conservative about
     what it intercepts — anything it is not certain about is left to the
     browser, because a hijacked link that fails to navigate is far worse than
     a missing animation.
     ====================================================================== */

  var WIPE_MS = 250;

  function initPageTransition() {
    if (prefersReducedMotion.matches) return;

    var wipe = document.createElement('div');
    wipe.className = 'page-wipe';
    wipe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(wipe);

    // --- Arriving ---------------------------------------------------------
    // Only wipe in if we actually left via a wipe; a bookmark or a fresh tab
    // should paint immediately.
    var CAME_FROM_WIPE = 'imun:wipe';
    var arriving = false;
    try { arriving = sessionStorage.getItem(CAME_FROM_WIPE) === '1'; } catch (e) {}

    if (arriving) {
      try { sessionStorage.removeItem(CAME_FROM_WIPE); } catch (e) {}
      document.body.classList.add('is-arriving');
      // Two frames: one to commit the covered state, one to animate off it.
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          document.body.classList.add('is-arriving-out');
          window.setTimeout(function () {
            document.body.classList.remove('is-arriving', 'is-arriving-out');
          }, WIPE_MS + 40);
        });
      });
    }

    // --- Leaving ----------------------------------------------------------
    document.addEventListener('click', function (event) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;                       // not a left click
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var link = event.target.closest && event.target.closest('a[href]');
      if (!link) return;
      if (link.hasAttribute('download')) return;
      if (link.target && link.target !== '_self') return;   // opens elsewhere

      var url;
      try { url = new URL(link.href, window.location.href); } catch (e) { return; }

      if (url.protocol !== 'http:' && url.protocol !== 'https:') return;  // mailto:, tel:
      if (url.origin !== window.location.origin) return;                 // external
      // Same document, different hash — that is an in-page jump, not a nav.
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      event.preventDefault();
      try { sessionStorage.setItem(CAME_FROM_WIPE, '1'); } catch (e) {}
      document.body.classList.add('is-leaving');

      window.setTimeout(function () { window.location.href = link.href; }, WIPE_MS);
    });

    // Back/forward out of the bfcache restores the DOM as it was — including
    // a fully drawn black panel. Clear it on every show.
    window.addEventListener('pageshow', function () {
      document.body.classList.remove('is-leaving', 'is-arriving', 'is-arriving-out');
    });
  }


  /* ==========================================================================
     BOOT
     ====================================================================== */

  function init() {
    initHeader();
    initMenu();

    // Data-driven sections render first: their markup carries `reveal`
    // classes and timeline nodes that the modules below need to already exist.
    initConferences();
    initOfficers();

    initStats();
    initReveal();
    initTimeline();
    initPageTransition();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
