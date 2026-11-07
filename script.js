const eventDate = new Date('2026-12-20T09:00:00+07:00').getTime();
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
});

const guestName = new URLSearchParams(window.location.search).get('to');
if (guestName) document.querySelector('#guest-name').textContent = guestName;

document.querySelector('#rsvp-form').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#form-message').textContent = 'Terima kasih, konfirmasimu sudah kami terima.';
  event.currentTarget.reset();
});
