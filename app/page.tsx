"use client"
import { NextPage } from "next"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "three-stdlib"
import vertexShader from "@/app/shaders/vertexShader.glsl"
import fragmentShader from "@/app/shaders/fragmentvertexShader.glsl"

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
    camera.position.set(0.2, 0.7, 0.7)
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    const renderer = new THREE.WebGLRenderer({
      canvas : canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(window.devicePixelRatio)

    // TODO: Edit
    // Geometry
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)
    // Material
    // const material = new THREE.MeshBasicMaterial()
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    })
    // Mesh
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = -Math.PI / 2
    scene.add(mesh)
    // gui.addColor(material, "color")

    // TODO: Edit
    // ライト
    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    // scene.add(ambientLight)
    // const pointLight = new THREE.PointLight(0xffffff, 0.2)
    // pointLight.position.set(1, 2, 3)
    // scene.add(pointLight)

    // アニメーション
    const clock = new THREE.Clock();
    const render = () => {
      const elapsedTime = clock.getElapsedTime();
      controls.update();
      window.requestAnimationFrame(render)
      renderer.render(scene, camera)
    }
    render()

    // ブラウザのリサイズ操作
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
    </>
  )
}

export default Home
