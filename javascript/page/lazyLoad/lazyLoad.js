/*
 * @fileOverview 图片懒加载
 * @author tianli
 * @date 2015-06-13
 * @version 1.5.3
 */

define(function(require, exports, module) {
    var checkbox = require('../../modules/lazyload/index');
    var pageJob = require('../../modules/pagejob/index');
    var jobName = 'lazyLoad';

    pageJob.create(jobName, {
        init: function () {
            var toBeLazyloaded = Q.$(".J_lazyload");
            if(toBeLazyloaded && toBeLazyloaded.length > 0 && toBeLazyloaded.length <= 30){
                toBeLazyloaded.lazyload();
            }
        },
        exec: function () {

        }
    });
 
    module.exports = jobName;
});








