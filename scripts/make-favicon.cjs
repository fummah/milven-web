/* Generates favicons from the Milven logo mark (the left "M" symbol).
 * Run: node scripts/make-favicon.cjs
 */
const sharp = require("sharp")
const fs = require("fs")
const path = require("path")
const pngToIcoModule = require("png-to-ico")
const pngToIco = pngToIcoModule.default || pngToIcoModule

const ROOT = path.join(__dirname, "..")
const SRC = path.join(ROOT, "public/images/brand/milven-logo-white.png")

async function main() {
  const meta = await sharp(SRC).metadata()
  const cropWidth = Math.round((meta.width ?? 2018) * 0.26)

  const mark = await sharp(SRC)
    .extract({ left: 0, top: 0, width: cropWidth, height: meta.height ?? 412 })
    .trim()
    .png()
    .toBuffer({ resolveWithObject: true })

  const mw = mark.info.width
  const mh = mark.info.height
  console.log("mark:", mw, "x", mh)

  const size = 512
  const inner = Math.round(size * 0.6)
  const scale = inner / Math.max(mw, mh)
  const resized = await sharp(mark.data)
    .resize(Math.round(mw * scale), Math.round(mh * scale), { fit: "contain" })
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
      background: { r: 6, g: 23, b: 46, alpha: 1 }
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

  console.log(
    "Wrote app/icon.png, app/apple-icon.png, public/favicon.ico, public/icon-192.png, public/icon-512.png"
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
