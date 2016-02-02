Y.use('node', function (Y) {
	SquareMart.AutoPalette = Singleton.create({

		ready: function() {
			this.nodes = new Y.NodeList();

			SquareMart.RecipeManager.add('[data-display="overlaid"] ', function(e) {
				this.add(Y.one(e.target));
			}.bind(this));

		},

		add: function(node) {
			if (this.nodes.indexOf(node) === -1) {

				console.log('adding autopalette', node);
				this.nodes.push(node);

				this.bindUI();
				this.syncUI();
				
			}
		},

		bindUI: function() {
			if (!this.scrollHandler)
			this.scrollHandler = new rafscroll(Y.bind(this.scrollLogic, this));

			if (!this.resizeHandler)
      this.resizeHandler = SquareMart.Utils.onResize(Y.bind(this.syncUI,this));
		},

		syncUI: function() {
			console.log('autopalette sync');

			this.paletteNodes = Y.all('[data-palette]:not([data-display="overlaid"])');

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

      this.nodes.each(function(tNode) {
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