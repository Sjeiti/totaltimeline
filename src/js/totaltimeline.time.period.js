/**
 * @name period
 * @namespace totaltimeline.time
 * @param range {range}
 * @param info {eventInfo}
 */
iddqd.ns('totaltimeline.time.period',function period(range,info,children){
	'use strict';

	return iddqd.factory(period,{
		range: range
		,info: info
		,inside: range.inside
		,surrounds: range.surrounds
		,children: children||[]
	});
});