
function GameLoop(ppv) {
    var isLooping = true,
        frameRate    = 60,
        frameStep    = 0,
        frameCounter = 0,
        timeLast     = timestamp(),
        timeNow      = 0,
        dt           = 0,
        delta        = 0,
        fps          = 0,
        renderConfig = {
            position : ppv.getConfig().position
        },
        stats = new Stats(),
        statsDOM = document.body.appendChild(stats.dom);

    var n = 0, m = 0, t = 0;
    var startPosition = ppv.getConfig().position;

    // ---------------------------------------------------------------------------------------------------------- PUBLIC

    function run() {
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        requestAnimFrame(frame);
    }

    // --------------------------------------------------------------------------------------------------------- METHODS

    function FrameCounter (counter) {
        return counter;
    }


    function getShiftPosition(pxPerSec, dt) {
        return (pxPerSec / frameRate) + ((pxPerSec / frameRate) * dt);
    }


    /*function getCircleShiftPositionX(dt) {
        var degPerFrame = 360 / (frameRate / frameStep);

        // cos(RAD_0) = 1, cos(RAD_90) = 0; cos(RAD_180) = -1, cos(RAD_270) = 0
        return Math.cos(Math.radians(degPerFrame));
    }*/


    function getCircleShiftPositionX(rotPos, radius, sec, dt) {
        var degPerFrame           = 360 / frameRate / sec;  // 6°
        var degOnCurrentFrameStep = degPerFrame * (frameCounter);        // [1, ..., 25] * 6°


        // cos(RAD_0) = 1, cos(RAD_90) = 0; cos(RAD_180) = -1, cos(RAD_270) = 0
        return rotPos.x + (Math.cos(Math.radians(degOnCurrentFrameStep)) * radius);
        //return Math.cos(Math.radians(degOnCurrentFrameStep));
    }


    function getCircleShiftPositionY(rotPos, radius, sec, dt) {
        var degPerFrame           = 360 / frameRate / sec;
        var degOnCurrentFrameStep = degPerFrame * (frameCounter);

        return rotPos.y + (Math.sin(Math.radians(degOnCurrentFrameStep)) * radius);
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

            t = 8;
            n = getCircleShiftPositionX(startPosition, 200, t, dt);
            m = getCircleShiftPositionY(startPosition, 200, t, dt);

            if (frameCounter == t * frameRate) {
                frameCounter = 0;
            }
        }

        renderConfig = {
            position : {
                x : n,
                y : m
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
