/**
 * Implementation of a linear congruential generator.<br/>
 * The linear congruential generator follows this formula: x=(a*x+c)%n where a=multiplier, c=increment and m=modulus.<br/>
 * Multiplier, increment and modulus can be set separately or via one of the presets.<br/>
 * By default the Lehmer prng is used.
 * @name prng
 * @summary Linear congruential generator
 * @todo document
 */
let multiplier = 48271
let increment = 0
let modulus = 2147483647
let seed = 123
const returnValue = {
  rnd
  , random
  //
  , setMultiplier
  , setIncrement
  , setModulus
  //
  , getMultiplier
  , getIncrement
  , getModulus
  //
  , setSeed
  //
  , presetLehmer
  , presetJava
  , presetNumeralRecipes
}


/**
 * Returns a random number between zero and the set modulus
 * @memberOf prng
 * @param {number} [_seed] The seed from which to calculate
 * @param {number} [iterate] The number of iterations
 * @returns {number} An integer between zero and the set modulus
 */
export function rnd(_seed, iterate) {
  if (_seed !== undefined) seed = _seed
  if (iterate === undefined) iterate = 1
  while (iterate--) seed = (multiplier * seed + increment) % modulus
  return seed
}

/**
 * Returns a random number between zero and one
 * @memberOf prng
 * @param {number} [seed] The seed from which to calculate
 * @param {number} [iterate] The number of iterations
 * @returns {number} A floating point between zero and one
 */
export function random(seed, iterate) {
  return rnd(seed, iterate) / modulus
}

/**
 * @memberOf prng
 * @param {number} _seed The integer seed
 */
export function setSeed(_seed) {
  seed = _seed
}

/**
 * @memberOf prng
 * @param {number} _multiplier The integer multiplier
 */
export function setMultiplier(_multiplier) {
  multiplier = _multiplier
}

/**
 * @memberOf prng
 * @param {number} _increment The integer increment
 */
export function setIncrement(_increment) {
  increment = _increment
}

/**
 * @memberOf prng
 * @param {number} _modulus The integer modulus
 */
export function setModulus(_modulus) {
  modulus = _modulus
}

/**
 * @memberOf prng
 * @returns {number} ThFe current multiplier
 */
export function getMultiplier() {
  return multiplier
}

/**
 * @memberOf prng
 * @returns {number} The current increment
 */
export function getIncrement() {
  return increment
}

/**
 * @memberOf prng
 * @returns {number} The current modulus
 */
export function getModulus() {
  return modulus
}

/**
 * Sets the current lcg settings to Lehmer
 * @memberOf prng
 * @param {boolean} [minstd]
 * @returns {lcg}
 */
export function presetLehmer(minstd) {
  multiplier = minstd ? 16807 : 48271
  increment = 0
  modulus = 2147483647 // 2E31-1 mersenne prime
  return returnValue
}

/**
 * Sets the current lcg settings to Java
 * @memberOf prng
 * @returns {lcg}
 */
export function presetJava() {
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
export function presetNumeralRecipes() {
  multiplier = 1664525
  increment = 1013904223
  modulus = 2E32
  return returnValue
}