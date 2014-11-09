var database = require('./../lib/database');
var sequelize = require('sequelize');
var si = database.getSequelizeInstance();

var STATUS = {
	ACTIVE: "ACTIVE",
	DELETED: "DELETED"
}

var Post = si.define('Post', 
	{
	  name: sequelize.STRING,
	  text: sequelize.STRING(4096),
	  status: {
			type: sequelize.ENUM,
			values: [STATUS.ACTIVE ,STATUS.DELETED],
			defaultValue: STATUS.ACTIVE
		}
	}, {
		classMethods: {

		},
		instanceMethods: {

		}
	}
)
Post.STATUS = STATUS;
module.exports = Post;