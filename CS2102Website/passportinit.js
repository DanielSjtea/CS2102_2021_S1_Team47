const passport = require('passport');
const bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
var database = require("./data/index");
var sql = require("./data/queries");

module.exports = function() {
    passport.use('local', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'username',
        passwordField: 'password'
    }, 
    function (req, username, password, done) {
        database.query(sql.signIn, [username], (err, data) => {
            if (err) {
                console.log("SQL error: " + err);
                done(err);
            } else {
                if (data.rowCount == 1) {
                    password_hash = data.rows[0].password;
                    bcrypt.compare(password, password_hash, (err, res) => {
                        if (res) {
                            user = {username: data.rows[0].username, name: data.rows[0].name, email: data.rows[0].email};
                            done(null, user); // supply Passport with the authenticated user
                        } else {
                            done(null, false, req.flash("message", "Incorrect password!"));
                        }
                    })          
                } else {
                    done(null, false, req.flash("message", "Incorrect username or password!"));
                }
            }
        })
    }));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
};



