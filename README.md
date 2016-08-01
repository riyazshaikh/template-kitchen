# template-kitchen
A framework to create custom templates. Requires knowledge of Squarespace developer platform - http://developers.squarespace.com/overview

# Setup
Force push the entire repo to your Squarespace git url. Then trigger LESS compiler by running this code on your Squarespace site:

javascript:Y.Data.get({url:"/api/templates/"+Static.SQUARESPACE_CONTEXT.templateId+"/reprocess-tweaks", success:function() { alert('tweaks reprocessed'); } });

