/*cmyk separcija*/
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





document.addEventListener("DOMContentLoaded", function () {

  const drawingCursor = document.createElement("div");

  drawingCursor.className = "drawing-cursor";

  document.body.appendChild(drawingCursor);


  document.addEventListener("pointermove", function (event) {

    drawingCursor.style.left = event.clientX + "px";
    drawingCursor.style.top = event.clientY + "px";

  });


  const paragraphs = document.querySelectorAll(".thesis p");

  paragraphs.forEach(function (paragraph) {


    paragraph.addEventListener("pointerenter", function () {

      drawingCursor.style.display = "block";

    });

    paragraph.addEventListener("pointerleave", function () {

      drawingCursor.style.display = "none";

    });


    paragraph.classList.add("drawing-text");

    const text = paragraph.textContent;

    paragraph.innerHTML = "";

    [...text].forEach(function (character) {

      const span = document.createElement("span");

      span.textContent = character;
      span.dataset.state = "0";

      paragraph.appendChild(span);

    });


    let drawing = false;

    paragraph.addEventListener("selectstart", function (event) {
      event.preventDefault();
    });

    paragraph.addEventListener("pointerdown", function (event) {

      event.preventDefault();

      drawing = true;

      paragraph.setPointerCapture(event.pointerId);

      paint(event);

    });


    paragraph.addEventListener("pointermove", function (event) {

      if (!drawing) return;

      paint(event);

    });


    paragraph.addEventListener("pointerup", function () {

      drawing = false;

    });


    paragraph.addEventListener("pointercancel", function () {

      drawing = false;

    });


    function paint(event) {

      const radius = 20;

      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const spans = paragraph.querySelectorAll("span");

      spans.forEach(function (span) {

        const rect = span.getBoundingClientRect();

        const spanCenterX = rect.left + rect.width / 2;
        const spanCenterY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
          Math.pow(mouseX - spanCenterX, 2) +
          Math.pow(mouseY - spanCenterY, 2)
        );

        if (distance <= radius) {

          let state = Number(span.dataset.state);

          if (state >= 4) return;

          state++;

          span.dataset.state = state;

          if (state === 1) {

            // CRNO → ŽUTO
            span.style.color = "#FFD700";
            span.style.fontSize = "16pt";

          }

          else if (state === 2) {

            // ŽUTO → MAGENTA
            span.style.color = "#E6007E";
            span.style.fontSize = "20pt";

          }

          else if (state === 3) {

            // MAGENTA → CIJAN
            span.style.color = "#00AEEF";
            span.style.fontSize = "24pt";

          }

        }

      });

    }

  });

});



