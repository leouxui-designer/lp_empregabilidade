(function () {
  const carousel = document.querySelector('.video-carousel');
  if (!carousel) return;

  const player = carousel.querySelector('.video-carousel__player');
  const slides = carousel.querySelectorAll('.video-carousel__slide');
  const dots = carousel.querySelectorAll('.video-carousel__dot');
  const thumbs = carousel.querySelectorAll('.video-carousel__thumb');
  const thumbsContainer = carousel.querySelector('.video-carousel__thumbs');
  const liveRegion = carousel.querySelector('.video-carousel__live-region');
  const total = parseInt(player.dataset.videoCount, 10);
  let currentIndex = 0;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

  function stopVideo(slide) {
    const iframe = slide.querySelector('.video-carousel__embed');
    if (iframe) {
      iframe.remove();
      slide.classList.remove('video-carousel__slide--playing');
    }
  }

  function announceSlide(index) {
    if (!liveRegion) return;
    var slide = slides[index];
    var title = slide.querySelector('.video-carousel__info-title');
    var text = title ? title.textContent.trim() : '';
    liveRegion.textContent = text
      ? (index + 1) + ' de ' + total + ': ' + text
      : (index + 1) + ' de ' + total;
  }

  function goTo(index) {
    if (index === currentIndex) return;

    stopVideo(slides[currentIndex]);

    slides[currentIndex].classList.remove('video-carousel__slide--active');
    dots[currentIndex].classList.remove('video-carousel__dot--active');
    dots[currentIndex].setAttribute('aria-selected', 'false');
    thumbs[currentIndex].classList.remove('video-carousel__thumb--active');
    thumbs[currentIndex].removeAttribute('aria-current');

    currentIndex = index;

    slides[currentIndex].classList.add('video-carousel__slide--active');
    dots[currentIndex].classList.add('video-carousel__dot--active');
    dots[currentIndex].setAttribute('aria-selected', 'true');
    thumbs[currentIndex].classList.add('video-carousel__thumb--active');
    thumbs[currentIndex].setAttribute('aria-current', 'true');

    thumbs[currentIndex].scrollIntoView({
      behavior: scrollBehavior,
      block: 'nearest',
      inline: 'center'
    });

    announceSlide(currentIndex);
  }

  function playVideo(button) {
    const slide = button.closest('.video-carousel__slide');
    const url = button.dataset.embedUrl;
    if (!url) return;

    var titleEl = slide.querySelector('.video-carousel__info-title');
    var videoTitle = titleEl ? titleEl.textContent.trim() : 'Vídeo';

    const iframe = document.createElement('iframe');
    iframe.src = url + '?autoplay=1';
    iframe.className = 'video-carousel__embed';
    iframe.setAttribute('title', videoTitle);
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    slide.appendChild(iframe);
    slide.classList.add('video-carousel__slide--playing');
  }

  // Drag to scroll on thumbnails
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasDragged = false;

  thumbsContainer.addEventListener('mousedown', function (e) {
    isDragging = true;
    hasDragged = false;
    startX = e.pageX - thumbsContainer.offsetLeft;
    scrollLeft = thumbsContainer.scrollLeft;
    thumbsContainer.style.cursor = 'grabbing';
    thumbsContainer.style.userSelect = 'none';
  });

  thumbsContainer.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    e.preventDefault();
    var x = e.pageX - thumbsContainer.offsetLeft;
    var walk = x - startX;
    if (Math.abs(walk) > 5) hasDragged = true;
    thumbsContainer.scrollLeft = scrollLeft - walk;
  });

  thumbsContainer.addEventListener('mouseup', function () {
    isDragging = false;
    thumbsContainer.style.cursor = '';
    thumbsContainer.style.userSelect = '';
  });

  thumbsContainer.addEventListener('mouseleave', function () {
    isDragging = false;
    thumbsContainer.style.cursor = '';
    thumbsContainer.style.userSelect = '';
  });

  // Touch drag support
  thumbsContainer.addEventListener('touchstart', function (e) {
    isDragging = true;
    hasDragged = false;
    startX = e.touches[0].pageX - thumbsContainer.offsetLeft;
    scrollLeft = thumbsContainer.scrollLeft;
  }, { passive: true });

  thumbsContainer.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    var x = e.touches[0].pageX - thumbsContainer.offsetLeft;
    var walk = x - startX;
    if (Math.abs(walk) > 5) hasDragged = true;
    thumbsContainer.scrollLeft = scrollLeft - walk;
  }, { passive: true });

  thumbsContainer.addEventListener('touchend', function () {
    isDragging = false;
  });

  const prevBtn = carousel.querySelector('[data-video-prev]');
  const nextBtn = carousel.querySelector('[data-video-next]');

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goTo((currentIndex - 1 + total) % total);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goTo((currentIndex + 1) % total);
    });
  }

  carousel.addEventListener('click', function (e) {
    const dot = e.target.closest('.video-carousel__dot');
    if (dot) {
      goTo(parseInt(dot.dataset.index, 10));
      return;
    }

    const thumb = e.target.closest('.video-carousel__thumb');
    if (thumb) {
      if (hasDragged) return;
      var index = parseInt(thumb.dataset.index, 10);
      var clickedPlayIcon = e.target.closest('.video-carousel__thumb-play-icon');
      goTo(index);
      if (clickedPlayIcon) {
        var activeSlide = slides[currentIndex];
        var playBtn = activeSlide.querySelector('.video-carousel__play');
        if (playBtn) playVideo(playBtn);
      }
      return;
    }

    const play = e.target.closest('.video-carousel__play');
    if (play) {
      playVideo(play);
    }
  });

  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo((currentIndex - 1 + total) % total);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo((currentIndex + 1) % total);
    }
  });
})();
