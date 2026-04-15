uniform vec3 uColor;
uniform vec3 uLightDirection;
uniform float uSpecularStrength;
uniform float uSpecularPower;
uniform float uSpecularSecondaryStrength;
uniform float uSpecularSecondaryPower;
uniform float uFresnelStrength;
uniform float uFresnelPower;
varying float vElevation;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec3 vWorldTangent;

void main() {
    vec3 normal = normalize(vWorldNormal);
    if (!gl_FrontFacing) {
        normal *= -1.0;
    }

    vec3 lightDir = normalize(uLightDirection);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float diffuse = max(dot(normal, lightDir), 0.0);

    vec3 tangent = normalize(vWorldTangent - normal * dot(vWorldTangent, normal));
    vec3 bitangent = normalize(cross(normal, tangent));
    vec3 halfDir = normalize(lightDir + viewDir);
    float anisoLobePrimary = pow(max(1.0 - abs(dot(halfDir, tangent)), 0.0), uSpecularPower) * uSpecularStrength;
    float anisoLobeSecondary = pow(max(1.0 - abs(dot(halfDir, bitangent)), 0.0), uSpecularSecondaryPower) * uSpecularSecondaryStrength;
    float ndh = max(dot(normal, halfDir), 0.0);
    float specular = (anisoLobePrimary + anisoLobeSecondary) * ndh;
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), uFresnelPower) * uFresnelStrength;
    float waveShade = clamp(vElevation * 2.0 + 0.5, 0.0, 1.0);

    vec3 base = uColor * (0.35 + diffuse * 0.65);
    vec3 color = base + specular + fresnel + waveShade * 0.12;
    gl_FragColor = vec4(color, 1);
}