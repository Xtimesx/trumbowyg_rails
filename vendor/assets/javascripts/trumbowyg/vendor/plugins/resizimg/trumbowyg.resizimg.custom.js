(function ($) {
    'use strict';

    var defaultOptions = {
        minSize: 32,
        step: 4
    };

    var preventDefault = function (ev) {
        return ev.preventDefault();
    };

    $.extend(true, $.trumbowyg, {
        plugins: {
            resizimg: {
                init: function (trumbowyg) {
                    var dragging = false;

                    trumbowyg.o.plugins.resizimg = $.extend(true, {},
                        defaultOptions,
                        trumbowyg.o.plugins.resizimg || {},
                        {
                            resizable: {
                                resizeWidth: false,
                                onDragStart: function (ev, $el) {
                                    var opt = trumbowyg.o.plugins.resizimg,
                                        x = ev.pageX - $el.offset().left,
                                        y = ev.pageY - $el.offset().top;
                                    if (x < $el.width() - opt.minSize || y < $el.height() - opt.minSize) {
                                        return false;
                                    }
                                    $el.css("cursor", "nwse-resize");
                                    dragging = true;
                                    removeResizer(ev);
                                },
                                onDrag: function (ev, $el, newWidth, newHeight) {
                                    var opt = trumbowyg.o.plugins.resizimg;
                                    if (newHeight < opt.minSize) {
                                        newHeight = opt.minSize;
                                    }
                                    newHeight -= newHeight % opt.step;
                                    $el.height(newHeight);
                                    placeResizer.bind($el[0])();
                                    return false;
                                },
                                onDragEnd: function (ev, $el) {
                                    $el.css("cursor", "");
                                    $el.attr('height', $el.height());
                                    trumbowyg.$c.trigger('tbwchange');
                                    trumbowyg.syncCode();
                                    dragging = false;
                                }
                            }
                        }
                    );

                    function placeResizer() {
                      var $el = $(this),
                          resizer = $('<span class="trumbowyg-resizer"><i class="fa fa-angle-right"/></span>'),
                          e = trumbowyg.$ed.offset(),
                          x = $el.offset().left + $el.width() - e.left - 9,
                          y = $el.offset().top + $el.height() - e.top + 3;

                      resizer.css('left', x);
                      resizer.css('top', y);

                      if(dragging === false && trumbowyg.$box.find(".trumbowyg-resizer").length == 0) {
                        trumbowyg.$box.append(resizer);
                      }
                    }

                    function removeResizer(e) {
                      var resizer = trumbowyg.$box.find(".trumbowyg-resizer");

                      if (e && $(e.toElement).closest(".trumbowyg-resizer").length == 1) return;

                      if(dragging === true || !e || e.currentTarget != resizer[0]) {
                        trumbowyg.$box.find(".trumbowyg-resizer").remove();
                      }
                    }

                    function initResizable() {
                        trumbowyg.$ed.find('img:not(.resizable)')
                            .height(function(){ return $(this).attr('height') || $(this).height(); })
                            .resizable(trumbowyg.o.plugins.resizimg.resizable)
                            .on('mousedown', preventDefault)
                            .on('mouseover', placeResizer)
                            .on('mouseout', removeResizer)
                            .on('mousemove', function(ev) {
                              var $el = $(this),
                                  x = ev.pageX - $el.offset().left,
                                  y = ev.pageY - $el.offset().top;

                              if(x > ($el.width() - 30) && y > ($el.height() - 30)) {
                                $el.css("cursor", "nwse-resize");
                              } else {
                                $el.css("cursor", "");
                              }
                            });
                    }

                    function destroyResizable() {
                        removeResizer();
                        trumbowyg.$ed.find('img.resizable')
                            .resizable('destroy')
                            .off('mousedown', preventDefault);
                        trumbowyg.syncTextarea();
                    }

                    trumbowyg.$c.on('tbwinit', initResizable);
                    trumbowyg.$c.on('tbwfocus', initResizable);
                    trumbowyg.$c.on('tbwchange', initResizable);
                    trumbowyg.$c.on('tbwblur', destroyResizable);
                    trumbowyg.$c.on('tbwclose', destroyResizable);
                }
            }
        }
    });
})(jQuery);