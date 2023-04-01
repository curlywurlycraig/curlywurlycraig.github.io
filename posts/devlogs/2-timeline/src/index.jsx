import { ParseContext, parseJSON } from "./parser.js";
import { hic, apply, render } from "./vdom.js";
import * as glutils from "./webgl-utils.js";
import { ShipsRenderer } from "./gfx/ships.js";
import { StarfieldRenderer } from "./gfx/starfield.js";

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
    const canvas = document.getElementById("example-timeline-ships");

    // get webgl context
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        console.error("Failed to init webgl.")
    }

    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    glutils.resizeCanvasToDisplaySize(canvas, true);

    const shipsRenderer = new ShipsRenderer(gl);
    const starfieldRenderer = new StarfieldRenderer(gl);

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
        starfieldRenderer.render(t, canvas);
        shipsRenderer.render(gameState.ship, canvas);

        window.requestAnimationFrame(loop);
    });
}

window.onload = function() {
    runTimelineExample();
}
