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
	let i = 0, i_l,
	j = 0, j_l,
	k = 0, k_l;
	while (true) {
		/*
		i = rand04();
		j = rand04();
		k = rand04();
		o = rand01(90);
		cube.set(i, j, k, o);
		// console.log(i, j, k, o);
		*/
		cube.set(k, j, i, 1);
		cube.set(k_l, j_l, i_l, 0);
		i_l = i;
		j_l = j;
		k_l = k;
		i++;
		if(i > 4){
			i = 0;
			j++;
			if(j > 4){
				j = 0;
				k++;
				if(k > 4){
					k = 0;
				}
			}
		}
		
		await sleep(200);
	}
}

run();

console.log(cube.getCube());
