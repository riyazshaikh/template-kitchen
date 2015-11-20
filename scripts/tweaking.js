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
				setTweak(f.getName(), f.getValue());

			});

			Y.Global.on('tweak:reset', function (f) {
				var tweaks = Static.SQUARESPACE_CONTEXT.tweakJSON, parts, value, key;
				for (key in tweaks) {
					setTweak(key, tweaks[key]);
				}    		
			});
		}
	});
});

