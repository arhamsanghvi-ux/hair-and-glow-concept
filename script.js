// WhatsApp number comes from the salon's Google Maps listing phone. Confirm it is a WhatsApp number before sharing.
const WA_NUMBER = ''; // set to the salon's WhatsApp number once confirmed
const WA_TEXT = "Hi Hair and Glow Salon, I'd like to book an appointment. My preferred day and time: ";
document.querySelectorAll('[data-wa]').forEach(a => {
  if (!WA_NUMBER) { a.title = 'Demo: WhatsApp number to be confirmed'; a.setAttribute('aria-disabled', 'true'); a.addEventListener('click', e => e.preventDefault()); return; }
  a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_TEXT);
  a.target = '_blank'; a.rel = 'noopener';
});
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => { if (!el.closest('.hero')) io.observe(el); });
// Count-up
document.querySelectorAll('[data-count]').forEach(el => {
  const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
  const cio = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; cio.disconnect();
    const s = performance.now(); (function step(n){ const p = Math.min((n - s) / 1200, 1); el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec); if (p < 1) requestAnimationFrame(step); })(s); });
  cio.observe(el);
});
