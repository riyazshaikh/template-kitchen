Y.use('node', function (Y) {
	SquareMart.Parallax = Singleton.create({

		ready: function() {
			//skip for mobile
			if (Y.one('html').hasClass('touch-styles')) return;

			this.nodes = new Y.NodeList();

			SquareMart.RecipeManager.add('[data-parallax] ', function(e) {
				this.add(Y.one(e.target));
			}.bind(this));

		},

		add: function(node) {
			if (this.nodes.indexOf(node) === -1) {

				console.log('adding parallax', node);
				this.nodes.push(node);

				this.bindUI();
				this.syncUI();

			}

		},

		syncUI: function() {
			console.log('parallax sync', this.nodes);

			this.nodes.each(function(node) {
				// var img = node.one('img');
				// if (img) {
					node.get('parentNode').setStyle('transform', 'translateZ(0)');
					node.setStyle('transform', 'translate3d(0,0,0)');
				// }
				node.setData('region', node.get('parentNode').get('region'));
			}, this);

			this.scrollLogic();
		},

		bindUI: function () {

			if (!this.scrollHandler)
			this.scrollHandler = new rafscroll(Y.bind(this.scrollLogic, this));

			if (!this.resizeHandler)
      this.resizeHandler = SquareMart.Utils.onResize(Y.bind(this.syncUI,this));

		},

		scrollLogic: function() {
      var scrollY = window.pageYOffset;

      this.nodes.each(function(node, i) {
				if (Y.DOM.inViewportRegion(node.get('parentNode'),false,node.getData('region'))) { 
					var mode = node.getData('parallax');

					if (mode.indexOf('sideways') > -1) {
	          var pageYDoc = node.getData('region').top;
	          var pageYViewport = pageYDoc - scrollY;
	          var factor = 0.4;
	          var imageY = (mode == 'sideways-left' ? -1 : 1) * pageYViewport * factor;
	          // var image = node.one('img');

	          node.setStyle('transform', 'translate3d(' + imageY + 'px,0,0)');

					} else {
	          var pageYDoc = node.getData('region').top;
	          var pageYViewport = pageYDoc - scrollY;
	          var factor = 0.25;
	          var imageY = -1 * pageYViewport * factor;
	          // var image = node.one('img');

	          node.setStyle('transform', 'translate3d(0,' + imageY + 'px,0)');
					}     	
        }
      }, this);
		}		

	});
});