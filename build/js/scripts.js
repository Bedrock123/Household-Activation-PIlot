/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );

/**
 * pathLoader.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
;( function( window ) {
	
	'use strict';

	function PathLoader( el ) {
		this.el = el;
		// clear stroke
		this.el.style.strokeDasharray = this.el.style.strokeDashoffset = this.el.getTotalLength();
	}

	PathLoader.prototype._draw = function( val ) {
		this.el.style.strokeDashoffset = this.el.getTotalLength() * ( 1 - val );
	}

	PathLoader.prototype.setProgress = function( val, callback ) {
		this._draw(val);
		if( callback && typeof callback === 'function' ) {
			// give it a time (ideally the same like the transition time) so that the last progress increment animation is still visible.
			setTimeout( callback, 200 );
		}
	}

	PathLoader.prototype.setProgressFn = function( fn ) {
		if( typeof fn === 'function' ) { fn( this ); }
	}

	// add to global namespace
	window.PathLoader = PathLoader;

})( window );
/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
(function() {

	var support = { animations : Modernizr.cssanimations },
		container = document.getElementById( 'ip-container' ),
		header = container.querySelector( 'header.ip-header' ),
		loader = new PathLoader( document.getElementById( 'ip-loader-circle' ) ),
		animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];

	function init() {
		var onEndInitialAnimation = function() {
			if( support.animations ) {
				this.removeEventListener( animEndEventName, onEndInitialAnimation );
			}

			startLoading();
		};

		// disable scrolling
		window.addEventListener( 'scroll', noscroll );

		// initial animation
		classie.add( container, 'loading' );

		if( support.animations ) {
			container.addEventListener( animEndEventName, onEndInitialAnimation );
		}
		else {
			onEndInitialAnimation();
		}
	}

	function startLoading() {
		// simulate loading something..
		var simulationFn = function(instance) {
			var progress = 0,
				interval = setInterval( function() {
					progress = Math.min( progress + Math.random() * 0.1, 1 );

					instance.setProgress( progress );

					// reached the end
					if( progress === 1 ) {
						classie.remove( container, 'loading' );
						classie.add( container, 'loaded' );
						clearInterval( interval );

						var onEndHeaderAnimation = function(ev) {
							if( support.animations ) {
								if( ev.target !== header ) return;
								this.removeEventListener( animEndEventName, onEndHeaderAnimation );
							}

							classie.add( document.body, 'layout-switch' );
							window.removeEventListener( 'scroll', noscroll );
						};

						if( support.animations ) {
							header.addEventListener( animEndEventName, onEndHeaderAnimation );
						}
						else {
							onEndHeaderAnimation();
						}
					}
				}, 80 );
		};

		loader.setProgressFn( simulationFn );
	}
	
	function noscroll() {
		window.scrollTo( 0, 0 );
	}

	init();

})();
(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.scrollProgress = factory(root);
    }
})(this, function() {
    'use strict';

    var body = document.body,
        progress = 0,
        isSet = false,
        progressWrapper,
        progressElement,
        endPoint,
        // default configuration object
        config = {
            bottom: true,
            color: '#000000',
            height: '5px',
            styles: true,
            prefix: 'progress',
            events: true
        };

    /*
     * Create DOM elements which graphically represent the progress
     * @method _createElements
     */
    var _createElements = function() {
        progressWrapper = document.createElement('div');
        progressElement = document.createElement('div');

        progressWrapper.id = config.prefix + '-wrapper';
        progressElement.id = config.prefix + '-element';

        progressWrapper.appendChild(progressElement);
        body.appendChild(progressWrapper);
    };

    /*
     * Replaces configuration values with custom ones
     * @method _setConfigObject
     * @param {object} obj - object containing custom options
     */
    var _setConfigObject = function(obj) {
        // override with custom attributes
        if (typeof obj === 'object') {
            for (var key in config) {
                if (typeof obj[key] !== 'undefined') {
                    config[key] = obj[key];
                }
            }
        }
    };

    /*
     * Set styles on DOM elements
     * @method _setElementsStyles
     */
    var _setElementsStyles = function() {
        // setting progress to zero and wrapper to full width
        progressElement.style.width = '0';
        progressWrapper.style.width = '100%';

        // set styles only if
        // settings is true
        if (config.styles) {
            // progress element
            progressElement.style.backgroundColor = config.color;
            progressElement.style.height = config.height;

            // progress wrapper
            progressWrapper.style.position = 'fixed';
            progressWrapper.style.left = '0';

            // sets position
            if (config.bottom) {
                progressWrapper.style.bottom = '0';
            } else {
                progressWrapper.style.top = '0';
            }
        }
    };

    /*
     * Main function which sets all variables and bind events if needed
     * @method _set
     * @param {object} custom - object containing custom options
     */
    var _set = function(custom) {
        // set only once
        if (!isSet) {
            if (custom) {
                _setConfigObject(custom);
            }
            _createElements();
            _setElementsStyles();

            // set initial metrics
            _setMetrics();

            // bind events only if
            // settings is true
            if (config.events) {
                window.onscroll = _setProgress;
                window.onresize = _setMetrics;
            }

            isSet = true;
        } else {
            throw new Error('scrollProgress has already been set!');
        }
    };

    /*
     * Calculates how much user has scrolled
     * @method _setProgress
     */
    var _setProgress = function() {
        try {
            var y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            progress = y / endPoint * 100;
            progressElement.style.width = progress + '%';
        } catch (e) {
            console.error(e);
        }
    };

    /*
     * Updates the document's height and adjusts the progress bar
     * @method _setMetrics
     */
    var _setMetrics = function() {
        endPoint = _getEndPoint();
        _setProgress();
    };

    /*
     * Returns how much the user can scroll in the document
     * @method _getEndPoint
     */
    var _getEndPoint = function() {
        return body.scrollHeight - (window.innerHeight || document.documentElement.clientHeight);
    };

    return {
        set: _set,
        trigger: _setProgress,
        update: _setMetrics
    };
});
var COLORS, Confetti, NUM_CONFETTI, PI_2, canvas, confetti, context, drawCircle, i, range, resizeWindow, xpos;

