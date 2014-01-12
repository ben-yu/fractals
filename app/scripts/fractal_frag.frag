uniform sampler2D uTex;
uniform vec2 center;
uniform float scale;
uniform vec2 coordinateTransform;

void main()
{
	const int iter = 256;
    vec2 z, c;

    c.x = 1.3333 * (gl_FragCoord.x / coordinateTransform.x - 0.5) * scale - center.x;
    c.y = (gl_FragCoord.y / coordinateTransform.y - 0.5) * scale - center.y;

    z = c;
    int index = 0;
    for(int i=0; i<iter; i++) {
        float x = (z.x * z.x - z.y * z.y) + c.x;
        float y = (z.y * z.x + z.x * z.y) + c.y;

        if((x * x + y * y) >= 4.0) break;
        z.x = x;
        z.y = y;
        index = index + 1;
    }
    gl_FragColor = texture2D(uTex, vec2((index == iter ? 0.0 : float(index)) / 100.0,0.0));
}