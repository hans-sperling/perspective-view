# Perspective-view

Delivers a simple javascript methods pool for rendering grid based (array) maps into a virtual, perspective, 3d top view
with canvas.

[![Visual description](https://raw.githubusercontent.com/hans-sperling/perspective-view/master/dev/img/visual-description.jpg "Click to try a demo of the latest perspective-view version")](https://hans-sperling.github.io/perspective-view/)
[Click to try a demo of the latest perspective-view version](https://hans-sperling.github.io/perspective-view/)


## Initialize

The fast and simple way:
```javascript
    var ppv = new PerspectiveView({                                       // HTML Object of the canvas
        canvas    : document.getElementById('myCanvas'),                  // The 2d context of the canvas
        context   : document.getElementById('myCanvas').getContext('2d'), // Your complete map
        map       : [
            [2, 0, 1, 0, 2],
            [0, 0, 0, 0, 0],
            [1, 0, 3, 0, 1],
            [0, 0, 0, 0, 0],
            [2, 0, 1, 0, 2]
        ]
    });

    ppv.render(); // Render the perspective-view of the given map
```

The detailed way:
```javascript
var config = {
    canvas    : document.getElementById('myCanvas'),                 // HTML Object of the canvas
    context   : ocument.getElementById('myCanvas').getContext('2d'), // The 2d context of the canvas
    map       : [                                                    // Your complete map
        [2, 0, 1, 0, 2], 
        [0, 0, 0, 0, 0],
        [1, 0, 3, 0, 1],
        [0, 0, 0, 0, 0],
        [2, 0, 1, 0, 2]],
        unitSize  : 100, // Size of a cel in the grid
        unitDepth : 1.1, // Factor to set the depth (height) of an object
        position  : {    // Position on the map in px for the center of the visible part
        x : 250,
        y : 250
    },
    camera    : {
        width    : 800, // canvas.width
        height   : 600, // canvas.height
        position : {
            x : 400,    // (canvas.width  / 2)
            y : 300     // (canvas.height / 2)
        }
    },
    render : {
        mode      : 'default', // [flat, uniform, default]
        wireFrame : false,     // Show map as wire frame
        grid      : false,     // Display a grid for better map view
        camera    : false      // Draw the camera into the canvas
    },
    color : {
        mode        : 'default',                      // [default] - other modes will be following
        objectColor : {r: 200, g: 200, b: 200, a: 1}, // RGBA-color of an object
        spaceColor  : {r: 255, g: 255, b: 255, a: 0}, // RGBA-color of empty space
        lighting    : {                               // Lighting describes how much percent a specific shape will be
            base   : 0,                               // deviates from the objectColor
            east   : -10,
            front  : 0,
            height : 2,                               // Special - The higher an object is the brighter/darker the
            north  : -20,                             // front color will be
            south  : 0,
            west   : -15
        }
    }
}

var ppv = new PerspectiveView(config); // Create an instance of perspective-view with your config

ppv.render();                          // Render the perspective-view of the given map

```


## Methods

### update(config);
- Description: Updates/Merges the given config with the existing one and overwrites identically named properties
- Argument(s): `object` **config** - Updated properties
- Return: `void`

**Example**:
```javascript
    ppv.update({
        position : { x : 252, y : 250 }
    });

    ppv.render();

    ppv.update({
        position : { x : 254, y : 251 }
    });

    ppv.render();
```

### render()
- Description: Renders the ma with the currently set config.
- Argument(s): `void`
- Return: `void`

**Example**:
```javascript
    ppv.render(); 
```


## Configuration

### camera
- Description: Properties of the camera (the visible part of the map in the canvas).
- Type: `object`
  - Property `number` **camera.width**: A regular value is i.e. _canvas.width_
  - Property `number` **camera.height**: A regular value is i.e. _canvas.height_
  - Property `object` **camera.position**: Position of the cameras center in the canvas
    - Property `number` **camera.position.x**: A regular value is i.e. _canvas.width / 2_
    - Property `number` **camera.position.y**: A regular value is i.e. _canvas.height / 2_
- _recommended_

**Example**:
```javascript
    // Fixed values
    ppv.update({
        camera : {
            width    : 800,
            height   : 600,
            position : {
                x : 400,
                y : 300
            }
        }
    });
    
    // Regular use case
    ppv.update({
        camera : {
            width    : canvas.width,
            height   : canvas.height,
            position : {
                x : (canvas.width  / 2),
                y : (canvas.height / 2)
            }
        }
    });
```


### canvas
- Description: HTML Object of the canvas where to draw to.
- Type: `html-object`
- **necessary!**

**Example**:
```javascript
    ppv.update({
        canvas : document.getElementById('myCanvas')
    });
```


### color
- Description: Sets the colors of the objects, to provide a 3d lightning illusion
- Type: `object`
  - Property `string` **color.mode**: Type of coloring object [default]
  - Property `object` **color.objectColor**: RGBA-Color-Object of an object
  - Property `object` **color.spaceColor**: RGBA-Color-Object of empty space
  - Property `object` **color.lighting**: Percentage deviation of the objectColor for the shapes
    - Property `number` **color.lighting.base**: Percentage deviation of the base shape
    - Property `number` **color.lighting.east**: Percentage deviation of the east shape
    - Property `number` **color.lighting.front**: Percentage deviation of the front shape
    - Property `number` **color.lighting.height**: Percentage deviation of the front shape plus the height of an object
    - Property `number` **color.lighting.north**: Percentage deviation of the north shape
    - Property `number` **color.lighting.south**: Percentage deviation of the south shape
    - Property `number` **color.lighting.west**: Percentage deviation of the west shape
- _recommended_

**Example**:
```javascript
    // Default color module, base object color, no space color,
    // pseudo lighting from the top-south-east (like  midday),
    // objects are be brighter, the higher they are
    ppv.update({
        color : {
            mode        : 'default',
            objectColor : {r: 200, g: 200, b: 200, a: 1},
            spaceColor  : {r: 255, g: 255, b: 255, a: 0},
            lighting    : {
                base   : 0,
                east   : -10,
                front  : 0,
                height : 2,
                north  : -20,
                south  : 0,
                west   : -15
            }
        }
    });
```


### context
- Description: 2d context of the canvas.
- Type: `html-object`
- **necessary!**

**Example**:
```javascript
    ppv.update({
        context : document.getElementById('myCanvas').getContext('2d'),
    });
```


### map
- Description: 2d-Array of the map, where 0 represents space and 1 or higher for an object with the given height.
- Type: `array`
- **necessary!**

**Example**:
```javascript
    // Simple map - Objects from base to given height
    ppv.update({
        map : [
            [2, 0, 1, 0, 2], 
            [0, 0, 0, 0, 0],
            [1, 0, 3, 0, 1],
            [0, 0, 0, 0, 0],
            [2, 0, 1, 0, 2]
        ],
    });
    
    // Advanced map - Some objects are floating
    ppv.update({
        map : [
            [2, 1,   1,     2,     1,   1, 2],
            [1, 0,   0,     0,     0,   0, 1],
            [1, 0,   2,   [1,2],   2,   0, 1],
            [2, 0, [1,2],   0,   [1,2], 0, 2],
            [1, 0,   2,   [1,2],   2,   0, 1],
            [1, 0,   0,     0,     0,   0  1],
            [2, 1,   1,     2,     1,   1, 2]
        ],
    });
```


### position
- Description: Position in the map the camera position will be set
- Type: `object`
  - Property `number` **position.x**: Position on x axis
  - Property `number` **position.y**: Position on y axis
- _recommended_

**Example**:
```javascript
    ppv.update({
        position : {
            x : 250,
            y : 250
        },
    });
```


### render
- Description: Config to change the render option
- Type: `object`
  - Property `string` **render.mode**: [flat, uniform, default] _flat_ will draw shapes in unitSize, _uniform_ will draw
    objects in the same height, and in _default_ mode the objects will be drawn as high as they are declared in the map
  - Property `boolean` **render.wireFrame**: Renders all objects as wire frame object instead of filling them 
  - Property `boolean` **render.grid**: Draws a grid in unitSize into the canvas
  - Property `boolean` **render.camera**: Draws the camera into the canvas

**Example**:
```javascript
    // Render in default mode as wire frame
    ppv.update({
        render : {
            // mode   : 'default', // Defaults must not be set, so the render mode will be set by default
            wireFrame : true
        },
    });
    
    // Render all object flat and show an grid
    ppv.update({
        render : {
            mode : 'flat',
            grid : true
        },
    });
    
    // Render all object in the same height as wire fram and draw a grid and show camera
    ppv.update({
        render : {
            mode      : 'uniform',
            wireFrame : true,
            grid      : true,
            camera    : true
        },
});
```


### unitDepth
- Description: Describes a factor for the depth effect/height ob an object where 1 represents a flat object in unitSize 
  and 2 represents a double sized object front. Regular values are near by 1.
- Type: `number`
- _recommended_

**Example**:
```javascript
    // Regular use case
    ppv.update({
        unitDepth : 1.1
    });
    
    // Objects width no height (flat), same as render-mode flat
    ppv.update({
        unitDepth : 1
    });
```


### unitSize
- Description: X any Y size of an unit (single object) in your mal given in px.
- Type: `number`
- _recommended_ 

**Example**:
```javascript
    // The size of all object bases are 100x100 pixel
    ppv.update({
        unitSize : 100
    });
```
