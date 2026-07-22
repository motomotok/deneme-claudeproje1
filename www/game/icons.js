// Oyunun kendi çizgi-ikon seti — sistem emojisi (Noto Color Emoji) yerine
// tutarlı, tema rengini miras alan (currentColor) SVG piktogramlar. Her
// anahtar tek bir kavramı temsil eder; ICON_SVG[key] doğrudan innerHTML'e
// yazılabilir bir <svg> string'idir. hydrateIcons() sayfadaki
// [data-icon="key"] placeholder'larını bu SVG'lerle doldurur.
const ICON_SVG = {
  coin: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ffb454"/><circle cx="12" cy="12" r="6.2" fill="#c47a1f"/><circle cx="12" cy="12" r="2.8" fill="#ffe3a8"/></svg>',

  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 5H4v1a3 3 0 0 0 3 3"/><path d="M17 5h3v1a3 3 0 0 1-3 3"/><path d="M12 13v3"/><path d="M9 20h6"/><path d="M10 16h4l.5 4h-5l.5-4Z"/></svg>',

  ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4V9Z"/><path d="M14 7v10" stroke-dasharray="2 2.5"/></svg>',

  gem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M6 3h12l3 5-9 13L3 8l3-5Z"/><path d="M3 8h18M9 3l-2 5 5 13 5-13-2-5"/></svg>',

  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 5-3.2 8.5-7 10-3.8-1.5-7-5-7-10V6l7-3Z"/></svg>',

  magnet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21V11a4 4 0 0 1 8 0v10"/><path d="M8 21H4M8 17H4M16 21h4M16 17h4"/></svg>',

  hourglass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12M6 21h12M7 3c0 5 4 6.5 5 8-1 1.5-5 3-5 8M17 3c0 5-4 6.5-5 8 1 1.5 5 3 5 8"/></svg>',

  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',

  ghost: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20V11a7 7 0 0 1 14 0v9l-2.5-2-2 2-2.5-2-2 2-2.5-2L5 20Z"/><circle cx="9.5" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="10.5" r="1" fill="currentColor" stroke="none"/></svg>',

  heart: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 20s-7-4.35-9.5-9C.8 7.2 3 3.5 6.5 3.5c2 0 3.4 1.1 4 2.2.6-1.1 2-2.2 4-2.2 3.5 0 5.7 3.7 4 7.5-2.5 4.65-9.5 9-9.5 9Z"/></svg>',

  star: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.5l2.9 6 6.6.7-4.9 4.6 1.3 6.5L12 17l-5.9 3.3L7.4 13.8 2.5 9.2l6.6-.7L12 2.5Z"/></svg>',

  check: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" opacity=".18"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M7 12.5l3 3 7-7"/></svg>',

  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',

  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg>',

  flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 1.5-4.5C9 9 10 10 10 10c-.3-3 1-5 2-8Z"/></svg>',

  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 9h16M8 3v3M16 3v3"/><circle cx="12" cy="14" r="1.6" fill="currentColor" stroke="none"/></svg>',

  moon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M15 3a9 9 0 1 0 6 15.9A9 9 0 0 1 15 3Z"/></svg>',

  rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c3 1 5.5 4 5.5 8 0 2-.5 3.5-1.5 5l-1 3-2-1.5-2 1.5-1-3c-1-1.5-1.5-3-1.5-5 0-4 2.5-7 5.5-8Z"/><circle cx="12" cy="9" r="1.6"/><path d="M8.5 14.5 6 17M15.5 14.5 18 17"/></svg>',

  play: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 4l13 8-13 8V4Z"/></svg>',

  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-8 7 8 7"/></svg>',

  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.2 11h10.6L20 8H6.2"/><circle cx="9.5" cy="19" r="1.4" fill="currentColor" stroke="none"/><circle cx="16.5" cy="19" r="1.4" fill="currentColor" stroke="none"/></svg>',

  medal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="6"/><path d="M9 8.5 6 3h3l3 5.5M15 8.5 18 3h-3l-3 5.5"/><path d="M12 11v5"/></svg>',

  flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4"/><path d="M6 5h11l-2.5 3L17 11H6"/></svg>',

  scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v17M8 20h8"/><path d="M4 7l4-1.5L12 7M20 7l-4-1.5L12 7"/><path d="M4 7l-2 5a3 3 0 0 0 6 0l-2-5H4ZM20 7l2 5a3 3 0 0 1-6 0l2-5h2Z"/></svg>',

  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l4 4v14H7V3Z"/><path d="M14 3v4h4"/><path d="M9.5 12h5M9.5 15h5M9.5 9h2.5"/></svg>',

  clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="17" rx="2"/><rect x="9" y="2.5" width="6" height="3" rx="1"/><path d="M9 11h6M9 14h6M9 17h4"/></svg>',

  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="18" cy="5" r="2.4"/><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="19" r="2.4"/><path d="M8.2 10.8 15.8 6.2M8.2 13.2l7.6 4.6"/></svg>',

  filmreel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3.4"/><circle cx="6" cy="8" r=".8" fill="currentColor" stroke="none"/><circle cx="6" cy="16" r=".8" fill="currentColor" stroke="none"/><circle cx="18" cy="8" r=".8" fill="currentColor" stroke="none"/><circle cx="18" cy="16" r=".8" fill="currentColor" stroke="none"/></svg>',

  tv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 21h8M9 3l3 3 3-3"/></svg>',

  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16v11H4zM2 9h20v4H2z"/><path d="M12 9v11"/><path d="M12 9c-1-3-4-4-5-2s1 2 5 2ZM12 9c1-3 4-4 5-2s-1 2-5 2Z"/></svg>',

  palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.8 2-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8Z"/><circle cx="7.5" cy="10.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="9.5" cy="7" r="1.1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="7" r="1.1" fill="currentColor" stroke="none"/></svg>',

  orbit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="9"/></svg>',

  clover: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 12c0-3-3-4-3-6a3 3 0 1 1 6 0c0 2-3 3-3 6Zm0 0c3 0 4-3 6-3a3 3 0 1 1 0 6c-2 0-3-3-6-3Zm0 0c0 3 3 4 3 6a3 3 0 1 1-6 0c0-2 3-3 3-6Zm0 0c-3 0-4 3-6 3a3 3 0 1 1 0-6c2 0 3 3 6 3Z"/><path d="M12 12v6"/></svg>',

  sparkle: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3l1.2 6.8L20 11l-6.8 1.2L12 19l-1.2-6.8L4 11l6.8-1.2L12 3Z"/></svg>',

  lightning: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 2 4 14h6l-1 8 9-13h-6l1-7Z"/></svg>',

  gamepad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8v3M5.5 9.5h3"/><circle cx="15.5" cy="7.5" r=".9" fill="currentColor" stroke="none"/><circle cx="17.5" cy="9.5" r=".9" fill="currentColor" stroke="none"/><path d="M6.5 8h11a4 4 0 0 1 4 4.5l-.7 3a2.5 2.5 0 0 1-4.3 1.3L14.5 15h-5l-1.9 1.8a2.5 2.5 0 0 1-4.3-1.3l-.7-3A4 4 0 0 1 6.5 8Z"/></svg>',

  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l5-5 4 4 8-9"/><path d="M15 7h5v5"/></svg>',

  replay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 1 2.6 5.9"/><path d="M4 17v-4h4"/></svg>',

  cross: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',

  pause: '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/></svg>',
};

function iconMarkup(key){ return ICON_SVG[key] || ''; }
// Dinamik (JS ile üretilen) HTML içine gömmek için kısayol — hydrateIcons()
// sadece sayfa yüklenirken bir kez çalıştığından, boot sonrası eklenen
// her yeni içerik (toast, kart, çip) ikon markup'ını doğrudan bu fonksiyonla almalı.
function icon(key){ return '<i class="gicon">'+iconMarkup(key)+'</i>'; }

function hydrateIcons(root){
  (root||document).querySelectorAll('[data-icon]').forEach(el=>{
    el.innerHTML = iconMarkup(el.dataset.icon);
  });
}
