var User = require('./../model/user');
var FoodItem = require('./../model/foodItem');
var FoodInfo = require("./../model/foodInfo");
var database = require('./../lib/database');
var sequelize = require('sequelize');
var si = database.getSequelizeInstance();

exports.getUsers = function *() {
	var users = yield User.findAll({})
	return this.jsonResp(200,{users: users});
}

exports.getList = function *() {
	var curUser = yield User.find(this.session.userId)
	var list = yield curUser.getFoodItems({where: {status: FoodItem.STATUS.ON_LIST}})
	return this.jsonResp(200,list);
}

exports.getPantry = function *() {
	var curUser = yield User.find(this.session.userId)
	var list = yield curUser.getFoodItems({where: {status: FoodItem.STATUS.TO_EAT}})
	return this.jsonResp(200,list);
}

exports.addToFoodToEat = function*() {
	var curUser = yield User.find(this.session.userId)
	var list = yield curUser.getFoodItems({where: {status: FoodItem.STATUS.ON_LIST}})
	for(var i = 0;i<list.length;i++){
		list[i].status = FoodItem.STATUS.TO_EAT;
		var x = new Date()
		x.setMilliseconds(0)
		x.setSeconds(0)
		x.setMinutes(0)
		x.setHours(0)
		list[i].timePurchased = x;
		list[i].save();
	}
	this.jsonResp(200);
}

exports.getStatistics = function*() {
	var curUser = yield User.find(this.session.userId)
	var wasted = yield curUser.getFoodItems({where: {status: FoodItem.STATUS.EXPIRED}})
	var eaten = yield curUser.getFoodItems({where: {status: FoodItem.STATUS.EATEN}})
	var list = [];

	list.push({name: "Overall", eaten: eaten.length, wasted: wasted.length});

	var userTotal = list[0].eaten + list[0].wasted;
	var foods = yield FoodInfo.findAll();
	for (var i = 0; i < foods.length; i++) {
		var foodId = foods[i].id; 

		var results = yield si.query(
			  ' SELECT (SELECT count(*) ' 
			+ ' from soberFood.FoodItems '
			+ ' inner join soberFood.Users on soberFood.Users.id = soberFood.FoodItems.UserId '
			+ ' where soberFood.Users.id = ' + curUser.id + ' and '
			+ ' soberFood.FoodItems.FoodInfoId = ' + foodId + ' and '
			+ ' soberFood.FoodItems.Status = "EATEN") AS numEaten, '
			+ ' (SELECT count(*)  '
			+ ' from soberFood.FoodItems '
			+ ' inner join soberFood.Users on soberFood.Users.id = soberFood.FoodItems.UserId '
			+ ' where soberFood.Users.id = ' + curUser.id + ' and '
			+ ' soberFood.FoodItems.FoodInfoId = ' + foodId + ' and '
			+ ' soberFood.FoodItems.Status = "EXPIRED") AS numWasted '
		, null, { raw: true })

		var foodTotal = results[0].numEaten + results[0].numWasted;
		console.log(foods[i].name + " num: " + foodTotal)
		if (userTotal > 0) {
			if (foodTotal / userTotal > 0.05) {
				list.push({name:foods[i].name, eaten:results[0].numEaten, wasted:results[0].numWasted})
			}
		}
	}

	this.jsonResp(200, list);
}

exports.getLeaderboard = function*() {

	var results = yield si.query(
		'SELECT name, (SELECT count(*)'
		+ ' from soberFood.FoodItems'
		+ ' inner join soberFood.Users on soberFood.Users.id = soberFood.FoodItems.UserId'
		+ ' where soberFood.Users.id = theUser.id and'
		+ ' soberFood.FoodItems.Status = "EATEN") AS eaten,'
		+ ' (SELECT count(*) '
		+ ' from soberFood.FoodItems'
		+ ' inner join soberFood.Users on soberFood.Users.id = soberFood.FoodItems.UserId'
		+ ' where soberFood.Users.id = theUser.id and'
		+ ' soberFood.FoodItems.Status = "EXPIRED") AS wasted,'
		+ ' (SELECT eaten - wasted) AS score'
		+ ' FROM soberFood.Users AS theUser'
		+ ' Order By Score DESC LIMIT 10'
	, null, {raw: true})

	this.jsonResp(200, results)
}