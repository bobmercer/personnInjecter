var config = require('./config');
var PersonGenerator = require('./lib/generate');
var elasticsearch = require('elasticsearch');

var insertData = function (dataToInject) {
	if (dataToInject.length > 0) {
		console.log("Injecting " + dataToInject.length / 2 + " entries.");
		client.bulk({
			body : dataToInject
		}).then(function (resp) {
			console.log(resp.items.length + " entries injected.");
			runCycle();
		}, function (err) {
			console.log(err);
			console.trace(dataToInject);
		});
	}
};

var generateData = function (size) {
	var data = [];
	for (var i = 0; i < size * 2; i = i + 2) {

		var person = personGenerator.generate();

		data[i] = {
			index : {
				_index : config.elasticsearch.index,
				_type : config.elasticsearch.type
			}
		};

		data[i + 1] = person;
	}
	return data;
};

var runCycle = function () {
	if (nbr > 0) {
		if (nbr > config.elasticsearch.bulkSize) {
			nbr = nbr - config.elasticsearch.bulkSize;
			data = generateData(config.elasticsearch.bulkSize);
			insertData(data);
		} else {
			generateData(nbr);
			data = generateData(nbr);
			nbr = 0;
			insertData(data);
		}
	} else {
		process.exit(0);
	}
};

var nbr = process.argv[2];

var client = new elasticsearch.Client({
		host : config.elasticsearch.host,
		keepAlive : false
	});

personGenerator = new PersonGenerator('fr');

if (process.argv.length < 3) {
	process.exit(1);
}

client.cluster.health([
		waitForStatus = "yellow",
		waitForActiveShards = 5], function () {
	runCycle()
});
