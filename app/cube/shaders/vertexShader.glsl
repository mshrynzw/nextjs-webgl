varying vec3 vReflect;
varying vec3 vRefract;
varying float vFresnel;

void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec3 I = worldPosition.xyz - cameraPosition;

    vReflect = reflect(I, normal);
    vRefract = refract(I, normal, 1.0 / 1.5);
    vFresnel = pow(1.0 + dot(normalize(I), normal), 3.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}