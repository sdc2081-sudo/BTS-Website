(function () {
  'use strict';

  /* ---------- Current year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Logo: hide monogram if logo.jpg loads ---------- */
  document.querySelectorAll('.logo__img').forEach(function (img) {
    var mark = img.parentElement.querySelector('.logo__mark');
    function useLogo() { if (mark) mark.style.display = 'none'; }
    function useMark() { img.style.display = 'none'; if (mark) mark.style.display = 'grid'; }
    if (img.complete && img.naturalWidth > 0) useLogo();
    img.addEventListener('load', useLogo);
    img.addEventListener('error', useMark);
  });

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Sticky header + back-to-top ---------- */
  var header = document.getElementById('header');
  var backToTop = document.getElementById('backToTop');
  function onScroll() {
    var sy = window.scrollY;
    if (header) header.classList.toggle('scrolled', sy > 12);
    if (backToTop) backToTop.classList.toggle('show', sy > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = (i * 70) + 'ms';
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1500, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { countObserver.observe(c); });
  }

  /* ---------- Contact form (contact.html only) ---------- */
  var form = document.getElementById('quoteForm');
  if (form) {
    var successBox = document.getElementById('formSuccess');
    var waFollowUp = document.getElementById('waFollowUp');
    var WA_NUMBER = '9779802858997';

    function setError(field, hasError) {
      var wrap = field.closest('.field');
      if (wrap) wrap.classList.toggle('error', hasError);
    }
    function isContactValid(v) {
      v = v.trim();
      var email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      var phone = /^[+()\-\s\d]{7,18}$/;
      return email.test(v) || phone.test(v);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name, contactDetail = form.contactDetail,
          subject = form.subject, message = form.message, errors = 0;

      if (name.value.trim().length < 2) { setError(name, true); errors++; } else setError(name, false);
      if (!isContactValid(contactDetail.value)) { setError(contactDetail, true); errors++; } else setError(contactDetail, false);
      if (!subject.value) { setError(subject, true); errors++; } else setError(subject, false);
      if (message.value.trim().length < 5) { setError(message, true); errors++; } else setError(message, false);

      if (errors > 0) {
        var firstError = form.querySelector('.field.error input, .field.error select, .field.error textarea');
        if (firstError) firstError.focus();
        return;
      }

      var text = 'New Website Enquiry%0A--------------------------%0A' +
        'Name: ' + encodeURIComponent(name.value.trim()) + '%0A' +
        'Contact: ' + encodeURIComponent(contactDetail.value.trim()) + '%0A' +
        'Subject: ' + encodeURIComponent(subject.value) + '%0A' +
        'Message: ' + encodeURIComponent(message.value.trim());

      if (waFollowUp) waFollowUp.href = 'https://wa.me/' + WA_NUMBER + '?text=' + text;
      form.style.display = 'none';
      if (successBox) successBox.classList.add('show');
      form.reset();
    });

    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('input', function () { setError(el, false); });
      el.addEventListener('change', function () { setError(el, false); });
    });
  }

  /* ---------- Product card → preselect subject ---------- */
  var subjectSelect = document.getElementById('subject');
  if (subjectSelect) {
    document.querySelectorAll('[data-subject]').forEach(function (link) {
      link.addEventListener('click', function () {
        var wanted = link.getAttribute('data-subject').trim().toLowerCase();
        Array.prototype.forEach.call(subjectSelect.options, function (opt) {
          if (opt.text.trim().toLowerCase() === wanted) {
            subjectSelect.value = opt.value || opt.text;
          }
        });
      });
    });
  }

})();