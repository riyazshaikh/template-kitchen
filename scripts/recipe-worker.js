onmessage = function(event) {
	postMessage('got msg');
	var less = event.data;
	less.split('\n').forEach(function (line) { 
		var words = line.split("tweak:");
		if (words[1]) {
			var tweak = eval('('+words[1]+')');
			postMessage(tweak);
		}
	});
};

