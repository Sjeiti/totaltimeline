/**
 * Events collection
 * @name events
 * @namespace totaltimeline.collection
 */
iddqd.ns('totaltimeline.collection.events',(function(){
	'use strict';

	var s = totaltimeline.string
		,collection = totaltimeline.collection
		,getProp = collection.getProp
		,time = totaltimeline.time
		,moment = time.moment
		,event = time.event
		,eventInfo = time.eventInfo
		//
		,aCollection = collection.add(
			'events'
			,'https://spreadsheets.google.com/feeds/list/key/od6/public/values?alt=json-in-script'
			,handleGetData
			,populate
		)
	;

	/**
	 * Turns the spreadsheet json data into an event list.
	 * @param {object} sheet
	 */
	function handleGetData(sheet){
		//ago, since, year, name, example, exclude, importance, explanation, link, accuracy, remark
		sheet.feed.entry.forEach(function(entry){
			var  iAgo =		getProp(entry,'ago',true)
				,iSince =	getProp(entry,'since',true)
				,iYear =	getProp(entry,'year',true)
				,oMoment = iAgo?moment(iAgo):(iSince?moment(iSince,moment.SINCE):iYear&&moment(iYear,moment.YEAR))
				,bExclude = getProp(entry,'exclude')==='1'
			;
			if (oMoment&&!bExclude) {
				aCollection.push(event(
					oMoment
					,eventInfo(
						 getProp(entry,'name')
						,getProp(entry,'explanation')
						,getProp(entry,'importance')
						,getProp(entry,'example')
						,getProp(entry,'link')
						,getProp(entry,'remark')
						,getProp(entry,'accuracy')
						,getProp(entry,'icon')
					)
				));
			}
		});
		// sort events by ago
		aCollection.sort(function(eventA,eventB){
			return eventA.moment.ago>eventB.moment.ago?-1:1;
		});
		aCollection.dataLoaded.dispatch(aCollection);
	}

	function populate(fragment,range){
		var started = 0
			,iRangeStart = range.start.ago
			,iRangeEnd = range.end.ago
			,iDuration = range.duration
		;
		for (var i=0,l=aCollection.length;i<l;i++) {
			var oEvent = aCollection[i]
				,iAgo = oEvent.moment.ago;
			if (started===0&&iAgo<=iRangeStart) {
				started++;
			}
			if (started===1) {
				if (iAgo<iRangeEnd) {
					break;
				} else {
					var mEvent = oEvent.element
						,fRel = 1-((iAgo-iRangeEnd)/iDuration)
					;
					mEvent.style.left = s.getPercentage(fRel);
					fragment.appendChild(mEvent);
				}
			}
		}
	}

	return aCollection;
})());