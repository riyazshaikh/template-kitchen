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

			Y.all('[data-sticky]').each(function(node) {
				// Extract config from [data-sticky=<mode>---<target>]
				var config = node.getData('sticky').split('---');

				if (config.length < 2) return; // skip if config missing

				if (config[0] == 'within' || config[0] == 'after') {
					var target = Y.one('#' + config[1]);
					if (!target) return; // skip if target not present

					node.setData('elTarget', target);
					target.addClass('js-sticky-' + config[0]);
				}	

				node.setData('mode', config[0]);
				node.setData('target', config[1]);

				this.wrapItUp(node);

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

				var mode = node.getData('mode');

				switch(mode) {
					case 'within':
						var region = node.getData('elTarget').get('region');
						node.setData('navShowPosition', region.top);
						node.setData('navEndPosition', region.bottom - node.get('offsetHeight'));
						break;

					case 'after':
						var region = node.getData('elTarget').get('region');
						node.setData('navShowPosition', region.bottom);
						break;

					case 'scroll':
						break;
				}

			}, this);

			this.scrollLogic();	
		},

		wrapItUp: function(node) {
			var elWrapper = Y.Node.create("<div class='js-sticky-wrapper'></div>");
			node.wrap(elWrapper);
			node.setData('elWrapper',elWrapper);

			var elContainer = Y.Node.create("<div class='js-sticky-container'></div>");
			elWrapper.wrap(elContainer);
			node.setData('elContainer',elContainer);

			// elContainer.addClass(node.getStyle('position'));
		},

		scrollLogic: function () {

			var scrollY = window.scrollY;
			this.stickyNodes.forEach(function(node) {

				var elContainer = node.getData('elContainer');
				switch(node.getData('mode')) {
					case 'after':
						if (scrollY > node.getData('navShowPosition')) {
							elContainer.addClass('js-sticky-enabled');
						} else {
							elContainer.removeClass('js-sticky-enabled');
						}
						break;

					case 'within':
						if (scrollY >= node.getData('navShowPosition')) {

							if (scrollY >= node.getData('navEndPosition')) {
								elContainer.addClass('js-sticky-end').removeClass('js-sticky-enabled');
							} else {
								elContainer.addClass('js-sticky-enabled').removeClass('js-sticky-end');
							}
							
						} else {
							elContainer.removeClass('js-sticky-enabled');
						}
						break;

				}
			}, this);

			this.prevPos = scrollY;

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