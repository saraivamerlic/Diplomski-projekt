document.addEventListener('DOMContentLoaded', async () => {
  const cssText = document.getElementById('paged-css')?.textContent || '';
  const source = document.getElementById('paged-source');
  const renderTarget = document.getElementById('paged-output');

  const setColor = (value) => {
    const whiteRatio = value / 100;
    const r = Math.round(17 + (255 - 17) * whiteRatio);
    const g = Math.round(24 + (255 - 24) * whiteRatio);
    const b = Math.round(39 + (255 - 39) * whiteRatio);
    const color = `rgb(${r}, ${g}, ${b})`;
    document.documentElement.style.setProperty('--content-color', color);
    const colorLabel = document.querySelector('#color-value');
    if (colorLabel) {
      colorLabel.textContent = whiteRatio > 0.5 ? 'Bijelo' : 'Crno';
    }
  };

  const clearPagedSheets = () => {
    if (renderTarget) {
      renderTarget.innerHTML = '';
    }
  };

  const renderPreview = async () => {
    if (!window.PagedPolyfill || !cssText || !source || !renderTarget) return;
    clearPagedSheets();
    try {
      await window.PagedPolyfill.preview(source, [{ 'paged-inline.css': cssText }], renderTarget);
    } catch (error) {
      console.error('Paged.js preview failed:', error);
    }
  };

  document.body.addEventListener('input', async (event) => {
    if (event.target && event.target.id === 'color-slider') {
      setColor(event.target.value);
      await renderPreview();
    }
  });

  const initialSlider = document.querySelector('#color-slider');
  if (initialSlider) {
    //setColor(initialSlider.value);
  }

  const animateBg = (time) => {
    const x = 20 + Math.sin(time / 1800) * 6;
    const y = 20 + Math.cos(time / 2600) * 8;
    document.documentElement.style.setProperty('--bg-x', `${x}%`);
    document.documentElement.style.setProperty('--bg-y', `${y}%`);
    requestAnimationFrame(animateBg);
  };
  requestAnimationFrame(animateBg);

  await renderPreview();
});
