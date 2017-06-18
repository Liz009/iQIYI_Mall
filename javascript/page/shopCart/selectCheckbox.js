/*
 * @fileOverview 购物车功能页面
 * @author tianli
 * @date 2015-06-13
 * @version 1.5.3

 * @fileOverview 购物车页面展示改版
 * @author tianli
 * @date 2016-06-28
 * @version 2.5.2
 */

define(function(require, exports, module) {
    var checkbox = require('../../modules/checkbox/index');
    var pageJob = require('../../modules/pagejob/index');
    var jobName = 'selectCheckBox';
    var doms;

    var checkboxSelectedClass = "ff-selectchebox";
    var checkboxUnClass = "ff-defchebox";

    pageJob.create(jobName, {
        init:function(){
        	//点击商品或者店铺前面的选择按钮
		    Q.$(document).on("tap", "[data-el=chkbox]", function(e) {
		        var elem = Q.$(e.target);

		        if(elem.hasClass(checkboxSelectedClass)){
		            elem.removeClass(checkboxSelectedClass);
		            elem.addClass(checkboxUnClass);
		        }
		        else{
		            elem.addClass(checkboxSelectedClass);
		            elem.removeClass(checkboxUnClass);
		        }
		        //通过checkbox组件，为商品、店铺、全选添加样式
		        function test(elem){
		            var chkBoxDis=new checkbox({
		                box: elem ,
		                el:'data-index',
		                css: "ff-selectchebox"
		            });
		        }
		        test(elem);
		       //重新调取购物车接口，获得最近的价格
		       //Q.event.customEvent.fire("reloadShopCart");
		    });
        }
    });
    
    module.exports = jobName;

});










