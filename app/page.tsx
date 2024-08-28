"use client"
import { NextPage } from "next"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import * as dat from "lil-gui"
import { Vector3 } from "three"
import Header from "@/components/Header"
import Main from "@/components/Main"

// tslint:disable-next-line:no-var-requires
const Perlin = require("perlin.js")

const Page : NextPage = () => {
  const canvasRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLElement
    if (!canvas) return
    canvasRef.current = canvas

    const gui = new dat.GUI({ width : 300 })
    gui.show(false)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000000, 30, 150)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0xebf2ff, 500, 100)
    scene.add(pointLight)

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

    const renderer = new THREE.WebGLRenderer({
      canvas : canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(window.devicePixelRatio)

    let pointsArray = [
      [68.5, 185.5],
      [1, 262.5],
      [270.9, 281.9],
      [345.5, 212.8],
      [178, 155.7],
      [240.3, 72.3],
      [153.4, 0.6],
      [52.6, 53.3],
      [68.5, 185.5]
    ]

    let points : Vector3[] = []
    for (let i = 0; i < pointsArray.length; i++) {
      const x = pointsArray[i][0]
      const y = Math.random() * 100
      const z = pointsArray[i][1]
      points.push(new THREE.Vector3(x, y, z))
    }
    const path = new THREE.CatmullRomCurve3(points)
    path.closed = true

    const tubeDetail = 1000
    const circlesDetail = 8
    const radius = 8
    const frames = path.computeFrenetFrames(tubeDetail, true)

    for (let i = 0; i < tubeDetail; i++) {
      const normal = frames.normals[i]
      const binormal = frames.binormals[i]
      const index = i / tubeDetail

      const p = path.getPointAt(index)
      const circle = new THREE.BufferGeometry()

      const positions : number[] = []
      for (let j = 0; j <= circlesDetail; j++) {
        // const position = p.clone()
        let angle = (j / circlesDetail) * Math.PI * 2
        angle += Perlin.perlin2(index * 10, 0)
        const sin = Math.sin(angle)
        const cos = -Math.cos(angle)

        const normalPoint = new THREE.Vector3(0, 0, 0)
        normalPoint.x = (cos * normal.x + sin * binormal.x)
        normalPoint.y = (cos * normal.y + sin * binormal.y)
        normalPoint.z = (cos * normal.z + sin * binormal.z)

        normalPoint.multiplyScalar(radius)
        positions.push(normalPoint.x, normalPoint.y, normalPoint.z)
      }
      circle.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))

      const material = new THREE.LineBasicMaterial({
        color : new THREE.Color("hsl(" + (Perlin.perlin2(index * 10, 0) * 60 + 300) + ",50%,50%)")
      })

      const line = new THREE.Line(circle, material)
      line.position.set(p.x, p.y, p.z)
      scene.add(line)
    }

    let percentage = 0
    const render = () => {
      percentage += 0.001
      const p1 = path.getPointAt(percentage % 1)
      const p2 = path.getPointAt((percentage + 0.005) % 1)
      camera.position.set(p1.x, p1.y, p1.z)
      camera.lookAt(p2)
      pointLight.position.set(p2.x, p2.y, p2.z)

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