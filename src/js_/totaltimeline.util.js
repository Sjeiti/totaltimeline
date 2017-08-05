/**
 * todo: document
 * @namespace totaltimeline.util
 */
iddqd.ns('totaltimeline.util',(function(){
	'use strict';

	/**
	 * Turns a floating point into a percentage.
	 * @name totaltimeline.string.getPercentage
	 * @method
	 * @param float
	 * @returns {string}
	 */
	function getPercentage(float){
		return 100*float+'%';
	}

	//todo:doc/rename
	function slug(s) {
		return s.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
	}

	// todo:document
	function getCssValuePrefix() {
		var aPrefixes = ['', '-o-', '-ms-', '-moz-', '-webkit-']
			,mTmp = document.createElement('div')
			,sValue = 'linear-gradient(left, #fff, #fff)';
		for (var i = 0; i < aPrefixes.length; i++) {
			mTmp.style.backgroundImage = aPrefixes[i] + sValue;
			if (mTmp.style.backgroundImage) {
				return aPrefixes[i];
			}
			mTmp.style.backgroundImage = '';
		}
	}

	/**
	 * Removes all children from an HTMLElement.
	 * @param {HTMLElement} element
	 */
	function emptyElement(element){ // todo: move to utils
		while (element.childNodes.length) {
			element.removeChild(element.firstChild);
		}
	}

	function canWebGL(){
		var bCanWebGL = false;
		if (window.WebGLRenderingContext) {
			try {
				var canvas = document.createElement('canvas');
				var context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
				if(!context) {
					// browser supports WebGL but initialization failed
//					console.log("webgl is supported but here is another problem, visit http://get.webgl.org/troubleshooting");
				} else {
					bCanWebGL = true;
				}
			} catch(err) {
//				console.log("webgl is supported but here is another problem, visit http://get.webgl.org/troubleshooting");
			}
		}
		return bCanWebGL;
	}

	return {
		getPercentage: getPercentage
		,slug: slug
		,getCssValuePrefix: getCssValuePrefix
		,emptyElement: emptyElement
		,canWebGL: canWebGL
	};
})());