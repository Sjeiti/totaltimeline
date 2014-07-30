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

//	var iColor = 30 + (Math.random()*0.1*256<<0);
//	mElement.style.backgroundColor = 'rgb('+iColor+','+iColor+','+iColor+')';
//	mElement.style.backgroundColor = 'rgba(0,0,0,'+ (0.05 +0.1*Math.random())+')';
	mElement.style.marginTop = 2*offset+'rem';

//	var mTitle = zen('h3.title{'+info.name + ' ' + range.start.toString() + ' - ' + range.end.toString()+'}').pop();
	var mTitle = zen('h3.title>a[href=/'+info.slug+']{'+info.name + ' ' + range.start.toString() + ' - ' + range.end.toString()+'}').pop();
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

	function coincides(time){
		return range.coincides(time.factory===period?time.range:time);
	}

	return oReturn;
});