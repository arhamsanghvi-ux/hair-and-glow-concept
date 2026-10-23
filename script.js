// WhatsApp number comes from the salon's Google Maps listing phone. Confirm it is a WhatsApp number before sharing.
const WA_NUMBER = ''; // set to the salon's WhatsApp number once confirmed
const WA_TEXT = "Hi Hair and Glow Salon, I'd like to book an appointment. My preferred day and time: ";
document.querySelectorAll('[data-wa]').forEach(a => {
  if (!WA_NUMBER) { a.href = '#visit'; a.title = 'WhatsApp number to be confirmed'; a.removeAttribute('target'); return; }
  a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_TEXT);
  a.target = '_blank'; a.rel = 'noopener';
});
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => { if (!el.closest('.hero')) io.observe(el); });
// Hours in Asia/Kolkata
const H = {0:[9,22.5],1:[9,21],2:[9,22.5],3:[9,22.5],4:[9,22.5],5:[9,22.5],6:[9,21.5]};
const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
const d = now.getDay(), t = now.getHours() + now.getMinutes() / 60;
const [o, c] = H[d];
const open = t >= o && t < c;
const fmt = h => { const hh = Math.floor(h), m = h % 1 ? ':30' : ''; return (hh % 12 || 12) + m + ' ' + (hh >= 12 ? 'PM' : 'AM'); };
document.getElementById('open-status').textContent = open ? 'Open now, closes ' + fmt(c) : 'Closed now, opens ' + fmt(9) + (t >= c ? ' tomorrow' : '');
document.getElementById('dot').classList.toggle('on', open);
const row = document.querySelector('#hours tr[data-d="' + d + '"]'); if (row) row.classList.add('today');
// Count-up
document.querySelectorAll('[data-count]').forEach(el => {
  const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
  const cio = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; cio.disconnect();
    const s = performance.now(); (function step(n){ const p = Math.min((n - s) / 1200, 1); el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec); if (p < 1) requestAnimationFrame(step); })(s); });
  cio.observe(el);
});
