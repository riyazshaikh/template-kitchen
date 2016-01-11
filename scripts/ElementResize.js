(function(){
  var requestFrame = (function(){
    var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn){ return window.setTimeout(fn, 20); };
    return function(fn){ return raf(fn); };
  })();
  
  var cancelFrame = (function(){
    var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
           window.clearTimeout;
    return function(id){ return cancel(id); };
  })();
  
  function resizeListener(e){
    var win = e.target || e.srcElement;
    if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
    win.__resizeRAF__ = requestFrame(function(){
      var trigger = win.__resizeTrigger__;
      trigger.__resizeListeners__.forEach(function(fn){
        fn.call(trigger, e);
      });
    });
  }
  
  function objectLoad(e){
    this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
    this.contentDocument.defaultView.addEventListener('resize', resizeListener);
  }
  
  window.addResizeListener = function(element, fn){
    if (!element.__resizeListeners__) {
      element.__resizeListeners__ = [];
      element.setAttribute('data-resize');

      var obj;
      if (SquareMart.bFrameRequired) {
        obj = document.createElement('iframe');
        obj.src = 'about:blank';
      } else {
        obj = document.createElement('object');
        obj.type = 'text/html';
        obj.data = 'about:blank';
      }
      obj.__resizeElement__ = element;
      element.__resizeTrigger__ = obj;
      element.appendChild(obj);
    }
    element.__resizeListeners__.push(fn);
  };
  
  window.removeResizeListener = function(element, fn){
    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
    if (!element.__resizeListeners__.length) {
      element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
      element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
      element.removeAttribute('data-resize');
    }
  }

  SquareMart.RecipeManager.add("[data-resize] > iframe, [data-resize] > object ", objectLoad);

  SquareMart.bFrameRequired = (function() {
    var obj, value = false, site = document.querySelector('#site');
    try {
      obj = document.createElement('object'); 
      obj.type = 'text/html'; 
      obj.data = 'about:blank'; 
      site.appendChild(obj); 
      obj.contentDocument.head = obj.contentDocument.head;
    } catch(e) {
       value = true;
    }
    site.removeChild(obj); 
    return value;
  })();
})();