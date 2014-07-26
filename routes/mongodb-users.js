 


var MongoUser = require('../models/mongodb-user');


exports.list = function (req, res, next) {
    MongoUser.getAll(function (err, users) {
        if (err) return next(err);
        console.log("list users: ", JSON.stringify(users));
        res.render('mongo-users', {
            users: users
        });
    });
};

exports.create = function (req, res, next) {
    MongoUser.create({
        name: req.body['name']
    }, function (err, user) {
        if (err) return next(err);
        console.log("user: " + JSON.stringify(user));
        res.redirect('/mongo-users/' + user.id);
    });
};

exports.show = function (req, res, next) {
    MongoUser.get(req.params.id, function (err, user) {
        if (err) return next(err);
        // TODO also fetch and show followers? (not just follow*ing*)
        //user.getFollowingAndOthers(function (err, following, others) {
            if (err) return next(err);
            res.render('mongo-user', {
                user: user
//                user: user,
//                following: following,
//                others: others
         //   });
        });
    });
};

/*
exports.edit = function (req, res, next) {
    MongoUser.get(req.params.id, function (err, user) {
        if (err) return next(err);
        user.name = req.body['name'];
        user.save(function (err) {
            if (err) return next(err);
            res.redirect('/users/' + user.id);
        });
    });
};

exports.del = function (req, res, next) {
    MongoUser.get(req.params.id, function (err, user) {
        if (err) return next(err);
        user.del(function (err) {
            if (err) return next(err);
            res.redirect('/users');
        });
    });
};

exports.follow = function (req, res, next) {
    MongoUser.get(req.params.id, function (err, user) {
        if (err) return next(err);
        MongoUser.get(req.body.user.id, function (err, other) {
            if (err) return next(err);
            user.follow(other, function (err) {
                if (err) return next(err);
                res.redirect('/users/' + user.id);
            });
        });
    });
};

exports.unfollow = function (req, res, next) {
    MongoUser.get(req.params.id, function (err, user) {
        if (err) return next(err);
        MongoUser.get(req.body.user.id, function (err, other) {
            if (err) return next(err);
            user.unfollow(other, function (err) {
                if (err) return next(err);
                res.redirect('/users/' + user.id);
            });
        });
    });
};

*/
