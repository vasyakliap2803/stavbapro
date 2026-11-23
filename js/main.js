/* ==========================================================================
   StavbaPro — скрипти
   1. Мобільне меню (бургер)
   2. Тінь у шапки при скролі
   3. Поява блоків при скролі
   4. Підстановка вакансії у форму
   5. Форма заявки (демо)
   6. Поточний рік у футері
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var body = document.body;
  var header = document.getElementById('header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  /* ---------- 1. Мобільне меню ---------- */
  function closeMenu() {
    burger.classList.remove('burger--active');
    nav.classList.remove('nav--open');
    body.classList.remove('is-locked');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Відкрити меню');
  }

  function openMenu() {
    burger.classList.add('burger--active');
    nav.classList.add('nav--open');
    body.classList.add('is-locked');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Закрити меню');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      if (nav.classList.contains('nav--open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
        closeMenu();
        burger.focus();
      }
    });

    window.matchMedia('(min-width: 992px)').addEventListener('change', function (e) {
      if (e.matches) closeMenu();
    });
  }

  /* ---------- 2. Тінь у шапки ---------- */
  var isScrolled = null;
  var ticking = false;

  function updateHeader() {
    ticking = false;
    var next = window.scrollY > 10;
    if (next !== isScrolled) {
      isScrolled = next;
      header.classList.toggle('header--scrolled', next);
    }
  }

  if (header) {
    updateHeader();
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateHeader);
      }
    }, { passive: true });
  }

  /* ---------- 3. Поява блоків при скролі ---------- */
  var revealItems = document.querySelectorAll('.js-reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-visible');
        observer.unobserve(el);
        // прибираємо затримку після появи, щоб наведення працювало без запізнення
        setTimeout(function () { el.style.transitionDelay = ''; }, 900);
      });
    // блок починає з'являтися трохи раніше, ніж доходить до краю екрана
    }, { threshold: 0, rootMargin: '0px 0px 80px 0px' });

    revealItems.forEach(function (el) {
      // невелика затримка лише для сусідніх карток в одному ряду
      var siblings = Array.prototype.filter.call(el.parentNode.children, function (child) {
        return child.classList.contains('js-reveal');
      });
      var index = siblings.indexOf(el);
      if (siblings.length > 1) {
        el.style.transitionDelay = (index % 4) * 0.07 + 's';
      }
      observer.observe(el);
    });
  }

  /* ---------- 3б. Пауза анімацій поза екраном ---------- */
  if ('IntersectionObserver' in window) {
    var zoneObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-paused', !entry.isIntersecting);
      });
    });
    document.querySelectorAll('.js-anim-zone').forEach(function (zone) {
      zoneObserver.observe(zone);
    });
  }

  /* ---------- 4. Вакансія → форма ---------- */
  var vacancySelect = document.getElementById('vacancy-select');
  document.querySelectorAll('[data-vacancy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (vacancySelect) vacancySelect.value = btn.getAttribute('data-vacancy');
    });
  });

  /* ---------- 5. Форма заявки (демо) ---------- */
  var form = document.getElementById('apply-form');
  var success = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Тут можна відправити дані на сервер / у Telegram-бота:
      // fetch('ВАШ_URL', { method: 'POST', body: new FormData(form) });

      form.hidden = true;
      if (success) success.hidden = false;
    });
  }

  /* ---------- 6. Рік у футері ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
