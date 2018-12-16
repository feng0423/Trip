var jsonpCallBack;
var routeCounter = 0;

//8.0.0版本 暂时不需要开关
// var agent = navigator.userAgent;
// var actionName = 21;
// var validateTemplateId = 1;
// if (agent.indexOf("LVMM") > -1 && agent.indexOf("Android") > -1) {
//     actionName = 22;
//     validateTemplateId = 2;
// } else if (agent.indexOf("LVMM") > -1 && agent.indexOf("iPad; CPU OS") > -1) {
//     actionName = 23;
//     validateTemplateId = 3;
// } else if (agent.indexOf("LVMM") > -1 && agent.indexOf("iPhone; CPU") > -1) {
//     actionName = 23;
//     validateTemplateId = 3;
// }

(function (window) {
    var orderApp;
    var storage = window.localStorage;
    var routeReg = /(special|booker(?:Edit|Add|Choose)|address(?:Add|Edit)|coupon)/;
    orderApp = angular.module('orderApp', ['ngRoute', 'ngTouch', 'orderControllers', 'orderServices', 'orderDirectives', 'orderFilters']);
    orderApp.run([
        '$rootScope', '$location', 'cm', function ($rootScope, $location, cm) {
            $rootScope.$on('$routeChangeStart', function (evt, next, current) {
                if(location.href.indexOf('wapFlag=1')==-1){//清空之前缓存
                    storage.removeItem('datePickerData');
                    storage.removeItem('ticket_skill_DATA');
                    storage.removeItem('special_booker_choose');
                    storage.removeItem('specialBooker_fill');
                    storage.removeItem('special_booker');
                    storage.removeItem('specialTraveller_fill');
                    storage.removeItem('special_traveller');
                    storage.removeItem('special_traveller_choose');
                    storage.removeItem('H5specialTicket_invoiceApply');
                    storage.removeItem('special_visitDate');
                    storage.removeItem('special_insures');
                    storage.removeItem('special_insureSelected');
                    $location.search()['wapFlag']=1;
                }
            });
            $rootScope.$on('$routeChangeSuccess', function (evt, next, previous) {
                routeReg.test($location.$$path);
                cm.runStatis(RegExp.$1);//调用统计代码
                ++routeCounter;
            });
            $rootScope.$on('$routeChangeError', function (current, previous, rejection) {
            });
        }
    ]);
    window.orderControllers = angular.module('orderControllers', ['lucky.ui']);
    window.orderServices = angular.module('orderServices', []);
    window.orderDirectives = angular.module('orderDirectives', []);
    window.orderFilters = angular.module('orderFilters', []);
    orderApp.config([
        '$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
            var baseViewTplUrl;
            baseViewTplUrl = './templates/view';
            $routeProvider
                //填写订单信息
                .when('/special', {
                    templateUrl: baseViewTplUrl + '/spacialOrderInput.html',
                    controller: 'ticketOrderInputCtrl'
                })
                //选择预订人
                .when('/bookerChoose', {
                    templateUrl: baseViewTplUrl + '/bookerChoose.html',
                    controller: 'bookerChooseCtrl'
                })
                //新增预订人
                .when('/bookerAdd', {
                    templateUrl: baseViewTplUrl + '/bookerAdd.html',
                    controller: 'bookerAddCtrl'
                })
                //编辑预订人
                .when('/bookerEdit', {
                    templateUrl: baseViewTplUrl + '/bookerEdit.html',
                    controller: 'bookerEditCtrl'
                })
                //选择邮寄地址
                .when('/addressChoose', {
                    templateUrl: baseViewTplUrl + '/addressChoose.html',
                    controller: 'addressChooseCtrl'
                })
                //新增邮寄地址
                .when('/addressAdd', {
                    templateUrl: baseViewTplUrl + '/addressAdd.html',
                    controller: 'addressAddCtrl'
                })
                //编辑邮寄地址
                .when('/addressEdit', {
                    templateUrl: baseViewTplUrl + '/addressEdit.html',
                    controller: 'addressEditCtrl'
                })
                //选择票种
                .when('/specialOrderInput', {
                    templateUrl: baseViewTplUrl + '/spacialOrderInput.html',
                    controller: 'ticketOrderInputCtrl'
                })
                //日期价格中转
                .when('/datePicker', {
                    templateUrl: baseViewTplUrl + '/datePicker-transfer.html',
                    controller: 'datePickCtrl'
                })
                //优惠券
                .when('/coupon', {
                    templateUrl: baseViewTplUrl + '/coupon.html',
                    controller: 'couponCtrl'
                })
                //保险
                .when('/insure', {
                    templateUrl: baseViewTplUrl + '/insure.html',
                    controller: 'insure'
                })
                .otherwise({
                    redirectTo: '/special'
                });
            //$locationProvider.html5Mode(true);
            $httpProvider.interceptors.push('myInterceptor');
        }
    ]).factory('myInterceptor', ['$log', '$rootScope', '$timeout', function($log, $rootScope, $timeout) {

        var myInterceptor = {
            request: function (config) {
                return config;
            },

            requestError : function (rejection) {
                return rejection;
            },

            response: function (res) {
                function _showErr (text, model, err, show) {
                    model[err] = text;
                    model[show] = true;
                    $timeout(function () {
                        model[show] = false;
                    }, 2000);
                    return false;
                };
                if(res.config.url.indexOf("api.com.user.getUser")!=-1){
                    return res;
                }
                var data = res.data;
                try {
                    if (data.code && data.code == -1) {
                        _showErr(data.errorMessage, $rootScope, 'errorMsg', 'showErrMsg');
                    }
                } catch (err) {

                }
                return res;
            },

            responseError : function (rejection) {
                return rejection;
            }
        };
        return myInterceptor;
    }]);
})(window);
/**
 * Created by zhangfeng on 2015/7/29.
 */


orderServices.factory('cm', [
    '$http', '$q', '$location', '$timeout', function ($http, $q, $location, $timeout) {
        var agent = navigator.userAgent;
        var productId = '578391';
        var goodsIds = '2053929';
        var $ = function (selector) {
            var $$ = document.querySelectorAll.bind(document),
                dom = $$(selector);
            return angular.element(dom);
        };

        var postLine = [];
        var callLoading = function (text, url) {
            var text = text || '加载中...';
            var str = '<div class="dataLoading">' +
                '<i></i><i></i>' +
                '<span>' + text + '</span>' +
                '</div>' +
                '<div class="loadingMask"></div>';
            var obj = {
                template: str,
                url: url
            };
            //将请求压入队列
            postLine.push(obj);

            var $dataLoading = $('.dataLoading'),
                len = $dataLoading.length;
            if (len === 0) {
                $('body').append(str);
                var _prevent = function (e) {
                    e.preventDefault();
                };
                document.querySelector(".loadingMask").addEventListener("touchmove", _prevent, false);
                document.querySelector(".dataLoading").addEventListener("touchmove", _prevent, false);
            }
        };
        var closeLoading = function (url) {
            var flag = -1;
            for (var i in postLine) {
                if (postLine[i].url == url) {
                    //判断当前关闭的是队列中哪个加载
                    flag = i;
                    break;
                }
            }
            if (flag != -1) {
                postLine.splice(flag);
                $(".dataLoading, .loadingMask").remove();
                //如果关闭后还有内容正在加载，继续显示新的加载框
                if (postLine.length) {
                    $("body").append(postLine[0].template);
                }
            }
        };

        var httpRequest = function (opts, deferred) {
            var data, method, o, params, url, loadingText;
            o = opts || {};
            url = o.url || '';
            method = o.method || 'GET';
            params = o.params || {};
            data = o.data || {};
            loadingText = o.loadingText;
            var _ua = navigator.userAgent;
            if(_ua.indexOf("LVMM")>-1 && _ua.indexOf("iPhone; CPU")>-1){
                params.firstChannel = "IPHONE";
                params.secondChannel = "AppStore";
            }else if(_ua.indexOf("LVMM")>-1 && _ua.indexOf("Android")>-1){
                params.firstChannel = "ANDROID";
                params.secondChannel = _ua.substring(_ua.indexOf("ANDROID_")+8, _ua.lastIndexOf("LVMM")-1);
            }else if(_ua.indexOf("LVMM")>-1 && _ua.indexOf("iPad; CPU OS")>-1){
                params.firstChannel = "IPAD";
                params.secondChannel = "AppStore";
            }else if(_ua.indexOf("Windows Phone")>-1 && _ua.indexOf("WebView")>-1){
                params.firstChannel = "WP";
                params.secondChannel = "WPStore";
            }else{
             params.firstChannel = "TOUCH";
             params.secondChannel = "LVMM";
            }
            //if (loadingText && (params.page == 1 || params.pageIndex == 1))//加载第一页时显示小驴加载等待，后面不显示
                callLoading(loadingText, url);
            return $http({
                method: method,
                url: url,
                params: params,
                data: data
            }).success(function (data) {
                deferred.resolve(data);
                if (loadingText)
                    closeLoading(url);
            }).error(function (reason) {
                deferred.reject(reason);
                if (loadingText)
                    closeLoading(url);
            });
        };

        /*
         * 解析WAP、APP传过来的参数，这些会当做公共的参数传递给接口，约定的参数有：：
         * lvsessionid、osVersion、lvversion、globalLongitude、globalLatitude、firstChannel、
         * secondChannel、branchType、goodsIds、productId、saleId、saleChannel
         * */
        var tempParams = $location.search();
        var commonParams= {
            lvsessionid: "",
            osVersion: "",
            lvversion: "",
            globalLongitude: "",
            globalLatitude: "",
            branchType: "",
            goodsIds: "",
            productId: "",
            saleId: "",
            saleChannel: ""
        };
        for(var temp in tempParams){ //删除无效变量
            if(tempParams[temp]!="")
                commonParams[temp] = tempParams[temp];
            // comProductid 为undefind ，新接口不支持
            if(tempParams[temp]==undefined){
                commonParams[temp]=null;
            }
        }
        //console.log(commonParams)
        function isWPApp () {
            var agent = navigator.userAgent;
            return agent.indexOf("Windows Phone") > 0 
                && agent.indexOf("WebView") > 0;
        };

        return {
            isWPApp : isWPApp,
            commonParams:commonParams,
            $:$,
            getUrlParam : function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
                var r = location.hash.substr(1).match(reg); // 匹配目标参数
                if (r != null)
                    return unescape(r[2]);
                return null; // 返回参数值
            },
            trim: function(str) {
                return str.replace(/(^\s*)|(\s*$)/g, "");
            },
            //删除cookie
            delCookie: function(name) {
                d.cookie = name + "=;expires=" + (new Date(0)).toGMTString();
            },
            //两个参数，一个是cookie的名子，一个是值
            setCookie: function(name, value) {
                var Days = 30; //此 cookie 将被保存 30 天
                var exp = new Date(); //new Date("December 31, 9998");
                exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
                document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
            },
            //获取指定名称的cookie的值
            getCookie: function(objName) {
                var arrStr = document.cookie.split(";");
                for (var i = 0; i < arrStr.length; i++) {
                    var temp = arrStr[i].split("=");
                    if (this.trim(temp[0]) == objName) return decodeURIComponent(temp[1]);
                }
            },
            post: function (opts) {
                var deferred;
                deferred = $q.defer();
                opts.method = 'POST';
                httpRequest(opts, deferred);
                return deferred.promise;
            },
            get: function (opts) {
                var deferred;
                deferred = $q.defer();
                opts.method = 'GET';
                httpRequest(opts, deferred);
                return deferred.promise;
            },
            getJSON : function (opts) {
                var deferred;
                var callbackParam = opts.url.indexOf("?") > -1 ? "&callback=JSON_CALLBACK" : "?callback=JSON_CALLBACK";
                opts.url += callbackParam;
                deferred = $q.defer();
                opts.method = 'jsonp';
                httpRequest(opts, deferred);
                return deferred.promise;
            },
            getUrls: function () {
                return {
                    //获取短信验证码
                    getMsgCode : '//m.lvmama.com/usso/router/rest.do?method=api.com.user.common.ticket.order.getMsgAuthCode&version=1.0.0&lvversion=7.10.3',
                    //是否需要短信验证码
                    isNeedMsgAuthCode : '//m.lvmama.com/usso/router/rest.do?method=api.com.user.msg.isNeedMsgAuthCode&version=1.0.0&lvversion=7.10.3',
                    //是否需要图形验证码
                    checkImgCode : '//m.lvmama.com/usso/router/rest.do?method=api.com.anonymous.order.checkImageAuthCode&version=3.0.0&lvversion=7.10.3',
                    //门票订单填写信息
                    inputTicketOrder:'//m.lvmama.com/other/router/rest.do?method=api.com.groupbuy.ticket.order.inputTicketOrderAvoidTheLogin&version=1.0.0&lvversion=8.0.6',
                    //下单必填项
                    getInputOptions : '//m.lvmama.com/nticket/router/rest.do?method=api.com.csa.ticket.order.getInputOptions&version=1.0.0&formate=json',
                    //时间价格表
                    getGoodsTimePrice :'//m.lvmama.com/other/router/rest.do?method=api.com.groupbuy.ticket.goods.getGoodsTimePrice&version=1.0.0&formate=json&firstChannel=TOUCH&secondChannel=LVMM',
                    //计算总价
                    countTicketPrice:'//m.lvmama.com/other/router/rest.do?method=api.com.groupbuy.ticket.order.countTicketPrice&version=1.0.0&formate=json',
                    //检查门票
                    checkTicketOrder:'//m.lvmama.com/nticket/router/rest.do?method=api.com.csa.ticket.getTravellerInputInfo&formate=json&branchType=BRANCH&version=1.0.0',
                    //下单
                    createOrder:'//m.lvmama.com/other/router/rest.do?method=api.com.groupbuy.ticket.order.createOrderAvoidTheLogin&version=1.0.0&lvversion=8.0.6',
                    getUser : '//m.lvmama.com/usso/router/rest.do?method=api.com.user.getUser&version=1.0.0',//
                    addContact : '//m.lvmama.com/usso/router/rest.do?method=api.com.user.addContact&version=1.0.0',
                    removeContact : '//m.lvmama.com/usso/router/rest.do?method=api.com.user.removeContact&version=1.0.0',
                    updateContact : '//m.lvmama.com/usso/router/rest.do?method=api.com.user.updateContact&version=1.0.0',
                    getContact : '//m.lvmama.com/usso/router/rest.do?method=api.com.user.getContact&version=1.0.0&receiversType=Contact',
                    addAddress : '//m.lvmama.com/usso/router/rest.do?method=api.com.user.addAddress&version=1.0.0',
                    removeAddress : '//m.lvmama.com/usso/router/rest.do?method=api.com.user.deleteAddress&version=1.0.0&receiversType=Address',
                    updateAddress : '//m.lvmama.com/usso/router/rest.do?method=api.com.user.updateAddress&version=1.0.0',
                    getAddress : '//m.lvmama.com/api/router/rest.do?method=api.com.user.getAddress&version=1.0.0',
                    getCity : '//m.lvmama.com/api/router/rest.do?method=api.com.ticket.goods.getDistricts&version=1.0.0&formate=json',
                    getCoupon : '//m.lvmama.com/usso/router/rest.do?method=api.com.user.getCoupon&state=NOT_USED&osVersion=4.1.1&version=1.0.0&formate=json',
                    postlosc : '//m.lvmama.com/api/router/rest.do?method=api.com.trip.other.postlosc&version=1.0.0',
                    getInsurance : '//m.lvmama.com/other/router/rest.do?method=api.com.groupbuy.ticket.goods.getGoodsInsuranceInfo&version=1.0.0',
                };
            },
            priceFilter: function (priceStr) {
                var temp = priceStr.replace(/\(|\)/g, '');
                if (temp.indexOf(",") < 0)
                    temp = temp + ",";
                return temp;
            },

            /* *
             * 自定义统计代码方法
             * 2015-07-21
             * */
            runStatis : function (path) {
                var pre = 'H5_', type = '_特卖会', val;
                var pathMap = {
                    'bookerEdit' : ['游玩人编辑页', 'Tourist'],
                    'bookerAdd' : ['游玩人新增页', 'Tourist'],
                    'bookerChoose' : ['游玩人选择页', 'Tourist'],
                    'addressAdd' : ['常用地址新增页', 'Tourist'],
                    'addressChoose' : ['常用地址编辑页', 'Tourist'],
                    'contract' : ['合同', 'Contract'],
                    'coupon' : ['优惠券', 'AroundBounce'],
                };
                val = pathMap[path];
                !!val && this.statistics(pre + val[0] + type, val[1]);
            },
            isNotEmpty: function (Arr) {
                if (Arr == null || Arr == 'undefined' || Arr == undefined || Arr.length == 0) {
                    return false;
                }
                return true;
            },
            statistics: function (PageID, CategoryID) {
                var interval = setInterval(function () {
                    if (!_LVMAMA_COREMETRICS)
                        return;
                    _LVMAMA_COREMETRICS.init(document.domain);
                    var pageID = "",
                        categoryID = "",
                        type = "",
                        appOrWap = "App";
                    if (agent.indexOf('Mobile') > 0 && agent.indexOf('iPhone OS') > 0 && agent.indexOf('LVMM') > 0) {
                        type = "IP-";
                    } else if (agent.indexOf('Mobile') > 0 && agent.indexOf('Android') > 0 && agent.indexOf('LVMM') > 0) {
                        type = "AD_";
                    } else {
                        type = "WAP_";
                    }
                    if (type == "WAP_") {
                        appOrWap = "WAP_"
                    }
                    pageID = appOrWap + PageID;
                    categoryID = type + CategoryID;
                    cmCreatePageviewTag(pageID, categoryID, null, null);
                    clearInterval(interval);
                }, 200);
            },

            showErr : function (text, model, err, show, opts) {
                model[err] = text;
                model[show] = true;
                $timeout(function () {
                    model[show] = false;
                    opts && opts.obj.focus(); 
                }, 2000);
                return false;
            },

            validate : function (model, err, show, opts) {

                var validArr, valid, val, i,
                      require, reqErr, type, typeErr;
                var type2Reg = {
                    email : /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+$/,//验证邮箱
                    ID : /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,//验证身份证
                    mobile : /^\d{11}$/,//验证手机号
                    upper : /^[A-Z]+$/,//验证是否为大写字母
                    chinese : /^([\u4E00-\u9FA5]+,?)+$/,//验证中文
                    postcode : /^[0-9]{6}$///邮编
                };
                var type2Cn = {
                    email : "邮箱",
                    ID : "身份证",
                    mobile : "手机号",
                    upper : "大写字母",
                    chinese : "中文",
                    postcode : "邮编"
                };

                if (opts && _isArray(opts)) {
                    for (i = 0, len =opts.length; i < len; ) {
                        valid = opts[i++];
                        if (!valid.check) return this.showErr(valid.err, model, err, show);
                    }
                }

                validArr = [].slice.call($('input[data-valid=true]'));
                for (i = 0, len =validArr.length; i < len; ) {
                    valid = validArr[i++];
                    val = valid.value;
                    require = _getAttr(valid, 'data-require');
                    type = _getAttr(valid, 'data-type');
                    reqErr = _getAttr(valid, 'data-require-err') || "请输入" + type2Cn[type] + "内容";
                    typeErr = _getAttr(valid, 'data-type-err') || type2Cn[type] + "格式错误";

                    if (require && !val) {
                        return this.showErr(reqErr, model, err, show, {obj : valid});
                    }
                        
                    if (type && val.length && (type2Reg[type] && !type2Reg[type].test(val))) {
                        return this.showErr(typeErr, model, err, show, {obj : valid});
                    }
                        
                }
                return true;

                function _getAttr (target, name) {
                    return target.getAttribute(name);
                };

                function _isArray (obj) {
                    return {}.toString.call(obj) === "[object Array]";
                }

            }
        };
    }
]);

orderServices.factory('dataManager', function () {
    var dataCache = {};
    return {
        setData: function (dataName, data) {
            if (dataName && angular.isString(dataName)) {
                dataCache[dataName] = data;
            }
        },
        getData: function (dataName) {
            if (dataName && angular.isString(dataName)) {
                return dataCache[dataName];
            }
        }
    }
});

(function (global, factory) {
    'use strict'
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ? factory(global, true) : function(w) {
            if (!w.document) {
                throw new Error("Requires window with document")
            }
            return factory(w);
        }
    } else {
        factory(global);
    }
} (typeof window !== "undefined" ? window : this, function (win, noGlobal) {

    var arrPro = Array.prototype,
          objPro = Object.prototype,
          doc = win.document, fn, $,
          classFlg = !!doc.documentElement.classList,
          noConflict = window.$ === void 0,
          cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
          handlers = {};

    function maybeAddPx(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) 
            ? value + "px" : value;
    };

    function dasherize(str) {
        return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase();
    };

    var _ = {

        doc : doc,
        slice : arrPro.slice,
        toString : objPro.toString,
        hasOwn : objPro.hasOwnProperty,
        indexOf : arrPro.indexOf,
        classFlg : classFlg,

        genUUID : function(prefix) {
            prefix = prefix || "LVMM";
            return (prefix + Math.random() + Math.random()).replace(/0\./g, "");
        },

        qsa : function (dom, el) {
            el = el || _.doc;
            return _.isString(dom)
                ? /[#|\.]*[\w|\d]+\s+[#|\.]\S+/.test(dom)
                ? el.querySelectorAll(dom)
                : /#\S+/.test(dom)
                ? _.doc.getElementById(dom.substring(1))
                : /\.\S+/.test(dom)
                ? el.getElementsByClassName(dom.substring(1))
                : el.getElementsByTagName(dom)
                : dom;
        },

        isFunction : function (obj) {
          return _.toString.call(obj) === '[object Function]';
        },

        isUndefined : function (obj) {
          return obj === void 0;
        },

        isNaN : function(obj) {
          return _.isNumber(obj) && obj !== +obj;
        },

        isEmpty : function (obj) {
          return _.isUndefined(obj) || _.isNull(obj) 
              || obj === false || obj === 0
              || obj === "" || _.isNaN(obj);
        },

        canExtend : function (val) {
          return _.isArray(val) || _.isObject(val);
        },

        reset : function (obj) {
            return obj = null;
        },

        each : function (obj, callback, args) {
          var key, i = 0,
                len = obj.length,
                isObj = _.isUndefined(len) || _.isFunction(obj);
          if (isObj) {
            for (key in obj) {
              if (callback(obj[key], key, obj, args || null)) return false;
            }
          } else {
            for ( ; i < len; i += 1) {
              if (callback(obj[i], i, obj, args || null)) return false;
            }
          }
          return obj;
        },

        extend : function (target, source, deep) {
            if (!(2 in arguments) && _.isObject(target) && !_.isObject(source)) {
                target = [deep = source, source = target, this][2];
            }
            _.each(source, function (value, key, obj) {

              if (_.isArray(value) && !_.isArray(target[key])) {
                target[key] = [];
              }

              if (_.isObject(value) && !_.isObject(target[key])) {
                target[key] = {}; 
              }

              if (_.canExtend(value)) {
                _.extend(target[key], value, deep); 
              } else if (deep || _.isEmpty(target[key])) {
                target[key] = value;
              }
            });
            return target;
        },

        contains : function (arr, val) {
            _.isString(arr) && (arr = arr.split(/\s+/));
            if (!!_.indexOf) {
                return _.indexOf.call(arr, val) > -1;
            } else {
                for (var i in arr) {
                    if (arr[i] === val) return true;
                }
                return false;
            }
        }
    };

    _.each('Array Object Null Number String'.split(/\s/), function (val, index) {
        _['is' + val] = function (obj) {
            return _.toString.call(obj) === '[object ' + val + ']';
        };
    });

    function LvQuery (selector) {
        if (!(this instanceof $)) {
            return new $(arguments[0]);
        }

        this.init(selector);
        this.context = doc;
    };

    fn = {

        init : function (selector) {
            var that = this, i = 0;
            if (!selector) {
                return $;
            }

            if (!_.isString(selector) && selector.nodeType == 1) {
                that[0] = selector;
                that.length = 1;
                return that;
            }

            var el = _.qsa(selector);
            if (el.nodeType == 1) {
                that[0] = el;
                that.length = 1;
            } else {
                _.each(el, function (child, index) {
                    that[index] = child;
                    i += 1;
                });
                that.length = i;
            }
            return that; 
        },

        find : function (selector) {
            return !selector ? $ : this.length == 1
                ? $(_.qsa(selector, this[0]))
                : _.each(this, function(child){
                    var index = 0;
                    _.each(_.qsa(selector, child), function (v) {
                        this[index++] = v;
                    });
                    this.length = index;
                });
        },

        each : function (callback, args) {
            for (var i = 0, len = this.length; i < len; i += 1) {
                if (callback(this[i], i, args)) return false;
            }
            return this;
        },

        data : function (key, value) {
            if (1 in arguments) {
                this.each(function (child) {
                    child.setAttribute('data-' + key, value);
                });
            } else {
                var attr = this[0].getAttribute('data-' + key);
                return _.isNaN(+attr) ? attr : attr >> 0;
            }
            return this;
        },

        css : function (key, value) {
            var i = 0, len = this.length, cssArr;
            if (1 in arguments) {
                this.each(function (child, index) {
                    child.style[key] = value;
                });
                return this;
            }

            if (_.isObject(key)) {
                this.each(function (child, index) {
                    cssArr = [];
                    _.each(key, function (v, k) {
                        cssArr.push(k + ":" + maybeAddPx(k, v));
                    });
                    child.style.cssText += cssArr.join(';');
                }) && _.reset(cssArr);
                return this;
            }
            return win.getComputedStyle(this[0], null).getPropertyValue(key)
                || this[0].currentStyle[key];
        },

        on : function (evt, callback, useCapture) {
            useCapture = useCapture || false;
            _.isString(evt) && (evt = evt.split(/\s+/));
            _.isArray(evt) && this.each(function (child, index) {
                var id = _.genUUID();
                handlers[id] = [];
                _.each(evt, function (e) {
                    child.lvmmID = id;
                    child.addEventListener(e, function (e) {
                        e.originalEvent = e;
                        callback(e);   
                    }, useCapture);
                    handlers[id].push({evt : e, fn : callback, cap : useCapture});
                });
            });
            return this;
        },

        off : function (evt, callback, useCapture) {
            if (0 in arguments) {
                _.isString(evt) && (evt = evt.split(/\s+/));
                _.isArray(evt) && this.each(function (child, index) {
                    _.each(evt, function (e) {
                        child.removeEventListener(e, callback, useCapture || false);
                    });
                });
            } else {
                this.each(function (child, index) {
                    !_.isUndefined(child.lvmmID) 
                        && _.each(handlers[child.lvmmID], function (handler, key) {
                            child.removeEventListener(handler.evt, handler.fn, handler.cap);
                        });
                });
            }
            return this;
        },

        hasClass : classFlg
            ? function (cls) {
                if (_.isString(cls)) {
                    return !!this.each(function (child, index) {
                        return !_.each(cls.split(/\s+/), function (c) {
                            if (!child.classList.contains(c)) return true;
                        }) ? true : false;
                    });
                }
                return false;
            } : function (cls) {
                var clsArr;
                if (_.isString(cls)) {
                    return !!this.each(function (child, index) {
                        clsArr = child.className.split(/\s+/);
                        return !_.each(cls.split(/\s+/), function (c) {
                            if (clsArr.indexOf(c) == -1) return true;
                        }) ? true : false;
                    });
                }
                return false;
            },

        addClass : classFlg
            ? function (cls) {
                if (_.isString(cls)) {
                    this.each(function (child, index) {
                        _.each(cls.split(/\s+/), function (c) {
                            child.classList.add(c);
                        });
                    });
                }
                return this;
            } : function (cls) {
                var clsArr;
                if (_.isString(cls)) {
                    this.each(function (child, index) {
                        clsArr = child.className.split(/\s+/);
                        _.each(cls.split(/\s+/), function (c) {
                             !_.contains(clsArr, c) && clsArr.push(c);
                        });
                        child.className = clsArr.join(' ');
                    });
                }
                return this;
            },

         removeClass : classFlg
            ? function (cls) {
                if (_.isString(cls)) {
                    this.each(function (child, index) {
                        _.each(cls.split(/\s+/), function (c) {
                            child.classList.remove(c);
                        });
                    })
                }
                return this;
            } : function (cls) {
                var clsArr;
                if (_.isString(cls)) {
                    this.each(function (child, index) {
                        clsArr = [];
                        _.each(child.className.split(/\s+/), function (c, i) {
                             !_.contains(cls, c) && clsArr.push(c);
                        });
                        child.className = clsArr.join(' ');
                    });
                }
                return this;
            },

            removeAttr : function (prop) {
                this.each(function (child, index) {
                    child.removeAttribute(prop);
                });
                return this;
            },

            attr : function (prop, val) {
                if (1 in arguments) {
                    this.each(function (child, index) {
                        child.setAttribute(prop, val);
                    });
                } else if (_.isString(prop)) {
                    return this[0].getAttribute(prop);
                }
                return this;
            },

            eq : function (index) {
                return $(this[index || 0]);
            }

    };
    LvQuery.fn = LvQuery.prototype = fn;
    _.extend(LvQuery, _, true);

    if (!noGlobal && noConflict) {
        window.$ = window.LvQuery = $ = LvQuery;
    }
}));

