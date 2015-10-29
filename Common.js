function domReady() {
    window.aledo = Aledo();
    window.aledo.init();
}



function Aledo() {
    var _options = {
            "authBlock": "#auth_block",
            "authBlockTrigger": "#auth_block_trigger",
            "$layout": jQuery(".b-layout"),
            $header: jQuery(".b-layout-header"),
            layoutScrolledClass: "b-layout_scrolled",
            headerModalOpenedClass: "b-layout-header_modal-opened",
            headerHeight: 0
        },
        $document = jQuery(document),
        $body = jQuery("body"),
        authAnimation = false,
        $window = jQuery(window),
        _ = _options,
        _init = function() {

            _.$authBlock = jQuery(_.authBlock);
            _enableModalFix();
            _initFixedHeader();
            _bindEvents();
        },
        _initFixedHeader = function() {
            _.headerHeight = _.$header.outerHeight();
        },
        _disableScrolledClass = function() {

            return _.$layout.removeClass(_.layoutScrolledClass);
        },
        _enableScrolledClass = function() {

            return _.$layout.addClass(_.layoutScrolledClass);
        },
        _isLayoutScrolled = function() {

            return $window.scrollTop() > _.headerHeight;
        },
        _enableHeaderFix = function() {

            $document.on("show.bs.modal", function() {
                _.$header.css({ "right": _getScrollBarWidth() });
                _.$header.addClass(_.headerModalOpenedClass);
            }).on("hidden.bs.modal", function() {
                _.$header.css({ "right": 0 });
                _.$header.removeClass(_.headerModalOpenedClass);
            });
        },
        _enableModalFix = function() {

            _enableHeaderFix();

            if (browser && browser.msie || browser.opera_presto || browser.msie11) {
                $document.on("show.bs.modal", function() {
                    _.$layout.css({ "padding-right": _getScrollBarWidth() });

                }).on("hidden.bs.modal", function() {
                    _.$layout.css({ "padding-right": 0 });
                });
            }
        },
        _getScrollBarWidth = function() {
            var scrollDiv = document.createElement('div');
            scrollDiv.className = 'modal-scrollbar-measure';
            $body.append(scrollDiv);
            var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            $body[0].removeChild(scrollDiv);
            return scrollbarWidth;
        },
        _bindEvents = function() {

            $document.on("click.showAuth", _.authBlockTrigger, function() {
                !_.$authBlock.is(":visible") && _showAuthBlock();
            }).on("click.hideAuth", _.authBlockTrigger, function() {
                _.$authBlock.is(":visible") && _hideAuthBlock();
            }).on("click.hideAuth", function(e) {
                _.$authBlock.is(":visible") && !jQuery(e.target).closest(_.authBlock).length && _hideAuthBlock();
            });

                $window.on("scroll", function () {
                    _isLayoutScrolled() && _enableScrolledClass() || _disableScrolledClass();
                });


        },
        _showAuthBlock = function() {
            if (authAnimation) return;
            authAnimation = true;
            _.$authBlock.slideDown("slow", "easeOutBack", function() {
                authAnimation = false;
            });
        },
        _hideAuthBlock = function() {
            if (authAnimation) return;
            authAnimation = true;
            _.$authBlock.slideUp("fast", function() {
                authAnimation = false;
            });
        };
    return {
        init: _init,
        hideAuthBlock :_hideAuthBlock
    };
}

function Cart() {
    var _options = {
    };
    var _init = function () { };
    var _bindEvents = function () { };
    return { init: _init };
}

jQuery.fn.clickOrNot = function() {
    var $this = jQuery(this), startX, startY, endposX, endposY;
    $this.on("touchstart mousedown", function(e) {
        startX = e.pageX || e.originalEvent.touches[0].pageX;
        startY = e.pageY || e.originalEvent.touches[0].pageY;
    });


    $this.on("touchend mouseup", function (e) {

        endposX = e.pageX || e.originalEvent.changedTouches[0].pageX;
        endposY = e.pageY || e.originalEvent.changedTouches[0].pageY;
        
        var deltaX = startX - endposX,
            deltaY = startY - endposY,
            touchThreshold = e.type == "touchend" ? 10 : 5;
        if (Math.abs(deltaX) < touchThreshold && Math.abs(deltaY) < touchThreshold) {
            console.log(touchThreshold, deltaX, deltaY);
            var e = jQuery.Event("clickOrNot", { target: e.target });
            $this.trigger(e);
        }

    });
    return $this;
};


function ResponsiveImage() {
    var _options = {
        images: {},
        sizes: [],
        $images: []
        },
        _ = _options,
        $window = jQuery(window),
        _timeout,
        _init = function(settings) {
            var $images = jQuery(settings.images);
          
            $images.each(function (i) {
                var $this = jQuery(this),
                    data = $this.data();
                _.$images.push($this);

                jQuery.each(data, function (k, v) {
                   
                    if (k.toLowerCase().indexOf("src") == -1) return;
                   
                    var size = k.slice(0, -3),
                         tmp = new Object();
                    if (typeof _.images[size] == "undefined") {
                        _.images[size] = new Array();
                    }
                    tmp.$element = $this;
                    tmp.source = v;
                    $this.data("ResponsiveImage", {});
                    _.images[size].push(tmp);
                    _.sizes.push(parseInt(size));

                });
              
               
            });
            _.sizes.sort(function(a, b) {
                if (a < b) {
                    return -1;
                }
                if (a > b) {
                    return 1;
                }
                return 0;
            });
            _bindEvents();
            _checkSizes();
        },
 
    _bindEvents = function() {
        $window.on("resize.responsiveImages", function () {
                if (_timeout) clearTimeout(_timeout);
                _timeout = setTimeout(function() {
                    _checkSizes();
                }, 300);
            });
        },
        _checkSizes = function () {
            var windowWidth = $window.width(),
                availableSizes = jQuery.grep(_.sizes.slice(), function (a) {
                    return a <= windowWidth;
                });
            _setSizes(availableSizes);
        },
        _setSizes = function (availableSizes) {
            var dtm = new Date().getTime();
          
            for (var i = availableSizes.length - 1; i >= 0; --i) {
                for (var b = 0; b < _.images[availableSizes[i]].length; ++b) {
                  
                    var $element = _.images[availableSizes[i]][b].$element,
                    src = _.images[availableSizes[i]][b].source;
                  
                    if ($element.data("ResponsiveImage")["dtm"] != dtm) {
                        $element[0].src = src;
                        $element.data("ResponsiveImage", { dtm: dtm, "default": false});
                    } 

                }
            }
            for ( i = 0; i < _.$images.length; ++i) {
                if (_.$images[i].data("ResponsiveImage")["dtm"] != dtm && _.$images[i].data("ResponsiveImage")["default"] != true) {
                 
                    _.$images[i][0].src = _.$images[i].data("default-src");
                    _.$images[i].data("ResponsiveImage", {dtm: dtm, "default": true});
                }
            }
        }
    return { init: _init };
}

