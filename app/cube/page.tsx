"use client"
import { NextPage } from "next"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import * as dat from "lil-gui"
import vertexShader from "@/app/cube/shaders/vertexShader.glsl"
import fragmentShader from "@/app/cube/shaders/fragmentShader.glsl"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import Header from "@/components/Header"
import Main from "@/components/Main"

const Page : NextPage = () => {
  const canvasRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLElement
    if (!canvas) return
    canvasRef.current = canvas

    const gui = new dat.GUI({ width : 300 })
    gui.show(false)

    const scene = new THREE.Scene()
    const textureLoader = new THREE.TextureLoader()
    scene.background = textureLoader.load("/images/cube-background.jpg")

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

    const renderer = new THREE.WebGLRenderer({
      canvas : canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.0, 5.0, 0.85)
    composer.addPass(bloomPass)

    // Geometry
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)

    const loader = new THREE.CubeTextureLoader()
    const cubeTexture = loader.load([
      "/textures/glass.jpg",
      "/textures/glass.jpg",
      "/textures/glass.jpg",
      "/textures/glass.jpg",
      "/textures/glass.jpg",
      "/textures/glass.jpg"
    ])

    const cubeMaterial = new THREE.ShaderMaterial({
      vertexShader : vertexShader,
      fragmentShader : fragmentShader,
      transparent : true, // 透明を有効にする
      uniforms : {
        uTexture : { value : cubeTexture },
        uTransparentColor : { value : 0.9 }
      }
    })

    gui
    .add(cubeMaterial.uniforms.uTransparentColor, "value")
    .min(0)
    .max(1)
    .step(0.001)
    .name("Transparent Color")

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
    const edges : THREE.LineSegments[] = []

    // 初期の立方体を配置
    const createCubes = (layer : number) => {
      positions.forEach(pos => {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
        cube.position.set(pos[0], pos[1], -layer * distance)
        cube.rotation.z = Math.sin(Math.PI / 4)
        scene.add(cube)
        cubes.push(cube)

        // エッジの作成
        const edgeGeometry = new THREE.EdgesGeometry(cubeGeometry)
        const edge = new THREE.LineSegments(edgeGeometry, edgeMaterial)
        edge.position.set(pos[0], pos[1], -layer * distance)
        scene.add(edge)
        edges.push(edge)
      })
    }

    // Animation
    let cameraZ = 0
    let layer = 0
    const render = () => {
      cameraZ -= 0.05
      camera.position.z = cameraZ

      if (cubes.length < 100) {
        layer += 1
        createCubes(layer)
      }

      if (cubes.length > 0 && cubes[0].position.z > camera.position.z) {
        const removedCube = cubes.shift()
        if (removedCube) {
          scene.remove(removedCube)
        }
      }

      if (edges.length > 0 && edges[0].position.z > camera.position.z) {
        const removedEdge = edges.shift()
        if (removedEdge) {
          scene.remove(removedEdge)
        }
      }

      window.requestAnimationFrame(render)
      renderer.render(scene, camera)
      composer.render()
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

      composer.setSize(sizes.width, sizes.height)
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