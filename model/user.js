var database = require('./../lib/database');
var sequelize = require('sequelize');
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
									  email: attributes.email,
									  password: yield crypto.crypt(attributes.password)
									})
			},
			authenticate: function*(email, password){
				var user = yield User.find({where: {name: email}});
				// if(yield crypto.compareStringHash(password, user.password)){
				// 	return user.id;
				// }else{
				// 	return 0;
				// }
				return 0;
			}
		},
		instanceMethods: {

		}
	}
)


module.exports = User;

