attribute vec4 a_Position; 
attribute vec2 a_TexCoord;

attribute vec2 a_Position_instancing;
varying vec2 v_color;

varying vec2 v_TexCoord;
uniform mat4 P;

void main(){
    gl_Position = P*vec4(a_Position.xy+a_Position_instancing, 0.0, 1.0);
    v_TexCoord = a_TexCoord;
    v_color = a_Position_instancing;

}
