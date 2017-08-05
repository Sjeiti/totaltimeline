/**
 * @name time
 */

const YEAR_NOW = (new Date()).getFullYear()
  ,UNIVERSE = 13798000000
  ,NOW = 0
  //
  ,sSpace = ' '
  ,aAnnum = 'a,ka,Ma,Ga'.split(',')
  ,aDuration = ' kMGTP'.split('')
;

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
 * @returns {string}
 */
function formatAnnum(year,round,noSlug){
  // todo: rounding sometimes off: split at . truncate and join
  // todo: also round absolutes, ie: 4 to 4.00
  var sReturn
    ,isFuture = year<0
    ,iYear = Math.abs(year)
    ,space = noSlug===false?'':sSpace
  ;
  if (iYear>4000) {
    if (round===undefined) round = 0;
    for (var i = 0; iYear>1000 && (aAnnum.length>=(i + 2)); i++) iYear /= 1000;
    var iMult = Math.pow(10,round);
    sReturn = (Math.round(iYear * iMult) / iMult) + space + aAnnum[i];
  } else {
    iYear = Math.round(YEAR_NOW-iYear);
    sReturn = Math.abs(iYear) + (iYear<0?space+'BC':(iYear<1500?space+'AD':''));
  }
  return sReturn + (isFuture?noSlug?' from now':'-from-now':'');
}

/**
 * Calculate number of years ago from a formatted string.
 * @name totaltimeline.time.unformatAnnum
 * @method
 * @param {string} formatted
 * @returns {number}
 */
function unformatAnnum(formatted){
  var aString = formatted.match(/[a-zA-Z]+/)
    ,sString = aString?aString[0]:''
    ,aNumber = formatted.match(/[0-9\.]+/)
    ,fNumber = aNumber&&parseFloat(aNumber[0])||0 // odo: Uncaught TypeError: Cannot read property '0' of null
    ,iAgo = fNumber
  ;
  if (sString==='Ga') {
    iAgo = fNumber*1E9;
  } else if (sString==='Ma') {
    iAgo = fNumber*1E6;
  } else if (sString==='ka') {
    iAgo = fNumber*1E3;
  } else if (sString==='BC') {
    iAgo = fNumber + YEAR_NOW;
  } else if (sString==='AD'||sString==='') {
    iAgo = fNumber - YEAR_NOW;
  }
//		console.log('sMoment',sMoment); // log
//		console.log('sString',sString); // log
//		console.log('fNumber',fNumber); // log
//		console.log('iAgo',iAgo); // log
  // todo: not quite working yet for lower vs future: ie 1969 vs 3000 (make future notation similar to Ga)
  return iAgo;
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
  if (round===undefined) round = 0;
  for (var i = 0; years>1000 && (aDuration.length>=(i + 2)); i++) years /= 1000;
  var iMult = Math.pow(10,round);
  return (Math.round(years * iMult) / iMult) +sSpace+ aDuration[i] +sSpace+ 'years';
}

export default {
  YEAR_NOW
  ,UNIVERSE
  ,NOW
  ,formatAnnum
  ,unformatAnnum
  ,duration
}
