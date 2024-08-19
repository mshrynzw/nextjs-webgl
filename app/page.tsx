"use client"
import React from "react"
import { Canvas } from "@react-three/fiber"
import Plane from "@/app/components/Plane"
import { OrthographicCamera } from "@react-three/drei"

const App= ()=> {
  return (
    <Canvas>
      <ambientLight/>
      <Plane/>
      <OrthographicCamera position={[-0.5, 0.5, 0.5]} near={0.1} far={10}/>
    </Canvas>
  )
}

export default App