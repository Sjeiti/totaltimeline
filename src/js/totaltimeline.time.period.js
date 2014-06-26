/**
 * @name period
 * @namespace totaltimeline.time
 * @param range {range}
 * @param info {eventInfo}
 */
iddqd.ns('totaltimeline.time.period',function period(range,info,offset){
	'use strict';

	var s = totaltimeline.string
		,aChildren = []
		,mElement = document.createElement('div');
	mElement.classList.add('period');
	mElement.innerText = info.name + ' ' + range.start.toString() + ' - ' + range.end.toString();
	mElement.setAttribute('title',info.name);
//	mElement.style.backgroundColor = '#'+Math.floor(iddqd.math.prng.random(0.01234*range.start.ago)*16777215).toString(16);
	var iColor = 220 - (Math.random()*0.1*256<<0);
	mElement.style.backgroundColor = 'rgb('+iColor+','+iColor+','+iColor+')';
//	mElement.style.backgroundColor = 'rgba(0,0,0,'+Math.random()*0.1+')';
	mElement.style.marginTop = 2*offset+'rem';

	function addPeriod(period){
		var mPeriodElement = period.element
			,iDuration = range.duration;
		mElement.appendChild(mPeriodElement);
		mPeriodElement.style.width = s.getPercentage(period.range.duration/iDuration);
		mPeriodElement.style.left = s.getPercentage((range.start.ago-period.range.start.ago)/iDuration);
		aChildren.push(period);
	}

	return iddqd.factory(period,{
		toString: function(){
			return '[object period, '+info.name+': '+range.start.toString()+' - '+range.end.toString()+']';
		}
		,range: range
		,info: info
		,element: mElement

		,inside: range.inside
		,surrounds: range.surrounds
		,coincides: range.coincides

		,add: addPeriod
		,children: aChildren
	});
});