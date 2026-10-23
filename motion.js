(() => {
  const root = document.documentElement;
  if (!root.classList.contains('motion')) return;
  try {
    const $ = (s, c = document) => [...c.querySelectorAll(s)];
    const raf = fn => requestAnimationFrame(fn);

    // Split h2 headings into masked words
    $('h2.reveal').forEach(h => {
      const words = h.textContent.trim().split(/\s+/);
      h.setAttribute('aria-label', h.textContent.trim());
      h.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join(' ');
      h.classList.remove('reveal');
      h.classList.add('split-h2');
    });

    // Stagger delays for groups
    $('.svc li').forEach((li, i) => li.style.setProperty('--d', (i * 0.09) + 's'));
    $('.quotes figure').forEach((f, i) => f.style.setProperty('--d', (i * 0.13) + 's'));
    $('.stats > div').forEach((d, i) => d.style.setProperty('--d', (i * 0.1) + 's'));
    $('.grid-2 .reveal').forEach((el, i) => el.style.setProperty('--d', (i * 0.06) + 's'));

    // Reveal on scroll
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
    $('.reveal, .split-h2, .svc li, .quotes figure').forEach(el => { if (!el.closest('.hero')) io.observe(el); });

    // Scroll state: progress bar, parallax var, nav hide, ticker velocity
    const track = document.querySelector('.ticker-track');
    const nav = document.querySelector('.nav');
    let lastY = scrollY, vel = 0, tx = 0, third = 0;
    const measure = () => { third = track ? track.scrollWidth / 3 : 0; };
    measure(); addEventListener('resize', measure); addEventListener('load', measure);
    let sy = scrollY, ticking = false;
    const onScroll = () => {
      sy = scrollY;
      if (!ticking) { ticking = true; raf(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        root.style.setProperty('--p', max > 0 ? (sy / max).toFixed(4) : 0);
        root.style.setProperty('--sy', Math.min(sy, 1400));
        if (nav) nav.classList.toggle('hide', sy > lastY && sy > 160);
        vel += (sy - lastY) * .12; lastY = sy; ticking = false;
      }); }
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    // Ticker: constant drift that speeds up and reverses with scroll
    const loop = () => {
      vel *= .92;
      if (track && third) {
        tx -= .55 + vel;
        if (tx <= -third) tx += third; if (tx > 0) tx -= third;
        track.style.transform = `translate3d(${tx}px,0,0)`;
      }
      raf(loop);
    };
    raf(loop);

    // Nav highlight for current section
    const links = $('.nav nav a');
    const sec = links.map(a => document.querySelector(a.getAttribute('href')));
    const so = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach((a, i) => a.classList.toggle('on', sec[i] === e.target));
    }), { threshold: .35 });
    sec.forEach(s => s && so.observe(s));

    // Hero pointer parallax
    const hero = document.querySelector('.hero');
    if (hero && matchMedia('(pointer:fine)').matches) {
      hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        root.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3));
        root.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3));
      });
      hero.addEventListener('pointerleave', () => { root.style.setProperty('--mx', 0); root.style.setProperty('--my', 0); });

      // Magnetic buttons
      $('.btn').forEach(b => {
        b.addEventListener('pointermove', e => {
          const r = b.getBoundingClientRect();
          b.style.translate = `${((e.clientX - r.left) / r.width - .5) * 10}px ${((e.clientY - r.top) / r.height - .5) * 8 - 2}px`;
        });
        b.addEventListener('pointerleave', () => { b.style.translate = ''; });
      });

      // Review card tilt
      $('.quotes figure').forEach(f => {
        f.addEventListener('pointermove', e => {
          const r = f.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
          f.style.transition = 'box-shadow .4s';
          f.style.transform = `perspective(700px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
        });
        f.addEventListener('pointerleave', () => { f.style.transition = ''; f.style.transform = ''; });
      });
    }
  } catch (err) {
    // If anything fails, fall back to the static page.
    root.classList.remove('motion');
    root.classList.add('hero-go', 'intro-done');
    document.querySelectorAll('.reveal,.split-h2,.svc li,.quotes figure').forEach(el => el.classList.add('in'));
    console.error(err);
  }
})();
