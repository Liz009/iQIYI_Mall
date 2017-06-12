define(function(require,exports,module){
	var zepto = require('./zepto/zepto');
    require('./zepto/ajax');
    require('./zepto/event');
    require('./zepto/touch');
    require('./zepto/fx');
    require('./zepto/fx_methods');
    require('./zepto/selector');
    require('./zepto/detect');
    require('./zepto/gesture');
    require('./zepto/callbacks');
    require('./zepto/deferred');
    var lib = {
        '$':zepto
    };
    lib.object = lib.object || {};
    lib.Class=require('./Class');
    lib.object.extend = lib.$.extend;
    lib.object.forEach = lib.$.each;
    if(window){
        window.Q = window.Q || {};
        lib.object.extend(window.Q, lib);
    }
});