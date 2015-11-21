Y.use('node', function () {
	window.Parallax = Singleton.create({

		ready: function() {

			Y.on('domready', function() {
				this.bindUI();
				this.syncUI();
			}, this);

		},

		syncUI: function() {
			this.parallaxNodes = Y.all('[data-parallax="enable"]');
			console.log('parallax sync');

			this.parallaxNodes.each(function(node) {
				// var img = node.one('img');
				// if (img) {
					node.get('parentNode').setStyle('transform', 'translateZ(0)');
					node.setStyle('transform', 'translate3d(0,0,0)');
				// }
				node.setData('region', node.get('parentNode').get('region'));
			}, this);

			this.scrollLogic();
		},

		bindUI: function() {
			this.scrollHandler = new rafscroll(Y.bind(this.scrollLogic, this));
      this.resizeHandler = new ResizeSensor(Y.one('#site')._node, Y.bind(this.syncUI,this));
		},

		scrollLogic: function() {
      var scrollY = window.scrollY;

      this.parallaxNodes.each(function(node, i) {
				if (Y.DOM.inViewportRegion(node.get('parentNode'),false,node.getData('region'))) {      	
          var pageYDoc = node.getData('region').top;
          var pageYViewport = pageYDoc - scrollY;
          var factor = 0.25;
          var imageY = -1 * pageYViewport * factor;
          // var image = node.one('img');

          node.setStyle('transform', 'translate3d(0,' + imageY + 'px,0)');
        }
      }, this);
		}

	});
});