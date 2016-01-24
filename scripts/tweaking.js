// Listen to tweak changes
Y.use('node', function (Y) {
	Y.on('domready', function() {
		if (Y.Global) {

			// Y.Global.on('tweak:beforeshow', function() {
			// 	window.top.document.querySelector('.presets-group-field-wrapper').style.display = 'block';
			// });

			Y.Global.on('tweak:change', function (f) {
				if (!f.config || (!f.config.property && !f.config.properties)) return;

				try {
					var obj = Y.clone(f.config, true);
					obj.properties = obj.properties || [obj.property]; // convert single property to array
					obj.properties[0] = obj.properties[0] + "=" + f.getValue().toLowerCase().replace(/\s/g,"-");

					SquareMart.RecipeManager.add(obj);
				} catch(e) {
					console.log('error on tweak change', e, f);
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

						if (values[obj.title]) {
							obj.properties[0] = obj.properties[0] + "=" + values[obj.title].toLowerCase().replace(/\s/g,"-");	
						}

						recipes.push([obj.target,obj.properties,obj.showOnlyWhenPresent]);
					} catch(e) {
						console.error('problem with tweak-recipe', matches[1], e);
					}
				};

				str = "<script id='recipes'>"+JSON.stringify(recipes)+".forEach(SquareMart.RecipeManager.add, SquareMart.RecipeManager);</script>";

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

