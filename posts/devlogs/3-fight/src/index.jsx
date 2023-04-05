import { hic, apply, render } from "./vdom.js";
import * as glutils from "./gfx/webgl-utils.js";
import { SpriteRenderer } from "./gfx/sprite.js";
import { StarfieldRenderer } from "./gfx/starfield.js";
import { HighlightedJSONText, TimelineControls } from "./gui/editor.jsx";
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

    const starfieldRenderer = new StarfieldRenderer(gl);
    const spriteRenderer = new SpriteRenderer(gl);
    spriteRenderer.loadSprite("resources/ship.png", [100, 100], [50, 50], 2);
    spriteRenderer.loadSprite("resources/missile.png", [30, 60], [15, 15], 2);
    spriteRenderer.loadSprite("resources/jet.png", [32, 40], [16, 0], 2);

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

    function renderGUI() {
        const left = (gameState.ships[0].x - 50) / 2.0;
        const top = (gameState.ships[0].y - 50) / 2.0;
        const width = 50 * (gameState.ships[0].health / 100);
        const styleString = `left: ${left}px; width: ${width}px; top: ${top}px;`;

        const el = (
            <div id="example-timeline-ships-gui">
                <div class="health-bar-background" style={styleString}></div>
                <div class="health-bar" style={styleString}></div>
            </div>
        );

        apply(render(el), document.getElementById("example-timeline-ships-gui"));
    }

    let isTimelineExpanded = false;
    function toggleTimeline() {
        isTimelineExpanded = !isTimelineExpanded;
        renderTimeline();
    };
    function renderTimeline() {
        apply(render(<TimelineControls
            currentIndex={gameState.frameIdx}
            onExpandClick={toggleTimeline}
            isExpanded={isTimelineExpanded}
            timeline={timeline} />), document.getElementById("timeline-controls"));
    }
    renderTimeline();

    function update(t) {
        // set the ship x, y, and rotation based on the targets and the current content
        // of the json
        const timelineFrame = timeline[gameState.frameIdx];

        const shipTarget = timelineFrame.ships[0];

        const tSecs = t * 0.001;
        const ship = gameState.ships[0];
        ship.x = glutils.lerp(ship.x, shipTarget.x, 5 * tSecs);
        ship.y = glutils.lerp(ship.y, shipTarget.y, 5 * tSecs);
        ship.rotation = glutils.lerp(ship.rotation, shipTarget.rotation, 5 * tSecs);
        ship.health = glutils.lerp(ship.health, shipTarget.health, 20 * tSecs);
        if ((ship.health / shipTarget.health) > 1.01) {
            ship.brightness = 1;
        } else {
            ship.brightness = 0;
        }
        ship.thrusters = shipTarget.thrusters;

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

            missile.x = glutils.lerp(missile.x, missileTarget.x, 5 * tSecs);
            missile.y = glutils.lerp(missile.y, missileTarget.y, 5 * tSecs);
            missile.rotation = glutils.lerp(missile.rotation, missileTarget.rotation, 5 * tSecs);
        });
    }

    function draw(t) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        starfieldRenderer.render(t, canvas);

        const ship = gameState.ships[0];

        if (ship.thrusters) {
            const firstJetModelMatrix = glutils.modelMatrix({
                x: ship.x,
                y: ship.y,
                rotation: ship.rotation,
                scaleX: 32,
                scaleY: 40,
                originX: 16 + 22,
                originY: -38,
            });

            const secondJetModelMatrix = glutils.modelMatrix({
                x: ship.x,
                y: ship.y,
                rotation: ship.rotation,
                scaleX: 32,
                scaleY: 40,
                originX: 16 - 20,
                originY: -38,
            });

            spriteRenderer.render(canvas, "resources/jet.png", {
                ...ship,
                brightness: 0,
                modelMatrix: firstJetModelMatrix,
            });
            spriteRenderer.render(canvas, "resources/jet.png", {
                ...ship,
                brightness: 0,
                modelMatrix: secondJetModelMatrix,
            });
        }

        const shipModelMatrix = spriteRenderer.getModelMatrix(
            ship.x,
            ship.y,
            ship.rotation,
            "resources/ship.png"
        );

        spriteRenderer.render(canvas, "resources/ship.png", {
            modelMatrix: shipModelMatrix,
            brightness: ship.brightness,
            frame: ship.frame
        });
        
        
        Object.values(gameState.missiles).forEach((missile) => {
            const missileModelMatrix = spriteRenderer.getModelMatrix(
                missile.x,
                missile.y,
                missile.rotation,
                "resources/missile.png"
            );

            spriteRenderer.render(canvas, "resources/missile.png", {
                ...missile,
                modelMatrix: missileModelMatrix,
                brightness: 0,
                frame: 0,
            });
        });

        renderGUI();
    }

    let lastTickTime = 0;
    let lastWobbleTime = 0;
    let lastFrameTime = 0;
    window.requestAnimationFrame(function loop(t) {
        let timeDelta = t-lastFrameTime;
        if (timeDelta > 500) {
            timeDelta = 10;
        }

        if (t-lastTickTime > 200) {
            gameState.frameIdx = (gameState.frameIdx + 1) % timeline.length;
            lastTickTime = t;
            renderTimeline();
        }

        if (t - lastWobbleTime > 200) {
            gameState.ships[0].frame = (gameState.ships[0].frame + 1) % 2;
            lastWobbleTime = t;
        }

        update(timeDelta);
        draw(t);

        window.requestAnimationFrame(loop);

        lastFrameTime = t;
    });
}

window.onload = function() {
    runTimelineExample();
}
