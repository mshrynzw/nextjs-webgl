import React from "react"

interface MainProps {
  className: string
}

const Main: React.FC<MainProps> = ({className})=>{
  return (
    <main className={className}>
      <h1>Dive Into Deep</h1>
      <p>Going deeper into Three.js and Shader</p>
    </main>
  )
}

export default Main