# Perspective-view

Delivers a simple javascript methods pool for rendering grid based (array) maps into a virtual, perspective, 3d top view
with canvas.

[![Visual description](https://raw.githubusercontent.com/hans-sperling/perspective-view/master/dev/img/visual-description.png "Click to try a demo of the latest perspective-view version")](https://hans-sperling.github.io/perspective-view/)
[Click to try a demo of the latest perspective-view version](https://hans-sperling.github.io/perspective-view/)


## Initialize

```javascript
var config = {
    canvas    : document.getElementById('myCanvas'), // HTML Object of the canvas
    context   : canvas.getContext('2d'),             // The 2d context of the canvas 
    map       : [                                    // Your complete map
        [2, 0, 1, 0, 2], 
        [0, 0, 0, 0, 0],
        [1, 0, 3, 0, 1],
        [0, 0, 0, 0, 0],
        [2, 0, 1, 0, 2]],
        unitSize  : 100,                             // Size of a cel in the grid
        unitDepth : 1.1,                             // Factor to set the depth (height) of an object
        position  : {                                // Position on the map in px for the center of the visible part
        x : 250,
        y : 250
    },
    camera    : {
        width    : 800,                              // canvas.width
        height   : 600,                              // canvas.height
        position : {
            x : 400,                                 // (canvas.width  / 2)
            y : 300                                  // (canvas.height / 2)
        }
    },
    render : {
        mode      : 'normal',                        // [flat, normal, uniform]
        wireFrame : false,                           // Show map as wire frame
        grid      : false,                           // Display a grid for better map view
        camera    : false                            // Draw the camera into the canvas
    }
}

var ppv = new PerspectiveView(config);               // Create an instance of perspective-view with your config

ppv.render();                                        // Render the perspective-view of the given map

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

### canvas
- Description: HTML Object of the canvas where to draw to.
- Type: `html-object`
- **necessary!**


### context
- Description: 2d context of the canvas.
- Type: `html-object`
- **necessary!**


### map
- Description: 2d-Array of the map, where 0 represents space and 1 or higher for an object with the given height.
- Type: `array`
- **necessary!**


### unitSize
- Description: X any Y size of an unit (single object) in your mal given in px.
- Type: `number`
- _recommended_ 


### unitDepth
- Description: Describes a factor for the depth effect/height ob an object where 1 represents a flat object in unitSize 
  and 2 represents a double sized object front. Regular values are near by 1.
- Type: `number`
- _recommended_


### position
- Description: Position in the map the camera position will be set
- Type: `object`
  - Property `number` **position.x**
  - Property `number` **position.y**
- _recommended_


### camera
- Description: Properties of the camera (the visible part of the map in the canvas).
- Type: `object`
  - Property `number` **camera.width** A regular value is i.e. _canvas.width_
  - Property `number` **camera.height** A regular value is i.e. _canvas.height_
  - Property `object` **camera.position** Position of the cameras center in the canvas
    - Property `number` **camera.position.x** A regular value is i.e. _canvas.width / 2_
    - Property `number` **camera.position.y** A regular value is i.e. _canvas.height / 2_
- _recommended_


### render
- Description: Config to change the render option
- Type: `object`
  - Property `string` **render.mode** [flat, uniform, normal] _flat_ will draw shapes in unitSize, _uniform_ will draw 
    objects in the same height, and in _normal_ mode the objects will be drawn as high as they are declared in the map 
  - Property `boolean` **render.wireFrame** Renders all objects as wire frame object instead of filling them 
  - Property `boolean` **render.grid** Draws a grid in unitSize into the canvas
  - Property `boolean` **render.camera** Draws the camera into the canvas
