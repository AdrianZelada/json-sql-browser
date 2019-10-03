(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,window){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.
console.log("asdasdas")
var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],3:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],4:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":3,"_process":1,"inherits":2}],5:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var dialectsHash = {
	base: require('./dialects/base'),
	mssql: require('./dialects/mssql'),
	postgresql: require('./dialects/postgresql'),
	sqlite: require('./dialects/sqlite'),
	mysql: require('./dialects/mysql')
};

var Builder = module.exports = function(options) {
    console.log(this)
	this.configure(options);
};


Builder.prototype._reset = function() {
	if (this.options.separatedValues) {
		this._placeholderId = 1;
		this._values = this.options.namedValues ? {} : [];
	} else {
		delete this._placeholderId;
		delete this._values;
	}

	this._query = '';
};

Builder.prototype._getPlaceholder = function () {
	var placeholder = '';
	if (this.options.namedValues) placeholder += 'p';
	if (this.options.indexedValues) placeholder += this._placeholderId++;
	return placeholder;
};

Builder.prototype._wrapPlaceholder = function(name) {
	return this.options.valuesPrefix + name;
};

Builder.prototype._pushValue = function(value) {
	if (_.isUndefined(value) || _.isNull(value)) {
		return 'null';
	} else if (_.isNumber(value) || _.isBoolean(value)) {
		return String(value);
	} else if (_.isString(value) || _.isDate(value)) {
		if (this.options.separatedValues) {
			var placeholder = this._getPlaceholder();

			if (this.options.namedValues) {
				this._values[placeholder] = value;
			} else {
				this._values.push(value);
			}

			return this._wrapPlaceholder(placeholder);
		} else {
			if (_.isDate(value)) value = value.toISOString();

			return '\'' + value + '\'';
		}
	} else {
		throw new Error('Wrong value type "' + (typeof value) + '"');
	}
};

Builder.prototype.configure = function(options) {
	options = _.defaults({}, options, {
		separatedValues: true,
		namedValues: true,
		valuesPrefix: '$',
		dialect: 'base',
		wrappedIdentifiers: true,
		indexedValues: true
	});

	if (options.namedValues && !options.indexedValues) {
		throw new Error(
			'Option `indexedValues`: false is ' +
			'not allowed together with option `namedValues`: true'
		);
	}

	this.options = options;

	this.setDialect(this.options.dialect);

	this._reset();
};

Builder.prototype.build = function(params) {
	var builder = this;

	this._reset();

	this._query = this.dialect.buildTemplate('query', {queryBody: params}) + ';';

	if (this.options.separatedValues) {
		return {
			query: this._query,
			values: this._values,
			prefixValues: function() {
				var values = {};
				_(this.getValuesObject()).each(function(value, name) {
					values[builder._wrapPlaceholder(name)] = value;
				});
				return values;
			},
			getValuesArray: function() {
				return _.isArray(this.values) ? this.values : _(this.values).values();
			},
			getValuesObject: function() {
				return _.isArray(this.values) ? _(_.range(1, this.values.length + 1)).object(this.values) :
					this.values;
			}
		};
	} else {
		return {query: this._query};
	}
};

Builder.prototype.setDialect = function(name) {
	if (!dialectsHash[name]) {
		throw new Error('Unknown dialect "' + name + '"');
	}

	this.dialect = new (dialectsHash[name])(this);
};

window.JsonSql = Builder;

},{"./dialects/base":7,"./dialects/mssql":15,"./dialects/mysql":16,"./dialects/postgresql":18,"./dialects/sqlite":25,"underscore":30}],6:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var objectUtils = require('../../utils/object');

var removeTopBrackets = function(condition) {
	if (condition.length && condition[0] === '(' &&
		condition[condition.length - 1] === ')') {
		condition = condition.slice(1, condition.length - 1);
	}

	return condition;
};

var termKeys = ['select', 'query', 'field', 'value', 'func', 'expression'];
var isTerm = function(obj) {
	return objectUtils.isObjectObject(obj) && objectUtils.hasSome(obj, termKeys);
};

