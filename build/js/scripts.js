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
var retina = window.devicePixelRatio,

        // Math shorthands
        PI = Math.PI,
        sqrt = Math.sqrt,
        round = Math.round,
        random = Math.random,
        cos = Math.cos,
        sin = Math.sin,

        // Local WindowAnimationTiming interface
        rAF = window.requestAnimationFrame,
        cAF = window.cancelAnimationFrame || window.cancelRequestAnimationFrame;

      // Local WindowAnimationTiming interface polyfill
      (function (w) {
        /**
        * Fallback implementation.
        */
        var prev = new Date().getTime();
        function fallback(fn) {
          var curr = _now();
          var ms = Math.max(0, 16 - (curr - prev));
          var req = setTimeout(fn, ms);
          prev = curr;
          return req;
        }

        /**
        * Cancel.
        */
        var cancel = w.cancelAnimationFrame
          || w.webkitCancelAnimationFrame
          || w.clearTimeout;

        rAF = w.requestAnimationFrame
          || w.webkitRequestAnimationFrame
          || fallback;

        cAF = function(id){
          cancel.call(w, id);
        };
      }(window));

      document.addEventListener("DOMContentLoaded", function() {
        var speed = 50,
          duration = (1.0 / speed),
          confettiRibbonCount = 11,
          ribbonPaperCount = 30,
          ribbonPaperDist = 8.0,
          ribbonPaperThick = 8.0,
          confettiPaperCount = 95,
          DEG_TO_RAD = PI / 180,
          RAD_TO_DEG = 180 / PI,
          colors = [
            ["#df0049", "#660671"],
            ["#00e857", "#005291"],
            ["#2bebbc", "#05798a"],
            ["#ffd200", "#b06c00"]
          ];

        function Vector2(_x, _y) {
          this.x = _x, this.y = _y;
          this.Length = function() {
            return sqrt(this.SqrLength());
          }
          this.SqrLength = function() {
            return this.x * this.x + this.y * this.y;
          }
          this.Add = function(_vec) {
            this.x += _vec.x;
            this.y += _vec.y;
          }
          this.Sub = function(_vec) {
            this.x -= _vec.x;
            this.y -= _vec.y;
          }
          this.Div = function(_f) {
            this.x /= _f;
            this.y /= _f;
          }
          this.Mul = function(_f) {
            this.x *= _f;
            this.y *= _f;
          }
          this.Normalize = function() {
            var sqrLen = this.SqrLength();
            if (sqrLen != 0) {
              var factor = 1.0 / sqrt(sqrLen);
              this.x *= factor;
              this.y *= factor;
            }
          }
          this.Normalized = function() {
            var sqrLen = this.SqrLength();
            if (sqrLen != 0) {
              var factor = 1.0 / sqrt(sqrLen);
              return new Vector2(this.x * factor, this.y * factor);
            }
            return new Vector2(0, 0);
          }
        }
        Vector2.Lerp = function(_vec0, _vec1, _t) {
          return new Vector2((_vec1.x - _vec0.x) * _t + _vec0.x, (_vec1.y - _vec0.y) * _t + _vec0.y);
        }
        Vector2.Distance = function(_vec0, _vec1) {
          return sqrt(Vector2.SqrDistance(_vec0, _vec1));
        }
        Vector2.SqrDistance = function(_vec0, _vec1) {
          var x = _vec0.x - _vec1.x;
          var y = _vec0.y - _vec1.y;
          return (x * x + y * y + z * z);
        }
        Vector2.Scale = function(_vec0, _vec1) {
          return new Vector2(_vec0.x * _vec1.x, _vec0.y * _vec1.y);
        }
        Vector2.Min = function(_vec0, _vec1) {
          return new Vector2(Math.min(_vec0.x, _vec1.x), Math.min(_vec0.y, _vec1.y));
        }
        Vector2.Max = function(_vec0, _vec1) {
          return new Vector2(Math.max(_vec0.x, _vec1.x), Math.max(_vec0.y, _vec1.y));
        }
        Vector2.ClampMagnitude = function(_vec0, _len) {
          var vecNorm = _vec0.Normalized;
          return new Vector2(vecNorm.x * _len, vecNorm.y * _len);
        }
        Vector2.Sub = function(_vec0, _vec1) {
          return new Vector2(_vec0.x - _vec1.x, _vec0.y - _vec1.y, _vec0.z - _vec1.z);
        }

        function EulerMass(_x, _y, _mass, _drag) {
          this.position = new Vector2(_x, _y);
          this.mass = _mass;
          this.drag = _drag;
          this.force = new Vector2(0, 0);
          this.velocity = new Vector2(0, 0);
          this.AddForce = function(_f) {
            this.force.Add(_f);
          }
          this.Integrate = function(_dt) {
            var acc = this.CurrentForce(this.position);
            acc.Div(this.mass);
            var posDelta = new Vector2(this.velocity.x, this.velocity.y);
            posDelta.Mul(_dt);
            this.position.Add(posDelta);
            acc.Mul(_dt);
            this.velocity.Add(acc);
            this.force = new Vector2(0, 0);
          }
          this.CurrentForce = function(_pos, _vel) {
            var totalForce = new Vector2(this.force.x, this.force.y);
            var speed = this.velocity.Length();
            var dragVel = new Vector2(this.velocity.x, this.velocity.y);
            dragVel.Mul(this.drag * this.mass * speed);
            totalForce.Sub(dragVel);
            return totalForce;
          }
        }

        function ConfettiPaper(_x, _y) {
          this.pos = new Vector2(_x, _y);
          this.rotationSpeed = (random() * 600 + 800);
          this.angle = DEG_TO_RAD * random() * 360;
          this.rotation = DEG_TO_RAD * random() * 360;
          this.cosA = 1.0;
          this.size = 5.0;
          this.oscillationSpeed = (random() * 1.5 + 0.5);
          this.xSpeed = 40.0;
          this.ySpeed = (random() * 60 + 50.0);
          this.corners = new Array();
          this.time = random();
          var ci = round(random() * (colors.length - 1));
          this.frontColor = colors[ci][0];
          this.backColor = colors[ci][1];
          for (var i = 0; i < 4; i++) {
            var dx = cos(this.angle + DEG_TO_RAD * (i * 90 + 45));
            var dy = sin(this.angle + DEG_TO_RAD * (i * 90 + 45));
            this.corners[i] = new Vector2(dx, dy);
          }
          this.Update = function(_dt) {
            this.time += _dt;
            this.rotation += this.rotationSpeed * _dt;
            this.cosA = cos(DEG_TO_RAD * this.rotation);
            this.pos.x += cos(this.time * this.oscillationSpeed) * this.xSpeed * _dt
            this.pos.y += this.ySpeed * _dt;
            if (this.pos.y > ConfettiPaper.bounds.y) {
              this.pos.x = random() * ConfettiPaper.bounds.x;
              this.pos.y = 0;
            }
          }
          this.Draw = function(_g) {
            if (this.cosA > 0) {
              _g.fillStyle = this.frontColor;
            } else {
              _g.fillStyle = this.backColor;
            }
            _g.beginPath();
            _g.moveTo((this.pos.x + this.corners[0].x * this.size) * retina, (this.pos.y + this.corners[0].y * this.size * this.cosA) * retina);
            for (var i = 1; i < 4; i++) {
              _g.lineTo((this.pos.x + this.corners[i].x * this.size) * retina, (this.pos.y + this.corners[i].y * this.size * this.cosA) * retina);
            }
            _g.closePath();
            _g.fill();
          }
        }
        ConfettiPaper.bounds = new Vector2(0, 0);

        function ConfettiRibbon(_x, _y, _count, _dist, _thickness, _angle, _mass, _drag) {
          this.particleDist = _dist;
          this.particleCount = _count;
          this.particleMass = _mass;
          this.particleDrag = _drag;
          this.particles = new Array();
          var ci = round(random() * (colors.length - 1));
          this.frontColor = colors[ci][0];
          this.backColor = colors[ci][1];
          this.xOff = (cos(DEG_TO_RAD * _angle) * _thickness);
          this.yOff = (sin(DEG_TO_RAD * _angle) * _thickness);
          this.position = new Vector2(_x, _y);
          this.prevPosition = new Vector2(_x, _y);
          this.velocityInherit = (random() * 2 + 4);
          this.time = random() * 100;
          this.oscillationSpeed = (random() * 2 + 2);
          this.oscillationDistance = (random() * 40 + 40);
          this.ySpeed = (random() * 40 + 80);
          for (var i = 0; i < this.particleCount; i++) {
            this.particles[i] = new EulerMass(_x, _y - i * this.particleDist, this.particleMass, this.particleDrag);
          }
          this.Update = function(_dt) {
            var i = 0;
            this.time += _dt * this.oscillationSpeed;
            this.position.y += this.ySpeed * _dt;
            this.position.x += cos(this.time) * this.oscillationDistance * _dt;
            this.particles[0].position = this.position;
            var dX = this.prevPosition.x - this.position.x;
            var dY = this.prevPosition.y - this.position.y;
            var delta = sqrt(dX * dX + dY * dY);
            this.prevPosition = new Vector2(this.position.x, this.position.y);
            for (i = 1; i < this.particleCount; i++) {
              var dirP = Vector2.Sub(this.particles[i - 1].position, this.particles[i].position);
              dirP.Normalize();
              dirP.Mul((delta / _dt) * this.velocityInherit);
              this.particles[i].AddForce(dirP);
            }
            for (i = 1; i < this.particleCount; i++) {
              this.particles[i].Integrate(_dt);
            }
            for (i = 1; i < this.particleCount; i++) {
              var rp2 = new Vector2(this.particles[i].position.x, this.particles[i].position.y);
              rp2.Sub(this.particles[i - 1].position);
              rp2.Normalize();
              rp2.Mul(this.particleDist);
              rp2.Add(this.particles[i - 1].position);
              this.particles[i].position = rp2;
            }
            if (this.position.y > ConfettiRibbon.bounds.y + this.particleDist * this.particleCount) {
              this.Reset();
            }
          }
          this.Reset = function() {
            this.position.y = -random() * ConfettiRibbon.bounds.y;
            this.position.x = random() * ConfettiRibbon.bounds.x;
            this.prevPosition = new Vector2(this.position.x, this.position.y);
            this.velocityInherit = random() * 2 + 4;
            this.time = random() * 100;
            this.oscillationSpeed = random() * 2.0 + 1.5;
            this.oscillationDistance = (random() * 40 + 40);
            this.ySpeed = random() * 40 + 80;
            var ci = round(random() * (colors.length - 1));
            this.frontColor = colors[ci][0];
            this.backColor = colors[ci][1];
            this.particles = new Array();
            for (var i = 0; i < this.particleCount; i++) {
              this.particles[i] = new EulerMass(this.position.x, this.position.y - i * this.particleDist, this.particleMass, this.particleDrag);
            }
          }
          this.Draw = function(_g) {
            for (var i = 0; i < this.particleCount - 1; i++) {
              var p0 = new Vector2(this.particles[i].position.x + this.xOff, this.particles[i].position.y + this.yOff);
              var p1 = new Vector2(this.particles[i + 1].position.x + this.xOff, this.particles[i + 1].position.y + this.yOff);
              if (this.Side(this.particles[i].position.x, this.particles[i].position.y, this.particles[i + 1].position.x, this.particles[i + 1].position.y, p1.x, p1.y) < 0) {
                _g.fillStyle = this.frontColor;
                _g.strokeStyle = this.frontColor;
              } else {
                _g.fillStyle = this.backColor;
                _g.strokeStyle = this.backColor;
              }
              if (i == 0) {
                _g.beginPath();
                _g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
                _g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
                _g.lineTo(((this.particles[i + 1].position.x + p1.x) * 0.5) * retina, ((this.particles[i + 1].position.y + p1.y) * 0.5) * retina);
                _g.closePath();
                _g.stroke();
                _g.fill();
                _g.beginPath();
                _g.moveTo(p1.x * retina, p1.y * retina);
                _g.lineTo(p0.x * retina, p0.y * retina);
                _g.lineTo(((this.particles[i + 1].position.x + p1.x) * 0.5) * retina, ((this.particles[i + 1].position.y + p1.y) * 0.5) * retina);
                _g.closePath();
                _g.stroke();
                _g.fill();
              } else if (i == this.particleCount - 2) {
                _g.beginPath();
                _g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
                _g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
                _g.lineTo(((this.particles[i].position.x + p0.x) * 0.5) * retina, ((this.particles[i].position.y + p0.y) * 0.5) * retina);
                _g.closePath();
                _g.stroke();
                _g.fill();
                _g.beginPath();
                _g.moveTo(p1.x * retina, p1.y * retina);
                _g.lineTo(p0.x * retina, p0.y * retina);
                _g.lineTo(((this.particles[i].position.x + p0.x) * 0.5) * retina, ((this.particles[i].position.y + p0.y) * 0.5) * retina);
                _g.closePath();
                _g.stroke();
                _g.fill();
              } else {
                _g.beginPath();
                _g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
                _g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
                _g.lineTo(p1.x * retina, p1.y * retina);
                _g.lineTo(p0.x * retina, p0.y * retina);
                _g.closePath();
                _g.stroke();
                _g.fill();
              }
            }
          }
          this.Side = function(x1, y1, x2, y2, x3, y3) {
            return ((x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2));
          }
        }
        ConfettiRibbon.bounds = new Vector2(0, 0);
        confetti = {};
        confetti.Context = function(id) {
          var i = 0;
          var canvas = document.getElementById(id);
          var canvasParent = canvas.parentNode;
          var canvasWidth = canvasParent.offsetWidth;
          var canvasHeight = canvasParent.offsetHeight;
          canvas.width = canvasWidth * retina;
          canvas.height = canvasHeight * retina;
          var context = canvas.getContext('2d');
          var interval = null;
          var confettiRibbons = new Array();
          ConfettiRibbon.bounds = new Vector2(canvasWidth, canvasHeight);
          for (i = 0; i < confettiRibbonCount; i++) {
            confettiRibbons[i] = new ConfettiRibbon(random() * canvasWidth, -random() * canvasHeight * 2, ribbonPaperCount, ribbonPaperDist, ribbonPaperThick, 45, 1, 0.05);
          }
          var confettiPapers = new Array();
          ConfettiPaper.bounds = new Vector2(canvasWidth, canvasHeight);
          for (i = 0; i < confettiPaperCount; i++) {
            confettiPapers[i] = new ConfettiPaper(random() * canvasWidth, random() * canvasHeight);
          }
          this.resize = function() {
            canvasWidth = canvasParent.offsetWidth;
            canvasHeight = canvasParent.offsetHeight;
            canvas.width = canvasWidth * retina;
            canvas.height = canvasHeight * retina;
            ConfettiPaper.bounds = new Vector2(canvasWidth, canvasHeight);
            ConfettiRibbon.bounds = new Vector2(canvasWidth, canvasHeight);
          }
          this.start = function() {
            this.stop()
            var context = this;
            this.update();
          }
          this.stop = function() {
            cAF(this.interval);
          }
          this.update = function() {
            var i = 0;
            context.clearRect(0, 0, canvas.width, canvas.height);
            for (i = 0; i < confettiPaperCount; i++) {
              confettiPapers[i].Update(duration);
              confettiPapers[i].Draw(context);
            }
            for (i = 0; i < confettiRibbonCount; i++) {
              confettiRibbons[i].Update(duration);
              confettiRibbons[i].Draw(context);
            }
            this.interval = rAF(function() {
              confetti.update();
            });
          }
        }
        var confetti = new confetti.Context('confetti');
        confetti.start();
        window.addEventListener('resize', function(event){
          confetti.resize();
        });
      });
