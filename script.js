const eventDate = new Date('2026-12-12T00:00:00+07:00').getTime();
const countdown = document.querySelector('#countdown');

function updateCountdown() {
  const distance = Math.max(0, eventDate - Date.now());
  const units = [
    ['Hari', 86400000], ['Jam', 3600000], ['Menit', 60000], ['Detik', 1000],
  ];
  countdown.innerHTML = units.map(([label, size]) => {
    const value = Math.floor(distance / size) % (label === 'Hari' ? Infinity : label === 'Jam' ? 24 : 60);
    return `<div><strong>${String(value).padStart(2, '0')}</strong><span>${label}</span></div>`;
  }).join('');
}

updateCountdown();
setInterval(updateCountdown, 1000);

const music = document.querySelector('#background-music');
const musicToggle = document.querySelector('#music-toggle');
const musicLabel = document.querySelector('#music-label');

async function setMusic(shouldPlay) {
  if (shouldPlay) {
    try {
      await music.play();
      musicToggle.classList.add('is-playing');
      musicToggle.setAttribute('aria-pressed', 'true');
      musicToggle.setAttribute('aria-label', 'Matikan musik');
      musicLabel.textContent = 'Musik on';
    } catch {
      musicLabel.textContent = 'Musik tidak tersedia';
    }
    return;
  }
  music.pause();
  musicToggle.classList.remove('is-playing');
  musicToggle.setAttribute('aria-pressed', 'false');
  musicToggle.setAttribute('aria-label', 'Nyalakan musik');
  musicLabel.textContent = 'Musik off';
}

musicToggle.addEventListener('click', () => setMusic(music.paused));

document.querySelector('#open-invitation').addEventListener('click', () => {
  document.querySelector('#opening').classList.add('is-hidden');
  document.body.classList.remove('is-locked');
  setMusic(true);
});

const guestName = new URLSearchParams(window.location.search).get('to');
if (guestName) document.querySelector('#guest-name').textContent = guestName;

const revealTargets = [
  '.quote p', '.quote small', '.person', '.countdown-section > *',
  '.event-card', '.map-embed', '.events > .button', '.gift > p:not(.eyebrow)',
  '.gift-card', '.gallery > h2', '.gallery-grid', '.rsvp > *',
  '.vendor-cta__content', 'footer > *',
];

const revealElements = document.querySelectorAll(revealTargets.join(','));
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('has-scroll-animation');
  revealElements.forEach((element, index) => {
    element.classList.add('reveal');
    if (index % 4) element.classList.add(`reveal--delay-${index % 4}`);
  });
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px' });
  revealElements.forEach((element) => observer.observe(element));
}

document.querySelector('#rsvp-form').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#form-message').textContent = 'Terima kasih, konfirmasimu sudah kami terima.';
  event.currentTarget.reset();
});

document.querySelector('#copy-account').addEventListener('click', async () => {
  const accountNumber = '532701025476536';
  const message = document.querySelector('#copy-message');
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(accountNumber);
    } else {
      const helper = document.createElement('textarea');
      helper.value = accountNumber;
      helper.setAttribute('readonly', '');
      helper.style.cssText = 'position:fixed;opacity:0';
      document.body.append(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
    }
    message.textContent = 'Nomor rekening berhasil disalin.';
  } catch {
    message.textContent = `Salin manual: ${accountNumber}`;
  }
});

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const closeLightbox = document.querySelector('#close-lightbox');

function closePhoto() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-locked');
}

document.querySelectorAll('.gallery-item img').forEach((image) => {
  const item = image.parentElement;
  item.tabIndex = 0;
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', 'Buka foto galeri');
  const openPhoto = () => {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    closeLightbox.focus();
  };
  item.addEventListener('click', openPhoto);
  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPhoto();
    }
  });
});

closeLightbox.addEventListener('click', closePhoto);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closePhoto();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.classList.contains('is-open')) closePhoto();
});
