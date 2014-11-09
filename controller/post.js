var User = require('./../model/user');
var Post = require('./../model/post');
var parse = require('co-body');

exports.add = function *() {
	console.log(this.request.body)
	var post = yield Post.create({text: this.request.body.text})
	var user = yield User.find(this.session.userId)
	yield user.addPost(post);
	this.jsonResp(200);
}

exports.get = function *() {
	var posts = yield Post.findAll({order: "createdAt DESC"});
	this.jsonResp(200, posts);
}