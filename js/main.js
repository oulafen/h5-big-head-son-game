/*
 * Author: Alex Gibson
 * https://github.com/alexgibson/shake.js
 * License: MIT license
 */

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory(global, global.document);
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(global, global.document);
    } else {
        global.Shake = factory(global, global.document);
    }
} (typeof window !== 'undefined' ? window : this, function (window, document) {

    'use strict';

    function Shake(options) {
        //feature detect
        this.hasDeviceMotion = 'ondevicemotion' in window;

        this.options = {
            threshold: 15, //default velocity threshold for shake to register
            timeout: 1000 //default interval between events
        };

        if (typeof options === 'object') {
            for (var i in options) {
                if (options.hasOwnProperty(i)) {
                    this.options[i] = options[i];
                }
            }
        }

        //use date to prevent multiple shakes firing
        this.lastTime = new Date();

        //accelerometer values
        this.lastX = null;
        this.lastY = null;
        this.lastZ = null;

        //create custom event
        if (typeof document.CustomEvent === 'function') {
            this.event = new document.CustomEvent('shake', {
                bubbles: true,
                cancelable: true
            });
        } else if (typeof document.createEvent === 'function') {
            this.event = document.createEvent('Event');
            this.event.initEvent('shake', true, true);
        } else {
            return false;
        }
    }

    //reset timer values
    Shake.prototype.reset = function () {
        this.lastTime = new Date();
        this.lastX = null;
        this.lastY = null;
        this.lastZ = null;
    };

    //start listening for devicemotion
    Shake.prototype.start = function () {
        this.reset();
        if (this.hasDeviceMotion) {
            window.addEventListener('devicemotion', this, false);
        }
    };

    //stop listening for devicemotion
    Shake.prototype.stop = function () {
        if (this.hasDeviceMotion) {
            window.removeEventListener('devicemotion', this, false);
        }
        this.reset();
    };

    //calculates if shake did occur
    Shake.prototype.devicemotion = function (e) {
        var current = e.accelerationIncludingGravity;
        var currentTime;
        var timeDifference;
        var deltaX = 0;
        var deltaY = 0;
        var deltaZ = 0;

        if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {
            this.lastX = current.x;
            this.lastY = current.y;
            this.lastZ = current.z;
            return;
        }

        deltaX = Math.abs(this.lastX - current.x);
        deltaY = Math.abs(this.lastY - current.y);
        deltaZ = Math.abs(this.lastZ - current.z);

        if (((deltaX > this.options.threshold) && (deltaY > this.options.threshold)) || ((deltaX > this.options.threshold) && (deltaZ > this.options.threshold)) || ((deltaY > this.options.threshold) && (deltaZ > this.options.threshold))) {
            //calculate time in milliseconds since last shake registered
            currentTime = new Date();
            timeDifference = currentTime.getTime() - this.lastTime.getTime();

            if (timeDifference > this.options.timeout) {
                window.dispatchEvent(this.event);
                this.lastTime = new Date();
            }
        }

        this.lastX = current.x;
        this.lastY = current.y;
        this.lastZ = current.z;

    };

    //event handler
    Shake.prototype.handleEvent = function (e) {
        if (typeof (this[e.type]) === 'function') {
            return this[e.type](e);
        }
    };

    return Shake;
}));



$(function () {
    initPage();

    //create a new instance of shake.js.
    var myShakeEvent = new Shake({
        threshold: 15
    });
    // start listening to device motion
    myShakeEvent.start();
});

function initPage(){
    setTimeout(function(){
        loadResourse();
        $('.loading-img').addClass('load');

        setTimeout(function(){
            $('.page-2').show();
            page2.init();
        },1000);
        setTimeout(function(){
            $('.page-1').addClass('animated slideOutLeft');
        },3000)
    }, 1);
}

//main js
function  loadResourse(){
    var srcObjs = $('[data-src]');
    for(var i = 0, len = srcObjs.length; i < len; i++){
        srcObjs.eq(i).attr('src', srcObjs.eq(i).data('src'));
    }
}

var page2 = {
    init : function(){
        $('.page-2').show();

        //提前加载抽中的对联图片
        setTimeout(function(){
            var data = [1, 2, 3, 4, 5, 6, 7, 8];
            page3.coupletShowID = data[Math.floor(Math.random() * data.length)];
            page3.setContent();
        },50);

        // register a shake event
        window.addEventListener('shake', shakeEventDidOccur, false);

        //test
        $('.shaking').unbind('tap').tap(function(){
            page3.show();
        });
    }
};

