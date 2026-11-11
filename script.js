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

document.querySelector('#open-invitation').addEventListener('click', () => {
  document.querySelector('#opening').classList.add('is-hidden');
  document.body.classList.remove('is-locked');
});

const guestName = new URLSearchParams(window.location.search).get('to');
if (guestName) document.querySelector('#guest-name').textContent = guestName;

document.querySelector('#rsvp-form').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#form-message').textContent = 'Terima kasih, konfirmasimu sudah kami terima.';
  event.currentTarget.reset();
});

document.querySelector('#copy-account').addEventListener('click', async () => {
  const accountNumber = '532701025476536';
  const message = document.querySelector('#copy-message');
  try {
    await navigator.clipboard.writeText(accountNumber);
    message.textContent = 'Nomor rekening berhasil disalin.';
  } catch {
    message.textContent = `Nomor rekening: ${accountNumber}`;
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
