/**
 * @name event
 * @namespace totaltimeline
 * @param start {moment}
 * @param end {moment}
 * @param info {eventInfo}
 */
iddqd.ns('totaltimeline.time.event',	function(moment,info){
	'use strict';

	return {
		toString: function(){return '[event \''+info.name+'\', '+moment.value+' '+moment.type+']';}
		,moment: moment
		,info: info
	}
});