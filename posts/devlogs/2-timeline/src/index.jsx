import { ParseContext, parseJSON } from "./parser.js";
import { hic, apply, render } from "./vdom.js";
import * as glutils from "./webgl-utils.js";

const starfieldVertexShaderSource = `#version 300 es

in vec2 a_position;

out vec2 v_texcoord;

void main() {
    gl_Position = vec4(a_position, 0.9, 1.);
}
`;


const starfieldFragmentShaderSource = `#version 300 es
precision mediump float;

#define SIZE 0.02
#define COLOR vec3(0.05, 0.05, 0.1)

uniform vec2 u_resolution;
uniform float u_time;
out vec4 outColor;

// got this from https://www.shadertoy.com/view/MdcfDj
float sinHash(vec2 p) {
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);   
}

vec3 layer(vec2 uv, float depth) {
    float t = u_time;

    // zoom
    uv = uv * depth;
    uv += t/3.;
    
    vec2 gridPos = floor(uv);
    vec2 relPos = uv - gridPos;
    
    float id = sinHash(gridPos+depth);
    float brightness = max(0., (sin(id*100000. + t)));
    relPos += vec2(-0.5);
    float xJimmy = (fract(id)) -0.5;
    float yJimmy = (fract(id*10.)) -0.5;
    relPos += vec2(xJimmy, yJimmy);
    //relPos += 0.1 * sin(u_time+id);
        
    // uv = vec2(0.1*sin(uv.x+u_time),0.1*cos(uv.y+t));
    
    vec3 col = vec3(0.);
    col += 1. - smoothstep(SIZE, SIZE + 0.003, length(relPos));
    return col * brightness;
}

void main() {
    vec2 uv = (gl_FragCoord.xy-0.5*u_resolution.xy)/u_resolution.y;
    
    // Apply multiple layers
    vec3 col = COLOR;
    col += layer(uv, 9.0);
    col += layer(uv, 15.0);

    // Output to screen
    outColor = vec4(col,1.0);
}`;