(function ($) {
    $.fn.stop = function () {;};
    $.each(['height', 'width'], function (val) {
        $.fn[val] = function () {
            return this.css(val).replace(/px/, '') >> 0;
        };
    });
    $.each("click focus blur".split(/\s+/), function (evt) {
        $.fn[evt] =function (callback) {
            return this.on(evt, callback, false);
        }
    });
    $.extend($, {
        //$.dateFormat({date:'2015-9-10'})
        dateFormat: function (val) {
            var option = {
                date: "",
                sum: 0
            };
            $.extend(option, val);
            if (typeof option.date == "string") {
                option.date = option.date.split("-");
            }

            var newDay = new Date();
            newDay.setDate(option.date[2]);
            newDay.setMonth(option.date[1] - 1);
            newDay.setFullYear(option.date[0]);
            var baseNum = 24 * 3600 * 1000;
            newDay = new Date(newDay.getTime() + option.sum * baseNum);
            return [newDay.getFullYear(), newDay.getMonth() + 1, newDay.getDate()];
        }
    });
    $.extend({
        //$.imgToBase64('/work/abc.png')
        imgToBase64 : function (url, opts, format) {
            var canvas = document.createElement('CANVAS'),
                  ctx = canvas.getContext('2d'),
                  img = new Image;
            img.crossOrigin = 'Anonymous';
            canvas.height = opts ? opts.height : 100;
            canvas.width = opts ? opts.width : 100;
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL(outputFormat || 'image/png');
            $.reset(canvas);
            return dataURL;
        }
    });
} (LvQuery));
/*
 overlay
 singleSelectorPopup        单级指令      rely overlay
 doubleSelectorPopup        两级联动指令  rely overlay
 selector                   单级指令扩展  rely singleSelectorPopup string
 */

var LuckyUI = angular.module("lucky.ui",[]);
//遮罩指令
LuckyUI.service("overlay", ["$rootScope", function ($rootScope) {
    var that = this;
    this.layer = 0;
    var objArr = [];
    this.show = function (obj) {
        this.layer++;
        objArr.push(obj);
        $rootScope.$broadcast("overlay-add");
    };
    this.hide = function () {
        that.layer--;
        objArr.pop();
        $rootScope.$broadcast("overlay-remove");
    };
    this.clear = function () {
        this.layer = 0;
        objArr = [];
        $rootScope.$broadcast("overlay-remove");
    };
    this._doClick = function () {
        var obj = objArr.pop();
        "function" == typeof obj && (objArr.push(obj), obj())
    }
}]).directive("overlay", ["overlay", "$timeout", function (overlay) {
    return {
        replace: true,
        scope: true,
        template: '<div id="overlay"  ng-click="bindClick();"></div>',
        restrict: "EA",
        link: function (scope, element) {
            scope.$on("overlay-add", function () {
                overlay.layer > 0 && (element.css("display", "block"), setTimeout(function () {
                    element.addClass("show")
                }, 10)), scope.bindClick = function () {
                    overlay._doClick()
                }
            });
            scope.$on("overlay-remove", function () {
                scope.click = overlay._doClick;
                if (overlay.layer == 0) {
                    element.removeClass("show");
                    setTimeout(function () {
                        element.css("display", "none");
                    }, 100)
                }
            });
            element.on("touchmove", function (e) {
                e.preventDefault()
            })
        }
    }
}]);
//单级选择基础指令
LuckyUI.service("singleSelectorPopup", ["$rootScope", "$q", "overlay", "$timeout", function ($rootScope, $q, overlay, $timeout) {
    function hideObj() {
        overlay.hide(), that.shown = 0, $rootScope.$broadcast("single-hide")
    }

    var deferred, that = this;
    this.shown = 0;
    this.opts = null;
    this.show = function (val) {
        deferred = $q.defer();
        overlay.show(that.hide);
        that.shown = 1;
        that.opts = $.extend({
            title: "单栏选择器",
            initData: null,
            data: []
        }, val);
        $rootScope.$broadcast("single-show");
        return deferred.promise;
    };
    this.hide = function () {
        that.onCancel()
    };
    this.onConfirm = function (data) {
        deferred && that.shown && (hideObj(), $timeout(function () {
            deferred.resolve(data)
        }))
    };
    this.onCancel = function (reason) {
        deferred && that.shown && (hideObj(), $timeout(function () {
            deferred.reject(reason)
        }))
    }
}]).directive("singleSelectorPopup", ["singleSelectorPopup", "$timeout", function (singleSP, $timeout) {
    return {
        replace: true,
        scope: true,
        template:''+
            '<div id="single-selector" class="popup" ng-show="show">' +
                '<header class="popup-header">' +
                    '<button class="blue fr" ng-click="_onConfirm();">完成</button>' +
                    '<button class="fl" ng-click="_onCancel();">取消</button>' +
                    '<div class="con">{{opts.title}}</div>' +
                '</header>' +
                '<div class="single selector-body single_selector_body">' +
                '<div class="reticle"></div>' +
                    '<ul class="level-1">' +
                    '<li ng-repeat="item in opts.data" ng-class="{\'active\':$index==0}" data-id="{{item.id}}" data-index="$index">{{item.name}}</li>' +
                    '</ul>' +
                '</div>' +
            '</div>',
        restrict: "EA",
        controller: ["$scope", "$element", function ($scope, $element) {
            function jumpTo(objList, h, state) {
                var maxHeight = -(objList.height() - 40);
                if(!state && maxHeight > h){
                    h = (h + maxHeight) / 2;
                }
                if(!state && h > 0){
                    h /= 2;
                }
                objList.data("offset", h).css({"-webkit-transform": "translateY(" + h + "px)","transform": "translateY(" + h + "px)"});
                return;
            }

            function getOffset(element) {
                return element.data("offset")
            }

            function setTransition(element) {
                element.css({"-webkit-transition": "all ease 0.2s", "transition": "all ease 0.2s"})
            }

            function removeTransition(element) {
                element.css({"-webkit-transition": "none", "transition": "none"})
            }

            function moveTo(status) {
                var range = status.now - status.start;
                objList.find("li").removeClass("active");
                jumpTo(objList, objList.data("startOffset") + range)
            }

            function unLockMove() {
                objList.stop();
                objList.data("start", !0);
                objList.data("startOffset", getOffset(objList))
            }

            function changeAct(objList, i, state) {
                i = Math.round(i / 40);
                if(!state){
                    setTransition(objList);
                }
                jumpTo(objList, 40 * i);
                if(!state){
                    $timeout(function () {
                        removeTransition(objList);
                        objList.find("li").removeClass("active").eq(-i).addClass("active");
                    }, 200);
                }
                if(state){
                    objList.find("li").removeClass("active").eq(-i).addClass("active");
                }
            }

            function lockMove(status) {
                objList.data("start", !1);
                var maxHeight = -(objList.height() - 40);
                var range = status.now - status.start;
                var rangeTime = +new Date - status.startTime;
                var time = (rangeTime + 100) / rangeTime;
                var offset = objList.data("startOffset") + range * time;
                if(offset>0){
                    changeAct(objList, 0);
                }else{
                    if(maxHeight > offset){
                        changeAct(objList, maxHeight);
                    }else{
                        changeAct(objList, offset);
                    }
                }
            }

            function init() {
                var val = $scope.opts.data[0] ? $scope.opts.data[0].id : null;
                var initVal = $scope.opts.initData || val;
                var objLi = objList.find("li[data-id=" + initVal + "]");
                if(!$element.length){
                    objLi = objList.find("li").eq(0);
                    initVal = val;
                }
                var targetNum = objLi.index();
                if("number" == typeof targetNum){
                    objList.find(".active").removeClass("active");
                    objLi.addClass("active");
                    jumpTo(objList, 40 * -targetNum, true);
                }
            }

            var obj = $element;
            var objBody = obj.find(".single_selector_body");
            var objList = obj.find(".level-1").data("offset", 0);
            var status = null;
            $scope.show = 0;
            $scope.opts = {};
            $scope.$on("single-show", function () {
                $scope.show = singleSP.shown;
                $scope.onConfirm = singleSP.onConfirm;
                $scope.onCancel = singleSP.onCancel;
                $scope.opts = singleSP.opts;
                obj.removeClass("show");
                obj.removeAttr("style");
                $timeout(function () {
                    init();
                }, 50);
                $timeout(function () {
                    obj.addClass("show")
                }, 100)
            });
            $scope.$on("single-hide", function () {
                obj.removeClass("show"), $timeout(function () {
                    $scope.show = 0
                }, 100)
            });
            $scope._onConfirm = function () {
                var val = objList.find(".active").data("id");
                singleSP.onConfirm(val)
            };
            $scope._onCancel = function () {
                singleSP.onCancel()
            };
            obj.on("touchmove", function (e) {
                e.preventDefault()
            });
            objBody.on("touchstart mousedown", function (e) {
                var eObj = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;
                status = {start: eObj.clientY, startTime: +new Date, now: eObj.clientY};
                unLockMove(status);
            }).on("touchend mouseup", function () {
                lockMove(status);
                status = null
            }).on("touchmove mousemove", function (e) {
                var eObj = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;
                if(status){
                    status.now = eObj.clientY;
                    moveTo(status);
                }
            })
        }]
    }
}])

//两级选择基础指令
LuckyUI.service("doubleSelectorPopup", ["$rootScope", "$q", "overlay", "$timeout", function ($rootScope, $q, overlay, $timeout) {
    //声明隐藏事件
    function hide() {
        overlay.hide();
        that.shown = 0;
        $rootScope.$broadcast("double-hide");
    }

    var deferred, that = this;
    this.shown = 0;
    this.opts = null;
    //显示
    this.show = function (val) {
        //创建promise对象
        deferred = $q.defer();
        overlay.show(that.hide);
        that.shown = 1;
        that.shown = 1;
        that.opts = $.extend({
            title: "双栏选择器",
            initData: null,
            getRightListData: function () {
            },
            data: []
        }, val);
        //创建显示事件
        $rootScope.$broadcast("double-show");
        return deferred.promise
    };
    //隐藏
    this.hide = function () {
        that.onCancel();
    };
    //确认
    this.onConfirm = function (val) {
        deferred && that.shown && (hide(), $timeout(function () {
            deferred.resolve(val);
        }))
    };
    //取消
    this.onCancel = function (val) {
        deferred && that.shown && (hide(), $timeout(function () {
            deferred.reject(val);
        }))
    }
}]).directive("doubleSelectorPopup", ["doubleSelectorPopup", "$timeout", function (doubleSP, $timeout) {
    return {
        replace: true,
        scope: true,
        template:''+
            '<div id="double-selector" class="popup" ng-show="show">' +
                '<header class="popup-header">' +
                    '<button class="blue fr" ng-click="_onConfirm();">完成</button>' +
                    '<button class="fl" ng-click="_onCancel();">取消</button>' +
                    '<div class="con">{{opts.title}}</div>' +
                '</header>' +
                '<div class="double selector-body double_selector_body">' +
                    '<div class="reticle"></div>' +
                    '<ul class="level-1">' +
                        '<li ng-repeat="item in opts.data" ng-class="{\'active\':$index==0}" data-id="{{item.id}}">{{item.name}}</li>' +
                    '</ul>' +
                    '<ul class="level-2">' +
                        '<li ng-repeat="item in currentLevel" ng-class="{\'active\':$index==0}" data-id="{{item.id}}">{{item.name}}</li>' +
                    '</ul>' +
                '</div>' +
            '</div>',
        restrict: "EA",
        controller: ["$scope", "$element", function ($scope, $element) {
            //滚动方法
            function jumpTo(objList, h, state) {
                var maxHeight = -(objList.height() - 40);
                if(!state && maxHeight > h){
                    h = (h + maxHeight) / 2;
                }
                if(!state && h > 0){
                    h /= 2
                }
                objList.data("offset", h).css({"-webkit-transform": "translateY(" + h + "px)","-transform": "translateY(" + h + "px)"})
                return true;
            }
            //基本的样式操作
            function getOffset(element) {
                return element.data("offset")
            }

            function setTransition(element) {
                element.css({"-webkit-transition": "all ease 0.2s", "transition": "all ease 0.2s"})
            }

            function removeTransition(element) {
                element.css({"-webkit-transition": "none", "transition": "none"})
            }
            //跳转到指定项
            function moveTo(status) {
                var range = status.now - status.start;
                var objList = 1 == status.side ? l1 : l2;
                objList.find("li").removeClass("active");
                jumpTo(objList, objList.data("startOffset") + range)
            }
            //解除锁定并纠正到目标位置
            function unlockMove(status) {
                var objList = 1 == status.side ? l1 : l2;
                objList.stop();
                objList.data("start", true);
                objList.data("startOffset", getOffset(objList))
            }

            //更换活动项
            function changeAct(objList, i, state) {
                i = Math.round(i / 40);
                if(!state){
                    setTransition(objList);
                }
                jumpTo(objList, 40 * i);
                if(!state){
                    $timeout(function () {
                        removeTransition(objList);
                        var b = objList.find("li").removeClass("active").eq(-i).addClass("active").data("id");
                        objList.hasClass("level-1") && resetL2(-i, b);
                    }, 200);
                }
                if(state){
                    objList.find("li").removeClass("active").eq(-i).addClass("active")
                }
            }

            function resetL2(a, b) {
                //重置二级项
                $scope.currentLevel = initDate(a, b);
                changeAct(l2, 0, true);
            }

            function initDate(a, b) {
                //初始化数据
                var d = $scope.opts.getRightListData(b);
                return d ? d : $scope.opts.data && $scope.opts.data[a] ? $scope.opts.data[a].data : null
            }
            //锁定当前滚动操作，开始对滚动进行操作
            function lockMove(status) {
                var objList = 1 == status.side ? l1 : l2;
                objList.data("start", false);
                var maxHeight = -(objList.height() - 40);
                var range = status.now - status.start;
                var rangeTime = +new Date - status.startTime;
                var time = (rangeTime + 100) / rangeTime
                var offset = objList.data("startOffset") + range * time;
                if(offset>0){
                    changeAct(objList, 0);
                }else{
                    if(maxHeight > offset){
                        changeAct(objList, maxHeight);
                    }else{
                        changeAct(objList, offset);
                    }
                }
            }

            //初始化组件
            function init() {
                var val = [$scope.opts.data[0].id, initDate(0, $scope.opts.data[0].id).id];
                var initVal = $scope.opts.initData || val;
                var actObj = l1.find("li[data-id=" + initVal[0] + "]");
                actObj.length || (actObj = l1.find("li").eq(0), initVal = val);
                var index = actObj.index();
                if ("number" == typeof index && index >= 0) {
                    l1.find(".active").removeClass("active");
                    var h = actObj.addClass("active").data("id");
                    jumpTo(l1, 40 * -index, !0), resetL2(index, h);
                    jumpTo(l2, 0, !0);
                    $timeout(function () {
                        var val = l2.find("li[data-id=" + initVal[1] + "]"), i = val.index();
                        "number" == typeof b && b >= 0 && (l2.find(".active").removeClass("active"),
                            val.addClass("active"),
                            jumpTo(l2, 40 * -i, !0));
                    }, 100)
                }
            }


            var obj = $element;
            var objBody = obj.find(".double_selector_body");
            var l1 = objBody.find(".level-1").data("offset", 0);
            var l2 = objBody.find(".level-2").data("offset", 0);
            var status = null;
            $scope.show = 0;
            $scope.opts = {};
            //下面是各种事件的回调
            $scope.$on("double-show", function () {
                $scope.show = doubleSP.shown;
                $scope.onConfirm = doubleSP.onConfirm;
                $scope.onCancel = doubleSP.onCancel
                $scope.opts = doubleSP.opts
                $scope.currentLevel = $scope.opts.data ? $scope.opts.data[0].data : null;
                obj.removeClass("show");
                obj.removeAttr("style");
                $timeout(function () {
                    init()
                }, 50), $timeout(function () {
                    obj.addClass("show")
                }, 100)
            });
            $scope.$on("double-hide", function () {
                obj.removeClass("show"), $timeout(function () {
                    $scope.show = 0
                }, 100)
            });
            $scope._onConfirm = function () {
                var b = [l1.find(".active").data("id"), l2.find(".active").data("id")];
                doubleSP.onConfirm(b)
            }, $scope._onCancel = function () {
                doubleSP.onCancel()
            };
            //滚动事件描述
            obj.on("touchmove", function (e) {
                e.preventDefault()
            });
            objBody.on("touchstart mousedown", function (e) {
                var b;
                var eObj = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;
                b = eObj.clientX < obj.width() / 2 ? 1 : 2;
                status = {
                    start: eObj.clientY,
                    startTime: +new Date,
                    side: b,
                    now: eObj.clientY
                };
                unlockMove(status);
            }).on("touchend mouseup", function () {
                lockMove(status);
                status = null
            }).on("touchmove mousemove", function (e) {
                var eObj = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;
                if(status){
                    status.now = eObj.clientY, moveTo(status);
                }
            })
        }]
    }
}]);

//单选指令再封装
LuckyUI.directive("selector", ["$timeout", "singleSelectorPopup", function (a, singleSP) {
    return {
        replace: true,
        scope: {value: "=", options: "=", name: "@", readonly:"@", index:"="},
        template: "<span class='selector' ng-click='showPopup();'>{{str}}</span>",
        restrict: "EA",
        controller: ["$scope", "$element", function ($scope) {
            var defaultOption = "请选择";
            if ($scope.readonly) {
                defaultOption = "";
            }
            function init(val) {
                var VALUE = defaultOption;
                return $scope.options && $scope.options.length && $.each($scope.options, function (index, b) {
                    b.id == val && (VALUE = b.name , $scope.index = index)
                }), VALUE
            }

            $scope.value = $scope.value || 0;
            $scope.str = init($scope.value);
            $scope.$watch(function () {
                return JSON.stringify([$scope.value, $scope.hide])
            }, function () {
                $scope.str = init($scope.value);
            });
            if(!$scope.readonly){
                $scope.showPopup = function () {
                    singleSP.show({title: $scope.name, initData: $scope.value, data: $scope.options}).then(function (val) {
                        $scope.value = val;
                    })
                }
            }
        }]
    }
}]);
var myCity;
/*
 //HTML
 <my-location-selector name="选择所在地区" error="error" require="0"></my-location-selector>
 <overlay></overlay>
 <triple-selector-popup></triple-selector-popup>

 //JS
 $scope.$on('luckyStr', function(e, data) {
 $scope.xx = data;//输入框的值
 });
 */
