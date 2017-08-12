import collection from './'
import event from './event'
import moment from '../time/moment'
import eventInfo from '../time/eventInfo'
import {getData} from '../spreadsheetProxy'

/**
 * Events collection
 * @type collectionInstance
 * @name events
 */
const getPercentage = float=>100*float+'%'
		//
		,events = collection.add(
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
			events.push(event(
				oMoment
				,eventInfo().parse(entry)
			));
		}
	});
	// sort events by ago
	events.sort(function(eventA, eventB){
		return eventA.moment.ago>eventB.moment.ago?-1:1;
	})
	events.dataLoaded.dispatch(events);
}

//todo:document
function populate(fragment,range){
	console.log('events populate',fragment,range); // todo: remove log
	var iRangeStart = range.start.ago
		,iRangeEnd = range.end.ago
		,iDuration = range.duration
	;
	for (var i=0,l=events.length; i<l; i++) {
		var oEvent = events[i]
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

export default events