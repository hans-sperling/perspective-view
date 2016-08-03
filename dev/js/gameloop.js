
function GameLoop(ppv) {
    var isLooping         = true,
        frameRate         = 60,
        frameStep         = 0,
        frameCounter      = 0,
        sceneFrameCounter = 0,
        timeLast          = timestamp(),
        timeNow           = 0,
        dt                = 0,
        delta             = 0,
        fps               = 0,
        renderConfig      = {
            position : ppv.getConfig().position
        },
        position,
        rotationPosition,
        newPosition,
        stats = new Stats(),
        statsDOM = document.body.appendChild(stats.dom);

    var x = 0, y = 0, t = 0;


    // ---------------------------------------------------------------------------------------------------------- PUBLIC

    function run() {
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        requestAnimFrame(frame);
    }

    // --------------------------------------------------------------------------------------------------------- METHODS

    function getShiftPosition(startPosition, endPosition, frames, dt) {
        var pxPerFrameX           = (endPosition.x - startPosition.x) / frameRate / (frames / frameRate);
        var pxPerFrameY           = (endPosition.y - startPosition.y) / frameRate / (frames / frameRate);
        var pxOnCurrentFrameStepX = pxPerFrameX * (sceneFrameCounter);
        var pxOnCurrentFrameStepY = pxPerFrameY * (sceneFrameCounter);

        return {
            x : (startPosition.x + pxOnCurrentFrameStepX),
            y : (startPosition.y + pxOnCurrentFrameStepY)
        };
    }


    function getCirclePosition(rotationPosition, radius, startAngle, endAngle, frames, reversed, dt) {
        var degPerFrame           = (endAngle - startAngle) / frameRate / (frames / frameRate);
        var degOnCurrentFrameStep = degPerFrame * (sceneFrameCounter);
        var vectorX               = 0;
        var vectorY               = 0;

        if (reversed) {
            vectorX = (Math.cos(Math.radians((endAngle - startAngle) - degOnCurrentFrameStep + startAngle)));
            vectorY = (Math.sin(Math.radians((endAngle - startAngle) - degOnCurrentFrameStep + startAngle)));
        }
        else {
            vectorX = (Math.cos(Math.radians(degOnCurrentFrameStep + startAngle)));
            vectorY = (Math.sin(Math.radians(degOnCurrentFrameStep + startAngle)));
        }

        return {
            x : (rotationPosition.x + (vectorX * radius)),
            y : (rotationPosition.y + (vectorY * radius))
        }
    }


    function frame() {
        timeNow = timestamp();
        delta   = ((timeNow - timeLast) / 1000);
        dt      = (dt + Math.min(1, delta));
        fps     = (1 / delta);

        stats.begin();

        // Update config in desired frame rate
        while (dt > (1 / frameRate)) {
            dt        = dt - (1 / frameRate);
            frameStep = (frameStep + 1) % frameRate;
            frameCounter++;
            sceneFrameCounter++;


            if (frameCounter == 1) {
                sceneFrameCounter = frameCounter - 1 + 1;
                position          = { x: 850, y : 750 };

                x = position.x;
                y = position.y;
            }
            else if (frameCounter >     1 && frameCounter <   91) {
                sceneFrameCounter = frameCounter - 1 + 1;
                position          = { x: 850, y : 750 };
                newPosition       = getShiftPosition(position, { x : 850, y : 850 }, 60, dt);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >=   91 && frameCounter <  151) {
                sceneFrameCounter = frameCounter - 91 + 1;
                rotationPosition  = { x: 800, y : 900 };
                newPosition       = getCirclePosition(rotationPosition, 50, 0, 90, 60, false);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >=  151 && frameCounter <  211) {
                sceneFrameCounter = frameCounter - 151 + 1;
                position          = { x: 800, y : 950 };
                newPosition       = getShiftPosition(position, { x : 700, y : 950 }, 60, dt);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >=  211 && frameCounter <  271) {
                sceneFrameCounter = frameCounter - 211 + 1;
                rotationPosition  = { x: 700, y : 1000 };
                newPosition       = getCirclePosition(rotationPosition, 50, 180, 270, 60, true);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >=  271 && frameCounter <  331) {
                sceneFrameCounter = frameCounter - 271 + 1;
                position          = { x: 650, y : 1000 };
                newPosition       = getShiftPosition(position, { x : 650, y : 1100 }, 60, dt);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >=  331 && frameCounter <  391) {
                sceneFrameCounter = frameCounter - 331 + 1;
                rotationPosition  = { x: 600, y : 1100 };
                newPosition       = getCirclePosition(rotationPosition, 50, 0, 90, 60, false);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >=  391 && frameCounter <  631) {
                sceneFrameCounter = frameCounter - 391 + 1;
                position          = { x: 600, y : 1150 };
                newPosition       = getShiftPosition(position, { x : 200, y : 1150 }, 240, dt);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >=  631 && frameCounter <  691) {
                sceneFrameCounter = frameCounter - 631 + 1;
                rotationPosition  = { x: 200, y : 1100 };
                newPosition       = getCirclePosition(rotationPosition, 50, 90, 180, 60, false);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >=  691 && frameCounter <  871) {
                sceneFrameCounter = frameCounter - 691 + 1;
                position          = { x: 150, y : 1100 };
                newPosition       = getShiftPosition(position, { x : 150, y : 800 }, 180, dt);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >=  871 && frameCounter <  931) {
                sceneFrameCounter = frameCounter - 871 + 1;
                rotationPosition  = { x: 200, y : 800 };
                newPosition       = getCirclePosition(rotationPosition, 50, 180, 270, 60, false);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >=  931 && frameCounter < 1051) {
                sceneFrameCounter = frameCounter - 931 + 1;
                position          = { x: 200, y : 750 };
                newPosition       = getShiftPosition(position, { x : 400, y : 750 }, 120, dt);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >= 1051 && frameCounter < 1111) {
                sceneFrameCounter = frameCounter - 1051 + 1;
                rotationPosition  = { x: 400, y : 700 };
                newPosition       = getCirclePosition(rotationPosition, 50, 0, 90, 60, true);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >= 1111 && frameCounter < 1171) {
                sceneFrameCounter = frameCounter - 1111 + 1;
                position          = { x: 450, y : 700 };
                newPosition       = getShiftPosition(position, { x : 450, y : 600 }, 60, dt);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >= 1171 && frameCounter < 1231) {
                sceneFrameCounter = frameCounter - 1171 + 1;
                rotationPosition  = { x: 500, y : 600 };
                newPosition       = getCirclePosition(rotationPosition, 50, 180, 270, 60, false);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >= 1231 && frameCounter < 1411) {
                sceneFrameCounter = frameCounter - 1231 + 1;
                position          = { x: 500, y : 550 };
                newPosition       = getShiftPosition(position, { x : 800, y : 550 }, 180, dt);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >= 1411 && frameCounter < 1471) {
                sceneFrameCounter = frameCounter - 1411 + 1;
                rotationPosition = { x: 800, y : 600 };
                newPosition       = getCirclePosition(rotationPosition, 50, -90, 0, 60, false);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >= 1471 && frameCounter < 1561) {
                sceneFrameCounter = frameCounter - 1471 + 1;
                position          = { x: 850, y : 600 };
                newPosition       = getShiftPosition(position, { x : 850, y : 700 }, 60, dt);

                x = newPosition.x;
                y = newPosition.y;
            }
            else if (frameCounter >= 1561) {
                sceneFrameCounter = 0;
                frameCounter = 0;
            }
        }

        renderConfig = {
            position : {
                x : x,
                y : y
            }
        };

        // Update and render ppv in original frame rate
        ppv.update(renderConfig);
        ppv.render();

        stats.end();

        if (isLooping) {
            timeLast = timeNow;

            requestAnimFrame(frame);
        }
    }

    // --------------------------------------------------------------------------------------------------------- RETURNS

    return {
        run : run
    }
}