module.exports = function(dialect) {
	dialect.blocks.add('distinct', function() {
		return 'distinct';
	});

	dialect.blocks.add('fields', function(params) {
		var fields = params.fields || {};

		if (!_.isObject(fields)) {
			throw new Error('Invalid `fields` property type "' + (typeof fields) + '"');
		}

		if (_.isEmpty(fields)) return '*';

		// If fields is array: ['a', {b: 'c'}, {name: '', table: 't', alias: 'r'}]
		if (_.isArray(fields)) {
			fields = _(fields).map(function(field) {
				if (objectUtils.isSimpleValue(field) || isTerm(field) || _.has(field, 'name')) {
					// if field has simple type or is field object: {name: '', table: 't', alias: 'r'}
					return dialect.buildBlock('term', {term: field, type: 'field'});
				} else {
					// if field is non-field object: {b: 'c'}
					return dialect.buildBlock('fields', {fields: field});
				}
			});

		// If fields is object: {a: 'u', b: {table: 't', alias: 'c'}}
		} else {
			// use keys as field names
			fields = _(fields).map(function(field, name) {
				// if field is not an object value, use it as alias
				if (_.isString(field)) field = {alias: field};

				// if field does not have name, get it from key
				if (!_.has(field, 'name')) field = _.defaults({name: name}, field);

				return dialect.buildBlock('term', {term: field, type: 'field'});
			});
		}

		return _(fields).compact().join(', ');
	});

	dialect.blocks.add('term', function(params) {
		var term = params.term;
		var type = params.type || 'field';

		var isSimpleValue = objectUtils.isSimpleValue(term);
		var isArray = _.isArray(term);

		if (isSimpleValue && !_.isString(term) || isArray) type = 'value';

		if (isSimpleValue || !isTerm(term) || isArray) {
			term = _(term).chain().pick('cast', 'alias').extend(_.object([type], [term])).value();
		}

		type = _(termKeys).find(function(key) {
			return _.has(term, key);
		});

		var result = dialect.buildBlock(type, _(term).pick(type));

		if (_.has(term, 'cast')) {
			result = 'cast(' + result + ' as ' + term.cast + ')';
		}

		if (_.has(term, 'alias')) {
			result += ' ' + dialect.buildBlock('alias', {alias: term.alias});
		}

		return result;
	});

	dialect.blocks.add('table', function(params) {
		return dialect.buildBlock('name', {name: params.table});
	});

	dialect.blocks.add('func', function(params) {
		var func = params.func;

		if (_.isString(func)) func = {name: func};

		if (!_.isObject(func)) {
			throw new Error('Invalid `func` property type "' + (typeof func) + '"');
		}

		if (!_.has(func, 'name')) {
			throw new Error('`func.name` property is required');
		}

		var args = '';

		if (_.isArray(func.args)) {
			args = _(func.args).map(function(arg) {
				return dialect.buildBlock('term', {term: arg, type: 'value'});
			}).join(', ');
		}

		return func.name + '(' + args + ')';
	});

	dialect.blocks.add('expression', function(params) {
		var expression = params.expression;

		if (_.isString(expression)) expression = {pattern: expression};

		if (!_.isObject(expression)) {
			throw new Error('Invalid `expression` property type "' + (typeof expression) + '"');
		}

		if (!_.has(expression, 'pattern')) {
			throw new Error('`expression.pattern` property is required');
		}

		var values = expression.values || {};

		return expression.pattern.replace(/\{([a-z0-9]+)\}/ig, function(fullMatch, block) {
			if (!_.has(values, block)) {
				throw new Error('Field `' + block + '` is required in `expression.values` property');
			}

			return dialect.buildBlock('term', {term: values[block], type: 'value'});
		}).trim();
	});

	dialect.blocks.add('field', function(params) {
		var field = params.field;

		if (_.isString(field)) field = {name: field};

		if (!_.isObject(field)) {
			throw new Error('Invalid `field` property type "' + (typeof field) + '"');
		}

		if (!_.has(field, 'name')) {
			throw new Error('`field.name` property is required');
		}

		var result = dialect.buildBlock('name', {name: field.name});

		if (_.has(field, 'table')) {
			result = dialect.buildBlock('table', {table: field.table}) + '.' + result;
		}

		return result;
	});

	dialect.blocks.add('value', function(params) {
		var value = params.value;
		if (_.isRegExp(value)) value = value.source;
		return dialect.builder._pushValue(value);
	});

	dialect.blocks.add('name', function(params) {
		return dialect._wrapIdentifier(params.name);
	});

	dialect.blocks.add('alias', function(params) {
		var alias = params.alias;

		if (_.isString(alias)) alias = {name: alias};

		if (!_.isObject(alias)) {
			throw new Error('Invalid `alias` property type "' + (typeof alias) + '"');
		}
		if (!_.has(alias, 'name')) {
			throw new Error('`alias.name` property is required');
		}

		var result = 'as ' + dialect._wrapIdentifier(alias.name);

		if (_.isArray(alias.columns)) {
			result += '(' + _(alias.columns).map(function(column) {
				return dialect._wrapIdentifier(column);
			}).join(', ') + ')';
		}

		return result;
	});

	dialect.blocks.add('condition', function(params) {
		var result = dialect.buildCondition({
			value: params.condition,
			defaultFetchingOperator: '$value'
		});

		if (result) {
			result = 'where ' + removeTopBrackets(result);
		}

		return result;
	});

	dialect.blocks.add('modifier', function(params) {
		var result = dialect.buildModifier({
			modifier: params.modifier
		});

		if (result) {
			result = 'set ' + result;
		}

		return result;
	});

	dialect.blocks.add('join', function(params) {
		var join = params.join;
		var result = '';

		// if join is array -> make each joinItem
		if (_.isArray(join)) {
			result = _(join).map(function(joinItem) {
				return dialect.buildTemplate('joinItem', joinItem);
			}).join(' ');

		// if join is object -> set table name from key and make each joinItem
		} else if (_.isObject(join)) {
			result = _(join).map(function(joinItem, table) {
				if (!objectUtils.hasSome(joinItem, ['table', 'query', 'select', 'expression'])) {
					joinItem = _.defaults({table: table}, joinItem);
				}

				return dialect.buildTemplate('joinItem', joinItem);
			}).join(' ');
		}

		return result;
	});

	dialect.blocks.add('joinItem:type', function(params) {
		return params.type.toLowerCase();
	});

	dialect.blocks.add('joinItem:on', function(params) {
		// `on` block is use `$field` as default query operator because it most used case
		var result = dialect.buildCondition({
			value: params.on,
			defaultFetchingOperator: '$field'
		});

		if (result) {
			result = 'on ' + removeTopBrackets(result);
		}

		return result;
	});

	dialect.blocks.add('group', function(params) {
		var group = params.group;
		var result = '';

		if (_.isString(group)) group = [group];

		if (_.isArray(group)) {
			result = _(group).map(function(field) {
				return dialect._wrapIdentifier(field);
			}).join(', ');
		}

		if (result) {
			result = 'group by ' + result;
		}

		return result;
	});

	dialect.blocks.add('having', function(params) {
		var result = dialect.buildCondition({
			value: params.having,
			defaultFetchingOperator: '$value'
		});

		if (result) {
			result = 'having ' + removeTopBrackets(result);
		}

		return result;
	});

	dialect.blocks.add('sort', function(params) {
		var sort = params.sort;
		var result = '';

		if (_.isString(sort)) sort = [sort];

		if (_.isArray(sort)) {
			result = _(sort).map(function(sortField) {
				return dialect._wrapIdentifier(sortField);
			}).join(', ');
		} else if (_.isObject(sort)) {
			result = _(sort).map(function(direction, field) {
				return dialect._wrapIdentifier(field) + ' ' + (direction > 0 ? 'asc' : 'desc');
			}).join(', ');
		}

		if (result) {
			result = 'order by ' + result;
		}

		return result;
	});

	dialect.blocks.add('limit', function(params) {
		return 'limit ' + dialect.builder._pushValue(params.limit);
	});

	dialect.blocks.add('offset', function(params) {
		return 'offset ' + dialect.builder._pushValue(params.offset);
	});

	dialect.blocks.add('or', function(params) {
		return 'or ' + params.or;
	});

	dialect.blocks.add('insert:values', function(params) {
		var values = params.values;

		if (!_.isArray(values)) values = [values];

		var fields = params.fields || _(values)
			.chain()
			.map(function(row) {
				return _(row).keys();
			})
			.flatten()
			.uniq()
			.value();

		return dialect.buildTemplate('insertValues', {
			fields: fields,
			values: _(values).map(function(row) {
				return _(fields).map(function(field) {
					return dialect.buildBlock('value', {value: row[field]});
				});
			})
		});
	});

	dialect.blocks.add('insertValues:values', function(params) {
		return _(params.values).map(function(row) {
			return '(' + row.join(', ') + ')';
		}).join(', ');
	});

	dialect.blocks.add('queryBody', function(params) {
		var queryBody = params.queryBody || {};

		return dialect.buildTemplate(queryBody.type || 'select', queryBody);
	});

	dialect.blocks.add('query', function(params) {
		return dialect.buildTemplate('subQuery', {queryBody: params.query});
	});

	dialect.blocks.add('select', function(params) {
		return dialect.buildTemplate('subQuery', {queryBody: params.select});
	});

	dialect.blocks.add('queries', function(params) {
		return _(params.queries).map(function(query) {
			return dialect.buildTemplate('query', {queryBody: query});
		}).join(' ' + params.type + (params.all ? ' all' : '') + ' ');
	});

	function buildWith(withList) {
		var result = '';

		// if with clause is array -> make each withItem
		if (_.isArray(withList)) {
			result = _(withList).map(function(withItem) {
				return dialect.buildTemplate('withItem', withItem);
			}).join(', ');

		// if with clause is object -> set name from key and make each withItem
		} else if (_.isObject(withList)) {
			result = _(withList).map(function(withItem, name) {
				if (!withItem.name) {
					withItem = _.clone(withItem);
					withItem.name = name;
				}
				return dialect.buildTemplate('withItem', withItem);
			}).join(', ');
		}

		return result;
	}

	dialect.blocks.add('with', function(params) {
		var result = buildWith(params['with']);

		if (result) result = 'with ' + result;

		return result;
	});

	dialect.blocks.add('withRecursive', function(params) {
		var result = buildWith(params.withRecursive);

		if (result) result = 'with recursive ' + result;

		return result;
	});

	dialect.blocks.add('returning', function(params) {
		var result = dialect.buildBlock('fields', {fields: params.returning});

		if (result) result = 'returning ' + result;

		return result;
	});
};

},{"../../utils/object":27,"underscore":30}],7:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var ValuesStore = require('../../utils/valuesStore');
var objectUtils = require('../../utils/object');

