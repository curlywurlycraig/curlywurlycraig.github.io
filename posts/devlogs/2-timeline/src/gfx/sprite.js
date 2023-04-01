import * as glutils from "../webgl-utils.js";

const vertexShaderSource = `#version 300 es

in vec2 a_texcoord;
in vec2 a_position;
uniform vec2 u_resolution;
uniform mat3 u_transform;

out vec2 v_texcoord;

void main() {
    vec2 position = (u_transform * vec3(a_position, 1)).xy;

    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = position / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    vec2 clipSpace = zeroToTwo - 1.0;
    
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_texcoord = a_texcoord;
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec2 v_texcoord;
out vec4 outColor;
uniform float u_brightness;
uniform int u_sprite_idx;
uniform int u_sprite_count;
uniform sampler2D u_texture;

void main() {
    vec2 frame_texcoord = v_texcoord +
        vec2(float(u_sprite_idx) / float(u_sprite_count), 0);

    vec4 textureColor = texture(u_texture, frame_texcoord);
    vec4 brightenedColor = textureColor + u_brightness * vec4(1.0, 1.0, 1.0, 0.0);
    outColor = vec4(brightenedColor.rgb, textureColor.a);
}
`;


export class SpriteRenderer {
    gl = null;
    program = null;

    posA = null;
    texcoordA = null;
    resolutionU = null;
    brightnessU = null;
    transformU = null;
    spriteIdxU = null;
    spriteCountU = null;

    vao = null;

    texture = null;
    geometry = null;
    dimensions = null;

    constructor(gl, dimensions, origin, spriteURL) {
        this.gl = gl;

        this.origin = origin;
        const [width, height] = dimensions;
        this.dimensions = dimensions;
        this.geometry = [
            0, 0,
            width, 0,
            0, height,
            width, 0,
            width, height,
            0, height,
        ];

        const vertexShader = glutils.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = glutils.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        this.program = glutils.createProgram(gl, vertexShader, fragmentShader);

        this.posA = gl.getAttribLocation(this.program, "a_position");
        this.texcoordA = gl.getAttribLocation(this.program, "a_texcoord");
        this.resolutionU = gl.getUniformLocation(this.program, "u_resolution");
        this.brightnessU = gl.getUniformLocation(this.program, "u_brightness");
        this.transformU = gl.getUniformLocation(this.program, "u_transform");
        this.spriteIdxU = gl.getUniformLocation(this.program, "u_sprite_idx");
        this.spriteCountU = gl.getUniformLocation(this.program, "u_sprite_count");

        this.vao = gl.createVertexArray();

        // Position attribute
        {
            gl.bindVertexArray(this.vao);
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometry), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(this.posA);
            const size = 2;          // 2 components per iteration
            const type = gl.FLOAT;   // the data is 32bit floats
            const normalize = false; // don't normalize the data
            const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            const offset = 0;        // start at the beginning of the buffer
            gl.vertexAttribPointer(
                this.posA, size, type, normalize, stride, offset);
        }

        // Texcoord attribute
        {
            const texBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                0, 0,
                0.5, 0,
                0, 1,
                0.5, 0,
                0.5, 1,
                0, 1,
            ]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(this.texcoordA);
            const size = 2;          // 2 components per iteration
            const type = gl.FLOAT;   // the data is 32bit floats
            const normalize = false; // don't normalize the data
            const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            const offset = 0;        // start at the beginning of the buffer
            gl.vertexAttribPointer(
                this.texcoordA, size, type, normalize, stride, offset);
        }

        // Load texture
        {
            this.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
    
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
            // Fill with a 1x1 blue pixel.
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));
    
            const image = new Image();
            image.src = spriteURL;
            image.addEventListener('load', () => {
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
            });
        }
    }

    render(canvas, params) {
        const { brightness, x, y, rotation, frame } = params;

        const gl = this.gl;
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.uniform2f(this.resolutionU, canvas.width, canvas.height);

        // Matrices
        const translateM = glutils.translationMatrix(x, y);
        const rotationM = glutils.rotationMatrix(rotation);
        const scaleM = glutils.scaleMatrix(1, 1);
        const moveOriginMatrix = glutils.translationMatrix(-this.origin[0], -this.origin[1]);
        const transformM = glutils.multiplyMatrix(translateM,
            glutils.multiplyMatrix(rotationM,
                glutils.multiplyMatrix(scaleM, moveOriginMatrix)));

        gl.uniform1i(this.spriteIdxU, frame);
        gl.uniform1i(this.spriteCountU, 2);
        gl.uniform1f(this.brightnessU, brightness);
        gl.uniformMatrix3fv(
            this.transformU,
            false,
            transformM
        );
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}