"use client"
import { NextPage } from "next"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "three-stdlib"

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
      45,
      sizes.width / sizes.height,
      0.1,
      100
    )
    camera.position.setZ(0)

    // Controls
    // const controls = new OrbitControls(camera, canvas)
    // controls.enableDamping = true

    const renderer = new THREE.WebGLRenderer({
      canvas : canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Geometry
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)

    const materialParams = {
      metalness : 1.0,
      roughness : 0.1
    }

    // 立方体
    const cubeMaterial = new THREE.MeshStandardMaterial({
      color : 0x177bd9,
      metalness : materialParams.metalness,
      roughness : materialParams.roughness
    })

    gui.addColor(cubeMaterial, "color").name(" Cube Color")

    gui.add(materialParams, "metalness", 0, 1).onChange(value => {
      cubeMaterial.metalness = value
    }).name("Cube Metalness")

    gui.add(materialParams, "roughness", 0, 1).onChange(value => {
      cubeMaterial.roughness = value
    }).name("Cube Roughness")

    // エッジ
    const edgeMaterial = new THREE.LineBasicMaterial({ color : 0x5fb7dd, linewidth : 2 })

    gui.addColor(edgeMaterial, "color").name(" Cube Color")
    
    // 立方体の配置
    const positions = [
      [1.5, 1.5, 0],
      [1.5, -1.5, 0],
      [-1.5, -1.5, 0],
      [-1.5, 1.5, 0]
    ]
    const distance = 5
    const cubes : THREE.Mesh[] = []

    // 初期の立方体を配置
    const createCubes = (layer : number) => {
      positions.forEach(pos => {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
        cube.position.set(pos[0], pos[1], -layer * distance)
        cube.rotation.z = Math.sin(Math.PI / 4)
        scene.add(cube)
        cubes.push(cube)

        // エッジの作成
        const edges = new THREE.EdgesGeometry(cubeGeometry)
        const edgeLines = new THREE.LineSegments(edges, edgeMaterial)
        edgeLines.position.set(pos[0], pos[1], -layer * distance)
        scene.add(edgeLines)
      })
    }

    // 光源を作成
    const pointLight = new THREE.PointLight(0xffffff, 10000, 1000)
    gui.add(pointLight, "intensity", 0, 10000, 1.0).name("Point Light Intensity")
    scene.add(pointLight)

    // Animation
    let cameraZ = 0
    let layer = 0
    const render = () => {
      cameraZ -= 0.05
      camera.position.z = cameraZ
      pointLight.position.z = cameraZ - 1

      if (cubes.length < 100) {
        layer += 1
        createCubes(layer)
      }

      if (cubes.length > 0 && cubes[0].position.z > camera.position.z) {
        const removedCube = cubes.shift() // 最初の立方体を削除
        if (removedCube) {
          scene.remove(removedCube) // シーンから削除
        }
      }
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