var page3 = {
    coupletShowID : 1,

    coupletBox: $('.J-couplets-box'),
    coupletLeft: $('.J-couplets-box .couplet-left'),
    coupletRight: $('.J-couplets-box .couplet-right'),

    time1: '',
    time2: '',
    time3: '',
    time4: '',
    time5: '',

    init : function(){
        window.removeEventListener('shake', shakeEventDidOccur, false);

        $('.page-3 .J-share').unbind('tap').tap(function(){
            $('.share-page').show();
        });

        $('.page-3 .J-prize').unbind('tap').tap(function(){
            $('section').hide();
            page2.init();
        })
    },
    show : function(){
        var self = this;

        self.init();
        self.clearTime();

        $('.page-2').hide();
        $('.page-3').show();

        $('.J-move').hide().removeClass('animated bounceInLeft fadeInDown tada flipInY rotate-5 pendulum');
        $('.guajian').show();
        $('.J-couplets-box .tag').show();

        $('.son-father').addClass('animated bounceInLeft');
        self.time1 = setTimeout(function(){
            $('.guajian').addClass('rotate-5');
        },1000);

        self.time2 = setTimeout(function(){
            self.coupletRight.addClass('animated fadeInDown');

            self.time3 = setTimeout(function(){
                self.coupletLeft.addClass('animated fadeInDown');

                self.time4 = setTimeout(function(){
                    $('.J-couplets-box .tag').addClass('animated tada');

                    self.time5  = setTimeout(function(){
                        $('.guajian').addClass('pendulum');
                    },500)
                },2000);
            },1000);
        },2000);
    },
    setContent : function(){
        var self = this;
        self.coupletLeft
            .empty()
            .append(coupletFont[self.coupletShowID].left);

        self.coupletRight
            .empty()
            .append(coupletFont[self.coupletShowID].right);
    },
    clearTime : function(){
        clearTimeout(this.time1);
        clearTimeout(this.time2);
        clearTimeout(this.time3);
        clearTimeout(this.time4);
        clearTimeout(this.time5);
    }

};

var coupletFont = {
    1 : {
        'desc' : '有钱任性不吃土  看啥买啥我做主',
            'left' : '<img src="images/font/font-1-l-1.png" alt=""><img class="tag J-move" src="images/font/font-1-l-2.png" alt="">',
            'right' : '<img src="images/font/font-1-r.png" alt="">'
    },
    2 : {
        'desc' : '相亲相爱么么哒  单身狗也萌萌哒',
            'left' : '<img src="images/font/font-2-l-1.png" alt=""><img class="tag J-move" src="images/font/font-2-l-2.png" alt="">',
            'right' : '<img src="images/font/font-2-r-1.png" alt=""><img class="tag J-move" src="images/font/font-2-r-2.png" alt="">'
    },
    3 : {
        'desc' : '没有什么然并卵  事事都能城会玩',
            'left' : '<img src="images/font/font-3-l-1.png" alt=""><img class="tag J-move" src="images/font/font-3-l-2.png" alt="">',
            'right' : '<img src="images/font/font-3-r-1.png" alt=""><img class="tag J-move" src="images/font/font-3-r-2.png" alt="">'
    },
    4 : {
        'desc' : '重要事情说三遍  有车有房更有面',
            'left' : '<img src="images/font/font-4-l-1.png" alt=""><img class="tag J-move" src="images/font/font-4-l-2.png" alt="">',
            'right' : '<img src="images/font/font-4-r.png" alt="">'
    },
    5 : {
        'desc' : '事业有成吃得开  加班又少心不塞',
            'left' : '<img src="images/font/font-5-l-1.png" alt=""><img class="tag J-move" src="images/font/font-5-l-2.png" alt="">',
            'right' : '<img src="images/font/font-5-r-1.png" alt=""><img class="tag J-move" src="images/font/font-5-r-2.png" alt="">'
    },
    6 : {
        'desc' : '新技能get显身手  逼格更上一层楼',
            'left' : '<img src="images/font/font-6-l-1.png" alt=""><img class="tag J-move" src="images/font/font-6-l-2.png" alt=""><img src="images/font/font-6-l-3.png" alt="">',
            'right' : '<img class="tag J-move" src="images/font/font-6-r-1.png" alt=""><img src="images/font/font-6-r-2.png" alt="">'
    },
    7 : {
        'desc' : '不怕世界那么大  钱包带上就去看',
            'left' : '<img src="images/font/font-7-l-1.png" alt=""><img class="tag J-move" src="images/font/font-7-l-2.png" alt="">',
            'right' : '<img src="images/font/font-7-r.png" alt="">'
    },
    8 : {
        'desc' : '旧霉运通通狗带  新一年通体舒泰',
            'left' : '<img src="images/font/font-8-l-1.png" alt=""><img class="tag J-move" src="images/font/font-8-l-2.png" alt="">',
            'right' : '<img src="images/font/font-8-r.png" alt="">'
    }
};

function shakeEventDidOccur() {
    var audio = document.getElementById('audio');
    audio.play();
    setTimeout(function(){
        page3.show();
    },1000);
}





