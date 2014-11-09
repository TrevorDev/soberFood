var User = require('./../model/user');
var FoodItem = require('./../model/foodItem');
var College = require('./../model/college');
var database = require('./../lib/database');
var sequelize = require('sequelize');
var si = database.getSequelizeInstance();

exports.getStatistics = function *() {
	colleges = yield College.findAll()
	list = []
	for (var i = 0; i < colleges.length;i++) {
		var college = colleges[i].name;
		var eaten = yield si.query('select count(*) as num from soberFood.Colleges' +
	' inner join soberFood.Users on soberFood.Users.CollegeId = soberFood.Colleges.id' +
	' inner join soberFood.FoodItems on soberFood.Users.id = soberFood.FoodItems.userId' +
	' where soberFood.Colleges.id = ' + colleges[i].id + ' and soberFood.FoodItems.Status' +
	' = "EATEN";', null, { raw: true }) 		

		var wasted = yield si.query('select count(*) as num from soberFood.Colleges' +
	' inner join soberFood.Users on soberFood.Users.CollegeId = soberFood.Colleges.id' +
	' inner join soberFood.FoodItems on soberFood.Users.id = soberFood.FoodItems.userId' +
	' where soberFood.Colleges.id = ' + colleges[i].id + ' and soberFood.FoodItems.Status' +
	' = "EXPIRED";', null, { raw: true }) 		

		list.push({name:college, eaten: eaten[0].num, wasted: wasted[0].num})
	}

	this.jsonResp(200, list);
}