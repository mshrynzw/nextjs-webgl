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


    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    const renderer = new THREE.WebGLRenderer({
      canvas : canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


    // Geometry

    // Mesh

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
