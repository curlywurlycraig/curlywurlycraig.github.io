import { ParseContext, parseJSON } from "./parser.js";
import { hic, apply, render } from "./vdom.js";
import { createShader, createProgram, resizeCanvasToDisplaySize } from "./webgl-utils.js";

const geometry = [
    0, 0,
    100, 0,
    0, 100,
    100, 0,
    100, 100,
    0, 100,
];
const origin = [50, 50];

const HighlightedJSONText = ({ value }) => {
    const computeSpans = () => {
        const tok = new ParseContext(value);
        parseResult = parseJSON(tok);
        
        if (tok.tokens.length === 0) {
            return [value];
        }
        
        return tok.tokens.reduce((resultEls, currToken, currIdx, orig) => {
            const prevToken = orig[currIdx - 1];
            const soFar = prevToken?.end || 0;
            
            if (currToken.start > soFar) {
                resultEls.push(value.slice(soFar, currToken.start));
            }
    
            const className = `parsed_${currToken.type}`;
            const spanContents = value.slice(currToken.start, currToken.end);
            resultEls.push(<span class={className}>{ spanContents }</span>);
    
            if (currIdx === orig.length - 1) {
                resultEls.push(value.slice(currToken.end));
            }
            return resultEls;
        }, []);
    }
    
    return (
        <pre class="editor_draw">
            <code>
                { computeSpans() }
            </code>
        </pre>
    );
}

function runTimelineExample() {
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

    const canvas = document.getElementById("example-timeline-ships");

    // get webgl context
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        console.error("Failed to init webgl.")
    }

    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

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

    const gameState = {
        frameIdx: 0,
        // ship is the actual on screen ship, the target values
        // we want to animate to are stored at the current index
        // in the timeline.
        ship: {
            x: 200,
            y: 200,
            brightness: 0,
            rotation: 0,
            health: 100,
        }
    }

    const timeline = [
        {
            x: 200,
            y: 200,
            health: 100,
            rotation: 0,
        },
        {
            x: 100,
            y: 100,
            health: 50,
            rotation: Math.PI,
        },
    ]

    function renderTimeline() {
        const rows = timeline.map((frame, idx) => {
            // TODO I AM HERE: make the style be slightly transparent
            // when the frame is not the current frame.
            return (
                <div class="timeline-row" style={}>
                    <HighlightedJSONText value={JSON.stringify(frame)} />
                </div>
            );
        });

        apply(render(
            <div id="timeline-controls">
                { rows }
            </div>), document.getElementById("timeline-controls"));
    }
    renderTimeline();

    function renderShip() {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(basicProgram);
        gl.bindVertexArray(vao);

        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

        const { brightness, x, y, rotation } = ship;

        // Matrices
        const translateM = translationMatrix(x, y);
        const rotationM = rotationMatrix(rotation);
        const scaleM = scaleMatrix(1, 1);
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

    function update() {
        // set the ship x, y, and rotation based on the targets and the current content
        // of the json
        ship.x = lerp(ship.x, shipTarget.x, 0.1);
        ship.y = lerp(ship.y, shipTarget.y, 0.1);
        ship.health = lerp(ship.health, shipTarget.health, 0.5);
        ship.rotation = lerp(ship.rotation, shipTarget.rotation, 0.1);
        if (ship.health > shipTarget.health) {
            ship.brightness = 1 - (shipTarget.health / ship.health);
        } else {
            ship.brightness = 0;
        }
    }

    // window.requestAnimationFrame(function loop() {
        // update();
        // renderShip();
        // window.requestAnimationFrame(loop);
    // });
}

window.onload = function() {
    runTimelineExample();
}