NUM_CONFETTI = 350;

COLORS = [[245, 169, 32], [255, 59, 48], [185, 22, 151], [189, 208, 1], [1, 165, 57]];

PI_2 = 2 * Math.PI;

canvas = document.getElementById("world");

context = canvas.getContext("2d");

window.w = 0;

window.h = 0;

resizeWindow = function() {
  window.w = canvas.width = window.innerWidth;
  return window.h = canvas.height = window.innerHeight;
};

window.addEventListener('resize', resizeWindow, false);

window.onload = function() {
  return setTimeout(resizeWindow, 0);
};

range = function(a, b) {
  return (b - a) * Math.random() + a;
};

drawCircle = function(x, y, r, style) {
  context.beginPath();
  context.arc(x, y, r, 0, PI_2, false);
  context.fillStyle = style;
  return context.fill();
};

xpos = 0.5;

document.onmousemove = function(e) {
  return xpos = e.pageX / w;
};

window.requestAnimationFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };
})();

Confetti = (function() {
  function Confetti() {
    this.style = COLORS[~~range(0, 5)];
    this.rgb = "rgba(" + this.style[0] + "," + this.style[1] + "," + this.style[2];
    this.r = ~~range(2, 6);
    this.r2 = 2 * this.r;
    this.replace();
  }

  Confetti.prototype.replace = function() {
    this.opacity = 0;
    this.dop = 0.03 * range(1, 4);
    this.x = range(-this.r2, w - this.r2);
    this.y = range(-20, h - this.r2);
    this.xmax = w - this.r;
    this.ymax = h - this.r;
    this.vx = range(0, 2) + 8 * xpos - 5;
    return this.vy = 0.7 * this.r + range(-1, 1);
  };

  Confetti.prototype.draw = function() {
    var ref;
    this.x += this.vx;
    this.y += this.vy;
    this.opacity += this.dop;
    if (this.opacity > 1) {
      this.opacity = 1;
      this.dop *= -1;
    }
    if (this.opacity < 0 || this.y > this.ymax) {
      this.replace();
    }
    if (!((0 < (ref = this.x) && ref < this.xmax))) {
      this.x = (this.x + this.xmax) % this.xmax;
    }
    return drawCircle(~~this.x, ~~this.y, this.r, this.rgb + "," + this.opacity + ")");
  };

  return Confetti;

})();

confetti = (function() {
  var j, ref, results;
  results = [];
  for (i = j = 1, ref = NUM_CONFETTI; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
    results.push(new Confetti);
  }
  return results;
})();

