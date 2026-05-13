/* Cookie consent banner + lazy Meta Pixel loader (RODO/ePrivacy compliant)
   v2 - Modal centralny + maximum acceptance + brand voice Bochenka
   Meta Pixel ładuje się WYŁĄCZNIE po wyraźnej akceptacji statystycznych cookies. */

(function () {
  var STORAGE_KEY = 'cookieConsent_v1';
  var META_PIXEL_ID = '2987515661448502';
  var SHOW_DELAY_MS = 800; // strona się załaduje, klient widzi że działa

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); }
    catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); }
    catch (e) { /* ignore */ }
  }

  function loadMetaPixel() {
    if (window._metaPixelLoaded) return;
    window._metaPixelLoaded = true;

    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  // Public helper: silent no-op gdy brak zgody, w przeciwnym razie tracking.
  window.bochenekTrack = function (eventName, params) {
    if (window.fbq) window.fbq('track', eventName, params || {});
  };

  function injectStyles() {
    if (document.getElementById('cookie-consent-styles')) return;
    var s = document.createElement('style');
    s.id = 'cookie-consent-styles';
    s.textContent = [
      // Overlay - przyciemnione tło
      '.cc-overlay{position:fixed;inset:0;background:rgba(20,28,25,0.55);backdrop-filter:blur(4px);z-index:99998;opacity:0;transition:opacity .35s ease;display:flex;align-items:center;justify-content:center;padding:20px}',
      '.cc-overlay.cc-overlay--visible{opacity:1}',

      // Modal - centralny
      '.cc-modal{position:relative;max-width:480px;width:100%;background:#fffdf9;color:#1B3A2F;border-radius:16px;box-shadow:0 24px 60px rgba(20,28,25,0.35),0 8px 24px rgba(20,28,25,0.15);padding:28px 28px 24px;font-family:"Work Sans","Figtree",system-ui,sans-serif;font-size:14.5px;line-height:1.55;transform:scale(.92) translateY(8px);opacity:0;transition:transform .4s cubic-bezier(.16,1,.3,1),opacity .35s ease;z-index:99999}',
      '.cc-overlay--visible .cc-modal{transform:scale(1) translateY(0);opacity:1}',

      // Ikona brand
      '.cc-modal__icon{width:48px;height:48px;background:linear-gradient(135deg,#1B3A2F 0%,#2d5544 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fffdf9;font-weight:700;font-size:18px;letter-spacing:.5px;margin:0 auto 16px;box-shadow:0 4px 12px rgba(27,58,47,0.25)}',

      // Tytuł
      '.cc-modal__title{font-weight:600;margin:0 0 10px;font-size:18px;color:#1B3A2F;text-align:center;line-height:1.35}',

      // Tekst
      '.cc-modal__text{margin:0 0 20px;color:#3d4a42;text-align:center;font-size:14px;line-height:1.6}',
      '.cc-modal__text strong{color:#1B3A2F;font-weight:600}',
      '.cc-modal__text a{color:#8b7355;text-decoration:underline;text-underline-offset:2px}',
      '.cc-modal__text a:hover{color:#6d5a42}',

      // Przyciski
      '.cc-modal__buttons{display:flex;gap:10px;flex-direction:column}',
      '.cc-modal__btn{display:block;width:100%;padding:13px 18px;border-radius:10px;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;border:none;transition:transform .15s ease,box-shadow .2s ease,background .2s ease;text-align:center}',
      '.cc-modal__btn:active{transform:scale(.98)}',

      '.cc-modal__btn--accept{background:#1B3A2F;color:#fffdf9;box-shadow:0 4px 14px rgba(27,58,47,0.3)}',
      '.cc-modal__btn--accept:hover{background:#234c3d;box-shadow:0 6px 18px rgba(27,58,47,0.4)}',

      '.cc-modal__btn--reject{background:transparent;color:#5c5c5c;border:1.5px solid rgba(92,92,92,0.25);font-weight:500}',
      '.cc-modal__btn--reject:hover{background:rgba(92,92,92,0.06);border-color:rgba(92,92,92,0.4);color:#3d3d3d}',

      // Footer info
      '.cc-modal__footer{margin-top:14px;font-size:12px;text-align:center;color:#7a7a6e;line-height:1.5}',
      '.cc-modal__footer a{color:#8b7355;text-decoration:underline;text-underline-offset:2px}',

      // Mobile
      '@media(max-width:480px){.cc-modal{padding:24px 20px 20px;border-radius:14px}.cc-modal__title{font-size:17px}.cc-modal__text{font-size:14px}.cc-modal__btn{padding:12px 16px;font-size:14px}}',

      // Body lock - zapobiega scrollowaniu strony pod overlay
      'body.cc-locked{overflow:hidden}'
    ].join('');
    document.head.appendChild(s);
  }

  function showBanner() {
    injectStyles();

    var overlay = document.createElement('div');
    overlay.className = 'cc-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'cc-modal-title');
    overlay.setAttribute('aria-describedby', 'cc-modal-text');

    overlay.innerHTML =
      '<div class="cc-modal">' +
        '<div class="cc-modal__icon" aria-hidden="true">TB</div>' +
        '<h2 class="cc-modal__title" id="cc-modal-title">Krótka prośba o&nbsp;zgodę</h2>' +
        '<p class="cc-modal__text" id="cc-modal-text">' +
          'Używam plików cookies żeby strona działała dobrze i&nbsp;żebym mógł <strong>docierać z&nbsp;hipnoterapią do&nbsp;osób, które jej potrzebują</strong>. ' +
          'Twoja zgoda pomaga mi pokazać tę pracę tym, dla których może być najbardziej pomocna. ' +
          '<strong>Twój wybór szanuję</strong> — możesz wybrać tylko niezbędne, a&nbsp;strona dalej działa normalnie.' +
        '</p>' +
        '<div class="cc-modal__buttons">' +
          '<button class="cc-modal__btn cc-modal__btn--accept" type="button" data-cc="accept" autofocus>Tak, zgadzam się</button>' +
          '<button class="cc-modal__btn cc-modal__btn--reject" type="button" data-cc="reject">Tylko niezbędne</button>' +
        '</div>' +
        '<p class="cc-modal__footer">' +
          'Szczegóły: <a href="/pages/polityka-prywatnosci.html">polityka prywatności</a>. ' +
          'Twoje dane są chronione zgodnie z&nbsp;RODO.' +
        '</p>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.classList.add('cc-locked');

    // Animacja wejścia - delay 1 frame żeby CSS transition zadziałał
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add('cc-overlay--visible');
      });
    });

    function closeModal(action) {
      if (action === 'accept') {
        setConsent('accepted');
        loadMetaPixel();
      } else {
        setConsent('rejected');
      }
      overlay.classList.remove('cc-overlay--visible');
      document.body.classList.remove('cc-locked');
      setTimeout(function () { overlay.remove(); }, 350);
    }

    overlay.addEventListener('click', function (e) {
      var action = e.target && e.target.getAttribute && e.target.getAttribute('data-cc');
      if (action) closeModal(action);
      // klik w overlay (poza modal) NIE zamyka - klient musi świadomie wybrać (RODO)
    });

    // ESC NIE zamyka modal-a (klient musi świadomie wybrać - RODO compliance)
    // Jeśli chcesz pozwolić ESC = "Tylko niezbędne", odkomentuj:
    // document.addEventListener('keydown', function escHandler(e) {
    //   if (e.key === 'Escape') { closeModal('reject'); document.removeEventListener('keydown', escHandler); }
    // });
  }

  function init() {
    var consent = getConsent();
    if (consent === 'accepted') {
      loadMetaPixel();
      return;
    }
    if (consent === 'rejected') {
      return;
    }

    function delayedShow() {
      setTimeout(showBanner, SHOW_DELAY_MS);
    }

    if (document.body) {
      delayedShow();
    } else {
      document.addEventListener('DOMContentLoaded', delayedShow);
    }
  }

  init();
})();
