var sequelize = require("sequelize");
var config  = require('./config');

var si = new sequelize(config.database.database, config.database.user, config.database.password, {
	//logging: false,
	host: config.database.host
})

exports.getSequelizeInstance = function(){
	return si;
}

function heartBeat() {
	si.query('SELECT 1')
	setTimeout(heartBeat, 300000) //5 min
}

heartBeat()

var User = require("../model/user");
var Colledge = require("../model/colledge");
var FoodInfo = require("../model/foodInfo");
var FoodItem = require("../model/foodItem");

User.belongsTo(Colledge)
Colledge.hasMany(User)

FoodItem.belongsTo(FoodInfo)
FoodInfo.hasMany(FoodItem)

FoodItem.belongsTo(User)
User.hasMany(FoodItem)