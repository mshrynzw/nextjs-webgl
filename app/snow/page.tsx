"use client"
import { NextPage } from "next"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import * as dat from "lil-gui"
import Header from "@/components/Header"
import Main from "@/components/Main"
import vertexShader from "@/app/snow/shaders/vertexShader.glsl"
import fragmentShader from "@/app/snow/shaders/fragmentShader.glsl"

const Page : NextPage = () => {
  const canvasRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLElement
    if (!canvas) return
    canvasRef.current = canvas

    const gui = new dat.GUI({ width : 300 })
    gui.show(false)

    const scene = new THREE.Scene()

    const sizes = {
      width : innerWidth,
      height : innerHeight
    }
    const camera = new THREE.PerspectiveCamera(
      45,
      sizes.width / sizes.height,
      0.1,
      150
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({
      canvas : canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(window.devicePixelRatio)

    const particleCount = 10000
    const positions = new Float32Array(particleCount * 3)
    const snowSizes = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      snowSizes[i] = Math.random() * 1.5 + 1.5
      positions[i * 3] = Math.random() * 200 - 100
      positions[i * 3 + 1] = Math.random() * 200 - 100
      positions[i * 3 + 2] = Math.random() * 200 - 100
    }

    const snowShaderGeometry = new THREE.BufferGeometry()
    snowShaderGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    snowShaderGeometry.setAttribute("size", new THREE.BufferAttribute(snowSizes, 1))

    const snowShaderMaterial = new THREE.ShaderMaterial({
      uniforms : {
        pointTexture : { value : new THREE.TextureLoader().load("/textures/snowflake.png") },
        size : { value : 2.0 }
      },
      vertexShader : vertexShader,
      fragmentShader : fragmentShader,
      transparent : true,
      depthTest : false
    })
    const snow = new THREE.Points(snowShaderGeometry, snowShaderMaterial)
    scene.add(snow)

    const render = () => {
      const positions = snow.geometry.attributes.position.array

      for (let i = 0; i < particleCount; i++) {
        // 横方向のランダムな揺れ
        positions[i * 3] += Math.sin(positions[i * 3 + 1] * 0.01) * 0.1

        // 下に落ちる動き
        positions[i * 3 + 1] -= 0.5

        // 水平方向のランダムな揺れ
        positions[i * 3 + 2] += Math.cos(positions[i * 3 + 1] * 0.01) * 0.1

        // 地面に到達したらリセット
        if (positions[i * 3 + 1] < -100) {
          positions[i * 3 + 1] = 100
          positions[i * 3] = Math.random() * 200 - 100
          positions[i * 3 + 2] = Math.random() * 200 - 100
        }
      }

      snow.geometry.attributes.position.needsUpdate = true
      snow.geometry.attributes.size.needsUpdate = true

      window.requestAnimationFrame(render)
      renderer.render(scene, camera)
    }
    render()

    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(window.devicePixelRatio)
    })
  }, [])

  return (
    <>
      <canvas id="canvas"></canvas>
      <Header className="m-8 rounded-lg"/>
      <Main className="shadow-2xl p-8 rounded-lg"/>
    </>
  )
}

export default Page