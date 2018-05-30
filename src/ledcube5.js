let i2c = require('i2c');
let mcp1;
let mcp2;
const GPIOA = 0x12;
const GPIOB = 0x13;

/*
 * 
 * Therefore every layer consists of 4 bytes
 * from LSB0: GPA pins on MCP1, GPB MCP1, GPA MCP2, GPB MCP2
 */
const layerbytes = [0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000];

/*
 * Pin numbers the LED cube is connected to
 * E.g. Pin number 0 = GPA0 on MCP1, 1 = GPA1 MCP1, ..., 8 = GPB0 MCP1, ..., 31 = GPB8 MCP2
 */
const layerpins = [26, 27, 28, 29, 30];
const matrixpins = [
	[0, 1, 2, 3, 4],
	[5, 6, 7, 8, 9],
	[10, 11, 12, 13, 14],
	[16, 17, 18, 19, 20],
	[21, 22, 23, 24, 25]];

const init = () => {
	mcp1 = new i2c(0b01000000, {device: '/dev/i2c-1'});
	mcp2 = new i2c(0b01000010, {device: '/dev/i2c-1'}); // A0 set to 1
	
	mcp1.write(0x00, err => {}); // IODIRA register
	mcp1.write(0x00, err => {}); // set all of bank A to outputs
	mcp1.write(0x00, err => {}); // set all of bank B to outputs
	
	mcp2.write(0x00, err => {}); // IODIRA register
	mcp2.write(0x00, err => {}); // set all of bank A to outputs
	mcp2.write(0x00, err => {}); // set all of bank B to outputs
	
	let i, j, k;
	
	// Set up pins for each layer
	for(i = 0; i < 5; i++){
		// Set all layer pins to 1
		for(j = 0; j < 5; j++){
			layerbytes[j] |= 1 << layerpins[j];
		}
		// Set current layer to 0 (by setting inversion to 1 and then inverting back)
		layerbytes[i] = ~((~layerbytes[i]) | (1 << layerpins[i]));
		
		// Set matrix pins to 1
		for(j = 0; j < 5; j++){
			for(k = 0; k < 5; k++){
				layerbytes[i] |= (1 << matrixpins[j][k]) * 1; /*cube[i][j][k]*/
			}
		}
	}
};

const sleep = (ms) =>{
	return new Promise(resolve => setTimeout(resolve, ms));
};

let stopTriggered = false;

const run = () => {
	setImmediate(async function(){
		let l;
		const READ_CUBE_EVERY = 10;
		const FREQUENCY = 2;
		while(true){
			for(l = 0; l < 5; l++){
				// Write layer
				mcp1.writeBytes(GPIOA, (layerbytes[l] & 0x000000FF) >>> 0, err => {});
				mcp1.writeBytes(GPIOB, (layerbytes[l] & 0x0000FF00) >>> 8, err => {});
				mcp2.writeBytes(GPIOA, (layerbytes[l] & 0x00FF0000) >>> 16, err => {});
				mcp2.writeBytes(GPIOB, (layerbytes[l] & 0xFF000000) >>> 24, err => {});
				console.log((layerbytes[l] & 0xFF000000) >>> 24);
				await sleep(1/FREQUENCY*1e3);
			}
			if(stopTriggered){
				stopTriggered = false;
				break;
			}
		}
	});
};

const stop = () => {
	stopTriggered = true;
};

/*
 * Set cube element i,j,k to state by setting the matrix pin in i-th layer to state.
 */
const set = (i, j, k, state) => {
	i = Math.abs(i);
	j = Math.abs(j);
	k = Math.abs(k);
	i = i < 5 ? i : 4;
	j = j < 5 ? j : 4;
	k = k < 5 ? k : 4;
	
	if(state){
		layerbytes[i] |= 1 << matrixpins[j][k];
	}
	else{
		layerbytes[i] = ~((~layerbytes[i]) | 1 << matrixpins[j][k]);
	}
};

const get = (i, j, k) => {
	return (layerbytes[i] & (1 << matrixpins[j][k])) >>> matrixpins[j][k];
};

const getCube = () => {
	let cube = [];
	for(let i = 0; i < 5; i++){
		cube[i] = [];
		for(let j = 0; j < 5; j++){
			cube[i][j] = [];
			for(let k = 0; k < 5; k++){
				cube[i][j][k] = get(i,j,k);
			}
		}
	}
	return cube;
};

module.exports = {
	set,
	get,
	getCube,
	init,
	run,
	stop
};
