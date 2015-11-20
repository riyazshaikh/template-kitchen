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

		"Header - Display": "Overlaid",
		"Header - Background": "Transparent",
		"Header  Content - Layout": "Main",
		"Header  Block - Display": "Hide",

		"Banner - Background": "Transparent",
		"Banner  Description - Display": "Overlaid Caption",
		"Banner  Description - Background": "Translucent",
		"Banner  Description  Content - Layout": "Main",
		"Banner  Description  Content - Align": "Center Left",

		"Page  Content - Italic": "Dash"
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

		"Header - Display": "Overlaid",
		"Header - Background": "Transparent",
		"Header  Content - Layout": "Alternate",
		"Header  Block - Display": "Hide",

		"Banner - Background": "Transparent",
		"Banner  Image - Parallax": "Enable",
		"Banner  Description - Display": "Hide",
		"Banner  Blocks - Background": "Translucent",
		"Banner  Blocks  Content - Layout": "Banner",

		"Page Footer - Palette": "Banner",
		"Page Footer  Image - Parallax": "Enable",
		"Page Footer  Content - Layout": "Alternate",
		"Page Footer  Content - Sticky": "within-site-bottom",
		"Page Footer  Blocks - Background": "Translucent",

	},
	webfontsJson: [
		
	]
};


PRESETS.galleryscroll = {
	tweakJson: {
		"main-bgColor": "#fff",
		"main-textColor": "#323639",
		"main-headingColor": "#000",

		"Header - Palette": "Main",
		"Header - Background": "Transparent",
		"Header - Display": "Overlaid",
		// "Header - Sticky": "Within Site",
		"Header  Content - Layout": "Alternate",
		"Header  Block - Display": "Hide",
		"Header  Slidebar - Display": "Always",
		"Header  Nav - Display": "Hide",

		"Banner - Palette": "Main",
		"Banner  Image - Parallax": "Enable",
		"Banner  Description - Display": "Hide",
		"Banner  Blocks  Content - Layout": "Main",
		"Banner  Blocks  Content - Parallax": "Enable"
	},
	webfontsJson: [
		
	]
};

PRESETS.artassign = {
	tweakJson: {
		"Banner - Display": "Overlaid",
		"Banner - Background": "Transparent",
		"Banner - Palette": "Main",
		"Banner  Blocks  Content - Layout": "Main",
		"Banner  Blocks  Content - Italic": "Highlight",

		"Gallery  Content - Layout": "Banner"
	},
	webfontsJson: [
		
	]
};
	
var mode = document.currentScript.getAttribute('src').split('mode=')[1];

if (!mode || !PRESETS[mode]) mode = 'default';

// process tweak names
var newObj = {};
for(var name in PRESETS[mode].tweakJson) {
	var newName = name.match(/\s/) ? name.replace(/\s/g,'-').toLowerCase() : name;
	newObj[newName] = PRESETS[mode].tweakJson[name];
}
PRESETS[mode].tweakJson = newObj;

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

