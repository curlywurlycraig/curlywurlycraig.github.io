import { hic, apply, render } from "./vdom.js";
import * as glutils from "./webgl-utils.js";
import { SpriteRenderer } from "./gfx/sprite.js";
import { StarfieldRenderer } from "./gfx/starfield.js";
import { HighlightedJSONText } from "./gui/editor.jsx";
import { timeline } from "./timeline.js";

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

    const shipsRenderer = new SpriteRenderer(
        gl,
        [100, 100],
        [50, 50],
        "resources/ship.png"
    );
    const missileRenderer = new SpriteRenderer(
        gl,
        [16, 32],
        [8, 8],
        "resources/missile.png"
    );
    const starfieldRenderer = new StarfieldRenderer(gl);

    const gameState = {
        frameIdx: 0,
        // ship is the actual on screen ship, the target values
        // we want to animate to are stored at the current index
        // in the timeline.
        missiles: {
            1: {
                x: 200,
                y: 50,
                rotation: Math.PI,
            },
            2: {
                x: 400,
                y: -100,
                rotation: Math.PI,
            }
        },
        ships: {
            0: {
                x: 200,
                y: 200,
                brightness: 0,
                rotation: 0,
                health: 100,
                frame: 0
            }
        }
    }

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
        const timelineFrame = timeline[gameState.frameIdx];

        const shipTarget = timelineFrame.ships[0];

        const ship = gameState.ships[0];
        ship.x = glutils.lerp(ship.x, shipTarget.x, 0.1);
        ship.y = glutils.lerp(ship.y, shipTarget.y, 0.1);
        ship.health = glutils.lerp(ship.health, shipTarget.health, 0.1);
        ship.rotation = glutils.lerp(ship.rotation, shipTarget.rotation, 0.1);
        if (ship.health > shipTarget.health) {
            ship.brightness = 1 - (shipTarget.health / ship.health);
        } else {
            ship.brightness = 0;
        }

        Object.entries(timelineFrame.missiles).forEach(([idx, missileTarget]) => {
            if (!gameState.missiles[idx]) {
                gameState.missiles[idx] = {
                    x: missileTarget.x,
                    y: missileTarget.y,
                    rotation: missileTarget.rotation,
                };
            }
        });

        // update missile positions
        Object.entries(gameState.missiles).forEach(([idx, missile]) => {
            const missileTarget = timelineFrame.missiles[idx];
            if (missileTarget === undefined) {
                delete gameState.missiles[idx];
                return;
            }

            missile.x = glutils.lerp(missile.x, missileTarget.x, 0.1);
            missile.y = glutils.lerp(missile.y, missileTarget.y, 0.1);
            missile.health = glutils.lerp(missile.health, missileTarget.health, 0.1);
            missile.rotation = glutils.lerp(missile.rotation, missileTarget.rotation, 0.1);
        });
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
            gameState.ships[0].frame = (gameState.ships[0].frame + 1) % 2;
            lastWobbleTime = t;
        }

        update();

        // draw
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        starfieldRenderer.render(t, canvas);
        shipsRenderer.render(canvas, gameState.ships[0]);
        
        Object.values(gameState.missiles).forEach((missile) => {
            missileRenderer.render(canvas, {
                ...missile,
                brightness: 0,
                frame: 0,
            });
        });

        window.requestAnimationFrame(loop);
    });
}

window.onload = function() {
    runTimelineExample();
}
