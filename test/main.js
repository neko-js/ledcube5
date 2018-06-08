// Test
let cube = require('../src/ledcube5');

cube.init();
cube.run();

const rand01 = () => Math.round(Math.random());
const rand04 = () => Math.round(Math.random() * 4);

const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

/*
function run() {
	setImmediate(async function () {
		let i, j, k;
		while (true) {
			i = rand04();
			j = rand04();
			k = rand04();
			o = rand01();
			cube.set(i, j, k, o);
			console.log(i, j, k, o);
			// await sleep(500);
		}
	});
}
*/

let i, j, k;
for(let t=0; t < 1000; t++){
	setTimeout(() => {
		i = rand04();
		j = rand04();
		k = rand04();
		o = rand01();
		cube.set(i, j, k, o);
		console.log(t, i, j, k, o);
	}, t*500);
}

console.log(cube.getCube());
