var config = require('./config');
var PersonGenerator = require('./lib/generate');
var elasticsearch = require('elasticsearch');

var insertData = function (aData) {
	if (aData.length > 0) {
		console.log("Injecting " + aData.length / 2 + " entries.");
		client.bulk({
			body : aData
		}).then(function (resp) {
			console.log(resp.items.length + " entries injected.");
		}, function (err) {
			console.trace(err);
			console.trace(aData);
		});
	}
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

for (var i = 0; i < nbr * 2; i = i + 2) {

	var person = personGenerator.generate();

	data[i % (config.elasticsearch.bulkSize * 2)] = {
		index : {
			_index : config.elasticsearch.index,
			_type : config.elasticsearch.type
		}
	};

	data[i % (config.elasticsearch.bulkSize * 2) + 1] = person;

	if ((i > 0) && ((i + 2) % (config.elasticsearch.bulkSize * 2) == 0)) {
		dataToInsert = data.splice(0, config.elasticsearch.bulkSize * 2);
		insertData(dataToInsert);
	}
}

insertData(data);
