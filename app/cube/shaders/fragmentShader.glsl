uniform samplerCube uEnvMap;
uniform float uTransparentColor;

varying vec3 vReflect;
varying vec3 vRefract;
varying float vFresnel;

void main() {
    vec4 reflectedColor = textureCube(uEnvMap, vReflect);
    vec4 refractedColor = textureCube(uEnvMap, vRefract);

    gl_FragColor = mix(refractedColor, reflectedColor, vFresnel);
    gl_FragColor.a = uTransparentColor;
}