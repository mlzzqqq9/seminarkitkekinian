/* =========================================================
   SERVIS RAPI — SCRIPT
   Semua interaksi murni sisi klien, tanpa dependensi.
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. NOMOR WHATSAPP TOKO — ganti sekali di sini,
        dipakai ulang oleh form pemesanan.
     --------------------------------------------------------- */
  const NOMOR_WHATSAPP = '6281234567890'; // format internasional tanpa "+"

  /* ---------------------------------------------------------
     2. HEADER: bayangan saat discroll + menu mobile
     --------------------------------------------------------- */
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  const onScrollHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------
     3. SCROLLSPY: menandai menu aktif sesuai posisi scroll
     --------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(section => spyObserver.observe(section));

  /* ---------------------------------------------------------
     4. REVEAL ON SCROLL
     --------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => revealObserver.observe(el));
  }

  /* ---------------------------------------------------------
     5. TESTIMONIAL CAROUSEL
     --------------------------------------------------------- */
  const track = document.getElementById('testimonial-track');
  const dotsWrap = document.getElementById('testimonial-dots');

  if (track && dotsWrap) {
    const slides = Array.from(track.querySelectorAll('.testimonial'));
    let current = 0;
    let autoplayTimer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Lihat testimoni ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goToSlide(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }

    goToSlide(0);

    function startAutoplay() {
      if (prefersReducedMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(() => goToSlide(current + 1), 6000);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }

    startAutoplay();
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
  }

  /* ---------------------------------------------------------
     6. GALERI LIGHTBOX
     --------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  function openLightbox(item) {
    const img = item.querySelector('img');
    const caption = item.getAttribute('data-caption') || '';
    if (item.classList.contains('img-missing')) return; // tidak ada gambar asli untuk ditampilkan
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption;
    lightbox.hidden = false;
    lightboxClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
  });

  /* ---------------------------------------------------------
     7. FORM PEMESANAN -> KIRIM KE WHATSAPP
     --------------------------------------------------------- */
  const orderForm = document.getElementById('order-form');

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nama = document.getElementById('nama').value.trim();
      const layanan = document.getElementById('layanan-pilihan').value;
      const pesan = document.getElementById('pesan').value.trim();

      if (!nama || !layanan || !pesan) return;

      const teksPesan =
        `Halo Servis Rapi, saya ${nama}.\n` +
        `Saya ingin servis: ${layanan}.\n` +
        `Deskripsi: ${pesan}`;

      const urlWhatsapp = `https://wa.me/${NOMOR_WHATSAPP}?text=${encodeURIComponent(teksPesan)}`;
      window.open(urlWhatsapp, '_blank', 'noopener');
    });
  }

  /* ---------------------------------------------------------
     8. TOMBOL KEMBALI KE ATAS
     --------------------------------------------------------- */
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 480);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     9. TAHUN OTOMATIS DI FOOTER
     --------------------------------------------------------- */
  const tahunEl = document.getElementById('tahun-sekarang');
  if (tahunEl) tahunEl.textContent = new Date().getFullYear();

});
