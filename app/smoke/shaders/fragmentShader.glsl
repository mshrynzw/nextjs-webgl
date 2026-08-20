varying vec2 vUv;

uniform float uTime;
uniform float uSeed;
uniform float uDensity;
uniform float uRiseSpeed;
uniform float uSway;
uniform float uFadeHeight;
uniform float uBaseWidth;
uniform float uTopWidth;
uniform float uSpreadPower;

// Simplex-ish value noise + fBm for wispy smoke
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = m * p;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = vUv;
    float h = uv.y;

    // Width grows from base (narrow) to top (wide)
    float spread = mix(uBaseWidth, uTopWidth, pow(clamp(h, 0.0, 1.0), uSpreadPower));
    spread = max(spread, 0.05);

    // Horizontal sway grows with height
    float sway =
        sin(h * 2.8 + uTime * 0.7 + uSeed) * uSway * h +
        sin(h * 5.2 - uTime * 0.45 + uSeed * 1.7) * uSway * 0.45 * h +
        (fbm(vec2(h * 1.5 + uSeed, uTime * 0.12)) - 0.5) * uSway * 1.2 * h;

    // Divide by spread so the plume widens as it rises
    float x = ((uv.x - 0.5) * 2.0) / spread + sway;

    // Rising flow + seed offset so left/right differ
    // Scale noise X by spread so wisps stretch sideways near the top
    vec2 noiseUv = vec2(
        x * mix(2.8, 1.4, h) + uSeed * 3.1,
        h * 3.0 - uTime * uRiseSpeed + uSeed
    );

    // Domain warp for curling wisps (stronger upward)
    float warp = fbm(noiseUv * 1.4 + vec2(uSeed, uTime * 0.05));
    noiseUv.x += (warp - 0.5) * mix(0.35, 0.75, h);
    noiseUv.y += (warp - 0.5) * 0.25;

    float n = fbm(noiseUv);
    float detail = fbm(noiseUv * 2.3 + 8.0);
    n = mix(n, n * detail, 0.45);
    n = pow(clamp(n, 0.0, 1.0), 1.55);

    // Soft plume edge; slightly softer when wider
    float soft = mix(0.22, 0.45, h);
    float edge = 1.0 - smoothstep(soft, 1.0, abs(x));

    float topFade = 1.0 - smoothstep(uFadeHeight, 1.0, h);
    float bottomFade = smoothstep(0.0, 0.05, h) * (1.0 - smoothstep(0.92, 1.0, h));

    // Thin out a bit as it spreads so it feels like dissipating smoke
    float spreadThin = mix(1.0, 0.72, clamp((spread - uBaseWidth) / max(uTopWidth - uBaseWidth, 0.001), 0.0, 1.0));

    float alpha = n * edge * topFade * bottomFade * uDensity * spreadThin;
    alpha = clamp(pow(alpha, 0.9), 0.0, 1.0);

    vec3 color = vec3(0.92 + n * 0.08);

    gl_FragColor = vec4(color, alpha);
}
