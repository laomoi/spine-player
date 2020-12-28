precision mediump float;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
varying vec2 v_color;


void main(){
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
}
