var database = require('./../lib/database');
var sequelize = require('sequelize');
var si = database.getSequelizeInstance();

var FoodInfo = si.define('FoodInfo', 
	{
	  name: {
	  	type:sequelize.STRING,
	  	unique: true
	  },
	  shelfLifeDays: sequelize.INTEGER,
	  calories: sequelize.INTEGER
	}, {
		classMethods: {

		},
		instanceMethods: {

		}
	}
)
module.exports = FoodInfo;