var RECIPES = {};

RECIPES.default = {
	tweakJson: {},
	webfontsJson: []
};


RECIPES.alfa = { // parallax header/footer - regular page (use as support page)
	tweakJson: {
		"altContentWidth": "100%",
		"altSpacingSide": "5%",
		"altSpacingTop": "20px",

		"mainContentWidth": "1100px",
		"mainSpacingSide": "5%",
		"mainSpacingTop": "20px",

		"bannerContentWidth": "800px",
		"bannerSpacingSide": "5%",
		"bannerSpacingTop": "220px",

		"main-bgColor": "#fff",
		"main-textColor": "#323639",
		"main-headingColor": "#000",

		"alt-bgColor": "#101113",
		"alt-textColor": "#909499",
		"alt-headingColor": "#fff",

		"banner-bgColor": "rgb(16,17,19)",
		"banner-textColor": "#fff"
	},
	webfontsJson: [
		
	]
};

RECIPES.bravo = { // sliding gallery - Index - 
	tweakJson: {
		"mainMetaWidth": "47%",
		"mainSpacingTop": "20px",
		"logoContainerWidth": "70px",

		"mainContentWidth": "100%",
		"mainSpacingTop": "5%",
		"mainSpacingSide": "5%",

		"bannerContentWidth": "1100px",
		"bannerSpacingTop": "0",
		"bannerSpacingSide": "5%",

		"altContentWidth": "100%",
		"altSpacingTop": "0",
		"altSpacingSide": "5%",


		"body-font": "{font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:20px;font-weight:300;line-height:1.5em;}",
		"heading2-font": "{font-family:inherit;font-size:36px;font-weight:700;line-height:1.2em;}",

		"banner-body-font": "{font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:24px;font-weight:300;line-height:1.3em;}",
		"banner-heading1-font": "{font-family:inherit;font-size:40px;font-weight:700;line-height:1.2em;}",

		"main-bgColor": "#f3efee",
		// "main-linkColor": "#cf3f02",
		"main-metaColor": "rgba(15,15,15,0.5)",

		// "alt-bgColor": "#f5f5f5",
		// "alt-textColor": "#333",
	},
	webfontsJson: [
		"Open+Sans:300,300italic,700normal,700italic,500undefined"
	]
};

RECIPES.charlie = { // scrolling gallery - custom gallery - Katana
	tweakJson: {
		"main-bgColor": "#fff",
		"main-textColor": "#323639",
		"main-headingColor": "#000"
	},
	webfontsJson: [
		
	]
};

RECIPES.delta = { // fixed sliding gallery - Index - 
	tweakJson: {
	},
	webfontsJson: [
		
	]
};

RECIPES.echo = { // product grid - Products
	tweakJson: {
		"main-bgColor": "#f3efee",
		"main-metaColor": "#767676",
		"mainMetaWidth": "40%",

		"body-font": "{font-family:'Raleway';font-size:15px;font-weight:400;line-height:1.6em;}",
		"heading1-font": "{font-family:'Brandon',Helvetica,Arial,sans-serif;font-size:42px;font-weight:500;line-height:1.3em;}",
		"heading2-font": "{font-family:'Brandon',Helvetica,Arial,sans-serif;font-size:24px;font-weight:500;line-height:1.3em;}",
		"heading3-font": "{font-family:'Brandon',Helvetica,Arial,sans-serif;font-size:18px;font-weight:500;line-height:1.3em;}",

		"Product Item Size": "2:3 Standard (Vertical)",
		"Product Image Auto Crop": "False",
	},
	webfontsJson: [
		"Brandon:300,500normal",
		"Raleway:400,400italic"
	]
};

RECIPES.foxtrot = { // support blog - custom Blog
	tweakJson: {
	},
	webfontsJson: [
		
	]
};

RECIPES.golf = { // medium blog - Blog
	tweakJson: {
	},
	webfontsJson: [
		
	]
};

RECIPES.hotel = { // 
	tweakJson: {
	},
	webfontsJson: [
		
	]
};

RECIPES.india = { // blog map - Blog
	tweakJson: {
	},
	webfontsJson: [
		
	]
};
	
var mode = document.currentScript.getAttribute('src').split('mode=')[1];

if (!mode || !RECIPES[mode]) mode = 'default';

// process tweak names
var newObj = {};
for(var name in RECIPES[mode].tweakJson) {
	var newName = name.match(/\s/) ? name.replace(/\s/g,'-').toLowerCase() : name;
	newObj[newName] = RECIPES[mode].tweakJson[name];
}
RECIPES[mode].tweakJson = newObj;

Y.use('squarespace-util', function(Y) {

	Y.Data.post({
	        url: '/api/template/SetTemplateTweakSettings',
	        data: {
	          tweakJson: Y.JSON.stringify(RECIPES[mode]['tweakJson']),
	          webfontsJson: Y.JSON.stringify(RECIPES[mode]['webfontsJson'])
	        },
	        success: function() {
	        	alert('Recipe ' + mode.toUpperCase() + ' applied!');
	        	window.location.href = window.location.pathname + '?recipe='+mode;
	        }
	});
});

