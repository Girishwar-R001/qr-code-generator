import QRCode from 'qrcode';
import type { QRCustomization, QRType } from '../types/qr';

export interface RenderOptions {
  payload: string;
  customization: QRCustomization;
  targetSize?: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

export async function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  options: RenderOptions,
): Promise<void> {
  const { payload, customization, targetSize } = options;
  const size = targetSize || customization.size;

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');


  if (!customization.enableGradient && !customization.logoUrl) {
    await QRCode.toCanvas(canvas, payload, {
      width: size,
      margin: customization.margin,
      errorCorrectionLevel: customization.errorCorrection,
      color: {
        dark: customization.foreground,
        light: customization.background,
      },
    });
    return;
  }


  const offscreen = document.createElement('canvas');
  offscreen.width = size;
  offscreen.height = size;

  await QRCode.toCanvas(offscreen, payload, {
    width: size,
    margin: customization.margin,
    errorCorrectionLevel: customization.errorCorrection,
    color: {
      dark: '#000000ff',
      light: '#00000000',
    },
  });


  ctx.fillStyle = customization.background;
  ctx.fillRect(0, 0, size, size);


  const fgCanvas = document.createElement('canvas');
  fgCanvas.width = size;
  fgCanvas.height = size;
  const fgCtx = fgCanvas.getContext('2d');
  if (!fgCtx) throw new Error('FG context not available');

  if (customization.enableGradient) {
    let grad: CanvasGradient;
    if (customization.gradientDirection === 'to-r') {
      grad = fgCtx.createLinearGradient(0, 0, size, 0);
    } else if (customization.gradientDirection === 'to-b') {
      grad = fgCtx.createLinearGradient(0, 0, 0, size);
    } else {
      grad = fgCtx.createLinearGradient(0, 0, size, size);
    }
    grad.addColorStop(0, customization.foreground);
    grad.addColorStop(1, customization.gradientColor);
    fgCtx.fillStyle = grad;
  } else {
    fgCtx.fillStyle = customization.foreground;
  }
  fgCtx.fillRect(0, 0, size, size);


  fgCtx.globalCompositeOperation = 'destination-in';
  fgCtx.drawImage(offscreen, 0, 0);


  ctx.drawImage(fgCanvas, 0, 0);


  if (customization.logoUrl) {
    try {
      const logoImg = await loadImage(customization.logoUrl);
      const logoRatio = customization.logoSize / 100;
      const logoDimension = Math.floor(size * logoRatio);
      const x = Math.floor((size - logoDimension) / 2);
      const y = Math.floor((size - logoDimension) / 2);
      const padding = Math.max(4, Math.floor(logoDimension * 0.08));


      if (customization.logoBackground) {
        ctx.fillStyle = customization.background;
        const boxX = x - padding;
        const boxY = y - padding;
        const boxSize = logoDimension + padding * 2;
        const radius = Math.floor(boxSize * 0.18);

        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxSize, boxSize, radius);
        ctx.fill();


        ctx.strokeStyle = customization.background === '#ffffff' ? '#e2e8f0' : '#334155';
        ctx.lineWidth = 1;
        ctx.stroke();
      }


      ctx.drawImage(logoImg, x, y, logoDimension, logoDimension);
    } catch (err) {
      console.warn('Failed to render logo on canvas:', err);
    }
  }
}



export async function generateQRSVG(options: RenderOptions): Promise<string> {
  const { payload, customization, targetSize } = options;
  const size = targetSize || customization.size;

  let svg = await QRCode.toString(payload, {
    type: 'svg',
    width: size,
    margin: customization.margin,
    errorCorrectionLevel: customization.errorCorrection,
    color: {
      dark: customization.foreground,
      light: customization.background,
    },
  });


  if (customization.logoUrl) {
    const logoRatio = customization.logoSize / 100;
    const logoDimension = Math.floor(size * logoRatio);
    const x = Math.floor((size - logoDimension) / 2);
    const y = Math.floor((size - logoDimension) / 2);
    const padding = Math.max(4, Math.floor(logoDimension * 0.08));

    const shield = customization.logoBackground
      ? `<rect x="${x - padding}" y="${y - padding}" width="${logoDimension + padding * 2}" height="${logoDimension + padding * 2}" rx="${Math.floor((logoDimension + padding * 2) * 0.18)}" fill="${customization.background}" />`
      : '';

    const imageElement = `${shield}<image href="${customization.logoUrl}" x="${x}" y="${y}" width="${logoDimension}" height="${logoDimension}" />`;
    svg = svg.replace('</svg>', `${imageElement}</svg>`);
  }

  return svg;
}
function triggerDownload(filename: string, href: string) {
  const anchor = document.createElement('a');
  anchor.download = filename;
  anchor.href = href;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export async function downloadQRPNG(
  payload: string,
  customization: QRCustomization,
  qrType: QRType,
): Promise<void> {
  const offscreen = document.createElement('canvas');
  await renderQRToCanvas(offscreen, {
    payload,
    customization,
    targetSize: customization.size,
  });

  triggerDownload(`qr-studio-${qrType}-${Date.now()}.png`, offscreen.toDataURL('image/png'));
}

export async function downloadQRJPG(
  payload: string,
  customization: QRCustomization,
  qrType: QRType,
): Promise<void> {
  const offscreen = document.createElement('canvas');
  await renderQRToCanvas(offscreen, {
    payload,
    customization,
    targetSize: customization.size,
  });

  triggerDownload(`qr-studio-${qrType}-${Date.now()}.jpg`, offscreen.toDataURL('image/jpeg', 0.95));
}

export async function downloadQRSVG(
  payload: string,
  customization: QRCustomization,
  qrType: QRType,
): Promise<void> {
  const svgString = await generateQRSVG({
    payload,
    customization,
    targetSize: customization.size,
  });

  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  triggerDownload(`qr-studio-${qrType}-${Date.now()}.svg`, url);
  URL.revokeObjectURL(url);
}



export async function copyQRToClipboard(
  payload: string,
  customization: QRCustomization,
): Promise<{ success: boolean; message: string }> {
  try {
    const offscreen = document.createElement('canvas');
    await renderQRToCanvas(offscreen, {
      payload,
      customization,
      targetSize: customization.size,
    });

    const blob = await new Promise<Blob | null>((resolve) => {
      offscreen.toBlob((b) => resolve(b), 'image/png');
    });

    if (!blob) {
      return { success: false, message: 'Could not generate image blob' };
    }

    if (!navigator.clipboard || !window.ClipboardItem) {
      return {
        success: false,
        message: 'Clipboard image writing not supported in this browser.',
      };
    }

    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ]);

    return { success: true, message: 'QR code copied to clipboard!' };
  } catch (err) {
    console.error('Clipboard copy error:', err);
    return {
      success: false,
      message: 'Failed to copy to clipboard. Permission may be denied.',
    };
  }
}
