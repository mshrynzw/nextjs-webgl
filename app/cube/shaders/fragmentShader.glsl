uniform samplerCube uTexture;
uniform float uTransparentColor;

varying vec3 vReflect;
varying vec3 vRefract;
varying float vFresnel;

void main() {
    vec4 reflectedColor = textureCube(uTexture, vReflect);
    vec4 refractedColor = textureCube(uTexture, vRefract);

    gl_FragColor = mix(refractedColor, reflectedColor, vFresnel);
    gl_FragColor.a = uTransparentColor;
}