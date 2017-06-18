/*
 * event emitter
 * by: nighca
 * sample:
    event.on('xxx', handler);
    event.one('xxx', handler);
    event.un('xxx', handler);
    event.fire('xxx', 'hi');
 */
define(function (require, exports, module) {
    var EventPlugin = Q.Class('EventPlugin', {
        construct: function () {
        },
        methods: {
            on: function(name, handler){
                name = name.toLowerCase();
                var list = this._ep_getList();
                (list[name] = list[name] || []).push(handler);
                return this;
            },
            one: function(name, handler){
                var _this = this,
                    once = function(){
                        _this.un(name, once);
                        handler.apply(this, arguments);
                    };
                return this.on(name, once);
            },
            un: function(name, handler){
                name = name.toLowerCase();
                var list = this._ep_getList(),
                    handlers = list[name];
                if(handlers){
                    if(!handler){
                        list[name] = null;
                    }
                    var remaining = [];
                    for(var i = 0, len = handlers.length; i < len; i++){
                        if(handlers[i] !== handler){
                            remaining.push(handlers[i]);
                        }
                    }
                    list[name] = remaining.length ? remaining : null;
                }
                return this;
            },
            fire: function(name, data){
                // 兼容旧的方式
                if(Object.prototype.toString.call(name) === '[object Object]' && name.type && !data){
                    data = name;
                    name = data.type;
                }
                name = name.toLowerCase();
                var list = this._ep_getList(),
                    handlers = list[name];
                if(handlers){
                    for(var i = 0, len = handlers.length; i < len; i++){
                        try{
                            handlers[i].call(this, data);
                        }catch(e){
                            // ...
                        }
                    }
                }
                return this;
            },
            _ep_getList: function(){
                if(!this._ep_list){
                    this._ep_list = {};
                }
                return this._ep_list;
            }
        }
    });
    module.exports = EventPlugin;
});