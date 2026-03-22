import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Effect, BlendFunction } from 'postprocessing'
import { SRGBColorSpace, Uniform, Vector2 } from 'three'

const FRAG = /* glsl */ `
uniform vec2 center;
uniform float radius;
uniform float strength;
uniform float aspect;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 c = center;
  vec2 da = vec2((uv.x - c.x) * aspect, uv.y - c.y);
  float dist = length(da);
  float mask = 1.0 - smoothstep(radius * 0.8, radius, dist);
  float m = 1.0 + strength * mask;
  vec2 magUv = c + (uv - c) / max(m, 1.0);
  vec2 sampleUv = mix(uv, magUv, mask);
  sampleUv = clamp(sampleUv, vec2(0.001), vec2(0.999));
  outputColor = texture(inputBuffer, sampleUv);
}
`

export class MagnifyCursorEffect extends Effect {
  constructor({
    blendFunction = BlendFunction.SRC,
    radius = 0.2,
  }: { blendFunction?: BlendFunction; radius?: number } = {}) {
    const uniforms = new Map<string, Uniform<unknown>>([
      ['center', new Uniform(new Vector2(0.5, 0.5))],
      ['radius', new Uniform(radius)],
      ['strength', new Uniform(0)],
      ['aspect', new Uniform(1)],
    ])
    super('MagnifyCursorEffect', FRAG, {
      blendFunction,
      uniforms,
    })
    this.inputColorSpace = SRGBColorSpace
  }
}

type MagnifyCursorProps = {
  /** UV units (~0.12–0.25); circle “lens” size on screen */
  radius?: number
  /** Max zoom amount inside lens (0.4–0.9 typical) */
  strength?: number
}

export function MagnifyCursor({ radius = 0.18, strength = 0.62 }: MagnifyCursorProps) {
  const { pointer, size, gl } = useThree()
  const insideRef = useRef(false)
  const smoothStrRef = useRef(0)

  const effect = useMemo(
    () =>
      new MagnifyCursorEffect({
        blendFunction: BlendFunction.SRC,
        radius,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- single Effect instance; radius updated below
    [],
  )

  useEffect(() => {
    effect.uniforms.get('radius')!.value = radius
  }, [radius, effect])

  useEffect(() => {
    const el = gl.domElement
    const enter = () => {
      insideRef.current = true
    }
    const leave = () => {
      insideRef.current = false
    }
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
      effect.dispose()
    }
  }, [gl, effect])

  useFrame(() => {
    // R3F pointer.y: +1 = viewport top, -1 = bottom (NDC, y-up) — match postprocessing UV (v up)
    const cx = (pointer.x + 1) * 0.5
    const cy = (pointer.y + 1) * 0.5
    effect.uniforms.get('center')!.value.set(cx, cy)
    effect.uniforms.get('aspect')!.value = size.width / Math.max(1, size.height)
    const target = insideRef.current ? strength : 0
    smoothStrRef.current += (target - smoothStrRef.current) * 0.14
    effect.uniforms.get('strength')!.value = smoothStrRef.current
  })

  return <primitive object={effect} dispose={null} />
}
