var e=`(function () {\r
  const carousel = document.querySelector('.video-carousel');\r
  if (!carousel) return;\r
\r
  const player = carousel.querySelector('.video-carousel__player');\r
  const slides = carousel.querySelectorAll('.video-carousel__slide');\r
  const dots = carousel.querySelectorAll('.video-carousel__dot');\r
  const thumbs = carousel.querySelectorAll('.video-carousel__thumb');\r
  const thumbsContainer = carousel.querySelector('.video-carousel__thumbs');\r
  const liveRegion = carousel.querySelector('.video-carousel__live-region');\r
  const total = parseInt(player.dataset.videoCount, 10);\r
  let currentIndex = 0;\r
\r
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;\r
  const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';\r
\r
  function stopVideo(slide) {\r
    const iframe = slide.querySelector('.video-carousel__embed');\r
    if (iframe) {\r
      iframe.remove();\r
      slide.classList.remove('video-carousel__slide--playing');\r
    }\r
  }\r
\r
  function announceSlide(index) {\r
    if (!liveRegion) return;\r
    var slide = slides[index];\r
    var title = slide.querySelector('.video-carousel__info-title');\r
    var text = title ? title.textContent.trim() : '';\r
    liveRegion.textContent = text\r
      ? (index + 1) + ' de ' + total + ': ' + text\r
      : (index + 1) + ' de ' + total;\r
  }\r
\r
  function goTo(index) {\r
    if (index === currentIndex) return;\r
\r
    stopVideo(slides[currentIndex]);\r
\r
    slides[currentIndex].classList.remove('video-carousel__slide--active');\r
    dots[currentIndex].classList.remove('video-carousel__dot--active');\r
    dots[currentIndex].setAttribute('aria-selected', 'false');\r
    thumbs[currentIndex].classList.remove('video-carousel__thumb--active');\r
    thumbs[currentIndex].removeAttribute('aria-current');\r
\r
    currentIndex = index;\r
\r
    slides[currentIndex].classList.add('video-carousel__slide--active');\r
    dots[currentIndex].classList.add('video-carousel__dot--active');\r
    dots[currentIndex].setAttribute('aria-selected', 'true');\r
    thumbs[currentIndex].classList.add('video-carousel__thumb--active');\r
    thumbs[currentIndex].setAttribute('aria-current', 'true');\r
\r
    thumbs[currentIndex].scrollIntoView({\r
      behavior: scrollBehavior,\r
      block: 'nearest',\r
      inline: 'center'\r
    });\r
\r
    announceSlide(currentIndex);\r
  }\r
\r
  function playVideo(button) {\r
    const slide = button.closest('.video-carousel__slide');\r
    const url = button.dataset.embedUrl;\r
    if (!url) return;\r
\r
    var titleEl = slide.querySelector('.video-carousel__info-title');\r
    var videoTitle = titleEl ? titleEl.textContent.trim() : 'Vídeo';\r
\r
    const iframe = document.createElement('iframe');\r
    iframe.src = url + '?autoplay=1';\r
    iframe.className = 'video-carousel__embed';\r
    iframe.setAttribute('title', videoTitle);\r
    iframe.setAttribute('allowfullscreen', '');\r
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');\r
    slide.appendChild(iframe);\r
    slide.classList.add('video-carousel__slide--playing');\r
  }\r
\r
  // Drag to scroll on thumbnails\r
  let isDragging = false;\r
  let startX = 0;\r
  let scrollLeft = 0;\r
  let hasDragged = false;\r
\r
  thumbsContainer.addEventListener('mousedown', function (e) {\r
    isDragging = true;\r
    hasDragged = false;\r
    startX = e.pageX - thumbsContainer.offsetLeft;\r
    scrollLeft = thumbsContainer.scrollLeft;\r
    thumbsContainer.style.cursor = 'grabbing';\r
    thumbsContainer.style.userSelect = 'none';\r
  });\r
\r
  thumbsContainer.addEventListener('mousemove', function (e) {\r
    if (!isDragging) return;\r
    e.preventDefault();\r
    var x = e.pageX - thumbsContainer.offsetLeft;\r
    var walk = x - startX;\r
    if (Math.abs(walk) > 5) hasDragged = true;\r
    thumbsContainer.scrollLeft = scrollLeft - walk;\r
  });\r
\r
  thumbsContainer.addEventListener('mouseup', function () {\r
    isDragging = false;\r
    thumbsContainer.style.cursor = '';\r
    thumbsContainer.style.userSelect = '';\r
  });\r
\r
  thumbsContainer.addEventListener('mouseleave', function () {\r
    isDragging = false;\r
    thumbsContainer.style.cursor = '';\r
    thumbsContainer.style.userSelect = '';\r
  });\r
\r
  // Touch drag support\r
  thumbsContainer.addEventListener('touchstart', function (e) {\r
    isDragging = true;\r
    hasDragged = false;\r
    startX = e.touches[0].pageX - thumbsContainer.offsetLeft;\r
    scrollLeft = thumbsContainer.scrollLeft;\r
  }, { passive: true });\r
\r
  thumbsContainer.addEventListener('touchmove', function (e) {\r
    if (!isDragging) return;\r
    var x = e.touches[0].pageX - thumbsContainer.offsetLeft;\r
    var walk = x - startX;\r
    if (Math.abs(walk) > 5) hasDragged = true;\r
    thumbsContainer.scrollLeft = scrollLeft - walk;\r
  }, { passive: true });\r
\r
  thumbsContainer.addEventListener('touchend', function () {\r
    isDragging = false;\r
  });\r
\r
  const prevBtn = carousel.querySelector('[data-video-prev]');\r
  const nextBtn = carousel.querySelector('[data-video-next]');\r
\r
  if (prevBtn) {\r
    prevBtn.addEventListener('click', function () {\r
      goTo((currentIndex - 1 + total) % total);\r
    });\r
  }\r
\r
  if (nextBtn) {\r
    nextBtn.addEventListener('click', function () {\r
      goTo((currentIndex + 1) % total);\r
    });\r
  }\r
\r
  carousel.addEventListener('click', function (e) {\r
    const dot = e.target.closest('.video-carousel__dot');\r
    if (dot) {\r
      goTo(parseInt(dot.dataset.index, 10));\r
      return;\r
    }\r
\r
    const thumb = e.target.closest('.video-carousel__thumb');\r
    if (thumb) {\r
      if (hasDragged) return;\r
      var index = parseInt(thumb.dataset.index, 10);\r
      var clickedPlayIcon = e.target.closest('.video-carousel__thumb-play-icon');\r
      goTo(index);\r
      if (clickedPlayIcon) {\r
        var activeSlide = slides[currentIndex];\r
        var playBtn = activeSlide.querySelector('.video-carousel__play');\r
        if (playBtn) playVideo(playBtn);\r
      }\r
      return;\r
    }\r
\r
    const play = e.target.closest('.video-carousel__play');\r
    if (play) {\r
      playVideo(play);\r
    }\r
  });\r
\r
  carousel.addEventListener('keydown', function (e) {\r
    if (e.key === 'ArrowLeft') {\r
      e.preventDefault();\r
      goTo((currentIndex - 1 + total) % total);\r
    } else if (e.key === 'ArrowRight') {\r
      e.preventDefault();\r
      goTo((currentIndex + 1) % total);\r
    }\r
  });\r
})();\r
`;export{e as default};