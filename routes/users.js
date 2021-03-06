module.exports = (function() {
	const express = require('express');
	const userRouter = express.Router();
	const mysql = require('../dbcon.js');
	const bcrypt = require('bcrypt-nodejs');
	const session = require('express-session');

	function getUserByUsername(req, res, mysql, context, complete) {
		const username = req.params.username;
		const sqlQuery = 'SELECT username, firstName, lastName FROM Users WHERE username = ?';
		mysql.pool.query(sqlQuery, username, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch User:', error);
				res.end();
			}
			// check if username exists
			if (!results[0]) {
				context.failed = true;
			} else {
				context.username = results[0].username;
				context.firstName = results[0].firstName;
				context.lastName = results[0].lastName;
			}
			complete();
		});
	}

	function getPasswordFromUsername(req, res, mysql, context, complete) {
		const sqlQuery = 'SELECT password FROM Users WHERE username = ?';
		mysql.pool.query(sqlQuery, req.body.username, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch User:', error);
				res.end();
			}

			if (!results[0]) {
				context.failed = true;
			} else {
				context.password = results[0].password;
			}
			complete();
		});
	}

	function getListsByUsername(req, res, mysql, context, complete) {
		const username = req.params.username;
		const sqlQuery =
			'SELECT l.listID, l.listName ' +
			'FROM Lists l ' +
			'INNER JOIN Users u ON l.createdBy = u.userID AND u.userID = ' +
			'(SELECT userID FROM Users WHERE username = ?)';
		mysql.pool.query(sqlQuery, username, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Lists:', error);
				res.end();
			}

			context.lists = results;
			complete();
		});
	}

	function checkPassword(password, confirmPassword) {
		if (8 <= password.length && password.length <= 20 && password == confirmPassword) {
			return true;
		}
		return false;
	}

	userRouter.get('/', function(req, res) {
		if (req.session.username) {
			res.redirect('/user/' + req.session.username);
		} else {
			res.redirect('/user/login');
		}
	});

	userRouter.get('/login', function(req, res) {
		res.render('login', { login: true, style: 'login.css' });
	});

	userRouter.get('/register', function(req, res) {
		res.render('register', { register: true, style: 'login.css' });
	});

	userRouter.get('/logout', function(req, res) {
		if (req.session.username) {
			req.session.destroy();
			req.session = null;
			res.redirect('/');
		}
	});

	userRouter.get('/:username', function(req, res) {
		var callbackCount = 0;
		var context = {};
		getUserByUsername(req, res, mysql, context, complete);
		getListsByUsername(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 2) {
				if (context.failed) {
					console.log('Username not found:', req.params.username);
					res.redirect('/');
				} else {
					if (req.params.username == req.session.username) {
						context.myPage = true;
						context.user = req.params.username;
					}
					res.render('user', context);
				}
			}
		}
	});

	// creates a new user and redirects to user page
	userRouter.post('/register', async function(req, res) {
		if (checkPassword(req.body.password, req.body.confirmPassword)) {
			// create hash

			bcrypt.genSalt(12, function(error, salt) {
				bcrypt.hash(req.body.password, salt, null, function(error, hash) {
					if (error) {
						console.log('Error:', error);
					}
					// create user
					const sqlQuery =
						'INSERT INTO Users (username, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)';
					const inserts = [ req.body.username, req.body.firstName, req.body.lastName, req.body.email, hash ];
					for (var i=0; i<inserts.length; i++) {
						if (inserts[i] == '') {
							inserts[i] = null
						}
					}
	
					mysql.pool.query(sqlQuery, inserts, function(error, results, fields) {
						if (error) {
							console.log(error);
							context = { register: true, error: true };
							res.render('register', context);
						} else {
							req.session.username = req.body.username;
							res.redirect('/user/' + req.body.username);
						}
					});
				});
			})

			
		} else {
			console.log('Bad password');
			context = { register: true, error: true };
			res.render('register', context);
		}
	});

	userRouter.post('/login', function(req, res) {
		var callbackCount = 0;
		var context = {};
		getPasswordFromUsername(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 1) {
				if (context.failed == true) {
					res.render('login', { login: true, error: true });
				} else {
					bcrypt.compare(req.body.password, context.password, function(error, same) {
						if (error) {
							console.log(error);
							res.end();
						}
						if (same) {
							req.session.username = req.body.username;
							res.redirect('/user/' + req.body.username);
						} else {
							res.render('login', { login: true, error: true });
						}
					});
				}
			}
		}
	});

	userRouter.post('/delete', function(req, res) {
		const sqlQuery = 'DELETE FROM Lists WHERE listID = ?';
		mysql.pool.query(sqlQuery, req.body.listID, function(error, results, fields) {
			if (error) {
				console.log('Failed to delete from Lists:', error);
				res.end();
			}
			res.redirect('/user/' + req.session.username)
		})
	});

	return userRouter;
})();