//地点三级联动扩展示例
LuckyUI.directive("myLocationSelector", ["tripleSelectorPopup", function (doubleSP) {
    return {
        replace: true,
        scope: {name: "@", error: "=", require: "@",readonly:"@"},
        template: '<span class="luckyselector location" ng-click="click();">{{str}}</span>',
        restrict: "E",
        controller: ["$rootScope", "$scope", "$element", "cm", function ($rootScope, $scope, $element, cm) {
            var that = this;
            //TODO $rootScope.choseAdd
            if ($rootScope.choseAdd) {
                $(".luckyselector").removeClass("location");
            }
            var defaultOption = $rootScope.choseAdd || "请选择";
            $rootScope.choseAdd = null;
            if ($scope.readonly) {
                defaultOption = "";
            }
            that.getLocationName = function (pName, cName, dName, cityObj) {
                function f(a, b, c) {
                    return a + " " + b + " " + c;
                }
                var g = cityObj || defaultOption;
                return "" == pName ? g : f(pName, cName, dName);
            }

            function e(a, b, c) {
                return that.getLocationName(a, b, c);
            }

            function f() {
                var a = $scope.name, b = {status: !1, desc: ""};
                return parseInt($scope.require, 10) && 0 == $scope.pid && (b.status = true, b.desc = "请选择" + a), b
            }
            var g;
            var url="jsonData/cityData.json";
            cm.get({
                loadingText : '加载中...',
                url: url,
                params: {},
                data: null
            }).then(function(res){
                g = window.myCity = res;
            });

            $scope.pName = $scope.pName || "";
            $scope.cName = $scope.cName || "";
            $scope.dName = $scope.dName || "";
            $scope.str = e($scope.pName, $scope.cName, $scope.dName);
            if (!$scope.readonly) {
                $scope.click = function () {
                    doubleSP.show({
                        title: $scope.name,
                        initData: [$scope.pName, $scope.cName, $scope.dName],
                        data: g
                    }).then(function (a) {
                        $scope.pName = a[0], $scope.cName = a[1], $scope.dName = a[2];
                    });
                };
            }
            $scope.$watch(function () {
                return $scope.pName + "-" + $scope.cName + "-" + $scope.dName;
            }, function () {
                $scope.str = e($scope.pName, $scope.cName, $scope.dName), $scope.error && ($scope.error[$scope.name] = f());
                $scope.$emit('luckyStr', $scope.str);
            });
        }]
    };
}]);
//三级选择基础指令
LuckyUI.service("tripleSelectorPopup", ["$rootScope", "$q", "overlay", "$timeout", function ($rootScope, $q, overlay, $timeout) {
    //声明隐藏事件
    function hide() {
        overlay.hide();
        that.shown = 0;
        $rootScope.$broadcast("triple-hide");
    }

    var deferred, that = this;
    this.shown = 0;
    this.opts = null;
    //显示
    this.show = function (val) {
        //创建promise对象
        deferred = $q.defer();
        overlay.show(that.hide);
        that.shown = 1;
        that.shown = 1;
        that.opts = $.extend({
            title: "三栏选择器",
            initData: null,
            getRightListData: function () {
            },
            data: {}
        }, val);
        //创建显示事件
        $rootScope.$broadcast("triple-show");
        return deferred.promise
    };
    //隐藏
    this.hide = function () {
        that.onCancel();
    };
    //确认
    this.onConfirm = function (val) {
        deferred && that.shown && (hide(), $timeout(function () {
            deferred.resolve(val);
        }));
        $(".luckyselector").removeClass("location");
    };
    //取消
    this.onCancel = function (val) {
        deferred && that.shown && (hide(), $timeout(function () {
            deferred.reject(val);
        }))
    }
}]).directive("tripleSelectorPopup", ["tripleSelectorPopup", "$timeout", function (doubleSP, $timeout) {
    return {
        replace: true,
        scope: true,
        template:''+
            '<div id="triple-selector" class="luckypopup" ng-show="show">' +
            '<header class="popup-header">' +
            '<button class="blue fr" ng-click="_onConfirm();">确认</button>' +
            '<button class="fl" ng-click="_onCancel();">取消</button>' +
            '<div class="con">{{opts.title}}</div>' +
            '</header>' +
            '<div class="triple selector-body triple_selector_body">' +
            '<div class="reticle"></div>' +
            '<ul class="level-1">' +
            '<li ng-repeat="item in pOpts" ng-class="{\'active\':$index==0,\'unactive_3\':$index==1,\'unactive_4\':$index==2 || $index==3,\'unactive_5\':$index==4}" data-pName="{{item}}">{{item}}</li>' +
            '</ul>' +
            '<ul class="level-2">' +
            '<li ng-repeat="item in cOpts" ng-class="{\'active\':$index==0,\'unactive_3\':$index==1,\'unactive_4\':$index==2 || $index==3,\'unactive_5\':$index==4}" data-cName="{{item}}">{{item}}</li>' +
            '</ul>' +
            '<ul class="level-3">' +
            '<li ng-repeat="item in dOpts" ng-class="{\'active\':$index==0,\'unactive_3\':$index==1,\'unactive_4\':$index==2 || $index==3,\'unactive_5\':$index==4}" data-dName="{{item}}">{{item}}</li>' +
            '</ul>' +
            '</div>' +
            '</div>',
        restrict: "EA",
        controller: ["$scope", "$element", "cm", function ($scope, $element, cm) {
            var HEIGHT = 30;
            var obj = $($element);
            var objBody = obj.find(".triple_selector_body");
            var l1 = objBody.find(".level-1").data("offset", 0);
            var l2 = objBody.find(".level-2").data("offset", 0);
            var l3 = objBody.find(".level-3").data("offset", 0);
            var status = null;
            $scope.show = 0;
            $scope.opts = {};
            var url="jsonData/cityData.json";
            cm.get({
                loadingText : '加载中...',
                url: url,
                params: {},
                data: null
            }).then(function(res){
                $scope.Opts = res;
            });
            //三级联动初始化
            $scope.pOpts = [];
            $scope.cOpts = [];
            $scope.dOpts = [];
            //滚动方法
            function jumpTo(objList, h, state) {
                var maxHeight = -(objList.height() - HEIGHT);
                if(!state && maxHeight > h){
                    h = (h + maxHeight) / 2;
                }
                if(!state && h > 0){
                    h /= 2
                }
                objList.data("offset", h).css({"-webkit-transform": "translateY(" + h + "px)","-transform": "translateY(" + h + "px)"})
                return true;
            }
            //基本的样式操作
            function getOffset(element) {
                return element.data("offset")
            }

            function setTransition(element) {
                element.css({"-webkit-transition": "all ease 0.2s", "transition": "all ease 0.2s"})
            }

            function removeTransition(element) {
                element.css({"-webkit-transition": "none", "transition": "none"})
            }
            //跳转到指定项
            function moveTo(status) {
                var range = status.now - status.start;
                var objList = 1 == status.side
                    ? l1 : 2 == status.side
                    ? l2 : l3;
                objList.find("li").removeClass("active unactive_0 unactive_1 unactive_2 unactive_3 unactive_4 unactive_5");
                jumpTo(objList, objList.data("startOffset") + range)
            }
            //解除锁定并纠正到目标位置
            function unlockMove(status) {
                var objList = 1 == status.side
                    ? l1 : 2 == status.side
                    ? l2 : l3;
                objList.stop();
                objList.data("start", true);
                objList.data("startOffset", getOffset(objList))
            }

            //更换活动项
            function changeAct(objList, i, code, state) {
                i = Math.round(i / HEIGHT);
                if(!state){
                    setTransition(objList);
                }
                jumpTo(objList, HEIGHT * i);
                if(!state){
                    var _ob = objList.find("li").removeClass("active unactive_0 unactive_1 unactive_2 unactive_3 unactive_4 unactive_5");
                    _ob.eq(-i + 1).addClass("unactive_3");
                    _ob.eq(-i - 1).addClass("unactive_0");
                    _ob.eq(-i + 2).addClass("unactive_4");
                    _ob.eq(-i - 2).addClass("unactive_0");
                    _ob.eq(-i + 3).addClass("unactive_5");
                    var b = objList.find("li").removeClass("active").eq(-i).addClass("active").attr("data-" + code);
                    objList.hasClass("level-1") && resetL2(-i, b);
                    objList.hasClass("level-2") && resetL3(-i, b);
                    $timeout(function () {
                        removeTransition(objList);
                    }, 200);
                }
                if(state){
                    objList.find("li").removeClass("active").eq(-i).addClass("active")
                }
            }

            function resetL2(a, b) {
                //重置二级项
                $scope.cOpts = initDate(b, "c");
                changeAct(l2, 0, "cName", true);
            }

            function resetL3(a, b) {
                //重置三级项
                $scope.dOpts = initDate(b, "d");
                changeAct(l3, 0, "dName", true);
            }

            var initDate = _initDate();
            function _initDate() {
                //初始化数据
                var _p = "北京市", _c;
                return function (b, flg) {
                    var _arr = [];
                    if (flg === "c") {
                        _p = b;
                        angular.forEach($scope.Opts[_p], function (value, key) {
                            _arr.push(key);
                        });
                        resetL3(0, _arr[0]);
                        return _arr;
                    } else if (flg === "d") {
                        _c = b;
                        return angular.forEach($scope.Opts[_p][_c], function (value, key) {
                            _arr.push(value);
                        }) && _arr;
                    }
                };
            };
            //锁定当前滚动操作，开始对滚动进行操作
            function lockMove(status) {
                var objList = 1 == status.side
                    ? l1 : 2 == status.side
                    ? l2 : l3;
                var code = status.side == 1
                    ? "pName" : status.side ==2
                    ? "cName" : "dName";
                objList.data("start", false);
                var maxHeight = -(objList.height() - HEIGHT);
                var range = status.now - status.start;
                var rangeTime = +new Date - status.startTime;
                var time = (rangeTime + 100) / rangeTime
                var offset = objList.data("startOffset") + range * time;
                if(offset>0){
                    changeAct(objList, 0, code);
                }else{
                    if(maxHeight > offset){
                        changeAct(objList, maxHeight, code);
                    }else{
                        changeAct(objList, offset, code);
                    }
                }
            }

            //初始化组件
            function init() {
                if ($scope.pOpts.length <= 0) {
                    angular.forEach(myCity, function (value, key) {
                        $scope.pOpts.push(key);
                    });
                }
                !$scope.cOpts.length && $scope.cOpts.push("北京市");
                !$scope.dOpts.length && ($scope.dOpts = myCity["北京市"]["北京市"]);
            };

            //下面是各种事件的回调
            $scope.$on("triple-show", function () {
                $scope.show = doubleSP.shown;
                $scope.onConfirm = doubleSP.onConfirm;
                $scope.onCancel = doubleSP.onCancel
                $scope.opts = doubleSP.opts
                obj.removeClass("show");
                obj.removeAttr("style");
                $timeout(function () {
                    init()
                }, 50), $timeout(function () {
                    obj.addClass("show")
                }, 100)
            });
            $scope.$on("triple-hide", function () {
                obj.removeClass("show"), $timeout(function () {
                    $scope.show = 0
                }, 100)
            });
            $scope._onConfirm = function () {
                var b = [l1.find(".active").attr("data-pName"), l2.find(".active").attr("data-cName"), l3.find(".active").attr("data-dName")];
                doubleSP.onConfirm(b);
            }, $scope._onCancel = function () {
                doubleSP.onCancel();
                $scope.pOpts = [];
                $scope.cOpts = [];
                $scope.dOpts = [];
                angular.forEach(myCity, function (value, key) {
                    $scope.pOpts.push(key);
                });
                $scope.cOpts.push("北京市");
                $scope.dOpts = myCity["北京市"]["北京市"]
                l1.find(".active").removeClass("active");
                l2.find(".active").removeClass("active");
                l3.find(".active").removeClass("active");
                l1.find("li").eq(0).addClass("active");
                l2.find("li").eq(0).addClass("active");
                l3.find("li").eq(0).addClass("active");
                jumpTo(l1, 0, !0);
                jumpTo(l2, 0, !0);
                jumpTo(l3, 0, !0);
            };
            //滚动事件描述
            obj.on("touchmove", function (e) {
                e.preventDefault()
            });
            objBody.on("touchstart mousedown", function (e) {
                var b;
                var eObj = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;
                b = eObj.clientX < obj.width() / 3
                    ? 1 : eObj.clientX < obj.width() / 3 * 2
                    ? 2 : 3;
                status = {
                    start: eObj.clientY,
                    startTime: +new Date,
                    side: b,
                    now: eObj.clientY
                };
                unlockMove(status);
            }).on("touchend mouseup", function () {
                lockMove(status);
                status = null
            }).on("touchmove mousemove", function (e) {
                var eObj = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;
                if(status){
                    status.now = eObj.clientY, moveTo(status);
                }
            })
        }]
    }
}]);

