var prism = require("glass-prism");

var config = require("./config");

prism.init(config, function() {
	console.log('Octoglass connected to Mirror');
});

prism.on('newclient', function(tokens) {
	var user = "temp";

	prism.insertCard({ html: prism.cards.welcome({ user: user }) }, tokens);
});

