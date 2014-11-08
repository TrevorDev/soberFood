var database = require('./../lib/database');
var sequelize = require('sequelize');
var si = database.getSequelizeInstance();

var FoodItem = si.define('FoodItem', 
	{
	  actualShelfLife: sequelize.INTEGER,
	  timePurchased: sequelize.DATE,
	  timeConsumed: sequelize.DATE
	}, {
		classMethods: {

		},
		instanceMethods: {

		}
	}
)

module.exports = FoodItem;