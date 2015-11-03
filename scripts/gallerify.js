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

			Y.all('.index-gallery .sqs-gallery').each(function(node) {
				var gallery = this.makeGallery(node);
				this.bindUI(gallery);
				this.syncUI(gallery);
			}, this);

		},

		bindUI: function(gallery) {

			gallery.set('resizeEmitter', new Y.Squarespace.ResizeEmitter({timeout: 100}));

      gallery.get('resizeEmitter').on('resize:end', function() {
      		this.syncUI(gallery);
          gallery.refresh();
       }, this);

			if (gallery.mode == 'sidemeta') {

				this.scrolling = false;
				Y.one(window).on('scroll', function () {
					if (this.scrolling === false) {
						this.scrolling = true;
						
						// main logic
						this.scrollLogic(gallery);

						helper.debounce(function () {
							this.scrolling = false;
						}, 100, this);
					}
				}, this);

			}
		},

		syncUI: function(gallery) {

			if (gallery.mode == 'sidemeta') {
				gallery.metaOffsets = [];

				gallery.get('container').ancestor('.index-gallery').all('.meta').each(function(node) {
					gallery.metaOffsets.push(node.getXY()[1]);
				});

				this.scrollLogic(gallery);
			}

		},

		scrollLogic: function(gallery) {

			var setActive = function(index) {
				if (gallery.get('currentIndex') !== index) {
					gallery.set('currentIndex', index);
					gallery.get('container').ancestor('.index-gallery').all('.meta').item(index).addClass('active').siblings().removeClass('active');
				}
			};

			var scrollY = window.scrollY;
			var i;

			for (i=0; i<gallery.metaOffsets.length-1; i++) {
				if (scrollY < gallery.metaOffsets[i+1]) {
					break;
				}
			}
			setActive(i);
		},

		makeGallery: function(node) {
			var id = node.getAttribute('id'); 
			var mode = node.ancestor('[data-layout="scroll"]') ? 'sidemeta' : 'regular';

			if (!id) {
				 id = Y.Squarespace.Utils.getGuid();
				 node.setAttribute('id', id);
			}
			
			this.galleries[id] = new Y.Squarespace.Gallery2({				
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
						transition: mode == 'sidemeta' ? 'fade' : 'scroll'
					},
					refreshOnResize: false // we will do it
			});		

			this.galleries[id].mode = mode;

			mode == 'sidemeta' && node.ancestor('.index-gallery').one('.meta').addClass('active');

			return this.galleries[id];
		}
	});
});