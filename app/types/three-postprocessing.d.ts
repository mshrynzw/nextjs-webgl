declare module 'three/examples/jsm/postprocessing/EffectComposer' {
  import { WebGLRenderer } from 'three';
  import { Pass } from 'three/examples/jsm/postprocessing/Pass';

  export class EffectComposer {
    constructor(renderer: WebGLRenderer);
    addPass(pass: Pass): void; // addPassメソッドを追加
    // 必要に応じて他のメソッドやプロパティを追加
  }
}

declare module 'three/examples/jsm/postprocessing/Pass' {
  import { WebGLRenderTarget } from 'three';
  export class Pass {
    constructor();
    render(renderer: any, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget, delta: number): void;
    // 必要に応じて他のメソッドやプロパティを追加
  }
}

declare module 'three/examples/jsm/postprocessing/RenderPass' {
  import { Scene, Camera } from 'three';
  export class RenderPass {
    constructor(scene: Scene, camera: Camera);
    // 必要に応じて他のメソッドやプロパティを追加
  }
}

declare module 'three/examples/jsm/postprocessing/UnrealBloomPass' {
  import { Vector2 } from 'three';
  export class UnrealBloomPass {
    constructor(size: Vector2, strength: number, radius: number, threshold: number);
    // 必要に応じて他のメソッドやプロパティを追加
  }
}