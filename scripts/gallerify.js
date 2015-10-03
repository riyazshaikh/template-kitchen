Y.use('squarespace-gallery-ng', function (Y) {
	window.Gallerify = Singleton.create({

		FACTOR_HEIGHT: 0.9,

		ready: function() {

			Y.on('domready', function() {
				this.init();
			}, this);

		},

		init: function() {
			this.viewportRegion = Y.one(Y.config.win).get('region');					
			this.galleries = {};

			Y.all('.gallery-block-custom').each(function(node) {
				this.makeGallery(node);
			}, this);
		},

		makeGallery: function(root) {
			var id = root.getAttribute('id'); 

			if (!id) {
				 id = Y.Squarespace.Utils.getGuid();
				 root.setAttribute('id', id);
			}
			
			// root.one('.sqs-gallery').setStyle('height', this.viewportRegion.height * this.FACTOR_HEIGHT);

			this.galleries[root.getAttribute('id')] = new Y.Squarespace.Gallery2({				
					container: root.one('.sqs-gallery'),
					slides: root.all('.slide'),
					elements: {
						next: root.one('.sqs-gallery-controls .next'),
						previous: root.one('.sqs-gallery-controls .previous')
					},
					loaderOptions: {
						load: true
					},
					design: 'stacked',
					designOptions: {
						autoHeight: false,
						transition: 'scroll'
					},
					refreshOnResize: true
				});					
		}
	});
});