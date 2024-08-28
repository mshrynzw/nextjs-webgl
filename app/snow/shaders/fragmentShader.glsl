uniform sampler2D pointTexture;
varying float vOpacity;

void main() {
    gl_FragColor = texture2D(pointTexture, gl_PointCoord) * vec4(1.0, 1.0, 1.0, vOpacity);
}