(function(){
  
  var isFrame = false;
  var queryRegExp = /query\((.+?(?=\)\s*query|\)$))/ig;
  var mediaRule = ' @media {rule} { [query-id="{id}"] { opacity: 1; } }';
  var baseRule = 'html, body { margin: 0; padding: 0 } div { -webkit-transition: opacity 0.01s; -ms-transition: opacity 0.01s; -o-transition: opacity 0.01s; transition: opacity 0.01s; opacity: 0; }';
  
  function attachObject(box){
    if (isFrame) {
      var obj = document.createElement('iframe');
      obj.src = 'about:blank';
    } else {
      var obj = document.createElement('object');
      obj.type = 'text/html';
      obj.data = 'about:blank';
    }
    obj.__querybox__ = box;
    box.appendChild(obj);
    return obj;
  }
  
  function objectLoad(e){
    var box = this.__querybox__;

    try {
      this.contentDocument.head = this.contentDocument.head;
    } catch(e) {
      isFrame = true;
      window.detachQuerySensor(box);
      window.attachQuerySensor(box);
      return;
    }

    var doc = box.__eq__.doc = this.contentDocument;
    doc.__querybox__ = box;
    setStyle(doc, baseRule);
    doc.addEventListener('transitionend', debounceMatching);
    doc.addEventListener('MSTransitionEnd', debounceMatching);
    doc.addEventListener('webkitTransitionEnd', debounceMatching);
    parseQueries(box);
    box.__eq__.loaded = true;
  }
  
  var requestFrame = window.requestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    function(fn){ return window.setTimeout(fn, 20); };
  
  function debounceMatching(){
    var doc = this;
    if (!doc.__matching__) {
      doc.__matching__ = requestFrame(function(){
        getMatches(doc);
        doc.__matching__ = null;
      });
    };
  }
  
  function setStyle(doc, rules){
    var style = doc.createElement('style');
    style.innerHTML = rules;
    if (doc.head.firstChild) doc.head.removeChild(doc.head.firstChild);
    doc.head.appendChild(style);
  }
  
  function parseQueries(box){
    var media = box.getAttribute('data-media');
    if (media != null) {
      var rules = baseRule;
      var nodes = '';
      var matches = media.match(queryRegExp);
      box.setAttribute('matched-media', '');
      if (matches != null) matches.forEach(function(match){
        var values = match.replace('query(', '').split(',');
        var id = values.shift();
        nodes += '<div query-id="' + id + '"></div>';
        rules += mediaRule.replace('{rule}', values.join(',').trim()).replace('{id}', id);
      });
      var doc = box.__eq__.doc;
      setStyle(doc, rules);
      doc.body.innerHTML = nodes;
      getMatches(doc);
    }
  }
  
  function getMatches(doc){
    var matches = [];
    var box = doc.__querybox__;
    var nodes = doc.body.children;
    var index = nodes.length;
    while (index--) {
      // if you don't use the <object> defaultView's getComputedStyle, Firefox evaluates the query incorrectly
      if (doc.defaultView.getComputedStyle(nodes[index]).opacity == '1') {
        matches.push(nodes[index].getAttribute('query-id'));
      }
    }
    box.setAttribute('matched-media', matches.join(' '));
  }
  
  window.attachQuerySensor = function(box){
    if (!box.__eq__) {
      box.__eq__ = {};
      box.__eq__.object = attachObject(box);
    }
  };
  
  window.detachQuerySensor = function(box){
    if (box.__eq__) {
      box.removeChild(box.__eq__.object);
      delete box.__eq__;
    }
  };
  
  var setAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name){
    setAttr.apply(this, arguments);
    if (name == 'data-media') {
      if (this.__eq__) parseQueries(this);
      else attachQuerySensor(this);
    }
  }

  function initialize(){
    var nodes = document.body.querySelectorAll('body [data-media]:not(style)');
    var index = nodes.length;
    while (index--) attachQuerySensor(nodes[index]);
  }
  
  if (document.readyState == 'complete') initialize();
  else document.addEventListener('DOMContentLoaded', initialize);

  SquareMart.RecipeManager.add("[data-media] > iframe, [data-media] > object ", objectLoad);
})();