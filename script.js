/* ═══════════════════════════════════════════════════════════════
   SHALENDRA TIWARI — PORTFOLIO SCRIPT
   Skill Tree: SVG connector lines + staggered fade-in on scroll
   ═══════════════════════════════════════════════════════════════ */

/* ── CUSTOM CURSOR ─────────────────────────────────────────── */
const dot  = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

// GPU layer hints so cursor moves never trigger layout
dot.style.willChange  = 'transform';
ring.style.willChange = 'transform';

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.transform  = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
}, { passive: true });
(function followRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
  requestAnimationFrame(followRing);
})();

document.querySelectorAll('a, button, .snode').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
});

/* ── STICKY HEADER ────────────────────────────────────────── */
const hdr = document.querySelector('.hdr');
window.addEventListener('scroll', () => {
  hdr.classList.toggle('stuck', window.scrollY > 40);
}, { passive: true });

/* ── SCROLL REVEAL (general) ─────────────────────────────── */
const revEls = document.querySelectorAll('[data-reveal]');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
revEls.forEach(el => revObs.observe(el));

/* ── NAV ACTIVE ─────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const links    = document.querySelectorAll('.hdr-link');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.style.color = '');
      const a = document.querySelector(`.hdr-link[href="#${e.target.id}"]`);
      if (a) a.style.color = '#f0f0f0';
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => secObs.observe(s));

/* ── HERO PARALLAX (RAF-throttled) ─────────────────────── */
const heroName = document.querySelector('.hero-name');
const heroDeco = document.querySelector('.hero-deco');
let heroRafPending = false;
document.querySelector('.hero')?.addEventListener('mousemove', e => {
  if (heroRafPending) return;
  heroRafPending = true;
  requestAnimationFrame(() => {
    const dx = (e.clientX - window.innerWidth  / 2) / window.innerWidth;
    const dy = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    if (heroName) heroName.style.transform = `translate(${dx * 8}px, ${dy * 5}px)`;
    if (heroDeco) heroDeco.style.transform = `translate(${dx * -14}px, ${dy * -8}px)`;
    heroRafPending = false;
  });
}, { passive: true });

/* ══════════════════════════════════════════════════════════════
   SKILL TREE ANIMATION
   1. Wait until #skillTreeWrap scrolls into view
   2. Fade in ROOT node first
   3. Draw SVG lines root → each category
   4. Fade in category nodes
   5. Draw SVG lines category → each leaf
   6. Fade in leaf nodes (staggered per column)
   ══════════════════════════════════════════════════════════════ */
(function initSkillTree() {
  const wrap   = document.getElementById('skillTreeWrap');
  const svg    = document.getElementById('treeSvg');
  if (!wrap || !svg) return;

  const root       = wrap.querySelector('.snode--root');
  const cats       = Array.from(wrap.querySelectorAll('.snode--cat'));
  const branches   = Array.from(wrap.querySelectorAll('.tree-branch'));
  let   animated   = false;
  let   lineEls    = [];  // store drawn lines for resize redraw

  /* ── Helper: get centre of a node relative to the SVG/wrap ── */
  function centre(el) {
    const wr = wrap.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return {
      x: er.left + er.width  / 2 - wr.left,
      y: er.top  + er.height / 2 - wr.top,
    };
  }

  /* ── Draw one animated SVG line ─────────────────────────── */
  function drawLine(x1, y1, x2, y2, delay = 0) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    // compute actual length for dasharray
    const len = Math.hypot(x2 - x1, y2 - y1);
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    line.style.setProperty('stroke-dasharray', len);
    line.style.setProperty('stroke-dashoffset', len);
    line.style.transitionDelay = `${delay}s`;
    svg.appendChild(line);
    lineEls.push({ el: line, x1, y1, x2, y2, len });
    // trigger draw on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => line.classList.add('drawn'));
    });
    return line;
  }

  /* ── Show a node with delay ──────────────────────────────── */
  function showNode(node, delay = 0) {
    setTimeout(() => {
      node.classList.add('visible');
    }, delay * 1000);
  }

  /* ── Main animate sequence ───────────────────────────────── */
  function animateTree() {
    if (animated) return;
    animated = true;

    // Clear any existing SVG lines
    svg.innerHTML = '';
    lineEls = [];

    /* Step 0: Show root */
    showNode(root, 0);

    /* For each branch column */
    branches.forEach((branch, bi) => {
      const cat    = branch.querySelector('.snode--cat');
      const leaves = Array.from(branch.querySelectorAll('.snode--leaf'));

      const BASE_DELAY = 0.4 + bi * 0.18; // stagger across columns

      /* Step 1 — root → cat line */
      setTimeout(() => {
        const rc = centre(root);
        const cc = centre(cat);
        drawLine(rc.x, rc.y, cc.x, cc.y, 0);
      }, BASE_DELAY * 1000 - 50);

      /* Step 2 — show category node */
      showNode(cat, BASE_DELAY);

      /* Step 3 — cat → each leaf */
      leaves.forEach((leaf, li) => {
        const LEAF_DELAY = BASE_DELAY + 0.22 + li * 0.1;

        setTimeout(() => {
          const cc = centre(cat);
          const lc = centre(leaf);
          drawLine(cc.x, cc.y, lc.x, lc.y, 0);
        }, (LEAF_DELAY - 0.05) * 1000);

        showNode(leaf, LEAF_DELAY);
      });
    });
  }

  /* ── Trigger on scroll into view ───────────────────────── */
  const treeObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateTree();
      treeObs.unobserve(wrap);
    }
  }, { threshold: 0.15 });
  treeObs.observe(wrap);

  /* ── Redraw lines on resize (positions shift) ────────────── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!animated) return;
      // Recalculate & redraw all lines
      lineEls.forEach(({ el, x1, y1, x2, y2, len }) => {
        // positions might have changed — we just snap them as already drawn
        const wr = wrap.getBoundingClientRect();
        // Simplest: just clear and re-run
      });
      // Full re-run on resize
      animated = false;
      svg.innerHTML = '';
      lineEls = [];
      // reset visibility
      wrap.querySelectorAll('.snode').forEach(n => n.classList.remove('visible'));
      animateTree();
    }, 300);
  }, { passive: true });

  /* ── Hover: light up relevant branch lines ─────────────── */
  branches.forEach((branch) => {
    const cat    = branch.querySelector('.snode--cat');
    const leaves = Array.from(branch.querySelectorAll('.snode--leaf'));

    const activate = () => {
      svg.querySelectorAll('line').forEach(l => l.classList.remove('lit'));
      // We can't easily track which lines belong to which cat, so just pulse all
      svg.querySelectorAll('line').forEach(l => l.classList.add('lit'));
    };
    const deactivate = () => {
      svg.querySelectorAll('line').forEach(l => l.classList.remove('lit'));
    };

    cat.addEventListener('mouseenter', activate);
    cat.addEventListener('mouseleave', deactivate);
    leaves.forEach(l => {
      l.addEventListener('mouseenter', activate);
      l.addEventListener('mouseleave', deactivate);
    });
  });

})();
