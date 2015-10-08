Y.use('squarespace-gallery-ng', function (Y) {
	window.Gallerify = Singleton.create({

		ready: function() {

			Y.on('domready', function() {
				this.init();
			}, this);

		},

		init: function() {
			this.viewportRegion = Y.one(Y.config.win).get('region');					
			this.galleries = {};

			Y.all('.sqs-gallery').each(function(node) {
				this.makeGallery(node);
			}, this);
		},

		makeGallery: function(node) {
			var id = node.getAttribute('id'); 

			if (!id) {
				 id = Y.Squarespace.Utils.getGuid();
				 node.setAttribute('id', id);
			}
			
			this.galleries[node.getAttribute('id')] = new Y.Squarespace.Gallery2({				
					container: node,
					slides: node.all('.slide'),
					elements: {
						next: node.siblings('.sqs-gallery-controls').item(0).one('.next'),
						previous: node.siblings('.sqs-gallery-controls').item(0).one('.previous')
					},
					loaderOptions: {
						load: true
					},
					design: 'stacked',
					designOptions: {
						autoHeight: false,
						transition: node.ancestor('.layout-gallery-sidemeta') ? 'fade' : 'scroll'
					},
					refreshOnResize: true
				});					
		}
	});
});