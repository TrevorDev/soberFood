var config = require('./lib/config')
var database = require('./lib/database')
var logger = require('koa-logger')
var router = require('koa-router')
var serve = require('koa-static')
//var session = require('koa-session')
var views = require('co-views')
var jsonResp = require('koa-json-response')
var koa = require('koa')
var swig = require('swig')
var https = require('https')
var http = require('http')
var request = require('request');
var fs = require('fs')
var app = koa()
var auth = require('./lib/auth.js');
var bodyParser = require('koa-bodyparser')
var session = require('koa-generic-session')
var parse = require('co-body');

var co = require('co')
//Add database

var User = require("./model/user");
co(function*(){
    
    si = database.getSequelizeInstance()
    //yield si.sync({ force: true })
    // var User = require("./model/user");
    // var College = require("./model/college");
    // var FoodInfo = require("./model/foodInfo");
    // FoodInfo.create({name: "Orange", shelfLifeDays: "3"});
    // User.create({name: "tesvo", password: "blah"})
    // College.create({name: "Software Engineering"})
    // College.create({name: "Computer Science"})
    // College.create({name: "Food Science"})
    // College.create({name: "Biology"})
    // console.log("hit")

})()


//var userCtrl = require('./controller/user')

//REMOVE IN PRODUCTION??
swig.setDefaults(config.templateOptions)
app.keys = ['your-session-secret']
app.use(session())
app.use(bodyParser())
app.use(jsonResp())
app.use(router(app))

//ROUTES --------------------------------------------------------------------------------------------------------------------

//AUTH

//DEFAULTS
app.get('/', defaultPageLoad('index'))
app.get('/shoppingList', defaultPageLoad('shoppingList'))
app.get(/\/public\/*/, serve('.'))

app.post('/api/login', function*(){
    var name = this.request.body.name;
    var password = this.request.body.password;
    var userId = yield User.authenticate(name, password);
    if(userId){
        this.session.userId = userId;
        this.jsonResp(200)
    }else{
        this.jsonResp(401)
    }
});
app.get('/api/logout', function * () {
    this.session = null
    this.redirect('/')
})
app.post('/api/createAccount', function * () {
    var user = yield User.createEncrypted(this.request.body);
    this.session.userId = user.id;
    this.jsonResp(200)
})


//API ROUTES
//app.get('/testUser', userCtrl.getUsers)

//PAGE HANDLERS ---------------------------------------------------------------------------------------------------------------------
function defaultPageLoad(pageName, requiresLogin) {
    return function * () {
        /*if(requiresLogin===true && !sessionHelper.isLoggedIn(this.session)){
			this.redirect('/login')
			return
		}*/
        var temp = {};
        this.body = yield render(pageName, temp)
    }
}

function render(page, template) {
    return views(__dirname + '/view', config.templateOptions)(page, template)
}

var server = http.createServer(app.callback())




//SOCKETIO ---------------------------------------------------------------------------------------------------------------------
var io = require('socket.io').listen(server);
io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

server.listen(config.appPort);
console.log('Started ----------------------------------------------' + config.appPort)
