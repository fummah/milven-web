/* Prepares brand assets from the official primary logo.
 * Run: node scripts/prepare-brand-assets.cjs
 *
 * Produces:
 *  - public/images/brand/milven-logo.png        (transparent, full colour)
 *  - public/images/brand/milven-logo-white.png  (transparent, navy->white, gold kept)
 *  - app/icon.png, app/apple-icon.png           (favicon mark, white rounded tile)
 *  - public/favicon.ico, public/icon-192.png, public/icon-512.png
 */
const fs = require("fs")
const path = require("path")
const sharp = require("sharp")
const pngToIcoModule = require("png-to-ico")
const pngToIco = pngToIcoModule.default || pngToIcoModule

const ROOT = path.join(__dirname, "..")
const SRC = path.join(ROOT, "public", "Milven_Logo_Primary.png")

async function removeWhiteBackground(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const out = Buffer.from(data)
  for (let i = 0; i < width * height; i++) {
    const o = i * channels
    const r = data[o]
    const g = data[o + 1]
    const b = data[o + 2]
    if (r >= 246 && g >= 246 && b >= 246) out[o + 3] = 0
  }
  return sharp(out, { raw: { width, height, channels } }).png().toBuffer()
}

async function makeWhite(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const out = Buffer.from(data)
  for (let i = 0; i < width * height; i++) {
    const o = i * channels
    const r = data[o]
    const g = data[o + 1]
    const b = data[o + 2]
    const a = data[o + 3]
    if (a < 12) continue
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const sat = max === 0 ? 0 : (max - min) / max
    const isGold = r > g && g > b && sat > 0.25 && r > 110
    if (!isGold) {
      out[o] = 255
      out[o + 1] = 255
      out[o + 2] = 255
    }
  }
  return sharp(out, { raw: { width, height, channels } }).png().toBuffer()
}

// Keep only the main connected shape(s); drop tiny disconnected fragments.
async function keepMainShape(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const n = width * height
  const alpha = new Uint8Array(n)
  for (let i = 0; i < n; i++) alpha[i] = data[i * channels + 3] > 20 ? 1 : 0

  const labels = new Int32Array(n)
  const sizes = []
  const stack = []
  let next = 0
  for (let start = 0; start < n; start++) {
    if (!alpha[start] || labels[start]) continue
    next++
    let size = 0
    stack.push(start)
    labels[start] = next
    while (stack.length) {
      const p = stack.pop()
      size++
      const x = p % width
      const y = (p / width) | 0
      if (x > 0 && alpha[p - 1] && !labels[p - 1]) { labels[p - 1] = next; stack.push(p - 1) }
      if (x < width - 1 && alpha[p + 1] && !labels[p + 1]) { labels[p + 1] = next; stack.push(p + 1) }
      if (y > 0 && alpha[p - width] && !labels[p - width]) { labels[p - width] = next; stack.push(p - width) }
      if (y < height - 1 && alpha[p + width] && !labels[p + width]) { labels[p + width] = next; stack.push(p + width) }
    }
    sizes[next - 1] = size
  }

  const maxSize = sizes.reduce((a, b) => Math.max(a, b), 0)
  const threshold = Math.max(1, Math.floor(maxSize * 0.04))
  const out = Buffer.from(data)
  for (let i = 0; i < n; i++) {
    const lab = labels[i]
    if (!lab) continue
    if ((sizes[lab - 1] || 0) < threshold) out[i * channels + 3] = 0
  }
  return sharp(out, { raw: { width, height, channels } }).png().toBuffer()
}

async function buildFavicons(symbolBuffer) {
  const size = 512
  const inner = Math.round(size * 0.66)
  const meta = await sharp(symbolBuffer).metadata()
  const scale = inner / Math.max(meta.width || 1, meta.height || 1)
  const resized = await sharp(symbolBuffer)
    .resize(Math.round((meta.width || 1) * scale), Math.round((meta.height || 1) * scale), {
      fit: "contain"
    })
    .png()
    .toBuffer()

  const radius = Math.round(size * 0.22)
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#ffffff"/></svg>`
  )

  const tile = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([
      { input: resized, gravity: "center" },
      { input: mask, blend: "dest-in" }
    ])
    .png()
    .toBuffer()

  fs.writeFileSync(path.join(ROOT, "app/icon.png"), tile)
  fs.writeFileSync(
    path.join(ROOT, "app/apple-icon.png"),
    await sharp(tile).resize(180, 180).png().toBuffer()
  )
  fs.writeFileSync(
    path.join(ROOT, "public/icon-192.png"),
    await sharp(tile).resize(192, 192).png().toBuffer()
  )
  fs.writeFileSync(path.join(ROOT, "public/icon-512.png"), tile)
  fs.writeFileSync(
    path.join(ROOT, "public/favicon.ico"),
    await pngToIco(
      await Promise.all([16, 32, 48].map((s) => sharp(tile).resize(s, s).png().toBuffer()))
    )
  )
}

async function main() {
  const src = fs.readFileSync(SRC)

  // 1) transparent full-colour logo
  const transparent = await removeWhiteBackground(src)
  const primary = await sharp(transparent).trim().png().toBuffer()
  fs.mkdirSync(path.join(ROOT, "public/images/brand"), { recursive: true })
  fs.writeFileSync(path.join(ROOT, "public/images/brand/milven-logo.png"), primary)

  // 2) reversed (white + gold) logo for dark backgrounds
  const white = await makeWhite(primary)
  fs.writeFileSync(path.join(ROOT, "public/images/brand/milven-logo-white.png"), white)

  // 3) favicon mark — crop the symbol (left portion) from the primary logo
  const meta = await sharp(primary).metadata()
  const cropWidth = Math.round((meta.width || 675) * 0.31)
  const symbolCropped = await sharp(primary)
    .extract({ left: 0, top: 0, width: cropWidth, height: meta.height || 280 })
    .png()
    .toBuffer()
  const symbol = await sharp(await keepMainShape(symbolCropped))
    .trim()
    .png()
    .toBuffer()
  await buildFavicons(symbol)

  // preview the reversed logo on navy (for verification only)
  const wm = await sharp(white).metadata()
  await sharp({
    create: {
      width: (wm.width || 600) + 80,
      height: (wm.height || 240) + 80,
      channels: 4,
      background: { r: 6, g: 23, b: 46, alpha: 1 }
    }
  })
    .composite([{ input: white, gravity: "center" }])
    .png()
    .toFile(path.join(process.env.TEMP || ".", "milven-logo-white-preview.png"))

  console.log("Brand assets generated from", path.relative(ROOT, SRC))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
