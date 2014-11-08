var database = require('./../lib/database');
var sequelize = require('sequelize');
var si = database.getSequelizeInstance();

var Colledge = si.define('Colledge', 
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

module.exports = Colledge;