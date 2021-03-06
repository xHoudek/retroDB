module.exports = (function() {
	const express = require('express');
	const adminRouter = express.Router();
	const mysql = require('../dbcon.js');
	const bodyParser = require('body-parser');

	function getAllGames(req, res, mysql, context, complete) {
		const sqlQuery =
			'SELECT g.gameID, g.gameName, g.gameReleaseYear, c.consoleName, p.publisherName ' +
			'FROM Games g ' +
			'INNER JOIN Consoles c ON g.consoleID = c.consoleID ' +
			'INNER JOIN Publishers p ON g.publisherID = p.publisherID ' +
			'ORDER BY g.gameID';
		mysql.pool.query(sqlQuery, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Games:', error);
				res.end();
			}

			context.games = results;
			complete();
		});
	}

	function getAllConsoles(req, res, mysql, context, complete) {
		const sqlQuery = 'SELECT * FROM Consoles ORDER BY consoleID';
		mysql.pool.query(sqlQuery, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Consoles:', error);
				res.end();
			}

			context.consoles = results;
			complete();
		});
	}

	function getAllPublishers(req, res, mysql, context, complete) {
		const sqlQuery = 'SELECT * FROM Publishers ORDER BY publisherID';
		mysql.pool.query(sqlQuery, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Publishers:', error);
				res.end();
			}

			context.publishers = results;
			complete();
		});
	}

	function getAllUsers(req, res, mysql, context, complete) {
		const sqlQuery = 'SELECT * FROM Users ORDER BY userID';
		mysql.pool.query(sqlQuery, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Users:', error);
				res.end();
			}

			context.users = results;
			complete();
		});
	}

	function getGameByID(req, res, mysql, context, complete) {
		const sqlQuery = 'SELECT * FROM Games WHERE gameID = ?';
		mysql.pool.query(sqlQuery, req.params.id, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Game:', error);
				res.end();
			}
			context.gameID = req.params.id;
			context.gameName = results[0].gameName;
			context.gameReleaseYear = results[0].gameReleaseYear;
			context.consoleID = results[0].consoleID;
			context.publisherID = results[0].publisherID;
			complete();
		});
	}

	function getConsoleByID(req, res, mysql, context, complete) {
		const sqlQuery = 'SELECT * FROM Consoles WHERE consoleID = ?';
		mysql.pool.query(sqlQuery, req.params.id, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Console:', error);
				res.end();
			}
			context.consoleID = req.params.id;
			context.consoleName = results[0].consoleName;
			context.consoleDeveloper = results[0].consoleDeveloper;
			context.consoleReleaseYear = results[0].consoleReleaseYear;

			// Check the proper console type
			if (results[0].consoleType == 'Home Console') {
				context.homeChecked = 'checked';
			} else if (results[0].consoleType == 'Handheld') {
				context.handheldChecked = 'checked';
			} else if (results[0].consoleType == 'Hybrid') {
				context.hybridChecked = 'checked';
			}
			complete();
		});
	}

	function getPublisherByID(req, res, mysql, context, complete) {
		const sqlQuery = 'SELECT * FROM Publishers WHERE publisherID = ?';
		mysql.pool.query(sqlQuery, req.params.id, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch Publisher:', error);
				res.end();
			}
			context.publisherID = req.params.id;
			context.publisherName = results[0].publisherName;
			context.yearFounded = results[0].yearFounded;
			context.hqCountry = results[0].hqCountry;
			context.ceo = results[0].ceo;

			complete();
		});
	}

	function getUserByID(req, res, mysql, context, complete) {
		const sqlQuery = 'SELECT * FROM Users WHERE userID = ?';
		mysql.pool.query(sqlQuery, req.params.id, function(error, results, fields) {
			if (error) {
				console.log('Failed to fetch User:', error);
				res.end();
			}
			context.userID = req.params.id;
			context.username = results[0].username;
			context.firstName = results[0].firstName;
			context.lastName = results[0].lastName;
			context.email = results[0].email;

			complete();
		});
	}

	function selectConsoleFromConsoleID(context) {
		for (var i = 0; i < context.consoles.length; i++) {
			if (context.consoles[i].consoleID == context.consoleID) {
				context.consoles[i].selected = 'selected';
			}
		}
	}

	function selectPublisherFromPublisherID(context) {
		for (var i = 0; i < context.publishers.length; i++) {
			if (context.publishers[i].publisherID == context.publisherID) {
				context.publishers[i].selected = 'selected';
			}
		}
	}

	adminRouter.get('/', function(req, res) {
		var context = {
			admin: true,
			message: true
		};
		res.render('admin', context);
	});

	// displays all games
	adminRouter.get('/games', function(req, res) {
		var callbackCount = 0;
		var context = {
			admin: true,
			gamesActive: 'active'
		};
		getAllGames(req, res, mysql, context, complete);
		getAllConsoles(req, res, mysql, context, complete);
		getAllPublishers(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 3) {
				res.render('admin', context);
			}
		}
	});

	// displays all consoles
	adminRouter.get('/consoles', function(req, res) {
		var callbackCount = 0;
		var context = {
			admin: true,
			consolesActive: 'active'
		};
		getAllConsoles(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 1) {
				res.render('admin', context);
			}
		}
	});

	// displays all publishers
	adminRouter.get('/publishers', function(req, res) {
		var callbackCount = 0;
		var context = {
			admin: true,
			publishersActive: 'active'
		};
		getAllPublishers(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 1) {
				res.render('admin', context);
			}
		}
	});

	// displays all users
	adminRouter.get('/users', function(req, res) {
		var callbackCount = 0;
		var context = {
			admin: true,
			usersActive: 'active'
		};
		getAllUsers(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 1) {
				res.render('admin', context);
			}
		}
	});

	// displays page for updating information
	adminRouter.get('/update/game/:id', function(req, res) {
		var context = { admin: true };
		context.gameActive = 'active';
		var callbackCount = 0;

		getAllConsoles(req, res, mysql, context, complete);
		getAllPublishers(req, res, mysql, context, complete);
		getGameByID(req, res, mysql, context, complete);

		function complete() {
			callbackCount++;
			if (callbackCount >= 3) {
				selectConsoleFromConsoleID(context);
				selectPublisherFromPublisherID(context);
				res.render('update', context);
			}
		}
	});

	adminRouter.get('/update/console/:id', function(req, res) {
		var context = { admin: true };
		context.consoleActive = 'active';
		var callbackCount = 0;

		getConsoleByID(req, res, mysql, context, complete);

		function complete() {
			callbackCount++;
			if (callbackCount >= 1) {
				res.render('update', context);
			}
		}
	});

	adminRouter.get('/update/publisher/:id', function(req, res) {
		var context = { admin: true };
		context.publisherActive = 'active';
		var callbackCount = 0;

		getPublisherByID(req, res, mysql, context, complete);

		function complete() {
			callbackCount++;
			if (callbackCount >= 1) {
				res.render('update', context);
			}
		}
	});

	adminRouter.get('/update/user/:id', function(req, res) {
		var context = { admin: true };
		context.userActive = 'active';
		var callbackCount = 0;

		getUserByID(req, res, mysql, context, complete);

		function complete() {
			callbackCount++;
			if (callbackCount >= 1) {
				res.render('update', context);
			}
		}
	});

	// adds a game, redirects to the games page after adding
	adminRouter.post('/games', function(req, res) {
		const sqlQuery = 'INSERT INTO Games (gameName, gameReleaseYear, consoleID, publisherID) VALUES (?, ?, ?, ?)';
		const inserts = [ req.body.gameName, req.body.gameReleaseYear, req.body.consoleID, req.body.publisherID ];
		for (var i=0; i<inserts.length; i++) {
			if (inserts[i] == '') {
				inserts[i] = null
			}
		}

		mysql.pool.query(sqlQuery, inserts, function(error, results, fields) {
			if (error) {
				console.log(error);
				res.end();
			}
			res.redirect('/admin/games');
		});
	});

	// adds a console, redirects to the consoles page after adding
	adminRouter.post('/consoles', function(req, res) {
		const sqlQuery =
			'INSERT INTO Consoles (consoleName, consoleReleaseYear, consoleDeveloper, consoleType) VALUES (?, ?, ?, ?)';
		const inserts = [
			req.body.consoleName,
			req.body.consoleReleaseYear,
			req.body.consoleDeveloper,
			req.body.consoleType
		];
		for (var i=0; i<inserts.length; i++) {
			if (inserts[i] == '') {
				inserts[i] = null
			}
		}

		mysql.pool.query(sqlQuery, inserts, function(error, results, fields) {
			if (error) {
				console.log(error);
				res.end();
			}
			res.redirect('/admin/consoles');
		});
	});

	// adds a publisher, redirects to the publishers page after adding
	adminRouter.post('/publishers', function(req, res) {
		const sqlQuery = 'INSERT INTO Publishers (publisherName, yearFounded, hqCountry, ceo) VALUES (?, ?, ?, ?)';
		const inserts = [ req.body.publisherName, req.body.yearFounded, req.body.hqCountry, req.body.ceo ];
		for (var i=0; i<inserts.length; i++) {
			if (inserts[i] == '') {
				inserts[i] = null
			}
		}

		mysql.pool.query(sqlQuery, inserts, function(error, results, fields) {
			if (error) {
				console.log(error);
				res.end();
			}
			res.redirect('/admin/publishers');
		});
	});

	// updates a game, reirects to the games page after updating
	adminRouter.post('/update/game/:id', function(req, res) {
		const sqlQuery = 'UPDATE Games SET gameName = ?, gameReleaseYear = ?, consoleID = ?, publisherID = ? WHERE gameID = ?';
		const inserts = [req.body.gameName, req.body.gameReleaseYear, req.body.consoleID, req.body.publisherID, req.params.id];
		for (var i=0; i<inserts.length; i++) {
			if (inserts[i] == '') {
				inserts[i] = null
			}
		}

		mysql.pool.query(sqlQuery, inserts, function(error, results, fields) {
			if (error) {
				console.log(error);
				res.end();
			}
			res.redirect('/admin/games')
		})
	});

	// updates a console, reirects to the consoles page after updating
	adminRouter.post('/update/console/:id', function(req, res) {
		const sqlQuery = 'UPDATE Consoles SET consoleName = ?, consoleReleaseYear = ?, consoleDeveloper = ?, consoleType = ? WHERE consoleID = ?';
		const inserts = [req.body.consoleName, req.body.consoleReleaseYear, req.body.consoleDeveloper, req.body.consoleType, req.params.id];
		for (var i=0; i<inserts.length; i++) {
			if (inserts[i] == '') {
				inserts[i] = null
			}
		}

		mysql.pool.query(sqlQuery, inserts, function(error, results, fields) {
			if (error) {
				console.log(error);
				res.end();
			}
			res.redirect('/admin/consoles')
		})
	});

	// updates a publisher, reirects to the publishers page after updating
	adminRouter.post('/update/publisher/:id', function(req, res) {
		const sqlQuery = 'UPDATE Publishers SET publisherName = ?, yearFounded = ?, hqCountry = ?, ceo = ? WHERE publisherID = ?';
		const inserts = [req.body.publisherName, req.body.yearFounded, req.body.hqCountry, req.body.ceo, req.params.id];
		for (var i=0; i<inserts.length; i++) {
			if (inserts[i] == '') {
				inserts[i] = null
			}
		}

		mysql.pool.query(sqlQuery, inserts, function(error, results, fields) {
			if (error) {
				console.log(error);
				res.end();
			}
			res.redirect('/admin/publishers')
		})
	});

	// updates a user, reirects to the users page after updating
	adminRouter.post('/update/user/:id', function(req, res) {
		const sqlQuery = 'UPDATE Users SET username = ?, firstName = ?, lastName = ?, email = ? WHERE userID = ?';
		const inserts = [req.body.username, req.body.firstName, req.body.lastName, req.body.email, req.params.id];
		for (var i=0; i<inserts.length; i++) {
			if (inserts[i] == '') {
				inserts[i] = null
			}
		}

		mysql.pool.query(sqlQuery, inserts, function(error, results, fields) {
			if (error) {
				console.log(error);
				res.end();
			}
			res.redirect('/admin/users')
		})
	});

	// deletes a game, redirects to the games page after updating
	adminRouter.post('/delete/game/:id', function(req, res) {
		const sqlQuery = 'DELETE FROM Games WHERE gameID = ?';

		mysql.pool.query(sqlQuery, req.params.id, function(error, results, fields) {
			if (error) {
				console.log(error);
				res.end();
			}
			res.redirect('/admin/games')
		})
	});

	// deletes a console, redirects to the consoles page after updating
	adminRouter.post('/delete/console/:id', function(req, res) {
		const sqlQuery = 'DELETE FROM Consoles WHERE consoleID = ?';

		mysql.pool.query(sqlQuery, req.params.id, function(error, results, fields) {
			if (error) {
				console.log(error);
				res.end();
			}
			res.redirect('/admin/consoles')
		})
	});

	// deletes a publisher, redirects to the publishers page after updating
	adminRouter.post('/delete/publisher/:id', function(req, res) {
		const sqlQuery = 'DELETE FROM Publishers WHERE publisherID = ?';

		mysql.pool.query(sqlQuery, req.params.id, function(error, results, fields) {
			if (error) {
				console.log(error);
				res.end();
			}
			res.redirect('/admin/publishers')
		})
	});

	// deletes a user, redirects to the users page after updating
	adminRouter.post('/delete/user/:id', function(req, res) {
		const sqlQuery = 'DELETE FROM Users WHERE userID = ?';

		mysql.pool.query(sqlQuery, req.params.id, function(error, results, fields) {
			if (error) {
				console.log(error);
				res.end();
			}
			res.redirect('/admin/users')
		})
	});

	return adminRouter;
})();
