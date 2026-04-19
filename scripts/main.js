/* Mobile menu toggle */
const toggle = document.querySelector('.nav__toggle');
const menu = document.querySelector('.nav__menu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.classList.toggle('is-active');
    menu.classList.toggle('active');
  });
}

/* Header shrink on scroll + Sticky CTA */
const header = document.querySelector('.header');
const stickyCta = document.getElementById('stickyCta');

if (header) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('header--shrunk', y > 40);
    if (stickyCta) {
      stickyCta.classList.toggle('is-visible', y > window.innerHeight * 0.6);
    }
  }, { passive: true });
}

/* Fade-in on scroll (Intersection Observer) */
const fadeEls = document.querySelectorAll('.fade-in');

if (fadeEls.length) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsIO = 'IntersectionObserver' in window;

  const revealAll = () => fadeEls.forEach((el) => el.classList.add('is-visible'));

  if (reduceMotion || !supportsIO) {
    revealAll();
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 10% 0px' }
    );
    fadeEls.forEach((el) => observer.observe(el));

    window.setTimeout(() => {
      fadeEls.forEach((el) => {
        if (!el.classList.contains('is-visible')) {
          el.classList.add('is-visible');
        }
      });
    }, 2500);
  }
}

/* Quiz */
(function initQuiz() {
  const card = document.querySelector('.quiz__card');
  if (!card) return;

  const steps = card.querySelectorAll('.quiz__step');
  const bar = document.getElementById('quizProgress');
  const resultEl = document.getElementById('quizResult');
  const startBtn = card.querySelector('.quiz__next');

  const totalQuestions = 5;
  let current = 'intro';
  let category = '';
  let score = 0;

  function showStep(name) {
    steps.forEach((s) => {
      s.classList.remove('quiz__step--active');
      if (s.dataset.step === name) s.classList.add('quiz__step--active');
    });
    current = name;
    updateProgress();
  }

  function updateProgress() {
    if (current === 'intro') { bar.style.width = '0%'; return; }
    if (current === 'result') { bar.style.width = '100%'; return; }
    const pct = (parseInt(current, 10) / totalQuestions) * 100;
    bar.style.width = pct + '%';
  }

  function nextStep() {
    if (current === 'intro') { showStep('1'); return; }
    const num = parseInt(current, 10);
    if (num < totalQuestions) { showStep(String(num + 1)); return; }
    showResult();
  }

  function showResult() {
    const results = {
      lek: {
        title: 'Hipnoterapia może uwolnić Cię od lęku',
        text: 'Badania kliniczne potwierdzają — hipnoterapia w połączeniu z terapią poznawczo-behawioralną zwiększa skuteczność leczenia lęku o 75%. Twój problem nie jest nierozwiązywalny.',
        stat: '75–93%'
      },
      nawyk: {
        title: 'Twój nawyk ma źródło — hipnoterapia do niego dotrze',
        text: 'Zamiast walczyć z objawem, pracujemy ze źródłem w podświadomości. Hipnoterapia pomaga w kontroli impulsów i buduje trwałą motywację do zmiany.',
        stat: '2–6 sesji'
      },
      stres: {
        title: 'Spokój i sen są w Twoim zasięgu',
        text: 'Hipnoterapia wycisza umysł i redukuje napięcie na poziomie podświadomości. Techniki relaksacyjne, których nauczysz się na sesji, zostają z Tobą na co dzień.',
        stat: '93%'
      },
      pewnosc: {
        title: 'Pewność siebie już w Tobie jest — odkryjmy ją',
        text: 'Ograniczające przekonania powstały kiedyś w Twojej podświadomości. Hipnoterapia pozwala je przeprogramować i zbudować pewność opartą na realnej sile.',
        stat: '1–4 sesje'
      },
      trauma: {
        title: 'Zamrożone emocje można bezpiecznie przepracować',
        text: 'Hipnoterapia pozwala dotrzeć do wspomnień i emocji, które blokują Twoje życie — w bezpiecznym, kontrolowanym procesie. Badania wykazują 93% skuteczność po 6 sesjach.',
        stat: '93%'
      },
      rozwoj: {
        title: 'Twój potencjał jest większy niż myślisz',
        text: 'Hipnoterapia rozwojowa pomaga sportowcom i liderom biznesu eliminować blokady mentalne, odkrywać ukryte zasoby i osiągać cele na najwyższym poziomie.',
        stat: '2–4 sesje'
      }
    };

    const r = results[category] || results.stres;
    const urgency = score >= 8 ? 'Twoja sytuacja wskazuje, że hipnoterapia może przynieść Ci szybką i odczuwalną zmianę.' : 'Hipnoterapia może Ci pomóc — im wcześniej zaczniesz, tym szybciej poczujesz różnicę.';

    resultEl.innerHTML =
      '<span class="quiz__result-icon" aria-hidden="true">&#10024;</span>' +
      '<h3>' + r.title + '</h3>' +
      '<p>' + r.text + '</p>' +
      '<p><strong>' + urgency + '</strong></p>' +
      '<div class="quiz__result-stats">' +
        '<div class="quiz__stat"><span class="quiz__stat-value">' + r.stat + '</span><span class="quiz__stat-label">skuteczność</span></div>' +
        '<div class="quiz__stat"><span class="quiz__stat-value">0 zł</span><span class="quiz__stat-label">pierwsza konsultacja</span></div>' +
        '<div class="quiz__stat"><span class="quiz__stat-value">100%</span><span class="quiz__stat-label">gwarancja satysfakcji</span></div>' +
      '</div>' +
      '<a href="pages/umow-wizyte.html" class="btn btn--primary btn--lg">Umów darmową konsultację</a>';

    showStep('result');
  }

  if (startBtn) {
    startBtn.addEventListener('click', nextStep);
  }

  card.addEventListener('click', (e) => {
    const opt = e.target.closest('.quiz__option');
    if (!opt) return;

    opt.parentElement.querySelectorAll('.quiz__option').forEach((o) =>
      o.classList.remove('quiz__option--selected')
    );
    opt.classList.add('quiz__option--selected');

    if (opt.dataset.category) category = opt.dataset.category;
    if (opt.dataset.score) score += parseInt(opt.dataset.score, 10);

    setTimeout(nextStep, 350);
  });
})();