var templatesInit = require('./templates');
var blocksInit = require('./blocks');
var operatorsInit = require('./operators');
var modifiersInit = require('./modifiers');

var blockRegExp = /\{([a-z0-9]+)\}(.|$)/ig;

var Dialect = module.exports = function(builder) {
	this.builder = builder;

	this.templates = new ValuesStore();
	this.blocks = new ValuesStore();
	this.operators = {
		comparison: new ValuesStore(),
		logical: new ValuesStore(),
		fetching: new ValuesStore(),
		state: new ValuesStore()
	};
	this.modifiers = new ValuesStore();

	// init templates
	templatesInit(this);

	// init blocks
	blocksInit(this);

	// init operators
	operatorsInit(this);

	// init modifiers
	modifiersInit(this);

	this.identifierPartsRegexp = new RegExp(
		'(\\' + this.config.identifierPrefix + '[^\\' + this.config.identifierSuffix + ']*\\' +
			this.config.identifierSuffix + '|[^\\.]+)', 'g'
	);
	this.wrappedIdentifierPartRegexp = new RegExp(
		'^\\' + this.config.identifierPrefix + '.*\\' + this.config.identifierSuffix + '$'
	);
};

Dialect.prototype.config = {
	identifierPrefix: '"',
	identifierSuffix: '"'
};

Dialect.prototype._wrapIdentifier = function(name) {
	if (this.builder.options.wrappedIdentifiers) {
		var self = this;
		var nameParts = name.match(this.identifierPartsRegexp);

		return _(nameParts).map(function(namePart) {
			if (namePart !== '*' && !self.wrappedIdentifierPartRegexp.test(namePart)) {
				namePart = self.config.identifierPrefix + namePart + self.config.identifierSuffix;
			}

			return namePart;
		}).join('.');
	}

	return name;
};

Dialect.prototype.buildLogicalOperator = function(params) {
	var self = this;

	var operator = params.operator;
	var value = params.value;

	if (objectUtils.isSimpleValue(value)) {
		value = _.object([params.defaultFetchingOperator], [value]);
	}

	if (_.isEmpty(value)) return '';

	var result;

	if (_.isArray(value)) {
		// if value is array: [{a: 1}, {b: 2}] process each item as logical operator
		result = _(value).map(function(item) {
			return self.buildOperator({
				context: 'logical',
				contextOperator: operator,
				operator: '$and',
				value: item,
				states: [],
				defaultFetchingOperator: params.defaultFetchingOperator
			});
		});
	} else {
		result = _(value).map(function(item, field) {
			// if field name is not a operator convert it to {$field: {name: 'a', $eq: 'b'}}
			if (field[0] !== '$') {
				if (objectUtils.isSimpleValue(item) || _.isArray(item)) {
					item = {$eq: item};
				}
				item = _.defaults({name: field}, item);
				field = '$field';
			}

			return self.buildOperator({
				context: 'logical',
				contextOperator: operator,
				operator: field,
				value: item,
				states: [],
				defaultFetchingOperator: params.defaultFetchingOperator
			});
		});
	}

	return this.operators.logical.get(operator).fn(_.compact(result));
};

Dialect.prototype.buildComparisonOperator = function(params) {
	var self = this;

	var operator = params.operator;

	_(params.states).each(function(state) {
		operator = self.operators.state.get(state).getOperator(operator);
	});

	var operatorParams = this.operators.comparison.get(operator);

	var value = this.buildEndFetchingOperator({
		context: 'comparison',
		contextOperator: operator,
		value: params.value,
		states: params.states,
		defaultFetchingOperator: operatorParams.defaultFetchingOperator ||
			params.defaultFetchingOperator
	});

	return operatorParams.fn(params.field, value);
};

Dialect.prototype.buildFetchingOperator = function(params) {
	var operator = params.operator;
	var value = params.value;

	var field = this.operators.fetching.get(operator).fn(value, params.end);

	var result;
	if (params.end || objectUtils.isSimpleValue(value)) {
		result = field;
	} else {
		result = this.buildOperatorsGroup({
			context: 'fetching',
			contextOperator: operator,
			operator: '$and',
			field: field,
			value: value,
			states: params.states,
			defaultFetchingOperator: params.defaultFetchingOperator
		});
	}

	return result;
};

Dialect.prototype.buildEndFetchingOperator = function(params) {
	var self = this;

	var value = params.value;
	var operator;

	if (objectUtils.isObjectObject(value)) {
		// get first query operator
		operator = _(value).findKey(function(item, operator) {
			return operator[0] === '$' && self.operators.fetching.has(operator);
		});

		if (operator) {
			value = value[operator];
		}
	}

	return this.buildOperator(_.extend({}, params, {
		operator: operator || params.defaultFetchingOperator,
		value: value,
		end: true
	}));
};

Dialect.prototype.buildStateOperator = function(params) {
	return this.buildOperatorsGroup(_.extend({}, params, {
		context: 'state',
		contextOperator: params.operator,
		operator: '$and',
		states: params.states.concat(params.operator)
	}));
};

Dialect.prototype.buildOperatorsGroup = function(params) {
	var self = this;

	var value = params.value;

	var result;
	if (objectUtils.isObjectObject(value)) {
		result = this.operators.logical.get(params.operator).fn(
			_(value)
				.chain()
				.map(function(item, operator) {
					if (operator[0] !== '$') return '';

					if (self.operators.fetching.has(operator)) {
						// convert {a: {$field: 'b'}} to {a: {$eq: {$field: 'b'}}}
						item = _.object([operator], [item]);
						operator = '$eq';
					}

					return self.buildOperator(_.extend({}, params, {
						operator: operator,
						value: item
					}));
				})
				.compact()
				.value()
		);

		if (!result) result = params.field;
	} else {
		result = this.buildEndFetchingOperator(params);
	}

	return result;
};

Dialect.prototype.buildOperator = function(params) {
	var isContextValid = function(expectedContexts, context) {
		return _.contains(expectedContexts, context);
	};

	var context = params.context;
	var operator = params.operator;

	var result;

	var contexts = _(this.operators).mapObject(function(operatorsGroup) {
		return operatorsGroup.has(operator);
	});

	if (!_(contexts).some()) {
		throw new Error('Unknown operator "' + operator + '"');
	}

	if (contexts.logical && isContextValid(['null', 'logical'], context)) {
		result = this.buildLogicalOperator(params);
	} else if (contexts.fetching && isContextValid(['logical', 'comparison'], context)) {
		result = this.buildFetchingOperator(params);
	} else if (contexts.comparison && isContextValid(['fetching', 'state'], context)) {
		result = this.buildComparisonOperator(params);
	} else if (contexts.state && isContextValid(['fetching', 'state'], context)) {
		result = this.buildStateOperator(params);
	} else {
		var errMessage = 'Unexpected operator "' + operator + '" at ' +
			(context === 'null' ? 'null ' : '') + 'context';

		if (params.contextOperator) {
			errMessage += ' of operator "' + params.contextOperator + '"';
		}

		throw new Error(errMessage);
	}

	return result;
};

Dialect.prototype.buildCondition = function(params) {
	return this.buildOperator({
		context: 'null',
		operator: '$and',
		value: params.value,
		states: [],
		defaultFetchingOperator: params.defaultFetchingOperator
	});
};

