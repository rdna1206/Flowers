/**
 * Flower Exporter Utility
 * High-fidelity client-side PNG export for bespoke floral creations.
 * Exports the complete flower/bouquet and ambient visual background
 * as a standalone, crystal-clear PNG without any UI buttons or watermarks.
 */

export interface FlowerExportOptions {
  userName: string;
  stageContainerId?: string;
  svgElement?: SVGSVGElement | null;
  ambientColors?: {
    glow?: string;
  };
}

/**
 * Formats a clean, safe filename based on the user's name
 * e.g., "Mi_Flor_Carlos.png", "Mi_Flor_Jhon.png", "Mi_Flor_Isaias.png"
 */
export function formatFlowerFilename(userName: string): string {
  if (!userName || typeof userName !== 'string') {
    return 'Mi_Flor.png';
  }

  // Remove accents, normalize and keep clean alphanumeric chars
  const normalized = userName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '');

  const cleanName = normalized || 'Flor';
  return `Mi_Flor_${cleanName}.png`;
}

/**
 * Triggers a direct client-side file download for a Blob
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 1500);
}

/**
 * Finds the flower SVG element in the DOM
 */
export function findFlowerSvg(containerId?: string, fallbackElement?: SVGSVGElement | null): SVGSVGElement | null {
  if (fallbackElement) return fallbackElement;

  if (containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      const svg = container.querySelector('svg');
      if (svg) return svg;
    }
  }

  // Look for any flower stage SVG on the page
  const selectors = [
    '#active-flower-svg-stage',
    '[data-flower-stage="true"]',
    '#carlos-bouquet-svg',
    '#jhon-bouquet-svg',
    '#isaias-bouquet-svg',
    '#genesis-bouquet-svg',
    '#andrea-bouquet-svg',
    '#shaday-bouquet-svg',
    '#isabella-bouquet-svg',
    '#hannia-bouquet-svg',
    '#luciana-bouquet-svg',
    '#stanley-bouquet-svg',
    '#dileidys-bouquet-svg',
    '#leiry-bouquet-svg',
    '#default-bouquet-svg',
    'main svg',
  ];

  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el instanceof SVGSVGElement) {
      return el;
    }
  }

  return null;
}

/**
 * Renders the cosmic / luxury ambient background on a 2D canvas
 */
function drawCosmicBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  ambientGlowColor: string = 'rgba(245, 158, 11, 0.22)'
) {
  // 1. Deep Midnight Base
  ctx.fillStyle = '#030206';
  ctx.fillRect(0, 0, width, height);

  // 2. Primary Radial Ambient Glow (behind flower crown)
  const glowGrad = ctx.createRadialGradient(
    width / 2,
    height * 0.44,
    30,
    width / 2,
    height * 0.44,
    width * 0.58
  );
  glowGrad.addColorStop(0, ambientGlowColor);
  glowGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.45)');
  glowGrad.addColorStop(1, 'rgba(3, 2, 6, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height);

  // 3. Secondary Warm Base Glow (behind stems & wrap)
  const baseGrad = ctx.createRadialGradient(
    width / 2,
    height * 0.76,
    10,
    width / 2,
    height * 0.76,
    width * 0.38
  );
  baseGrad.addColorStop(0, 'rgba(30, 58, 138, 0.22)');
  baseGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, width, height);

  // 4. Subtle Vignette Border for cinematic atmosphere
  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    width * 0.4,
    width / 2,
    height / 2,
    width * 0.8
  );
  vignette.addColorStop(0, 'transparent');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Converts an SVGSVGElement to an HTMLImageElement using SVG serialization
 */
async function svgToImage(svg: SVGSVGElement, width: number, height: number): Promise<HTMLImageElement> {
  const clone = svg.cloneNode(true) as SVGSVGElement;

  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  clone.setAttribute('width', `${width}`);
  clone.setAttribute('height', `${height}`);

  // Ensure viewBox exists
  if (!clone.getAttribute('viewBox')) {
    const bbox = svg.viewBox?.baseVal;
    if (bbox && bbox.width > 0 && bbox.height > 0) {
      clone.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
    } else {
      clone.setAttribute('viewBox', '0 0 500 560');
    }
  }

  const serialized = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
  const blobUrl = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      URL.revokeObjectURL(blobUrl);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(blobUrl);
      reject(err);
    };
    img.src = blobUrl;
  });
}

/**
 * Captures and downloads the current completed flower as a high-resolution PNG
 */
export async function exportFlowerAsImage(options: FlowerExportOptions): Promise<void> {
  const svg = findFlowerSvg(options.stageContainerId, options.svgElement);
  if (!svg) {
    throw new Error('No se encontró la flor para descargar. Asegúrate de que el ramo esté visible.');
  }

  // Ultra High-Resolution Canvas (1400 x 1600)
  const canvasWidth = 1400;
  const canvasHeight = 1600;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo inicializar el lienzo para generar la imagen.');
  }

  // Draw deep luxury atmospheric background
  const glowColor = options.ambientColors?.glow || 'rgba(245, 158, 11, 0.24)';
  drawCosmicBackground(ctx, canvasWidth, canvasHeight, glowColor);

  // Render SVG Flower with all details, gradients, paths, and personalized marks
  const flowerImg = await svgToImage(svg, canvasWidth, canvasHeight);
  ctx.drawImage(flowerImg, 0, 0, canvasWidth, canvasHeight);

  // Direct PNG Blob generation and instant download
  return new Promise<void>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('No se pudo generar el archivo PNG.'));
          return;
        }
        const filename = formatFlowerFilename(options.userName);
        triggerBlobDownload(blob, filename);
        resolve();
      },
      'image/png',
      1.0
    );
  });
}
