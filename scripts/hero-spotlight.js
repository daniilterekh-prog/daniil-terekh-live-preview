/* One finite lighting cue; future intro dispatches site:preloader-complete. */
(function () {
  'use strict';
  const root = document.querySelector('[data-hero-spotlight]');
  const hero = document.querySelector('#hero');
  if (!root || !hero) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let introDone = document.documentElement.dataset.preloader !== 'loading';
  let started = false;
  let finished = false;
  let observer;

  function settle() {
    finished = true;
    root.classList.remove('is-igniting');
    root.classList.add('is-steady');
    observer?.disconnect();
  }
  function suppress() {
    finished = true;
    if (started) settle();
  }
  function start() {
    if (!introDone || started) return;
    started = true;
    const rect = hero.getBoundingClientRect();
    if (finished || motion.matches || document.hidden || rect.bottom <= 0 || rect.top >= window.innerHeight) {
      settle();
      return;
    }
    root.classList.add('is-igniting');
  }
  function completeIntro() { introDone = true; start(); }
  document.addEventListener('site:preloader-complete', completeIntro, { once: true });
  root.addEventListener('animationend', event => {
    if (event.animationName === 'spotlight-ignite') settle();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) suppress();
  });
  window.addEventListener('pagehide', suppress);
  motion.addEventListener('change', () => { if (started && motion.matches) settle(); });
  if (document.hidden) suppress();
  if (typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) suppress();
    });
    observer.observe(hero);
  }
  start();
})();