!function(a,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t(require,exports,module):a.CountUp=t()}(this,function(a,t,n){var e=function(a,t,n,e,i,r){for(var o=0,s=["webkit","moz","ms","o"],m=0;m<s.length&&!window.requestAnimationFrame;++m)window.requestAnimationFrame=window[s[m]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[s[m]+"CancelAnimationFrame"]||window[s[m]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(a,t){var n=(new Date).getTime(),e=Math.max(0,16-(n-o)),i=window.setTimeout(function(){a(n+e)},e);return o=n+e,i}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)});var u=this;u.options={useEasing:!0,useGrouping:!0,separator:",",decimal:".",easingFn:null,formattingFn:null};for(var l in r)r.hasOwnProperty(l)&&(u.options[l]=r[l]);""===u.options.separator&&(u.options.useGrouping=!1),u.options.prefix||(u.options.prefix=""),u.options.suffix||(u.options.suffix=""),u.d="string"==typeof a?document.getElementById(a):a,u.startVal=Number(t),u.endVal=Number(n),u.countDown=u.startVal>u.endVal,u.frameVal=u.startVal,u.decimals=Math.max(0,e||0),u.dec=Math.pow(10,u.decimals),u.duration=1e3*Number(i)||2e3,u.formatNumber=function(a){a=a.toFixed(u.decimals),a+="";var t,n,e,i;if(t=a.split("."),n=t[0],e=t.length>1?u.options.decimal+t[1]:"",i=/(\d+)(\d{3})/,u.options.useGrouping)for(;i.test(n);)n=n.replace(i,"$1"+u.options.separator+"$2");return u.options.prefix+n+e+u.options.suffix},u.easeOutExpo=function(a,t,n,e){return n*(-Math.pow(2,-10*a/e)+1)*1024/1023+t},u.easingFn=u.options.easingFn?u.options.easingFn:u.easeOutExpo,u.formattingFn=u.options.formattingFn?u.options.formattingFn:u.formatNumber,u.version=function(){return"1.7.1"},u.printValue=function(a){var t=u.formattingFn(a);"INPUT"===u.d.tagName?this.d.value=t:"text"===u.d.tagName||"tspan"===u.d.tagName?this.d.textContent=t:this.d.innerHTML=t},u.count=function(a){u.startTime||(u.startTime=a),u.timestamp=a;var t=a-u.startTime;u.remaining=u.duration-t,u.options.useEasing?u.countDown?u.frameVal=u.startVal-u.easingFn(t,0,u.startVal-u.endVal,u.duration):u.frameVal=u.easingFn(t,u.startVal,u.endVal-u.startVal,u.duration):u.countDown?u.frameVal=u.startVal-(u.startVal-u.endVal)*(t/u.duration):u.frameVal=u.startVal+(u.endVal-u.startVal)*(t/u.duration),u.countDown?u.frameVal=u.frameVal<u.endVal?u.endVal:u.frameVal:u.frameVal=u.frameVal>u.endVal?u.endVal:u.frameVal,u.frameVal=Math.round(u.frameVal*u.dec)/u.dec,u.printValue(u.frameVal),t<u.duration?u.rAF=requestAnimationFrame(u.count):u.callback&&u.callback()},u.start=function(a){return u.callback=a,u.rAF=requestAnimationFrame(u.count),!1},u.pauseResume=function(){u.paused?(u.paused=!1,delete u.startTime,u.duration=u.remaining,u.startVal=u.frameVal,requestAnimationFrame(u.count)):(u.paused=!0,cancelAnimationFrame(u.rAF))},u.reset=function(){u.paused=!1,delete u.startTime,u.startVal=t,cancelAnimationFrame(u.rAF),u.printValue(u.startVal)},u.update=function(a){cancelAnimationFrame(u.rAF),u.paused=!1,delete u.startTime,u.startVal=u.frameVal,u.endVal=Number(a),u.countDown=u.startVal>u.endVal,u.rAF=requestAnimationFrame(u.count)},u.printValue(u.startVal)};return e});