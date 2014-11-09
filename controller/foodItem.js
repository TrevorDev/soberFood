var FoodItem = require('./../model/foodItem');
var User = require('./../model/user');
var FoodInfo = require('./../model/foodInfo');
var parse = require('co-body');

exports.add = function *() {
	var foodItem = yield FoodItem.create({name: this.request.body.name, shelfLifeDays: this.request.body.shelfLifeDays, amount: this.request.body.amount})
	var curUser = yield User.find(this.session.userId)
	var foodInfo = yield FoodInfo.find(this.request.body.foodInfoId)
	yield curUser.addFoodItem(foodItem)
	yield foodInfo.addFoodItem(foodItem)
	foodItem = yield FoodItem.find(foodItem.id)
	this.jsonResp(200,{item: foodItem});
}

exports.delete = function *() {

	var foodItem = yield FoodItem.find(this.params.id)
	foodItem.status = FoodItem.STATUS.DELETED;
	yield foodItem.save();
	this.jsonResp(200);
}

exports.eat = function *() {
	var foodItem = yield FoodItem.find(this.params.id)
	foodItem.status = FoodItem.STATUS.EATEN;
	var x = new Date()
	x.setMilliseconds(0)
	x.setSeconds(0)
	x.setMinutes(0)
	x.setHours(0)
	foodItem.timeConsumed = x
	yield foodItem.save();
	this.jsonResp(200);
}

exports.waste = function *() {
	var foodItem = yield FoodItem.find(this.params.id)
	foodItem.status = FoodItem.STATUS.EXPIRED;
	var x = new Date()
	x.setMilliseconds(0)
	x.setSeconds(0)
	x.setMinutes(0)
	x.setHours(0)
	foodItem.timeConsumed = x
	yield foodItem.save();
	this.jsonResp(200);
}