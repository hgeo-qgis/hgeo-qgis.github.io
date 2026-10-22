const filters = document.querySelectorAll('[data-filter]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelectorAll('.gallery figure').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
  });
}));
const lightbox = document.querySelector('#lightbox');
const picture = document.querySelector('#large-image');
let opener;
document.querySelectorAll('.image-open').forEach(button => button.addEventListener('click', () => {
  opener = button;
  picture.src = button.dataset.image;
  picture.alt = button.dataset.caption;
  document.querySelector('#image-caption').textContent = button.dataset.caption;
  lightbox.showModal();
  document.body.classList.add('modal-open');
}));
document.querySelector('#close-lightbox').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  if (opener) opener.focus();
});

const downloadCounter = document.querySelector('[data-download-count]');
if (downloadCounter) {
  const english = document.documentElement.lang.startsWith('en');
  fetch('https://api.github.com/repos/haradaeros-hub/hgeo/releases/assets/666968032?t=' + Date.now(), {
    cache: 'no-store',
    headers: { Accept: 'application/vnd.github+json' },
    signal: AbortSignal.timeout(10000)
  }).then(response => {
    if (!response.ok) throw new Error('GitHub ' + response.status);
    return response.json();
  }).then(asset => {
    if (!Number.isSafeInteger(asset.download_count) || asset.download_count < 0) throw new Error('Invalid count');
    downloadCounter.textContent = 'Downloads: ' + asset.download_count.toLocaleString(english ? 'en' : 'pt-BR');
    downloadCounter.title = english ? 'Downloads recorded by GitHub. Updates may be delayed.' : 'Downloads registrados pelo GitHub. A atualização pode levar alguns minutos.';
  }).catch(() => {
    downloadCounter.textContent = english ? 'Download statistics are unavailable. You can still download the plugin.' : 'Estatística indisponível no momento. O download continua disponível.';
  });
}
