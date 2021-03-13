/**
 * Created by micro on 8/12/2017.
 */
/**
 * Implementation of a linear congruential generator.<br/>
 * The linear congruential generator follows this formula: x=(a*x+c)%n where a=multiplier, c=increment and m=modulus.<br/>
 * Multiplier, increment and modulus can be set separately or via one of the presets.<br/>
 * By default the Lehmer prng is used.
 * @name prng
 * @summary Linear congruential generator
 * @todo document
 // */
var multiplier = 48271
		 var increment = 0
		 var modulus = 2147483647
		 var seed = 123
		 var returnValue = {
  rnd: rnd
  ,random: random
  //
  ,setMultiplier: setMultiplier
  ,setIncrement: setIncrement
  ,setModulus: setModulus
  //
  ,getMultiplier: getMultiplier
  ,getIncrement: getIncrement
  ,getModulus: getModulus
  //
  ,setSeed: setSeed
  //
  ,presetLehmer: presetLehmer
  ,presetJava: presetJava
  ,presetNumeralRecipes: presetNumeralRecipes
}


/**
	 * Returns a random number between zero and the set modulus
	 * @memberOf prng
	 * @param {number} [seed] The seed from which to calculate
	 * @param {number} [iterate] The number of iterations
	 * @returns {number} An integer between zero and the set modulus
	 */
export function rnd(seed,iterate) {
  if (seed!==undefined) seed = seed
  if (iterate===undefined) iterate = 1
  while (iterate--) seed = (multiplier*seed+increment)%modulus
  return seed
}

/**
	 * Returns a random number between zero and one
	 * @memberOf prng
	 * @param {number} [seed] The seed from which to calculate
	 * @param {number} [iterate] The number of iterations
	 * @returns {number} A floating point between zero and one
	 */
export function random(seed,iterate) {
  return rnd(seed,iterate)/modulus
}

/**
	 * @memberOf prng
	 * @param {number} seed The integer seed
	 */
function setSeed(seed) { seed = seed }

/**
	 * @memberOf prng
	 * @param {number} multiplier The integer multiplier
	 */
function setMultiplier(multiplier){	multiplier = multiplier }

/**
	 * @memberOf prng
	 * @param {number} increment The integer increment
	 */
function setIncrement(increment){	increment = increment }

/**
	 * @memberOf prng
	 * @param {number} modulus The integer modulus
	 */
function setModulus(modulus){		modulus = modulus }

/**
	 * @memberOf prng
	 * @returns {number} ThFe current multiplier
	 */
function getMultiplier(){ return multiplier }

/**
	 * @memberOf prng
	 * @returns {number} The current increment
	 */
function getIncrement(){ return increment }

/**
	 * @memberOf prng
	 * @returns {number} The current modulus
	 */
function getModulus(){ return modulus }

/**
	 * Sets the current lcg settings to Lehmer
	 * @memberOf prng
	 * @param {boolean} [minstd]
	 * @returns {lcg}
	 */
function presetLehmer(minstd) {
  multiplier = minstd?16807:48271
  increment = 0
  modulus = 2147483647 // 2E31-1 mersenne prime
  return returnValue
}

/**
	 * Sets the current lcg settings to Java
	 * @memberOf prng
	 * @returns {lcg}
	 */
function presetJava() {
  multiplier = 25214903917
  increment = 11
  modulus = 2E48
  return returnValue
}

/**
	 * Sets the current lcg settings to NumeralRecipes
	 * @memberOf prng
	 * @returns {lcg}
	 */
function presetNumeralRecipes() {
  multiplier = 1664525
  increment = 1013904223
  modulus = 2E32
  return returnValue
}

export default {
	  random
  ,rnd
}