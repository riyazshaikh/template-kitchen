Y.use('node', function (Y) {
	SquareMart.Sticky = Singleton.create({

		ready: function() {
			this.nodes = new Y.NodeList();
			
			SquareMart.RecipeManager.add('[data-sticky] ', function(e) {
				this.add(Y.one(e.target));
			}.bind(this));
		},

		add: function(node) {
			if (this.nodes.indexOf(node) === -1) {

				console.log('adding sticky', node);
				this.nodes.push(node);

				// Config is data-sticky=<mode>-<selector>-<top/bottom>-<underlaid>
				var config = node.getData('sticky').split('-');
				config.length && node.setData('mode', config.shift());	

				var target = Y.one('#' + config.shift()) || node.get('parentNode');
				node.setData('elTarget', target);

				target.addClass('js-sticky-target'); // mostly for debugging

				// for deciding whether to check viewport crossing from top or bottom
				node.setData('direction', config.length ? config.shift() : 'top'); // default is top

				this.wrapItUp(node);

				this.syncUI();
	
				//skip for mobile
				if (!Y.one('html').hasClass('touch-styles')) {
					this.bindUI();
				}

			}
		},

		bindUI: function () {

			if (!this.scrollHandler)
			this.scrollHandler = new rafscroll(Y.bind(this.scrollLogic, this));

			if (!this.resizeHandler)
      this.resizeHandler = SquareMart.Utils.onResize(Y.bind(this.syncUI,this));

		},

		syncUI: function () {
			console.log('sticky sync', this.nodes);

			this.nodes.each(function(node) {
				var elContainer = node.getData('elContainer');
				var elWrapper = node.getData('elWrapper');

				// unset for measuring
				this.setSticky(elContainer, false);
				
				// Make sure sticky's wrappers keeps the right width/height.
				elWrapper.setStyle('width', elContainer.get('offsetWidth'));
				elContainer.setStyle('height', elWrapper.get('offsetHeight'));

				node.setData('elTargetRegion', node.getData('elTarget').get('region'));
				node.setData('elRegion', node.get('region'));

			}, this);

			this.viewportRegion = Y.DOM.viewportRegion();

			this.scrollLogic();	
		},

		wrapItUp: function(node) {
			var elWrapper = Y.Node.create("<div class='js-sticky-wrapper'></div>");
			node.wrap(elWrapper);
			node.setData('elWrapper',elWrapper);
			elWrapper.addClass(node.getData('direction'));

			var elContainer = Y.Node.create("<div class='js-sticky-container'></div>");
			elWrapper.wrap(elContainer);
			node.setData('elContainer',elContainer);

			// elContainer.addClass(node.getStyle('position'));
		},

		setSticky: function(elContainer, bEnabled) {
			if (bEnabled) elContainer.addClass('js-sticky-enabled');
			else elContainer.removeClass('js-sticky-enabled');
		},

		setAbsolute: function(elContainer, bEnabled) {
			if (bEnabled) elContainer.addClass('js-sticky-end').removeClass('js-sticky-enabled');
			else elContainer.removeClass('js-sticky-end').addClass('js-sticky-enabled');
		},

		scrollLogic: function () {

			// update without hitting dom
			this.viewportRegion.top = window.pageYOffset;
			this.viewportRegion.bottom = this.viewportRegion.top + this.viewportRegion.height;

			this.nodes.each(function(node) {

				var elContainer = node.getData('elContainer');
				var elTargetRegion = node.getData('elTargetRegion');
				var direction = node.getData('direction');
				var elRegion = node.getData('elRegion');

				switch(node.getData('mode')) {
					case 'after':
						if (direction == 'bottom') {
							if (this.viewportRegion.bottom <= elTargetRegion.top) this.setSticky(elContainer, true);
							else this.setSticky(elContainer, false);
						} else {
							if (this.viewportRegion.top >= elTargetRegion.bottom) this.setSticky(elContainer, true);
							else this.setSticky(elContainer, false);
						}
						break;

					case 'within':
						if (direction == 'bottom') {
							if (this.viewportRegion.bottom <= elRegion.bottom) {
								if (this.viewportRegion.bottom <= elTargetRegion.top - elRegion.height) {
									this.setAbsolute(elContainer,true);
									this.setSticky(elContainer, false);
								} else {
									this.setAbsolute(elContainer,false);
									this.setSticky(elContainer, true);
								}
							} else {
								this.setAbsolute(elContainer,false);
								this.setSticky(elContainer,false);
							}
						} else {
							if (this.viewportRegion.top >= elRegion.top) {
								if (this.viewportRegion.top >= elTargetRegion.bottom - elRegion.height) {
									this.setAbsolute(elContainer,true);
									this.setSticky(elContainer, false);
								} else {
									this.setAbsolute(elContainer,false);
									this.setSticky(elContainer, true);
								}
							} else {
								this.setAbsolute(elContainer,false);
								this.setSticky(elContainer,false);
							}
						}
						break;

					case 'always':
						this.setSticky(elContainer, true);
						break;

				}
			}, this);

			// this.prevPos = scrollY;

			// if (this.scrolling === true) {
			// 	window.requestAnimationFrame(Y.bind(function () {
			// 		this.scrollLogic();
			// 	}, this));
			// }

		}		

	});
});