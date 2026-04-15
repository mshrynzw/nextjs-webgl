"use client"
import { NextPage } from "next"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import * as dat from "lil-gui"
import vertexShader from "@/app/silk/shaders/vertexShader.glsl"
import fragmentShader from "@/app/silk/shaders/fragmentShader.glsl"
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

    const sizes = {
      width : innerWidth,
      height : innerHeight,
    }

    // Camera
    const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        0.1,
        100
    );
    camera.position.set(0, 0, 0.5);
    scene.add(camera);
    gui.add(camera.position, "z").min(0.1).max(10).step(0.001).name("cameraZ")

    // Controls
    // const controls = new OrbitControls(camera, canvas);
    // controls.enableDamping = true;
    const renderer = new THREE.WebGLRenderer({
      canvas : canvas,
      antialias: true,
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Geometry
    const geometry = new THREE.PlaneGeometry(2, 2, 256, 256);

    const debugParams = {
      amplitude: 0.2,
      detailAmplitude: 0.02,
      ampDecay: 0.892,
      noiseStrength: 0.00,
      speed: 3.0,
      lightX: -0.015,
      lightY: 0.007,
      lightZ: -0.000,
      specularStrength: 0.45,
      specularPower: 2,
      specularSecondaryStrength: 0.943,
      specularSecondaryPower: 13,
      fresnelStrength: 0.25,
      fresnelPower: 3.0,
    }

    // Material
    const material = new THREE.ShaderMaterial(
        {
            vertexShader : vertexShader,
            fragmentShader : fragmentShader,
            transparent : true,
            side : THREE.DoubleSide,
            uniforms : {
                uFrequency : { value : new THREE.Vector2(10, 20) },
                uTime : { value : 0 },
                uColor : { value : new THREE.Color("#ffffff") },
                uAmplitude : { value : debugParams.amplitude },
                uDetailAmplitude : { value : debugParams.detailAmplitude },
                uAmpDecay : { value : debugParams.ampDecay },
                uNoiseStrength : { value : debugParams.noiseStrength },
                uSpeed : { value : debugParams.speed },
                uLightDirection : { value : new THREE.Vector3(debugParams.lightX, debugParams.lightY, debugParams.lightZ).normalize() },
                uSpecularStrength : { value : debugParams.specularStrength },
                uSpecularPower : { value : debugParams.specularPower },
                uSpecularSecondaryStrength : { value : debugParams.specularSecondaryStrength },
                uSpecularSecondaryPower : { value : debugParams.specularSecondaryPower },
                uFresnelStrength : { value : debugParams.fresnelStrength },
                uFresnelPower : { value : debugParams.fresnelPower },
            }
        }
    );
    const updateLightDirection = () => {
      material.uniforms.uLightDirection.value
        .set(debugParams.lightX, debugParams.lightY, debugParams.lightZ)
        .normalize()
    }

    gui.add(material.uniforms.uFrequency.value, "x").min(0).max(20).step(0.001).name("uFrequencyX")
    gui.add(material.uniforms.uFrequency.value, "y").min(0).max(20).step(0.001).name("uFrequencyY")
    gui
      .add(debugParams, "amplitude")
      .min(0)
      .max(0.2)
      .step(0.001)
      .name("amplitude")
      .onChange((value: number) => { material.uniforms.uAmplitude.value = value })
    gui
      .add(debugParams, "detailAmplitude")
      .min(0)
      .max(0.1)
      .step(0.001)
      .name("detailAmp")
      .onChange((value: number) => { material.uniforms.uDetailAmplitude.value = value })
    gui
      .add(debugParams, "ampDecay")
      .min(0)
      .max(1)
      .step(0.001)
      .name("ampDecay")
      .onChange((value: number) => { material.uniforms.uAmpDecay.value = value })
    gui
      .add(debugParams, "noiseStrength")
      .min(0)
      .max(0.5)
      .step(0.001)
      .name("noise")
      .onChange((value: number) => { material.uniforms.uNoiseStrength.value = value })
    gui
      .add(debugParams, "speed")
      .min(0)
      .max(3)
      .step(0.001)
      .name("speed")
      .onChange((value: number) => { material.uniforms.uSpeed.value = value })
    gui
      .add(debugParams, "lightX")
      .min(-2)
      .max(2)
      .step(0.001)
      .name("lightX")
      .onChange(updateLightDirection)
    gui
      .add(debugParams, "lightY")
      .min(-2)
      .max(2)
      .step(0.001)
      .name("lightY")
      .onChange(updateLightDirection)
    gui
      .add(debugParams, "lightZ")
      .min(-2)
      .max(2)
      .step(0.001)
      .name("lightZ")
      .onChange(updateLightDirection)
    gui
      .add(debugParams, "specularStrength")
      .min(0)
      .max(2)
      .step(0.001)
      .name("specular")
      .onChange((value: number) => { material.uniforms.uSpecularStrength.value = value })
    gui
      .add(debugParams, "specularPower")
      .min(1)
      .max(200)
      .step(1)
      .name("specPower")
      .onChange((value: number) => { material.uniforms.uSpecularPower.value = value })
    gui
      .add(debugParams, "specularSecondaryStrength")
      .min(0)
      .max(2)
      .step(0.001)
      .name("spec2")
      .onChange((value: number) => { material.uniforms.uSpecularSecondaryStrength.value = value })
    gui
      .add(debugParams, "specularSecondaryPower")
      .min(1)
      .max(200)
      .step(1)
      .name("specPow2")
      .onChange((value: number) => { material.uniforms.uSpecularSecondaryPower.value = value })
    gui
      .add(debugParams, "fresnelStrength")
      .min(0)
      .max(1)
      .step(0.001)
      .name("fresnel")
      .onChange((value: number) => { material.uniforms.uFresnelStrength.value = value })
    gui
      .add(debugParams, "fresnelPower")
      .min(0.5)
      .max(8)
      .step(0.001)
      .name("fresnelPow")
      .onChange((value: number) => { material.uniforms.uFresnelPower.value = value })

    // Mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    /**
     * Animate
     */
    const clock = new THREE.Clock();

    const animate = () => {
        //時間取得
        const elapsedTime = clock.getElapsedTime();
        material.uniforms.uTime.value = elapsedTime;
        // controls.update();
        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
    };

    animate();

    // ブラウザのリサイズ操作
    const handleResize = () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", handleResize)

    // クリーンアップ
    return () => {
      window.removeEventListener("resize", handleResize)
      // window.removeEventListener("mousemove", handleMouseMove)
    }
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