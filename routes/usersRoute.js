var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const nodemailer = require("nodemailer");
const fs = require('fs');
var User = require('../models/user');
var userId;

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

// Register User
router.post('/register', function (req, res) {

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	} else {
		User.findOne({ username: req.body.username }).exec().then((foundUser) => {
			var username = req.body.username;

			if (foundUser) {
				if (username === foundUser.username) {
					console.log('Username ' + username + ' already exists.');
					req.flash('error_msg', 'Username ' + username + ' already exists.');
					res.redirect('/users/login');
				} else {
					req.flash('error_msg', 'An error occured.');
					res.redirect('/users/login');
				}
			} else if (username) {
				User.findOne({ email: req.body.email }).exec().then((foundEmail) => {
					var email = req.body.email;

					if (foundEmail) {
						if (email === foundEmail.email) {
							console.log('Email ' + email + ' already exists.');
							req.flash('error_msg', 'Email ' + email + ' already exists.');
							res.redirect('/users/register');
						} else {
							req.flash('error_msg', 'An error occured.');
							res.redirect('/users/register');
						}
					} else {
						var newUser = new User({
							name: req.body.name,
							email: req.body.email,
							username: req.body.username,
							password: req.body.password
						});
						User.createUser(newUser, function (err, user) {
							console.log("New User: " + user);
							if (err) {
								req.flash('error_msg', 'An error occured.');
								res.redirect('/users/register');
							}
						});

						req.flash('success_msg', 'You are registered and can now login.');
						res.redirect('/users/login');
					}
				});
			} else {
				req.flash('error_msg', 'An error occured.');
				res.redirect('/users/register');
			}
		}).catch((err) => {
			console.log('An error occured: ' + err);
			req.flash('error_msg', 'An error occured.');
			res.redirect('/users/register');
		});
	}
});

// Recover user password
router.post('/recover-password', function (req, res) {

	// Validation
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();

	var errors = req.validationErrors();

	if (errors) {
		res.render('login', {
			errors: errors
		});
	} else {
		User.findOne({ email: req.body.email }).exec().then((foundUser) => {
			var email = req.body.email;

			console.log("foundUser: ", foundUser);

			if (foundUser) {
				sendEmail().then(response => {
					console.log("SMTP response:");
					console.log(response);
				}, error => {
					console.log("SMTP error:");
					console.log(error);
				}).catch(console.error);

				var msg = 'We sent you an email to ' + email + ' in order to recover your password.';
				req.flash('success_msg', msg);
				res.redirect('/users/login');
			} else {
				req.flash('error_msg', 'Email was not found in our database.');
				res.redirect('/users/login');
			}
		});
	}
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}
			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					userId = user._id;
					module.exports.userId = userId;
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function (req, res) {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail() {
	const smtpConfig = {
		host: 'smtp.gmail.com',
		port: 465,
		secure: true, // use SSL
		auth: {
			user: 'my.web.dev.user@gmail.com',
			pass: 'S4f3_p4ssw0rD'
		},
		tls: {
			rejectUnauthorized: false
		},
		disableFileAccess: true,
		// path: '/path',
		// method: 'GET',
		key: fs.readFileSync('./certificate/key.key'),
		cert: fs.readFileSync('./certificate/certificate.crt'),
		ca: await fs.promises.readFile("./certificate/ca-cert.pem")
	};

	// Turn on: https://myaccount.google.com/lessecureapps

	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport(smtpConfig);

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"Fleet Management 🚗" <andrexpert94@gmail.com>', // sender address
		to: "andrei.ulinici1@gmail.com", // list of receivers
		subject: "Hello ✔", // Subject line
		text: "Hello world?", // plain text body
		html: "<b>Hello world?</b>" // html body
	}, function (error, response) {
		if (error) {
			console.log("Error in SMTP:")
			console.log(error);
		} else {
			console.log("Message sent.");
		}
	});

	return "Ok";
}

module.exports = router;