Dialect.prototype.buildModifier = function(params) {
	var self = this;

	return _(params.modifier)
		.chain()
		.map(function(values, field) {
			var modifier;

			if (field[0] === '$') {
				modifier = field;
			} else {
				modifier = '$set';
				values = _.object([field], [values]);
			}

			var modifierFn = self.modifiers.get(modifier);

			if (!modifierFn) {
				throw new Error('Unknown modifier "' + modifier + '"');
			}

			return _(values).map(function(value, field) {
				field = self._wrapIdentifier(field);
				value = self.buildBlock('term', {term: value, type: 'value'});

				return modifierFn(field, value);
			});
		})
		.flatten()
		.compact()
		.value()
		.join(', ');
};

Dialect.prototype.buildBlock = function(block, params) {
	var blockFn = this.blocks.get(block);

	if (!blockFn) {
		throw new Error('Unknown block "' + block + '"');
	}

	return blockFn(params);
};

Dialect.prototype.buildTemplate = function(type, params) {
	var self = this;

	var template = this.templates.get(type);
	if (!template) {
		throw new Error('Unknown template type "' + type + '"');
	}

	params = _.defaults({}, params, template.defaults);

	if (template.validate) {
		template.validate(type, params);
	}

	return template.pattern.replace(blockRegExp, function(fullMatch, block, space) {
		if (_.isUndefined(params[block])) {
			return '';
		} else {
			if (self.blocks.has(type + ':' + block)) block = type + ':' + block;
			return self.buildBlock(block, params) + space;
		}
	}).trim();
};

},{"../../utils/object":27,"../../utils/valuesStore":29,"./blocks":6,"./modifiers":8,"./operators":11,"./templates":14,"underscore":30}],8:[function(require,module,exports){
'use strict';

module.exports = function(dialect) {
	dialect.modifiers.add('$set', function(field, value) {
		return [field, '=', value].join(' ');
	});

	dialect.modifiers.add('$inc', function(field, value) {
		return [field, '=', field, '+', value].join(' ');
	});

	dialect.modifiers.add('$dec', function(field, value) {
		return [field, '=', field, '-', value].join(' ');
	});

	dialect.modifiers.add('$mul', function(field, value) {
		return [field, '=', field, '*', value].join(' ');
	});

	dialect.modifiers.add('$div', function(field, value) {
		return [field, '=', field, '/', value].join(' ');
	});

	dialect.modifiers.add('$default', function(field) {
		return [field, '=', 'default'].join(' ');
	});
};

},{}],9:[function(require,module,exports){
'use strict';

var buildComparisonOperator = function(field, operator, value) {
	return [field, operator, value].join(' ');
};

var buildBooleanOperator = function(field, operator, value) {
	return buildComparisonOperator(field, 'is' + (value ? '' : ' not'), operator);
};

module.exports = function(dialect) {
	dialect.operators.comparison.add('$eq', {
		inversedOperator: '$ne',
		fn: function(field, value) {
			return buildComparisonOperator(field, '=', value);
		}
	});

	dialect.operators.comparison.add('$ne', {
		inversedOperator: '$eq',
		fn: function(field, value) {
			return buildComparisonOperator(field, '!=', value);
		}
	});

	dialect.operators.comparison.add('$gt', {
		inversedOperator: '$lte',
		fn: function(field, value) {
			return buildComparisonOperator(field, '>', value);
		}
	});

	dialect.operators.comparison.add('$lt', {
		inversedOperator: '$gte',
		fn: function(field, value) {
			return buildComparisonOperator(field, '<', value);
		}
	});

	dialect.operators.comparison.add('$gte', {
		inversedOperator: '$lt',
		fn: function(field, value) {
			return buildComparisonOperator(field, '>=', value);
		}
	});

	dialect.operators.comparison.add('$lte', {
		inversedOperator: '$gt',
		fn: function(field, value) {
			return buildComparisonOperator(field, '<=', value);
		}
	});

	dialect.operators.comparison.add('$is', {
		inversedOperator: '$isNot',
		fn: function(field, value) {
			return buildComparisonOperator(field, 'is', value);
		}
	});

	dialect.operators.comparison.add('$isNot', {
		inversedOperator: '$is',
		fn: function(field, value) {
			return buildComparisonOperator(field, 'is not', value);
		}
	});

	dialect.operators.comparison.add('$isDistinct', {
		inversedOperator: '$isNotDistinct',
		fn: function(field, value) {
			return buildComparisonOperator(field, 'is distinct from', value);
		}
	});

	dialect.operators.comparison.add('$isNotDistinct', {
		inversedOperator: '$isDistinct',
		fn: function(field, value) {
			return buildComparisonOperator(field, 'is not distinct from', value);
		}
	});

	dialect.operators.comparison.add('$like', {
		inversedOperator: '$nlike',
		defaultFetchingOperator: '$value',
		fn: function(field, value) {
			return buildComparisonOperator(field, 'like', value);
		}
	});

	dialect.operators.comparison.add('$nlike', {
		inversedOperator: '$like',
		defaultFetchingOperator: '$value',
		fn: function(field, value) {
			return buildComparisonOperator(field, 'not like', value);
		}
	});

	dialect.operators.comparison.add('$similarTo', {
		inversedOperator: '$nsimilarTo',
		defaultFetchingOperator: '$value',
		fn: function(field, value) {
			return buildComparisonOperator(field, 'similar to', value);
		}
	});

	dialect.operators.comparison.add('$nsimilarTo', {
		inversedOperator: '$similarTo',
		defaultFetchingOperator: '$value',
		fn: function(field, value) {
			return buildComparisonOperator(field, 'not similar to', value);
		}
	});


	dialect.operators.comparison.add('$match', {
		inversedOperator: '$nmatch',
		defaultFetchingOperator: '$value',
		fn: function(field, value) {
			return buildComparisonOperator(field, '~', value);
		}
	});

	dialect.operators.comparison.add('$nmatch', {
		inversedOperator: '$match',
		defaultFetchingOperator: '$value',
		fn: function(field, value) {
			return buildComparisonOperator(field, '!~', value);
		}
	});

	dialect.operators.comparison.add('$imatch', {
		inversedOperator: '$nimatch',
		defaultFetchingOperator: '$value',
		fn: function(field, value) {
			return buildComparisonOperator(field, '~*', value);
		}
	});

	dialect.operators.comparison.add('$nimatch', {
		inversedOperator: '$imatch',
		defaultFetchingOperator: '$value',
		fn: function(field, value) {
			return buildComparisonOperator(field, '!~*', value);
		}
	});


	dialect.operators.comparison.add('$null', {
		inversedOperator: '$nnull',
		defaultFetchingOperator: '$boolean',
		fn: function(field, value) {
			return buildBooleanOperator(field, 'null', value);
		}
	});

	dialect.operators.comparison.add('$nnull', {
		inversedOperator: '$null',
		defaultFetchingOperator: '$boolean',
		fn: function(field, value) {
			return buildBooleanOperator(field, 'null', !value);
		}
	});

	dialect.operators.comparison.add('$true', {
		inversedOperator: '$ntrue',
		defaultFetchingOperator: '$boolean',
		fn: function(field, value) {
			return buildBooleanOperator(field, 'true', value);
		}
	});

	dialect.operators.comparison.add('$ntrue', {
		inversedOperator: '$true',
		defaultFetchingOperator: '$boolean',
		fn: function(field, value) {
			return buildBooleanOperator(field, 'true', !value);
		}
	});

	dialect.operators.comparison.add('$false', {
		inversedOperator: '$nfalse',
		defaultFetchingOperator: '$boolean',
		fn: function(field, value) {
			return buildBooleanOperator(field, 'false', value);
		}
	});

	dialect.operators.comparison.add('$nfalse', {
		inversedOperator: '$false',
		defaultFetchingOperator: '$boolean',
		fn: function(field, value) {
			return buildBooleanOperator(field, 'false', !value);
		}
	});

	dialect.operators.comparison.add('$unknown', {
		inversedOperator: '$nunknown',
		defaultFetchingOperator: '$boolean',
		fn: function(field, value) {
			return buildBooleanOperator(field, 'unknown', value);
		}
	});

	dialect.operators.comparison.add('$nunknown', {
		inversedOperator: '$unknown',
		defaultFetchingOperator: '$boolean',
		fn: function(field, value) {
			return buildBooleanOperator(field, 'unknown', !value);
		}
	});


	dialect.operators.comparison.add('$in', {
		inversedOperator: '$nin',
		defaultFetchingOperator: '$inValues',
		fn: function(field, value) {
			return buildComparisonOperator(field, 'in', value);
		}
	});

	dialect.operators.comparison.add('$nin', {
		inversedOperator: '$in',
		defaultFetchingOperator: '$inValues',
		fn: function(field, value) {
			return buildComparisonOperator(field, 'not in', value);
		}
	});


	dialect.operators.comparison.add('$between', {
		inversedOperator: '$nbetween',
		defaultFetchingOperator: '$betweenValues',
		fn: function(field, value) {
			return buildComparisonOperator(field, 'between', value);
		}
	});

	dialect.operators.comparison.add('$nbetween', {
		inversedOperator: '$between',
		defaultFetchingOperator: '$betweenValues',
		fn: function(field, value) {
			return buildComparisonOperator(field, 'not between', value);
		}
	});
};

},{}],10:[function(require,module,exports){
'use strict';

var _ = require('underscore');

module.exports = function(dialect) {
	dialect.operators.fetching.add('$field', {
		fn: function(value) {
			return dialect.buildBlock('term', {term: value, type: 'field'});
		}
	});

	dialect.operators.fetching.add('$value', {
		fn: function(value) {
			return dialect.buildBlock('term', {term: value, type: 'value'});
		}
	});

	dialect.operators.fetching.add('$func', {
		fn: function(value) {
			return dialect.buildBlock('term', {term: value, type: 'func'});
		}
	});

	dialect.operators.fetching.add('$expression', {
		fn: function(value) {
			return dialect.buildBlock('term', {term: value, type: 'expression'});
		}
	});

	dialect.operators.fetching.add('$select', {
		fn: function(value) {
			return dialect.buildTemplate('subQuery', {queryBody: value});
		}
	});

	dialect.operators.fetching.add('$query', {
		fn: function(value) {
			return dialect.buildTemplate('subQuery', {queryBody: value});
		}
	});

	dialect.operators.fetching.add('$boolean', {
		fn: function(value) {
			return Boolean(value);
		}
	});

	dialect.operators.fetching.add('$inValues', {
		fn: function(value) {
			if (!_.isObject(value)) {
				throw new Error('Invalid `$in/$nin` value type "' + (typeof value) + '"');
			}

			if (_.isArray(value)) {
				if (!value.length) value = [null];

				return '(' + _(value).map(function(item) {
					return dialect.builder._pushValue(item);
				}).join(', ') + ')';
			} else {
				return dialect.buildTemplate('subQuery', {queryBody: value});
			}
		}
	});

	dialect.operators.fetching.add('$betweenValues', {
		fn: function(value) {
			if (!_.isArray(value)) {
				throw new Error('Invalid `$between` value type "' + (typeof value) + '"');
			}

			if (value.length < 2) {
				throw new Error('`$between` array length should be 2 or greater');
			}

			return dialect.builder._pushValue(value[0]) + ' and ' + dialect.builder._pushValue(value[1]);
		}
	});
};

},{"underscore":30}],11:[function(require,module,exports){
'use strict';

var comparisonOperatorsInit = require('./comparison');
var logicalOperatorsInit = require('./logical');
var fetchingOperatorsInit = require('./fetching');
var stateOperatorsInit = require('./state');

module.exports = function(dialect) {
	comparisonOperatorsInit(dialect);
	logicalOperatorsInit(dialect);
	fetchingOperatorsInit(dialect);
	stateOperatorsInit(dialect);
};

},{"./comparison":9,"./fetching":10,"./logical":12,"./state":13}],12:[function(require,module,exports){
'use strict';

function buildLogicalOperator(operator, values) {
	if (!values.length) return '';

	var result = values.join(' ' + operator + ' ');
	if (values.length > 1) result = '(' + result + ')';

	return result;
}

module.exports = function(dialect) {
	dialect.operators.logical.add('$and', {
		fn: function(values) {
			return buildLogicalOperator('and', values);
		}
	});

	dialect.operators.logical.add('$or', {
		fn: function(values) {
			return buildLogicalOperator('or', values);
		}
	});

	dialect.operators.logical.add('$not', {
		fn: function(values) {
			return 'not ' + buildLogicalOperator('and', values);
		}
	});

	dialect.operators.logical.add('$nor', {
		fn: function(values) {
			return 'not ' + buildLogicalOperator('or', values);
		}
	});
};

},{}],13:[function(require,module,exports){
'use strict';

module.exports = function(dialect) {
	dialect.operators.state.add('$not', {
		getOperator: function(operator) {
			var operatorParams = dialect.operators.comparison.get(operator);

			if (!operatorParams || !operatorParams.inversedOperator) {
				throw new Error('Cannot get inversed operator for operator `' + operator +'`');
			}

			return operatorParams.inversedOperator;
		}
	});
};
},{}],14:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var templateChecks = require('../../utils/templateChecks');

