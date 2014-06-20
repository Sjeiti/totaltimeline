/**
 * @name event
 * @namespace totaltimeline.time
 * @param {moment} start
 * @param {moment} end
 * @param {eventInfo} info
 */
iddqd.ns('totaltimeline.time.event', function(moment,info){
	'use strict';

	var s = totaltimeline.string
		,mElement = document.createElement('div');
	mElement.classList.add('event');
	mElement.setAttribute('title',info.name);
	mElement.style.top = s.getPercentage(iddqd.math.prng.random(Math.abs(1234+moment.value)));
	if (info.icon!=='') {
		// todo: put icons in stylesheet
		//mElement.style.backgroundImage = 'url(\'data:image/svg+xml;utf8,'+info.icon+'\')';
		mElement.classList.add('icon-'+info.icon);
	}

	return {
		toString: function(){return '[event \''+info.name+'\', '+moment.value+' '+moment.type+']';}
		,moment: moment
		,info: info
		,element: mElement
	};
});