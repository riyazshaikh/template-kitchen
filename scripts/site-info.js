/** 
    USAGE: Add code below as a bookmarklet, then click on it whenever you need info about a site.
    javascript:if(!window.Squarespace){alert("Not a Squarespace website")}else if(window.Squarespace.Constants){alert("Squarespace 5 website")}else{Y.Get.js("//code-snippets.squarespace.com/scripts/site-info.js?"+(new Date).getTime())}
**/


Y.use('io', function(Y) {
  // SQS 5 site
  if (Squarespace.Constants) {
    alert('Squarespace 5 website');
    // dont have any other info yet
  } else {
    // If Sqsp 6 website
    Y.io('/site.css?debug=true', {
      on: {
        success: function(result, response) {
          var matches, output = "Squarespace 6 website";

          matches = response.responseText.match(new RegExp('templateWebsite(ownerWebsiteId): (.*)'));
          
          output += "\nTemplate : " + (matches ? matches[1] : 'Unknown');

          output += "\nCustom CSS : " + (response.responseText.match(new RegExp('Custom CSS')) ? 'Yes' : 'No');
          
          output += "\nDeveloper Site : " + (Static.SQUARESPACE_CONTEXT.website.developerMode ? 'Yes' : 'No');

          if( !window.location.hostname.match(/squarespace.com/) ) {
            output += "\nIdentifier : " + Static.SQUARESPACE_CONTEXT.website.identifier;
          }
          alert(output);
        }
      }
    });
  }
});



