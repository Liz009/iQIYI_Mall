//     Zepto.js
//     (c) 2010-2014 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

define(function(require, exports, module) {
    var $ = require('./zepto');
//(function($) {
    if ($.os.ios) {
        var gesture = {}, gestureTimeout;

        var parentIfText = function(node) {
            return 'tagName' in node ? node : node.parentNode;
        };

        $(document).on('gesturestart', function(e) {
            var now = Date.now(),
                delta = now - (gesture.last || now);
            gesture.target = parentIfText(e.target);
            if(gestureTimeout){
                clearTimeout(gestureTimeout);
            }
            gesture.e1 = e.scale;
            gesture.last = now;
        }).on('gesturechange', function(e) {
            gesture.e2 = e.scale;
        }).on('gestureend', function(e) {
            if (gesture.e2 > 0) {
                if(Math.abs(gesture.e1 - gesture.e2) !== 0){
                    if($(gesture.target).trigger('pinch')){
                        $(gesture.target).trigger('pinch' + (gesture.e1 - gesture.e2 > 0 ? 'In' : 'Out'));
                    }
                }
                gesture.e1 = gesture.e2 = gesture.last = 0;
            } else if ('last' in gesture) {
                gesture = {};
            }
        });

        //禁止使用
        /*['pinch', 'pinchIn', 'pinchOut'].forEach(function(m) {
            $.fn[m] = function(callback) {
                return this.bind(m, callback);
            };
        });*/
    }
//})(Zepto);
});