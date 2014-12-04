var faker = require('faker');
var idf_data = require('../data/correspondance-code-insee-code-postal.json');

function PersonGenerator(locale) {
	faker.locale = locale;
	}
	
PersonGenerator.prototype.generate = function generate() {
		var person = {};
		person.firstName = faker.name.firstName();
		person.lastName = faker.name.lastName();
		person.dob = new Date(faker.date.past(70, new Date()));
		person.phone = faker.phone.phoneNumber();
		person.email = faker.internet.email();
		
		// Address block
		
		var address = {};
		
		random = Math.floor(Math.random()* idf_data.length);
		
		idf_zone = idf_data[random];
		
		address.departement = idf_zone.fields.nom_dept;
		address.postal_code = idf_zone.fields.postal_code;
		address.commune = idf_zone.fields.nom_comm;
		address.street = Math.floor(Math.random() * 75 + 1) + " " + faker.address.streetPrefix() + " " + faker.address.streetName();
		address.lonlat = [idf_zone.fields.geo_point_2d[1],idf_zone.fields.geo_point_2d[0]];
		
		person.address = address;
		
		return person;
};
	
module.exports = PersonGenerator;
