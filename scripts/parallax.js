Y.use('node', function () {
	window.Parallax = Singleton.create({

		ready: function() {

			Y.on('domready', function() {
				this.init();
			}, this);

		},

		init: function() {
      this.scrollEl = Y.one(Y.UA.gecko || Y.UA.ie || !!navigator.userAgent.match(/Trident.*rv.11\./) ? 'html' : 'body');

			this.parallaxNodes = Y.all('.parallax');

			this.parallaxNodes.each(function(node) {
				var img = node.one('img');
				if (img) {
					img.get('parentNode').setStyle('transform', 'translateZ(0)');
					img.setStyle('transform', 'translate3d(0,0,0)');
				}
				node.offset = node.getXY()[1];
			}, this);

			this.bindUI();
			this.syncUI();
		},

		bindUI: function() {
			new rafscroll(Y.bind(this.syncUI, this));
		},

		syncUI: function() {
      var scrollTop = this.scrollEl.get('scrollTop');
      var viewportRegion = Y.one(Y.config.win).get('region');

      this.parallaxNodes.each(function(node, i) {
        if (node.inRegion(viewportRegion)) {
          var pageYDoc = node.offset;
          var pageYViewport = pageYDoc - scrollTop;
          var factor = 0.25;
          var imageY = -1 * pageYViewport * factor;
          var image = node.one('img');

          image && image.setStyle('transform', 'translate3d(0,' + imageY + 'px,0)');
        }
      }, this);
		}

	});
});