/* Smooth FAQ toggle */
document.querySelectorAll('.faq__item').forEach((item) => {
  const summary = item.querySelector('summary');
  const content = item.querySelector('p');

  if (!summary || !content) return;

  summary.addEventListener('click', (e) => {
    e.preventDefault();
    if (item.open) {
      content.style.maxHeight = content.scrollHeight + 'px';
      requestAnimationFrame(() => {
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        content.style.paddingBottom = '0';
      });
      content.addEventListener('transitionend', () => {
        item.open = false;
        content.style.removeProperty('max-height');
        content.style.removeProperty('opacity');
        content.style.removeProperty('padding-bottom');
      }, { once: true });
    } else {
      item.open = true;
      const h = content.scrollHeight;
      content.style.maxHeight = '0';
      content.style.opacity = '0';
      content.style.paddingBottom = '0';
      requestAnimationFrame(() => {
        content.style.transition = 'max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease, padding-bottom 0.4s ease';
        content.style.maxHeight = h + 'px';
        content.style.opacity = '1';
        content.style.paddingBottom = '';
      });
      content.addEventListener('transitionend', () => {
        content.style.removeProperty('max-height');
        content.style.removeProperty('transition');
        content.style.removeProperty('opacity');
      }, { once: true });
    }
  });
});

/* Lightbox — zoom on click */
(function initLightbox() {
  var overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML = '<button class="lightbox__close" aria-label="Zamknij"></button><img class="lightbox__img" src="" alt="">';
  document.body.appendChild(overlay);

  var lbImg = overlay.querySelector('.lightbox__img');
  var lbClose = overlay.querySelector('.lightbox__close');

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', function(e) {
    if (e.target !== lbImg) close();
  });
  lbClose.addEventListener('click', close);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') close();
  });

  document.querySelectorAll('[data-zoomable] img, img[data-zoomable]').forEach(function(img) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function() {
      open(img.src, img.alt);
    });
  });
})();

/* Blog cards — aria-label "Czytaj więcej" z tytułu posta (a11y: identyczne linki) */
(function labelBlogCardLinks() {
  document.querySelectorAll('.blog-card').forEach(function(card) {
    var link = card.querySelector('.blog-card__link');
    var title = card.querySelector('h2, h3, h4');
    if (link && title && !link.hasAttribute('aria-label')) {
      link.setAttribute('aria-label', 'Czytaj więcej: ' + title.textContent.trim());
    }
  });
})();

