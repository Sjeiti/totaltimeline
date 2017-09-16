import collection from './'
import event from './event'
import time from '../time'
import moment from '../time/moment'
import eventInfo from '../time/eventInfo'
import range from '../time/range'
import {getData} from '../spreadsheetProxy'
/**
 * Events collection
 * @type collectionInstance
 * @name totaltimeline.collection.events
 */
// iddqd.ns('totaltimeline.collection.events',(function(){
// 	'use strict';
//
// 	var collection = totaltimeline.collection
// 		,time = totaltimeline.time
// 		,moment = time.moment
// 		,eventInfo = time.eventInfo
const getPercentage = float=>100*float+'%'
		//
		,aInstance = collection.add(
			'events'
			,1
			,handleGetData
			,populate
		)
	;

const key = '1wn2bs7T2ZzajyhaQYmJvth3u2ikZv10ZUEpvIB9iXhM'
  ,worksheet = 1//'events'
getData(key,worksheet,handleGetData)


	/**
	 * Turns the spreadsheet json data into an event list.
	 * @param {object} data
	 */
	function handleGetData(data){
		//ago, since, year, name, example, exclude, importance, explanation, link, accuracy, remark
		data.forEach(function(entry){
			//console.log('event',getProp(entry,'name'),getProp(entry,'ago'),getProp(entry,'ago',true)); // log
			var  iAgo =		parseInt(entry.ago,10)
				,iSince =	parseInt(entry.since,10)
				,iYear =	parseInt(entry.year,10)
				,oMoment = iAgo?moment(iAgo):(iSince?moment(iSince,moment.SINCE):iYear&&moment(iYear,moment.YEAR))
				,bExclude = entry.exclude==='1'
			;
			if (oMoment&&!bExclude) {
				aInstance.push(event(
					oMoment
					,eventInfo().parse(entry)
				));
			}
		});
		// sort events by ago
		aInstance.sort(function(eventA,eventB){
			return eventA.moment.ago>eventB.moment.ago?-1:1;
		});
		aInstance.dataLoaded.dispatch(aInstance);
	}

	//todo:document
	function populate(fragment,range){
		var iRangeStart = range.start.ago
			,iRangeEnd = range.end.ago
			,iDuration = range.duration
		;
		for (var i=0,l=aInstance.length;i<l;i++) {
			var oEvent = aInstance[i]
				,iAgo = oEvent.moment.ago
				,bInside = iAgo<=iRangeStart&&iAgo>=iRangeEnd
			;
			if (bInside) {
				var mEvent = oEvent.element
					,fRel = 1-((iAgo-iRangeEnd)/iDuration)
				;
				mEvent.style.left = getPercentage(fRel);
				fragment.appendChild(mEvent);
			}
			oEvent.inside(bInside);
		}
	}

	export default aInstance
	// return aInstance;
// })());
