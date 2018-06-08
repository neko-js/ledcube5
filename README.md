# ledcube5

Controller for an LED cube of size 5x5x5 on Raspberry Pi within Node.js.

## Usage

Import `cube`. After initialising and running the cube, single LEDs can be turned on / off.

```js
const {cube} = require('ledcube5');

// Initialize I2C
cube.init();

// Run loop
cube.run();

// Turn LED at position (1, 2, 3) off
cube.set(1, 2, 3, 0);

// Turn center LED (2, 2, 2) on.
cube.set(2, 2, 2, 1);

// Get current state of the LED
console.log( cube.get(2, 2, 2) ); // 1

// Get current state of the whole cube
console.log( cube.getCube() ); // Displays a 3D array

// Stop loop
cube.stop();
```

Instead of switching single LEDs a `player` can be used to play different modes.

```js
const {player} = require('ledcube5');

// Initialize cube and player
player.init();

// Switch LEDs on and off randomly
player.random();

// Simulate rain
player.rain();

// ... More to come ...

// Stop cube and player
player.stop();
```

## Installation

Install this module via npm.

```
npm install --save git+https://github.com/smcgit/ledcube5.git
```

## Credits

This module uses following libraries:

* [i2c-bus](https://github.com/fivdi/i2c-bus)
