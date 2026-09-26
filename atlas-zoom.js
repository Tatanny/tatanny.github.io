(() => {
  const image = document.querySelector('[data-flow-zoom] img');
  if (!image) return;

  const hover = window.matchMedia('(min-width: 981px) and (hover: hover) and (pointer: fine)');
  const lens = document.createElement('div');
  lens.className = 'flow-magnifier';
  lens.setAttribute('aria-hidden', 'true');
  document.body.appendChild(lens);

  const hide = () => {
    lens.classList.remove('is-visible');
    image.classList.remove('is-magnifying');
  };

  image.addEventListener('pointermove', (event) => {
    if (!hover.matches || event.pointerType === 'touch' || !image.naturalWidth) {
      hide();
      return;
    }
    const rect = image.getBoundingClientRect();
    const size = Math.min(160, window.innerWidth - 24);
    const zoom = 2;
    const left = Math.max(8, Math.min(event.clientX - size / 2, window.innerWidth - size - 8));
    const top = Math.max(8, Math.min(event.clientY - size / 2, window.innerHeight - size - 8));
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    Object.assign(lens.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${left}px`,
      top: `${top}px`,
      backgroundImage: `url("${image.currentSrc || image.src}")`,
      backgroundSize: `${rect.width * zoom}px ${rect.height * zoom}px`,
      backgroundPosition: `${size / 2 - x * zoom}px ${size / 2 - y * zoom}px`,
    });
    lens.classList.add('is-visible');
    image.classList.add('is-magnifying');
  });

  image.addEventListener('pointerleave', hide);
  image.addEventListener('pointercancel', hide);
  window.addEventListener('scroll', hide, true);
  window.addEventListener('resize', hide);
  window.addEventListener('blur', hide);
  hover.addEventListener('change', hide);
})();
