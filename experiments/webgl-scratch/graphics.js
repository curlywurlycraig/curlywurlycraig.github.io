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

window.onload = function() {
    renderBasic();
    renderPixels();
    renderMultiSquares();
    renderTranslatedSquares();
    renderRotatedSquares();
}
