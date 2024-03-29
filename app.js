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
var FoodInfo = require("./model/foodInfo");
var College = require("./model/college");
var Post = require("./model/post");

var foodItemCtrl = require("./controller/foodItem");
var userCtrl = require("./controller/user");
var collegeCtrl = require("./controller/college");
var postCtrl = require("./controller/post");
co(function*(){
    
    si = database.getSequelizeInstance()
//yield si.sync()
// var FoodInfo = require("./model/foodInfo");
// FoodInfo.create({name: "Bananas", shelfLifeDays: 10})
// FoodInfo.create({name: "Tomatoes", shelfLifeDays: 10})
// FoodInfo.create({name: "Milk", shelfLifeDays: 14})
// FoodInfo.create({name: "White Bread", shelfLifeDays: 21})
// FoodInfo.create({name: "Apples", shelfLifeDays: 30})
// FoodInfo.create({name: "Breakfast Cereal", shelfLifeDays: 300})
// FoodInfo.create({name: "Potatoes", shelfLifeDays: 90})
// FoodInfo.create({name: "Eggs", shelfLifeDays: 28})
// FoodInfo.create({name: "Orange Juice", shelfLifeDays: 21})
// FoodInfo.create({name: "Chicken breast", shelfLifeDays: 2})
// FoodInfo.create({name: "Turkey - From Deli Counter", shelfLifeDays: 3})
    
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
app.get('/shoppingList', defaultPageLoad('shoppingList', true))
app.get('/foodToEat', defaultPageLoad('foodToEat', true))
app.get('/statistics', defaultPageLoad('results', true))
app.get('/standings', defaultPageLoad('standings', true))
app.get('/postItBoard', defaultPageLoad('postItBoard', true))
app.get('/leaderboard', defaultPageLoad('leaderboard', true))
app.get('/about', defaultPageLoad('about'))
app.get(/\/public\/*/, serve('.'))

app.post('/api/foodItem', foodItemCtrl.add)
app.delete('/api/foodItem/:id', foodItemCtrl.delete)
app.put('/api/foodItem/eat/:id', foodItemCtrl.eat)
app.put('/api/foodItem/waste/:id', foodItemCtrl.waste)
app.get('/api/user/list', userCtrl.getList)
app.get('/api/user/pantry', userCtrl.getPantry)
app.get('/api/user/statistics', userCtrl.getStatistics)
app.get('/api/user/leaderboard', userCtrl.getLeaderboard)
app.get('/api/college/statistics', collegeCtrl.getStatistics)
app.post('/api/post', postCtrl.add)
app.get('/api/post', postCtrl.get)


app.get('/api/foodInfo', function*(){
    var ret = yield FoodInfo.findAll();
    this.jsonResp(200, ret)
})

app.put('/api/user/addToFoodToEat', userCtrl.addToFoodToEat);

app.post('/api/login', function*(){
    var name = this.request.body.name;
    var password = this.request.body.password;
    var userId = yield User.authenticate(name, password);
    if(userId){
        this.session.userId = userId;
        this.jsonResp(200)
    }else{
        this.session = null;
        this.jsonResp(401)
    }
});
app.get('/api/logout', function * () {
    this.session = null
    this.redirect('/')
})
app.post('/api/createAccount', function * () {
    console.log(this.request.body)
    var college = yield College.findOne({where: {name: this.request.body.college}})
    var errCause=college.blah;
    var user = yield User.createEncrypted(this.request.body);
    yield college.addUser(user)
    this.session.userId = user.id;
    this.jsonResp(200)
})


//API ROUTES
//app.get('/testUser', userCtrl.getUsers)

//PAGE HANDLERS ---------------------------------------------------------------------------------------------------------------------
function defaultPageLoad(pageName, requiresLogin) {
    return function * () {
        if(requiresLogin===true && !this.session.userId){
			this.redirect('/')
			return
		}
        var temp = {userId: this.session.userId};
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
