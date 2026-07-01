/*
 * script.js — SHEREBOY TECH LTD
 * Clean, modular ES6 implementation for UI interactions
 * Replaces legacy script with modern, readable, maintainable code.
 * - Loader with fade-out
 * - Hero typing animation
 * - Floating background particles (lightweight)
 * - Scroll reveal animations (IntersectionObserver)
 * - FAQ live search with "No results found"
 * - Disable Blog & Project sections and show professional modal
 * - Contact form validation and contact-send modal (Email / WhatsApp)
 *
 * Notes:
 * - This file intentionally does not modify HTML markup. New UI elements (modals)
 *   are created dynamically and styled with scoped CSS injected here.
 * - Designed to be performant and run on modern evergreen browsers.
 */

// ---------- Scoped CSS injected for components created by JS ----------
const injectedCss = `
/***** Loader *****/
#loader-wrapper { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:#0b0f13; z-index:9999; transition:opacity .5s ease; }
#loader-wrapper .loader { text-align:center; color:#fff; }
#loader-wrapper .loading-text{ display:inline-block; font-weight:700; font-size:1.4rem; letter-spacing:2px; }
#loader-wrapper .spinner{ width:64px; height:64px; margin:14px auto 0; border-radius:50%; border:6px solid rgba(255,255,255,0.12); border-top-color:#ffd700; animation:spin 1s linear infinite }
@keyframes spin{ to{ transform:rotate(360deg); } }

/* Modal (generic) */
.js-modal-backdrop{ position:fixed; inset:0; background:rgba(6,10,15,0.6); display:flex; align-items:center; justify-content:center; z-index:10010; }
.js-modal{ width:clamp(300px, 80%, 760px); background:#fff; border-radius:10px; padding:20px; box-shadow:0 10px 30px rgba(2,6,23,0.4); color:#141414; font-family:inherit; }
.js-modal h3{ margin:0 0 8px; font-size:1.15rem; }
.js-modal p{ margin:0 0 14px; color:#4b5563; }
.js-modal .btn-row{ display:flex; gap:10px; justify-content:flex-end; margin-top:16px; }
.js-modal .btn{ padding:10px 14px; border-radius:8px; border:0; cursor:pointer; font-weight:600 }
.js-modal .btn.secondary{ background:#eef2f7; color:#0b1320 }
.js-modal .btn.primary{ background:linear-gradient(90deg,#ffd700,#007bff); color:#051022 }
.js-modal .btn.block{ flex:1 }

/* FAQ no-results */
.faq-no-results{ padding:14px; color:#6b7280; font-style:italic; }

/* Form validation */
.js-field-error{ border-color:#ef4444 !important; box-shadow:0 0 0 3px rgba(239,68,68,0.07); }
.js-field-help{ color:#dc2626; font-size:0.875rem; margin-top:6px }

/* Small helper */
[data-disabled="true"]{ pointer-events:none; opacity:0.65 }
`;
(function injectStyles(){
  const s = document.createElement('style');
  s.id = 'js-injected-styles';
  s.textContent = injectedCss;
  document.head.appendChild(s);
})();

// ---------- Utility helpers ----------
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));
const on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);
const once = (el, evt, fn) => on(el, evt, fn, { once: true });
const noop = () => {};

function debounce(fn, wait = 100){ let t; return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), wait); } }

function createEl(tag, attrs = {}, children = []){
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k === 'class') el.className = v;
    else if(k === 'text') el.textContent = v;
    else if(k === 'html') el.innerHTML = v;
    else if(k === 'dataset') Object.assign(el.dataset, v);
    else el.setAttribute(k, v);
  });
  children.forEach(c => el.appendChild(c));
  return el;
}

// ---------- Loader Module ----------
const Loader = (function(){
  const wrapperId = 'loader-wrapper';
  let wrapper = null;

  function init(){
    wrapper = document.getElementById(wrapperId);
    if(!wrapper){
      // Create minimal loader if not present in HTML
      wrapper = createEl('div', { id: wrapperId });
      const loader = createEl('div', { class: 'loader' });
      loader.appendChild(createEl('div', { class: 'loading-text', text: 'SHEREBOY TECH LTD' }));
      loader.appendChild(createEl('div', { class: 'spinner' }));
      wrapper.appendChild(loader);
      document.body.appendChild(wrapper);
    } else {
      // enhance existing loader markup if missing spinner
      if(!wrapper.querySelector('.spinner')){
        const span = createEl('div', { class: 'spinner' });
        wrapper.querySelector('.loader')?.appendChild(span);
      }
    }
    // ensure visible initially
    wrapper.style.opacity = '1';
  }

  function hide(){
    if(!wrapper) return;
    wrapper.style.opacity = '0';
    // after transition remove from flow
    setTimeout(()=>{
      wrapper.style.display = 'none';
    }, 500);
  }

  // wait for full page load then hide
  function attach(){
    if(document.readyState === 'complete'){
      // small delay to make UX smooth
      setTimeout(hide, 300);
    } else {
      once(window, 'load', ()=> setTimeout(hide, 300));
    }
  }

  return { init, attach };
})();

