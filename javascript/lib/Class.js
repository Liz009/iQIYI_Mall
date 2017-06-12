define(function(require,exports,module){

    var Class = function(name,data){
        var key;
        var superclass = data.extend || function(){};
        var superproto = function(){};
        var plugins = data.plugins || [];
        superproto.prototype = superclass.prototype;

        var constructor = data.construct || function(){};
        var properties = data.properties || {};
        var methods = data.methods || {};
        var statics = data.statics || {};

        var proto = new superproto();
        for(key in proto){
            if(proto.hasOwnProperty(key)){
                delete proto[key];
            }
        }
        for(key in properties){
            proto[key] = properties[key];
        }
        for(key in methods){
            proto[key] = methods[key];
        }
        for(var i = 0; i < plugins.length; i++){
            var plugin = plugins[i];
            for(key in plugin){
                proto[key] = plugin[key];
            }
        }
        for(key in statics){
            constructor[key] = statics[key];
        }

        proto.constructor = constructor;
        proto.superclass = superclass;
        proto.superinstance = new superproto();
        proto.__NAME__ = name;

        constructor.prototype = proto;
        return constructor;
    };
    
    module.exports = Class;
});
