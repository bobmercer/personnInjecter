var config = require('./config');
var PersonGenerator = require('./lib/generate');
var elasticsearch = require('elasticsearch');

var insertData = function (aData) {
	if (aData.length > 0) {
		console.log("Injecting " + aData.length / 2 + " entries.");
		client.bulk({
			body : aData
		}, function (err, resp) {
			if (err) {
				console.log(err);
				console.log(aData);
			} else {
				console.log(aData.length / 2 + " entries injected.");
			}
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

	console.log(i + " "  + (i + 2) % (config.elasticsearch.bulkSize * 2));

	if ((i > 0) && ((i + 2) % (config.elasticsearch.bulkSize * 2) == 0)) {
		dataToInsert = data.splice(0, config.elasticsearch.bulkSize * 2);
		console.log(dataToInsert.length);
		insertData(dataToInsert);
	}
}

insertData(data);