module.exports = function(dialect) {
	var availableJoinTypes = ['natural', 'cross', 'inner', 'outer', 'left', 'right', 'full', 'self'];
	var orRegExp = /^(rollback|abort|replace|fail|ignore)$/i;

	// private templates

	dialect.templates.add('query', {
		pattern: '{queryBody}',
		validate: function(type, params) {
			templateChecks.requiredProp(type, params, 'queryBody');
			templateChecks.propType(type, params, 'queryBody', 'object');
		}
	});


	dialect.templates.add('subQuery', {
		pattern: '({queryBody})',
		validate: function(type, params) {
			templateChecks.requiredProp(type, params, 'queryBody');
			templateChecks.propType(type, params, 'queryBody', 'object');
		}
	});


	dialect.templates.add('queriesCombination', {
		pattern: '{with} {withRecursive} {queries} {sort} {limit} {offset}',
		validate: function(type, params) {
			templateChecks.onlyOneOfProps(type, params, ['with', 'withRecursive']);
			templateChecks.propType(type, params, 'with', 'object');
			templateChecks.propType(type, params, 'withRecursive', 'object');

			templateChecks.requiredProp(type, params, 'queries');
			templateChecks.propType(type, params, 'queries', 'array');
			templateChecks.minPropLength(type, params, 'queries', 2);

			templateChecks.propType(type, params, 'sort', ['string', 'array', 'object']);

			templateChecks.propType(type, params, 'limit', ['number', 'string']);

			templateChecks.propType(type, params, 'offset', ['number', 'string']);
		}
	});


	dialect.templates.add('insertValues', {
		pattern: '({fields}) values {values}',
		validate: function(type, params) {
			templateChecks.requiredProp('values', params, 'fields');
			templateChecks.propType('values', params, 'fields', 'array');
			templateChecks.minPropLength('values', params, 'fields', 1);

			templateChecks.requiredProp('values', params, 'values');
			templateChecks.propType('values', params, 'values', 'array');
			templateChecks.minPropLength('values', params, 'values', 1);
		}
	});


	dialect.templates.add('joinItem', {
		pattern: '{type} join {table} {query} {select} {expression} {alias} {on}',
		validate: function(type, params) {
			templateChecks.propType('join', params, 'type', 'string');
			templateChecks.customProp('join', params, 'type', function(value) {
				var splitType = _(value.toLowerCase().split(' ')).compact();
				return !_.difference(splitType, availableJoinTypes).length;
			});

			templateChecks.atLeastOneOfProps('join', params, ['table', 'query', 'select', 'expression']);
			templateChecks.onlyOneOfProps('join', params, ['table', 'query', 'select', 'expression']);

			templateChecks.propType('join', params, 'table', 'string');
			templateChecks.propType('join', params, 'query', 'object');
			templateChecks.propType('join', params, 'select', 'object');
			templateChecks.propType('join', params, 'expression', ['string', 'object']);

			templateChecks.propType('join', params, 'alias', ['string', 'object']);

			templateChecks.propType('join', params, 'on', ['array', 'object']);
		}
	});


	dialect.templates.add('withItem', {
		pattern: '{name} {fields} as {query} {select} {expression}',
		validate: function(type, params) {
			templateChecks.requiredProp('with', params, 'name');
			templateChecks.propType('with', params, 'name', 'string');

			templateChecks.propType(type, params, 'fields', ['array', 'object']);

			templateChecks.atLeastOneOfProps('with', params, ['query', 'select', 'expression']);
			templateChecks.onlyOneOfProps('with', params, ['query', 'select', 'expression']);

			templateChecks.propType('with', params, 'query', 'object');
			templateChecks.propType('with', params, 'select', 'object');
			templateChecks.propType('with', params, 'expression', ['string', 'object']);
		}
	});


	dialect.templates.add('fromItem', {
		pattern: '{table} {query} {select} {expression} {alias}',
		validate: function(type, params) {
			templateChecks.atLeastOneOfProps('from', params, ['table', 'query', 'select', 'expression']);
			templateChecks.onlyOneOfProps('from', params, ['table', 'query', 'select', 'expression']);

			templateChecks.propType('from', params, 'table', 'string');
			templateChecks.propType('from', params, 'query', 'object');
			templateChecks.propType('from', params, 'select', 'object');
			templateChecks.propType('from', params, 'expression', ['string', 'object']);

			templateChecks.propType('from', params, 'alias', ['string', 'object']);
		}
	});


	// public templates

	dialect.templates.add('select', {
		pattern: '{with} {withRecursive} select {distinct} {fields} ' +
			'from {from} {table} {query} {select} {expression} {alias} ' +
			'{join} {condition} {group} {having} {sort} {limit} {offset}',
		defaults: {
			fields: {}
		},
		validate: function(type, params) {
			templateChecks.onlyOneOfProps(type, params, ['with', 'withRecursive']);
			templateChecks.propType(type, params, 'with', 'object');
			templateChecks.propType(type, params, 'withRecursive', 'object');

			templateChecks.propType(type, params, 'distinct', 'boolean');

			templateChecks.propType(type, params, 'fields', ['array', 'object']);

			templateChecks.propType(type, params, 'from', ['string', 'array', 'object']);

			templateChecks.atLeastOneOfProps(type, params, ['table', 'query', 'select', 'expression']);
			templateChecks.onlyOneOfProps(type, params, ['table', 'query', 'select', 'expression']);

			templateChecks.propType(type, params, 'table', 'string');
			templateChecks.propType(type, params, 'query', 'object');
			templateChecks.propType(type, params, 'select', 'object');
			templateChecks.propType(type, params, 'expression', ['string', 'object']);

			templateChecks.propType(type, params, 'alias', ['string', 'object']);

			templateChecks.propType(type, params, 'join', ['array', 'object']);

			templateChecks.propType(type, params, 'condition', ['array', 'object']);
			templateChecks.propType(type, params, 'having', ['array', 'object']);

			templateChecks.propType(type, params, 'group', ['string', 'array']);

			templateChecks.propType(type, params, 'sort', ['string', 'array', 'object']);

			templateChecks.propType(type, params, 'limit', ['number', 'string']);

			templateChecks.propType(type, params, 'offset', ['number', 'string']);
		}
	});


	dialect.templates.add('insert', {
		pattern: '{with} {withRecursive} insert {or} into {table} {values} {condition} ' +
			'{returning}',
		validate: function(type, params) {
			templateChecks.onlyOneOfProps(type, params, ['with', 'withRecursive']);
			templateChecks.propType(type, params, 'with', 'object');
			templateChecks.propType(type, params, 'withRecursive', 'object');

			templateChecks.propType(type, params, 'or', 'string');
			templateChecks.propMatch(type, params, 'or', orRegExp);

			templateChecks.requiredProp(type, params, 'table');
			templateChecks.propType(type, params, 'table', 'string');

			templateChecks.requiredProp(type, params, 'values');
			templateChecks.propType(type, params, 'values', ['array', 'object']);

			templateChecks.propType(type, params, 'condition', ['array', 'object']);

			templateChecks.propType(type, params, 'returning', ['array', 'object']);
		}
	});


	dialect.templates.add('update', {
		pattern: '{with} {withRecursive} update {or} {table} {alias} {modifier} {condition} {returning}',
		validate: function(type, params) {
			templateChecks.onlyOneOfProps(type, params, ['with', 'withRecursive']);
			templateChecks.propType(type, params, 'with', 'object');
			templateChecks.propType(type, params, 'withRecursive', 'object');

			templateChecks.propType(type, params, 'or', 'string');
			templateChecks.propMatch(type, params, 'or', orRegExp);

			templateChecks.requiredProp(type, params, 'table');
			templateChecks.propType(type, params, 'table', 'string');

			templateChecks.propType(type, params, 'alias', 'string');

			templateChecks.requiredProp(type, params, 'modifier');
			templateChecks.propType(type, params, 'modifier', 'object');

			templateChecks.propType(type, params, 'condition', ['array', 'object']);

			templateChecks.propType(type, params, 'returning', ['array', 'object']);
		}
	});


	dialect.templates.add('remove', {
		pattern: '{with} {withRecursive} delete from {table} {alias} {condition} {returning}',
		validate: function(type, params) {
			templateChecks.onlyOneOfProps(type, params, ['with', 'withRecursive']);
			templateChecks.propType(type, params, 'with', 'object');
			templateChecks.propType(type, params, 'withRecursive', 'object');

			templateChecks.requiredProp(type, params, 'table');
			templateChecks.propType(type, params, 'table', 'string');

			templateChecks.propType(type, params, 'alias', 'string');

			templateChecks.propType(type, params, 'condition', ['array', 'object']);

			templateChecks.propType(type, params, 'returning', ['array', 'object']);
		}
	});


	dialect.templates.add('union', dialect.templates.get('queriesCombination'));


	dialect.templates.add('intersect', dialect.templates.get('queriesCombination'));


	dialect.templates.add('except', dialect.templates.get('queriesCombination'));
};

},{"../../utils/templateChecks":28,"underscore":30}],15:[function(require,module,exports){
'use strict';

var BaseDialect = require('../base');
var _ = require('underscore');
var util = require('util');

var Dialect = module.exports = function(builder) {
	BaseDialect.call(this, builder);
};

util.inherits(Dialect, BaseDialect);

Dialect.prototype.config = _({}).extend(BaseDialect.prototype.config, {});

},{"../base":7,"underscore":30,"util":4}],16:[function(require,module,exports){
'use strict';

var BaseDialect = require('../base');
var _ = require('underscore');
var util = require('util');

var Dialect = module.exports = function(builder) {
	BaseDialect.call(this, builder);
};

util.inherits(Dialect, BaseDialect);

Dialect.prototype.config = _({}).extend(BaseDialect.prototype.config, {
	identifierPrefix: '`',
	identifierSuffix: '`'
});

},{"../base":7,"underscore":30,"util":4}],17:[function(require,module,exports){
'use strict';

var _ = require('underscore');

module.exports = function(dialect) {
	var parentValueBlock = dialect.blocks.get('value');
	dialect.blocks.set('value', function(params) {
		var value = params.value;

		var result;
		if (_.isArray(value)) {
			result = 'array[' + _(value).map(function(item) {
				return dialect.builder._pushValue(item);
			}).join(', ') + ']';
		} else if (_.isObject(value)) {
			result = dialect.builder._pushValue(JSON.stringify(value));
		} else {
			result = parentValueBlock(params);
		}

		return result;
	});

	dialect.blocks.add('explain:options', function(params) {
		return '(' +
			_(params.options)
				.chain()
				.pick(['analyze', 'verbose', 'costs', 'buffers', 'timing', 'format'])
				.map(function(value, key) {
					return key + ' ' + value;
				})
				.value()
				.join(', ') +
			')';
	});

	dialect.blocks.add('explain:analyze', function() {
		return 'analyze';
	});

	dialect.blocks.add('explain:verbose', function() {
		return 'verbose';
	});

	dialect.blocks.add('distinctOn', function(params) {
		var distinctOn = params.distinctOn;
		var result = '';

		if (_.isString(distinctOn)) distinctOn = [distinctOn];

		if (_.isArray(distinctOn)) {
			result = _(distinctOn).map(function(distinctOnField) {
				return dialect._wrapIdentifier(distinctOnField);
			}).join(', ');
		}

		if (result) {
			result = 'distinct on (' + result + ')';
		}

		return result;
	});
};

},{"underscore":30}],18:[function(require,module,exports){
'use strict';

var BaseDialect = require('../base');
var	_ = require('underscore');
var	util = require('util');

var templatesInit = require('./templates');
var blocksInit = require('./blocks');
var operatorsInit = require('./operators');
var modifiersInit = require('./modifiers');

var Dialect = module.exports = function(builder) {
	BaseDialect.call(this, builder);

	// init templates
	templatesInit(this);

	// init blocks
	blocksInit(this);

	// init operators
	operatorsInit(this);

	// init modifiers
	modifiersInit(this);
};

util.inherits(Dialect, BaseDialect);

Dialect.prototype.config = _({
	jsonSeparatorRegexp: /->>?/g
}).extend(BaseDialect.prototype.config);

Dialect.prototype._wrapIdentifier = function(name) {
	// split by json separator
	var nameParts = name.split(this.config.jsonSeparatorRegexp);
	var separators = name.match(this.config.jsonSeparatorRegexp);

	// wrap base identifier
	var identifier = BaseDialect.prototype._wrapIdentifier.call(this, nameParts[0]);

	// wrap all json identifier and join them with separators
	identifier += _(separators).reduce(function(memo, separator, index) {
		return memo + separator + '\'' + nameParts[index + 1] + '\'';
	}, '');

	return identifier;
};

},{"../base":7,"./blocks":17,"./modifiers":19,"./operators":22,"./templates":23,"underscore":30,"util":4}],19:[function(require,module,exports){
'use strict';

module.exports = function(dialect) {
	dialect.modifiers.add('$jsonConcatenate', function(field, value) {
		return [field, '=', field, '||', value].join(' ');
	});

	dialect.modifiers.add('$jsonDelete', function(field, value) {
		return [field, '=', field, '-', value].join(' ');
	});

	dialect.modifiers.add('$jsonDeleteByPath', function(field, value) {
		return [field, '=', field, '#-', value].join(' ');
	});
};


},{}],20:[function(require,module,exports){
'use strict';

module.exports = function(dialect) {
	var buildComparisonCondition = function(field, operator, value) {
		return [field, operator, value].join(' ');
	};

	dialect.operators.comparison.add('$jsonContains', {
		defaultFetchingOperator: '$json',
		fn: function(field, value) {
			return buildComparisonCondition(field, '@>', value);
		}
	});

	dialect.operators.comparison.add('$jsonIn', {
		defaultFetchingOperator: '$json',
		fn: function(field, value) {
			return buildComparisonCondition(field, '<@', value);
		}
	});

	dialect.operators.comparison.add('$jsonHas', {
		defaultFetchingOperator: '$value',
		fn: function(field, value) {
			return buildComparisonCondition(field, '?', value);
		}
	});

	dialect.operators.comparison.add('$jsonHasAny', {
		defaultFetchingOperator: '$value',
		fn: function(field, value) {
			return buildComparisonCondition(field, '?|', value);
		}
	});

	dialect.operators.comparison.add('$jsonHasAll', {
		defaultFetchingOperator: '$value',
		fn: function(field, value) {
			return buildComparisonCondition(field, '?&', value);
		}
	});

	dialect.operators.comparison.add('$ilike', {
		inversedOperator: '$nilike',
		defaultFetchingOperator: '$value',
		fn: function(field, value) {
			return buildComparisonCondition(field, 'ilike', value);
		}
	});

	dialect.operators.comparison.add('$nilike', {
		inversedOperator: '$ilike',
		defaultFetchingOperator: '$value',
		fn: function(field, value) {
			return buildComparisonCondition(field, 'not ilike', value);
		}
	});
};

},{}],21:[function(require,module,exports){
'use strict';

module.exports = function(dialect) {
	dialect.operators.fetching.add('$json', {
		fn: function(value, end) {
			if (end) value = {value: value};
			return dialect.buildBlock('term', {term: value, type: 'value'});
		}
	});
};

},{}],22:[function(require,module,exports){
'use strict';

var comparisonOperatorsInit = require('./comparison');
var fetchingOperatorsInit = require('./fetching');

module.exports = function(dialect) {
	comparisonOperatorsInit(dialect);
	fetchingOperatorsInit(dialect);
};

},{"./comparison":20,"./fetching":21}],23:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var templateChecks = require('../../utils/templateChecks');

