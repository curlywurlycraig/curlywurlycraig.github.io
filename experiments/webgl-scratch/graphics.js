// A lot of this comes from
// https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function resizeCanvasToDisplaySize(canvas, isRetina = true) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    const desiredWidth = isRetina ? displayWidth * 2 : displayWidth;
    const desiredHeight = isRetina ? displayHeight * 2 : displayHeight;

    // Check if the canvas is not the same size.
    const needResize = canvas.width !== desiredWidth ||
                    canvas.height !== desiredHeight;

    if (needResize) {
    // Make the canvas the same size
    canvas.width  = desiredWidth;
    canvas.height = desiredHeight;
    }

    return needResize;
}

function translationMatrix(x, y) {
    return [
        1, 0, 0,
        0, 1, 0,
        x, y, 1,
    ];
}

function rotationMatrix(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [
        c, -s, 0,
        s, c, 0,
        0, 0, 1,
    ];
}

function scaleMatrix(sx, sy) {
    return [
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1,
    ];
}

function multiplyMatrix(a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];

    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
}

function identityMatrix() {
    return [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ];
}

function renderBasic() {
    const fragmentShaderSource = `#version 300 es
        precision highp float;
        out vec4 outColor;

        void main() {
            outColor = vec4(0.2, 0.1, 0.4, 1);
        }
    `;

    const vertexShaderSource = `#version 300 es
        in vec2 a_position;

        // all shaders have a main function
        void main() {
            // gl_Position is a special variable a vertex shader
            // is responsible for setting
            gl_Position = vec4(a_position, 0, 1);
        }
    `;

    const canvas = document.getElementById("canvas-basic");

    // get webgl context
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        console.error("Failed to init webgl.")
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const basicProgram = createProgram(gl, vertexShader, fragmentShader);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        0, 0,
        0, 0.5,
        0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(basicProgram, "a_position");
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);

    const size = 2;          // 2 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(basicProgram);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function renderPixels() {
    const vertexShaderSource = `#version 300 es

        in vec2 a_position;
        uniform vec2 u_resolution;

        void main() {
            // convert the position from pixels to 0.0 to 1.0
            vec2 zeroToOne = a_position / u_resolution;

            // convert from 0->1 to 0->2
            vec2 zeroToTwo = zeroToOne * 2.0;

            vec2 clipSpace = zeroToTwo - 1.0;
            
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        }
    `;

    const fragmentShaderSource = `#version 300 es
        precision highp float;
        out vec4 outColor;

        void main() {
            outColor = vec4(0.2, 0.1, 0.4, 1);
        }
    `;

    const canvas = document.getElementById("canvas-pixels");

    // get webgl context
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        console.error("Failed to init webgl.")
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const basicProgram = createProgram(gl, vertexShader, fragmentShader);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        0, 0,
        80, 0,
        0, 80,
        0, 80,
        80, 0,
        80, 80,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(basicProgram, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(basicProgram, "u_resolution");

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);

    const size = 2;          // 2 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    resizeCanvasToDisplaySize(canvas, true);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(basicProgram);

    gl.bindVertexArray(vao);
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function renderMultiSquares() {
    const vertexShaderSource = `#version 300 es

        in vec2 a_position;
        uniform vec2 u_resolution;

        void main() {
            // convert the position from pixels to 0.0 to 1.0
            vec2 zeroToOne = a_position / u_resolution;

            // convert from 0->1 to 0->2
            vec2 zeroToTwo = zeroToOne * 2.0;

            vec2 clipSpace = zeroToTwo - 1.0;
            
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        }
    `;

    const fragmentShaderSource = `#version 300 es
        precision highp float;
        out vec4 outColor;
        uniform float u_brightness;

        void main() {
            vec3 calibratedColor = vec3(0.2, 0.1, 0.4) + u_brightness * vec3(1.0, 1.0, 1.0);
            outColor = vec4(calibratedColor, 1);
        }
    `;

    const canvas = document.getElementById("canvas-multi-squares");

    // get webgl context
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        console.error("Failed to init webgl.")
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const basicProgram = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(basicProgram, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(basicProgram, "u_resolution");
    const brightnessUniformLocation = gl.getUniformLocation(basicProgram, "u_brightness");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);

    const size = 2;          // 2 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    resizeCanvasToDisplaySize(canvas, true);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(basicProgram);

    gl.bindVertexArray(vao);

    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

    // draw 10 random squares with random brightness
    for (let i = 0; i < 10; i++) {
        const x1 = Math.random() * 400;
        const y1 = Math.random() * 400;
        const x2 = x1 + Math.random() * 400;
        const y2 = y1 + Math.random() * 400;
        const brightness = Math.random();

        const positions = [
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2,
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.uniform1f(brightnessUniformLocation, brightness);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

function renderTranslatedSquares() {
    const vertexShaderSource = `#version 300 es

        in vec2 a_position;
        uniform vec2 u_resolution;
        uniform vec2 u_translation;

        void main() {
            vec2 position = a_position + u_translation;

            // convert the position from pixels to 0.0 to 1.0
            vec2 zeroToOne = position / u_resolution;

            // convert from 0->1 to 0->2
            vec2 zeroToTwo = zeroToOne * 2.0;

            vec2 clipSpace = zeroToTwo - 1.0;
            
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        }
    `;

    const fragmentShaderSource = `#version 300 es
        precision highp float;
        out vec4 outColor;
        uniform float u_brightness;

        void main() {
            vec3 calibratedColor = vec3(0.2, 0.1, 0.4) + u_brightness * vec3(1.0, 1.0, 1.0);
            outColor = vec4(calibratedColor, 1);
        }
    `;

    const canvas = document.getElementById("canvas-translated-squares");

    // get webgl context
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        console.error("Failed to init webgl.")
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const basicProgram = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(basicProgram, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(basicProgram, "u_resolution");
    const brightnessUniformLocation = gl.getUniformLocation(basicProgram, "u_brightness");
    const translationUniformLocation = gl.getUniformLocation(basicProgram, "u_translation");

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        0, 0,
        100, 0,
        0, 100,
        100, 0,
        100, 100,
        0, 100,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const size = 2;          // 2 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    resizeCanvasToDisplaySize(canvas, true);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(basicProgram);

    gl.bindVertexArray(vao);

    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

    // draw 10 random squares with random brightness
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * 400;
        const y = Math.random() * 400;
        const brightness = Math.random();

        gl.uniform1f(brightnessUniformLocation, brightness);
        gl.uniform2f(translationUniformLocation, x, y);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

function renderRotatedSquares() {
    const vertexShaderSource = `#version 300 es

        in vec2 a_position;
        uniform vec2 u_resolution;
        uniform vec2 u_translation;
        
        // Rotation values representing a point
        // on the unit circle
        uniform vec2 u_rotationPos;

        void main() {
            vec2 rotatedPosition = vec2(
                a_position.x * u_rotationPos.y + a_position.y * u_rotationPos.x,
                a_position.y * u_rotationPos.y - a_position.x * u_rotationPos.x
            );

            vec2 position = rotatedPosition + u_translation;

            // convert the position from pixels to 0.0 to 1.0
            vec2 zeroToOne = position / u_resolution;

            // convert from 0->1 to 0->2
            vec2 zeroToTwo = zeroToOne * 2.0;

            vec2 clipSpace = zeroToTwo - 1.0;
            
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        }
    `;

    const fragmentShaderSource = `#version 300 es
        precision highp float;
        out vec4 outColor;
        uniform float u_brightness;

        void main() {
            vec3 calibratedColor = vec3(0.2, 0.1, 0.4) + u_brightness * vec3(1.0, 1.0, 1.0);
            outColor = vec4(calibratedColor, 1);
        }
    `;

    const canvas = document.getElementById("canvas-rotated-squares");

    // get webgl context
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        console.error("Failed to init webgl.")
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const basicProgram = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(basicProgram, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(basicProgram, "u_resolution");
    const brightnessUniformLocation = gl.getUniformLocation(basicProgram, "u_brightness");
    const translationUniformLocation = gl.getUniformLocation(basicProgram, "u_translation");
    const rotationUniformLocation = gl.getUniformLocation(basicProgram, "u_rotationPos");

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        0, 0,
        100, 0,
        0, 100,
        100, 0,
        100, 100,
        0, 100,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const size = 2;          // 2 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    resizeCanvasToDisplaySize(canvas, true);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(basicProgram);

    gl.bindVertexArray(vao);

    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

    // draw 10 random squares with random brightness
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * 400;
        const y = Math.random() * 400;
        const brightness = Math.random();
        const rotationRads = Math.random() * Math.PI * 2;

        gl.uniform1f(brightnessUniformLocation, brightness);
        gl.uniform2f(translationUniformLocation, x, y);
        gl.uniform2f(
            rotationUniformLocation,
            Math.sin(rotationRads),
            Math.cos(rotationRads),
        );
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

function renderAnimatedSquares() {
    const vertexShaderSource = `#version 300 es

        in vec2 a_position;
        uniform vec2 u_resolution;
        uniform mat3 u_transform;

        void main() {
            vec2 position = (u_transform * vec3(a_position, 1)).xy;

            // convert the position from pixels to 0.0 to 1.0
            vec2 zeroToOne = position / u_resolution;

            // convert from 0->1 to 0->2
            vec2 zeroToTwo = zeroToOne * 2.0;

            vec2 clipSpace = zeroToTwo - 1.0;
            
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        }
    `;

    const fragmentShaderSource = `#version 300 es
        precision highp float;
        out vec4 outColor;
        uniform float u_brightness;

        void main() {
            vec3 calibratedColor = vec3(0.2, 0.1, 0.4) + u_brightness * vec3(1.0, 1.0, 1.0);
            outColor = vec4(calibratedColor, 1);
        }
    `;

    const canvas = document.getElementById("canvas-animated-squares");

    // get webgl context
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        console.error("Failed to init webgl.")
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const basicProgram = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(basicProgram, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(basicProgram, "u_resolution");
    const brightnessUniformLocation = gl.getUniformLocation(basicProgram, "u_brightness");
    const transformUniformLocation = gl.getUniformLocation(basicProgram, "u_transform");

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const geometry = [
        0, 0,
        100, 0,
        0, 100,
        100, 0,
        100, 100,
        0, 100,
    ];
    const origin = [50, 50];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry), gl.STATIC_DRAW);

    const size = 2;          // 2 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    resizeCanvasToDisplaySize(canvas, true);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(basicProgram);

    gl.bindVertexArray(vao);

    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

    const squares = [];

    // draw 10 random squares with random brightness
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * 400;
        const y = Math.random() * 400;
        const scale = Math.random();
        const brightness = Math.random();
        const rotationRads = Math.random() * Math.PI * 2;

        squares.push({
            brightness,
            rotation: rotationRads,
            x,
            y,
            scale
        });
    }

    function render() {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(basicProgram);
        gl.bindVertexArray(vao);

        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

        for (let i = 0; i < squares.length; i++) {
            const { brightness, x, y, rotation, scale } = squares[i];

            // Matrices
            const translateM = translationMatrix(x, y);
            const rotationM = rotationMatrix(rotation);
            const scaleM = scaleMatrix(scale, scale);
            const moveOriginMatrix = translationMatrix(-origin[0], -origin[1]);
            const transformM = multiplyMatrix(translateM, multiplyMatrix(rotationM, multiplyMatrix(scaleM, moveOriginMatrix)));

            gl.uniform1f(brightnessUniformLocation, brightness);
            gl.uniformMatrix3fv(
                transformUniformLocation,
                false,
                transformM
            );
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }

    function update() {
        for (let i = 0; i < squares.length; i++) {
            squares[i].rotation -= 0.01;
            squares[i].scale = 0.5 + Math.sin(squares[i].rotation * 2) * 0.2;

            // flash every 0.5 rads
            squares[i].brightness = squares[i].rotation < 0.05 ? 1 : 0;

            if (squares[i].rotation < 0) {
                squares[i].rotation += Math.PI / 2.0;
            }
        }
    }

    window.requestAnimationFrame(function loop() {
        update();
        render();
        window.requestAnimationFrame(loop);
    });
}

function renderTexturedSquares() {
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
        uniform sampler2D u_texture;

        void main() {
            vec4 textureColor = texture(u_texture, v_texcoord);
            vec4 brightenedColor = textureColor + u_brightness * vec4(1.0, 1.0, 1.0, 0.0);
            outColor = vec4(brightenedColor.rgb, textureColor.a);
        }
    `;

    const canvas = document.getElementById("canvas-textured-squares");

    // get webgl context
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        console.error("Failed to init webgl.")
    }

    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    const geometry = [
        0, 0,
        100, 0,
        0, 100,
        100, 0,
        100, 100,
        0, 100,
    ];
    const origin = [50, 50];

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const basicProgram = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(basicProgram, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(basicProgram, "u_resolution");
    const brightnessUniformLocation = gl.getUniformLocation(basicProgram, "u_brightness");
    const transformUniformLocation = gl.getUniformLocation(basicProgram, "u_transform");
    const texcoordAttributeLocation = gl.getAttribLocation(basicProgram, "a_texcoord");

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // position buffer
    {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttributeLocation);
        const size = 2;          // 2 components per iteration
        const type = gl.FLOAT;   // the data is 32bit floats
        const normalize = false; // don't normalize the data
        const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        const offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset);
    }

    // texcoord buffer
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
        gl.enableVertexAttribArray(texcoordAttributeLocation);
        const size = 2;          // 2 components per iteration
        const type = gl.FLOAT;   // the data is 32bit floats
        const normalize = false; // don't normalize the data
        const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        const offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            texcoordAttributeLocation, size, type, normalize, stride, offset);
    }

    // Load texture
    {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Fill with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));

        const image = new Image();
        image.src = "resources/ship2.png";
        image.addEventListener('load', () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });
    }

    resizeCanvasToDisplaySize(canvas, true);

    const ships = [];

    // create 10 random ships with random brightness
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * 400;
        const y = Math.random() * 400;
        const scale = Math.random();
        const brightness = Math.random();
        const rotationRads = Math.random() * Math.PI * 2;

        ships.push({
            brightness,
            rotation: rotationRads,
            x,
            y,
            scale
        });
    }

    function render() {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(basicProgram);
        gl.bindVertexArray(vao);

        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

        for (let i = 0; i < ships.length; i++) {
            const { brightness, x, y, rotation, scale } = ships[i];

            // Matrices
            const translateM = translationMatrix(x, y);
            const rotationM = rotationMatrix(rotation);
            const scaleM = scaleMatrix(scale, scale);
            const moveOriginMatrix = translationMatrix(-origin[0], -origin[1]);
            const transformM = multiplyMatrix(translateM, multiplyMatrix(rotationM, multiplyMatrix(scaleM, moveOriginMatrix)));

            gl.uniform1f(brightnessUniformLocation, brightness);
            gl.uniformMatrix3fv(
                transformUniformLocation,
                false,
                transformM
            );
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }

    function update() {
        for (let i = 0; i < ships.length; i++) {
            ships[i].rotation -= 0.01;
            ships[i].scale = 0.5 + Math.sin(ships[i].rotation * 2) * 0.2;

            // flash the brightness when the rotation is close to 0
            ships[i].brightness = ships[i].rotation < 0.05 ? 1 : 0;

            if (ships[i].rotation < 0) {
                ships[i].rotation += Math.PI * 2.0;
            }
        }
    }

    window.requestAnimationFrame(function loop() {
        update();
        render();
        window.requestAnimationFrame(loop);
    });
}


window.onload = function() {
    renderBasic();
    renderPixels();
    renderMultiSquares();
    renderTranslatedSquares();
    renderRotatedSquares();
    renderAnimatedSquares();
    renderTexturedSquares();
}
