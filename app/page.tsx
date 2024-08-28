"use client"
import { NextPage } from "next"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "three-stdlib"
import vertexShader from "@/app/shaders/vertexShader.glsl"
import fragmentShader from "@/app/shaders/fragmentShader.glsl"

const Home : NextPage = () => {
  const canvasRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLElement
    if (!canvas) return
    canvasRef.current = canvas

    const gui = new dat.GUI({ width : 300 })
    gui.show(true)

    const scene = new THREE.Scene()

    const sizes = {
      width : innerWidth,
      height : innerHeight
    }

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    )
    camera.position.set(0, 0.23, 0)


    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    const renderer = new THREE.WebGLRenderer({
      canvas : canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


    // Geometry
    const geometry = new THREE.PlaneGeometry(10, 10, 512, 512)

    const colorObject : any = {}
    colorObject.depthColor = "#b8e6ff"
    colorObject.surfaceColor = "#66c1f9"

    const material = new THREE.ShaderMaterial({
      vertexShader : vertexShader,
      fragmentShader : fragmentShader,
      uniforms : {
        uWaveLength : { value : 0.38 },
        uFrequency : { value : new THREE.Vector2(6.6, 3.5) },
        uTime : { value : 0 },
        uWaveSpeed : { value : 0.75 },
        uDepthColor : { value : new THREE.Color(colorObject.depthColor) },
        uSurfaceColor : { value : new THREE.Color(colorObject.surfaceColor) },
        uColorOffset : { value : 0.03 },
        uColorMultiplier : { value : 9.0 },
        uSmallWaveElevation : { value : 0.15 },
        uSmallWaveFrequency : { value : 3.0 },
        uSmallWaveSpeed : { value : 0.2 }
      }
    })

    gui
    .add(material.uniforms.uWaveLength, "value")
    .min(0)
    .max(1)
    .step(0.001)
    .name("uWaveLength")

    gui
    .add(material.uniforms.uFrequency.value, "x")
    .min(0)
    .max(10)
    .step(0.001)
    .name("uFrequencyX")

    gui
    .add(material.uniforms.uFrequency.value, "y")
    .min(0)
    .max(10)
    .step(0.001)
    .name("uFrequencyY")

    gui
    .add(material.uniforms.uWaveSpeed, "value")
    .min(0)
    .max(4)
    .step(0.001)
    .name("uWaveSpeed")

    gui
    .add(material.uniforms.uColorOffset, "value")
    .min(0)
    .max(1)
    .step(0.001)
    .name("uColorOffset")

    gui
    .add(material.uniforms.uColorMultiplier, "value")
    .min(0)
    .max(10)
    .step(0.001)
    .name("uColorMultiplier")

    gui
    .add(material.uniforms.uSmallWaveElevation, "value")
    .min(0)
    .max(1)
    .step(0.001)
    .name("uSmallWaveElevation")

    gui
    .add(material.uniforms.uSmallWaveFrequency, "value")
    .min(0)
    .max(30)
    .step(0.001)
    .name("uSmallWaveFrequency")

    gui
    .add(material.uniforms.uSmallWaveSpeed, "value")
    .min(0)
    .max(4)
    .step(0.001)
    .name("uSmallWaveSpeed")

    gui.addColor(colorObject, "depthColor").onChange(() => {
      material.uniforms.uDepthColor.value.set(colorObject.depthColor)
    })

    gui.addColor(colorObject, "surfaceColor").onChange(() => {
      material.uniforms.uSurfaceColor.value.set(colorObject.surfaceColor)
    })

    // Mesh
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.set(0, 0, 0)
    scene.add(mesh)

    // Anima
    const clock = new THREE.Clock()
    const render = () => {
      const elapsedTime = clock.getElapsedTime()
      material.uniforms.uTime.value = elapsedTime
      camera.position.x = Math.sin(elapsedTime * 0.2) * 2.0
      camera.position.z = Math.cos(elapsedTime * 0.2) * 2.0

      camera.lookAt(Math.cos(elapsedTime), Math.sin(elapsedTime) * 0.5, Math.sin(elapsedTime) * 0.4)

      scene.add(camera)
      controls.update()
      window.requestAnimationFrame(render)
      renderer.render(scene, camera)
    }
    render()

    // Browser
    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
  }, [])

  return (
    <>
      <canvas id="canvas"></canvas>
      <header>
        <h3 className="logo">Shader.com</h3>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </header>

      <main>
        <h1>Dive Into Deep</h1>
        <p>Going deeper into Three.js...</p>
      </main>
    </>
  )
}

export default Home