module.exports = function(dialect) {
	var explainFormatRegExp = /^(text|xml|json|yaml)$/i;

	dialect.templates.add('explain', {
		pattern: 'explain {options} {analyze} {verbose} {query} {select} {expression}',
		validate: function(type, params) {
			templateChecks.atLeastOneOfProps(type, params, ['query', 'select', 'expression']);
			templateChecks.onlyOneOfProps(type, params, ['query', 'select', 'expression']);

			templateChecks.propType(type, params, 'options', 'object');

			if (!_.isUndefined(params.options)) {
				templateChecks.atLeastOneOfProps(
					'explain:options',
					params.options,
					['analyze', 'verbose', 'costs', 'buffers', 'timing', 'format']
				);
				templateChecks.propType('explain:options', params.options, 'analyze', 'boolean');
				templateChecks.propType('explain:options', params.options, 'verbose', 'boolean');
				templateChecks.propType('explain:options', params.options, 'costs', 'boolean');
				templateChecks.propType('explain:options', params.options, 'buffers', 'boolean');
				templateChecks.propType('explain:options', params.options, 'timing', 'boolean');
				templateChecks.propType('explain:options', params.options, 'format', 'string');
				templateChecks.propMatch('explain:options', params.options, 'format', explainFormatRegExp);
			}

			templateChecks.propType(type, params, 'analyze', 'boolean');
			templateChecks.propType(type, params, 'verbose', 'boolean');
		}
	});

	// patch parent select template to add some blocks
	var selectTemplate = dialect.templates.get('select');
	selectTemplate.pattern = selectTemplate.pattern.replace('{distinct}', '{distinct} {distinctOn}');

	var parentSelectValidate = selectTemplate.validate;
	selectTemplate.validate = function(type, params) {
		parentSelectValidate(type, params);

		templateChecks.propType(type, params, 'distinctOn', ['string', 'array']);
	};

	dialect.templates.set('select', selectTemplate);
};

},{"../../utils/templateChecks":28,"underscore":30}],24:[function(require,module,exports){
'use strict';

var	_ = require('underscore');

module.exports = function(dialect) {
	dialect.blocks.add('offset', function(params) {
		var limit = '';

		if (_.isUndefined(params.limit)) {
			limit = dialect.buildBlock('limit', {limit: -1}) + ' ';
		}

		return limit + 'offset ' + dialect.builder._pushValue(params.offset);
	});
};

},{"underscore":30}],25:[function(require,module,exports){
'use strict';

var BaseDialect = require('../base');
var _ = require('underscore');
var util = require('util');
var blocksInit = require('./blocks');

var Dialect = module.exports = function(builder) {
	BaseDialect.call(this, builder);

	// init blocks
	blocksInit(this);
};

util.inherits(Dialect, BaseDialect);

Dialect.prototype.config = _({}).extend(BaseDialect.prototype.config);

},{"../base":7,"./blocks":24,"underscore":30,"util":4}],26:[function(require,module,exports){
'use strict';

var Builder = require('./builder');

module.exports = function(options) {
	return new Builder(options);
};
module.exports.Builder = Builder;

},{"./builder":5}],27:[function(require,module,exports){
'use strict';

var _ = require('underscore');

// check if object contains any of expected keys
exports.hasSome = function(obj, keys) {
	var objKeys = _(obj).keys();
	return _(keys).some(function(key) {
		return _(objKeys).contains(key);
	});
};

exports.isSimpleValue = function(value) {
	return (
		_.isString(value) ||
		_.isNumber(value) ||
		_.isBoolean(value) ||
		_.isNull(value) ||
		_.isUndefined(value) ||
		_.isRegExp(value) ||
		_.isDate(value)
	);
};

exports.isObjectObject = function(obj) {
	return _.isObject(obj) && Object.prototype.toString.call(obj) === '[object Object]';
};

},{"underscore":30}],28:[function(require,module,exports){
'use strict';

var _ = require('underscore');

exports.requiredProp = function(type, params, propName) {
	if (_.isUndefined(params[propName])) {
		throw new Error('`' + propName + '` property is not set in `' + type + '` clause');
	}
};

exports.atLeastOneOfProps = function(type, params, expectedPropNames) {
	var propNames = _(params).chain().keys().intersection(expectedPropNames).value();

	if (!propNames.length) {
		throw new Error('Neither `' + expectedPropNames.join('`, `') +
			'` properties are not set in `' + type + '` clause');
	}
};

exports.onlyOneOfProps = function(type, params, expectedPropNames) {
	var propNames = _(params).chain().keys().intersection(expectedPropNames).value();

	if (propNames.length > 1) {
		throw new Error('Wrong using `' + propNames.join('`, `') + '` properties together in `' +
			type + '` clause');
	}
};

exports.propType = function(type, params, propName, expectedTypes) {
	if (_.isUndefined(params[propName])) return;

	var propValue = params[propName];

	if (!_.isArray(expectedTypes)) expectedTypes = [expectedTypes];

	var hasSomeType = _(expectedTypes).some(function(expectedType) {
		return _['is' + expectedType.charAt(0).toUpperCase() + expectedType.slice(1)](propValue);
	});

	if (!hasSomeType) {
		throw new Error('`' + propName + '` property should have ' +
			(expectedTypes.length > 1 ? 'one of expected types:' : 'type') +
			' "' + expectedTypes.join('", "') + '" in `' + type + '` clause');
	}
};

exports.minPropLength = function(type, params, propName, length) {
	if (_.isUndefined(params[propName])) return;

	if (params[propName].length < length) {
		throw new Error('`' + propName + '` property should not have length less than ' + length +
			' in `' + type + '` clause');
	}
};

exports.propMatch = function(type, params, propName, regExp) {
	if (_.isUndefined(params[propName])) return;

	if (!params[propName].match(regExp)) {
		throw new Error('Invalid `' + propName + '` property value "' + params[propName] + '" in `' +
			type + '` clause');
	}
};

exports.customProp = function(type, params, propName, fn) {
	if (_.isUndefined(params[propName])) return;

	if (!fn(params[propName])) {
		throw new Error('Invalid `' + propName + '` property value "' + params[propName] + '" in `' +
			type + '` clause');
	}
};

},{"underscore":30}],29:[function(require,module,exports){
'use strict';

module.exports = ValuesStore;

function ValuesStore(options) {
	options = options || {};
	this._values = options.values || {};
}

ValuesStore.prototype.add = ValuesStore.prototype.set = function(name, value) {
	this._values[name] = value;
};

ValuesStore.prototype.get = function(name) {
	return this._values[name] || null;
};

ValuesStore.prototype.remove = function(name) {
	delete this._values[name];
};

ValuesStore.prototype.has = function(name) {
	return this._values.hasOwnProperty(name);
};

},{}],30:[function(require,module,exports){
//     Underscore.js 1.8.2
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.2';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var isArrayLike = function(collection) {
    var length = collection && collection.length;
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, target, fromIndex) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    return _.indexOf(obj, target, typeof fromIndex == 'number' && fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = input && input.length; i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (array == null) return [];
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, 'length').length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = list && list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    var i = 0, length = array && array.length;
    if (typeof isSorted == 'number') {
      i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
    } else if (isSorted && length) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (item !== item) {
      return _.findIndex(slice.call(array, i), _.isNaN);
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    var idx = array ? array.length : 0;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    if (item !== item) {
      return _.findLastIndex(slice.call(array, 0, idx), _.isNaN);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
    return -1;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = array != null && array.length;
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createIndexFinder(1);

  _.findLastIndex = createIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }

}.call(this));

},{}]},{},[26]);
