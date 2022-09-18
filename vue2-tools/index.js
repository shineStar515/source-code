var emptyObject = Object.freeze({});


// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
//这些助手在 JS 引擎中生成更好的 VM 代码，因为它们
//显式性和函数内联
function isUndef (v) {
    return v === undefined || v === null
}


function isDef (v) {
    return v !== undefined && v !== null
}


function isTrue (v) {
    return v === true
}


function isFalse (v) {
    return v === false
}


/**
 * Check if value is primitive.
 * 检查值是否是基本数据类型
 */
function isPrimitive (value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        // $flow-disable-line
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    )
}


/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant
 * 快速对象检查 - 这主要用于告诉
 * 当我们知道值时来自原始值的对象
 * 是符合 JSON 的类型
 */
function isObject (obj) {
    return obj !== null && typeof obj === 'object'
}


/**
 * Get the raw type string of a value, e.g., [object Object].
 * 获取值的原始类型字符串，例如 [object Object]
 */
var _toString = Object.prototype.toString;



function toRawType (value) {
    return _toString.call(value).slice(8, -1)
}


/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 * 严格的对象类型检查。仅对纯 JavaScript 对象返回 true
 */
function isPlainObject (obj) {
    return _toString.call(obj) === '[object Object]'
}


function isRegExp (v) {
    return _toString.call(v) === '[object RegExp]'
}


/**
 * Check if val is a valid array index.
 * 检查 val 是否是有效的数组索引
 */
function isValidArrayIndex (val) {
    var n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val)
}


function isPromise (val) {
    return (
        isDef(val) &&
        typeof val.then === 'function' &&
        typeof val.catch === 'function'
    )
}


/**
 * Convert a value to a string that is actually rendered.
 * 将值转换为实际呈现的字符串
 */
function toString (val) {
    return val == null
        ? ''
        : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
            ? JSON.stringify(val, null, 2)
            : String(val)
}


/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 * 将输入值转换为数字以保持持久性。
 * 如果转换失败，返回原始字符串
 */
function toNumber (val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n
}


/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
    str,
    expectsLowerCase
) {
    var map = Object.create(null);
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return expectsLowerCase
        ? function (val) { return map[val.toLowerCase()]; }
        : function (val) { return map[val]; }
}


/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);


/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');


/**
 * Remove an item from an array.
 */
function remove (arr, item) {
    if (arr.length) {
        var index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}


/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
}


/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
    var cache = Object.create(null);
    return (function cachedFn (str) {
        var hit = cache[str];
        return hit || (cache[str] = fn(str))
    })
}


/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});


/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
});


/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
});


/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */


/* istanbul ignore next */
function polyfillBind (fn, ctx) {
    function boundFn (a) {
        var l = arguments.length;
        return l
            ? l > 1
                ? fn.apply(ctx, arguments)
                : fn.call(ctx, a)
            : fn.call(ctx)
    }


    boundFn._length = fn.length;
    return boundFn
}


function nativeBind (fn, ctx) {
    return fn.bind(ctx)
}


var bind = Function.prototype.bind
    ? nativeBind
    : polyfillBind;


/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
        ret[i] = list[i + start];
    }
    return ret
}


/**
 * Mix properties into target object.
 */
function extend (to, _from) {
    for (var key in _from) {
        to[key] = _from[key];
    }
    return to
}


/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
        if (arr[i]) {
            extend(res, arr[i]);
        }
    }
    return res
}


/* eslint-disable no-unused-vars */


/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}


/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };


/* eslint-enable no-unused-vars */


/**
 * Return the same value.
 */
var identity = function (_) { return _; };


/**
 * Generate a string containing static keys from compiler modules.
 */
function genStaticKeys (modules) {
    return modules.reduce(function (keys, m) {
        return keys.concat(m.staticKeys || [])
    }, []).join(',')
}


/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
    if (a === b) { return true }
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
        try {
            var isArrayA = Array.isArray(a);
            var isArrayB = Array.isArray(b);
            if (isArrayA && isArrayB) {
                return a.length === b.length && a.every(function (e, i) {
                    return looseEqual(e, b[i])
                })
            } else if (a instanceof Date && b instanceof Date) {
                return a.getTime() === b.getTime()
            } else if (!isArrayA && !isArrayB) {
                var keysA = Object.keys(a);
                var keysB = Object.keys(b);
                return keysA.length === keysB.length && keysA.every(function (key) {
                    return looseEqual(a[key], b[key])
                })
            } else {
                /* istanbul ignore next */
                return false
            }
        } catch (e) {
            /* istanbul ignore next */
            return false
        }
    } else if (!isObjectA && !isObjectB) {
        return String(a) === String(b)
    } else {
        return false
    }
}


/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (looseEqual(arr[i], val)) { return i }
    }
    return -1
}


/**
 * Ensure a function is called only once.
 */
function once (fn) {
    var called = false;
    return function () {
        if (!called) {
            called = true;
            fn.apply(this, arguments);
        }
    }
}


var SSR_ATTR = 'data-server-rendered';


var ASSET_TYPES = [
    'component',
    'directive',
    'filter'
];


var LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch'
];


/*  */
