Y.use('node', function (Y) {
	window.Sticky = Singleton.create({

		ready: function() {

			Y.on('domready', function() {
				this.init();
				Y.Global && this.tweakHandler();
			}, this);

		},

		init: function() {
			this.stickyNodes = [];

			Y.all('[data-sticky]:not([data-sticky="disable"]').each(function(node) {

				// Config is data-sticky=<mode>-<selector>-<top/bottom>-<underlaid>
				var config = node.getData('sticky').split('-');
				config.length && node.setData('mode', config.shift());	

				var target = Y.one('#' + config.shift()) || node.get('parentNode');
				node.setData('elTarget', target);

				target.addClass('js-sticky-target'); // mostly for debugging

				// for deciding whether to check viewport crossing from top or bottom
				node.setData('direction', config.length ? config.shift() : 'top'); // default is top

				this.wrapItUp(node);

				// underlaid styling
				config.length && node.getData('elWrapper').addClass(config.shift());

				this.stickyNodes.push(node);

			}, this);

			if (this.stickyNodes.length) {
				console.log('stickyNodes', this.stickyNodes);
				this.bindUI();
				this.syncUI();
			}
		},

		destroy: function() {
			// unwrap
			// remove sticky classes
			// unset data
			this.resizeHandler.detach();
			this.scrollHandler.detach();

			this.stickyNodes = [];
		},

		bindUI: function () {

			this.resizeHandler = Y.one(window).on('resize', function () {
				this.syncUI();
			}, this);

			// this.scrolling = false;
			this.scrollHandler = Y.one(window).on('scroll', function () {
				// if (this.scrolling === false) {
					// this.scrolling = true;
					this.scrollLogic();
					// helper.debounce(function () {
						// this.scrolling = false;
					// }, 10, this);
				// }
			}, this);

		},


		syncUI: function () {

			this.stickyNodes.forEach(function(node) {
				var elContainer = node.getData('elContainer');
				var elWrapper = node.getData('elWrapper');

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
			this.viewportRegion.top = window.scrollY;
			this.viewportRegion.bottom = this.viewportRegion.top + this.viewportRegion.height;

			this.stickyNodes.forEach(function(node) {

				var elContainer = node.getData('elContainer');
				var elTargetRegion = node.getData('elTargetRegion');
				var direction = node.getData('direction');
				var elRegion = node.getData('elRegion');

				switch(node.getData('mode')) {
					case 'after':
						if (direction == 'bottom') {
							if (this.viewportRegion.bottom <= elTargetRegion.bottom) this.setSticky(elContainer, true);
							else this.setSticky(elContainer, false);
						} else {
							if (this.viewportRegion.top >= elTargetRegion.top) this.setSticky(elContainer, true);
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

				}
			}, this);

			// this.prevPos = scrollY;

			// if (this.scrolling === true) {
			// 	window.requestAnimationFrame(Y.bind(function () {
			// 		this.scrollLogic();
			// 	}, this));
			// }

		},

		tweakHandler: function() {
			Y.Global.on('tweak:save', function (f) {
				this.destroy();
				this.init();
			}, this);

		}		

	});
});