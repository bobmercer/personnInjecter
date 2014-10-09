var config = require('./config');
var PersonGenerator = require('./lib/generate');
var elasticsearch = require('elasticsearch');

var insertData = function () {
	console.log(data);
	client.bulk({
		body : data
	}, function (err, resp) {
		if (err)
			console.log(err);
		else
			console.log(resp);
	});
	data = [];
};

if (process.argv.length < 3) {
	process.exit(1);
}

var nbr = process.argv[2];

personGenerator = new PersonGenerator('fr');

var client = new elasticsearch.Client({
		host : config.elasticsearch.host
	});

var data = [];

for (var i = 0; i < nbr * 2 ; i = i + 2) {
	var person = personGenerator.generate();

	data[i % (config.elasticsearch.bulkSize * 2)] = {
		index : {
			_index : config.elasticsearch.index,
			_type : config.elasticsearch.type
		}
	};
	data[i % (config.elasticsearch.bulkSize * 2) + 1] = person;

	if ((i > 0) && (i % (config.elasticsearch.bulkSize * 2) == 0)) {
		console.log(i);
		insertData();
	}
}

if (i % config.elasticsearch.bulkSize > 0) {
	insertData();
}
