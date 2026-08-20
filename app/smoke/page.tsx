"use client"
import { NextPage } from "next"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import * as dat from "lil-gui"
import vertexShader from "@/app/smoke/shaders/vertexShader.glsl"
import fragmentShader from "@/app/smoke/shaders/fragmentShader.glsl"
import Header from "@/components/Header"
import Main from "@/components/Main"

const Page: NextPage = () => {
  const canvasRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLElement
    if (!canvas) return
    canvasRef.current = canvas

    const gui = new dat.GUI({ width: 300 })
    gui.show(true)

    const scene = new THREE.Scene()

    const sizes = {
      width: innerWidth,
      height: innerHeight,
    }

    const camera = new THREE.PerspectiveCamera(
      45,
      sizes.width / sizes.height,
      0.1,
      100
    )
    camera.position.set(0, 0, 5)
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 1)

    const smokeParams = {
      density: 0.99,
      riseSpeed: 0.17,
      sway: 0.1,
      fadeHeight: 0.25,
      baseWidth: 0.0005,
      topWidth: 1.8,
      spreadPower: 0.2,
    }

    const createSmokeMaterial = (seed: number) =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uSeed: { value: seed },
          uDensity: { value: smokeParams.density },
          uRiseSpeed: { value: smokeParams.riseSpeed },
          uSway: { value: smokeParams.sway },
          uFadeHeight: { value: smokeParams.fadeHeight },
          uBaseWidth: { value: smokeParams.baseWidth },
          uTopWidth: { value: smokeParams.topWidth },
          uSpreadPower: { value: smokeParams.spreadPower },
        },
      })

    const leftMaterial = createSmokeMaterial(1.7)
    const rightMaterial = createSmokeMaterial(4.3)

    const planeGeometry = new THREE.PlaneGeometry(1, 1, 1, 1)
    const leftSmoke = new THREE.Mesh(planeGeometry, leftMaterial)
    const rightSmoke = new THREE.Mesh(planeGeometry, rightMaterial)
    scene.add(leftSmoke)
    scene.add(rightSmoke)

    const layoutSmokes = () => {
      const aspect = sizes.width / sizes.height
      const isPortrait = aspect < 1

      // Viewport half-width at z=0 for this camera
      const vFov = (camera.fov * Math.PI) / 180
      const viewHeight = 2 * Math.tan(vFov / 2) * camera.position.z
      const viewWidth = viewHeight * aspect

      const plumeHeight = viewHeight * (isPortrait ? 0.95 : 0.92)
      // Wider plane so the expanding top has room to show
      const plumeWidth = viewHeight * (isPortrait ? 0.72 : 0.68)
      const sideOffset = viewWidth * (isPortrait ? 0.3 : 0.34)
      const yOffset = -viewHeight * 0.02

      leftSmoke.scale.set(plumeWidth, plumeHeight, 1)
      rightSmoke.scale.set(plumeWidth, plumeHeight, 1)
      leftSmoke.position.set(-sideOffset, yOffset, 0)
      rightSmoke.position.set(sideOffset, yOffset, 0)
    }
    layoutSmokes()

    const syncBoth = (key: string, v: number) => {
      leftMaterial.uniforms[key].value = v
      rightMaterial.uniforms[key].value = v
    }

    gui.add(smokeParams, "density", 0.2, 3, 0.01).name("密度").onChange((v: number) => syncBoth("uDensity", v))
    gui.add(smokeParams, "riseSpeed", 0.05, 1, 0.01).name("上昇速度").onChange((v: number) => syncBoth("uRiseSpeed", v))
    gui.add(smokeParams, "sway", 0, 0.8, 0.01).name("揺れ").onChange((v: number) => syncBoth("uSway", v))
    gui.add(smokeParams, "fadeHeight", 0.2, 0.95, 0.01).name("上部フェード").onChange((v: number) => syncBoth("uFadeHeight", v))
    gui.add(smokeParams, "baseWidth", 0.00001, 0.6, 0.00001).name("下の幅").onChange((v: number) => syncBoth("uBaseWidth", v))
    gui.add(smokeParams, "topWidth", 0.4, 2.0, 0.01).name("上の幅").onChange((v: number) => syncBoth("uTopWidth", v))
    gui.add(smokeParams, "spreadPower", 0.2, 2.5, 0.01).name("広がり曲線").onChange((v: number) => syncBoth("uSpreadPower", v))

    const clock = new THREE.Clock()
    let rafId = 0

    const animate = () => {
      const t = clock.getElapsedTime()
      leftMaterial.uniforms.uTime.value = t
      rightMaterial.uniforms.uTime.value = t
      renderer.render(scene, camera)
      rafId = window.requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      layoutSmokes()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.cancelAnimationFrame(rafId)
      scene.remove(leftSmoke)
      scene.remove(rightSmoke)
      planeGeometry.dispose()
      leftMaterial.dispose()
      rightMaterial.dispose()
      renderer.dispose()
      gui.destroy()
    }
  }, [])

  return (
    <>
      <canvas id="canvas"></canvas>
      <Header className="m-8 rounded-lg" />
      <Main className="shadow-2xl p-8 rounded-lg" />
    </>
  )
}

export default Page
