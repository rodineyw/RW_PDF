const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
let pngToIco = require('png-to-ico');
pngToIco = pngToIco && pngToIco.default ? pngToIco.default : pngToIco;

async function ensureDir(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

async function generatePngs(svgPath, outDir) {
  const sizes = [512, 256, 128, 64, 48, 32, 16];
  const pngPaths = [];
  for (const size of sizes) {
    const outPng = path.join(outDir, `icon-${size}.png`);
    await sharp(svgPath)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outPng);
    pngPaths.push(outPng);
  }
  // Also write a canonical 512x512 file
  const mainPng = path.join(outDir, 'icon.png');
  await sharp(svgPath)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(mainPng);
  return { pngPaths, mainPng };
}

async function generateIco(pngPaths, outDir) {
  const icoBuf = await pngToIco(pngPaths);
  const icoPath = path.join(outDir, 'icon.ico');
  await fs.promises.writeFile(icoPath, icoBuf);
  return icoPath;
}

async function main() {
  const root = path.resolve(__dirname, '..');
  const svgPath = path.join(root, 'public', 'logo.svg');
  const outDir = path.join(root, 'build');

  if (!(await fs.promises.stat(svgPath).catch(() => null))) {
    console.error('Logo SVG não encontrado em:', svgPath);
    process.exit(1);
  }

  await ensureDir(outDir);
  const { pngPaths, mainPng } = await generatePngs(svgPath, outDir);
  const icoPath = await generateIco(pngPaths, outDir);
  console.log('Ícones gerados com sucesso:');
  console.log('PNG principal:', mainPng);
  console.log('ICO:', icoPath);
}

main().catch((err) => {
  console.error('Falha ao gerar ícones:', err);
  process.exit(1);
});