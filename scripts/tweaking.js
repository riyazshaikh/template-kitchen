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
					console.log(f.config);
				} catch(e) {
					console.log('error in tweaking.js', e);
				}
			});

			var updateRecipe = function() {
				var re = /tweak:(.*?recipe:.*?)\n/g;
				var matches = [];
				var str = window.top.Y.Squarespace.TweakManager.rawLess;
				var values = window.top.Y.Squarespace.TweakManager.dialog.getData();
				var recipes = [];

				while((matches = re.exec(str)) !== null) {
					try {
						var obj = eval('('+matches[1]+')');

						obj.properties = obj.properties || [obj.property]; // convert single property to array
						obj.properties[0] = obj.properties[0] + "=" + values[obj.title].toLowerCase();

						recipes.push({
							target: obj.target,
							properties: obj.properties,
							condition: obj.showOnlyWhenPresent
						});
					} catch(e) {
						console.error('problem with tweak-recipe', matches[1]);
					}
				};

				str = "<script id='recipes'>SquareMart.RecipeManager.add("+JSON.stringify(recipes)+");</script>";

				Y.Data.get({
					url: '/api/config/GetInjectionSettings',
					success: function(data) {
						data.header = str + data.header.replace(/<script id='recipes'.*?script>/g, '');

						Y.Data.post({
							url: '/api/config/SaveInjectionSettings',
							data: data,
							success: function() {
								console.log('injection updated');
							}
						});
					}
				})
			};

			Y.Global.on('tweak:save', function (f) {
				// var worker = new Worker("/scripts/recipe-worker.js");
				// worker.onmessage = function(obj) {
				// 	console.log(obj);
				// }

				// worker.postMessage(window.top.Y.Squarespace.TweakManager.rawLess);
				// console.log('message sent');
				updateRecipe();
			});

			Y.Global.on('tweak:reset', function (f) {
				updateRecipe();
			});

		}
	});
});

