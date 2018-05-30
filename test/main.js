// Test
let cube = require('../src/ledcube5');

cube.init();
cube.run();
setTimeout(() => {
	cube.stop();
	setTimeout(() => {
		cube.run();
		setTimeout(() => {
			cube.stop();
		}, 5000);
	}, 5000);
}, 5000);
console.log(cube.getCube());
console.log(__dirname);