//日期三级联动扩展示例
LuckyUI.directive("myDateSelector", ["dateTripleSelectorPopup", function (doubleSP) {
    return {
        replace: true,
        scope: {name: "@", error: "=", require: "@",readonly:"@"},
        template: '<span class="luckyselector" ng-click="click();">{{str}}</span>',
        restrict: "E",
        controller: ["$scope", "$element", "$rootScope", function ($scope, $element, $rootScope) {
            var that = this;
            var defaultOption = $rootScope.birthDate || "1990-01-01";
            $rootScope.birthDate = null;
            if ($scope.readonly) {
                defaultOption = "";
            }
            that.getLocationName = function (yName, mName, dName, cityObj) {
                function f(a, b, c) {
                    b = b.slice(0, -1);
                    c = c.slice(0, -1);
                    return a.slice(0, -1) + "-" + (b.length > 1 ? b : "0" + b) + "-" + (c.length > 1 ? c : "0" + c);
                }
                var g = cityObj || defaultOption;
                return "" == yName ? g : f(yName, mName, dName);
            }

            function e(a, b, c) {
                return that.getLocationName(a, b, c);
            }

            function f() {
                var a = $scope.name, b = {status: !1, desc: ""};
                return parseInt($scope.require, 10) && 0 == $scope.pid && (b.status = true, b.desc = "请选择" + a), b
            }
            //{[], [], []}
            function createDate (end) {
                var _start = +end - 100,
                    _arr = [], _year = [],
                    _month = [], _day = [];
                for ( ; end >= _start; end -= 1) {
                    _year.push(end + "年");
                }
                for (var i = 1; i <= 12; i += 1) {
                    _month.push(i + "月");
                }
                for (var j = 1; j <= 31; j += 1) {
                    _day.push(j + "日");
                }
                return {
                    year : _year,
                    month : _month,
                    day : _day
                };
            }
            var nowYear = (new Date()).getFullYear();
            window.myDate = createDate(nowYear);
            var g = window.myDate;
            $scope.yName = $scope.yName || "";
            $scope.mName = $scope.mName || "";
            $scope.dName = $scope.dName || "";
            $scope.str = e($scope.yName, $scope.mName, $scope.dName);
            if (!$scope.readonly) {
                $scope.click = function () {
                    doubleSP.show({
                        title: $scope.name,
                        initData: [$scope.yName, $scope.mName, $scope.dName],
                        data: g
                    }).then(function (a) {
                        $scope.yName = a[0], $scope.mName = a[1], $scope.dName = a[2];
                    });
                };
            }
            $scope.$watch(function () {
                return $scope.yName + "-" + $scope.mName + "-" + $scope.dName;
            }, function () {
                $scope.str = e($scope.yName, $scope.mName, $scope.dName), $scope.error && ($scope.error[$scope.name] = f());
                $scope.$emit('luckyDateStr', $scope.str);
            });
        }]
    };
}]);
//三级选择基础指令
LuckyUI.service("dateTripleSelectorPopup", ["$rootScope", "$q", "overlay", "$timeout", function ($rootScope, $q, overlay, $timeout) {
    //声明隐藏事件
    function hide() {
        overlay.hide();
        that.shown = 0;
        $rootScope.$broadcast("triple-hide");
    }

    var deferred, that = this;
    this.shown = 0;
    this.opts = null;
    //显示
    this.show = function (val) {
        //创建promise对象
        deferred = $q.defer();
        overlay.show(that.hide);
        that.shown = 1;
        that.shown = 1;
        that.opts = $.extend({
            title: "三栏选择器",
            initData: null,
            getRightListData: function () {
            },
            data: {}
        }, val);
        //创建显示事件
        $rootScope.$broadcast("triple-show");
        return deferred.promise
    };
    //隐藏
    this.hide = function () {
        that.onCancel();
    };
    //确认
    this.onConfirm = function (val) {
        deferred && that.shown && (hide(), $timeout(function () {
            deferred.resolve(val);
        }));
    };
    //取消
    this.onCancel = function (val) {
        deferred && that.shown && (hide(), $timeout(function () {
            deferred.reject(val);
        }))
    }
}]).directive("dateTripleSelectorPopup", ["dateTripleSelectorPopup", "$timeout", function (doubleSP, $timeout) {
    return {
        replace: true,
        scope: true,
        template:''+
            '<div id="triple-selector" class="luckypopup" ng-show="show">' +
            '<header class="popup-header">' +
            '<button class="blue fr" ng-click="_onConfirm();">确认</button>' +
            '<button class="fl" ng-click="_onCancel();">取消</button>' +
            '<div class="con">{{opts.title}}</div>' +
            '</header>' +
            '<div class="triple selector-body triple_selector_body date_selector_body">' +
            '<div class="reticle"></div>' +
            '<ul class="level-1">' +
            '<li ng-repeat="item in yOpts" ng-class="{\'active\':$index==0,\'unactive_3\':$index==1,\'unactive_4\':$index==2 || $index==3,\'unactive_5\':$index==4}" data-yName="{{item}}">{{item}}</li>' +
            '</ul>' +
            '<ul class="level-2">' +
            '<li ng-repeat="item in mOpts" ng-class="{\'active\':$index==0,\'unactive_3\':$index==1,\'unactive_4\':$index==2 || $index==3,\'unactive_5\':$index==4}" data-mName="{{item}}">{{item}}</li>' +
            '</ul>' +
            '<ul class="level-3">' +
            '<li ng-repeat="item in dOpts" ng-class="{\'active\':$index==0,\'unactive_3\':$index==1,\'unactive_4\':$index==2 || $index==3,\'unactive_5\':$index==4}" data-dName="{{item}}">{{item}}</li>' +
            '</ul>' +
            '</div>' +
            '</div>',
        restrict: "EA",
        controller: ["$scope", "$element", function ($scope, $element) {
            var HEIGHT = 30;
            //滚动方法
            function jumpTo(objList, h, state) {
                var maxHeight = -(objList.height() - HEIGHT);
                if(!state && maxHeight > h){
                    h = (h + maxHeight) / 2;
                }
                if(!state && h > 0){
                    h /= 2
                }
                objList.data("offset", h).css({"-webkit-transform": "translateY(" + h + "px)","-transform": "translateY(" + h + "px)"})
                return true;
            }
            //基本的样式操作
            function getOffset(element) {
                return element.data("offset")
            }

            function setTransition(element) {
                element.css({"-webkit-transition": "all ease 0.2s", "transition": "all ease 0.2s"})
            }

            function removeTransition(element) {
                element.css({"-webkit-transition": "none", "transition": "none"})
            }
            //跳转到指定项
            function moveTo(status) {
                var range = status.now - status.start;
                var objList = 1 == status.side
                    ? l1 : 2 == status.side
                    ? l2 : l3;
                objList.find("li").removeClass("active unactive_0 unactive_1 unactive_2 unactive_3 unactive_4 unactive_5");
                jumpTo(objList, objList.data("startOffset") + range)
            }
            //解除锁定并纠正到目标位置
            function unlockMove(status) {
                var objList = 1 == status.side
                    ? l1 : 2 == status.side
                    ? l2 : l3;
                objList.stop();
                objList.data("start", true);
                objList.data("startOffset", getOffset(objList))
            }

            //更换活动项
            function changeAct(objList, i, code, state) {
                i = Math.round(i / HEIGHT);
                if(!state){
                    setTransition(objList);
                }
                jumpTo(objList, HEIGHT * i);
                if(!state){
                    var _ob = objList.find("li").removeClass("active unactive_0 unactive_1 unactive_2 unactive_3 unactive_4 unactive_5");
                    _ob.eq(-i + 1).addClass("unactive_3");
                    _ob.eq(-i - 1).addClass("unactive_0");
                    _ob.eq(-i + 2).addClass("unactive_4");
                    _ob.eq(-i - 2).addClass("unactive_0");
                    _ob.eq(-i + 3).addClass("unactive_5");
                    var b = objList.find("li").removeClass("active").eq(-i).addClass("active").attr("data-" + code);
                    objList.hasClass("level-1") && resetL2(b);
                    objList.hasClass("level-2") && resetL3(b);
                    $timeout(function () {
                        removeTransition(objList);
                    }, 200);
                }
                if(state){
                    objList.find("li").removeClass("active unactive_0 unactive_1 unactive_2 unactive_3 unactive_4 unactive_5").eq(-i).addClass("active")
                }
            }

            function resetL2(b) {
                //重置二级项
                initDate(b, "y") && ($scope.dOpts = initDate(b, "y"));
            }

            function resetL3(b) {
                //重置三级项
                $scope.dOpts = initDate(b, "d");
            }

            function isLeapYear(year) {
                return (year % 4 == 0 && year % 100 != 0)
                    || (year % 100 == 0 && year % 400 == 0);
            }

            var initDate = _initDate();
            function _initDate() {
                //初始化数据
                var _now = new Date(),
                    _nowYear = _now.getFullYear(),
                    _nowMonth = _now.getMonth(),
                    _nowDay = _now.getDate(),
                    _y = _nowYear + "年",
                    _yNum = _nowYear,
                    _index = 0,
                    _tinyMonth = [4, 6, 9, 11],
                    _m, _mNum = myDate.month,
                    _dNum = myDate.day;
                return function (b, flg) {
                    var _d,
                        index = +l3.find(".active").attr("data-dName").slice(0, -1) - 1;
                    if (flg === "y") {
                        _y = b;
                        _yNum = +b.slice(0, -1);
                        if (_yNum == _nowYear) {
                            if (_m > _nowMonth + 1) {
                                changeAct(l2, 0, "cName", true);
                            }
                            $scope.mOpts = _mNum.slice(0, _nowMonth + 1);
                            if (_tinyMonth.indexOf(_m) > -1) {
                                $scope.dOpts = _dNum.slice(0, -1);
                            } else {
                                $scope.dOpts = _dNum;
                            }
                        } else {
                            if (_m == _nowMonth + 1) {
                                if (_tinyMonth.indexOf(_m) > -1) {
                                    $scope.dOpts = _dNum.slice(0, -1);
                                } else {
                                    $scope.dOpts = _dNum;
                                }
                            }
                            $scope.mOpts = _mNum;
                            if (_m == 2) {
                                if (isLeapYear(_yNum)) {
                                    _d = _dNum.slice(0, -2);
                                    if (index >= 29) {
                                        changeAct(l3, -28 * HEIGHT, "dName", true);
                                    }
                                } else {
                                    _d = _dNum.slice(0, -3);
                                    if (index >= 28) {
                                        changeAct(l3, -27 * HEIGHT, "dName", true);
                                    }
                                }
                                return _d;
                            }
                        }
                        return false;
                    } else if (flg === "d") {
                        b = +b.slice(0, -1);
                        _m = b;
                        if (_yNum == _nowYear && b == _nowMonth + 1) {
                            _d = _dNum.slice(0, _nowDay);
                            changeAct(l3, -(_nowDay - 1) * HEIGHT, "dName", true);
                        } else {
                            if (b == 2) {
                                if (isLeapYear(_yNum)) {
                                    _d = _dNum.slice(0, -2);
                                    if (index >= 29) {
                                        changeAct(l3, -28 * HEIGHT, "dName", true);
                                    }
                                } else {
                                    _d = _dNum.slice(0, -3);
                                    if (index >= 28) {
                                        changeAct(l3, -27 * HEIGHT, "dName", true);
                                    }
                                }
                            } else if (_tinyMonth.indexOf(b) > -1) {
                                _d = _dNum.slice(0, -1);
                                if (index >= 30) {
                                    changeAct(l3, -29 * HEIGHT, "dName", true);
                                }
                            } else {
                                _d = _dNum;
                            }
                        }
                        return _d;
                    }
                };
            };
            //锁定当前滚动操作，开始对滚动进行操作
            function lockMove(status) {
                var objList = 1 == status.side
                    ? l1 : 2 == status.side
                    ? l2 : l3;
                var code = status.side == 1
                    ? "yName" : status.side ==2
                    ? "mName" : "dName";
                objList.data("start", false);
                var maxHeight = -(objList.height() - HEIGHT);
                var range = status.now - status.start;
                var rangeTime = +new Date - status.startTime;
                var time = (rangeTime + 100) / rangeTime
                var offset = objList.data("startOffset") + range * time;
                if(offset>0){
                    changeAct(objList, 0, code);
                }else{
                    if(maxHeight > offset){
                        changeAct(objList, maxHeight, code);
                    }else{
                        changeAct(objList, offset, code);
                    }
                }
            }

            //初始化组件
            function init() {
                var _now = new Date(),
                    _nowYear = _now.getFullYear(),
                    _nowMonth = _now.getMonth(),
                    _nowDay = _now.getDate();
                $scope.yOpts = myDate.year;
                $scope.mOpts = myDate.month.slice(0);
                $scope.dOpts = myDate.day;
                !$scope.initYear ? setTimeout(function () {
                    changeAct(l1, -(_nowYear - 1990) * HEIGHT, "yName", true);
                    $scope.initYear = true;
                }) : null;
            };


            var obj = $($element);
            var objBody = obj.find(".triple_selector_body");
            var l1 = objBody.find(".level-1").data("offset", 0);
            var l2 = objBody.find(".level-2").data("offset", 0);
            var l3 = objBody.find(".level-3").data("offset", 0);
            var status = null;
            $scope.show = 0;
            $scope.opts = {};

            //三级联动初始化
            $scope.Opts = myCity;
            $scope.yOpts = [];
            $scope.mOpts = [];
            $scope.dOpts = [];
            $scope.initYear = false;//默认设置1991

            //下面是各种事件的回调
            $scope.$on("triple-show", function () {
                $scope.show = doubleSP.shown;
                $scope.onConfirm = doubleSP.onConfirm;
                $scope.onCancel = doubleSP.onCancel
                $scope.opts = doubleSP.opts
                obj.removeClass("show");
                obj.removeAttr("style");
                $timeout(function () {
                    init()
                }, 50), $timeout(function () {
                    obj.addClass("show")
                }, 100)
            });
            $scope.$on("triple-hide", function () {
                obj.removeClass("show"), $timeout(function () {
                    $scope.show = 0
                }, 100)
            });
            $scope._onConfirm = function () {
                var b = [l1.find(".active").attr("data-yName"), l2.find(".active").attr("data-mName"), l3.find(".active").attr("data-dName")];
                doubleSP.onConfirm(b);
            }, $scope._onCancel = function () {
                doubleSP.onCancel();
                l1.find(".active").removeClass("active");
                l2.find(".active").removeClass("active");
                l3.find(".active").removeClass("active");
                l1.find("li").eq(0).addClass("active");
                l2.find("li").eq(0).addClass("active");
                l3.find("li").eq(0).addClass("active");
                jumpTo(l1, 0, !0);
                jumpTo(l2, 0, !0);
                jumpTo(l3, 0, !0);
            };
            //滚动事件描述
            obj.on("touchmove", function (e) {
                e.preventDefault()
            });
            objBody.on("touchstart mousedown", function (e) {
                var b;
                var eObj = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;
                b = eObj.clientX < obj.width() / 3
                    ? 1 : eObj.clientX < obj.width() / 3 * 2
                    ? 2 : 3;
                status = {
                    start: eObj.clientY,
                    startTime: +new Date,
                    side: b,
                    now: eObj.clientY
                };
                unlockMove(status);
            }).on("touchend mouseup", function () {
                lockMove(status);
                status = null
            }).on("touchmove mousemove", function (e) {
                var eObj = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;
                if(status){
                    status.now = eObj.clientY, moveTo(status);
                }
            })
        }]
    }
}]);
orderDirectives
    .directive('dpFlight', function () {
        return {
            restrict: "EA",
            templateUrl: "./templates/directive/datePickerFlight.tpl.html",
            replace: true,
            transclude: true,
            scope: {
                dpConfig: '=dpConfig'
            },
            require: ['dpFlight'],
            controller: 'DPFlightController',
            controllerAs: 'DPFlightController'
        }
    }).controller('DPFlightController', ['$scope', '$element', '$http', '$log', '$cacheFactory', '$location','cm', function ($scope, $element, $http, $log, $cacheFactory, $location,cm) {

    var self = this,
        weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        monthDay = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        beginDateArr,
        endDateArr,
        beginDateStr,
        endDateStr,
        renderEndDateArr,
        renderMonthCount,
        datePriceList,
        serverTime,
        isInit = true,
        backDateStep = 2,
        dateObjList = [],
        requestUrl = $scope.dpConfig.url,
        title = $scope.dpConfig.title;

    var cnText = {
        goTripTitle: '出发日期',
        backTripTitle: '返回日期',
        goDatePriceTitle: '低价日历',
        backDatePriceTitle: '低价日历'
    };

    self.goTripDateArr = null;
    self.backTripDateArr = null;
    self.dateType = null;
    self.renderType = null;
    self.title = '';
    self.initDateObj = null;
    self.lastPriceDateObj = null;
    self.depart = $scope.dpConfig.depart;
    self.dest = $scope.dpConfig.dest;
    /*if (Mock.Random) {
     var dataTemplate = {
     'code|1-10': 1,
     'data|30': [
     {
     'deptDate': '@DATE',
     'flightNO': 'MH370',
     'seatCode|4': '1',
     'parPrice|100-2000': 100
     }
     ]
     };

     var MockData = Mock.mock(dataTemplate);
     }*/


    self.init = function (isOpen) {
        self.dateArray = [];

        //请求服务器数据,得到90天日期价格
        if (isInit) {
            var promise = self.requestData();
            promise.success(function () {
                self.initialize(isOpen);
            });
        } else {
            self.initialize(isOpen);
        }
    };

    self.initialize = function (isOpen) {
        //当前日期
        beginDateArr = self.getBeginDate();
        beginDateStr = self.getFormatDate(beginDateArr);
        //当前日期+90天=结束日期
        endDateArr = self.getEndDate();
        endDateStr = self.getFormatDate(endDateArr);
        //初始化页面显示的日期（明天）
        renderMonthCount = self.getRenderMonthCount();
        //渲染的结束日期(渲染12个月的日期)
        renderEndDateArr = self.getRenderEndDate();
        //设置日期控件头部文字
        self.setTitle();
        //渲染日期
        self.renderDate();
        if (isInit) {
            self.initDate();
        } else {
            self.open = isOpen;
        }
    };

    /**
     * @description 初始化页面日期，始终为明天，刷新页面才执行，以后再进入日期控件，不在执行
     */
    self.initDate = function () {
        //$log.info('初始化日期');
        self.emitSelectDateEvent(self.initDateObj);
        //默认隐藏日期控件
        self.open = false;
    };

    /**
     * @description 设置日期控件头部文字
     */
    self.setTitle = function () {
        self.title = title;
    };

    /**
     * @description 根据dateType和renderType来设置日期控件要渲染的月份数量
     *              如果用户打开的是“去程日期”或者“返程日期”，则渲染12个月
     *              如果用户打开的是“低价日历”，则渲染有价格的天数所在的月份
     * @returns {*} 渲染的月份数量
     */
    self.getRenderMonthCount = function () {
        var dateType = self.dateType,
            renderType = self.renderType;

        if (isInit || ((dateType === 'goTrip' || dateType === 'backTrip') && !renderType)) {
            renderMonthCount = 13;
        }
        if (renderType) {
            renderMonthCount = (endDateArr[0] - beginDateArr[0]) * 12 + (endDateArr[1] - beginDateArr[1]) + 1;
        }
        renderMonthCount = 13;
        return renderMonthCount;
    };


    /**
     * @description 访问价格日期接口，取得价格日期数据
     * @returns {*}
     */
    self.requestData = function () {
        var promise = $http({
            method: 'get',
            url: requestUrl,
            params: {
                startDate: beginDateStr,
                endDate: endDateStr
            },
            cache: true
        });
        promise.success(function (data, status, headers) {
            if (data.data) {
                datePriceList = data.data;
            } else{
                datePriceList = [];
            }

            serverTime = headers('date') || Date.now();
        });
        promise.error(function (data, status, headers) {

        });
        return promise;
    };

    $scope.$on('openGoTripDatePicker', function (e, data) {
        self.openDatePicker(e, data, true);
        self.renderType = null;
    });

    $scope.$on('openBackTripDatePicker', function (e, data) {
        self.openDatePicker(e, data, true);
        self.renderType = null;
    });

    $scope.$on('openGoDatePricePicker', function (e, data) {
        self.openDatePicker(e, data, true);
    });

    $scope.$on('openBackDatePricePicker', function (e, data) {
        self.openDatePicker(e, data, true);
    });

    $scope.$on('prevDay', function (e, data) {
        $log.info('前一天');
        self.openDatePicker(e, data, false);
        if (self.dateType === 'goTrip') {
            self.goTripPrevDay();
        }
        if (self.dateType === 'backTrip') {
            self.backTripPrevDay();
        }

    });

    $scope.$on('nextDay', function (e, data) {
        $log.info('后一天');
        self.openDatePicker(e, data, false);
        if (self.dateType === 'goTrip') {
            self.goTripNextDay();
        }
        if (self.dateType === 'backTrip') {
            self.backTripNextDay();
        }
    });

    //去程-前一天
    self.goTripPrevDay = function () {
        var goDateInfo = self.getStorageGoDateInfo(),
            goDateObj = goDateInfo.curDateObj,
            goDateArr = goDateObj.dateArr,
            isToday,
            preDateObj;
        isToday = !self.dateCompare(beginDateArr, goDateArr);
        if (isToday) {
            return;
        }
        preDateObj = self.getPrevDateObj(goDateObj);
        self.emitSelectDateEvent(preDateObj);
    };

    //去程-后一天
    self.goTripNextDay = function () {
        var goDateInfo = self.getStorageGoDateInfo(),
            goDateObj = goDateInfo.curDateObj,
            goDateArr = goDateObj.dateArr,
            lastPriceDateObj = self.lastPriceDateObj,
            isLastPriceDay,
            nextDateObj;
        isLastPriceDay = !self.dateCompare(goDateArr, lastPriceDateObj.dateArr);
        if (isLastPriceDay) {
            return;
        }
        nextDateObj = self.getNextDateObj(goDateObj);
        self.emitSelectDateEvent(nextDateObj);
    };

    //返程-前一天
    self.backTripPrevDay = function () {
        var backDateInfo = self.getStorageBackDateInfo(),
            goDateInfo = self.getStorageGoDateInfo(),
            backDateObj = backDateInfo.curDateObj,
            goDateObj = goDateInfo.curDateObj,
            isEqualGoDate,
            preDateObj;
        isEqualGoDate = backDateObj.index === (goDateObj.index + 1);
        if (isEqualGoDate) {
            return;
        }
        preDateObj = self.getPrevDateObj(backDateObj);
        self.emitSelectDateEvent(preDateObj);
    };

    //返程-后一天
    self.backTripNextDay = function () {
        var backDateInfo = self.getStorageBackDateInfo(),
            backDateObj = backDateInfo.curDateObj,
            isEqualLastPriceDay,
            lastPriceDateObj = self.lastPriceDateObj,
            nextDateObj;
        isEqualLastPriceDay = !self.dateCompare(backDateObj.dateArr, lastPriceDateObj.dateArr);
        if (isEqualLastPriceDay) {
            return;
        }

        nextDateObj = self.getNextDateObj(backDateObj);
        self.emitSelectDateEvent(nextDateObj);
    };

    /**
     * @description 打开去程，返程日期控件公共函数
     * @param e
     * @param data 由父级controller传递过来的数据
     * @param isOpen 是否打开，前一天，后一天的事件不打开日期控件
     */
    self.openDatePicker = function (e, data, isOpen) {
        self.open = isOpen;
        if (angular.isObject(data)) {
            if (angular.isString(data.dateType)) {
                self.dateType = data.dateType;
            }
            if (angular.isString(data.renderType)) {
                self.renderType = data.renderType;
            }
        }
        self.init(isOpen);
    };

    /**
     * @description 隐藏日期控件
     */
    self.closeDatePicker = function (path) {
        path && $location.path(path);
        self.open = false;
        isInit = false;
        $scope.$emit('closeDatePicker', {});
    };

    /**
     * @description 不传参：获取当前日期
     *              传参：获取传入日期加若干年或月或日以后的日期
     *
     * @param dateObj 参数格式：
     *                      {
     *                          dateArr: [年，月，日，星期],
     *                          addType: 'd',
     *                          addNum: 10,
     *                          isBreak: false
     *                      }
     *                参数说明：
     *                  dateArr: 传入的日期数组，作为起始日期
     *                  addType: 'd', date上加多少; 'm': month上加多少; 'y': year上加多少
     *                  addNum: 加多少年或月或日
     *                  isBreak: 是否贯穿，可以同时加任意年月日
     *
     * @returns {*} 返回起始日期加若干年或月或日以后的日期
     */
    self.getDate = function (dateObj) {
        var newDate = new Date(serverTime),
            year,
            month,
            date,
            day;
        if (angular.isUndefined(dateObj)) {
            year = newDate.getFullYear();
            month = newDate.getMonth() + 1;
            date = newDate.getDate();
            day = newDate.getDay();
            return [year, month, date, day];
        }
        if (angular.isObject(dateObj)) {
            var addType = dateObj.addType || 'd',
                dateArr = dateObj.dateArr,
                addNum = dateObj.addNum || 1,
                isBreak = dateObj.isBreak || true,
                newDateAdded,
                newDateAddedMs,
                yearAdded,
                monthAdded,
                dateAdded,
                dayAdded;
            year = dateArr[0];
            month = dateArr[1] - 1;
            date = dateArr[2];
            newDate = new Date(year, month, date);
            switch (addType) {
                case 'd':
                    newDateAddedMs = newDate.setDate(date + addNum);
                    break;
                case 'm':
                    newDateAddedMs = newDate.setMonth(month + addNum);
                    break;
                case 'y':
                    newDateAddedMs = newDate.setFullYear(year + addNum);
                    break;
                default :
                    break;
            }
            newDateAdded = new Date(newDateAddedMs);
            dateAdded = newDateAdded.getDate();
            monthAdded = newDateAdded.getMonth() + 1;
            yearAdded = newDateAdded.getFullYear();
            dayAdded = newDateAdded.getDay();
            return [yearAdded, monthAdded, dateAdded, dayAdded];
        }
    };

    /**
     * @description 获取当前日期，也是日期控件开始渲染的日期所在月，服务器请求参数之一
     * @returns {number|*}  返回当前日期
     */
    self.getBeginDate = function () {
        return self.getDate();
    };

    /**
     * @description 获取当前日期+90天以后的结束日期，服务器请求参数之一
     * @returns {number|*}
     */
    self.getEndDate = function () {
        return self.getDate({
            dateArr: beginDateArr,
            addNum: 30
        });
    };

    /**
     * @description 获取日期控件渲染的结束日期，渲染12个月的日期
     */
    self.getRenderEndDate = function () {
        return self.getDate({
            dateArr: beginDateArr,
            addType: 'y'
        });
    };

    /**
     * @description 渲染日期控件，机票价格
     *              通过dateType判断，即可以渲染去程日期视图，也可以渲染返程日期视图，并做相应的样式调整。
     *
     */
    self.renderDate = function () {
        var eachYear = beginDateArr[0],
            eachMonth = beginDateArr[1],
            d = new Date(),
            startIndex,
            isToday = 0,
            renderDateCount,
            renderDate,
            renderMonth,
            renderYear,
            renderDateArr,
            displayType,
            numberDate,
            eachMonthLastDateIndex,
            isHighLight,
            isSelected,
            goTripDateArr,
            backTripDateArr,
            isUsable = false,
            priceList = angular.copy(datePriceList),
            isSoldOut,
            priceObj,
            price,
            stock,
            stockFlag,
            cnDay,
            index = 0,
            isTomorrow = false,
            renderType = self.renderType,
            isHasPrice = false;

        if (!isInit) {
            goTripDateArr = self.initDateObj.dateArr;
            backTripDateArr = self.getStorageBackDateInfo().curDateObj.dateArr;
        }

        for (var i = 0; i < renderMonthCount; i++) {
            if (eachMonth > 12) {
                eachMonth = 1;
                eachYear++;
            }

            self.dateArray[i] = {
                year: eachYear,
                month: eachMonth
            };

            d.setDate(1);
            d.setMonth(eachMonth - 1);
            d.setFullYear(eachYear);
            self.dateArray[i].dateObj = [];

            startIndex = self.getDateIndex(eachYear, eachMonth - 1, 1);
            renderDateCount = startIndex + self.getDaysInMonth(eachYear, eachMonth);

            for (var j = 0; j < renderDateCount; j++) {
                isSoldOut = isHighLight = isSelected = false;

                if (j < startIndex) {
                    self.dateArray[i].dateObj[j] = {
                        isUsable: isUsable,
                        renderDate: '',
                        date: ''
                    }
                } else {
                    renderYear = d.getFullYear();
                    renderMonth = d.getMonth();
                    renderDate = numberDate = d.getDate();
                    cnDay = weekDay[d.getDay()];
                    renderDateArr = [eachYear, eachMonth, numberDate];
                    if (!self.dateCompare(renderDateArr, beginDateArr)) {
                        isToday = 1;
                        isUsable = true;
                        isHasPrice = true;
                        //var t = 0;
                    }
                    //计算渲染日期对应的价格的开始位置
                    if (isHasPrice) {
                        var priceListLen = priceList.length;
                        var inRender = false;//当前循环日期是否在接口返回列表里面
                        for (var n = 0; n < priceListLen; n++) {
                            priceObj = priceList[n];
                            var specDate = new Date(priceObj.specDate),
                                year = specDate.getFullYear(),
                                month = specDate.getMonth(),
                                day = specDate.getDate();
                            if (renderDate == day && renderMonth == month && renderYear == year) {
                                inRender = true;
                                break;
                            }
                        }

                        if (inRender) {
                            price = priceObj.sellPrice;
                            stock = priceObj.stock;
                            displayType = priceObj.displayType;
                            stockFlag = priceObj.stockFlag;
                            isSoldOut = displayType === 'DISPLAY_SOLD_OUT';
                            isUsable = !isSoldOut;
                        } else {
                            isUsable = false;
                        }
                        //priceObj = priceList[t];
                        //
                        //if (priceObj && priceObj.sellPrice) {
                        //    price = priceObj.sellPrice;
                        //    stock = priceObj.stock;
                        //    stockFlag = priceObj.stockFlag;
                        //} else {
                        //    isHasPrice = false;
                        //    renderMonthCount = i;
                        //    self.lastPriceDateObj = self.dateArray[i].dateObj[j - 1];
                        //    if (renderType) {
                        //        isUsable = false;
                        //    }
                        //}
                        //
                        //if (priceObj && priceObj.specDate) {
                        //     //校验日期是否对上
                        //    var specDate = new Date(priceObj.specDate),
                        //          year = specDate.getFullYear(),
                        //          month = specDate.getMonth(),
                        //          day = specDate.getDate();
                        //    if (renderDate != day || renderMonth != +month || renderYear != year) {
                        //        isUsable = false;
                        //        t = t == 0 ? t : t - 1;
                        //    } else {
                        //        isUsable = true;
                        //    }
                        //}
                        //t++;
                    }

                    /*
                     如果用户打开的是返程日期选择，若当前渲染的日期比去程日期大，则该日期可用；
                     如果当前渲染的日期等于去程日期，则该日期为选中状态;

                     如果用户打开的是去程日期，并且用户选择过去程日期，若当前渲染日期等于去程日期，则该日期为选中状态
                     */
                    if (self.isSelectBackTrip()) {
                        var result = self.dateCompare(renderDateArr, goTripDateArr) === -1;
                        if (renderType) {
                            isUsable = result && isHasPrice;
                        } else {
                            isUsable = result;
                        }
                        isSelected = !self.dateCompare(renderDateArr, backTripDateArr) && isUsable;
                    } else {
                        isSelected = !self.dateCompare(renderDateArr, goTripDateArr) && isUsable;
                    }

                    if (eachYear === beginDateArr[0] + 1 && eachMonth === beginDateArr[1] && renderDate >= beginDateArr[2]) {
                        isUsable = false;
                    }

                    switch (isToday) {
                        case 1:
                            cnDay = renderDate = '今天';
                            isToday++;
                            isHighLight = true;
                            break;
                        case 2:
                            cnDay = renderDate = '明天';
                            isToday++;
                            isHighLight = true;
                            isTomorrow = true;
                            break;
                        case 3:
                            cnDay = renderDate = '后天';
                            isToday++;
                            isHighLight = true;
                            break;
                        default:
                            break;
                    }

                    if(!localStorage.getItem('special_visitDate')){
                        isSelected = false;
                    }

                    self.dateArray[i].dateObj[j] = {
                        isUsable: isUsable,
                        stock: stock,
                        stockFlag: stockFlag,
                        renderDate: renderDate,
                        dateArr: renderDateArr.concat([d.getDay()]),
                        cnDay: cnDay,
                        displayType: displayType,
                        dateFormat: self.getFormatDate(renderDateArr),
                        isHighLight: isHighLight,
                        isSelected: isSelected,
                        isHasPrice: isHasPrice,
                        isSoldOut: isSoldOut,
                        price: price,
                        dateArrIndex: i,
                        index: index++
                    };
                    dateObjList.push(self.dateArray[i].dateObj[j]);
                    d.setDate(d.getDate() + 1);
                    renderDateArr = null;
                    if (isInit && isTomorrow) {
                        var goDateInfo = self.getStorageGoDateInfo();
                        self.initDateObj = goDateInfo ? goDateInfo.curDateObj : self.dateArray[i].dateObj[j];
                        isTomorrow = null;
                    }

                }

            }
            eachMonth++;
            eachMonthLastDateIndex = self.getDateIndex(eachYear, eachMonth - 1, 0);
            for (var k = 0; k < (6 - eachMonthLastDateIndex); k++) {
                self.dateArray[i].dateObj[j + k] = {
                    isUsable: false,
                    renderDate: '',
                    date: ''
                }
            }
        }
    };

    /**
     * @description 日期比较，通过转换为毫秒数来进行日期比较
     *              相等： 返回0
     *              前者小于后者： 返回1
     *              前者大于后者： 返回-1
     * @param date
     * @param anotherDate
     * @returns {number}
     */
    self.dateCompare = function (date, anotherDate) {
        var dateMs,
            anotherDateMs;
        if (angular.isArray(date)) {
            dateMs = self.dateArrToMs(date);
        }
        if (angular.isArray(anotherDate)) {
            anotherDateMs = self.dateArrToMs(anotherDate);
        }
        if (dateMs === anotherDateMs) {
            return 0;
        }
        return dateMs < anotherDateMs ? 1 : -1;
    };

    /**
     * @description 将日期转换为毫秒
     * @param dateArr 日期数组[2015, 4, 21]
     * @returns {number} 毫秒
     */
    self.dateArrToMs = function (dateArr) {
        var date = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
        return date.getTime();
    };

    /**
     * @description 检查是否已经有去程日期缓存数据
     * @returns {boolean|*}
     */
    self.hasGoTripDateObj = function () {
        var goDateInfo = self.getStorageGoDateInfo(),
            goDateObj;
        if (angular.isObject(goDateInfo)) {
            goDateObj = goDateInfo.curDateObj;
            return angular.isObject(goDateObj);
        }
    };

    /**
     * @description 检查是否已经有返程日期缓存数据
     * @returns {boolean|*}
     */
    self.hasBackTripDateObj = function () {
        var backDateInfo = self.getStorageBackDateInfo(),
            backDateObj;
        if (angular.isObject(backDateInfo)) {
            backDateObj = backDateInfo.curDateObj;
        }
        return angular.isObject(backDateObj);
    };

    /**
     * @description 获取缓存中的去程日期信息（包含3天的日期对象）
     * @returns {*}
     */
    self.getStorageGoDateInfo = function () {
        var datePickerData = angular.fromJson(localStorage.getItem('datePickerData')),
            goDateInfo;
        if (angular.isObject(datePickerData)) {
            goDateInfo = datePickerData.goDateInfo;
            if (angular.isObject(goDateInfo)) {
                return goDateInfo;
            }
        }
    };

    /**
     * @description 获取缓存中的返程日期信息（包含3天的日期对象）
     * @returns {*}
     */
    self.getStorageBackDateInfo = function () {
        var datePickerData = angular.fromJson(localStorage.getItem('datePickerData')),
            backDateInfo;
        if (angular.isObject(datePickerData)) {
            backDateInfo = datePickerData.backDateInfo;
            if (angular.isObject(backDateInfo)) {
                return backDateInfo;
            }
        }
    };

    /**
     * @description 判断用户是选择去程日期还是返程日期
     * @returns {boolean}
     */
    self.isSelectBackTrip = function () {
        return self.dateType === 'backTrip';
    };

    /**
     * @description 格式化日期，格式为: '2015-04-09'
     * @param y 年
     * @param m 月
     * @param d 日
     * @returns {string}
     */
    self.getFormatDate = function (y, m, d) {
        var mFormat,
            dateFormat;
        if (arguments.length === 3) {
            if (m < 10) {
                mFormat = '0' + m;
            } else {
                mFormat = m;
            }
            if (d < 10) {
                dateFormat = '0' + d;
            } else {
                dateFormat = d;
            }
            return y + '-' + mFormat + '-' + dateFormat;
        }
        if (arguments.length === 1 && angular.isArray(y)) {
            var year = y[0],
                month = y[1],
                date = y[2];
            return self.getFormatDate(year, month, date);
        }
    };

    /**
     * @description 用户选择日期处理函数，添加选中样式，移除其他日期的选中样式，调用emitSelectDateEvent函数将选中的日期对象发送到父级作用域
     * @param dateObj
     * @param e
     */
    self.selectDate = function (dateObj, e) {
        if (!dateObj.isUsable) return;
        var target = e.target,
            $targetDate = angular.element(target),
            selectedClassName = 'selected',
            $dateBody = $element.find('article'),
            $allDate = $dateBody.find('span');

        if (target.nodeName.toLocaleUpperCase() === 'SPAN') {
            if ($targetDate.hasClass(selectedClassName)) return;
            $allDate.removeClass(selectedClassName);
            $targetDate.addClass(selectedClassName);
        }
        self.emitSelectDateEvent(dateObj);
    };


    /**
     * @description 将选中的日期对象发送到父级作用域，判断用户当前打开的是去程日期选择，还是返程日期选择
     *
     *              1.如果是返程日期选择self.isSelectedBackTrip()返回true,返程日期backDateObj为dateObj，
     *              若去程日期没有选择过，则去程日期为初始日期beginDateArr
     *              若去程日期选择过，则去程日期为缓存的去程日期self.goTripDateArr
     *
     *              2.如果是去程日期选择，去程日期对象goDateObj为用户选择的日期对象dateObj;
     *              若去程日期超过返程日期，返程日期为去程日期+2天self.getBackDateObj(goDateObj.dateArr).dateArr;
     *              若去程日期没有超过返程日期，并且返程日期选择过，则返程日期为缓存的返程日期self.backTripDateArr
     *              若去程日期没有超过返程日期，并且返程日期没有选择过，则返程日期为初始日期+2天self.getBackDateObj().dateArr;
     *
     *
     * @param dateObj 选中的日期对象
     */
    self.emitSelectDateEvent = function (dateObj) {
        var goDateObj,
            emitData,
            backDateObj,
            goDateInfo,
            backDateInfo;
        if (self.isSelectBackTrip()) {
            goDateInfo = self.getStorageGoDateInfo();
            if (angular.isObject(goDateInfo)) {
                goDateObj = goDateInfo.curDateObj
            } else {
                goDateObj = self.initDateObj;
            }
            backDateObj = dateObj;
        } else {
            goDateObj = dateObj;
            if (self.isGoDateOverBack(goDateObj)) {
                backDateObj = self.getBackDateObj(goDateObj);
            } else {
                backDateInfo = self.getStorageBackDateInfo();
                if (angular.isObject(backDateInfo)) {
                    backDateObj = backDateInfo.curDateObj;
                } else {
                    backDateObj = self.getBackDateObj();
                }
            }
        }
        emitData = {
            goDateInfo: {
                curDateObj: goDateObj,
                preDateObj: self.getPrevDateObj(goDateObj),
                nextDateObj: self.getNextDateObj(goDateObj)
            },
            backDateInfo: {
                curDateObj: backDateObj,
                preDateObj: self.getPrevDateObj(backDateObj),
                nextDateObj: self.getNextDateObj(backDateObj)
            }
        };

        self.setDateObjCache(emitData);
        if (!isInit) {
            self.updateInitDateObj();
            emitData.isInit = false;
        } else {
            emitData.isInit = true;
        }
        self.closeDatePicker();
        $scope.$emit('onSelectDate', emitData);
    };

    self.updateInitDateObj = function () {
        var goDateInfo = self.getStorageGoDateInfo();
        if (angular.isObject(goDateInfo)) {
            self.initDateObj = goDateInfo.curDateObj;
        }
    };

    /**
     * @description 获取日期对象的前一个日期对象
     * @param dateObj 日期对象
     * @returns {*} 前一个日期对象
     */
    self.getPrevDateObj = function (dateObj) {
        var curDateObjIndex = dateObj.index,
            prevDateObjIndex = curDateObjIndex - 1,
            prevDateObj;
        prevDateObj = self.getDateObjByIndex(prevDateObjIndex);
        return prevDateObj;
    };

    /**
     * @description 获取日期对象的下一个日期对象
     * @param dateObj 日期对象
     * @returns {*} 下一个日期对象
     */
    self.getNextDateObj = function (dateObj) {
        var curDateObjIndex = dateObj.index,
            nextDateObjIndex = curDateObjIndex + 1,
            nextDateObj;
        nextDateObj = self.getDateObjByIndex(nextDateObjIndex);
        return nextDateObj;
    };

    /**
     * @description 通过日期对象索引查找日期对象
     * @param index 日期对象索引
     * @returns {*} 查找到的日期对象
     */
    self.getDateObjByIndex = function (index) {
        var len = dateObjList.length,
            dateObj,
            queryIndex,
            i = 0;
        for (; i < len; i++) {
            dateObj = dateObjList[i];
            queryIndex = dateObj.index;
            if (angular.isNumber(queryIndex) && (index === queryIndex)) {
                return dateObj;
            }
        }
    };

    /**
     * @description 在localStorage中和controller属性中缓存用户选择的去程日期、返程日期
     * @param emitData 向父级作用域发送的日期对象，包含去程（前一天，当前，后一天），返程（前一天，当前，后一天）
     */
    self.setDateObjCache = function (emitData) {
        self.emitData = emitData;

        localStorage.setItem('datePickerData', angular.toJson(emitData));
    };

    /**
     * @description 用户选择的去程日期是否超过了当前已存在的返程日期，如果超过，则设置返程日期为去程日期+ 2天
     * @param goDateObj 用户选择的去程日期对象
     * @returns {boolean} 若去程日期超过返程日期，返回true，否则为false
     */
    self.isGoDateOverBack = function (goDateObj) {
        var goDateIndex,
            backDateObj,
            backDateInfo,
            backDateIndex;
        if (cm.isNotEmpty(goDateObj) && cm.isNotEmpty(goDateObj.index)) {
            goDateIndex = goDateObj.index
        }

        if (self.hasBackTripDateObj()) {
            backDateInfo = self.getStorageBackDateInfo();
            backDateIndex = backDateInfo.curDateObj.index;
        } else {
            backDateObj = self.getBackDateObj();
            backDateIndex = backDateObj.index;
        }
        if (goDateIndex >= backDateIndex) {
            return true;
        }
    };

    /**
     * @description 根据去程日期，获取默认的返程日期，默认返程日期=去程日期+2天
     * @param goDateObj 去程日期对象
     * @returns {{}} 返程日期对象
     */
    self.getBackDateObj = function (goDateObj) {
        var dateObj = goDateObj || self.initDateObj,
            goDateIndex = dateObj.index,
            backDateIndex = goDateIndex + backDateStep,
            backDateObj;
        backDateObj = self.getDateObjByIndex(backDateIndex);
        return backDateObj;
    };

    /**
     * @description 获取日期的索引位置（通过对应的星期数来获取）
     */
    self.getDateIndex = function (y, m, d) {
        return new Date(y, m, d).getDay();
    };


    //self.fixIosStyle = function () {
    //    if (cm.isIosDevice()) {
    //        cm.$('.tt-header').css({'position': 'relative', 'top': '0'});
    //        cm.$('#container').css({'paddingTop': '0', 'top': '0', 'position': 'absolute'});
    //        cm.$('.addspace').css('background', '#d30775');
    //    }
    //};

    /**
     * @description 判断是闰年还是平年
     * @param year
     * @param month
     * @returns {number} 返回闰年2月份天数，或者平年各个月份天数
     */
    self.getDaysInMonth = function (year, month) {
        return (month === 2 && (year % 4 === 0 && year % 100 === 0)) || year % 400 === 0 ? 29 : monthDay[month];
    };

    if (isInit) {
        self.init();
    }

}
])
;
/**
 * Created by zhangfeng on 2015/7/29.
 */
