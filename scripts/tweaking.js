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

			var rawLess;

			Y.Global.on('tweak:aftershow', function (f) {
				Y.Data.get({
					url: '/api/template/GetTemplateCustomCss',
					success: function(data) {
						rawLess = window.top.Y.Squarespace.TweakManager.rawLess + data.css;
					}
				})
			});

			Y.Global.on('tweak:save', function (f) {
				updateRecipe();
			});

			Y.Global.on('tweak:reset', function (f) {
				updateRecipe();
			});

			var updateRecipe = function() {
				var re = /tweak:(.*?recipe:.*?)$/mg;
				var matches = [];
				var values = window.top.Y.Squarespace.TweakManager.dialog.getData();
				var recipes = [];

				while((matches = re.exec(rawLess)) !== null) {
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

				var str = "<script id='recipes'>SquareMart.RECIPES = "+JSON.stringify(recipes)+"</script>";

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
			


		}
	});
});

