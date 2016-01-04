// Listen to tweak changes
Y.use('node', function (Y) {
	Y.on('domready', function() {
		if (Y.Global) {

			var setTweak = function(name, value) {
				var parts = name.split('---');
				if ( parts.length > 1 ) {
					parts[0] = parts[0].replace(/--/g,' .'); // make double space into class

					var node = Y.one('#'+parts[0]);
					node && node.setAttribute('data-'+parts[1], value.toLowerCase().replace(/\s/g,"-"));
				}
			};

			Y.Global.on('tweak:change', function (f) {
				try {
					setTweak(f.getName(), f.getValue());	
				} catch(e) {
					console.log('error in tweaking.js', e);
				}
			});

			Y.Global.on('tweak:save', function (f) {
				var worker = new Worker("/scripts/recipe-worker.js");
				worker.onmessage = function(obj) {
					console.log(obj);
				}

				worker.postMessage(window.top.Y.Squarespace.TweakManager.rawLess);
				console.log('message sent');

			});

			Y.Global.on('tweak:reset', function (f) {
				window.RecipeManager.resetTweaks();
			});

		}
	});
});

