Y.use('node', function (Y) {
	window.AutoPalette = Singleton.create({

		ready: function() {
			this.paletteNodes = Y.all('[data-palette]:not([data-display="overlaid"])');
			this.transparentNodes = Y.all('[data-display="overlaid"]');

			if (this.transparentNodes.size() && this.paletteNodes.size()) {
				this.bindUI();
				this.syncUI();
			}
		},

		bindUI: function() {
			this.scrollHandler = new rafscroll(Y.bind(this.scrollLogic, this));
      window.addResizeListener(Y.one('#site')._node, Y.bind(this.syncUI,this));
		},

		syncUI: function() {
			console.log('palette sync');

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

        	if (palette && tNode.getData('palette') !== palette) {
        		tNode.setAttribute('data-palette',palette);
        	}
        }
      }, this);

		}		


	});
});