window.step = function() {
  var c, j, len, results;
  requestAnimationFrame(step);
  context.clearRect(0, 0, w, h);
  results = [];
  for (j = 0, len = confetti.length; j < len; j++) {
    c = confetti[j];
    results.push(c.draw());
  }
  return results;
};

step();

// ---
// generated by coffee-script 1.9.2
!function(a,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t(require,exports,module):a.CountUp=t()}(this,function(a,t,n){var e=function(a,t,n,e,i,r){for(var o=0,s=["webkit","moz","ms","o"],m=0;m<s.length&&!window.requestAnimationFrame;++m)window.requestAnimationFrame=window[s[m]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[s[m]+"CancelAnimationFrame"]||window[s[m]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(a,t){var n=(new Date).getTime(),e=Math.max(0,16-(n-o)),i=window.setTimeout(function(){a(n+e)},e);return o=n+e,i}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)});var u=this;u.options={useEasing:!0,useGrouping:!0,separator:",",decimal:".",easingFn:null,formattingFn:null};for(var l in r)r.hasOwnProperty(l)&&(u.options[l]=r[l]);""===u.options.separator&&(u.options.useGrouping=!1),u.options.prefix||(u.options.prefix=""),u.options.suffix||(u.options.suffix=""),u.d="string"==typeof a?document.getElementById(a):a,u.startVal=Number(t),u.endVal=Number(n),u.countDown=u.startVal>u.endVal,u.frameVal=u.startVal,u.decimals=Math.max(0,e||0),u.dec=Math.pow(10,u.decimals),u.duration=1e3*Number(i)||2e3,u.formatNumber=function(a){a=a.toFixed(u.decimals),a+="";var t,n,e,i;if(t=a.split("."),n=t[0],e=t.length>1?u.options.decimal+t[1]:"",i=/(\d+)(\d{3})/,u.options.useGrouping)for(;i.test(n);)n=n.replace(i,"$1"+u.options.separator+"$2");return u.options.prefix+n+e+u.options.suffix},u.easeOutExpo=function(a,t,n,e){return n*(-Math.pow(2,-10*a/e)+1)*1024/1023+t},u.easingFn=u.options.easingFn?u.options.easingFn:u.easeOutExpo,u.formattingFn=u.options.formattingFn?u.options.formattingFn:u.formatNumber,u.version=function(){return"1.7.1"},u.printValue=function(a){var t=u.formattingFn(a);"INPUT"===u.d.tagName?this.d.value=t:"text"===u.d.tagName||"tspan"===u.d.tagName?this.d.textContent=t:this.d.innerHTML=t},u.count=function(a){u.startTime||(u.startTime=a),u.timestamp=a;var t=a-u.startTime;u.remaining=u.duration-t,u.options.useEasing?u.countDown?u.frameVal=u.startVal-u.easingFn(t,0,u.startVal-u.endVal,u.duration):u.frameVal=u.easingFn(t,u.startVal,u.endVal-u.startVal,u.duration):u.countDown?u.frameVal=u.startVal-(u.startVal-u.endVal)*(t/u.duration):u.frameVal=u.startVal+(u.endVal-u.startVal)*(t/u.duration),u.countDown?u.frameVal=u.frameVal<u.endVal?u.endVal:u.frameVal:u.frameVal=u.frameVal>u.endVal?u.endVal:u.frameVal,u.frameVal=Math.round(u.frameVal*u.dec)/u.dec,u.printValue(u.frameVal),t<u.duration?u.rAF=requestAnimationFrame(u.count):u.callback&&u.callback()},u.start=function(a){return u.callback=a,u.rAF=requestAnimationFrame(u.count),!1},u.pauseResume=function(){u.paused?(u.paused=!1,delete u.startTime,u.duration=u.remaining,u.startVal=u.frameVal,requestAnimationFrame(u.count)):(u.paused=!0,cancelAnimationFrame(u.rAF))},u.reset=function(){u.paused=!1,delete u.startTime,u.startVal=t,cancelAnimationFrame(u.rAF),u.printValue(u.startVal)},u.update=function(a){cancelAnimationFrame(u.rAF),u.paused=!1,delete u.startTime,u.startVal=u.frameVal,u.endVal=Number(a),u.countDown=u.startVal>u.endVal,u.rAF=requestAnimationFrame(u.count)},u.printValue(u.startVal)};return e});