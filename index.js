var prism = require("glass-prism");

var config = require("./config");

prism.init(config, function() {
	console.log('Octoglass connected to Mirror');
});

prism.on('newclient', function(tokens) {
	prism.insertCard({ html: prism.cards.main("Welcome to Octoglass!") }, tokens);
});

