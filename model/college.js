var database = require('./../lib/database');
var sequelize = require('sequelize');
var si = database.getSequelizeInstance();

var College = si.define('College', 
	{
	  name: {
	  	type:sequelize.STRING,
	  	unique: true
	  }
	}, {
		classMethods: {

		},
		instanceMethods: {

		}
	}
)

module.exports = College;