attribute vec4 a_Position; 
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
uniform mat4 P;

void main(){
    gl_Position = P*a_Position;
    v_TexCoord = a_TexCoord;
}
