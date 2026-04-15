uniform vec2 uFrequency;
uniform float uTime;
uniform float uAmplitude;
uniform float uDetailAmplitude;
uniform float uSpeed;
uniform float uAmpDecay;
uniform float uNoiseStrength;

varying float vElevation;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec3 vWorldTangent;

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
}

float getElevation(vec2 xy, float t) {
    vec2 flowDir = normalize(vec2(1.0, -1.0));
    vec2 crossDir = normalize(vec2(1.0, 1.0));
    vec2 scaledXY = xy * uFrequency;
    vec2 uv = xy * 0.5 + 0.5;

    float primaryPhase = dot(scaledXY, flowDir);
    float mediumPhase = dot(scaledXY, flowDir * 1.8);
    float detailPhase = dot(scaledXY, flowDir * 4.2);
    float crossPhase = dot(scaledXY, crossDir * 0.4);
    float phaseNoise = (hash21(xy * 9.0 + t * 0.15) - 0.5) * 2.0;
    float diagonalProgress = dot(uv, normalize(vec2(1.0, 1.0)));
    float ampMask = 1.0 - smoothstep(0.15, 1.25, diagonalProgress);
    float amp = uAmplitude * mix(1.0, 0.2, uAmpDecay * (1.0 - ampMask));

    float elevation = sin(primaryPhase - t * 0.6) * amp;
    elevation += sin(mediumPhase - t * 1.1) * (amp * 0.45);
    elevation += sin(detailPhase - t * 2.2 + crossPhase + phaseNoise * uNoiseStrength * 4.0) * (uDetailAmplitude * 0.7);
    return elevation;
}

void main() {
    vec3 localPosition = position;
    float t = uTime * uSpeed;
    float epsilon = 0.01;

    float elevation = getElevation(localPosition.xy, t);
    localPosition.z += elevation;

    vec3 nearbyX = vec3(position.x + epsilon, position.y, 0.0);
    vec3 nearbyY = vec3(position.x, position.y + epsilon, 0.0);
    nearbyX.z = getElevation(nearbyX.xy, t);
    nearbyY.z = getElevation(nearbyY.xy, t);

    vec3 tangent = normalize(nearbyX - vec3(position.x, position.y, elevation));
    vec3 bitangent = normalize(nearbyY - vec3(position.x, position.y, elevation));
    vec3 localNormal = normalize(cross(tangent, bitangent));

    vec4 modelPosition = modelMatrix * vec4(localPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
    vElevation = elevation;
    vWorldPosition = modelPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * localNormal);
    vWorldTangent = normalize(mat3(modelMatrix) * vec3(normalize(vec2(1.0, -1.0)), 0.0));
}