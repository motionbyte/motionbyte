import { useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const BASE_WIDTH = 2.8
const MAX_PARTICLES = 22_000
const SAMPLE_STEP = 2

/** Core sprite se glow kitna bada (pehle ~2.35; ab ~2×) */
const GLOW_SIZE_MULT = 5.35
/** Canvas glow texture — linear soft falloff + halka gaussian blur (~0.5 feel = 8px @128) */
const GLOW_TEXTURE_BLUR_PX = 8
const GLOW_TEX_INTERNAL = 176
const GLOW_TEX_OUT = 128

let softCircleMap: THREE.CanvasTexture | null = null
let glowHaloMap: THREE.CanvasTexture | null = null

function getSoftCircleMap() {
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

/** Wider, softer sprite for per-particle glow (drawn under core). Blur + linear-ish stops. */
function getGlowHaloMap() {
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

function collectPixels(
  image: CanvasImageSource,
  srcW: number,
  srcH: number,
): SamplePixel[] {
  const maxDim = 300
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

  const out: SamplePixel[] = []
  for (let y = 0; y < h; y += SAMPLE_STEP) {
    for (let x = 0; x < w; x += SAMPLE_STEP) {
      const i = (y * w + x) * 4
      const a = data[i + 3] / 255
      if (a < 0.05) continue
      if (a < 0.35 && Math.random() > a * 2.2) continue
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

function buildParticleGeometry(
  pixels: SamplePixel[],
  sizeW: number,
  sizeH: number,
): THREE.BufferGeometry {
  let picked = pixels
  if (pixels.length > MAX_PARTICLES) {
    shuffleInPlace(pixels)
    picked = pixels.slice(0, MAX_PARTICLES)
  }

  const n = picked.length
  const positions = new Float32Array(n * 3)
  const colors = new Float32Array(n * 3)
  const spread = 0.038
  const zSpread = 0.09

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

type ParticleData = {
  geometry: THREE.BufferGeometry
  basePositions: Float32Array
  phases: Float32Array
  count: number
  circleMap: THREE.CanvasTexture
  glowMap: THREE.CanvasTexture
}

export function Logo3D() {
  const texture = useTexture('/logo.png')
  const { gl } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  const glowMaterialRef = useRef<THREE.PointsMaterial>(null)
  const pointerActiveRef = useRef(true)

  const particleData = useMemo((): ParticleData => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
    const img = texture.image as HTMLImageElement | ImageBitmap
    const srcW = 'naturalWidth' in img ? img.naturalWidth : img.width
    const srcH = 'naturalHeight' in img ? img.naturalHeight : img.height
    const aspect = srcW / srcH
    const sizeW = BASE_WIDTH
    const sizeH = BASE_WIDTH / aspect

    const pixels = collectPixels(img, srcW, srcH)
    const geo = buildParticleGeometry(pixels, sizeW, sizeH)
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
  }, [texture])

  useEffect(() => {
    const el = gl.domElement
    const onEnter = () => {
      pointerActiveRef.current = true
    }
    const onLeave = () => {
      pointerActiveRef.current = false
    }
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [gl])

  useFrame((state) => {
    const g = groupRef.current
    const mat = materialRef.current
    const glowMat = glowMaterialRef.current
    const t = state.clock.elapsedTime
    const px = pointerActiveRef.current ? state.pointer.x : 0
    const py = pointerActiveRef.current ? state.pointer.y : 0

    const { geometry, basePositions, phases, count } = particleData
    const pos = geometry.attributes.position.array as Float32Array
    const hover = pointerActiveRef.current ? Math.min(1, Math.hypot(px, py)) : 0
    // Keep silhouette: no radial scale, tiny XY jitter only; most motion on Z (depth).
    const ampXY = 0.0032 * (1 + hover * 0.4)
    const ampXYHi = 0.001 * (1 + hover * 0.45)
    const ampZ = 0.036 * (1 + hover * 0.55)
    const ampZHi = 0.014 * (1 + hover * 0.65)

    for (let i = 0; i < count; i++) {
      const ph = phases[i]
      const i3 = i * 3
      const bx = basePositions[i3]
      const by = basePositions[i3 + 1]
      const bz = basePositions[i3 + 2]
      pos[i3] =
        bx +
        Math.sin(t * 1.82 + ph) * ampXY +
        Math.sin(t * 4.05 + ph * 3.1) * ampXYHi
      pos[i3 + 1] =
        by +
        Math.cos(t * 1.48 + ph * 1.71) * ampXY +
        Math.cos(t * 3.72 + ph * 2.35) * ampXYHi
      pos[i3 + 2] =
        bz +
        Math.sin(t * 2.25 + ph * 2.05) * ampZ +
        Math.sin(t * 5.15 + ph * 3.9) * ampZHi
    }
    geometry.attributes.position.needsUpdate = true

    if (g) {
      const tx = px * 0.48
      const ty = py * 0.32
      g.position.x = THREE.MathUtils.lerp(g.position.x, tx, 0.12)
      g.position.y = THREE.MathUtils.lerp(g.position.y, ty, 0.12)
      const aimRy = px * 0.16
      const aimRx = -py * 0.11
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, aimRy, 0.1)
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, aimRx, 0.1)
      g.scale.setScalar(1)
    }

    if (mat) {
      const breathe = Math.sin(t * 0.9) * 0.0032
      const hoverSize = hover * 0.014
      mat.size = 0.026 + breathe + hoverSize
      const targetOp = THREE.MathUtils.clamp(0.96 + hover * 0.22, 0.92, 1)
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOp, 0.12)
    }

    if (glowMat && mat) {
      const breathe = Math.sin(t * 0.9 + 0.4) * 0.006
      const hoverSize = hover * 0.044
      glowMat.size = mat.size * GLOW_SIZE_MULT + breathe + hoverSize
      const gOp = THREE.MathUtils.clamp(0.9 + hover * 0.28, 0.82, 1)
      glowMat.opacity = THREE.MathUtils.lerp(glowMat.opacity, gOp, 0.1)
    }
  })

  return (
    <group ref={groupRef}>
      <points geometry={particleData.geometry} frustumCulled={false} renderOrder={-1}>
        <pointsMaterial
          ref={glowMaterialRef}
          map={particleData.glowMap}
          vertexColors
          transparent
          depthWrite={false}
          depthTest
          blending={THREE.AdditiveBlending}
          size={0.128}
          sizeAttenuation
          toneMapped={false}
          opacity={0.96}
          color="#ebe4ff"
        />
      </points>
      <points geometry={particleData.geometry} frustumCulled={false} renderOrder={0}>
        <pointsMaterial
          ref={materialRef}
          map={particleData.circleMap}
          vertexColors
          transparent
          depthWrite={false}
          depthTest
          blending={THREE.AdditiveBlending}
          size={0.028}
          sizeAttenuation
          toneMapped={false}
          opacity={1}
        />
      </points>
    </group>
  )
}
