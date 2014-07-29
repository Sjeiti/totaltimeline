/**
 * @namespace totaltimeline.collection.events.event
 * @param {moment} start
 * @param {moment} end
 * @param {eventInfo} info
 */
iddqd.ns('totaltimeline.collection.events.event', function event(moment,info){
	'use strict';

	var s = totaltimeline.string
		,model = totaltimeline.model
		,sTitle = info.name+' '+moment.toString()
		,mWrap = zen('div.event-wrap>(div.line+(div.event>a[href=/'+info.slug+']{'+sTitle+'}))').pop()
		,mEvent = mWrap.querySelector('.event')
		,mLine = mWrap.querySelector('.line')
		,fTop = 0.9*iddqd.math.prng.random(Math.abs(moment.value<18000?10000*moment.value:moment.value))
		,sTop = s.getPercentage(fTop)
		,sHeight = s.getPercentage(1-fTop)
		,oReturn = iddqd.factory(event,{
			toString: function(){return '[event \''+info.name+'\', '+moment.value+' '+moment.type+']';}
			,moment: moment
			,info: info
			,element: mWrap
			,inside: inside
		})
	;
	mEvent.model = oReturn;
	mEvent.setAttribute('title',sTitle);
	mEvent.style.top = sTop;
	info.icon!==''&&mEvent.classList.add('icon-'+info.icon);
	mLine.style.height = sHeight;
	model.entryShown.add(handleEntryShown);

	mWrap.addEventListener(s.click,function (e){
		console.log('clickEvent',e); // log
	});


	/**
	 * Handles entryShown signal
	 * @param {period|event} entry
	 */
	function handleEntryShown(entry){
		mWrap.classList.toggle(s.selected,entry&&entry.info===info);
	}

	// todo: document
	function inside(is){
		//console.log('event.inside',is,mEvent.classList.contains(s.selected)); // log
		if (!is&&mEvent.classList.contains(s.selected)) {
			model.entryShown.dispatch();
		}
	}

	return oReturn;
});