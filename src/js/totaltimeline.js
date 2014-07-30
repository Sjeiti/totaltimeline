/**
 * @namespace totaltimeline
 * @version 0.1.13
 * @author Ron Valstar (http://www.sjeiti.com/)
 * @copyright Ron Valstar <ron@ronvalstar.nl>
 */
iddqd.ns('totaltimeline',(function(iddqd){
	'use strict';
	iddqd.onDOMReady(function(){
		var ttl = totaltimeline
			,model = ttl.model;
		model();
		ttl.view(model);
		ttl.location(model);
	});
	return {};
})(iddqd));