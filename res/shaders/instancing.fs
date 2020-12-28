precision mediump float;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;


void main(){
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
}
