//     Zepto.js
//     (c) 2010-2014 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

define(function(require, exports, module) {
    var $ = require('./zepto');
    //(function($) {
    var cache = [],timeout;
    $.fn.remove = function() {
        return this.each(function() {
            if (this.parentNode) {
                if (this.tagName === 'IMG') {
                    cache.push(this);
                    this.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
                    if (timeout){
                        clearTimeout(timeout);
                    }
                    timeout = setTimeout(function() {
                        cache = [];
                    }, 60000);
                }
                this.parentNode.removeChild(this);
            }
        });
    };
    //})(Zepto);
});