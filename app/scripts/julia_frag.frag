uniform sampler2D uTex;
uniform vec2 center;
uniform float scale;
uniform vec2 coordinateTransform;

void main()
{
    const int iter = 256;
    vec2 z;

    z.x = 3.0 * (gl_FragCoord.x / coordinateTransform.x - 0.5);
    z.y = 2.0 * (gl_FragCoord.y / coordinateTransform.y - 0.5);

    int index = 0;
    for(int i=0; i<iter; i++) {
        float x = (z.x * z.x - z.y * z.y) + center.x;
        float y = (z.y * z.x + z.x * z.y) + center.y;

        if((x * x + y * y) >= 4.0) break;
        z.x = x;
        z.y = y;
        index = index + 1;
    }
    gl_FragColor = texture2D(uTex, vec2((index == iter ? 0.0 : float(index)) / 100.0,0.0));
}