(() => {
  const root = document.querySelector('[data-carousel="banners"]');
  if (!root) return;

  if (root.dataset.carouselInitialized === '1') return;
  root.dataset.carouselInitialized = '1';

  const intervalMs = Number(root.dataset.interval || 5000);
  const items = Array.from(root.querySelectorAll('.banners .item'));
  const bullets = Array.from(root.querySelectorAll('.nav-bullets [data-bullet]'));
  const prevBtn = root.querySelector('[data-carousel-prev]');
  const nextBtn = root.querySelector('[data-carousel-next]');

  if (!items.length) return;

  let index = 0;
  let timer = null;

  const setActive = (newIndex) => {
    index = (newIndex + items.length) % items.length;

    items.forEach((el, i) => {
      const active = i === index;

      el.classList.toggle('active', active);
      el.setAttribute('aria-hidden', active ? 'false' : 'true');

      if(!active) {
        jQuery(el).hide();
      } else {
        jQuery(el).fadeIn();
      }

      const video = el.querySelector('video');
      if (video) {
        if (active) {
          requestAnimationFrame(() => {
            try { video.currentTime = 0; } catch (_) {}
            const p = video.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
          });
        } else {
          video.pause();
        }
      }
    });

    bullets.forEach((b, i) => b.classList.toggle('active', i === index));
  };

  const next = () => setActive(index + 1);
  const prev = () => setActive(index - 1);

  const stop = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  const schedule = () => {
    stop();
    timer = setTimeout(() => {
      next();
      schedule();
    }, intervalMs);
  };

  const restart = () => {
    schedule();
  };

  prevBtn?.addEventListener('click', () => {
    prev();
    restart();
  });

  nextBtn?.addEventListener('click', () => {
    next();
    restart();
  });

  bullets.forEach((b, i) => {
    b.addEventListener('click', () => {
      setActive(i);
      restart();
    });

    b.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActive(i);
        restart();
      }
    });
  });

  let pointerDown = false;
  let startX = 0;
  let startY = 0;
  let dx = 0;
  let dy = 0;
  const threshold = 40;

  const onPointerDown = (e) => {
    pointerDown = true;
    startX = e.clientX;
    startY = e.clientY;
    dx = 0;
    dy = 0;
    stop();
  };

  const onPointerMove = (e) => {
    if (!pointerDown) return;
    dx = e.clientX - startX;
    dy = e.clientY - startY;
  };

  const onPointerUp = () => {
    if (!pointerDown) return;
    pointerDown = false;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      if (dx < 0) next();
      else prev();
    }

    restart();
  };

  const track = root.querySelector('.banners');
  if (track) {
    track.style.touchAction = 'pan-y';
    track.addEventListener('pointerdown', onPointerDown, { passive: true });
    track.addEventListener('pointermove', onPointerMove, { passive: true });
    track.addEventListener('pointerup', onPointerUp, { passive: true });
    track.addEventListener('pointercancel', onPointerUp, { passive: true });
    track.addEventListener('pointerleave', onPointerUp, { passive: true });
  }

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', schedule);

  setActive(0);
  schedule();
})();
