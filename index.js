var prism = require("glass-prism");

var config = require("./config");

var tokenLookup = {};
var url = require("url");
var https = require("https");

config.postAuthorizationCallback = function (res, tokens) {
	var state = Math.random();
	var lookup = Math.random().toString(36);

	tokenLookup[lookup] = {
		tokens: tokens,
		state: state
	};

	res.writeHead(302, { "Location": "https://github.com/login/oauth/authorize?client_id=" +
		config.github_client_id +
		"&scope=notifications" +
		"&redirect_uri=" + config.github_redirect_dir + lookup +
		"&state=" + state
	});
	res.end();
}

config.routes = {
	"githubcallback": function (req, res, fragments) {
		var params = url.parse(req.url, true).query;
		var state = params.state;
		var code = params.code;
		var lookup = fragments[fragments.length - 1];

		console.log(params);

		if (!tokenLookup[lookup] || tokenLookup[lookup].state != state)
			return res.end("Bad state");

		https.request({
			hostname: "github.com",
			path: "/login/oauth/access_token?" +
				"client_id=" + config.github_client_id +
				"&client_secret=" + config.github_client_secret +
				"&code=" + code,
			method: "POST",
			headers: {
				"Accept": "application/json"
			}
		}, function (ores) {
			var data = "";
			ores.on('data', function (chunk) {
				data += chunk.toString();
			});
			ores.on('end', function() {
				var tokens = JSON.parse(data);
				tokenLookup[lookup].tokens.github_token = tokens.access_token;
				console.log(prism.client_tokens);

				res.writeHead(302, { "Location": "success" });
				res.end();

				console.log(tokens);
			});
		}).end();
	}
};

prism.init(config, function() {
	console.log('Octoglass connected to Mirror');
});

prism.on('newclient', function(tokens) {
	var user = "temp";

	prism.insertCard({ html: prism.cards.welcome({ user: user }) }, tokens);
});

