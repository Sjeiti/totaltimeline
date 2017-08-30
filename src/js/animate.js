/**
 * Animates something
 * @name animate
 * @method
 * @param {Number} duration Length of animation in milliseconds.
 * @param {Function} step Function called each step with a progress parameter (a 0-1 float).
 * @param {Function} complete Callback function when animation finishes.
 * @returns {Object} An animation object with a cancel function.
 */
function animate(duration,step,complete){
  let t = Date.now()
    ,bRunning = true
    ,fnRun = ()=>{
      if (bRunning) {
        let iTCurrent = Date.now()-t
        if (iTCurrent<duration) {
          step(iTCurrent/duration)
          requestAnimationFrame(fnRun)
        } else {
          step(1)
          complete&&complete()
        }
      }
    }
  fnRun()
  return {
    cancel(){
      bRunning = false
    }
  }
}
export default Object.assign(animate,{
	linear: {
		none: k=>k
	}

	,quadratic: {
		in: k=>k*k
		,out: k=>k*(2 - k)
		,inOut: k=>{
			if ((k *= 2)<1) return 0.5*k*k
			return - 0.5*(--k*(k - 2) - 1)
		}
	}

	,cubic: {
		in: k=>k*k*k
		,out: k=>--k*k*k + 1
		,inOut: k=>{
			if ((k *= 2) < 1) return 0.5*k*k*k
			return 0.5 * ((k -= 2)*k*k + 2)
		}
	}

	,quartic: {
		in: k=>k*k*k*k
		,put: k=> 1 - (--k*k*k*k)
		,inOut: k=>{
			if ((k *= 2) < 1) return 0.5*k*k*k*k
			return - 0.5 * ((k -= 2)*k*k*k - 2)
		}
	}

	,quintic: {
		in: k=>k*k*k*k*k
		,out: k=>--k*k*k*k*k + 1
		,inOut: k=>{
			if ((k *= 2) < 1) return 0.5*k*k*k*k*k
			return 0.5 * ((k -= 2)*k*k*k*k + 2)
		}
	}

	,sinusoidal: {

		in: k=>1 - Math.cos(k * Math.PI / 2)
		,out: k=>Math.sin(k * Math.PI / 2)
		,inOut: k=>0.5 * (1 - Math.cos(Math.PI * k))
	}

	,exponential: {
		in: k=>k===0?0:Math.pow(1024, k - 1)
		,out: k=>k===1?1: 1 - Math.pow(2, - 10 * k)
    ,inOut: k=>{
			if (k===0) return 0
			if (k===1) return 1
			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1)
			}
			return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2)
		}
	}

	,circular: {
		in: k=>1 - Math.sqrt(1 - k*k)
		,out: k=>Math.sqrt(1 - (--k*k))
		,inOut: function (k) {
			if ((k *= 2) < 1) return - 0.5 * (Math.sqrt(1 - k * k) - 1)
			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1)
		}
	}

	,elastic: {
    in: k=>{
			if (k===0) return 0
			if (k===1) return 1
			return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI)
		},

		Out: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			k *= 2;

			if (k < 1) {
				return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
			}

			return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

		}

	},

	Back: {

		In: function (k) {

			var s = 1.70158;

			return k * k * ((s + 1) * k - s);

		},

		Out: function (k) {

			var s = 1.70158;

			return --k * k * ((s + 1) * k + s) + 1;

		},

		InOut: function (k) {

			var s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

		}

	},

	Bounce: {

		In: function (k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);

		},

		Out: function (k) {

			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}

		},

		InOut: function (k) {

			if (k < 0.5) {
				return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

		}

	}

})
