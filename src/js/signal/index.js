import Signal from 'signals'
/*
 * Signal implementation for various generic events.<br/>
 * Implements {@link http://millermedeiros.github.com/js-signals js-signals} by Miller Demeiros.<br/>
 * Signals can be created at their proper namespace or module by calling {@link iddqd.signal.create} (for instance see {@link iddqd.animate.js}).
 * @summary Signal implementation for various generic events.
 * @namespace iddqd.signals
 * @requires signals.js http://millermedeiros.github.com/js-signals/
 */
/**
 * Signal implementations<br/>
 * The namespace itself is also {@link iddqd.signal.signal a method} that can be used to generate new signal implementations.
 * @namespace iddqd.signal
 * @summary Signal implementations
 */
/**
 * Creates a signal.<br/>
 * The signals is dead (no events attached) until the first signal.add or signal.addOnce is called.<br/>
 * This method is really {@link iddqd.signal} and not {@link iddqd.signal.signal} (documentation prevents namespaces to be functions).
 * @name signal
 * @method
 * @memberOf iddqd.signal
 * @param {Function} init The initialisation method, called after the first signal.add or signal.addOnce.
 * @returns {Signal} The signal
 * @todo implement requirements
 * @todo what if the signal already exists
 * @todo add window.addEventListener('popstate',handleCloseOverlay);
 */
export default function createSignal(init,createNow){
	const oSignal = new Signal()
		,fnTmpAdd = oSignal.add
		,fnTmpAddOnce = oSignal.addOnce
		,fnInited = function(){
			oSignal.add = fnTmpAdd;
			oSignal.addOnce = fnTmpAddOnce;
			init(oSignal);
		}
	;
	if (createNow) {
		fnInited();
	} else {
		oSignal.add = function(){
			fnInited();
			return oSignal.add.apply(this,arguments);
		};
		oSignal.addOnce = function(){
			fnInited();
			return oSignal.addOnce.apply(this,arguments);
		};
	}
	return oSignal;
}