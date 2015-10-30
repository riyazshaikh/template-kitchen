// Listen to tweak changes
Y.use('node', function (Y) {
	Y.on('domready', function() {
		if (Y.Global) {
			Y.Global.on('tweak:change', function (f) {
				var parts = f.getName().split('---');
				if ( parts ) {
					var node = Y.one('#'+parts[0]);
					node && node.setAttribute('data-'+parts[1], f.getValue().toLowerCase().replace(/\s/g,"-"));
				}
			});

			Y.Global.on('tweak:reset', function (f) {
				var tweaks = Static.SQUARESPACE_CONTEXT.tweakJSON, parts, value, key;
				for (key in tweaks) {
					parts = key.split('---');
					if ( parts ) {
						var node = Y.one('#'+parts[0]);
						node && node.setAttribute('data-'+parts[1], tweaks[key].toLowerCase().replace(/\s/g,"-"));
					}
				}    		
			});
		}
	});
});

