/*
 * @fileOverview  checkbox
 * @author wufangjian
 * @description  [Y]:参数必须  [N]:参数可选
 * @date 2014-09-26
 * @version 1.0
 */
define(function(require, exports, module) {
    var EasyEventPlugin = require('../eventPlugin/index');

    var checkbox = Q.Class("checkbox", {
        construct: function(opt) {

            this.box = opt.box || document; //[N] 给该节点绑定delegate事件
            this.el = opt.el; //[Y] 例：data-opera = "a-b"  给节点命名[遵循 二叉树  原则]
            //this.ev = opt.ev; //[Y] 例：data-delegate = "ev"
            this.css = opt.css; //[Y] 例:class = "css"
            this.bindEvent();

        },
        plugins: [new EasyEventPlugin()],
        methods: {
            bindEvent: function() {
                var self = this;
                var wrapper = document;
                var css = self.css;
                var el = self.el;
                var elem = self.box;
                
                var i = 0,
                    Len = 0;
                var allNode = Q.$(wrapper).find('[' + el + ']'); //树的所有节点
                var arr = Q.$(wrapper).find('[' + el + ']').map(function(index,item){return Q.$(item).attr(el);}) //树的所有节点的属性值  例：arr=[a,a-b,a-b-c,a-b]
                if(Q.$(wrapper).find('[' + el + ']').length == 1){
                    arr = [Q.$(wrapper).find('[' + el + ']').attr(el)];
                }
                var attr = Q.$(elem).attr(el); //当前点击节点 属性值
                var brr = []; //当前节点 和 孩子节点
                var crr = []; //当前节点 和 兄弟节点
                var drr = ""; //父节点
                var temp = [];


                //当前节点==孩子节点
                if(attr.length>1){
                    for (i = 0, Len = arr.length; i < Len; i++) {
                        if (arr[i]===attr) {
                            brr.push(arr[i]);
                        }
                    }
                }else{//当前节点是父级节点
                    for (i = 0, Len = arr.length; i < Len; i++) {
                        if (arr[i].indexOf(attr) === 0) {
                            brr.push(arr[i]);
                        }
                    }
                }
            

                //当前节点 和 孩子节点 css样式
                if (Q.$(elem).hasClass(css)) {
                    for (i = 0; i < brr.length; i++) {
                        Q.$(wrapper).find("["+el+"='"+brr[i]+"']").addClass(css);

                        Q.$(wrapper).find("["+el+"='"+brr[i]+"']").removeClass('ff-defchebox');
                    }
                } else {

                    for (i = 0; i < brr.length; i++) {
                        Q.$(wrapper).find("["+el+"='"+brr[i]+"']").removeClass(css);
                        Q.$(wrapper).find("["+el+"='"+brr[i]+"']").addClass('ff-defchebox');
                    }
                }



                var x = self.getTotal(arr);

                while (x > 0) {

                    //父节点
                    for (i = 0, Len = arr.length; i < Len; i++) {
                        
                        if ((arr[i].length === attr.length - 2) && attr.indexOf(arr[i]) === 0) {
                            drr = arr[i];
                        }
                        if(attr.length===1){
                            drr=attr;
                        }
                    }

                    if (drr) {
                        //当前节点和兄弟
                        for (i = 0, Len < arr.length; i < Len; i++) {
                            if (arr[i].length === attr.length && arr[i].indexOf(drr) === 0) {
                                crr.push(arr[i]);
                                if (Q.$(wrapper).find("["+el+"='"+arr[i]+"']").hasClass(css)) {
                                    temp.push(arr[i]);
                                }
                            }
                        }

                        if (attr.length === 1) {
                            break;
                        }

                        if (temp.length === crr.length) {
                            Q.$(wrapper).find("["+el+"='"+drr+"']").addClass(css);
                            Q.$(wrapper).find("["+el+"='"+drr+"']").removeClass('ff-defchebox');
                        } else {
                            Q.$(wrapper).find("["+el+"='"+drr+"']").removeClass(css);
                            Q.$(wrapper).find("["+el+"='"+drr+"']").addClass('ff-defchebox');
                        }
                    }
                    attr = drr;
                    x--;

                }

                /*var data = self.setData(allNode, css, el); //用户所需数据
                data.cur = {
                    key: attr,
                    value: Q.$(elem)
                };*/

                    //发送事件
                    //self.fireEvent(data);
                //});
            },

            /*
             * @description 当用户选中checkbox的时候  发送当前选择信息。 ［自定义事件］
             * @param evName:自定义事件名
             */
            /*fireEvent: function(data) {

                Q.event.customEvent.fire("reloadShopCart",data);
            },*/

            /*
             * @description 当前元素 指定属性的父元素
             * @param node:当前节点
             * @param prop:属性为prop的 父节点
             * @param value:属性prop 的值 及[prop=value]
             */
            elemParent: function(node, prop, value) {
                var retNode = null;
                while (node) {
                    node = node.parent();
                    if (node) {
                        var propValue = node.attr(prop);
                        if (value && propValue == value || !value && propValue) {
                            retNode = node;
                            break;
                        }
                    }
                }
                return retNode;
            },

            /*
             * @description 获取checkbox层数
             * @param  arr [树的所有节点的值]
             */
            getTotal: function(arr) {
                
                var total = arr.length;
                var temp = 0;
                for (var i = 1; i < total; i++) {
                    //var temp = total.split('-');
                    if (arr[i].split('-').length > arr[i - 1].split('-').length) {
                        temp = arr[i];
                    } else {
                        temp = arr[i - 1];
                    }
                }

                //alert(temp.split('-').length);
                return temp == 0 ? 1 : temp.split('-').length;

            },
            /*
             * @description 获取用户需要的数据
             * @param el [树的节点名]
             * @param allNode [树的所有节点数组]
             * @param css [box css样式]
             */
            setData: function(allNode, css, el) {
                var i = 0,
                    nodes = [],
                    unnodes = [],
                    vals = [],
                    unvals = [],
                    Len = allNode.length,
                    data = {};
                for (i = 0; i < Len; i++) {
                    if (Q.$(allNode[i]).hasClass(css)) {
                        nodes.push(allNode[i]); //节点数组
                        vals.push(Q.$(allNode[i]).attr(el)); //属性值数组
                    } else {
                        unnodes.push(allNode[i]);
                        unvals.push(Q.$(allNode[i]).attr(el));
                    }
                }

                data.checked = {
                    key: nodes,
                    val: vals
                };
                data.unchecked = {
                    key: unnodes,
                    val: unvals
                };
                return data;
            }
        }
    });

    module.exports = checkbox;
});