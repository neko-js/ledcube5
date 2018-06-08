// Test
let cube = require('../src/ledcube5');

cube.init();
cube.run();

const rand01 = (p = 50) => Math.random()*100 < p ? 0 : 1;
const rand04 = () => Math.round(Math.random() * 4);

const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

async function run() {
	let i,
	j,
	k;
	while (true) {
		i = rand04();
		j = rand04();
		k = rand04();
		o = rand01(75);
		cube.set(i, j, k, o);
		// console.log(i, j, k, o);
		await sleep(10);
	}
}

run();

console.log(cube.getCube());
