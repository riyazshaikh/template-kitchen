Y.use('node', function (Y) {
	window.Parallax = Singleton.create({

		ready: function() {
			this.nodes = new Y.NodeList();

			SquareMart.RecipeManager.add('[data-parallax] ', function() {
				window.Parallax.add(Y.one(this));
			});

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