// ---------- Typing animation (Hero) ----------
const HeroTyping = (function(){
  const selector = '.hero-title';
  const typingSpeed = 40; // ms per char
  const pauseAfter = 1500; // ms
  let el = null;
  let originalText = '';
  let timer = null;

  function init(){
    el = document.querySelector(selector);
    if(!el) return;
    originalText = el.textContent.trim();
    // If markup contains nested strong.company-name keep original and use textContent
    el.textContent = '';
    start();
  }

  async function start(){
    // Type in, pause, then optionally loop by deleting and retyping gracefully
    await typeText(originalText);
    await wait(pauseAfter);
    // graceful loop: delete then retype
    await deleteText();
    await wait(400);
    start();
  }

  function typeText(text){
    return new Promise(resolve => {
      let i = 0;
      timer = setInterval(()=>{
        el.textContent = text.slice(0, ++i);
        if(i === text.length){
          clearInterval(timer);
          resolve();
        }
      }, typingSpeed);
    });
  }

  function deleteText(){
    return new Promise(resolve => {
      let i = el.textContent.length;
      timer = setInterval(()=>{
        el.textContent = el.textContent.slice(0, --i);
        if(i <= 0){ clearInterval(timer); resolve(); }
      }, Math.max(typingSpeed/2, 20));
    });
  }

  function wait(ms){ return new Promise(r => setTimeout(r, ms)); }

  return { init };
})();

// ---------- Floating particles (background) ----------
const FloatingBg = (function(){
  const containerId = 'particles';
  const maxParticles = 30; // tuned for performance
  const particleClass = 'js-float-particle';
  let container = null;
  let particles = [];

  function init(){
    container = document.getElementById(containerId);
    if(!container) return;
    container.style.position = 'fixed';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '-1';
    container.style.inset = '0';
    // create particles
    const count = Math.min(maxParticles, Math.max(8, Math.floor(window.innerWidth/100)));
    for(let i=0;i<count;i++){
      const p = document.createElement('div');
      p.className = particleClass;
      const size = (Math.random()*18)+6; // 6-24px
      p.style.width = p.style.height = size + 'px';
      p.style.borderRadius = '50%';
      p.style.opacity = String(0.06 + Math.random()*0.12);
      p.style.background = `radial-gradient(circle at 30% 30%, rgba(255,215,0,0.12), rgba(0,123,255,0.04))`;
      p.style.position = 'absolute';
      resetParticle(p, true);
      container.appendChild(p);
      particles.push({el:p, vy: (0.2 + Math.random()*0.6), vx: (Math.random()*0.6 - 0.3)});
    }
    requestAnimationFrame(animate);
    on(window, 'resize', debounce(handleResize, 250));
  }

  function resetParticle(p, initial=false){
    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight + (initial? Math.random()*200 : 40 + Math.random()*200);
    p.style.transform = `translate(${x}px, ${y}px)`;
    p.dataset.x = x; p.dataset.y = y;
  }

  function animate(){
    for(const obj of particles){
      const el = obj.el;
      let x = parseFloat(el.dataset.x);
      let y = parseFloat(el.dataset.y);
      y -= obj.vy; // move upward
      x += obj.vx;
      // slight oscillation
      x += Math.sin(Date.now()/10000 + x) * 0.15;
      el.dataset.x = x; el.dataset.y = y;
      el.style.transform = `translate(${x}px, ${y}px)`;
      // recycle
      if(y < -150){ resetParticle(el); }
    }
    requestAnimationFrame(animate);
  }

  function handleResize(){
    // On resize, reposition particles to keep them within bounds
    particles.forEach(p => {
      const el = p.el;
      el.dataset.x = Math.random() * window.innerWidth;
      el.dataset.y = window.innerHeight + Math.random()*200;
    });
  }

  return { init };
})();

// ---------- Scroll reveal animations ----------
const ScrollReveal = (function(){
  const revealClass = 'reveal';
  const selector = '.section, .card, .hero-title, .zoom-img, .glow-bg, .details-content';
  let observer = null;

  function init(){
    const elements = $$(selector);
    if(!elements.length) return;
    const ioOptions = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };
    observer = new IntersectionObserver(handleEntries, ioOptions);
    elements.forEach((el, idx) => {
      // stagger for cards
      if(el.classList.contains('card')) el.style.transitionDelay = `${Math.min(0.4, idx*0.06)}s`;
      observer.observe(el);
    });
  }

  function handleEntries(entries){
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add(revealClass);
        // reveal once
        observer.unobserve(entry.target);
      }
    });
  }

  return { init };
})();

