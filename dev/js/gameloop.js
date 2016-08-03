
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
        stats = new Stats(),
        statsDOM = document.body.appendChild(stats.dom);

    var x = 0, y = 0, t = 0;
    var position = ppv.getConfig().position;

    // ---------------------------------------------------------------------------------------------------------- PUBLIC

    function run() {
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        requestAnimFrame(frame);
    }

    // --------------------------------------------------------------------------------------------------------- METHODS


    /*function getShiftPosition(pos, pxPerSec, dt) {
        return (pos + (pxPerSec / frameRate) + ((pxPerSec / frameRate) * dt));
    }*/


    function getShiftPosition(startPos, stopPos, sec, dt) {
        var pxPerFrame           = (stopPos - startPos) / frameRate / sec;
        var pxOnCurrentFrameStep = pxPerFrame * (sceneFrameCounter);

        return (startPos + pxOnCurrentFrameStep);
    }


    function getCircleShiftPositionX(rotPos, radius, sec, startAngle, dt) {
        var degPerFrame           = 360 / frameRate / sec;
        var degOnCurrentFrameStep = degPerFrame * (sceneFrameCounter);

        return rotPos.x + (Math.cos(Math.radians(degOnCurrentFrameStep + startAngle)) * radius);
    }

    function getCircleShiftPositionXReversed(rotPos, radius, sec, startAngle, dt) {
        var degPerFrame           = 360 / frameRate / sec;
        var degOnCurrentFrameStep = degPerFrame * (sceneFrameCounter);

        return rotPos.x + (Math.cos(Math.radians(360 - degOnCurrentFrameStep + startAngle)) * radius);
    }


    function getCircleShiftPositionY(rotPos, radius, sec, startAngle, dt) {
        var degPerFrame           = 360 / frameRate / sec;
        var degOnCurrentFrameStep = degPerFrame * (sceneFrameCounter);

        return rotPos.y + (Math.sin(Math.radians(degOnCurrentFrameStep + startAngle)) * radius);
    }


    function getCircleShiftPositionYReversed(rotPos, radius, sec, startAngle, dt) {
        var degPerFrame           = 360 / frameRate / sec;
        var degOnCurrentFrameStep = degPerFrame * (sceneFrameCounter);

        return rotPos.y + (Math.sin(Math.radians(360 - degOnCurrentFrameStep + startAngle)) * radius);
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
                position = { x: 850, y : 750 };

                x = position.x;
                y = position.y;
            }
            else if (frameCounter > 1 && frameCounter < 91) {
                sceneFrameCounter = frameCounter - 1 + 1;
                position          = { x: 850, y : 750 };

                x = position.x;
                y = getShiftPosition(position.y, position.y + 100, 1, dt);
            }
            else if (frameCounter >= 91 && frameCounter < 151) {
                sceneFrameCounter = frameCounter - 91 + 1;
                position          = { x: 800, y : 900 };

                x = getCircleShiftPositionX(position, 50, 4, 0, dt);
                y = getCircleShiftPositionY(position, 50, 4, 0, dt);
            }
            else if (frameCounter >= 151 && frameCounter < 211) {
                sceneFrameCounter = frameCounter - 151 + 1;
                position          = { x: 800, y : 950 };

                x = getShiftPosition(position.x, position.x - 100, 1, dt);
                y = position.y;
            }
            else if (frameCounter >= 211 && frameCounter < 271) {
                sceneFrameCounter = frameCounter - 211 + 1;
                position = { x: 700, y : 1000 };

                x = getCircleShiftPositionXReversed(position, 50, 4, -90, dt);
                y = getCircleShiftPositionYReversed(position, 50, 4, -90, dt);
            }
            else if (frameCounter >= 271 && frameCounter < 331) {
                sceneFrameCounter = frameCounter - 271 + 1;
                position = { x: 650, y : 1000 };

                x = position.x;
                y = getShiftPosition(position.y, position.y + 100, 1, dt);
            }
            else if (frameCounter >= 331 && frameCounter < 391) {
                sceneFrameCounter = frameCounter - 331 + 1;
                position = { x: 600, y : 1100 };

                x = getCircleShiftPositionX(position, 50, 4, 0, dt);
                y = getCircleShiftPositionY(position, 50, 4, 0, dt);
            }
            else if (frameCounter >= 391 && frameCounter < 631) {
                sceneFrameCounter = frameCounter - 391 + 1;
                position          = { x: 600, y : 1150 };

                x = getShiftPosition(position.x, position.x - 400, 4, dt);
                y = position.y;
            }
            else if (frameCounter >= 631 && frameCounter < 691) {
                sceneFrameCounter = frameCounter - 631 + 1;
                position = { x: 200, y : 1100 };

                x = getCircleShiftPositionX(position, 50, 4, 90, dt);
                y = getCircleShiftPositionY(position, 50, 4, 90, dt);
            }
            else if (frameCounter >= 691 && frameCounter < 871) {
                sceneFrameCounter = frameCounter - 691 + 1;
                position          = { x: 150, y : 1100 };

                x = position.x;
                y = getShiftPosition(position.y, position.y - 300, 3, dt);
            }
            else if (frameCounter >= 871 && frameCounter < 931) {
                sceneFrameCounter = frameCounter - 871 + 1;
                position = { x: 200, y : 800 };

                x = getCircleShiftPositionX(position, 50, 4, 180, dt);
                y = getCircleShiftPositionY(position, 50, 4, 180, dt);
            }
            else if (frameCounter >= 931 && frameCounter < 1051) {
                sceneFrameCounter = frameCounter - 931 + 1;
                position          = { x: 200, y : 750 };

                x = getShiftPosition(position.x, position.x + 200, 2, dt);
                y = position.y;
            }
            else if (frameCounter >= 1051 && frameCounter < 1111) {
                sceneFrameCounter = frameCounter - 1051 + 1;
                position = { x: 400, y : 700 };

                x = getCircleShiftPositionXReversed(position, 50, 4, 90, dt);
                y = getCircleShiftPositionYReversed(position, 50, 4, 90, dt);
            }
            else if (frameCounter >= 1111 && frameCounter < 1171) {
                sceneFrameCounter = frameCounter - 1111 + 1;
                position          = { x: 450, y : 700 };

                x = position.x;
                y = getShiftPosition(position.y, position.y - 100, 1, dt);
            }
            else if (frameCounter >= 1171 && frameCounter < 1231) {
                sceneFrameCounter = frameCounter - 1171 + 1;
                position = { x: 500, y : 600 };

                x = getCircleShiftPositionX(position, 50, 4, 180, dt);
                y = getCircleShiftPositionY(position, 50, 4, 180, dt);
            }
            else if (frameCounter >= 1231 && frameCounter < 1411) {
                sceneFrameCounter = frameCounter - 1231 + 1;
                position          = { x: 500, y : 550 };

                x = getShiftPosition(position.x, position.x + 300, 3, dt);
                y = position.y;
            }
            else if (frameCounter >= 1411 && frameCounter < 1471) {
                sceneFrameCounter = frameCounter - 1411 + 1;
                position = { x: 800, y : 600 };

                x = getCircleShiftPositionX(position, 50, 4, -90, dt);
                y = getCircleShiftPositionY(position, 50, 4, -90, dt);
            }
            else if (frameCounter >= 1471 && frameCounter < 1561) {
                sceneFrameCounter = frameCounter - 1471 + 1;
                position          = { x: 850, y : 600 };

                x = position.x;
                y = getShiftPosition(position.y, position.y + 100, 1, dt);
            }
            else if (frameCounter >= 1561) {
                sceneFrameCounter = 0;
                frameCounter = 0;
            }

            /**/
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