'use strict';
orderControllers.controller("addressAddCtrl",['$scope','addressAddService', '$timeout', '$location', function($scope, service, $timeout, $location){

    var storage = window.localStorage,
        _ = {
            getText : function (evt) {
                var target = evt.target || evt.srcElement;
                return target.innerText;
            },
            getTarget : function (evt) {
                return evt.target || evt.srcElement;
            }
        };
    var options ="";

    $scope.param ={
        maskShow : false,
        errorMsg : null,
        showErrMsg : false
    };

    $scope.model = {
        recipientName : null,
        mobileNumber : null,
        province : null,
        city : null,
        address : null,
        postCode : null
    };

    $scope.fn = {

        showErr : function (words) {
            param.errorMsg = words;
            param.showErrMsg = true;
            $timeout(function () {
                param.showErrMsg = false;
            }, 2000);
            return false;
        },

        goAddressChoose : function () {
            $location.path('/addressChoose');
        },

        commit : function () {
            var model = $scope.model;
            if (service.validate(param, "errorMsg", "showErrMsg")) {
                service.getUser().then(function (res) {
                    var user = res.data.userId;
                    //登录成功
                    if (user != undefined && user != null) {
                        //添加邮寄地址
                        service.addAddress(model).then(function (res) {
                            var address = JSON.parse(storage.getItem('order_address')) || [];
                            model.receiverId = res.data.receiverId;
                            address.push(model);
                            storage.setItem('order_address', JSON.stringify(address));
                            $location.path('/addressChoose');
                        }, function (err) {
                            ;
                        });
                    } else {
                        fn.goClutter();
                    }
                }, function (err) {
                    //TODO 本地测试
                    //service.addAddress(model).then(jsonpCallBack);
                    fn.goClutter();
                });
            }


        },

        init : function(e) {
            jsonpCallBack = function (res) {
                options = fn.formatData(res.data.tree);
            };
            service.getCity().then(jsonpCallBack);
        },

        formatData : function (data) {
            var dataObj = {"title": "选择所在地区", "isActive": true, "colCount": 2, "colOptions": [
                          {
                              "widthPercent": 50,
                              "align": "center",
                              "defaultCode": 2000
                          },
                          {
                              "widthPercent": 50,
                              "align": "center",
                              "defaultCode": 2000
                          }
                      ]};
            var arr = [];
            var index = 2000;
            for (var i = 1, len = data.length; i < len; i += 1) {
                var obj = {};
                obj.key = data[i].key;
                obj.code = index;
                obj.name = data[i].value;
                obj.column = 1;
                obj.pCode = null;
                arr.push(obj);
                for (var j = 0, jlen = data[i].list.length; j < jlen; j += 1) {
                    var obj = {};
                    obj.key = data[i].list[j].key || 0;
                    obj.name = data[i].list[j].value;
                    obj.column = 2;
                    obj.pCode = index;
                    arr.push(obj);
                }
                index++;
            }
            dataObj.data = arr;
            return dataObj;
        },

        getCitySelect : function (e) {
            var s = new SpinWheel();
            var el = _.getTarget(e);
            s.setData(options);
            s.setCancelAction(function () {
                el.value = null;
            });
            s.setDoneAction(function () {
                var results = s.getSelectedValues();
                if (results.keys[1] == 0) {
                    $('#triggerErr')[0].click();
                    return true;
                }
                el.value = results.values.join(' ');
                console.log(results)
                $scope.model.province = results.values[0];
                $scope.model.city = results.values[1];//console.log(options);
                $scope.model.provinceId = results.ids[0];
                $scope.model.cityId = results.ids[1];
            });
            s.open();
        },

        goClutter : function () {
            window.location.href = "//m.lvmama.com/login.htm?service=" + encodeURIComponent($window.location.href);
        },

        triggerErr : function () {
            return fn.showErr('请选择省份和城市');
        }

    };

    var param = $scope.param,
        fn = $scope.fn;
    fn.init();

}]);
/**
 * Created by zhangfeng on 2015/7/29.
 */
orderServices.factory("addressAddService",['cm',function(cm){
    return {
        addAddress : function(opts){
            opts.lvsessionid = cm.commonParams && cm.commonParams.lvsessionid;
            return cm.post({
                loadingText : '加载中...',
                url : cm.getUrls().addAddress,
                params : opts
            });
        },
        getCity : function(opts){
            return cm.getJSON({
                loadingText : '加载中...',
                url : cm.getUrls().getCity,
                params : opts
            });
        },
        getUser : function () {
            var data = {
                'version': "1.0.0",
                'lvsessionid': cm.commonParams && cm.commonParams.lvsessionid,
                'format' : "json"
            };
            return cm.get({
                loadingText : '加载中...',
                url : cm.getUrls().getUser,
                params : data
            });
        },

        validate : function (model, err, show, opts) {
            return cm.validate(model, err, show, opts);
        }
    }
}]);
/**
 * Created by zhangfeng on 2015/7/29.
 */
orderControllers.controller("addressChooseCtrl",['$scope','addressChooseService', '$location', '$window', 'dataManager', function($scope, service, $location, $window, dataManager){
    
    var storage = window.localStorage;
    var DATA = dataManager.getData('special_order');
    $scope.param = {
        errorMsg : false,
        address : null
    };

    jsonpCallBack = function (res) {
        param.address = res.data;
    };

    $scope.fn = {
        getAddress : function () {
            service.getUser().then(function (res) {
                var user = res.data.userId;
                //登录成功
                if (user != undefined && user != null) {
                    //获取邮寄地址
                    service.getAddress().then(jsonpCallBack);
                } else {
                    fn.goClutter();
                }
            }, function (err) {
                //TODO 本地测试
                //service.getAddress().then(jsonpCallBack);
                fn.goClutter();
            });
        },

        goAddressAdd : function () {
            $location.path('/addressAdd');
        },

        goAddressEdit : function (index) {
            storage.setItem('order_address', JSON.stringify(param.address));
            storage.setItem('order_address_index', index);
            $location.path('/addressEdit');
        },

        toggleChoose : function (index) {
            param.address[index].isChecked = !param.address[index].isChecked;
            if (index != param.prevIndex && param.prevIndex != null) {
                param.address[param.prevIndex].isChecked = false;
            }
            param.prevIndex = index;
        },

        finish : function () {
            var address = param.address[param.prevIndex];
            if (DATA) {
                DATA.addressName = address.recipientName;
                DATA.addressMobile = address.mobileNumber;
                DATA.addressAddress = address.address;
                DATA.addressProvince = address.province;
                DATA.provinceId = address.provinceId;
                DATA.cityId = address.cityId;
                DATA.addressCity = address.city;
                DATA.addressPC = DATA.addressProvince + " " + DATA.addressCity;
                DATA.zipCode = address.postCode;
            }
            DATA.unload = true;
            $location.path('special');
        },

        goClutter : function () {
            window.location.href = "//m.lvmama.com/login.htm?service=" + encodeURIComponent($window.location.href);
        },

        goSpecial : function () {
            DATA.unload = true;
            $location.path('special');
        }
    };
    var param = $scope.param,
          fn = $scope.fn;
    fn.getAddress();
}]);
/**
 * Created by zhangfeng on 2015/7/29.
 */
orderServices.factory("addressChooseService",['cm',function(cm){
    return{
        getAddress:function(){
            return cm.get({
                loadingText:'加载中...',
                url:cm.getUrls().getAddress,
                params:{
                    lvsessionid : cm.commonParams && cm.commonParams.lvsessionid
                }
            });
        },

        getUser : function () {
            var data = {
                'version': "1.0.0",
                'lvsessionid': cm.commonParams && cm.commonParams.lvsessionid,
                'format' : "json"
            };
            return cm.get({
                loadingText : '加载中...',
                url : cm.getUrls().getUser,
                params : data
            });
        }
    }
}]);
/**
 * Created by zhangfeng on 2015/7/29.
 */
'use strict';
orderControllers.controller("addressEditCtrl",['$scope','addressEditService', '$timeout', '$location', '$rootScope',
    function($scope, service, $timeout, $location, $rootScope){

    var storage = window.localStorage, options ="",
        _ = {
            getText : function (evt) {
                var target = evt.target || evt.srcElement;
                return target.innerText;
            },
            getTarget : function (evt) {
                return evt.target || evt.srcElement;
            }
        };

    $scope.param ={
        errorMsg : null,
        showErrMsg : false,
        index : null,
        receiverId : null,
        addressNo : null
    };

    $scope.model = {};

    $scope.fn = {

        showErr : function (words) {
            param.errorMsg = words;
            param.showErrMsg = true;
            $timeout(function () {
                param.showErrMsg = false;
            }, 2000);
        },

        goAddressChoose : function () {
            $location.path('/addressChoose');
        },

        getAddressInfo : function () {
            //TODO 获取填过的信息
            var address = JSON.parse(storage.getItem('order_address')),
                index = param.index = storage.getItem('order_address_index'),
                model;

            model = $scope.model = address[index];
            param.addressNo = model.addressNo;
            $scope.address = model.province +" "+ model.city;
        },

        commit : function () {
            var model = $scope.model;

            if (service.validate(param, "errorMsg", "showErrMsg")) {
                //TODO 提交
                service.getUser().then(function (res) {
                    var user = res.data.userId;
                    //登录成功
                    if (user != undefined && user != null) {
                        //修改邮寄地址
                        service.updateAddress(model).then(function (res) {
                            var address = JSON.parse(storage.getItem('order_address'));
                            address.splice(param.index, 1);
                            storage.setItem('order_address', JSON.stringify(address));
                            storage.setItem('order_address_index', null);
                            $location.path('/addressChoose');
                        }, function (err) {
                            ;
                        });
                    } else {
                        fn.goClutter();
                    }
                }, function (err) {
                    //TODO 本地测试
                    //service.updateAddress(model).then(jsonpCallBack);
                    fn.goClutter();
                });
            }
        },

        init : function(e) {
            jsonpCallBack = function (res) {
                options = fn.formatData(res.data.tree);//console.log(options)
            };
            service.getCity().then(jsonpCallBack);
        },

        formatData : function (data) {
            var dataObj = {"title": "选择所在地区", "isActive": true, "colCount": 2, "colOptions": [
                {
                    "widthPercent": 50,
                    "align": "center",
                    "defaultCode": 2000
                },
                {
                    "widthPercent": 50,
                    "align": "center",
                    "defaultCode": 2000
                }
            ]};
            var arr = [];
            var index = 2000;
            for (var i = 1, len = data.length; i < len; i += 1) {
                var obj = {};
                obj.key = data[i].key;
                obj.code = index;
                obj.name = data[i].value;
                obj.column = 1;
                obj.pCode = null;
                arr.push(obj);
                for (var j = 0, jlen = data[i].list.length; j < jlen; j += 1) {
                    var obj = {};
                    obj.key = data[i].list[j].key || 0;
                    obj.name = data[i].list[j].value;
                    obj.column = 2;
                    obj.pCode = index;
                    arr.push(obj);
                }
                index++;
            }
            dataObj.data = arr;
            return dataObj;
        },

        getCitySelect : function (e) {
            var s = new SpinWheel();
            var el = _.getTarget(e);
            s.setData(options);
            s.setCancelAction(function () {
                el.value = null;
            });
            s.setDoneAction(function () {
                var results = s.getSelectedValues();
                if (results.keys[1] == 0) {
                    $('#triggerErr')[0].click();
                    return true;
                }
                $scope.model.province = results.values[0];
                $scope.model.city = results.values[1];
                $scope.model.provinceId = results.ids[0];
                $scope.model.cityId = results.ids[1];
                el.value = results.values.join(' ');
            });
            s.open();
        },

        triggerErr : function () {
            return fn.showErr('请选择省份和城市');
        },

        goClutter : function () {
            window.location.href = "//m.lvmama.com/login.htm?service=" + encodeURIComponent($window.location.href);
        },

        remove : function () {
            service.removeAddress({
                addressNo : param.addressNo,
                receiversType : 'Address'
            }).then(function (res) {
                var address = JSON.parse(storage.getItem('order_address'));
                address.splice(param.index, 1);
                storage.setItem('order_address', JSON.stringify(address));
                storage.setItem('order_address_index', null);
                $location.path('/addressChoose');
            }, function (err) {
                ;
            });
        }
    };

    var param = $scope.param,
          fn = $scope.fn;
    fn.init();
    fn.getAddressInfo();


}]);
/**
 * Created by zhangfeng on 2015/7/29.
 */
orderServices.factory("addressEditService",['cm',function(cm){
    return {

        updateAddress : function(opts){
            opts.lvsessionid = cm.commonParams && cm.commonParams.lvsessionid;
            return cm.post({
                loadingText : '加载中...',
                url : cm.getUrls().updateAddress,
                params : opts
            });
        },

        removeAddress : function(opts){
            opts.lvsessionid = cm.commonParams && cm.commonParams.lvsessionid;
            return cm.post({
                loadingText : '加载中...',
                url : cm.getUrls().removeAddress,
                params : opts
            });
        },

        getCity : function(opts){
            return cm.getJSON({
                loadingText : '加载中...',
                url : cm.getUrls().getCity,
                params : opts
            });
        },

        getUser : function () {
            var data = {
                'version': "1.0.0",
                'lvsessionid': cm.commonParams && cm.commonParams.lvsessionid,
                'format' : "json"
            };
            return cm.get({
                loadingText : '加载中...',
                url : cm.getUrls().getUser,
                params : data
            });
        },

        validate : function (model, err, show, opts) {
            return cm.validate(model, err, show, opts);
        }

    }
}]);
/**
 * Created by zhangfeng on 2015/7/29.
 */
'use strict';
orderControllers.controller("bookerAddCtrl",['$scope','bookerAddService', '$timeout', '$location', 'cm', '$window', function($scope, service, $timeout, $location, cm, $window){
    
    var storage = window.localStorage,
          _ = {
            getText : function (evt) {
                var target = evt.target || evt.srcElement;
                return target.innerText;
            },
            
            reset : function (target) {
                target = null;
            }
        };

    var cardType = {
        '身份证' : 'ID_CARD',
        '护照' : 'HUZHAO',
        '港澳通行证' : 'GANGAO',
        '台湾通行证' : 'TAIBAO'
    };

    var genderType = {
        '男' : 'MALE',
        '女' : 'FEMALE'
    };

    $scope.param ={
        sortType : [],                                
        selectedType : null,
        cardType : '身份证',
        genderType : null,
        maskShow : false,
        errorMsg : null,
        showErrMsg : false
    };

    $scope.model = {
        receiverName : null,
        mobileNumber : null,
        birthday : null,
        email : null,
        firstName : null,
        lastName : null,//姓
        certType : 'ID_CARD',
        certNo : null,
        receiverGender : null,
        peopleType : 'ADULT'
    };

    $scope.fn = {

        showType : function (type) {
            param.selectedType = type.toLowerCase();
            if (type === "CARD") {
                //证件号
                param.sortType = ['身份证', '护照', '港澳通行证', '台湾通行证'];
            } else if (type === "GENDER") {
                //性别
                param.sortType = ['男', '女'];
            }
            param.maskShow = true;
        },

        hideMask : function () {
            param.maskShow = false;
        },

        selectType : function (evt) {
            param[param.selectedType + 'Type'] = _.getText(evt);
            param.maskShow = false;
        },

        showErr : function (words) {
            param.errorMsg = words;
            param.showErrMsg = true;
            $timeout(function () {
                param.showErrMsg = false;   
            }, 2000);
            return false;
        },

        goBookerChoose : function () {
            $location.path('/bookerChoose');
        },

        commit : function () {
            var model = $scope.model;
            model.certType = cardType[param.cardType];
            model.receiverGender = genderType[param.genderType];

            if (service.validate(param, "errorMsg", "showErrMsg")) {
                service.getUser().then(function (res) {    
                    var user = res.data.userId;
                    //登录成功
                    if (user != undefined && user != null) {
                        //添加预订人
                        service.addContact(model).then(function (res) {
                            var bookers = JSON.parse(storage.getItem('order_bookers')) || [];
                            model.receiverId = res.data.receiverId;
                            bookers.push(model);
                            storage.setItem('order_bookers', JSON.stringify(bookers));
                            _.reset(bookers);
                            $location.path('/bookerChoose');
                        }, function (err) {
                            ;
                        });
                    } else {
                        fn.goClutter();
                    }
                }, function (err) {
                    //TODO 本地测试
                    //service.addContact(model).then(jsonpCallBack);
                    fn.goClutter();
                });
            }
        },

        goClutter : function () {
            window.location.href = "//m.lvmama.com/login.htm?service=" + encodeURIComponent($window.location.href);
        }
    };

    var param = $scope.param,
          fn = $scope.fn,
          model = $scope.model;

    $scope.$on('luckyDateStr', function(e, data) {
        $scope.model.birthday = data;//输入框的值
    });

}]);
/**
 * Created by zhangfeng on 2015/7/29.
 */
orderServices.factory("bookerAddService",['cm',function(cm){
    return {
        addContact : function(opts){
            opts.lvsessionid = cm.commonParams && cm.commonParams.lvsessionid;
            return cm.post({
                loadingText : '加载中...',
                url : cm.getUrls().addContact,
                params : opts
            });
        },

        getUser : function () {
            var data = {
                'version': "1.0.0",
                'lvsessionid': cm.commonParams && cm.commonParams.lvsessionid,
                'format' : "json"
            };
            return cm.get({
                loadingText : '加载中...',
                url : cm.getUrls().getUser,
                params : data
            });
        },

        validate : function (model, err, show, opts) {
            return cm.validate(model, err, show, opts);
        }
    }
}]);
/**
 * Created by zhangfeng on 2015/7/29.
 */
