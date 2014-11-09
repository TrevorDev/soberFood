var User = require('./../model/user');
var FoodItem = require('./../model/foodItem');

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
	console.log("hit")
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
	this.jsonResp(200, list);
}