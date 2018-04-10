// A very basic web server in node.js
// Stolen from: Node.js for Front-End Developers by Garann Means (p. 9-10)

var port = 4000;
var serverUrl = "localhost";

var http = require("http");
var path = require("path");
var fs = require("fs");
var checkMimeType = true;
var DB = initData();

console.log("Starting web server at " + serverUrl + ":" + port);

const server = http.createServer(function (req, res) {
	var now = new Date();

	handleRequest(req, res);
	var filename = (req.url == '/' ? '/index.html' : req.url) || "index.html";
	var ext = path.extname(filename);
	var localPath = __dirname;
	var validExtensions = {
		".html": "text/html",
		".js": "application/javascript",
		".css": "text/css",
		".txt": "text/plain",
		".jpg": "image/jpeg",
		".gif": "image/gif",
		".png": "image/png",
		".woff": "application/font-woff",
		".woff2": "application/font-woff2"
	};

	var validMimeType = true;
	var mimeType = validExtensions[ext];
	if (checkMimeType) {
		validMimeType = validExtensions[ext] != undefined;
	}

	if (validMimeType) {
		localPath += filename;
		fs.exists(localPath, function (exists) {
			if (exists) {
				console.log("Serving file: " + localPath);
				getFile(localPath, res, mimeType);
			} else {
				console.log("File not found: " + localPath);
				res.writeHead(404);
				res.end();
			}
		});

	} else {
		console.log("Invalid file extension detected: " + ext + " (" + filename + ")")
	}

});

server.listen(port, serverUrl);

//helpers
function getFile(localPath, res, mimeType) {
	fs.readFile(localPath, function (err, contents) {
		if (!err) {
			res.setHeader("Content-Length", contents.length);
			if (mimeType != undefined) {
				res.setHeader("Content-Type", mimeType);
			}
			res.statusCode = 200;
			res.end(contents);
		} else {
			res.writeHead(500);
			res.end();
		}
	});
}

function handleRequest(request, response) {
	request.on('error', (err) => {
		console.error(err);
		response.statusCode = 400;
		response.end();
	});
	response.on('error', (err) => {
		console.error(err);
	});
	//TODO REST for quizes
	if (request.method === 'POST' && request.url === '/quiz') {
		response.statusCode = 201;
		let requestBody = '';
		request.setEncoding('utf8');
		request.on('data', function (chunk) {
			requestBody += chunk;
		});
		request.on('end', function () {
			const data = JSON.parse(requestBody);
			DB.push(data);
			response.write(JSON.stringify(DB));
			response.end();
		})
	}
	else if (request.method === 'GET' && request.url === '/quiz') {
		response.statusCode = 200;
		response.write(JSON.stringify(DB));
		response.end();
	}
	else if (request.method === 'DELETE' && request.url === '/quiz') {
		//TODO need id to delete on rest protocol
	}
	return;
}

function initData() {
	var first = {
		name: "first test",
		createdDate: Date.now(),
		id: Math.round(Math.random() * 10),
		auther: "Admin",
		completeTestCounter: Math.round(Math.random() * 100)
	};
	var second = {
		name: "second test",
		createdDate: Date.now(),
		id: Math.round(Math.random() * 10),
		auther: "Admin",
		completeTestCounter: Math.round(Math.random() * 100)
	};
	var third = {
		name: "third test",
		createdDate: Date.now(),
		id: Math.round(Math.random() * 10),
		auther: "Admin",
		completeTestCounter: Math.round(Math.random() * 100)
	};
	var tests = [];
	tests.push(first);
	tests.push(second);
	tests.push(third);

	return tests;
}