orderControllers.controller("bookerChooseCtrl",['$scope','bookerChooseService', '$location', '$timeout', '$window', 'dataManager','cm', function($scope, service, $location, $timeout, $window, dataManager,cm){
    
    var storage = window.localStorage, param, fn,
          DATA = dataManager.getData('special_order') || {};
    var cardType = {
        '身份证' : 'ID_CARD',
        '护照' : 'HUZHAO',
        '港澳通行证' : 'GANGAO',
        '台湾通行证' : 'TAIBAO'
    };

    $scope.param = param = {
        errorMsg : null,
        showErrMsg : false,
        bookers : null,
        prevIndex : null,
        title : DATA.personType === "CONTACT" ? "选择预订人" : "选择游玩人",
        addTitle : DATA.personType === "CONTACT" ? "新增预订人" : "新增游玩人"
    };

    $scope.fn = fn = {
        getBookers : function () {
            service.getUser().then(function (res) {
                var user = res.data.userId;
                //登录成功
                if (user != undefined && user != null) {
                    //获取预订人
                    service.getContact().then(function (res) {
                        param.bookers = res.data;
                        if(cm.isNotEmpty(param.bookers)){
                            param.bookers.forEach(function (child) {
                                for (var key in cardType) {
                                    if (cardType[key] === child.certType) {
                                        child.certType = key;
                                        break;
                                    }
                                }
                            });
                        }
                    });
                } else {
                    fn.goClutter();
                }
            }, function (err) {
                //TODO 本地测试
                //service.getContact().then(jsonpCallBack);
                fn.goClutter();
            });
        },

        showErr : function (text) {
            param.errorMsg = text;
            param.showErrMsg = true;
            $timeout(function () {
                param.showErrMsg = false;   
            }, 2000);
            return false;
        },

        goBookerAdd : function () {
            $location.path('/bookerAdd');
        },

        goBookerEdit : function (index) {
            storage.setItem('order_bookers', JSON.stringify(param.bookers));
            storage.setItem('order_booker_index', index);
            $location.path('/bookerEdit');
        },

        toggleChoose : function (index) {
            param.bookers[index].isChecked = !param.bookers[index].isChecked;
            if (index != param.prevIndex && param.prevIndex != null) {
                param.bookers[param.prevIndex].isChecked = false;
            }
            param.prevIndex = index;
        },

        finish : function () {
            var bookerArr = [], bookersLen,
                  isContact = DATA.personType === "CONTACT",
                  isPlayer = DATA.personType === "PLAYER";
            for (var i = 0, len = param.bookers.length; i < len; ) {
                var booker = param.bookers[i++];
                booker.isChecked && bookerArr.push(booker);
            }
            bookersLen = bookerArr.length;

            if (!bookersLen) {
                return fn.showErr('请选择预订人');
            }

            if (isContact && bookersLen > 1) {
                return fn.showErr('预订人数不能超过1人');
            }

            if (isPlayer && bookersLen > 9) {
                return fn.showErr('游玩人数不能超过9人');
            }

            if (isContact) {
                //预订人
                var booker = bookerArr[0];
                DATA.contactName = booker.receiverName;
                DATA.contactMobile = booker.mobileNumber;
                DATA.contactFirstName = booker.firstName;
                DATA.contactLastName = booker.lastName;
                DATA.contactEmail = booker.email;
                DATA.contactIdType = "ID_CARD";
                DATA.contactIdTypeCn = booker.certType;//证件类型中文
                cardType[booker.certType] === "ID_CARD" && (DATA.contactIdNo = booker.certNo);
                DATA.contactGender = booker.receiverGender;
                DATA.contactBirth = booker.birthday;
            } else if (isPlayer) {
                //游玩人
                var booker = bookerArr[0],
                      index = DATA.personIndex;
                if (!("travellerNames" in DATA)) {
                    DATA.travellerNames = [];
                    DATA.travellerMobiles = [];
                    DATA.travellerFirstNames = [];
                    DATA.travellerLastNames = [];
                    DATA.travellerEmails = [];
                    DATA.travellerIdTypes = [];
                    DATA.travellerIdNos = [];
                    DATA.travellerGenders = [];
                    DATA.travellerBirths = [];
                    DATA.IdTypesCn = [];
                }
                DATA.travellerNames[index] = booker.receiverName;
                DATA.travellerMobiles[index] = booker.mobileNumber;
                DATA.travellerFirstNames[index] = booker.firstName;
                DATA.travellerLastNames[index] = booker.lastName;
                DATA.travellerEmails[index] = booker.email;
                DATA.travellerIdTypes[index] = cardType[booker.certType];
                DATA.IdTypesCn[index] = booker.certType;
                DATA.travellerIdNos[index] = booker.certNo;
                DATA.travellerGenders[index] = booker.receiverGender;
                DATA.travellerBirths[index] = booker.birthday;
            }
            //storage.setItem('order_selected_booker', JSON.stringify(bookerArr));
            DATA.unload = true;
            $location.path('special');
        },

        goClutter : function () {
            window.location.href = "//m.lvmama.com/login.htm?service=" + encodeURIComponent($window.location.href);
        },

        goSpecial : function () {
            DATA.unload = true;
            $location.path('special');
        }

    };
    fn.getBookers();
}]);
/**
 * Created by zhangfeng on 2015/7/29.
 */
orderServices.factory("bookerChooseService",['cm',function(cm){
    return{
        getContact:function(){
            return cm.get({
                loadingText:'加载中...',
                url:cm.getUrls().getContact,
                params:{
                    lvsessionid : cm.commonParams && cm.commonParams.lvsessionid
                }
            });
        },

        getUser : function () {
            var data = {
                'version': "1.0.0",
                'lvsessionid': cm.commonParams && cm.commonParams.lvsessionid,
                'format' : "json"
            };
            return cm.get({
                loadingText : '加载中...',
                url : cm.getUrls().getUser,
                params : data
            });
        }
    }
}]);
/**
 * Created by zhangfeng on 2015/7/29.
 */
'use strict';
orderControllers.controller("bookerEditCtrl",['$scope','bookerEditService', '$timeout', '$location', '$rootScope', '$window',
    function($scope, service, $timeout, $location, $rootScope, $window) {
    
    var storage = window.localStorage,
          _ = {
            getText : function (evt) {
                var target = evt.target || evt.srcElement;
                return target.innerText;
            },

            reset : function (target) {
                target = null;
            }
        };

    var cardType = {
        '身份证' : 'ID_CARD',
        '护照' : 'HUZHAO',
        '港澳通行证' : 'GANGAO',
        '台湾通行证' : 'TAIBAO'
    };

    var genderType = {
        '男' : 'MALE',
        '女' : 'FEMALE'
    };

    var peopleType = {
        'PEOPLE_TYPE_ADULT' : 'ADULT',
        'PEOPLE_TYPE_CHILD' : 'CHILD'
    }

    $scope.param ={
        sortType : [],
        selectedType : null,
        cardType : '身份证',
        genderType : null,
        maskShow : false,
        errorMsg : null,
        showErrMsg : false,
        receiverId : null,
        index : null
    };

    $scope.model = {};
    $scope.fn = {

        showType : function (type) {
            param.selectedType = type.toLowerCase();
            if (type === "CARD") {
                param.sortType = ['身份证', '护照', '港澳通行证', '台湾通行证'];//证件号
            } else if (type === "GENDER") {
                param.sortType = ['男', '女'];//性别
            }
            param.maskShow = true;
        },

        hideMask : function () {
            param.maskShow = false;
        },

        selectType : function (evt) {
            param[param.selectedType + 'Type'] = _.getText(evt);
            param.maskShow = false;
        },

        showErr : function (text) {
            param.errorMsg = text;
            param.showErrMsg = true;
            $timeout(function () {
                param.showErrMsg = false;   
            }, 2000);
            return false;
        },

        goBookerChoose : function () {
            $location.path('/bookerChoose');
        },

        getBookerInfo : function () {
            //TODO 获取填过的信息
            var bookers = JSON.parse(storage.getItem('order_bookers')),
                  index = param.index = storage.getItem('order_booker_index'),
                  cert, gender, model;

            model = $scope.model = bookers[index];
            cert = model.certType;
            gender = model.receiverGender;
            param.cardType = cert;
            param.receiverId = model.receiverId;
            $rootScope.birthDate = model.birthday;

            for (var key in genderType) {
                if (genderType[key] === gender) {
                    model.receiverGender = key;
                    param.genderType = key;
                    break;
                }
            }
            _.reset(bookers);
        },

        commit : function () {
            var model = $scope.model;
            model.certType = cardType[param.cardType];
            model.receiverGender = genderType[param.genderType];
            model.peopleType = peopleType[model.peopleType];

            if (service.validate(param, "errorMsg", "showErrMsg")) {
                service.getUser().then(function (res) {
                    var user = res.data.userId;
                    //登录成功
                    if (user != undefined && user != null) {
                        //获取预订人
                        service.updateContact(model).then(function (res) {
                            var bookers = JSON.parse(storage.getItem('order_bookers'));
                            bookers[param.index] = $scope.model;
                            storage.setItem('order_bookers', JSON.stringify(bookers));
                            storage.setItem('order_booker_index', null);
                            _.reset(bookers);
                            $location.path('/bookerChoose');
                        }, function (err) {
                            ;
                        });
                    } else {
                        fn.goClutter();
                    }
                }, function (err) {
                    //TODO 本地测试
                    //service.updateContact(model).then(jsonpCallBack);
                    fn.goClutter();
                });
            }
        },

        remove : function () {
            service.getUser().then(function (res) {
                //登录成功
                var user = res.data.userId;
                if (user != undefined && user != null) {
                    //获取预订人
                    service.removeContact({
                        receiverId : param.receiverId,
                        receiversType : 'Contact'
                    }).then(function (res) {
                        var bookers = JSON.parse(storage.getItem('order_bookers'));
                        bookers.splice(param.index, 1);
                        storage.setItem('order_bookers', JSON.stringify(bookers));
                        storage.setItem('order_booker_index', null);
                        $location.path('/bookerChoose');
                    }, function (err) {
                        ;
                    });
                } else {
                    fn.goClutter();
                }
            }, function (err) {
                //TODO 本地测试
                /*service.removeContact({
                    receiverId : param.receiverId,
                    receiversType : 'Contact'
                }).then(jsonpCallBack);*/
                fn.goClutter();
            });
        },

        goClutter : function () {
            window.location.href = "//m.lvmama.com/login.htm?service=" + encodeURIComponent($window.location.href);
        }

    };

    var param = $scope.param,
          fn = $scope.fn;

    fn.getBookerInfo();
    $scope.$on('luckyDateStr', function(e, data) {
        $scope.model.birthday = data;//输入框的值
    });

}]);
/**
 * Created by zhangfeng on 2015/7/29.
 */
orderServices.factory("bookerEditService",['cm',function(cm){
    return {

        updateContact : function(opts){
            opts.lvsessionid = cm.commonParams && cm.commonParams.lvsessionid;
            return cm.post({
                loadingText : '加载中...',
                url : cm.getUrls().updateContact,
                params : opts
            });
        },

        removeContact : function(opts){
            opts.lvsessionid = cm.commonParams && cm.commonParams.lvsessionid;
            return cm.post({
                loadingText : '加载中...',
                url : cm.getUrls().removeContact,
                params : opts
            });
        },

        getUser : function () {
            var data = {
                'version': "1.0.0",
                'lvsessionid': cm.commonParams && cm.commonParams.lvsessionid,
                'format' : "json"
            };
            return cm.get({
                loadingText : '加载中...',
                url : cm.getUrls().getUser,
                params : data
            });
        },

        validate : function (model, err, show, opts) {
            return cm.validate(model, err, show, opts);
        }

    }
}]);
/**
 * Created by zhangfeng on 2015/7/29.
 */
orderControllers.controller("couponCtrl",['$scope','couponService', '$location', '$timeout', '$window', 'dataManager', function($scope, service, $location, $timeout, $window, dataManager){
    
    var storage = window.localStorage, param, fn,
          DATA = dataManager.getData('special_order') || {};

    getCoupon();

    $scope.param = param = {

    };

    $scope.DATA = DATA;
    $scope.fn = fn = {

        goClutter : function () {
            //window.location.href = "//m.lvmama.com/login.htm";
            //window.location.href = "//m.lvmama.com/login.htm?service=" + encodeURIComponent($window.location.href);
        },

        goSpecial : function () {
            $location.path('special');
        },

        validate : function () {
            service.countTicketPrice(DATA).then(function (res) {
                //TODO 校验可用
            }, function (err) {

            });
        },

        useCoupon : function (index) {
            var coupon = param.coupon[index];
            DATA.couponCode = coupon.code;
            DATA.price = coupon.price;
            fn.goSpecial();
        }

    };

    function getCoupon () {
        service.getCoupon().then(function (res) {
            param.coupon = res.data;
        })
    };

}]);
/**
 * Created by zhangfeng on 2015/7/29.
 */
orderServices.factory("couponService",['cm', '$location', function(cm, $location){
    var commonParams = $location.search();
    return{
        getCoupon : function(){
            return cm.get({
                loadingText:'加载中...',
                url:cm.getUrls().getCoupon,
                params:{}
            });
        },

        countTicketPrice : function(opts){
            angular.extend(opts,commonParams);
            return cm.get({
                loadingText : '加载中...',
                url : cm.getUrls().countTicketPrice,
                params : opts
            });
        }
    }
}]);
'use strict';
orderControllers
    .controller('datePickCtrl', ['$scope', '$log', '$location', 'dataManager', 'cm', function ($scope, $log, $location, dataManager, cm) {
        $scope.openGoDatePricePicker = function () {
            $scope.$broadcast('openGoDatePricePicker', {
                dateType: 'goTrip',
                renderType: 'goDatePrice'
            });
        };
        //alert(cm.commonParams)
        var comcombProductParam ='';
        if(cm.isNotEmpty(cm.commonParams.combProductId)){
            comcombProductParam =  '&combProductId=' + cm.commonParams.combProductId;
        }
        if(!cm.isNotEmpty(cm.commonParams.saleChannel)){
            cm.commonParams.saleChannel = null;
        }
        //alert(cm.commonParams.combProductId)
        var goodsParams='';
        if(cm.commonParams.goodsIds){
            var goodsIds = cm.commonParams.goodsIds+"";
            //alert(goodsIds)

            var goods =[];
            goods = goodsIds.split(",");
            for (var i=0;i<goods.length;i++){
                goodsParams = goodsParams+"&goodsId=" + goods[i];
            }
        }
        console.log(cm.commonParams)
        $scope.dpConfig = {
            //url: './jsonData/date.json',
            url : cm.getUrls().getGoodsTimePrice + "&lvsessionid=" + cm.commonParams.lvsessionid
                + "&productId=" + cm.commonParams.productId
                //+ "&goodsId=" + cm.commonParams.goodsIds
                +goodsParams
                + comcombProductParam
                + '&branchType=' + cm.commonParams.branchType
                + '&saleChannel=' + cm.commonParams.saleChannel,
                //+ '&saleChannel=groupbuy',
            title : '选择日期'
        };

        $scope.$on('onSelectDate', function (e, res) {
            !res.isInit && $location.path('special');
            var obj = res.goDateInfo.curDateObj,
                  order = dataManager.getData('special_order');
            try {
                order.visitDates = obj.dateFormat;//'xxxx-xx-xx'
                order.visitDay = obj.cnDay;//'周日'
                order.stock = obj.stock;//库存
                order.price = obj.price;//单价
                order.stockFlag = obj.stockFlag;//是否限制库存
            } catch (err) {
                $location.path('special');
            }
        });

    }]);
/**
 * Created by chengang on 2018/10/18.
 */
orderControllers.controller("insure", ['$scope', '$routeParams', '$location', 'cm', '$window', 'dataManager', '$timeout', '$sce', function ($scope, $routeParams, $location, cm, $window, Cach, $timeout, $sce) {
    var param, fn, model;

    $scope.param = param = {
        
    };

    $scope.model = model = {
        isAndroid : navigator.userAgent.indexOf('Android')>-1, 
        acInsureIndex : $location.search()['acInsureIndex'],
        reInsureIndex : $location.search()['reInsureIndex'],
        insureData : JSON.parse(localStorage.getItem('special_insures'))
    };
    model.accidentInsurance = model.insureData.accidentInsurance;//意外险
    model.retirementInsurance = model.insureData.retirementInsurance;//退改险

    $scope.fn = fn = {
        goBack: function () {
            $location.path('special');
        },
        backToOrder: function () {
            $location.search()['acInsureIndex'] = model.acInsureIndex;
            $location.search()['reInsureIndex'] = model.reInsureIndex;
            $location.path("special");
        },
        choseInsure : function (index,type) {
            if(type == 'accident'){//意外险
                model.acInsureIndex = index;
            }else if(type == 'retirement'){//退改险
                model.reInsureIndex = index;
            }
        },
        showNotice : function (index,type) {
            if(type == 'accident'){//意外险
                model.currentDesc = model.accidentInsurance[index].desc;
                model.curentTitle = model.accidentInsurance[index].insuranceName;
            }else if(type == 'retirement'){//退改险
                model.currentDesc = model.retirementInsurance[index].desc;
                model.curentTitle = model.retirementInsurance[index].insuranceName;
            }
            if(type){
                model.currentDescHTML = $sce.trustAsHtml(model.currentDesc.replace(/pt/g,'px'));
            }

            model.insureNoticeShow = !model.insureNoticeShow;
        }
    };


}]);

/**
 * Created by zhangfeng on 2015/7/29.
 */
