/**
 * @name time
 */

const YEAR_NOW = (new Date()).getFullYear()
const UNIVERSE = 13798000000
const NOW = 0
//
const space = ' '
const annum = 'a,ka,Ma,Ga'.split(',')
const durationKeys = ' kMGTP'.split('')


/**
 * Textual representation of annum.
 * Years are rounded and represented in a, ka, Ma and Ga.
 * Years later than 2000 BC are written in Gregorian style with BC/AD suffix.
 * Years later than 1500 AD are written without suffix.
 * @name totaltimeline.time.formatAnnum
 * @method
 * @param {number} year Number of years ago.
 * @param {number} round Number of digits to round to.
 * @param {boolean} [noSlug=true] Are there spaces between the value and the type.
 * @param {boolean} [extended=false] Appends 'ago' or 'from now'
 * @returns {string}
 */
export function formatAnnum(year,round=0,noSlug=true,extended=false){
  // todo: rounding sometimes off: split at . truncate and join
  // todo: also round absolutes, ie: 4 to 4.00
  let returnValue
  let isFuture = year<0
  let amount = Math.abs(year)
  let isGregorian = amount<4000
  let space = noSlug?' ':''
  let i
  if (isGregorian) {
    amount = Math.round(YEAR_NOW-year)
    returnValue = Math.abs(amount) + (amount<0?space+'BC':(amount<1500?space+'AD':''))
  } else {
    for (i = 0; amount>1000 && (annum.length>=(i + 2)); i++) amount /= 1000
    returnValue = amount.toFixed(round).replace(/(\.\d*)0+$/g,'$1').replace(/\.0$/g,'') + space + annum[i]
  }
  return (noSlug&&extended?'':(isFuture||isGregorian?'':'-')) + returnValue + (noSlug&&extended?(isFuture?' from now':' ago'):'')
}

/**
 * Calculate number of years ago from a formatted string.
 * @name totaltimeline.time.unformatAnnum
 * @method
 * @param {string} formatted
 * @returns {number}
 */
export function unformatAnnum(formatted){
  const isNegated = formatted.substr(0,1)==='-'
  const string = (formatted.match(/[a-zA-Z]+/)||[''])[0]
  const number = parseFloat((formatted.match(/[0-9.]+/)||[0])[0])
  let ago = number
  if (string==='Ga') {
    ago = number*1E9 * (isNegated?1:-1)
  } else if (string==='Ma') {
    ago = number*1E6 * (isNegated?1:-1)
  } else if (string==='ka') {
    ago = number*1E3 * (isNegated?1:-1)
  } else if (string==='BC') {
    ago = number + YEAR_NOW
  } else if (string==='AD'||string==='') {
    ago = YEAR_NOW - number
  }
  return ago
}

/**
 * Textual representation of duration
 * @name totaltimeline.time.duration
 * @method
 * @param {number} years
 * @param {number} round
 * @returns {string}
 */
function duration(years,round){
  // todo: rounding sometimes off: split at . truncate and join
  if (round===undefined) round = 0
  for (var i = 0; years>1000 && (durationKeys.length>=(i + 2)); i++) years /= 1000
  var multiply = Math.pow(10,round)
  return (Math.round(years * multiply) / multiply) +space+ durationKeys[i] +space+ 'years'
}

export default {
  YEAR_NOW
  ,UNIVERSE
  ,NOW
  ,formatAnnum
  ,unformatAnnum
  ,duration
}