const starfieldGeometry = [
    -1, -1,
    1, -1,
    -1, 1,
    1, -1,
    1, 1,
    -1, 1,
];

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

    const canvas = document.getElementById("example-timeline-ships");

    // get webgl context
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        console.error("Failed to init webgl.")
    }

    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    const vertexShader = glutils.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = glutils.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const basicProgram = glutils.createProgram(gl, vertexShader, fragmentShader);
    const starfieldVertexShader = glutils.createShader(gl, gl.VERTEX_SHADER, starfieldVertexShaderSource);
    const starfieldFragmentShader = glutils.createShader(gl, gl.FRAGMENT_SHADER, starfieldFragmentShaderSource);
    const starfieldProgram = glutils.createProgram(gl, starfieldVertexShader, starfieldFragmentShader);

    const starfieldPositionAttributeLocation = gl.getAttribLocation(starfieldProgram, "a_position");
    const starfieldResolutionUniformLocation = gl.getUniformLocation(starfieldProgram, "u_resolution");
    const starfieldTimeUniformLocation = gl.getUniformLocation(starfieldProgram, "u_time");

    const positionAttributeLocation = gl.getAttribLocation(basicProgram, "a_position");
    const texcoordAttributeLocation = gl.getAttribLocation(basicProgram, "a_texcoord");
    const resolutionUniformLocation = gl.getUniformLocation(basicProgram, "u_resolution");
    const brightnessUniformLocation = gl.getUniformLocation(basicProgram, "u_brightness");
    const transformUniformLocation = gl.getUniformLocation(basicProgram, "u_transform");
    const spriteIdxUniformLocation = gl.getUniformLocation(basicProgram, "u_sprite_idx");
    const spriteCountUniformLocation = gl.getUniformLocation(basicProgram, "u_sprite_count");

    const spriteVao = gl.createVertexArray();
    const starfieldVao = gl.createVertexArray();

    const textures = {};

    // starfield position buffer
    {
        gl.bindVertexArray(starfieldVao);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(starfieldGeometry), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(starfieldPositionAttributeLocation);
        const size = 2;          // 2 components per iteration
        const type = gl.FLOAT;   // the data is 32bit floats
        const normalize = false; // don't normalize the data
        const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        const offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            starfieldPositionAttributeLocation, size, type, normalize, stride, offset);
    }

    // position buffer
    {
        gl.bindVertexArray(spriteVao);
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

    function loadTexture(textureLocation) {
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

        textures[textureLocation] = texture;
    }

    loadTexture("resources/ship2.png");
    loadTexture("resources/missile.png");

    glutils.resizeCanvasToDisplaySize(canvas, true);

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
            frame: 0
        }
    }

    const timeline = [
        {
            x: 100,
            y: 300,
            health: 100,
            rotation: 3 * Math.PI / 2.0,
        },
        {
            x: 100,
            y: 300,
            health: 100,
            rotation: 3 * Math.PI / 2.0,
        },
        {
            x: 100,
            y: 300,
            health: 100,
            rotation: 3 * Math.PI / 2.0,
        },
        {
            x: 200,
            y: 300,
            health: 100,
            rotation: 3.5 * Math.PI / 2.0,
        },
        {
            x: 300,
            y: 250,
            health: 50,
            rotation: 2 * Math.PI,
        },
        {
            x: 400,
            y: 200,
            health: 50,
            rotation: 2 * Math.PI + Math.PI / 4.0,
        },
        {
            x: 500,
            y: 180,
            health: 20,
            rotation: 2 * Math.PI + 2 * Math.PI / 4.0,
        },
        {
            x: 600,
            y: 150,
            health: 20,
            rotation: 2 * Math.PI + 3 * Math.PI / 4.0,
        },
        {
            x: 600,
            y: 150,
            health: 20,
            rotation: 2 * Math.PI + 3 * Math.PI / 4.0,
        },
        {
            x: 600,
            y: 150,
            health: 20,
            rotation: 2 * Math.PI + 3 * Math.PI / 4.0,
        },
    ]

    function renderTimeline() {
        const rows = timeline.map((frame, idx) => {
            const style = `opacity: ${idx === gameState.frameIdx ? 1 : 0.5};`;
            return (
                <div class="timeline-row" style={style}>
                    <HighlightedJSONText value={JSON.stringify(frame)} />
                </div>
            );
        });

        const el = (
            <div id="timeline-controls">
                { rows }
            </div>
        );

        apply(render(el), document.getElementById("timeline-controls"));
    }
    renderTimeline();

    function renderSprite(sprite) {
        gl.useProgram(basicProgram);
        gl.bindVertexArray(spriteVao);

        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

        const { brightness, x, y, rotation, frame } = sprite;

        // Matrices
        const translateM = glutils.translationMatrix(x, y);
        const rotationM = glutils.rotationMatrix(rotation);
        const scaleM = glutils.scaleMatrix(1, 1);
        const moveOriginMatrix = glutils.translationMatrix(-origin[0], -origin[1]);
        const transformM = glutils.multiplyMatrix(translateM,
            glutils.multiplyMatrix(rotationM,
                glutils.multiplyMatrix(scaleM, moveOriginMatrix)));

        gl.uniform1i(spriteIdxUniformLocation, frame);
        gl.uniform1i(spriteCountUniformLocation, 2);
        gl.uniform1f(brightnessUniformLocation, brightness);
        gl.uniformMatrix3fv(
            transformUniformLocation,
            false,
            transformM
        );
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function renderStarfield(t) {
        gl.useProgram(starfieldProgram);
        gl.bindVertexArray(starfieldVao);

        gl.uniform2f(starfieldResolutionUniformLocation, canvas.width, canvas.height);
        gl.uniform1f(starfieldTimeUniformLocation, t/2000);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function update() {
        // set the ship x, y, and rotation based on the targets and the current content
        // of the json
        const shipTarget = timeline[gameState.frameIdx];
        const ship = gameState.ship;
        ship.x = glutils.lerp(ship.x, shipTarget.x, 0.1);
        ship.y = glutils.lerp(ship.y, shipTarget.y, 0.1);
        ship.health = glutils.lerp(ship.health, shipTarget.health, 0.1);
        ship.rotation = glutils.lerp(ship.rotation, shipTarget.rotation, 0.1);
        if (ship.health > shipTarget.health) {
            ship.brightness = 1 - (shipTarget.health / ship.health);
        } else {
            ship.brightness = 0;
        }
    }

    let lastTickTime = 0;
    let lastWobbleTime = 0;
    window.requestAnimationFrame(function loop(t) {
        if (t - lastTickTime > 200) {
            gameState.frameIdx = (gameState.frameIdx + 1) % timeline.length;
            lastTickTime = t;
            renderTimeline();
        }

        if (t - lastWobbleTime > 200) {
            gameState.ship.frame = (gameState.ship.frame + 1) % 2;
            lastWobbleTime = t;
        }

        update();

        // draw
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // TODO Render multiple ships and missiles etc
        renderStarfield(t);
        renderSprite(gameState.ship);

        window.requestAnimationFrame(loop);
    });
}

window.onload = function() {
    runTimelineExample();
}
