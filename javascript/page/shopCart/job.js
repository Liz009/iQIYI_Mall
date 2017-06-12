/*
 * @fileOverview  shopCart
 * @author tianli
 * @description 爱奇艺商城购物车
 * @date 2015-09-22
 * @version 1.0
 */
define(function(require,exports,module){
    var pageJob = require('../../modules/pagejob/index');
    var baseJobs=[];
    var jobs = [
        require('./selectCheckbox'),
    ];
    
    baseJobs = baseJobs.concat(jobs);
    module.exports = {
        addJobs:function(){
            baseJobs.forEach(function(jobName){
                pageJob.add(jobName);
            });
        },
        start:function(){
            pageJob.start();
        }
    };
});