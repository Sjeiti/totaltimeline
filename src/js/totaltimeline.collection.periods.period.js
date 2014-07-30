/**
 * @namespace totaltimeline.collection.periods.period
 * @param range {range}
 * @param info {eventInfo}
 */
iddqd.ns('totaltimeline.collection.periods.period',function period(range,info,offset){
	'use strict';

	var s = totaltimeline.string
		,model = totaltimeline.model
		,mElement = document.createElement('div')
		,oReturn = iddqd.factory(period,{
			toString: function(){
				return '[object period, '+info.name+': '+range.start.toString()+' - '+range.end.toString()+']';
			}
			,range: range
			,info: info
			,element: mElement
			,coincides: coincides
		})
	;

	mElement.classList.add('period');
	mElement.style.marginTop = 1.5*offset+'rem'; // todo: replace 1.5 by value from less

	var mTitle = zen('h3>a[href=/'+info.slug+']{'+info.name + ' ' + range.start.toString() + ' - ' + range.end.toString()+'}').pop();
	mTitle.model = oReturn;

	mElement.appendChild(mTitle);
	model.entryShown.add(handleEntryShown); // todo: not very efficient

	/**
	 * Handles entryShown signal
	 * @param {period|event} entry
	 */
	function handleEntryShown(entry){
		var bIs = entry&&entry.info===info;
		mElement.classList.toggle(s.selected,bIs);
		bIs&&model.range.animate(range.start.ago,range.end.ago);
	}

	// todo:document
	function coincides(time){
		return range.coincides(time.factory===period?time.range:time);
	}

	return oReturn;
});