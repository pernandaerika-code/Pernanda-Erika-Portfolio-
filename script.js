const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

const menu = document.getElementById('menu');
const nav = document.getElementById('siteNav');
const links = nav.querySelectorAll('a');

menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  document.body.classList.toggle('menu-open', open);
  menu.textContent = open ? '×' : '☰';
});

links.forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
  menu.textContent = '☰';
}));

// Scroll reveal animations
const revealTargets = document.querySelectorAll('section, .section-head, .story-grid, .project-list article, .exhibition, footer');
revealTargets.forEach((el, i) => {
  if (!el.classList.contains('hero')) el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('reveal-right');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Reading progress bar
const progress = document.getElementById('scrollProgress');
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Subtle desktop cursor interaction
const glow = document.getElementById('cursorGlow');
if (glow && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => glow.style.opacity = '0');
}

// Active section in navigation
const sections = [...document.querySelectorAll('main section[id]')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

// Artwork lightbox with keyboard navigation
const figures = [...document.querySelectorAll('#artGrid figure')];
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeButton = document.getElementById('lightboxClose');
const prevButton = document.getElementById('lightboxPrev');
const nextButton = document.getElementById('lightboxNext');
let currentArtwork = 0;

function showArtwork(index) {
  currentArtwork = (index + figures.length) % figures.length;
  const figure = figures[currentArtwork];
  const image = figure.querySelector('img');
  const title = figure.querySelector('b')?.textContent || '';
  const type = figure.querySelector('span')?.textContent || '';
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = type ? `${title} · ${type}` : title;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu-open');
}
function closeArtwork() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}
figures.forEach((figure, index) => figure.addEventListener('click', () => showArtwork(index)));
closeButton.addEventListener('click', closeArtwork);
prevButton.addEventListener('click', () => showArtwork(currentArtwork - 1));
nextButton.addEventListener('click', () => showArtwork(currentArtwork + 1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeArtwork(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeArtwork();
  if (e.key === 'ArrowLeft') showArtwork(currentArtwork - 1);
  if (e.key === 'ArrowRight') showArtwork(currentArtwork + 1);
});
