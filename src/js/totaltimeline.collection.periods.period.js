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

	var iColor = 30 + (Math.random()*0.1*256<<0);
	mElement.style.backgroundColor = 'rgb('+iColor+','+iColor+','+iColor+')';
	mElement.style.marginTop = 2*offset+'rem';

	var mTitle = zen('h3.title{'+info.name + ' ' + range.start.toString() + ' - ' + range.end.toString()+'}').pop();
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
		if (bIs) {
			// todo: put animation somewhere central?
			var iStartFrom = model.range.start.ago
				,iStartDelta = range.start.ago - iStartFrom
				,iEndFrom = model.range.end.ago
				,iEndDelta = range.end.ago - iEndFrom;
			iddqd.animate(1000,function(f){
				var fInOut = TWEEN.Easing.Quadratic.InOut(f);
				model.range.set(iStartFrom+fInOut*iStartDelta,iEndFrom+fInOut*iEndDelta);
			});
		}
		//bIs&&model.range.set(range);
	}

	function coincides(time){
		return range.coincides(time.factory===period?time.range:time);
	}

	return oReturn;
});