'use strict';
orderControllers.controller("ticketOrderInputCtrl",['$scope','ticketOrderInputService', '$timeout', '$location', '$rootScope', '$window','dataManager', 'cm', '$sce',
    function($scope, service, $timeout, $location, $rootScope, $window,dataManager, cm, $sce) {
        var DATA = getData('special_order') || {}, //订单填写页的缓存信息
            model, fn, options ="";
        var cardType = {
            '身份证' : 'ID_CARD',
            '护照' : 'HUZHAO',
            '港澳通行证' : 'GANGAO',
            '台湾通行证' : 'TAIBAO',
            '台胞证' : 'TAIBAOZHENG',
            '回乡证' : 'HUIXIANG'
        };
        var telReg = /^\d{11}$/;
        var lvsessionid = cm.getCookie('lvsessionid') || '';
        var storage = window.localStorage;
        var datePickerData = storage.getItem('datePickerData');
        // storage.removeItem('datePickerData');
        var localDATA = storage.getItem('ticket_skill_DATA');
        storage.removeItem('ticket_skill_DATA');
        if(localDATA){
            DATA = JSON.parse(localDATA);
        }
        if(datePickerData){
            DATA.visitDates = JSON.parse(datePickerData).goDateInfo.curDateObj.dateFormat;
            DATA.visitDay = JSON.parse(datePickerData).goDateInfo.curDateObj.cnDay;
        }

        //缓存
        //!DATA.unload && getInputInfo();
        DATA.referrer = DATA.referrer || document.referrer;
        DATA.contactIdType = '';
        DATA.contactIdNo = '';

        $scope.DATA = DATA;
        $scope.model = model = {
            canOrder : false,//能否下单
            travellers : null,//游玩人信息
            needCert : true,//游玩人信息是否要填证件信息
            quantities : DATA.quantities || 1,//份数
            totalPrice : 0,//总价
            showNotice : false,
            date : DATA.visitDates,
            week : DATA.visitDay,//星期几
            canSub : false,//是否还能加份数
            canAdd : true,//是否能减加份数
            cardType : [],//证件类型arr
            cardSelect : [],//选中的证件类型
            cardIndex : null,//当前打开的类型index
            showFee : false,
            readContract : true,
            addressPC : DATA.addressPC || null,
            isLogin: false,
            isNeedImgCode: true,
            isNeedMsgAuthCode: true,
            second: 60,
            brandStoreId: $location.search()['brandStoreId'] || '',
            retirementInsurance: [],
            accidentInsurance: [],
            currentReInsure: '',
            currentAcInsure: '',
            reInsureIndex: '',
            acInsureIndex: '',
            reInsureSelected: false,
            acInsureSelected: false,
            insureNoticeShow: false,
            retreatInsurId: '',
            unExpInsurId: '',
            currentShowInsure: {
                descHTML : ''
            },
            ableCertTypes: [],
            specialCert: false,
        };

        $scope.fn = fn = {
            countTicketPrice : countTicketPrice,

            createOrder :createOrder ,

            checkTicketOrder : checkTicketOrder,

            showSelectCerts: function() {
                model.selectCertShow = !model.selectCertShow;
            },

            selectCert: function(type) {
                model.certName = type;
                DATA.contactIdType = cardType[type];
                if(['HUZHAO','GANGAO','TAIBAO'].indexOf(DATA.contactIdType) > -1){
                    model.specialCert = true;
                }else{
                    model.specialCert = false;
                }
                model.selectCertShow = !model.selectCertShow;
            },

            choseGender: function(type) {
                DATA.contactGender = type;
            },

            showBirth: function() {
                if(model.spinFlag){
                    return;
                }else{
                    model.spinFlag = true;
                }
                var options4 = {
                    title : '请选择出生日期',
                    isActive:true,
                    extraParam : {
                        name : "date",
                        range : [1900, 2020],
                        align : ["center", "center", "center"],
                        width: [30, 30, 30],
                        defaultValue : (DATA.contactBirth ? DATA.contactBirth.split('-') : [1987, 1, 1])
                    }
                };
                var s = new SpinWheel();
                s.setData(options4);
                s.setCancelAction(cancel);
                s.setDoneAction(done);
                setTimeout(function() {
                    model.spinFlag= false;
                    s.open();
                }, 300)

                function cancel() {
                }

                function done() {
                    var results = s.getSelectedValues();
                    var year = results.values[0].substring(0,4);
                    var month = parseInt(results.values[1].substring(0,results.values[1].length-1))<10 ? '0'+parseInt(results.values[1].substring(0,results.values[1].length-1)) : parseInt(results.values[1].substring(0,results.values[1].length-1));
                    var date = parseInt(results.values[2].substring(0,results.values[2].length-1))<10 ? '0'+parseInt(results.values[2].substring(0,results.values[2].length-1)) :parseInt(results.values[2].substring(0,results.values[2].length-1));
                    DATA.contactBirth = year+'-'+month+'-'+date;
                    $scope.$digest();
                }
            },

            choseTravellersGender: function(type,index) {
                DATA.travellerGenders[index] = type;
            },

            showTravellersBirth: function(index) {
                if(model.spinFlag){
                    return;
                }else{
                    model.spinFlag = true;
                }
                var options4 = {
                    title : '请选择出生日期',
                    isActive:true,
                    extraParam : {
                        name : "date",
                        range : [1900, 2020],
                        align : ["center", "center", "center"],
                        width: [30, 30, 30],
                        defaultValue : (DATA.travellerBirths[index] ? DATA.travellerBirths[index].split('-') : [1987, 1, 1])
                    }
                };
                var s = new SpinWheel();
                s.setData(options4);
                s.setCancelAction(cancel);
                s.setDoneAction(done);
                setTimeout(function() {
                    model.spinFlag= false;
                    s.open();
                }, 300)

                function cancel() {
                }

                function done() {
                    var results = s.getSelectedValues();
                    var year = results.values[0].substring(0,4);
                    var month = parseInt(results.values[1].substring(0,results.values[1].length-1))<10 ? '0'+parseInt(results.values[1].substring(0,results.values[1].length-1)) : parseInt(results.values[1].substring(0,results.values[1].length-1));
                    var date = parseInt(results.values[2].substring(0,results.values[2].length-1))<10 ? '0'+parseInt(results.values[2].substring(0,results.values[2].length-1)) :parseInt(results.values[2].substring(0,results.values[2].length-1));
                    DATA.travellerBirths[index] = year+'-'+month+'-'+date;
                    $scope.$digest();
                }
            },

            goLogin : function () {
                window.location.href = "//m.lvmama.com/login.htm?service=" + encodeURIComponent(window.location.href);
            },

            showNotice : function() {
                model.showNotice = true;
            },

            closeNotice : function() {
                model.showNotice = false;
            },

            goTuan : function () {
                var result = confirm("还没抢到手哦，确定要离开吗？");
                if (result) {
                    //如果是登录页面跳过来的
                    history.go(0 - routeCounter);
                }
            },

            selectDate : function () {
                DATA.unload = false;
                $location.path('datePicker');
            },

            showType : function (index) {
                model.cardIndex = index;
                model.maskShow = true;
            },

            hideMask : function () {
                model.maskShow = false;
                model.selectCertShow = false;
            },

            selectType : function (evt) {
                var target = evt.target || evt.srcElement;
                model.cardSelect[model.cardIndex] = target.innerHTML;
                DATA.travellerIdTypes[model.cardIndex] = cardType[target.innerHTML];
                model.maskShow = false;
            },

            goBooker : function (type, index) {
                DATA.personType = type;
                DATA.personIndex = index;
                DATA.unload = false;
                // $location.path('bookerChoose');
                localStorage.setItem('ticket_skill_DATA',JSON.stringify(DATA));
                if(type === 'CONTACT'){
                    window.location.href = '//m.lvmama.com/static/coding/v2/userInfo/dist/#/select?' +
                        'playerEdit=specialBooker_edit&' +
                        'fillName=specialBooker_fill&' +
                        'editFillName=specialBooker_editFillName&' +
                        'type=select&' +
                        'selectedName=special_booker_choose&' +
                        'paramName=special_booker&' +
                        'cmType=ticket&' +
                        'personCount=1&backUrl=' + encodeURIComponent(window.location.href);
                }else{
                    window.location.href = '//m.lvmama.com/static/coding/v2/userInfo/dist/#/select?playerEdit=specialTraveller_edit&fillName=specialTraveller_fill&editFillName=specialTraveller_editFillName&type=select&selectedName=special_traveller_choose&paramName=special_traveller&cmType=ticket&personCount='+model.travellers.length+'&backUrl=' + encodeURIComponent(window.location.href);
                }
            },

            goAddress : function () {
                DATA.unload = false;
                $location.path('addressChoose');
            },

            goInvoice: function() {//跳转公共发票
                setInvoice();//发票信息存入缓存
                window.location.href="https://m.lvmama.com/webapp/invoice/#/applyInvoice?addExpressage=true&categoryId="+model.inpTickOrder.bizCategoryId+'&storageName=H5specialTicket&backUrl='+encodeURIComponent(window.location.href);
            },

            getCitySelect : function (e) {
                var s = new SpinWheel();
                var el = e.target || e.srcElement;
                s.setData(options);
                s.setCancelAction(function () {
                    el.value = null;
                });
                s.setDoneAction(function () {
                    var results = s.getSelectedValues();
                    if (results.keys[1] == 0) {
                        $('#triggerErr')[0].click();
                        return true;
                    }
                    el.value = results.values.join(' ');
                    DATA.addressPC = el.value;
                    model.addressProvince = DATA.addressProvince = results.values[0];
                    DATA.addressCity = results.values[1];
                    DATA.provinceId = results.ids[0];
                    DATA.cityId = results.ids[1];
                    !!model.date && countTicketPrice();
                });
                s.open();
            },

            triggerErr : function () {
                return fn.showErr('请选择省份和城市');
            },

            showErr : function (text) {
                model.errorMsg = text;
                model.showErrMsg = true;
                $timeout(function () {
                    model.showErrMsg = false;   
                }, 2000);
                return false;
            },

            showFee : function () {
                if (DATA.visitDates) {
                    model.showFee = !model.showFee;    
                } else {
                    return fn.showErr("请选择游玩日期");
                }            
            },

            readContract : function () {
                model.readContract = !model.readContract;
            },

            goCoupon : function () {
                DATA.unload = false;
                $location.path('coupon');
            },

            runStatis : function (type) {
                cm.runStatis(type);
                setTimeout(function(){
                    window.location.href=model.inpTickOrder.xieyiUrl;
                },500)
            },
            refreshImgCode : function () {
                model.imgCodeUrl= model.imgCodeUrl+'&v='+Math.random();
            },
            getMsgCode : function () {
                if(model.date && telReg.test(DATA.contactMobile)){
                    var param= {
                        mobile : DATA.contactMobile,
                        validateCode : DATA.validateCode,
                        lvsessionid : lvsessionid
                        // actionName : actionName,
                        // validateTemplateId : validateTemplateId
                    };
                    service.getMsgCode(param).then(function (res) {
                        if(res.code==1){
                            countDown();
                            model.countDown = true;
                        }else if(res.code==2){
                            model.isNeedImgCode = true;
                            model.imgCodeUrl= model.imgCodeUrl+'&v='+Math.random();
                            fn.showErr("请输入图形验证码");
                        }else{
                            fn.showErr(res.message);
                        }
                    }, function (err) {
                        fn.showErr('服务器异常，请稍后再试');
                    });
                }else if(!model.date){
                    fn.showErr("请选择游玩时间");
                }else if(!DATA.contactMobile){
                    fn.showErr("请输入预订人的手机号码");
                }else if(!telReg.test(DATA.contactMobile)){
                    fn.showErr("请输入正确的手机号码");
                }
            },
            showInsureNotice: function (type) {
                if(type=='retirement'){
                    model.insureNoticeShow = true;
                    model.currentShowInsure = model.currentReInsure;
                    model.currentShowInsure.descHTML = $sce.trustAsHtml(model.currentShowInsure.desc.replace(/pt/g,'px'));
                }else if(type=='accident'){
                    model.insureNoticeShow = true;
                    model.currentShowInsure = model.currentAcInsure;
                    model.currentShowInsure.descHTML = $sce.trustAsHtml(model.currentShowInsure.desc.replace(/pt/g,'px'));
                }else{
                    model.insureNoticeShow = false;
                }
            },
            choseInsure : function (type){
                if(type == 'accident'){//意外险
                    model.acInsureSelected = !model.acInsureSelected;
                    if(model.acInsureSelected){
                        model.unExpInsurId = model.currentAcInsure.suppGoodsId;
                        model.acInsureIndex = model.currentAcInsure.index;
                    }else{
                        model.unExpInsurId = '';
                        model.acInsureIndex = '';
                    }
                }else if(type == 'retirement'){//退改险
                    model.reInsureSelected = !model.reInsureSelected;
                    if(model.reInsureSelected){
                        model.retreatInsurId = model.currentReInsure.suppGoodsId;
                        model.reInsureIndex = model.currentReInsure.index;
                    }else{
                        model.retreatInsurId = '';
                        model.reInsureIndex = '';
                    }
                } 
                setInsureCach();
                countTicketPrice();
            },
            goChangeInsure :function () {
                if(model.acInsureSelected){
                    $location.search()['acInsureIndex'] = model.acInsureIndex;//当前选中意外险
                }else{
                    $location.search()['acInsureIndex'] = '';
                }
                if(model.reInsureSelected){
                    $location.search()['reInsureIndex'] = model.reInsureIndex;//当前选中意外险
                }else{
                    $location.search()['reInsureIndex'] = '';
                }
                $location.path("insure");
            },
        };





        function setInsureCach(){
            storage.setItem('special_insureSelected',JSON.stringify({
                retirementInsurance: model.retirementInsurance,
                accidentInsurance: model.accidentInsurance,
                currentReInsure: model.currentReInsure,
                currentAcInsure: model.currentAcInsure,
                reInsureIndex: model.reInsureIndex,
                acInsureIndex: model.acInsureIndex,
                reInsureSelected: model.reInsureSelected,
                acInsureSelected: model.acInsureSelected,
                retreatInsurId: model.retreatInsurId,
                unExpInsurId: model.unExpInsurId,
            }))
        }


        function countDown() {
            var timer = $timeout(function () {
                model.second = model.second - 1;
                if (model.second > 0) {
                    countDown();
                } else {
                    $timeout.cancel(timer);
                    model.countDown = false;
                    model.second = 60;
                }
            }, 1000);
        }

        //快递费
        !!DATA.visitDates && !!DATA.addressPC 
            && (function () {
                var obj = {
                    quantities : model.quantities,
                    visitDates : model.date,
                    provinceId : DATA.provinceId || null,
                    cityId : DATA.cityId || null,
                    unExpInsurId : model.unExpInsurId,
                    retreatInsurId : model.retreatInsurId,
                    invoiceExpressGoodsId : model.invoiceExpressGoodsId || ''
                };
                DATA.goodsIds && (obj.goodsIds = DATA.goodsIds);
                service.countTicketPrice(obj).then(function (res) {
                    var data = res.data;
                    model.expressTips = data.expressTips;
                    model.expressPriceToYuan = data.expressPriceToYuan;
                    model.unExpInsurQuantity = data.unExpIsurQuantity || '';//意外险数量
                    //if (data.expressGoodsMaps.length > 0) {
                    DATA.expGoodsId = [];
                    if (cm.isNotEmpty(data.expressGoodsMaps)) {
                        DATA.expGoodsId[0] = data.expressGoodsMaps[0].goods.suppGoodsId;
                        DATA.hasExpress = true;//有快递费用
                    } else {
                        DATA.hasExpress = false;//无快递费用
                    }
                    if(model.invoiceExpressGoodsId){
                        DATA.expGoodsId.push(model.invoiceExpressGoodsId);
                    }
                }, function (err) {
                    ;
                });    
            }());
        $scope.$on('$routeChangeStart', function (evt, next, current) {
            DATA.quantities = model.quantities;
            if(model.oughtPay)
                DATA.oughtPay = model.oughtPay || 0;
            DATA.unload = false;
            setData('special_order', DATA);
        });


        function getUser() {
            /*
             * 8.0.0增加匿名下单逻辑
             * 判断登录状态，未登录则调用图形、短信验证码开关
             * */
            service.getUser().then(function (res) {
                lvsessionid = cm.getCookie('lvsessionid') || '';
                if(res.code == 1){
                    model.isLogin=true;
                }else{
                    //调用开关
                    // checkValidateCode();
                }  
                model.imgCodeUrl = '//m.lvmama.com/usso/router/rest.do?method=api.com.validateCode.createNewValidateCode&version=1.0.0&lvversion=7.10.3&lvsessionid='+lvsessionid;
                getInputInfo();
            }, function (err) {
                model.imgCodeUrl = '//m.lvmama.com/usso/router/rest.do?method=api.com.validateCode.createNewValidateCode&version=1.0.0&lvversion=7.10.3&lvsessionid='+lvsessionid;
                //调用开关
                // checkValidateCode()
                getInputInfo();
            })
        }

        function checkValidateCode() {
            //分别调用两个验证码的开关
            model.imgCodeUrl = '//m.lvmama.com/usso/router/rest.do?method=api.com.validateCode.createNewValidateCode&version=1.0.0&lvversion=7.10.3&validateTemplateId='+ validateTemplateId +'&lvsessionid='+lvsessionid;
            service.checkImgCode().then(function (res) {
                if(res.code==1){
                   model.isNeedImgCode = res.data.needImageAuthCode; 
                }
            })

            service.isNeedMsgAuthCode().then(function (res) {
                if(res.code==1){
                    model.isNeedMsgAuthCode = res.data.isNeed=='Y' ? true : false; 
                }
            })
        }

        function getInputInfo () {
            /*
             * 调用inputTicketOrder接口，获取页面展示信息包括：
             * 产品名称、单价、“送保险”、入园须知、预订人的姓名、手机号、身份证、邮箱、条款名称、条款内容¹
             * */
            service.inputTicketOrder({

            }).then(function (res) {
                if(res.code!=1){
                    return;
                }
                model.entityTicketFlag = res.data.entityTicketFlag;
                model.entityTicketFlag && init();

                if (!("travellerNames" in DATA)) {
                    DATA.travellerNames = [];
                    DATA.travellerMobiles = [];
                    DATA.travellerFirstNames = [];
                    DATA.travellerLastNames = [];
                    DATA.travellerEmails = [];
                    DATA.travellerIdTypes = [];
                    DATA.travellerIdNos = [];
                    DATA.travellerGenders = [];
                    DATA.travellerBirths = [];
                    DATA.IdTypesCn = [];
                }
                if(cm.isNotEmpty(res.data)&&cm.isNotEmpty( res.data.seckillRuleId)){
                    model.seckillPk = res.data.seckillRuleId;
                }
                if(cm.isNotEmpty(res.data)&&cm.isNotEmpty(res.data.saleChannel)){
                    model.saleChannel = res.data.saleChannel;
                }
                //$location.search()['saleChannel'] = res.data.saleChannel;
                $location.search()['saleChannel'] =  model.saleChannel;
                var data = res.data, detail, secTag;
                model.inpTickOrder = data;

                model.allowApply= res.data.isInvoice && res.data.showInvoice;//8.0.0 是否需要开发票
                if(!storage.getItem('H5specialTicket_invoiceApply')){
                    model.invoiceBasicInfoVo= res.data.orderPersonInvoiceInfoVo || {};//8.0.0 上次填写的发票基本信息
                    model.invoiceBasicInfoVo.invoiceType= 0;
                }

                if (cm.getUrlParam('combProductId')) {
                    detail = model.inpTickOrder.combProductDetailVo;
                    model.packageCount = [];
                    DATA.goodsIds = [];
                    for (var key in detail.clientTicketGoodsVos) {
                        DATA.goodsIds.push(detail.clientTicketGoodsVos[key].suppGoodsId);
                        model.packageCount.push(detail.clientTicketGoodsVos[key].packageCount);
                    }
                } else {
                    if(cm.isNotEmpty(model.inpTickOrder)&&cm.isNotEmpty(model.inpTickOrder.clientTicketGoodsDetailVo)){
                        detail = model.inpTickOrder.clientTicketGoodsDetailVo;
                    }
                    DATA.goodsIds = cm.getUrlParam('goodsIds');
                }

                if (detail) {
                    model.clientDetail = detail;//
                    model.priceIncludes = textFormat(detail.priceIncludes);
                    model.beforeTralNotice = textFormat(detail.beforeTralNotice);
                    model.importantTips = textFormat(detail.importantTips);
                    model.refundNotice = textFormat(detail.refundNotice);
                    !DATA.quantities && (model.quantities = detail.minQuantity);
                    secTag = detail.secondTagItems;

                    for(var key in secTag) {

                        if (secTag[key].tagType === "refund") {
                            model.tagType = "refund";
                            model.secTagItemName = secTag[key].name;
                            break;
                        }
                    }
                }
                //校验 强跳优惠券页面
                if(cm.isNotEmpty(data)&&cm.isNotEmpty(data.hasDiscountCoupon)){
                    DATA.hasDiscountCoupon = model.hasDiscountCoupon = data.hasDiscountCoupon;
                }
                DATA.price && model.clientDetail && (model.clientDetail.sellPrice = DATA.price);
                if (!DATA.contactName&&cm.isNotEmpty(data)) {
                    if(cm.isNotEmpty(data)&&cm.isNotEmpty(data.contactName)){
                        DATA.contactName = data.contactName;
                    }
                    DATA.contactMobile = data.contactMobile || '';
                    // DATA.contactEmail = data.contactEmail;
                    DATA.contactIdNo = data.contactIdNo || '';
                }




                DATA.personType === "PLAYER" && (model.cardSelect = DATA.IdTypesCn);
                model.clientDetail && countTicketPrice();
                getInputOptions();
                // checkTicketOrder();
                

                if (data) {
                    setTimeout(function () {
                        var clientVo;
                        if(data.clientTicketGoodsDetailVo){
                            clientVo = data.clientTicketGoodsDetailVo;
                        }else{
                            clientVo = data.combProductDetailVo;
                        }
                        var pType = model.saleChannel == 'groupbuy' ? '团购' : '秒杀';
                        var cmPType = data.cmProductType == 'INNERLINE' ? '国内' : '出境';
                        statisticsUtil.losc.cmCreatePageviewTag('order', {
                            pi:clientVo.productId,
                            ci:data.bizCategoryId,
                            ss:true
                        })

                        statisticsUtil.siteIDs = ['JQWL','TM'];
                        if (typeof statisticsUtil != 'undefined') {
                            statisticsUtil.execStatis('page', {
                                pi: data.cmInfoVO.pageId,
                                cg: data.cmInfoVO.categoryId,
                                attributes: '-_--_--_-其他页面'
                            });
                        }

                    });
                }
            }, function (err) {
                ;
            });
        };


        function getInputOptions () {
            service.getInputOptions({
                goodsIds: DATA.goodsIds
            }).then(function (res) {

                if (res.data) {
                    model.needOptions = res.data.option;
                    var certificate = ['needIdcard','passportFlag','passFlag','twPassFlag','twResidentFlag','hkResidentFlag'];//客户端提供的证件顺序
                    var certArr = ['身份证','护照','港澳通行证','台湾通行证','台胞证','回乡证'];//与上面对应
                    model.ableCertTypes = [];
                    model.certName = model.certName || '';
                    for(var i=0;i<certificate.length;i++){
                        if(model.needOptions[certificate[i]]){
                            model.ableCertTypes.push(certArr[i]);
                            if(!model.certName){
                                model.certName = certArr[i];
                                DATA.contactIdType = cardType[certArr[i]];
                                if(['HUZHAO','GANGAO','TAIBAO'].indexOf(DATA.contactIdType) > -1){
                                    model.specialCert = true;
                                }else{
                                    model.specialCert = false;
                                }
                            }
                        }
                    }

                    // 7.10.2 接入新本游玩人
                    var special_booker = JSON.parse(storage.getItem('special_booker'));
                    if(special_booker){
                        DATA.contactName = special_booker[0].receiverName;
                        DATA.contactMobile = special_booker[0].mobileNumber;
                        DATA.contactEmail = special_booker[0].email;
                        DATA.contactIdNo = special_booker[0].certNo;
                        if(model.ableCertTypes.indexOf(special_booker[0].certType)>-1){
                            model.certName = special_booker[0].certType;
                            DATA.contactIdType = cardType[special_booker[0].certType];
                        }
                        storage.setItem('special_booker_choose',JSON.stringify([special_booker[0].receiverId]));
                    }
                    // storage.removeItem('special_booker'); //取完就删，防止下次进入覆盖接口默认的预定人

                    // 7.10.2 新版游玩人
                    storage.removeItem('specialBooker_fill'); //先清除上次的预订人必填项
                    var specialBooker_fill = {
                        birthFlag: model.specialCert,
                        emailFlag: model.specialCert,
                        faxFlag: model.needOptions.faxFlag ? true : false,
                        firstNameFlag: model.needOptions.firstNameFlag ? true : false,
                        fullNameFlag: true, //与接口返回信息无关，必填
                        genderFlag: model.needOptions.genderFlag ? true : false,
                        hkResidentFlag: model.needOptions.hkResidentFlag ? true : false,
                        idFlag: model.needOptions.needIdcard ? true : false,
                        lastNameFlag: model.needOptions.lastNameFlag ? true : false,
                        mobileFlag: true, //与接口返回信息无关，必填
                        nationalityFlag: model.needOptions.nationalityFlag ? true : false,
                        passFlag: model.needOptions.passFlag ? true : false,
                        passportFlag: model.needOptions.passportFlag ? true : false,
                        phoneFlag: model.needOptions.phoneFlag ? true : false,
                        twPassFlag: model.needOptions.twPassFlag ? true : false,
                        twResidentFlag: model.needOptions.twResidentFlag ? true : false,
                        peopleTypeFlag : model.needOptions.peopleTypeFlag ? true : false
                    };
                    storage.setItem('specialBooker_fill',JSON.stringify([specialBooker_fill]));

                } else {
                    fn.showErr('服务器异常，请稍后再试');
                }
            });
        };

        function countTicketPrice(type) {
            /*
             * 计算总价
             * */
            var max = +model.clientDetail.maxQuantity;
            if(type =="add"){
                if(model.quantities < max) {
                    model.quantities++ ;
                    DATA.quantities = model.quantities;
                    model.canSub = true;
                    if (model.quantities == max) {
                        model.canAdd = false;
                    }
                } else {
                    model.canAdd = false;
                    return fn.showErr('预定数超过最大起订量');
                }
            }else if(type =="subtract"){
                if(model.quantities > 1){
                    model.quantities--;
                    DATA.quantities = model.quantities;
                    model.canSub = true;
                    model.canAdd = true;
                    model.quantities == 1 && (model.canSub = false);
                }else{
                    model.canSub = false;
                    return fn.showErr('预定数不能小于1');
                }
            }
            //初始化时，赋值“应付金额”
            if (!type && DATA.oughtPay) {
                model.oughtPay = DATA.oughtPay;
            }
            //
            if (!!DATA.visitDates) {
                model.canOrder = false;
                model.canSub = true;
                model.quantities == 1 && (model.canSub = false);
                var obj = {
                    quantities : model.quantities,
                    visitDates : model.date,
                    provinceId : DATA.provinceId || null,
                    cityId : DATA.cityId || null,
                    unExpInsurId : model.unExpInsurId,
                    retreatInsurId : model.retreatInsurId,
                    invoiceExpressGoodsId : model.invoiceExpressGoodsId || ''
                };
                if (cm.getUrlParam('combProductId')) {
                    var combQuantities = [];
                    var combVisitDates = [];
                    for(var key in DATA.goodsIds){
                        combQuantities[key] = model.quantities * model.packageCount[key];
                        combVisitDates[key] = model.date;
                    }
                    obj.quantities = combQuantities;
                    obj.visitDates = combVisitDates;
                }

                DATA.goodsIds && (obj.goodsIds = DATA.goodsIds);
                service.countTicketPrice(obj,model.saleChannel).then(function (res) {
                    if(res.code!=1){
                        fn.showErr(res.message || '计算价格接口异常');
                        return;
                    }
                    var data = res.data;
                    model.totalPrice = data.oughtPay;
                    model.promotionList = data.promotionList;
                    model.hasProm = +data.promotionAmountToYuan > 0;
                    model.oughtPay = DATA.oughtPay = data.oughtPay;
                    model.promotionAmountToYuan = data.promotionAmountToYuan;
                    model.expressTips = data.expressTips;
                    model.expressPriceToYuan = data.expressPriceToYuan;
                    model.unExpInsurQuantity = data.unExpIsurQuantity || model.quantities;//意外险数量
                    DATA.expGoodsId = [];
                    if (cm.isNotEmpty(data.expressGoodsMaps)) {
                        DATA.expGoodsId[0] = data.expressGoodsMaps[0].goods.suppGoodsId;
                        DATA.hasExpress = true;//有快递费用
                    } else {
                        DATA.hasExpress = false;//无快递费用
                    }
                    if(model.invoiceExpressGoodsId){
                        DATA.expGoodsId.push(model.invoiceExpressGoodsId);
                    }
                    model.canOrder = true;
                    getInsurance();
                }, function (err) {
                    fn.showErr('计算价格接口异常');
                });    
            }
        };
        function checkTicketOrder (type) {
            /*
             * 获取是否需要填写游玩人,需要的话生成DOM。此接口再提交时调用
             * */
            var obj = {
                quantities: model.quantities,
            };
            if(model.unExpInsurId){
                obj.unExpInsurId = model.unExpInsurId;
                obj.unExpInsurQuantity = model.unExpInsurQuantity;
            }
            if(model.retreatInsurId){
                obj.retreatInsurId = model.retreatInsurId
            }

            DATA.goodsIds && (obj.goodsIds = DATA.goodsIds);
            DATA.visitDates && (obj.visitDates = DATA.visitDates);

            if (cm.getUrlParam('combProductId')) {
                var combQuantities = [];
                var combVisitDates = [];
                for(var key in DATA.goodsIds){
                    combQuantities[key] = model.quantities * model.packageCount[key];
                    combVisitDates[key] = model.date;
                }
                obj.quantities = combQuantities;
                obj.visitDates = combVisitDates;
            }

            service.checkTicketOrder(obj,model.saleChannel).then(function (res) {
                var traveller, len, index;
                if(res.code==1) {
                    DATA.travellerNum = len = res.data.travellers.length;
                    if(!res.data.needTravellerFlag){//不需要全部游玩人
                            DATA.travellerNames = [];
                            DATA.travellerMobiles = [];
                            DATA.travellerFirstNames = [];
                            DATA.travellerLastNames = [];
                            DATA.travellerEmails = [];
                            DATA.travellerGenders = [];
                            DATA.travellerBirths = [];
                            DATA.travellerIdTypes = [];
                            DATA.travellerIdNos = [];
                        if(type){
                            fn.createOrder();
                        }
                        return;
                    }
                    model.travellers = res.data.travellers;

                    // 7.10.2 接入新版游玩人
                    var specialTraveller_fill = [];
                    res.data.travellers.forEach(function(tra){
                        tra.peopleTypeFlag = tra.occupType;
                        delete  tra.occupType;
                        specialTraveller_fill.push(tra);
                    })
                    

                        model.cardType = [];
                        traveller = model.travellers[0];
                        traveller.idFlag && model.cardType.push('身份证');
                        traveller.passportFlag && model.cardType.push('护照');
                        traveller.passFlag && model.cardType.push('港澳通行证');
                        traveller.twPassFlag && model.cardType.push('台湾通行证');
                        traveller.twResidentFlag && model.cardType.push('台胞证');
                        traveller.hkResidentFlag && model.cardType.push('回乡证');
                        !model.cardType.length && (model.needCert = false);
                        for (var i = 0; i < len; i++) {
                            if (!model.cardSelect[i] || model.cardType.indexOf(model.cardSelect[i])==-1) {
                                //或选择的游玩人证件类型不在可选范围
                                model.cardSelect[i] = model.cardType[0];
                                DATA.travellerIdTypes[i] = cardType[model.cardType[0]];
                                DATA.travellerIdNos[i] = '';
                            }
                        }
                        if (!storage.getItem('specialTraveller_fill')) {
                            //将预订人信息带入游玩人1
                            DATA.travellerNames[0] = DATA.contactName;
                            DATA.travellerMobiles[0] = DATA.contactMobile;
                            DATA.travellerFirstNames[0] = DATA.contactFirstName;
                            DATA.travellerLastNames[0] = DATA.contactLastName;
                            DATA.travellerEmails[0] = DATA.contactEmail;
                            DATA.travellerGenders[0] = DATA.contactGender;
                            DATA.travellerBirths[0] = DATA.contactBirth;
                            if (model.cardType.indexOf(model.certName)>-1) {
                                //预订人证件类型在可选范围
                                DATA.travellerIdTypes[0] = DATA.contactIdType;
                                DATA.travellerIdNos[0] = DATA.contactIdNo;
                                model.cardSelect[0] = model.certName;
                            }
                        }

                        // 7.10.2 接入新版游玩人
                        var special_traveller = JSON.parse(storage.getItem('special_traveller'));

                        if(special_traveller){
                            var len = special_traveller.length;
                            for(var x=0;x<len;x++){
                                DATA.travellerNames[x] = special_traveller[x].receiverName;
                                DATA.travellerMobiles[x] = special_traveller[x].mobileNumber;
                                DATA.travellerFirstNames[x] = special_traveller[x].firstName;
                                DATA.travellerLastNames[x] = special_traveller[x].lastName;
                                DATA.travellerEmails[x] = special_traveller[x].email;
                                model.cardSelect[x] = special_traveller[x].certType;
                                DATA.travellerIdNos[x] = special_traveller[x].certNo;
                                DATA.travellerGenders[x] = special_traveller[x].receiverGender;
                                DATA.travellerBirths[x] = special_traveller[x].birthday;
                            }
                            var chooseArr = [];
                            special_traveller.forEach(function (travel) {
                                if(travel.receiverId){
                                    chooseArr.push(travel.receiverId);
                                }
                            })
                            storage.setItem('special_traveller_choose',JSON.stringify(chooseArr));//已选游玩人
                        }

                        storage.setItem('specialTraveller_fill',JSON.stringify(specialTraveller_fill));


                        if(DATA.travellerNames.length>=model.travellers.length && type){
                            DATA.travellerNames.length = model.travellers.length;
                            DATA.travellerMobiles.length = model.travellers.length;
                            DATA.travellerFirstNames.length = model.travellers.length;
                            DATA.travellerLastNames.length = model.travellers.length;
                            DATA.travellerEmails.length = model.travellers.length;
                            DATA.travellerGenders.length = model.travellers.length;
                            DATA.travellerBirths.length = model.travellers.length;
                            DATA.travellerIdTypes.length = model.travellers.length;
                            DATA.travellerIdNos.length = model.travellers.length;
                            model.cardSelect.length = model.travellers.length;
                            fn.createOrder();
                        }

                }else{
                    DATA.travellerNum = 0;
                    fn.showErr(res.errorMessage);
                }
                setData('checkRes', res);
                setData('special_orderInit', true);
                (index = DATA.personIndex) >= 0 && (model.cardSelect[index] = DATA.IdTypesCn[index]);
                model.canOrder = true;
            }, function (err) {
                alert(err);
            });
        };

        function createOrder() {
            //下单
            var validArr = [
                {check : DATA.visitDates, err : "请选择游玩日期"},
                {check : model.readContract, err : '你需要同意' + model.inpTickOrder.xieyiName + '才能预订哦'}
            ];
            DATA.quantities = model.quantities;
            if (DATA.travellerNames) {
                for (var i = 0, len = model.cardSelect.length; i < len; i += 1) {
                    DATA.travellerIdTypes[i] = cardType[model.cardSelect[i]];
                }
            }

            if(model.brandStoreId){
                DATA.brandTag = true;
                DATA.brandStoreId = model.brandStoreId;
            }

            DATA.unExpInsurId = model.unExpInsurId;
            DATA.retreatInsurId = model.retreatInsurId;
            DATA.unExpInsurQuantity = model.unExpInsurQuantity;


            if (service.validate(model, 'errorMsg', 'showErrMsg', validArr)) {
                var quantities = DATA.quantities,
                      visitDates = DATA.visitDates;
                DATA.address = DATA.addressName;
                DATA.seckillPk = model.seckillPk;
                DATA.saleChannel = model.saleChannel;
                delete DATA.addressPC;

                if(!model.specialCert){
                    delete DATA.contactGender;
                    delete DATA.contactBirth;
                }

                addInvoiceParams();//添加发票参数

                console.log(DATA);

                service.createOrder(DATA,model).then(function (res) {
                    if (res.code == 1) {
                        storage.removeItem('datePickerData');
                        storage.removeItem('ticket_skill_DATA');
                        storage.removeItem('special_booker_choose');
                        storage.removeItem('specialBooker_fill');
                        storage.removeItem('special_booker');
                        storage.removeItem('specialTraveller_fill');
                        storage.removeItem('special_traveller');
                        storage.removeItem('special_traveller_choose');
                        storage.removeItem('H5specialTicket_invoiceApply');
                        service.postlosc(res.data.orderId, function (r) {
                            location.href = "https://m.lvmama.com/lvwappay/vorder_success.htm?orderId=" + res.data.orderId;
                        });
                    } else {
                        DATA.quantities = quantities;
                        DATA.visitDates = visitDates;
                    }
                });
            }

            function _getParam (name) {
              var reg = new RegExp("&*" + name + "=([^\?&]*)&*", 'g'),
                    search = location.search.substr(1),
                    mArr = [], len;
              search.replace(reg, function (match, index) {
                mArr.push(match.split('=')[1].replace(/&|$/g, ''));
              });
              if (len = mArr.length)
                  return mArr;
              return null;
          };
        }

        function getData (name) {
            return dataManager.getData(name);
        };

        function setData (name, value) {
            dataManager.setData(name, value);
            return getData(name);
        };

        function textFormat (text) {
            return $sce.trustAsHtml((text || "").replace(/\n/g, '<br>'));
        }

        function init () {
            service.getCity().then(function (res) {
                options = _formatData(res.data.tree);
            }, function (err) {
                ;
            });
            function _formatData (data) {
                var dataObj = {"title": "选择所在地区", "isActive": true, "colCount": 2, "colOptions": [
                      {
                          "widthPercent": 50,
                          "align": "center",
                          "defaultCode": 2000
                      },
                      {
                          "widthPercent": 50,
                          "align": "center",
                          "defaultCode": 2000
                      }
                  ]};
                var arr = [];
                var index = 2000;
                for (var i = 1, len = data.length; i < len; i += 1) {
                    var obj = {};
                    obj.key = data[i].key;
                    obj.code = index;
                    obj.name = data[i].value;
                    obj.column = 1;
                    obj.pCode = null;
                    arr.push(obj);
                    for (var j = 0, jlen = data[i].list.length; j < jlen; j += 1) {
                        var obj = {};
                        obj.key = data[i].list[j].key || 0;
                        obj.name = data[i].list[j].value;
                        obj.column = 2;
                        obj.pCode = index;
                        arr.push(obj);
                    }
                    index++;
                }
                dataObj.data = arr;
                return dataObj;
            };
        };

        function setInvoice() {//将下单页回填发票信息存入缓存传递到公共模块
            if(!storage.getItem('H5specialTicket_invoiceApply') && model.invoiceBasicInfoVo.contactName){
                model.invoiceBasicInfoVo.fullName = model.invoiceBasicInfoVo.contactName;
                model.invoiceBasicInfoVo.invoiceType = 1;
                storage.setItem('H5specialTicket_invoiceApply',JSON.stringify(model.invoiceBasicInfoVo));
            }
        }

        function getInvoice(){//将发票公共模块信息同步到下单页
            var invoiceBasicInfoVo= storage.getItem('H5specialTicket_invoiceApply') || '{}';
            if(JSON.parse(invoiceBasicInfoVo).fullName && model.invoiceBasicInfoVo.invoiceType){
                model.invoiceBasicInfoVo = invoiceBasicInfoVo;
                model.invoiceBasicInfoVo.contactName = model.invoiceBasicInfoVo.fullName;
                model.invoiceExpressGoodsId = model.invoiceBasicInfoVo.invoiceType==1 ? model.invoiceBasicInfoVo.expressage.invoiceFeeId : '';//发票快递费id
                storage.removeItem('H5specialTicket_invoiceApply');
            }
        }
 
        function addInvoiceParams() {
            if(model.invoiceBasicInfoVo.invoiceType){
                DATA.title= model.invoiceBasicInfoVo.title;
                DATA.content= model.invoiceBasicInfoVo.content;
                DATA.purchaseWay= model.invoiceBasicInfoVo.purchaseWay;
                DATA.taxNumber= model.invoiceBasicInfoVo.taxNumber;
                DATA.buyerAddress= model.invoiceBasicInfoVo.buyerAddress;
                DATA.buyerTelephone= model.invoiceBasicInfoVo.buyerTelephone;
                DATA.bankAccount= model.invoiceBasicInfoVo.bankAccount;
                DATA.accountBankAccount= model.invoiceBasicInfoVo.accountBankAccount;
                DATA.province= model.invoiceBasicInfoVo.province;
                DATA.city= model.invoiceBasicInfoVo.city;
                DATA.district= model.invoiceBasicInfoVo.district;
                DATA.street= model.invoiceBasicInfoVo.street;
                DATA.postalCode= model.invoiceBasicInfoVo.postalCode;
                DATA.fullName= model.invoiceBasicInfoVo.contactName;
                DATA.mobile= model.invoiceBasicInfoVo.mobile;
                DATA.invoiceType= model.invoiceBasicInfoVo.invoiceType;
                DATA.receiverEmail= model.invoiceBasicInfoVo.receiverEmail;
            }
        }

        function getInsurance() {
            if(cm.getUrlParam('combProductId') || DATA.visitDates==storage.getItem('special_visitDate')){
                return;
            }
            
            var param = {
                productId: cm.getUrlParam('productId'),
                suppGoodsIds: cm.getUrlParam('goodsIds'),
                vistorDate: DATA.visitDates,
            };
            storage.setItem('special_visitDate',DATA.visitDates);
            service.getInsurance(param).then(function (res) {
                console.log(res);
                // var res = {
                //     data: {
                //         "accidentInsurance": [
                //            {
                //                "desc": "意外身故、残疾、烧伤：200,000元\r\n意外及突发急性病医疗：20,000元（100元免赔，100%赔付）\r\n意外住院津贴：150元/天（3天免赔，最多赔偿180天）\r\n突发急性疾病身故：50,000元\r\n高原反应:包含\r\n\r\n保障期限：指定日内从被保险人进入景区开始到离开景区为止。\r\n投保年龄：1岁—80周岁；70-80周岁被保险人保险责任为上述保险金额的一半；任何不满10周岁的被保险人，其死亡保险金额不得超过人民币20万元；已满10周岁但未满18周岁的被保险人，其死亡保险金额不得超过人民币50万元。\r\n",
                //                "freeFlag": false,
                //                "insuranceName": "人保景区意外险-20万元尊贵型",
                //                "retreatFlag": false,
                //                "sellPrice": 7,
                //                "suppGoodsId": 967678
                //            },
                //            {
                //                "desc": "意外身故、残疾、烧伤：100,000元\r\n意外及突发急性病医疗：10,000元（100元免赔，100%赔付）\r\n意外住院津贴：50元/天（3天免赔，最多赔偿180天)\r\n突发急性疾病身故：20,000元\r\n高原反应:包含\r\n\r\n保障期限：指定日内从被保险人进入景区开始到离开景区为止。\r\n投保年龄：1岁—80周岁；70-80周岁被保险人保险责任为上述保险金额的一半；任何不满10周岁的被保险人，其死亡保险金额不得超过人民币20万元；已满10周岁但未满18周岁的被保险人，其死亡保险金额不得超过人民币50万元\r\n",
                //                "freeFlag": false,
                //                "insuranceName": "人保景区意外险-10万元基础型",
                //                "retreatFlag": false,
                //                "sellPrice": 3,
                //                "suppGoodsId": 967676
                //            },
                //            {
                //                "desc": "意外身故、残疾、烧伤：：150,000元\r\n意外及突发急性病医疗：15,000元（100元免赔，100%赔付）\r\n意外住院津贴：100元/天（3天免赔，最多赔偿180天)\r\n突发急性疾病身故：30,000元\r\n高原反应:包含\r\n\r\n保障期限：指定日内从被保险人进入景区开始到离开景区为止。\r\n投保年龄：1岁—80周岁；70-80周岁被保险人保险责任为上述保险金额的一半；任何不满10周岁的被保险人，其死亡保险金额不得超过人民币20万元；已满10周岁但未满18周岁的被保险人，其死亡保险金额不得超过人民币50万元\r\n",
                //                "freeFlag": false,
                //                "insuranceName": "人保景区意外险-15万元特惠型",
                //                "retreatFlag": false,
                //                "sellPrice": 5,
                //                "suppGoodsId": 967677
                //            }
                //        ],
                //        "retirementInsurance": [
                //            {
                //                "desc": "意外身故、残疾、烧伤：200,000元\r\n意外及突发急性病医疗：20,000元（100元免赔，100%赔付）\r\n意外住院津贴：150元/天（3天免赔，最多赔偿180天）\r\n突发急性疾病身故：50,000元\r\n高原反应:包含\r\n\r\n保障期限：指定日内从被保险人进入景区开始到离开景区为止。\r\n投保年龄：1岁—80周岁；70-80周岁被保险人保险责任为上述保险金额的一半；任何不满10周岁的被保险人，其死亡保险金额不得超过人民币20万元；已满10周岁但未满18周岁的被保险人，其死亡保险金额不得超过人民币50万元。\r\n",
                //                "freeFlag": false,
                //                "insuranceName": "人保景区意外险-20万元尊贵型",
                //                "retreatFlag": false,
                //                "sellPrice": 7,
                //                "suppGoodsId": 967678
                //            },
                //            {
                //                "desc": "意外身故、残疾、烧伤：100,000元\r\n意外及突发急性病医疗：10,000元（100元免赔，100%赔付）\r\n意外住院津贴：50元/天（3天免赔，最多赔偿180天)\r\n突发急性疾病身故：20,000元\r\n高原反应:包含\r\n\r\n保障期限：指定日内从被保险人进入景区开始到离开景区为止。\r\n投保年龄：1岁—80周岁；70-80周岁被保险人保险责任为上述保险金额的一半；任何不满10周岁的被保险人，其死亡保险金额不得超过人民币20万元；已满10周岁但未满18周岁的被保险人，其死亡保险金额不得超过人民币50万元\r\n",
                //                "freeFlag": false,
                //                "insuranceName": "人保景区意外险-10万元基础型",
                //                "retreatFlag": false,
                //                "sellPrice": 1233,
                //                "suppGoodsId": 967676
                //            },
                //            {
                //                "desc": "意外身故、残疾、烧伤：：150,000元\r\n意外及突发急性病医疗：15,000元（100元免赔，100%赔付）\r\n意外住院津贴：100元/天（3天免赔，最多赔偿180天)\r\n突发急性疾病身故：30,000元\r\n高原反应:包含\r\n\r\n保障期限：指定日内从被保险人进入景区开始到离开景区为止。\r\n投保年龄：1岁—80周岁；70-80周岁被保险人保险责任为上述保险金额的一半；任何不满10周岁的被保险人，其死亡保险金额不得超过人民币20万元；已满10周岁但未满18周岁的被保险人，其死亡保险金额不得超过人民币50万元\r\n",
                //                "freeFlag": false,
                //                "insuranceName": "人保景区意外险-15万元特惠型",
                //                "retreatFlag": false,
                //                "sellPrice": 5,
                //                "suppGoodsId": 9671677
                //            }
                //        ],
                //     }
                // }

                if(res.code == 1){
                    model.retirementInsurance = addIndex(bubbleSort(res.data.retirementInsurance));//价格从大到小排序,添加序号属性
                    model.accidentInsurance = addIndex(bubbleSort(res.data.accidentInsurance));
                    model.reInsureSelected = false;
                    model.currentReInsure = model.retirementInsurance[model.retirementInsurance.length-1];//价格最低
                    model.acInsureSelected = false;
                    model.currentAcInsure = model.accidentInsurance[model.accidentInsurance.length-1];//价格最低
                    storage.setItem('special_insures', JSON.stringify(           
                        {
                            accidentInsurance : model.accidentInsurance,
                            retirementInsurance : model.retirementInsurance
                        }
                    ));
                    setInsureCach();
                }else{
                    fn.showErr(res.message || '获取保险数据异常');
                }  
            }, function (err) {
                fn.showErr('获取保险接口异常！');
            })
        }

        // 冒泡排序
        function bubbleSort(array) {
            var i = 0,
            len = array.length,
            j, d;
            for (; i < len; i++) {
                for (j = 0; j < len; j++) {
                    if (array[i].sellPrice > array[j].sellPrice) {
                        d = array[j];
                        array[j] = array[i];
                        array[i] = d;
                    }
                }
            }
            return array;
        }

        function addIndex(arr){
            for(var i=0;i<arr.length;i++){
                arr[i].index = i;
            }
            return arr;
            
        }

        function getInsureInfo(){
            if(DATA.visitDates==storage.getItem('special_visitDate')){
                var insureData = JSON.parse(localStorage.getItem('special_insureSelected'));
                if(insureData){
                    //刷新填单页 回填数据
                    var insureSelected = JSON.parse(storage.getItem('special_insureSelected'));
                    if(insureSelected){
                        model.retirementInsurance = insureSelected.retirementInsurance;
                        model.accidentInsurance = insureSelected.accidentInsurance;
                        model.currentReInsure= insureSelected.currentReInsure;
                        model.currentAcInsure= insureSelected.currentAcInsure;
                        model.reInsureIndex= insureSelected.reInsureIndex;
                        model.acInsureIndex= insureSelected.acInsureIndex;
                        model.reInsureSelected= insureSelected.reInsureSelected;
                        model.acInsureSelected= insureSelected.acInsureSelected;
                        model.retreatInsurId= insureSelected.retreatInsurId;
                        model.unExpInsurId= insureSelected.unExpInsurId;
                    }

                    //获取，同步更多保险页选择的结果
                    var acIndex = parseInt($location.search()['acInsureIndex']);
                    var reIndex = parseInt($location.search()['reInsureIndex']);
                    if(acIndex>=0&&model.acInsureSelected){
                        model.acInsureSelected = true;
                        model.acInsureIndex = acIndex;
                        model.currentAcInsure = model.accidentInsurance[acIndex]; 
                        model.unExpInsurId = model.accidentInsurance[acIndex].suppGoodsId;
                    }else{//不选意外险
                        model.unExpInsurId = model.unExpInsurId || '';
                        model.acInsureSelected = model.acInsureSelected || false;
                        model.acInsureIndex = model.acInsureIndex || '';
                    }

                    if(reIndex>=0&&model.reInsureSelected){//有效的保险下标
                        model.reInsureSelected = true;
                        model.reInsureIndex = reIndex;
                        model.currentReInsure = model.retirementInsurance[reIndex]; 
                        model.retreatInsurId = model.retirementInsurance[reIndex].suppGoodsId;
                    }else{//不选退改险
                        model.retreatInsurId = model.retreatInsurId || '';
                        model.reInsureSelected = model.reInsureSelected || false;
                        model.reInsureIndex = model.reInsureIndex || '';
                    }
                }
            }

        


        }

        getInsureInfo();
        getUser();
        getInvoice();

    }]);


