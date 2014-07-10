/**
 * @namespace totaltimeline.collection.periods.period
 * @param range {range}
 * @param info {eventInfo}
 */
iddqd.ns('totaltimeline.collection.periods.period',function period(range,info,offset){
	'use strict';

	var /*s = totaltimeline.string
		,*/mElement = document.createElement('div');
	mElement.classList.add('period');

//	mElement.style.backgroundColor = '#'+Math.floor(iddqd.math.prng.random(0.01234*range.start.ago)*16777215).toString(16);
	var iColor = 220 - (Math.random()*0.1*256<<0);
	mElement.style.backgroundColor = 'rgb('+iColor+','+iColor+','+iColor+')';
//	mElement.style.backgroundColor = 'rgba(0,0,0,'+Math.random()*0.1+')';
	mElement.style.marginTop = 2*offset+'rem';

	var mTitle = zen('h3.title{'+info.name + ' ' + range.start.toString() + ' - ' + range.end.toString()+'}').pop();
	mTitle.range = range;
	mElement.appendChild(mTitle);

	function coincides(time){
		return range.coincides(time.factory===period?time.range:time);
	}

	return iddqd.factory(period,{
		toString: function(){
			return '[object period, '+info.name+': '+range.start.toString()+' - '+range.end.toString()+']';
		}
		,range: range
		,info: info
		,element: mElement

//		,inside: range.inside
//		,surrounds: range.surrounds
		,coincides: coincides
	});
});