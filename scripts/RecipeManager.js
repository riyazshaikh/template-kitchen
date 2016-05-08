SquareMart.RecipeManager = {
	recipe: {},

	init: function() {
		SquareMart.RECIPES && SquareMart.RECIPES.forEach(this.add,this);
	},

	_add: function(target, properties, condition) {
		if (condition === target) { // condition on target is redundant
			condition = null;
		}

		var selector = condition || target;
		var bNew = false;

		if (!this.recipe[selector]) {
			this.recipe[selector] = [];
			bNew = true;
		}

		if (condition) {
			this.recipe[condition].push({ target: target, properties: properties });
		} else {
			properties = Array.isArray(properties) ? properties : [properties];
			Array.prototype.push.apply(this.recipe[target], properties);
		}

		if (this.sync(selector) !== false && bNew) { // only attach listener if needed
			// console.log('adding listener', selector);
			// document.addSelectorListener(selector, this.attach.bind(this));	
		}
	},

	add: function(data) {
		try {
			if (Array.isArray(data)) {
				this._add(data[0], data[1], data[2]);
			} else if (typeof data === 'object') {
				this._add(data.target, data.properties, data.condition || data.showOnlyWhenPresent);
			} else if (typeof data === 'string' && arguments.length > 1) {
				this._add(data, arguments[1], arguments[2]);
			}
		} catch(e) {
			console.error('problem adding recipe', data, e);
		}
	},


	attach: function(event) {
		var selector = event.selector;
		var el = event.target;

		if (!this.recipe[selector]) return false; // nothing to do

		this.recipe[selector] = this.recipe[selector].filter(function(val, i) {
			if (typeof val === 'object') { // move conditional targets to top level

				console.log('moving condition', selector, val);
				this.add(val);
				return false;

			} else if (typeof val === 'function') {

				val(event);
				return true;

			} else {

				var parts = val.split('=');
				if (parts[0].indexOf('data') === 0) {

					if (parts[1]) el.setAttribute(parts[0], parts[1]);
					else el.removeAttribute(parts[0]);

				} else if (parts[0].indexOf('class') === 0) {

					var className = parts[0].replace('class-','');
					if (parts[1] === "true") el.classList.add(className);
					else el.classList.remove(className);

				}

				return true;
			}
		}, this);

		// stop listening if this is not marked to be continuous
		if (selector.charAt(selector.length-1) !== ' ') {
			delete this.recipe[selector];
			return false; // stop listening to selector
		}

		// else keep going
    // el.style.visibility = 'visible';
		return true; 
	},

	// sync dom with selector recipe
	// return false if nothing to sync anymore, else return true
	sync: function(selector) { 
		var els = document.querySelectorAll(selector);
		for (var i=0; i<els.length; i++) {
			if (this.attach({ selector: selector, target: els[i] }) === false) {
				return false;
			}
		}
	},

	// sync dom with all recipes
	syncAll: function() {
		// console.log('forcing recipes');
		for(var selector in this.recipe) {
			if (this.sync(selector) === false) {
				// document.removeSelectorListener(selector, this.attach.bind(this));
			}
		}
		
		SquareMart.Site.init();
    document.querySelector('body').classList.add('loaded');

	}
};

SquareMart.RecipeManager.init();