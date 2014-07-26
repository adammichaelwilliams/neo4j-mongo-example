/*
var mongo = require("mongodb").MongoClient;

function getConnection(cb) {
    mongo.connect("mongodb://localhost:27017/testDB", function(err, db) {
        if(err) return cb(err);
        console.log("we are connected");
        var users = db.collection("users");
        users.ensureIndex({name: true}, function(err) {
            if (err) return cb(err);
            cb(null, users);
        });
    });
}

var MongoUser = module.exports = function MongoUser(_node) {
    this._node = _node;
}

*/

var MongoUser = module.exports = function MongoUser(_data) {
    this._data = _data;
}

Object.defineProperty(MongoUser.prototype, 'id', {
    get: function () { return this._data._id; }
});

Object.defineProperty(MongoUser.prototype, 'name', {
    get: function () {
        return this._data['name'];
    },
    set: function (name) {
        this._data['name'] = name;
    }
});




var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('userdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'userdb' database");
        db.collection('users', {strict:true}, function(err, collection) {
            if (err) {
//                console.log("The 'users' collection doesn't exist. Creating it with sample data...");
//                populateDB();
            }
        });
    }
});

//MongoUser.findById = function(id, callback) {
MongoUser.get = function(id, callback) {
    console.log('Retrieving user: ' + id);
    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            if(err) return callback(err);
            callback(null, new MongoUser(item)); 
        });
    });
};

//MongoUser.findAll = function(callback) {
MongoUser.getAll = function(callback) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            if(err) return callback(err);
            var users = items.map(function (item) {
                //return new MongoUser(item); 
                //xxx this is totally wrong, but let's see what it prints first
                console.log("getAll list: " + item);
                console.log("getAll list: " + JSON.stringify(item));
                return new MongoUser(item);
            });
            callback(null, users);
        });
    });
};


//MongoUser.addUser = function(data, callback) {
MongoUser.create = function(data, callback) {

    //var node = db.createNode(data);
    //data of form {"name":"New Wine","year":"2009"}
    //var user = MongoUser(data);
    var user = data;

    console.log('Adding data: ' + data);
    console.dir(data);
    console.log('Adding user: ' + JSON.stringify(user));

    db.collection('users', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if (err) return callback(err);
            console.log('Success: ' + JSON.stringify(result[0]));
            //data of form  { name: 'New Wine', year: '2009', _id: 53d310f2c188f80294f3056e }
            var user = new MongoUser(result[0]);
            callback(null, user);
        });
    });
}

/*
MongoUser.updateUser = function(req, res) {
    var id = req.params.id;
    var user = req.body;
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    db.collection('users', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating user: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(user);
            }
        });
    });
}
*/

//MongoUser.deleteUser = function(id, callback) {
MongoUser.prototype.del = function(callback) {
    console.log('Deleting user: ' + id);
    db.collection('users', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            callback(err);
            /*
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
            */
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
/*
var populateDB = function() {

    var users = [
    {
        name: "CHATEAU DE SAINT COSME",
        year: "2009",
        grapes: "Grenache / Syrah",
        country: "France",
        region: "Southern Rhone",
        description: "The aromas of fruit and spice...",
        picture: "saint_cosme.jpg"
    },
    {
        name: "LAN RIOJA CRIANZA",
        year: "2006",
        grapes: "Tempranillo",
        country: "Spain",
        region: "Rioja",
        description: "A resurgence of interest in boutique vineyards...",
        picture: "lan_rioja.jpg"
    }];

    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });

};
*/


