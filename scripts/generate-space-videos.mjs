import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

function createSpaceVideo({ width, height, fps, duration, outputPath, isVertical }) {
  return new Promise((resolve, reject) => {
    const totalFrames = fps * duration;
    
    // Spawn ffmpeg to read raw rgb24 from stdin
    const ffmpeg = spawn('ffmpeg', [
      '-y',
      '-f', 'rawvideo',
      '-pix_fmt', 'rgb24',
      '-s', `${width}x${height}`,
      '-r', `${fps}`,
      '-i', '-',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-preset', 'fast',
      '-crf', '20',
      outputPath
    ]);

    ffmpeg.stderr.on('data', (d) => {
      // console.log(d.toString());
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log(`Successfully generated ${outputPath}`);
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });

    // Generate random stars
    const numStars = isVertical ? 450 : 600;
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        size: Math.random() * 2.5 + 0.5,
        colorType: Math.floor(Math.random() * 5),
      });
    }

    const frameBuffer = Buffer.alloc(width * height * 3);

    for (let frame = 0; frame < totalFrames; frame++) {
      const t = frame / totalFrames; // 0 to 1
      const progress = frame / fps;

      // Clear buffer to deep space black / dark navy (#03050c)
      for (let i = 0; i < frameBuffer.length; i += 3) {
        frameBuffer[i] = 3;     // R
        frameBuffer[i + 1] = 5; // G
        frameBuffer[i + 2] = 12;// B
      }

      // Draw background cosmic nebula clouds & glows
      const centerX = width / 2;
      const centerY = height / 2;

      // Render cosmic nebulae directly into raw pixel buffer
      for (let py = 0; py < height; py += 4) {
        for (let px = 0; px < width; px += 4) {
          const dx = px - centerX;
          const dy = py - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Nebula 1: Magenta / Deep Violet Pulse
          const n1Angle = Math.atan2(dy, dx) + t * Math.PI * 2;
          const n1Wave = Math.sin(dist * 0.015 - t * Math.PI * 2) * 0.5 + 0.5;
          const n1 = Math.max(0, (1 - dist / (width * 0.6))) * n1Wave;

          // Nebula 2: Electric Cyan / Indigo Wave
          const n2Wave = Math.cos(px * 0.01 + py * 0.01 + t * Math.PI * 2) * 0.5 + 0.5;
          const n2 = Math.max(0, (1 - dist / (width * 0.8))) * n2Wave;

          if (n1 > 0.1 || n2 > 0.1) {
            const rVal = Math.min(255, Math.floor(n1 * 180 + n2 * 20));
            const gVal = Math.min(255, Math.floor(n1 * 30 + n2 * 140));
            const bVal = Math.min(255, Math.floor(n1 * 220 + n2 * 255));

            // Fill 4x4 block for speed
            for (let blockY = 0; blockY < 4 && py + blockY < height; blockY++) {
              for (let blockX = 0; blockX < 4 && px + blockX < width; blockX++) {
                const idx = ((py + blockY) * width + (px + blockX)) * 3;
                frameBuffer[idx] = Math.max(frameBuffer[idx], rVal);
                frameBuffer[idx + 1] = Math.max(frameBuffer[idx + 1], gVal);
                frameBuffer[idx + 2] = Math.max(frameBuffer[idx + 2], bVal);
              }
            }
          }
        }
      }

      // Render stars moving forward in 3D (warp speed)
      const speed = 12;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        
        // Move star closer
        let curZ = (star.z - progress * speed * 40) % width;
        if (curZ <= 0) curZ += width;

        const k = 300 / curZ;
        const sx = Math.floor(star.x * k + centerX);
        const sy = Math.floor(star.y * k + centerY);

        if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
          const brightness = Math.min(255, Math.floor((1 - curZ / width) * 255));
          const starRadius = Math.max(1, Math.floor(star.size * (1 - curZ / width) * 2));

          let sr = brightness, sg = brightness, sb = brightness;
          if (star.colorType === 1) { sg = Math.floor(brightness * 0.8); sb = Math.floor(brightness * 0.5); } // Golden
          else if (star.colorType === 2) { sr = Math.floor(brightness * 0.6); sg = Math.floor(brightness * 0.9); } // Cyan
          else if (star.colorType === 3) { sr = Math.floor(brightness * 0.9); sg = Math.floor(brightness * 0.5); } // Magenta

          for (let dy = -starRadius; dy <= starRadius; dy++) {
            for (let dx = -starRadius; dx <= starRadius; dx++) {
              const px = sx + dx;
              const py = sy + dy;
              if (px >= 0 && px < width && py >= 0 && py < height && dx * dx + dy * dy <= starRadius * starRadius) {
                const idx = (py * width + px) * 3;
                frameBuffer[idx] = Math.min(255, frameBuffer[idx] + sr);
                frameBuffer[idx + 1] = Math.min(255, frameBuffer[idx + 1] + sg);
                frameBuffer[idx + 2] = Math.min(255, frameBuffer[idx + 2] + sb);
              }
            }
          }
        }
      }

      ffmpeg.stdin.write(frameBuffer);
    }

    ffmpeg.stdin.end();
  });
}

async function main() {
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  console.log('Generating vertical video (Celular)...');
  await createSpaceVideo({
    width: 540,
    height: 960,
    fps: 30,
    duration: 6,
    outputPath: path.join(publicDir, 'ssstik.io_@astrospaceq_1789184894877.mp4'),
    isVertical: true
  });

  console.log('Generating horizontal video (Escritorio)...');
  await createSpaceVideo({
    width: 960,
    height: 540,
    fps: 30,
    duration: 6,
    outputPath: path.join(publicDir, 'ssstik.io_@snshortsyt_1789184938844.mp4'),
    isVertical: false
  });

  console.log('All space videos generated successfully!');
}

main().catch(console.error);
