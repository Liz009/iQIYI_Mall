define(function(require, exports, module) {
    var regjobs = {}; //原始注册表
    var ic = console;
    if(Q.ic && Q.ic.InfoCenter){
        ic = new Q.ic.InfoCenter({
            moduleName: 'Job'
        });
    }
    var Job = Q.Class('Job', {
        construct: function() {
            this._oginjobs = []; //原始执行表
            this._oginLazyJobs = [];
            this._execjobs = []; //待执行表
            this._execLazyJobs = [];
            this._execedjobs = []; //执行完成的表
            this._execedLazyJobs = [];
            this._unitsObj = {};   //存放unit里面的对象
        },
        methods: {
            setUnitObj : function(jobName,obj){
                this._unitsObj[jobName] = obj;
            },
            getUnitObj : function(jobName){
                return this._unitsObj[jobName];
            },
            create: function(name, obj) {
                if (!obj) {
                    throw new Error('Job.create : obj is null.');
                }
                if (!regjobs[name]) {
                    regjobs[name] = obj;
                }
                return this;
            },
            add: function(name, param) {
                if (!regjobs[name]) {
                    return this;
                }
                for (var i = 0; i < this._oginjobs.length; i++) {
                    var job = this._oginjobs[i];
                    if (job.name == name) {
                        return this;
                    }
                }
                this._oginjobs.push({
                    name: name,
                    param: param,
                    object: regjobs[name]
                });
                this._execjobs = this._oginjobs.slice(0);
                return this;
            },
            addLazy: function(name, param) {

                for (var i = 0; i < this._oginLazyJobs.length; i++) {
                    var job = this._oginLazyJobs[i];
                    if (job.name == name) {
                        return this;
                    }
                }
                this._oginLazyJobs.push({
                    name: name,
                    param: param
                });
                this._execLazyJobs = this._oginLazyJobs.slice(0);
                return this;
            },
            //重置执行队列，以便于重新执行以便所有job
            reset: function() {
                this._execjobs = this._oginjobs.slice(0);
                this._execedjobs = [];
            },
            //重置执行队列，以便于重新执行以便所有job
            clear: function() {
                this._oginjobs = [];
                this._execjobs = [];
                this._execedjobs = [];
            },
            getJob: function(jobName) {
                return regjobs[jobName];
            },
            //获取原始执行表内的所有job
            getJobs: function() {
                return this._oginjobs;
            },
            start: function() {
                var jobs = [];
                var jobing = this._execjobs;
                var jobed = this._execedjobs;
                var jobNames = [];
                var jobedNames = [];
                var t = new Date();
                var doms = null;
                jobing.forEach(function(jobingInfo) {
                    for (var i = 0; i < jobed.length; i++) {
                        if (jobingInfo.name === jobed[i].name) {
                            jobedNames.push(jobingInfo.name);
                            return;
                        }
                    }
                    jobs.push(jobingInfo);
                });
                if (jobedNames.length > 0) {
                    ic.debug('Jobs runed before in page: ' + jobedNames.join(','));
                }
                jobs.forEach(function(jobInfo) {
                    var t1 = new Date();
                    var jobName = jobInfo.name;
                    jobNames.push(jobName);
                    var param = jobInfo.param;
                    var job = regjobs[jobName];
                    try {
                        if (job.init) {
                            job.init.call(job, param);
                        }
                    } catch (e) {
                        ic.debug("job[" + jobName + "] init failed!!!");
                        ic.debug('message : ' + e.message);
                        ic.debug('stack : ' + e.stack);
                    }
                    // ic.debug('Init [' + jobName + '] cost ' + (new Date() - t1) + ' ms');
                });
                ic.debug('Jobs in page : ' + jobNames.join(','));
                while (jobs.length > 0) {
                    var t2 = new Date();
                    var jobName = jobs[0].name;
                    var param = jobs[0].param;
                    var job = regjobs[jobName];
                    try {
                        if (job.exec) {
                            var tJob = new Date();
                            job.exec.call(job, param);
                            ic.debug('job[' + jobName +'] run in ' + (new Date() - tJob) + ' ms');
                        }
                        jobed.push(jobs.shift());
                    } catch (e) {
                        ic.debug("job[" + jobName + "] executed failed!!!");
                        ic.debug('message : ' + e.message);
                        ic.debug('stack : ' + e.stack);
                        jobed.push(jobs[0]);
                        jobed.push(jobs.shift());
                    }
                    // ic.debug('Exec [' + jobName + '] cost ' + (new Date() - t2) + ' ms');
                }
                ic.debug('Run all jobs in ' + (new Date() - t) + ' ms');

                setTimeout(function(){

                    //run lazy jobs
                    var lazyJobs= [];
                    var lazyJobing = this._execLazyJobs;
                    var lazyJobed = this._execedLazyJobs;
                    var lazyJobNames = [];
                    var lazyJobedNames = [];
                    var lazyT = new Date();
                    lazyJobing.forEach(function(jobingInfo) {
                        for (var i = 0; i < lazyJobed.length; i++) {
                            if (jobingInfo.name === lazyJobed[i].name) {
                                lazyJobNames.push(jobingInfo.name);
                                return;
                            }
                        }
                        lazyJobs.push(jobingInfo);
                    });
                    if (lazyJobNames.length > 0) {
                        ic.debug('Lazy Jobs runed before in page: ' + lazyJobNames.join(','));
                    }
                    lazyJobs.forEach(function(jobInfo) {
                        var t1 = new Date();
                        var jobName = jobInfo.name;
                        lazyJobNames.push(jobName);
                        var param = jobInfo.param;
                        var job = regjobs[jobName];
                        try {
                            if (job.init) {
                                job.init.call(job, param);
                            }
                        } catch (e) {
                            ic.debug("lazy job[" + jobName + "] init failed!!!");
                            ic.debug('message : ' + e.message);
                            ic.debug('stack : ' + e.stack);
                        }
                        // ic.debug('Init [' + jobName + '] cost ' + (new Date() - t1) + ' ms');
                    });
                    ic.debug('Lazy Jobs in page : ' + lazyJobNames.join(','));
                    while (lazyJobs.length > 0) {
                        var t2 = new Date();
                        var jobName = lazyJobs[0].name;
                        var param = lazyJobs[0].param;
                        var job = regjobs[jobName];
                        try {
                            if (lazyJobs.exec) {
                                lazyJobs.exec.call(job, param);
                            }
                            lazyJobed.push(lazyJobs.shift());
                        } catch (e) {
                            ic.debug("lazy job[" + lazyJobNames + "] executed failed!!!");
                            ic.debug('message : ' + e.message);
                            ic.debug('stack : ' + e.stack);
                            lazyJobed.push(lazyJobs[0]);
                            lazyJobed.push(lazyJobs.shift());
                        }
                        // ic.debug('Exec [' + jobName + '] cost ' + (new Date() - t2) + ' ms');
                    }
                    ic.debug('Run all lazy jobs in ' + (new Date() - lazyT) + ' ms');

                }.bind(this),0);
            }
        }
    });
    module.exports = new Job();
});
