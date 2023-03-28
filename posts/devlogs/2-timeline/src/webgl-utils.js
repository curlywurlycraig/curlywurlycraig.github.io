// A lot of this comes from
// https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html

export function createShader(gl, type, source) {
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

export function createProgram(gl, vertexShader, fragmentShader) {
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

export function resizeCanvasToDisplaySize(canvas, isRetina = true) {
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

export function translationMatrix(x, y) {
    return [
        1, 0, 0,
        0, 1, 0,
        x, y, 1,
    ];
}

export function rotationMatrix(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [
        c, -s, 0,
        s, c, 0,
        0, 0, 1,
    ];
}

export function scaleMatrix(sx, sy) {
    return [
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1,
    ];
}

export function multiplyMatrix(a, b) {
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

export function identityMatrix() {
    return [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ];
}

function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}
