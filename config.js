var config = {}

config.elasticsearch = {};

config.elasticsearch.host = process.env.ELASTICSEARCH_HOST || 'localhost:9200';
config.elasticsearch.bulkSize = 5000;
config.elasticsearch.index = "persons";
config.elasticsearch.type = "person";

module.exports = config;