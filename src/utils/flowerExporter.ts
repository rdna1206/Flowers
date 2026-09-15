/**
 * Flower Exporter Utility
 * Enables high-fidelity client-side export of bespoke floral creations
 * as high-resolution PNG images and full choreographed animation videos (.webm / .mp4).
 */

export interface FlowerExportOptions {
  userName: string;
  stageContainerId?: string;
  svgElement?: SVGSVGElement | null;
  ambientColors?: {
    primary?: string;
    secondary?: string;
    glow?: string;
  };
}

export interface VideoExportOptions extends FlowerExportOptions {
  animationDurationMs: number;
  onReplay: () => void;
  onProgress: (percent: number, message: string) => void;
}

/**
 * Formats a clean, safe filename based on the user's name
 * e.g., "Mi_Flor_Carlos.png", "Mi_Flor_Jhonatan.webm"
 */
export function formatFlowerFilename(userName: string, extension: string): string {
  if (!userName || typeof userName !== 'string') {
    return `Mi_Flor_Recuerdo.${extension}`;
  }

  // Remove accents, normalize and keep clean alphanumeric chars
  const normalized = userName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '');

  const cleanName = normalized || 'Recuerdo';
  return `Mi_Flor_${cleanName}.${extension}`;
}

/**
 * Determines the best supported video MIME type on the current browser
 */
export function getSupportedVideoMimeType(): { mimeType: string; extension: string } {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return { mimeType: '', extension: '' };
  }

  const candidates = [
    { mimeType: 'video/webm;codecs=vp9', extension: 'webm' },
    { mimeType: 'video/webm;codecs=vp8', extension: 'webm' },
    { mimeType: 'video/webm', extension: 'webm' },
    { mimeType: 'video/mp4;codecs=avc1', extension: 'mp4' },
    { mimeType: 'video/mp4', extension: 'mp4' },
  ];

  for (const c of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(c.mimeType)) {
        return c;
      }
    } catch {
      // Continue to next candidate
    }
  }

  return { mimeType: '', extension: '' };
}

/**
 * Triggers a native client-side file download for a Blob
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
  ambientGlowColor: string = 'rgba(245, 158, 11, 0.18)'
) {
  // 1. Deep Midnight Base
  ctx.fillStyle = '#030206';
  ctx.fillRect(0, 0, width, height);

  // 2. Primary Radial Ambient Glow (behind flower crown)
  const glowGrad = ctx.createRadialGradient(
    width / 2,
    height * 0.45,
    30,
    width / 2,
    height * 0.45,
    width * 0.55
  );
  glowGrad.addColorStop(0, ambientGlowColor);
  glowGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.45)');
  glowGrad.addColorStop(1, 'rgba(3, 2, 6, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height);

  // 3. Secondary Warm Base Glow (behind stems & vase/wrap)
  const baseGrad = ctx.createRadialGradient(
    width / 2,
    height * 0.75,
    10,
    width / 2,
    height * 0.75,
    width * 0.35
  );
  baseGrad.addColorStop(0, 'rgba(30, 58, 138, 0.22)');
  baseGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, width, height);

  // 4. Subtle Vignette Border
  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    width * 0.4,
    width / 2,
    height / 2,
    width * 0.8
  );
  vignette.addColorStop(0, 'transparent');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
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
    throw new Error('No se encontró la flor para exportar. Asegúrate de que el ramo esté visible.');
  }

  // High-resolution Canvas (1200 x 1400)
  const canvasWidth = 1200;
  const canvasHeight = 1400;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('El navegador no pudo inicializar el lienzo para generar la imagen.');
  }

  // Draw atmosphere background
  const glowColor = options.ambientColors?.glow || 'rgba(245, 158, 11, 0.22)';
  drawCosmicBackground(ctx, canvasWidth, canvasHeight, glowColor);

  // Render SVG Flower
  const flowerImg = await svgToImage(svg, canvasWidth, canvasHeight);
  ctx.drawImage(flowerImg, 0, 0, canvasWidth, canvasHeight);

  // Convert to PNG Blob and trigger download
  return new Promise<void>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('No se pudo generar el archivo de imagen.'));
          return;
        }
        const filename = formatFlowerFilename(options.userName, 'png');
        triggerBlobDownload(blob, filename);
        resolve();
      },
      'image/png',
      1.0
    );
  });
}

/**
 * Records and downloads the flower's genuine animation choreography as a video (.webm / .mp4)
 */
export async function exportFlowerAsVideo(options: VideoExportOptions): Promise<void> {
  const { mimeType, extension } = getSupportedVideoMimeType();
  if (!mimeType) {
    throw new Error('Tu navegador no soporta la grabación nativa de video. Te recomendamos la opción "Guardar como imagen".');
  }

  const canvasWidth = 900;
  const canvasHeight = 1050;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo inicializar el entorno de grabación de video.');
  }

  const stream = canvas.captureStream(30); // 30 FPS stream
  const recordedChunks: Blob[] = [];

  let mediaRecorder: MediaRecorder;
  try {
    mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 4500000, // 4.5 Mbps high bitrate for crisp floral details
    });
  } catch {
    // Fallback without bitrate parameter if browser complains
    mediaRecorder = new MediaRecorder(stream);
  }

  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  options.onProgress(5, 'Preparando inicio de animación...');

  // Trigger animation replay
  options.onReplay();

  // Give 150ms for the animation state reset to take effect in React DOM
  await new Promise((r) => setTimeout(r, 150));

  mediaRecorder.start(250); // Emit chunk every 250ms

  const startTime = Date.now();
  const totalDuration = options.animationDurationMs + 1800; // Add 1.8s pause at the end to admire the completed flower

  const glowColor = options.ambientColors?.glow || 'rgba(245, 158, 11, 0.22)';

  return new Promise<void>((resolve, reject) => {
    let isRecording = true;

    // Frame capture loop running at ~30 FPS
    const frameInterval = setInterval(async () => {
      if (!isRecording) return;

      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min(96, Math.round((elapsed / totalDuration) * 100));

      options.onProgress(
        progressPercent,
        `Grabando animación... ${progressPercent}%`
      );

      const activeSvg = findFlowerSvg(options.stageContainerId, options.svgElement);
      if (activeSvg) {
        try {
          drawCosmicBackground(ctx, canvasWidth, canvasHeight, glowColor);
          const img = await svgToImage(activeSvg, canvasWidth, canvasHeight);
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        } catch {
          // If a frame snapshot fails momentarily, continue next frame smoothly
        }
      }

      if (elapsed >= totalDuration) {
        isRecording = false;
        clearInterval(frameInterval);

        options.onProgress(98, 'Finalizando archivo de video...');

        mediaRecorder.onstop = () => {
          try {
            const finalBlob = new Blob(recordedChunks, { type: mimeType });
            const filename = formatFlowerFilename(options.userName, extension);
            triggerBlobDownload(finalBlob, filename);
            options.onProgress(100, '¡Flor guardada con éxito!');
            resolve();
          } catch (err: any) {
            reject(new Error(err?.message || 'Error al compilar el video.'));
          }
        };

        mediaRecorder.stop();
      }
    }, 33); // ~30 FPS
  });
}
