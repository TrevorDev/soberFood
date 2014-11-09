var FoodItem = require('./../model/foodItem');
var User = require('./../model/user');
var FoodInfo = require('./../model/foodInfo');
var parse = require('co-body');

exports.add = function *() {
	
	console.log(this.request.body)
	var foodItem = yield FoodItem.create({shelfLifeDays: this.request.body.shelfLifeDays})
	var curUser = yield User.find(this.session.userId)
	var foodInfo = yield FoodInfo.find(this.request.body.foodInfoId)
	yield curUser.addFoodItem(foodItem)
	yield foodInfo.addFoodItem(foodItem)
	foodItem = yield FoodItem.find(foodItem.id)
	this.jsonResp(200,{item: foodItem});
}