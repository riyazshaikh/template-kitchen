# template-kitchen
A framework to create custom templates. You can see the framework's potential here - http://www.square-mart.com/templates


# Setup
Requires knowledge of [Squarespace developer platform](http://developers.squarespace.com/overview)

Force push the entire repo to your Squarespace git url. Then navigate to Style Editor, and click "Reset Defaults".



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

