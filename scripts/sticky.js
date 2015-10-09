/*

	This script takes an existing relatively positioned element
	like a header and converts it to fixed at a certain point
	when the user is scrolling down the page.

	To initialize it, you add a sticky-js class to the element
	you want to make sticky

	<header	class="js-sticky">

	This will simply make the header sticky to top of viewport
	while keeping a height on its original container.

	To control when the stickiness is triggered, 
	use the following data attributes

	data-sticky-on="#selector"
	--------------------------
	  Stickiness triggered when top of viewport scrolls to #selector. 

	data-sticky-after="#selector"
	-----------------------------
	  Stickiness triggered when top of viewport scrolls past #selector.

	data-sticky-scroll="up"
	-----------------------
	  Stickiness triggered when page is being scrolled up.

	More control
	============
	- If #selector matches multiple elements, the first one is used.
	- You can customize the sticky transition by overriding the styles
	  under .js-sticky-enabled 

*/

Y.use('node', function (Y) {
	window.Sticky = Singleton.create({

		ready: function () {

			if (!Y.one('.js-sticky')) { 
				return false;
			}

			Y.on('domready', function() {			
				this.initializer();
				this.bindUI();
				this.syncUI();
			}, this);

		},

		initializer: function () {

			this.el = Y.one('.js-sticky');
			this.elWrapper = Y.Node.create("<div class='js-sticky-wrapper'></div>");
			this.elContainer = Y.Node.create("<div class='js-sticky-container'></div>");


			if (this.el) {
				this.el.wrap(this.elWrapper);
				this.elWrapper.wrap(this.elContainer);
			}

			this.mode = 'always';

			if (this.el.hasAttribute('data-sticky-on')) {
				this.mode = 'on';
				this.elTarget = Y.one(this.el.getAttribute('data-sticky-on')).addClass('js-sticky-on');
			} else if (this.el.hasAttribute('data-sticky-within')) {
				this.mode = 'within';
				this.elTarget = Y.one(this.el.getAttribute('data-sticky-within')).addClass('js-sticky-within');
			} else if (this.el.hasAttribute('data-sticky-scroll')) {
				this.mode = 'scroll';
				this.direction = this.el.getAttribute('data-sticky-scroll');
			}
			// future modes can be added here

		},

		bindUI: function () {

			Y.one(window).on('resize', function () {
				this.syncUI();
			}, this);

			this.scrollEvents();	
		},

		syncUI: function () {

			// Make sure sticky's wrappers keeps the right width/height.
			this.elWrapper.setStyle('width', this.elContainer.get('offsetWidth'));
			this.elContainer.setStyle('height', this.elWrapper.get('offsetHeight'));

			switch(this.mode) {
				case 'within':
					this.navShowPosition = this.elTarget.getY();
					this.navEndPosition = this.navShowPosition + this.elTarget.get('offsetHeight') - this.el.get('offsetHeight');
					break;

				case 'on':
					this.navShowPosition = this.elTarget.getY();
					break;

				case 'always':
					this.elContainer.addClass('js-sticky-enabled');
					break;
			}

			
			this.scrollLogic();	
		},

		scrollEvents: function () {

			if (this.mode == 'always') return;

			this.scrolling = false;

			Y.one(window).on('scroll', function () {
				if (this.scrolling === false) {
					this.scrolling = true;
					this.scrollLogic();
					helper.debounce(function () {
						this.scrolling = false;
					}, 10, this);
				}
			}, this);

		},

		scrollLogic: function () {

			if (this.mode == 'always') return;

			if (this.mode == 'on') {

				if (window.scrollY >= this.navShowPosition) {
					this.elContainer.addClass('js-sticky-enabled');
				} else {
					this.elContainer.removeClass('js-sticky-enabled');
				}

			} else if (this.mode == 'within') {

				if (window.scrollY >= this.navShowPosition) {

					if (window.scrollY >= this.navEndPosition) {
						this.elContainer.addClass('js-sticky-end');
						this.elContainer.removeClass('js-sticky-enabled');
					} else {
						this.elContainer.addClass('js-sticky-enabled');
						this.elContainer.removeClass('js-sticky-end');
					}
					
				} else {
					this.elContainer.removeClass('js-sticky-enabled');
				}

			}

			this.prevPos = window.scrollY;

			Y.later(100, this, function () {
				if (this.scrolling === true) {
					window.requestAnimationFrame(Y.bind(function () {
						this.scrollLogic();
					}, this));
				}
			});

		}

	});
});