// ---------- FAQ Live Search ----------
const FAQSearch = (function(){
  const input = document.getElementById('faq');
  const itemsSelector = '.details-content';
  let items = [];
  let noResultsEl = null;

  function init(){
    if(!input) return;
    items = $$(itemsSelector);
    // create no-results element
    noResultsEl = createEl('div', { class: 'faq-no-results', text: 'No results found.' });
    input.addEventListener('input', debounce(handleSearch, 120));
    // support clearing via Escape
    input.addEventListener('keydown', e => { if(e.key === 'Escape'){ input.value = ''; handleSearch(); } });
  }

  function handleSearch(){
    const q = (input.value || '').trim().toLowerCase();
    let visible = 0;
    items.forEach(item => {
      const text = item.innerText.toLowerCase();
      const match = !q || text.includes(q);
      item.style.display = match ? '' : 'none';
      if(match) visible++;
    });
    // Manage no-results message
    const parent = items[0]?.parentElement;
    if(parent){
      if(visible === 0){
        if(!parent.contains(noResultsEl)) parent.appendChild(noResultsEl);
      } else {
        if(parent.contains(noResultsEl)) parent.removeChild(noResultsEl);
      }
    }
  }

  return { init };
})();

// ---------- Sections Under Development (Blog / Project) ----------
const UnderDevelopment = (function(){
  const blockedPaths = ['blog.html', 'project.html'];
  let modal = null;

  function init(){
    // Intercept clicks on links that point to blocked paths
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('a');
      if(!a || !a.getAttribute) return;
      const href = a.getAttribute('href') || '';
      // Check if href ends with the blocked path (or contains it)
      const isBlocked = blockedPaths.some(p => href.includes(p));
      if(isBlocked){
        e.preventDefault();
        showModal();
      }
    });

    // Disable programmatic navigation via forms or other elements by marking elements
    const allLinks = $$('a');
    allLinks.forEach(a => {
      const href = a.getAttribute('href') || '';
      if(blockedPaths.some(p=>href.includes(p))){
        a.dataset.disabled = 'true';
      }
    });
  }

  function showModal(){
    if(modal) return; // already shown
    modal = createModal({ title: 'Section under development',
      text: "This section is currently under development. We're still working on it. Please check back soon.",
      primaryText: 'OK'
    });
    document.body.appendChild(modal.backdrop);
  }

  return { init, showModal };
})();

