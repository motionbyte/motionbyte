import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { ParticleData } from './particleLogoCore'
import { GLOW_SIZE_MULT } from './particleLogoCore'

type ParticlePointsGroupProps = {
  particleData: ParticleData
  /** Default matches Logo3D core sprite size */
  corePointSize?: number
  /** Glow layer base size multiplier uses GLOW_SIZE_MULT × core */
  glowPointSize?: number
  /** Multiplier from core point size to glow halo size (default = logo pipeline) */
  glowSizeMult?: number
}

export function ParticlePointsGroup({
  particleData,
  corePointSize = 0.026,
  glowPointSize = 0.128,
  glowSizeMult = GLOW_SIZE_MULT,
}: ParticlePointsGroupProps) {
  const { gl } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  const glowMaterialRef = useRef<THREE.PointsMaterial>(null)
  const pointerActiveRef = useRef(true)

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
      mat.size = corePointSize + breathe + hoverSize
      const targetOp = THREE.MathUtils.clamp(0.96 + hover * 0.22, 0.92, 1)
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOp, 0.12)
    }

    if (glowMat && mat) {
      const breathe = Math.sin(t * 0.9 + 0.4) * 0.006
      const hoverSize = hover * 0.044
      glowMat.size = mat.size * glowSizeMult + breathe + hoverSize
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
          size={glowPointSize}
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
          size={corePointSize}
          sizeAttenuation
          toneMapped={false}
          opacity={1}
        />
      </points>
    </group>
  )
}
