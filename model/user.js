var database = require('./../lib/database');
var sequelize = require('sequelize');
var crypto = require('./../lib/crypto');
var si = database.getSequelizeInstance();

var User = si.define('User', 
	{
	  name: {
	  	type:sequelize.STRING,
	  	unique: true
	  },
	  password: sequelize.STRING
	}, {
		classMethods: {
	    	createEncrypted: function*(attributes){ 
	    		return yield User.create({
									  name: attributes.name,
									  password: yield crypto.crypt(attributes.password)
									})
			},
			authenticate: function*(name, password){
				var user = yield User.find({where: {name: name}});
				var matched = false;
				if(user){
					matched = yield crypto.compareStringHash(password, user.password)
				}

				if(matched){
					return user.id;
				}else{
					return 0;
				}
			}
		},
		instanceMethods: {

		}
	}
)


module.exports = User;

