const express = require('express');
const mysql = require('mysql2/promise');

const router = express.Router();

// create the connection
var connection;

async function init() {
	connection = await mysql.createConnection({ host: '35.234.136.67', user: 'root', password: 'c417d53%!', database: 'wunder' });
}

init();

router.get('/featured', async function (req, res) {
	try {
		var [rows, fields] = await connection.query("select p.title, p.alias, p.logoUrl, c.alias as category from product as p left join category as c on p.categoryId=c.id where p.featured=true order by title desc", []);
		return res.status(200).json(rows);
	} catch (e) {
		return res.status(400).json({ "error": e });
	}
});

router.get('/category', async function (req, res) {
	try {
		var [rows, fields] = await connection.query("select title, alias from category order by queue", []);
		return res.status(200).json(rows);
	} catch (e) {
		return res.status(400).json({ "error": e });
	}
});

router.get('/category/:alias', async function (req, res) {
	try {
		var [rows, fields] = await connection.query("select p.title, p.logoUrl, p.alias, c.alias as category from product as p left join category as c on p.categoryId=c.id where c.alias=? order by p.queue", [req.params.alias]);
		return res.status(200).json(rows);
	} catch (e) {
		return res.status(400).json({ "error": e });
	}
});

router.get('/:category/:alias', async function (req, res) {
	try {
		var [rows, fields] = await connection.query("select p.title, p.representation, p.description, p.logoUrl, p.posterUrl, p.webUrl, c.alias as category from product as p left join category as c on p.categoryId=c.id where c.alias=? and p.alias=?", [req.params.category, req.params.alias]);
		return res.status(200).json(rows[0]);
	} catch (e) {
		return res.status(400).json({ "error": e });
	}
});



module.exports = router;