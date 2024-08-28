uniform sampler2D uTexture;
uniform vec2 uResolution;

void main() {
    vec2 texCoord = gl_FragCoord.xy / uResolution;
    vec4 color = vec4(0.0);
    float blurSize = 1.0 / uResolution.x; // ぼかしのサイズ

    // 簡単なぼかし効果
    for (float x = -1.0; x <= 1.0; x += 1.0) {
        for (float y = -1.0; y <= 1.0; y += 1.0) {
            color += texture2D(uTexture, texCoord + vec2(x, y) * blurSize);
        }
    }
    color /= 9.0; // 平均化
    gl_FragColor = color;
}