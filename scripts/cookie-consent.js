/* Cookie consent banner + lazy Meta Pixel loader (RODO/ePrivacy compliant)
   Meta Pixel ładuje się WYŁĄCZNIE po wyraźnej akceptacji statystycznych cookies. */

(function () {
  var STORAGE_KEY = 'cookieConsent_v1';
  var META_PIXEL_ID = '2987515661448502';

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
  // Użycie: window.bochenekTrack('Lead', { content_name: 'darmowa-konsultacja' });
  window.bochenekTrack = function (eventName, params) {
    if (window.fbq) window.fbq('track', eventName, params || {});
  };

  function injectStyles() {
    if (document.getElementById('cookie-consent-styles')) return;
    var s = document.createElement('style');
    s.id = 'cookie-consent-styles';
    s.textContent = [
      '.cc-banner{position:fixed;left:16px;right:16px;bottom:16px;max-width:560px;margin:0 auto;background:#fffdf9;color:#1B3A2F;border:1px solid rgba(139,115,85,0.3);border-radius:12px;box-shadow:0 12px 32px rgba(45,59,45,0.18);padding:18px 20px;font-family:"Work Sans","Figtree",system-ui,sans-serif;font-size:14px;line-height:1.5;z-index:99999;animation:ccFadeIn .4s ease}',
      '@keyframes ccFadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}',
      '.cc-banner__title{font-weight:600;margin:0 0 6px;font-size:15px;color:#1B3A2F}',
      '.cc-banner__text{margin:0 0 12px;color:#4a4a3e}',
      '.cc-banner__text a{color:#8b7355;text-decoration:underline}',
      '.cc-banner__buttons{display:flex;gap:8px;flex-wrap:wrap}',
      '.cc-banner__btn{flex:1;min-width:120px;padding:9px 14px;border-radius:8px;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:opacity .2s,transform .1s}',
      '.cc-banner__btn:hover{opacity:.88}',
      '.cc-banner__btn:active{transform:scale(.98)}',
      '.cc-banner__btn--accept{background:#1B3A2F;color:#fffdf9}',
      '.cc-banner__btn--reject{background:transparent;color:#5c5c5c;border:1px solid rgba(92,92,92,0.3)}',
      '@media(max-width:480px){.cc-banner{left:8px;right:8px;bottom:8px;padding:14px 16px}.cc-banner__btn{font-size:12.5px}}'
    ].join('');
    document.head.appendChild(s);
  }

  function showBanner() {
    injectStyles();
    var banner = document.createElement('div');
    banner.className = 'cc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Zgoda na cookies');
    banner.innerHTML =
      '<p class="cc-banner__title">Cookies i prywatność</p>' +
      '<p class="cc-banner__text">Używam cookies niezbędnych do działania strony oraz, za Twoją zgodą, statystycznych (Meta Pixel) do analizy ruchu. ' +
      'Twoje dane są chronione zgodnie z <a href="/pages/polityka-prywatnosci.html">polityką prywatności</a>.</p>' +
      '<div class="cc-banner__buttons">' +
        '<button class="cc-banner__btn cc-banner__btn--accept" type="button" data-cc="accept">Akceptuję wszystkie</button>' +
        '<button class="cc-banner__btn cc-banner__btn--reject" type="button" data-cc="reject">Tylko niezbędne</button>' +
      '</div>';
    document.body.appendChild(banner);

    banner.addEventListener('click', function (e) {
      var action = e.target && e.target.getAttribute && e.target.getAttribute('data-cc');
      if (!action) return;
      if (action === 'accept') {
        setConsent('accepted');
        loadMetaPixel();
      } else {
        setConsent('rejected');
      }
      banner.remove();
    });
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
    if (document.body) {
      showBanner();
    } else {
      document.addEventListener('DOMContentLoaded', showBanner);
    }
  }

  init();
})();
