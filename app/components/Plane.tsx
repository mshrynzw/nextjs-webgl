import React from "react"
import vertex from "@/app/shaders/vertex.glsl"
import fragment from "@/app/shaders/fragment.glsl"

const Plane = () => {
  return (
    <mesh>
      <planeGeometry args={[2, 2]}/>
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
      />
    </mesh>
  )
}

export default Plane