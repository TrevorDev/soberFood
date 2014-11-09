var database = require('./../lib/database');
var sequelize = require('sequelize');
var si = database.getSequelizeInstance();

var STATUS = {
	ON_LIST: "ON_LIST",
	DELETED: "DELETED",
	EATEN: "EATEN",
	EXPIRED: "EXPIRED"
}

var FoodItem = si.define('FoodItem', 
	{
	  actualShelfLife: sequelize.INTEGER,
	  timePurchased: sequelize.DATE,
	  timeConsumed: sequelize.DATE,
	  status: {
			type: sequelize.ENUM,
			values: [STATUS.ON_LIST ,STATUS.DELETED ,STATUS.EATEN ,STATUS.EXPIRED],
			defaultValue: STATUS.ON_LIST
		}
	}, {
		classMethods: {

		},
		instanceMethods: {

		}
	}
)
FoodItem.STATUS = STATUS;
module.exports = FoodItem;