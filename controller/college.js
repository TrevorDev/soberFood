var User = require('./../model/user');
var FoodItem = require('./../model/foodItem');
var College = require('./../model/college');
var database = require('./../lib/database');
var sequelize = require('sequelize');
var si = database.getSequelizeInstance();

exports.getStatistics = function *() {
	
	list = []


	var results = yield si.query(
		/*  'SELECT college.name AS cName, (select count(*) as num from soberFood.Colleges'
		+ '  join soberFood.Users on soberFood.Users.CollegeId = soberFood.Colleges.id'
		+ ' inner join soberFood.FoodItems on soberFood.Users.id = soberFood.FoodItems.userId'
		+ ' where soberFood.Colleges.id = college.id'
		+ ' and soberFood.FoodItems.Status = "EATEN") AS eaten,'
		+ ' (select count(*) as num from soberFood.Colleges'
		+ ' inner join soberFood.Users on soberFood.Users.CollegeId = soberFood.Colleges.id'
		+ ' inner join soberFood.FoodItems on soberFood.Users.id = soberFood.FoodItems.userId'
		+ ' where soberFood.Colleges.id = college.id'
		+ ' and soberFood.FoodItems.Status = "EXPIRED") AS wasted,'
		+ ' (SELECT wasted / (eaten + wasted + 1)) AS ratio'
		+ ' FROM soberFood.Colleges AS college'
		+ ' ORDER BY ratio DESC'
		+ ' , null, { raw: true})'*/

		'SELECT college.name AS cName, (select count(*) as num from soberFood.Colleges  join soberFood.Users on soberFood.Users.CollegeId = soberFood.Colleges.id inner join soberFood.FoodItems on soberFood.Users.id = soberFood.FoodItems.userId where soberFood.Colleges.id = college.id and soberFood.FoodItems.Status = "EATEN") AS eaten, (select count(*) as num from soberFood.Colleges inner join soberFood.Users on soberFood.Users.CollegeId = soberFood.Colleges.id inner join soberFood.FoodItems on soberFood.Users.id = soberFood.FoodItems.userId where soberFood.Colleges.id = college.id and soberFood.FoodItems.Status = "EXPIRED") AS wasted, (SELECT wasted / (eaten + wasted + 1)) AS ratio FROM soberFood.Colleges AS college ORDER BY ratio ASC'
	, null, { raw: true })

	for (var i = 0; i < results.length; i++) {
		list.push({name:results[i].cName, eaten: results[i].eaten, wasted: results[i].wasted})
	}


	this.jsonResp(200, list);
}