// ---------- Contact Form Validation + Send Modal ----------
const ContactForm = (function(){
  const formSelector = '#contact-form';
  const minMessageLength = 12;
  let form = null;

  function init(){
    form = document.querySelector(formSelector);
    if(!form) return;
    form.addEventListener('submit', handleSubmit);
  }

  function handleSubmit(e){
    e.preventDefault();
    clearErrors();
    const fields = collectFields();
    const errors = validate(fields);
    if(Object.keys(errors).length){
      showErrors(errors);
      return;
    }
    // valid — show send modal
    showSendModal(fields);
  }

  function collectFields(){
    const data = {};
    // best-effort mapping to common field names
    const nameEl = form.querySelector('input[name="full-name"], input[name="name"], input#name, input#full_name, input.full-name') || form.querySelector('input[type="text"]');
    const emailEl = form.querySelector('input[type="email"], input[name="email"]');
    const phoneEl = form.querySelector('input[name="phone"], input[name="tel"], input#phone');
    const subjectEl = form.querySelector('input[name="subject"], input#subject');
    const messageEl = form.querySelector('textarea[name="message"], textarea#message');

    data.name = nameEl?.value?.trim() || '';
    data.email = emailEl?.value?.trim() || '';
    data.phone = phoneEl?.value?.trim() || '';
    data.subject = subjectEl?.value?.trim() || '';
    data.message = messageEl?.value?.trim() || '';

    // store elements for error display
    data._els = { nameEl, emailEl, phoneEl, subjectEl, messageEl };
    return data;
  }

  function validate({ name, email, phone, subject, message }){
    const errors = {};
    if(!name) errors.name = 'Full name is required.';
    if(!email) errors.email = 'Email address is required.';
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email address.';
    if(!phone) errors.phone = 'Phone number is required.';
    else if(!/^[0-9+()\s-]{7,20}$/.test(phone)) errors.phone = 'Please enter a valid phone number (7-20 digits).' ;
    if(!message || message.length < minMessageLength) errors.message = `Message must be at least ${minMessageLength} characters.`;
    return errors;
  }

  function showErrors(errors){
    Object.entries(errors).forEach(([k,msg]) => {
      const el = form.querySelector({ name: 'name' } ? 'input[name="full-name"], input[name="name"], input#name' : '');
      // map to specific element selectors
      let fieldEl = null;
      if(k === 'name') fieldEl = form.querySelector('input[name="full-name"], input[name="name"], input#name');
      if(k === 'email') fieldEl = form.querySelector('input[type="email"], input[name="email"]');
      if(k === 'phone') fieldEl = form.querySelector('input[name="phone"], input[name="tel"], input#phone');
      if(k === 'subject') fieldEl = form.querySelector('input[name="subject"], input#subject');
      if(k === 'message') fieldEl = form.querySelector('textarea[name="message"], textarea#message');

      if(fieldEl){
        fieldEl.classList.add('js-field-error');
        // add help text
        const help = createEl('div', { class: 'js-field-help', text: msg });
        fieldEl.insertAdjacentElement('afterend', help);
      }
    });
    // focus first invalid field
    const first = form.querySelector('.js-field-error');
    if(first) first.focus();
  }

  function clearErrors(){
    form.querySelectorAll('.js-field-help').forEach(el=>el.remove());
    form.querySelectorAll('.js-field-error').forEach(el=>el.classList.remove('js-field-error'));
  }

  function showSendModal(fields){
    const body = [];
    if(fields.subject) body.push(`Subject: ${fields.subject}`);
    if(fields.message) body.push(`Message: ${fields.message}`);
    body.push(`From: ${fields.name} (${fields.email}${fields.phone? ', ' + fields.phone : ''})`);
    const text = 'How would you like to send your message?';

    const modal = createModal({
      title: 'Send message',
      text,
      primaryText: 'Send via Email',
      secondaryText: 'Send via WhatsApp',
      onPrimary: () => {
        // open default email client with mailto
        const subject = fields.subject || 'Message from SHEREBOY TECH LTD website';
        const bodyText = `${fields.message}\n\n--\n${fields.name}\n${fields.email}${fields.phone? ('\n' + fields.phone): ''}`;
        const mailto = `mailto:${encodeURIComponent(fields.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
        // Some clients don't like percent-encoded recipient in mailto when not intended; using blank recipient is nicer
        window.location.href = mailto;
      },
      onSecondary: () => {
        // open WhatsApp with message prefilled
        const waNumber = ''; // optional: put business number if desired, otherwise opens selector
        const message = `${fields.subject ? fields.subject + ' - ' : ''}${fields.message}\n\nFrom: ${fields.name} (${fields.email}${fields.phone? ', ' + fields.phone : ''})`;
        const href = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
        window.open(href, '_blank');
      }
    });
    document.body.appendChild(modal.backdrop);
  }

  return { init };
})();

// ---------- Small reusable modal builder ----------
function createModal({ title = '', text = '', primaryText = 'OK', secondaryText = null, onPrimary = null, onSecondary = null }){
  const backdrop = createEl('div', { class: 'js-modal-backdrop' });
  const modal = createEl('div', { class: 'js-modal' });
  const h = createEl('h3', { text: title });
  const p = createEl('p', { text });
  modal.appendChild(h); modal.appendChild(p);
  const btnRow = createEl('div', { class: 'btn-row' });

  if(secondaryText){
    const sec = createEl('button', { class: 'btn secondary', text: secondaryText });
    sec.addEventListener('click', () => { if(onSecondary) onSecondary(); document.body.removeChild(backdrop); });
    btnRow.appendChild(sec);
  }

  const prim = createEl('button', { class: `btn primary ${secondaryText ? '' : 'block'}`, text: primaryText });
  prim.addEventListener('click', () => { if(onPrimary) onPrimary(); document.body.removeChild(backdrop); });
  btnRow.appendChild(prim);

  const close = createEl('button', { class: 'btn secondary', text: 'Close' });
  close.addEventListener('click', ()=> { document.body.removeChild(backdrop); });
  btnRow.appendChild(close);

  modal.appendChild(btnRow);
  backdrop.appendChild(modal);
  backdrop.addEventListener('click', (e)=>{ if(e.target === backdrop) document.body.removeChild(backdrop); });
  return { backdrop, modal };
}

// ---------- Page init ----------
function initAll(){
  Loader.init(); Loader.attach();
  HeroTyping.init();
  FloatingBg.init();
  ScrollReveal.init();
  FAQSearch.init();
  UnderDevelopment.init();
  ContactForm.init();
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
else initAll();

// End of script.js