/* Contact forms — AJAX submit (FormSubmit) z loading / success / error */
(function initContactForms() {
  var forms = document.querySelectorAll('form[data-contact-form]');
  if (!forms.length) return;

  function showSuccess(form) {
    var wrap = document.createElement('div');
    wrap.className = 'form-success';
    wrap.setAttribute('role', 'status');
    wrap.setAttribute('aria-live', 'polite');
    wrap.innerHTML =
      '<div class="form-success__icon" aria-hidden="true">&#10003;</div>' +
      '<h3>Dziękuję, wiadomość wysłana.</h3>' +
      '<p>Odezwę się do Ciebie w ciągu 24 godzin — zwykle szybciej. Sprawdź też folder <em>Spam</em>, na wszelki wypadek.</p>' +
      '<p class="form-success__actions">' +
        'Wolisz od razu? <a href="tel:+48732137266">Zadzwoń: +48 732 137 266</a> · ' +
        '<a href="https://wa.me/48732137266" target="_blank" rel="noopener">Napisz na WhatsApp</a>' +
      '</p>';
    form.replaceWith(wrap);
    wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function showError(form, btn, originalLabel) {
    var existing = form.querySelector('.form-error');
    if (existing) existing.remove();
    var err = document.createElement('div');
    err.className = 'form-error';
    err.setAttribute('role', 'alert');
    err.innerHTML =
      '<strong>Ups — wiadomość nie dotarła.</strong> ' +
      'Spróbuj ponownie albo skontaktuj się bezpośrednio: ' +
      '<a href="tel:+48732137266">+48 732 137 266</a> lub ' +
      '<a href="https://wa.me/48732137266" target="_blank" rel="noopener">WhatsApp</a>.';
    btn.parentNode.insertBefore(err, btn);
    btn.disabled = false;
    btn.textContent = originalLabel;
  }

  forms.forEach(function(form) {
    var btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    var originalLabel = btn.textContent;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      var honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var prevErr = form.querySelector('.form-error');
      if (prevErr) prevErr.remove();

      btn.disabled = true;
      btn.textContent = 'Wysyłanie…';

      try {
        var fd = new FormData(form);
        var payload = {};
        fd.forEach(function(value, key) { payload[key] = value; });
        var response = await fetch(form.action, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        var data = await response.json().catch(function() { return {}; });
        if (response.ok && (data.success === 'true' || data.success === true)) {
          showSuccess(form);
        } else {
          throw new Error(data.message || 'Submit failed');
        }
      } catch (err) {
        showError(form, btn, originalLabel);
      }
    });
  });
})();

/* Blog category filter — przyciski .blog-tag[data-filter] + karty .blog-card[data-category].
   Bonus: licznik wpisów, aria-pressed, hash URL (np. /pages/blog.html#neuroscience), "Brak wpisów" placeholder. */
(function initBlogFilter() {
  var tags = document.querySelectorAll('.blog-tag[data-filter]');
  var cards = document.querySelectorAll('.blog-card[data-category]');
  if (!tags.length || !cards.length) return;

  var countEl = document.querySelector('[data-filter-count]');
  var grid = cards[0].parentElement;
  var emptyMsg = document.createElement('p');
  emptyMsg.className = 'blog-empty';
  emptyMsg.style.cssText = 'grid-column:1/-1;text-align:center;padding:2rem;color:var(--neutral-500);';
  emptyMsg.textContent = 'Brak wpisów w tej kategorii — kliknij "Wszystkie", żeby je przywrócić.';
  emptyMsg.hidden = true;
  if (grid) grid.appendChild(emptyMsg);

  function apply(filter) {
    var visible = 0;
    cards.forEach(function (card) {
      var match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    tags.forEach(function (t) {
      var active = t.dataset.filter === filter;
      t.classList.toggle('blog-tag--active', active);
      t.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (countEl) countEl.textContent = visible;
    emptyMsg.hidden = visible > 0;
  }

  tags.forEach(function (btn) {
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-pressed', btn.classList.contains('blog-tag--active') ? 'true' : 'false');
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      apply(f);
      var newHash = f === 'all' ? ' ' : '#' + f;
      history.replaceState(null, '', newHash);
    });
  });

  var initialHash = (window.location.hash || '').replace('#', '');
  var initialFilter = Array.prototype.some.call(tags, function (t) { return t.dataset.filter === initialHash; })
    ? initialHash
    : 'all';
  apply(initialFilter);
})();

/* Materials category filter — [data-material-filter] + [data-material-category].
   Prostsza wersja bez hash URL (materiały to landing, nie SEO targety). */
(function initMaterialsFilter() {
  var tags = document.querySelectorAll('[data-material-filter]');
  var cards = document.querySelectorAll('[data-material-category]');
  if (!tags.length || !cards.length) return;

  var countEl = document.querySelector('[data-material-count]');

  function apply(filter) {
    var visible = 0;
    cards.forEach(function (card) {
      var match = filter === 'all' || card.dataset.materialCategory === filter;
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    tags.forEach(function (t) {
      var active = t.dataset.materialFilter === filter;
      t.classList.toggle('blog-tag--active', active);
      t.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (countEl) countEl.textContent = visible;
  }

  tags.forEach(function (btn) {
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-pressed', btn.classList.contains('blog-tag--active') ? 'true' : 'false');
    btn.addEventListener('click', function () {
      apply(btn.dataset.materialFilter);
    });
  });
})();
