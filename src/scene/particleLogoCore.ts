import * as THREE from 'three'

export const DEFAULT_LOGO_BASE_WIDTH = 2.8
export const MAX_PARTICLES = 22_000
const DEFAULT_SAMPLE_STEP = 2

export type CollectPixelsOptions = {
  /** Max width/height when downscaling source before sampling */
  maxDim?: number
  sampleStep?: number
  /**
   * When true (default), randomly drop some semi-transparent pixels (good for soft logo edges).
   * Set false for crisp text wordmarks so letter strokes stay readable.
   */
  thinEdgeRandom?: boolean
  /**
   * JPEG / opaque PNG: no real alpha — skip dark background by luminance and use brightness as weight.
   * Do not use for Logo3D PNG with transparency.
   */
  skipDarkPixels?: boolean
  /** With skipDarkPixels: linear luminance 0–255 below this = background (default 42) */
  darkLuminanceMax?: number
}

export type BuildParticleGeometryOptions = {
  spread?: number
  zSpread?: number
}

/** Core sprite se glow kitna bada */
export const GLOW_SIZE_MULT = 5.35

const GLOW_TEXTURE_BLUR_PX = 8
const GLOW_TEX_INTERNAL = 176
const GLOW_TEX_OUT = 128

let softCircleMap: THREE.CanvasTexture | null = null
let glowHaloMap: THREE.CanvasTexture | null = null

export function getSoftCircleMap() {
  if (softCircleMap) return softCircleMap
  const s = 64
  const canvas = document.createElement('canvas')
  canvas.width = s
  canvas.height = s
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.28, 'rgba(255,255,255,0.55)')
  g.addColorStop(0.55, 'rgba(255,255,255,0.22)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  softCircleMap = tex
  return tex
}

export function getGlowHaloMap() {
  if (glowHaloMap) return glowHaloMap
  const W = GLOW_TEX_INTERNAL
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = W
  const ctx = canvas.getContext('2d')!
  const cx = W / 2
  const r = W * 0.46
  const g = ctx.createRadialGradient(cx, cx, 0, cx, cx, r)
  g.addColorStop(0, 'rgba(255,245,255,0.72)')
  g.addColorStop(0.2, 'rgba(238,225,255,0.38)')
  g.addColorStop(0.4, 'rgba(218,200,255,0.2)')
  g.addColorStop(0.6, 'rgba(200,185,255,0.09)')
  g.addColorStop(0.8, 'rgba(185,170,255,0.03)')
  g.addColorStop(1, 'rgba(170,155,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, W)

  const out = document.createElement('canvas')
  out.width = GLOW_TEX_OUT
  out.height = GLOW_TEX_OUT
  const octx = out.getContext('2d')!
  octx.filter = `blur(${GLOW_TEXTURE_BLUR_PX}px)`
  const off = (W - GLOW_TEX_OUT) / 2
  octx.drawImage(canvas, off, off, GLOW_TEX_OUT, GLOW_TEX_OUT, 0, 0, GLOW_TEX_OUT, GLOW_TEX_OUT)

  const tex = new THREE.CanvasTexture(out)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.generateMipmaps = false
  tex.needsUpdate = true
  glowHaloMap = tex
  return tex
}

type SamplePixel = { u: number; v: number; a: number }

export function collectPixels(
  image: CanvasImageSource,
  srcW: number,
  srcH: number,
  opts?: CollectPixelsOptions,
): SamplePixel[] {
  const maxDim = opts?.maxDim ?? 300
  const sampleStep = opts?.sampleStep ?? DEFAULT_SAMPLE_STEP
  const thinEdgeRandom = opts?.thinEdgeRandom !== false

  let w = srcW
  let h = srcH
  if (w >= h && w > maxDim) {
    h = Math.round((h * maxDim) / w)
    w = maxDim
  } else if (h > maxDim) {
    w = Math.round((w * maxDim) / h)
    h = maxDim
  }

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(image, 0, 0, w, h)
  const { data } = ctx.getImageData(0, 0, w, h)

  const darkMax = opts?.darkLuminanceMax ?? 42
  const out: SamplePixel[] = []
  for (let y = 0; y < h; y += sampleStep) {
    for (let x = 0; x < w; x += sampleStep) {
      const i = (y * w + x) * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b

      if (opts?.skipDarkPixels) {
        if (lum < darkMax) continue
        const effA = Math.min(1, lum / 255)
        if (effA < 0.06) continue
        if (thinEdgeRandom && effA < 0.35 && Math.random() > effA * 2.2) continue
        out.push({ u: (x + 0.5) / w, v: (y + 0.5) / h, a: effA })
        continue
      }

      const a = data[i + 3] / 255
      if (a < 0.05) continue
      if (thinEdgeRandom && a < 0.35 && Math.random() > a * 2.2) continue
      out.push({ u: (x + 0.5) / w, v: (y + 0.5) / h, a })
    }
  }
  return out
}

function shuffleInPlace<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

export function buildParticleGeometry(
  pixels: SamplePixel[],
  sizeW: number,
  sizeH: number,
  opts?: BuildParticleGeometryOptions,
): THREE.BufferGeometry {
  let picked = pixels
  if (pixels.length > MAX_PARTICLES) {
    shuffleInPlace(pixels)
    picked = pixels.slice(0, MAX_PARTICLES)
  }

  const n = picked.length
  const positions = new Float32Array(n * 3)
  const colors = new Float32Array(n * 3)
  const spread = opts?.spread ?? 0.038
  const zSpread = opts?.zSpread ?? 0.09

  for (let i = 0; i < n; i++) {
    const p = picked[i]
    const edge = 1 - p.a
    const j = spread * (0.35 + edge * 2.8)
    const nx = (p.u - 0.5) * sizeW + (Math.random() - 0.5) * j
    const ny = -(p.v - 0.5) * sizeH + (Math.random() - 0.5) * j
    const nz = (Math.random() - 0.5) * zSpread * (0.45 + edge * 1.2)
    positions[i * 3] = nx
    positions[i * 3 + 1] = ny
    positions[i * 3 + 2] = nz

    const flicker = 0.65 + 0.35 * p.a * (0.55 + Math.random() * 0.45)
    colors[i * 3] = flicker
    colors[i * 3 + 1] = flicker
    colors[i * 3 + 2] = Math.min(1, flicker * 1.02)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.computeBoundingSphere()
  return geo
}

export type ParticleData = {
  geometry: THREE.BufferGeometry
  basePositions: Float32Array
  phases: Float32Array
  count: number
  circleMap: THREE.CanvasTexture
  glowMap: THREE.CanvasTexture
}

export type CreateParticleDataOptions = {
  collect?: CollectPixelsOptions
  geometry?: BuildParticleGeometryOptions
}

export function createParticleDataFromImageSource(
  image: CanvasImageSource,
  srcW: number,
  srcH: number,
  baseWidth: number,
  options?: CreateParticleDataOptions,
): ParticleData {
  const aspect = srcW / srcH
  const sizeW = baseWidth
  const sizeH = baseWidth / aspect

  const pixels = collectPixels(image, srcW, srcH, options?.collect)
  const geo = buildParticleGeometry(pixels, sizeW, sizeH, options?.geometry)
  const posAttr = geo.attributes.position
  const count = posAttr.count
  const basePositions = new Float32Array(posAttr.array as Float32Array)
  const phases = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    phases[i] = Math.random() * Math.PI * 2
  }
  return {
    geometry: geo,
    basePositions,
    phases,
    count,
    circleMap: getSoftCircleMap(),
    glowMap: getGlowHaloMap(),
  }
}
