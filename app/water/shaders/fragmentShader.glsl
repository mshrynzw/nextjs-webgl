precision highp float;

uniform float u_time;
uniform float u_cycle;
uniform float u_rippleLifeSpan;
uniform float u_calmBefore;
uniform float u_riseBlend;
uniform float u_attackSec;
uniform float u_eventDecay;
uniform float u_timeFadeEase;
uniform float u_endFade;
uniform float u_endFadeEase;
uniform float u_centerFadeDelay;
uniform float u_centerFadeRate;
uniform float u_centerFadeSoft;
uniform float u_centerDeadMax;
uniform vec4 u_background;
uniform float u_waveAmp;
uniform float u_waveFreq;
uniform float u_waveSpeed;
uniform float u_waveDecay;
uniform float u_distFadeEase;
uniform float u_ringTighten;
uniform float u_dropImpact;
uniform float u_stackBlend;
uniform float u_stackSquash;

const int MAX_DROPS = 8;
uniform vec2 u_dropUv[MAX_DROPS];
uniform float u_dropStart[MAX_DROPS];
uniform float u_dropWaveScale[MAX_DROPS];

in vec3 vWorldPos;

out vec4 fragColor;

void main() {
    vec2 p = vWorldPos.xy;
    float cyc = max(u_cycle, 0.001);
    float hSum = 0.0;

    for (int i = 0; i < MAX_DROPS; i++) {
        float tStart = u_dropStart[i];
        if (tStart > -1e8) {
            float tp = u_time - tStart;
            if (tp >= 0.0 && tp <= cyc + 2.0) {
                vec2 center = vec2(2.0 * u_dropUv[i].x - 1.0, 2.0 * u_dropUv[i].y - 1.0);
                float d = length(p - center);
                float s = d * u_dropWaveScale[i];

                float dropOn = smoothstep(u_calmBefore, u_calmBefore + max(u_riseBlend, 0.002), tp);
                float endLin = 1.0 - smoothstep(max(u_cycle - u_endFade, u_calmBefore + u_riseBlend), u_cycle, tp);
                float ee = max(u_endFadeEase, 0.06);
                float endOff = pow(max(endLin, 0.0), ee);

                float dampT = exp(-u_eventDecay * max(tp - u_calmBefore, 0.0));
                float te = max(u_timeFadeEase, 0.06);
                float dampSoft = pow(max(dampT, 1e-6), te);

                float life = dropOn * endOff * dampSoft;

                float phase = u_waveFreq * s * (u_dropImpact + u_ringTighten * s) - tp * u_waveSpeed;
                float wave = sin(phase);
                float envLin = exp(-u_waveDecay * s);
                float de = max(u_distFadeEase, 0.06);
                float envelope = pow(max(envLin, 1e-6), de);

                float tWave = max(tp - u_calmBefore, 0.0);
                float soft = max(u_centerFadeSoft, 0.002);
                float rawDead = max(0.0, u_centerFadeRate * max(tWave - u_centerFadeDelay, 0.0));
                float cap = max(u_centerDeadMax, soft + 0.02);
                float deadR = min(rawDead, cap);
                float centerLive = deadR < 1e-5 ? 1.0 : smoothstep(deadR, deadR + soft, d);

                float tRip = max(tp - u_calmBefore, 0.0);
                float spanMax = max(u_cycle - u_calmBefore - 0.02, 0.05);
                float span = clamp(max(u_rippleLifeSpan, 0.02), 0.02, spanMax);
                float rippleGate = 1.0 - smoothstep(span * 0.82, span, tRip);

                // 波スケールが小さいほど波長が長く（見た目の波紋が大きい）→ アタックを長く
                float scale = max(u_dropWaveScale[i], 1e-3);
                float atkMul = clamp(0.55 / scale, 0.2, 10.0);
                float atkDur = min(max(u_attackSec, 0.0) * atkMul, 12.0);
                float attackEnv = atkDur < 1e-5 ? 1.0 : smoothstep(0.0, atkDur, tRip);

                hSum += wave * envelope * life * centerLive * rippleGate * attackEnv;
            }
        }
    }

    float squash = max(u_stackSquash, 0.05);
    float hLinear = u_waveAmp * hSum;
    float hTanh = tanh(hLinear * squash) / squash;
    float hOut = mix(hLinear, hTanh, clamp(u_stackBlend, 0.0, 1.0));

    vec3 col = clamp(u_background.rgb + vec3(hOut), 0.0, 1.0);
    float a = clamp(u_background.a, 0.0, 1.0);
    fragColor = vec4(col, a);
}
