window.onload = function() {
    const canvas_basic = document.getElementById("canvas-basic");

    // get webgl context
    const gl = canvas_basic.getContext("webgl");

    if (!gl) {
        console.error("Failed to init webgl.")
    }

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

    const vertexShaderSource = document.getElementById("basic-vert").text;
    const fragmentShaderSource = document.getElementById("basic-frag").text;
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const basicProgram = createProgram(gl, vertexShader, fragmentShader);
    console.log('it is ', basicProgram)
}