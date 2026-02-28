(function () {
  'use strict';

  var reducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveal() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
    if (!cards.length) return;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      cards.forEach(function (card) {
        card.classList.remove('card--hidden');
        card.classList.add('card--visible');
      });
      return;
    }

    cards.forEach(function (card) {
      card.classList.add('card--hidden');
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var card = entry.target;
          var index = cards.indexOf(card);
          var delay = Math.max(0, index * 70);
          setTimeout(function () {
            card.classList.remove('card--hidden');
            card.classList.add('card--visible');
          }, delay);
          observer.unobserve(card);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -18px 0px' }
    );

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  function initKeyboardNav() {
    var list = document.querySelector('.project-grid');
    if (!list) return;

    var cards = Array.prototype.slice.call(list.querySelectorAll('.card'));
    if (!cards.length) return;

    cards.forEach(function (card, index) {
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }
      card.setAttribute('role', 'article');

      card.addEventListener('keydown', function (event) {
        var key = event.key;

        if (key === 'Enter' || key === ' ') {
          var repoLink = card.querySelector('.card__link');
          if (repoLink) {
            event.preventDefault();
            repoLink.click();
          }
          return;
        }

        if (key === 'ArrowDown' || key === 'ArrowRight') {
          event.preventDefault();
          var next = cards[index + 1];
          if (next) next.focus();
          return;
        }

        if (key === 'ArrowUp' || key === 'ArrowLeft') {
          event.preventDefault();
          var prev = cards[index - 1];
          if (prev) prev.focus();
        }
      });
    });
  }

  function initAnchorFallback() {
    var anchors = Array.prototype.slice.call(
      document.querySelectorAll('a[href^="#"]')
    );
    if (!anchors.length) return;

    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (event) {
        var href = anchor.getAttribute('href');
        if (!href || href.length <= 1) return;
        var target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();

        var behavior = reducedMotion ? 'auto' : 'smooth';
        target.scrollIntoView({ behavior: behavior, block: 'start' });
      });
    });
  }

  function boot() {
    initReveal();
    initKeyboardNav();
    initAnchorFallback();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
