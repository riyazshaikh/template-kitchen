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
			
			this.initializer();
			this.bindUI();
			this.syncUI();

		},

		initializer: function () {

			this.el = Y.one('.js-sticky');

			if (this.el) {
				this.el.wrap("<div class='js-sticky-wrapper'></div>");
			}

			this.mode = 'always';

			if (this.el.hasAttribute('data-sticky-on')) {
				this.mode = 'on';
				this.elOffset = Y.one(this.el.getAttribute('data-sticky-on'));
			} else if (this.el.hasAttribute('data-sticky-after')) {
				this.mode = 'after';
				this.elOffset = Y.one(this.el.getAttribute('data-sticky-after'));
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

			// Make sure sticky's wrapper keeps the right height.
			this.el.get('parentNode').setStyle('height', this.el.get('offsetHeight'));


			switch(this.mode) {
				case 'after':
					this.navShowPosition = this.elOffset.getY() + this.elOffset.get('offsetHeight');
					break;

				case 'on':
					this.navShowPosition = this.elOffset.getY();
					break;

				case 'always':
					this.el.addClass('js-sticky-enabled');
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
					}, 100, this);
				}
			}, this);

		},

		scrollLogic: function () {

			if (this.mode == 'always') return;

			if (this.mode == 'on' || this.mode == 'after') {

				if (window.scrollY > this.navShowPosition) {
					this.el.addClass('js-sticky-enabled');
				} else {
					this.el.removeClass('js-sticky-enabled');
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