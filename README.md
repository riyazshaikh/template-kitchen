A framework to create custom templates. You can see the framework's potential here - http://www.square-mart.com/templates


# Setup
Requires knowledge of [Squarespace developer platform](http://developers.squarespace.com/overview)

Force push the entire repo to your Squarespace git url. Then navigate to Style Editor, and click "Reset Defaults".


# Secret Sauce
This framework relies on a concept I like to call Recipes - basically, a tweak syntax that allows you to control dom behavior through data attributes. You can see it in action in LESS files like this:

```
// tweak: { category: "Banner", label: "Description Align", default: "Center", options: ["Left", "Center", "Right"], properties:['data-text-align'], target: "#banner .description .content", showOnlyWhenPresent: "body.collection-layout-default", title: "default-banner-description-text-align", type: "dropdown", recipe:true }
```

The above code results in the usual [Style Editor dropdown](http://developers.squarespace.com/style-editor/) for choosing Banner Description Alignment options. But additionally, it attaches the tweak value to dom automatically, as a data attribute on the "target" selector. This is intended to encourage writing reusable LESS mixins/classes. You can also choose to trigger a recipe attachment, without exposing the tweak, by writing something like this:

```
//OFF tweak: { target: "#banner", properties: ["data-palette=banner","data-typeset=banner"], showOnlyWhenPresent: "body.collection-layout-default", recipe: true }
```

Note that you can also mix classes and attributes, through the following syntax:

```
//tweak:{ target: "#gallery .meta .title ", properties:["data-font-effect=dash", "class-text-align-left=true"], showOnlyWhenPresent: "body.collection-layout-charlie", recipe: true}
```

You can see how complex layouts have been created with just a few lines of code, by browsing the /layouts folder.



# Troubleshooting
If the styles appear broken, you can trigger LESS compiler by running following code.

```javascript
Y.Data.get({
	url:"/api/templates/"+Static.SQUARESPACE_CONTEXT.templateId+"/reprocess-tweaks", 
	success:function() { alert('Tweaks Reprocessed'); } 
});
```

This can be made into a bookmarklet for convenience:

`javascript:Y.Data.get({url:"/api/templates/"+Static.SQUARESPACE_CONTEXT.templateId+"/reprocess-tweaks", success:function() { alert('tweaks reprocessed'); } });`

