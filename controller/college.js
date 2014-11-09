var User = require('./../model/user');
var FoodItem = require('./../model/foodItem');
var College = require('./../model/college');

exports.getStatistics() {
	colleges = yield College.findAll()
	list = []
	for (var i = 0; i < data.length) {
		var college = colleges[i].name;
		var eaten = yield sequelize.query('select count(*) from soberFood.Colleges' +
	'inner join soberFood.Users on soberFood.Users.CollegeId = soberFood.Colleges.id' +
	'inner join soberFood.FoodItems on soberFood.Users.id = soberFood.FoodItems.userId' +
	'where soberFood.Colleges.id = ' + colleges[i].id + 'and soberFood.FoodItems.Status' +
	' = "EATEN"', null, { raw: true }) 		

		var wasted = yield sequelize.query('select count(*) from soberFood.Colleges' +
	'inner join soberFood.Users on soberFood.Users.CollegeId = soberFood.Colleges.id' +
	'inner join soberFood.FoodItems on soberFood.Users.id = soberFood.FoodItems.userId' +
	'where soberFood.Colleges.id = ' + colleges[i].id + 'and soberFood.FoodItems.Status' +
	' = "EXPIRED"', null, { raw: true }) 		

		list.push(name:college, eaten: eaten, wasted: wasted)
	}

	this.jsonResp(200, list);
}