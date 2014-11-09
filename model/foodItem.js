var database = require('./../lib/database');
var sequelize = require('sequelize');
var si = database.getSequelizeInstance();

var STATUS = {
	ON_LIST: "ON_LIST",
	DELETED: "DELETED",
	EATEN: "EATEN",
	EXPIRED: "PENDING_APPROVAL"
}

var FoodItem = si.define('FoodItem', 
	{
	  actualShelfLife: sequelize.INTEGER,
	  timePurchased: sequelize.DATE,
	  timeConsumed: sequelize.DATE,
	  status: [STATUS.ON_LIST ,STATUS.DELETED ,STATUS.EATEN ,STATUS.EXPIRED]
	}, {
		classMethods: {

		},
		instanceMethods: {

		}
	}
)

module.exports = FoodItem;