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
		,mWrap = zen('div.event-wrap>(time+(div.event+a[href=/'+info.slug+']>h3{'+info.name+'}))').pop()
		,mEvent = mWrap.querySelector('.event')
		,mTitle = mWrap.querySelector('h3')
		,mTime = mWrap.querySelector('time')
//		,fTop = 0.9*iddqd.math.prng.random(Math.abs(moment.value<18000?10000*moment.value:moment.value))
		,fTop = 0.5 + 0.6*(iddqd.math.prng.random(123E4+Math.abs(moment.value<18000?10000*moment.value:moment.value))-0.5)
//		,fTop = Math.random()<0.5?0.1:0.9
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
	mEvent.style.top = sTop;
	info.icon!==''&&mEvent.classList.add('icon-'+info.icon);

	mTitle.style.top = sTop;

	mTime.style.height = sHeight; // todo: less vars @eventIconSize
	mTime.setAttribute('data-after',moment.toString()); // todo: better as textContent

	model.entryShown.add(handleEntryShown);

	/*mWrap.addEventListener(s.click,function (e){
		console.log('clickEvent',e); // log
	});*/


	/**
	 * Handles entryShown signal
	 * @param {period|event} entry
	 */
	function handleEntryShown(entry){
		// toggle won't work in Safari
		if (entry&&entry.info===info) {
			mWrap.classList.add(s.selected);
		} else {
			mWrap.classList.remove(s.selected);
		}
	}

	// todo: document
	function inside(is){
		//console.log('event.inside',is,mWrap.classList.contains(s.selected)); // log
		if (!is&&mWrap.classList.contains(s.selected)) {
			model.entryShown.dispatch();
		}
	}

	return oReturn;
});