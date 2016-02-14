// SelectorListener By Daniel Buchner. Under Apache 2 License - https://github.com/csuwildcat/SelectorListener
// Modified for personal needs - https://github.com/riyazshaikh/SelectorListener
(function(){
	
	var events = {},
		selectors = {},
		docProto = typeof HTMLDocument !== 'undefined' ? HTMLDocument.prototype : Document.prototype,
		elemProto = typeof HTMLElement !== 'undefined' ? HTMLElement.prototype : Element.prototype,
		styles = document.createElement('style'),
		keyframes = document.createElement('style'),
		head = document.getElementsByTagName('head')[0],
		startNames = ['animationstart', 'oAnimationStart', 'MSAnimationStart', 'webkitAnimationStart'],
		startEvent = function(event){
			event.selector = (events[event.animationName] || {}).selector;
			var removeList = [];
			((this.selectorListeners || {})[event.animationName] || []).forEach(function(fn){
				if (fn.call(this, event) === false) removeList.push(fn);
			}, this);
			removeList.forEach(function(fn) {
				this.removeSelectorListener(event.selector, fn);	
			}, this);
		},
		prefix = (function() {
			var duration = 'animation-duration: 0.001s;',
				name = 'animation-name: SelectorListener !important;',
				visibility = 'visibility:hidden;',
				computed = window.getComputedStyle(document.documentElement, ''),
				pre = (Array.prototype.slice.call(computed).join('').match(/moz|webkit|ms/)||(computed.OLink===''&&['o']))[0];
			return {
				css: '-' + pre + '-',
				properties: '{' + visibility + duration + name + '-' + pre + '-' + duration + '-' + pre + '-' + name + '}',
				keyframes: !!(window.CSSKeyframesRule || window[('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1] + 'CSSKeyframesRule'])
			};
		})();
		
	styles.type = keyframes.type = "text/css";
	head.appendChild(styles);
	head.appendChild(keyframes);
	
	docProto.addSelectorListener = elemProto.addSelectorListener = function(selector, fn){
		var key = selectors[selector],
			listeners = this.selectorListeners = this.selectorListeners || {};
			
		if (key) events[key].count++;
		else {
			key = selectors[selector] = 'SelectorListener-' + Math.random().toString(16).substr(2, 9);
			var node = document.createTextNode('@' + (prefix.keyframes ? prefix.css : '') + 'keyframes ' + key + ' {'
				+'from { outline-color: #fff; } to { outline-color: #000; }'
			+ '}');
			keyframes.appendChild(node);
			var rule = document.createTextNode(selector + prefix.properties.replace(/SelectorListener/g, key));
			styles.appendChild(rule);
			events[key] = { count: 1, selector: selector, keyframe: node, rule: rule };
		} 
		
		if (listeners.count) listeners.count++;
		else {
			listeners.count = 1;
			startNames.forEach(function(name){
				this.addEventListener(name, startEvent, false);
			}, this);
		}
		
		(listeners[key] = listeners[key] || []).push(fn);
	};
	
	docProto.removeSelectorListener = elemProto.removeSelectorListener = function(selector, fn){
		var listeners = this.selectorListeners || {},
			key = selectors[selector],
			listener = listeners[key] || [],
			index = listener.indexOf(fn);
			
		if (index > -1){
			var event = events[selectors[selector]];
			event.count--;
			if (!event.count){
				styles.removeChild(event.rule);
				console.log('removing', selector);				
				keyframes.removeChild(event.keyframe);
				delete events[key];
				delete selectors[selector];
			}
			
			listeners.count--;
			listener.splice(index, 1);
			if (!listeners.count) startNames.forEach(function(name){
				this.removeEventListener(name, startEvent, false);
			}, this);
		}
	};

	// Single invocation version
	HTMLDocument.prototype.onSelector = HTMLElement.prototype.onSelector = function(selector,fn) {
		this.addSelectorListener(selector, function(event) { fn(event); return false; });
	};

})();