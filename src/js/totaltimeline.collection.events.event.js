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
		,mWrap = zen('div.event-wrap>(time+(div.event>a[href=/'+info.slug+']>h3{'+info.name+'}))').pop()
		,mEvent = mWrap.querySelector('.event')
		,mTime = mWrap.querySelector('time')
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
//	mEvent.setAttribute('title',sTitle);
	mEvent.style.top = sTop;
	info.icon!==''&&mEvent.classList.add('icon-'+info.icon);

//	console.log('mEvent.querySelector',mEvent.offsetHeight); // log .querySelector('h3')

	if (info.slug==='light') {
		console.log('light',oReturn); // log
	}

	mTime.style.height = sHeight; // todo: less vars @eventIconSize
//	mTime.setAttribute('data-before',info.name);
	mTime.setAttribute('data-after',moment.toString());

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
		//console.log('event.inside',is,mEvent.classList.contains(s.selected)); // log
		if (!is&&mEvent.classList.contains(s.selected)) {
			model.entryShown.dispatch();
		}
	}

	return oReturn;
});