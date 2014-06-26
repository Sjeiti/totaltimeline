/**
 * @name event
 * @namespace totaltimeline.time
 * @param {moment} start
 * @param {moment} end
 * @param {eventInfo} info
 */
iddqd.ns('totaltimeline.time.event', function event(moment,info){
	'use strict';

	var s = totaltimeline.string
		,mWrap = zen('div.event-wrap>(div.line+div.event)').pop()
		,mEvent = mWrap.querySelector('.event')
		,mLine = mWrap.querySelector('.line')
		,fTop = 0.9*iddqd.math.prng.random(Math.abs(moment.value<18000?10000*moment.value:moment.value))
		,sTop = s.getPercentage(fTop)
		,sHeight = s.getPercentage(1-fTop)
	;
	mEvent.setAttribute('title',info.name+' '+moment.toString());
	mEvent.style.top = sTop;
	info.icon!==''&&mEvent.classList.add('icon-'+info.icon);
	mLine.style.height = sHeight;

	return iddqd.factory(event,{
		toString: function(){return '[event \''+info.name+'\', '+moment.value+' '+moment.type+']';}
		,moment: moment
		,info: info
		,element: mWrap
	});
});