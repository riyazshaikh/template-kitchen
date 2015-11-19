var PRESETS = {};

PRESETS.default = {
	tweakJson: {},
	webfontsJson: []
};

PRESETS.katana = {
	tweakJson: {
		"mainContentWidth": "1200px",
		"mainSpacingSide": "5%",
		"mainSpacingTop": "2.5%",
		"mainMetaWidth": "500px",

		"body-font": "{font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;line-height:1.5em;}",
		"banner-body-font": "{font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:24px;font-weight:300;line-height:1.3em;}",
		"banner-heading1-font": "{font-family:inherit;font-size:60px;font-weight:300;line-height:1.3em;}",

		"main-bgColor": "#fff",
		"main-textColor": "#333",
		// "main-linkColor": "#cf3f02",
		"main-metaColor": "rgba(15,15,15,0.5)",

		"alt-bgColor": "#f5f5f5",
		"alt-textColor": "#333",

		"banner-bgColor": "rgba(0,0,0,0.5)",
		"banner-textColor": "rgb(255,255,255)",

		"header---display": "Overlaid",
		"header---background": "Transparent",
		"header--content---layout": "Main",
		"header---block": "Hide",

		"banner---background": "Transparent",
		"banner--description---display": "Overlaid Caption",
		"banner--description---background": "Translucent",
		"banner--description--content---layout": "Main",
		"banner--description--content---align": "Center Left",
	},
	webfontsJson: [
		"Open+Sans:300,300italic,700normal,700italic,500undefined"
	]
};

PRESETS.squaremart = {
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
		"banner-textColor": "#fff",

		"header---display": "Overlaid",
		"header---palette": "Banner",
		"header---background": "Transparent",
		"header--content---layout": "Alternate",
		"header---block": "Hide",

		"banner---background": "Transparent",
		"banner--image---parallax": "Enable",
		"banner--description---display": "Hide",
		"banner--blocks---background": "Translucent",

		"page-footer---palette": "Banner",
		"page-footer--image---parallax": "Enable",
		"page-footer--content---layout": "Alternate",
		"page-footer--content---sticky": "within-site-bottom",
		"page-footer--blocks---background": "Translucent",

	},
	webfontsJson: [
		
	]
};


PRESETS.galleryscroll = {
	tweakJson: {
		"main-bgColor": "#fff",
		"main-textColor": "#323639",
		"main-headingColor": "#000",

		"header---palette": "Main",
		"header---background": "Transparent",
		"header---display": "Overlaid",
		"header---sticky": "Within Site",
		"header--content---layout": "Alternate",
		"header---block": "Hide",
		"header---nav": "Hide",
		"header---slidebar": "Show",

		"banner---palette": "Main",
		// "banner---background": "Transparent",
		"banner--image---parallax": "Enable",
		"banner--description---display": "Hide",
		"banner--blocks--content---layout": "Main",
		"banner--blocks--content---parallax": "Enable"
	},
	webfontsJson: [
		
	]
};

PRESETS.artassign = {
	tweakJson: {
		"mainContentWidth": "100%",
		"mainSpacingSide": "0",
		"mainSpacingTop": "0",

		"banner---display": "Overlaid",
		"banner---background": "Transparent",
		"banner---palette": "Main"
	},
	webfontsJson: [
		
	]
};
	
var mode = document.currentScript.getAttribute('src').split('mode=')[1];

if (!mode || !PRESETS[mode]) mode = 'default';

Y.use('squarespace-util', function(Y) {

	Y.Data.post({
	        url: '/api/template/SetTemplateTweakSettings',
	        data: {
	          tweakJson: Y.JSON.stringify(PRESETS[mode]['tweakJson']),
	          webfontsJson: Y.JSON.stringify(PRESETS[mode]['webfontsJson'])
	        },
	        success: function() {
	        	alert('Preset ' + mode + ' applied!');
	        }
	});
});

