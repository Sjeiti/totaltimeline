/**
 * @name totaltimeline
 * @namespace totaltimeline
 * @version 0.0.1
 * @author Ron Valstar (http://www.sjeiti.com/)
 * @copyright Ron Valstar <ron@ronvalstar.nl>
 */
iddqd.ns('totaltimeline',(function(iddqd){
	'use strict';
	iddqd.onDOMReady(function(){
		var ttl = totaltimeline
			,model = ttl.model
			,view = ttl.view
			,location = ttl.location;
		model();
		view.overview(model);
		view.timeline(model);
		location(model);
	});
})(iddqd));