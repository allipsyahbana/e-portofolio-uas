/* ============ E-PORTOFOLIO ALLIP — main.js ============ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Navbar: shadow saat scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Toggle menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.setAttribute(
        'aria-expanded',
        navLinks.classList.contains('open')
      );
    });
    // Tutup menu saat link diklik (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* ---------- 3. Tab Analisis Siklus ---------- */
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.siklus-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) {
        panel.classList
                panel.classList.add('active');
        // Scroll halus ke awal panel (opsional)
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- 4. Modal PDF Viewer ---------- */
  const modal = document.getElementById('pdfModal');
  const modalTitle = document.getElementById('modalTitle');
  const pdfFrame = document.getElementById('pdfFrame');
  const pdfFallback = document.getElementById('pdfFallback');
  const pdfFallbackLink = document.getElementById('pdfFallbackLink');
  const modalDownload = document.getElementById('modalDownload');
  const closers = modal ? modal.querySelectorAll('[data-close]') : [];

  function openModal(pdfUrl, title) {
    if (!modal) return;
    modalTitle.textContent = title || 'Dokumen';
    modalDownload.href = pdfUrl;
    modalDownload.setAttribute('download', '');
    pdfFallbackLink.href = pdfUrl;
    pdfFallback.classList.remove('show');

    // Set src iframe; deteksi gagal muat
    pdfFrame.src = pdfUrl;
    pdfFrame.onload = () => {
      // iframe onload tetap terpanggil walau PDF gagal, jadi timer fallback:
      setTimeout(() => {
        try {
          // Jika iframe tidak punya contentWindow/pdfviewer, tetap tampilkan fallback
          // (browser modern menampilkan PDF native, jadi cukup biarkan)
        } catch (e) {
          pdfFallback.classList.add('show');
        }
      }, 1200);
    };
    pdfFrame.onerror = () => pdfFallback.classList.add('show');

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    pdfFrame.src = 'about:blank';
    document.body.style.overflow = '';
  }

  // Pasang event pada kartu dokumen
  document.querySelectorAll('.dokumen-card').forEach(card => {
    card.addEventListener('click', () => {
      const url = card.dataset.pdf;
      const title = card.dataset.title || 'Dokumen';
      if (url) openModal(url, title);
    });
  });

  closers.forEach(el => el.addEventListener('click', closeModal));

  // Tutup dengan tombol Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  /* ---------- 5. Tahun otomatis di footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 6. Animasi reveal sederhana saat scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.content-block, .analisis-card, .dokumen-card, .institusi-media'
  );
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

});
  /* ---------- 7. Lightbox Galeri Dokumentasi ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGallery = [];
  let currentIndex = 0;

  function showLightbox(index) {
    if (!currentGallery.length) return;
    currentIndex = (index + currentGallery.length) % currentGallery.length;
    const item = currentGallery[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.caption || 'Dokumentasi';
    lightboxCaption.textContent = item.caption || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  // Pasang event pada setiap galeri-item
  document.querySelectorAll('.galeri-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      // Kumpulkan semua foto dalam panel yang sama
      const panel = item.closest('.siklus-panel');
      currentGallery = Array.from(
        panel.querySelectorAll('.galeri-item')
      ).map(el => ({
        src: el.dataset.src,
        caption: el.dataset.caption || ''
      }));
      const clickedSrc = item.dataset.src;
      const idx = currentGallery.findIndex(g => g.src === clickedSrc);
      showLightbox(idx >= 0 ? idx : 0);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightbox(currentIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => showLightbox(currentIndex + 1));

  // Klik area gelap untuk menutup
  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Navigasi keyboard: Escape, panah kiri/kanan
  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(currentIndex + 1);
  });