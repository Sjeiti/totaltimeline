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

	var iColor = 220 - (Math.random()*0.1*256<<0);
	mElement.style.backgroundColor = 'rgb('+iColor+','+iColor+','+iColor+')';
	mElement.style.marginTop = 2*offset+'rem';

	var mTitle = zen('h3.title{'+info.name + ' ' + range.start.toString() + ' - ' + range.end.toString()+'}').pop();
	mTitle.model = oReturn;
	mElement.appendChild(mTitle);
	model.infoShown.add(handleInfoShown);

	function handleInfoShown(shownInfo){
		mElement.classList.toggle(s.selected,shownInfo===info);
	}

	function coincides(time){
		return range.coincides(time.factory===period?time.range:time);
	}

	return oReturn;
});