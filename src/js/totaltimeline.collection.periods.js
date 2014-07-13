/**
 * Periods collection
 * @type collectionInstance
 * @namespace totaltimeline.collection.periods
 */
iddqd.ns('totaltimeline.collection.periods',(function(){
	'use strict';

	var s = totaltimeline.string
		,collection = totaltimeline.collection
		,getProp = collection.getProp
		,time = totaltimeline.time
		,moment = time.moment
		,range = time.range
		,eventInfo = time.eventInfo
		//
		,aCollection = collection.add(
			'periods'
			,'https://spreadsheets.google.com/feeds/list/key/od7/public/values?alt=json-in-script'
			,handleGetData
			,populate
		)
	;

	function handleGetData(sheet){
		var aTimes = 'supereon,eon,era,period,epoch,age'.split(',')
			,iTimes = aTimes.length;
		sheet.feed.entry.forEach(function(entry){
			var iFrom = getProp(entry,'from',true)
				,iTo = getProp(entry,'to',true)
				,sName = getProp(entry,'name')
			;
			if (iFrom!==undefined&&iTo!==undefined&&sName!==undefined) {
				var iOffset = 0;
				for (var i=0;i<iTimes;i++) {
					var sTimeName = aTimes[i]
						,sTimeValue = getProp(entry,sTimeName)
					;
					if (sTimeValue!=='') {
						iOffset = i;
						break;
					}
				}
				var oPeriod = aCollection.period(
					range(moment(iFrom),moment(iTo))
					,eventInfo(
						sName
					)
					,iOffset
				);
				aCollection.push(oPeriod);
			}
		});
		aCollection.dataLoaded.dispatch(aCollection);
	}

	function populate(fragment,range){
		var iRangeEnd = range.end.ago
			,iDuration = range.duration
		;
		aCollection.forEach(function(period){
			if (period.coincides(range)) {
				var mPeriod = period.element
					,iAgo = period.range.start.ago
					,fRelLeft = 1-((iAgo-iRangeEnd)/iDuration)
					,fRelWidth = period.range.duration/iDuration
				;
				if (fRelLeft<0) {
					fRelWidth += fRelLeft;
					fRelLeft = 0;
				}
				if ((fRelLeft+fRelWidth)>1) {
					fRelWidth = 1 - fRelLeft;
				}
				mPeriod.style.left = s.getPercentage(fRelLeft);
				mPeriod.style.width = s.getPercentage(fRelWidth);
				fragment.appendChild(mPeriod);
			}
		});
	}

	return aCollection;
})());