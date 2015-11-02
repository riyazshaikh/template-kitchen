Y.use('node', function (Y) {
	window.AutoPalette = Singleton.create({

		ready: function() {

			Y.on('domready', function() {
				this.init();
				Y.Global && this.tweakHandler();
			}, this);

		},

		destroy: function() {
			delete this.paletteNodes;
			delete this.transparentNodes;

			this.resizeHandler.detach();
			this.scrollHandler.detach();

		},

		init: function() {
			this.paletteNodes = Y.all('[data-palette]:not([data-behavior="transparent"])');
			this.transparentNodes = Y.all('[data-behavior="transparent"]');

			if (this.transparentNodes.size() && this.paletteNodes.size()) {
				this.bindUI();
				this.syncUI();
			}
		},

		bindUI: function() {
			var throttleSync = Y.throttle(Y.bind(this.syncUI, this), 100);
			var throttleLogic = Y.throttle(Y.bind(this.scrollLogic, this));

			this.resizeHandler = Y.one(window).on('resize', throttleSync);

			this.scrollHandler = Y.one(window).on('scroll', throttleLogic);

		},

		syncUI: function() {

			// cache region values
			this.paletteNodes.each(function(node) {
				var region = node.get('region');
				node.setData('region', region);
			});

			this.scrollLogic();
		},

		scrollLogic: function() {
			// console.log('start cycle');
      var viewportRegion = Y.one(Y.config.win).get('region');

      this.transparentNodes.each(function(tNode) {
      	var tRegion = tNode.get('region');
        if (Y.DOM.inViewportRegion(tNode._node,false,tRegion)) {
        	var palette;
        	this.paletteNodes.each(function(pNode) {
        		if (Y.DOM.inRegion(tNode._node,pNode.getData('region'),true,tRegion)) {
        			palette = pNode.getData('palette');
        		}
        	}, this);

        	if (palette) {
        		tNode.setAttribute('data-palette',palette);
        	}
        }
      }, this);

		},

		tweakHandler: function() {
			Y.Global.on('tweak:save', function (f) {
				this.destroy();
				this.init();
			}, this);

		}		


	});
});