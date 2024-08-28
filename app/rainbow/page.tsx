"use client"
import { NextPage } from "next"
import { useEffect, useRef } from "react"
import * as dat from "lil-gui"
import * as THREE from "three"
import Header from "@/components/Header"
import Main from "@/components/Main"

// tslint:disable-next-line:no-var-requires
const Perlin = require("perlin.js")

const Rainbow : NextPage = () => {
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
      0.001,
      1000
    )
    // camera.position.x +=1000
    const renderer = new THREE.WebGLRenderer({
      canvas : canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(window.devicePixelRatio)

    // ボックスジオメトリー
    let lineArrTop = []
    let lineArrBottom = []
    const lineNum = 250
    const lineLength = 15
    const segmentNum = 100
    const amplitude = 2.5

    for (let i = 0; i < lineNum; i++) {
      const pointsTop = []
      const pointsBottom = []

      for (let j = 0; j <= segmentNum; j++) {
        const x = ((lineLength / segmentNum) * j) - lineLength / 2
        const y = 0
        const z = i * 0.3 - ((lineNum * 0.3) / 2)

        const p = new THREE.Vector3(x, y, z)
        pointsTop.push(p)
        pointsBottom.push(p)
      }

      const geometryTop = new THREE.BufferGeometry().setFromPoints(pointsTop)
      const geometryBottom = new THREE.BufferGeometry().setFromPoints(pointsBottom)

      const material = new THREE.LineBasicMaterial({ color : 0xffffff })

      const lineTop = new THREE.Line(geometryTop, material)
      lineArrTop[i] = lineTop
      scene.add(lineArrTop[i])

      const lineBottom = new THREE.Line(geometryBottom, material)
      lineBottom.position.y += 5
      lineArrBottom[i] = lineBottom
      scene.add(lineArrBottom[i])
    }

    // ライト
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0xffffff, 0.8)
    pointLight.position.set(0, -1, 5)
    scene.add(pointLight)

    const render = () => {
      camera.position.set(5, 0, 5) // カメラの位置を設定（例: z軸方向に5の位置）
      camera.lookAt(0, 0, -5) // カメラが原点を向くように設定

      for (let i = 0; i < lineNum; i++) {
        const lineTop = lineArrTop[i]
        const lineBottom = lineArrBottom[i]
        const positionsTop = lineTop.geometry.attributes.position.array
        const positionsBottom = lineBottom.geometry.attributes.position.array
        const time = Date.now() / 4000

        for (let j = 0; j <= segmentNum; j++) {
          const x = ((lineLength / segmentNum) * j) - lineLength / 2
          const px = j / (50 + i)
          const py = i / 50 + time
          const y = amplitude * Perlin.perlin2(px, py) - 2
          const z = i * 0.3 - ((lineNum * 0.3) / 2) - 7.5
          positionsTop[j * 3] = x
          positionsTop[j * 3 + 1] = y
          positionsTop[j * 3 + 2] = z
          positionsBottom[j * 3] = x
          positionsBottom[j * 3 + 1] = y
          positionsBottom[j * 3 + 2] = z
        }

        const h = Math.round((i / lineNum) * 360)
        const s = 100
        const l = Math.round((i / lineNum) * 100)
        const color = new THREE.Color(`hsl(${h},${s}%,${l}%)`)

        lineTop.material.color = color
        lineBottom.material.color = color
        lineTop.geometry.attributes.position.needsUpdate = true
        lineBottom.geometry.attributes.position.needsUpdate = true
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

export default Rainbow