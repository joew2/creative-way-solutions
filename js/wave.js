(() => {
  'use strict';

  const canvas = document.querySelector('#wave');
  const ctx = canvas.getContext('2d', { alpha: true });
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;
  let last = 0;
  let running = true;

  const bands = [
    { y: .72, amp: .075, thick: .104, speed: .18, phase: .1, alpha: .48 },
    { y: .68, amp: .095, thick: .068, speed: .23, phase: 1.5, alpha: .62 },
    { y: .62, amp: .115, thick: .043, speed: .29, phase: 2.7, alpha: .8 },
    { y: .55, amp: .12, thick: .032, speed: .34, phase: 4.2, alpha: .74 },
    { y: .47, amp: .095, thick: .052, speed: .2, phase: 5.4, alpha: .42 },
    { y: .39, amp: .073, thick: .026, speed: .26, phase: 3.4, alpha: .38 }
  ];

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    width = innerWidth;
    height = innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(reducedMotion.matches ? 7.5 : performance.now() / 1000);
  }

  function centerY(x, band, t) {
    const nx = x / width;
    const broad = Math.sin(nx * Math.PI * 1.55 - .75 + band.phase + t * band.speed);
    const detail = Math.sin(nx * Math.PI * 3.25 + band.phase * .8 - t * band.speed * .72) * .27;
    const crossing = Math.sin((nx - .47) * Math.PI) * .08;
    return height * (band.y + band.amp * broad + band.amp * detail + crossing);
  }

  function ribbonPath(band, t, offset) {
    const points = 42;
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * (width + 160) - 80;
      const y = centerY(x, band, t) + offset;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }

  function gradient(alpha) {
    const g = ctx.createLinearGradient(0, 0, width, 0);
    g.addColorStop(0, `rgba(151,31,255,${alpha})`);
    g.addColorStop(.28, `rgba(75,63,255,${alpha})`);
    g.addColorStop(.53, `rgba(0,184,255,${alpha})`);
    g.addColorStop(.72, `rgba(0,240,221,${alpha * .9})`);
    g.addColorStop(1, `rgba(102,255,23,${alpha})`);
    return g;
  }

  function drawBand(band, t) {
    const thickness = Math.max(20, height * band.thick);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ribbonPath(band, t, 0);
    ctx.strokeStyle = gradient(band.alpha * .15);
    ctx.lineWidth = thickness * 1.85;
    ctx.shadowBlur = thickness * .62;
    ctx.shadowColor = 'rgba(14,122,255,.34)';
    ctx.stroke();

    ribbonPath(band, t, 0);
    ctx.strokeStyle = gradient(band.alpha * .32);
    ctx.lineWidth = thickness;
    ctx.shadowBlur = thickness * .18;
    ctx.stroke();

    const strands = Math.max(4, Math.round(thickness / 8));
    for (let i = 0; i < strands; i++) {
      const ratio = strands === 1 ? 0 : i / (strands - 1);
      const offset = (ratio - .5) * thickness * .86;
      ribbonPath(band, t + ratio * .22, offset);
      ctx.strokeStyle = gradient(band.alpha * (.12 + Math.sin(ratio * Math.PI) * .32));
      ctx.lineWidth = i % 3 === 0 ? 1.4 : .65;
      ctx.shadowBlur = i % 3 === 0 ? 8 : 2;
      ctx.stroke();
    }

    ribbonPath(band, t + .13, -thickness * .43);
    ctx.strokeStyle = gradient(Math.min(.95, band.alpha * .9));
    ctx.lineWidth = 1.2;
    ctx.shadowBlur = 13;
    ctx.stroke();
    ctx.restore();
  }

  function draw(t) {
    ctx.clearRect(0, 0, width, height);
    const vignette = ctx.createRadialGradient(width * .55, height * .57, 0, width * .55, height * .57, width * .72);
    vignette.addColorStop(0, 'rgba(3,8,13,.08)');
    vignette.addColorStop(1, 'rgba(0,0,0,.4)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
    bands.forEach((band) => drawBand(band, t));
  }

  function animate(now) {
    if (!running || reducedMotion.matches) return;
    if (now - last > 1000 / 45) {
      draw(now / 1000);
      last = now;
    }
    frame = requestAnimationFrame(animate);
  }

  function motionChanged() {
    cancelAnimationFrame(frame);
    if (reducedMotion.matches) draw(7.5);
    else frame = requestAnimationFrame(animate);
  }

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running && !reducedMotion.matches) frame = requestAnimationFrame(animate);
    else cancelAnimationFrame(frame);
  });

  addEventListener('resize', resize, { passive: true });
  reducedMotion.addEventListener('change', motionChanged);
  resize();
  motionChanged();
})();
