/*
 * Hover animacije: kada korisnik hovera nad odabranom slikom,
 * preko slike se prikaže i pokrene odgovarajuća Lottie animacija.
 * Kada makne miša, animacija se sakrije i slika se vidi kao prije.
 * Overlay je sakriven u @media print, pa Paged.js/PDF izvoz ostaje nepromijenjen.
 */
(function () {
  const ANIM_MAP = [
    { match: 'fotopolimerizacija.svg',    key: 'UV_drying' },
    { match: 'dijagram-sastav-Tboje.svg', key: 'dijagram_sastava_boje' },
    { match: 'Trapping.png',              key: 'ink_trapping' },
    { match: 'shema_web_to_prin2t.svg',   key: 'web-to-print' },
  ];

  const findEntry = (src) => {
    if (!src) return null;
    return ANIM_MAP.find((m) => src.indexOf(m.match) !== -1) || null;
  };

  const processed = new WeakSet();

  const positionOverlay = (overlay, img) => {
    const anchor = overlay.parentElement;
    if (!anchor) return;
    const anchorRect = anchor.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    overlay.style.left = (imgRect.left - anchorRect.left) + 'px';
    overlay.style.top = (imgRect.top - anchorRect.top) + 'px';
    overlay.style.width = imgRect.width + 'px';
    overlay.style.height = imgRect.height + 'px';
  };

  const attach = (img, entry) => {
    if (processed.has(img)) return;
    const figure = img.closest('figure');
    const anchor = figure || img.parentElement;
    if (!anchor) return;
    processed.add(img);

    if (getComputedStyle(anchor).position === 'static') {
      anchor.style.position = 'relative';
    }

    const overlay = document.createElement('div');
    overlay.className = 'lottie-overlay';
    anchor.appendChild(overlay);

    const reposition = () => positionOverlay(overlay, img);
    reposition();
    if (!img.complete) img.addEventListener('load', reposition, { once: true });
    window.addEventListener('resize', reposition);

    let anim = null;
    const ensureLoaded = () => {
      if (anim || !window.lottie) return;
      const data = window.__lottieData && window.__lottieData[entry.key];
      if (!data) {
        console.warn('[animations] Nema podataka za', entry.key);
        return;
      }
      anim = window.lottie.loadAnimation({
        container: overlay,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData: data,
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
      });
      anim.addEventListener('DOMLoaded', reposition);
    };
    // Preload odmah da prvi hover nema latencije
    ensureLoaded();

    const show = () => {
      reposition();
      ensureLoaded();
      overlay.classList.add('is-visible');
      if (anim) anim.goToAndPlay(0, true);
    };
    const hide = () => {
      overlay.classList.remove('is-visible');
      if (anim) anim.stop();
    };

    img.addEventListener('mouseenter', show);
    img.addEventListener('mouseleave', hide);
  };

  const scan = (root) => {
    const scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('img').forEach((img) => {
      const entry = findEntry(img.getAttribute('src'));
      if (entry) attach(img, entry);
    });
  };

  const init = () => {
    if (window.PagedPolyfill && typeof window.PagedPolyfill.on === 'function') {
      window.PagedPolyfill.on('rendered', () => scan(document));
    }

    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (n.tagName === 'IMG') {
            const entry = findEntry(n.getAttribute('src'));
            if (entry) attach(n, entry);
          } else {
            scan(n);
          }
        });
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });

    scan(document);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