orderControllers.controller("errCtrl",['$rootScope',
    function($rootScope) {
        $rootScope.showErrMsg = false;
    }]);
/**
 * Created by zhangfeng on 2015/7/29.
 */
orderServices.factory("ticketOrderInputService",['cm','$location',function(cm,$location){
    var commonParams=cm.commonParams;
    var obj = {
        orderFlg : false,
        chkTickFlg : false
    };

    function removeVoid0 (obj) {
        var toString = {}.toString;
        for (var key in obj) {
            if (toString.call(obj[key]) == '[object Array]') {
                for (var i = 0, len = obj[key].length; i < len; i += 1) {
                    try {
                        var o = obj[key][i];
                        if (o != void 0 || o != null) {
                            break;
                        }
                    } catch (err) {
                        delete obj[key];
                        break;
                    }
                    delete obj[key];
                }
            } else {
                if (obj[key] === void 0 || obj[key] === null) {
                    delete obj[key];
                }
            }
        }
    }

    return {
        inputTicketOrder : function(opts){
            //opt是个性化参数，需要将它和公共参数合并
            angular.extend(opts,commonParams);
            if(opts.combProductId){
                opts.saleId = opts.combProductId;
            }else{
                opts.saleId = opts.goodsIds;
            }
            return cm.get({
                loadingText : '加载中...',
                url : cm.getUrls().inputTicketOrder,
                params : opts
            });
        },
        getInputOptions : function(opts){
            return cm.get({
                loadingText : '加载中...',
                url : cm.getUrls().getInputOptions,
                params : opts
            });
        },
        countTicketPrice : function(opts,saleChannel){
            angular.extend(commonParams,opts);
            commonParams.saleChannel = saleChannel;
            return cm.get({
                loadingText : '加载中...',
                url : cm.getUrls().countTicketPrice,
                params : commonParams
            });
        },
        checkTicketOrder : function(opts,saleChannel){
            return cm.get({
                loadingText : '加载中...',
                url : cm.getUrls().checkTicketOrder,
                params : opts
            });
        },
        createOrder : function(opts,model){
            angular.extend(commonParams,opts);
            removeVoid0(commonParams);
            if(commonParams.combProductId){
                commonParams.saleId = commonParams.combProductId;
            }else{
                commonParams.saleId = commonParams.goodsIds;
            }

            commonParams.lvsessionid = cm.getCookie('lvsessionid');
            commonParams.distributorCode = cm.getCookie('cpsId') || '';
            delete commonParams.referrer;


            var data = {};
            
            if (cm.getUrlParam('combProductId')) {
                for (var key in commonParams) {
                    if(commonParams[key]){
                        data[key] = commonParams[key]
                    }
                }
                var combQuantities = [];
                var combVisitDates = [];
                for(var key in commonParams.goodsIds){
                    combQuantities[key] = model.quantities * model.packageCount[key];
                    combVisitDates[key] = model.date;
                }
                data.quantities = combQuantities;
                data.visitDates = combVisitDates;
                data.goodsIds = commonParams.goodsIds;
                data.comQuantity = model.quantities;
            }else{
                for (var key in commonParams) {
                    if(key!='combProductId'){
                        if(commonParams[key]){
                            data[key] = commonParams[key]
                        }
                    }
                }
            }


            return cm.get({
                loadingText : '加载中...',
                url : cm.getUrls().createOrder,
                params : data
            });
        },
        postlosc : function postlosc (orderId, callback) {
            var param = {};
            var oIC = cm.getCookie('oIC') || '';
            var oUC = cm.getCookie('oUC') || '';
            var oFC = cm.getCookie('orderFromChannelwap') || '';
            param.orderId = orderId;
            if (oIC || oUC || oFC) {
                var len = oIC.length, i = 0, oICArr = [], oUCArr = [], oFCArr = [] ;
                while(i < len) {
                    oICArr[oICArr.length] = oIC.substr(i, 6);
                    i += 6;
                }
                oICArr = oICArr.filter(function (ic, i, arr) {
                    return arr.indexOf(ic) == i;
                });
                 len = oUC.length, i =0;
                 while(i < len) {
                    oUCArr[oUCArr.length] = oUC.substr(i, 6);
                    i += 6;
                }
                oUCArr = oUCArr.filter(function (ic, i, arr) {
                    return arr.indexOf(ic) == i;
                });
                 len = oFC.length , i =0;
                 if(i < len){
                    oFCArr[oFCArr.length] = oFC ;
                };
                param.loscIds = oFCArr.concat(oICArr,oUCArr).join(',');
                return cm.get({
                    loadingText : '加载中...',
                    url : cm.getUrls().postlosc,
                    params : param
                }), callback();
            }
            return callback();
        },
        getCity : function(opts){
            return cm.get({
                loadingText : '加载中...',
                url : cm.getUrls().getCity,
                params : opts
            });
        },
        validate : function (model, err, show, opts) {
            return cm.validate(model, err, show, opts);
        },        
        getUser : function(opts){
            return cm.get({
                loadingText : '加载中...',
                url : cm.getUrls().getUser
            });
        },
        checkImgCode: function () {
            return cm.get({
                loadingText: '加载中...',
                url: cm.getUrls().checkImgCode,
                params: {
                    actionName : actionName
                }
            });
        },
        isNeedMsgAuthCode: function () {
            return cm.get({
                loadingText: '加载中...',
                url: cm.getUrls().isNeedMsgAuthCode,
                params: {
                    actionName : actionName
                }
            });
        },
        getMsgCode: function (param) {
            return cm.get({
                loadingText: '加载中...',
                url: cm.getUrls().getMsgCode,
                params: param
            });
        },
        getInsurance: function (param){
            return cm.get({
                loadingText: '加载中...',
                url: cm.getUrls().getInsurance,
                params: param
            });
        }
    }
}]);
/**
 * Created by zhangfeng on 2015/7/29.
 */
orderControllers.controller("testController",['$scope','testService',function($scope,testService){
    var word;
    testService.getTestWord().then(function(res){
        $scope.word = res.word;
    });
}]);
/**
 * Created by zhangfeng on 2015/7/29.
 */
orderServices.factory("testService",['cm',function(cm){
    return{
        getTestWord:function(){
            return cm.get({
                loadingText:'加载中...',
                url:cm.getUrls().test,
                params:{}
            });
        }
    }
}]);