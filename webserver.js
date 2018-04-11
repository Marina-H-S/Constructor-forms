// A very basic web server in node.js
// Stolen from: Node.js for Front-End Developers by Garann Means (p. 9-10)

var port = 4000;
var serverUrl = "localhost";

var http = require("http");
var path = require("path");
var fs = require("fs");
var checkMimeType = true;
var DB = require("./server/db").DB;

console.log("Starting web server at " + serverUrl + ":" + port);

const server = http.createServer(function (req, res) {
	handleRequest(req, res);
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
	//TODO REST for quizes
	if (request.method === 'POST' && request.url === '/quiz') {
		response.statusCode = 201;
		let requestBody = '';
		request.setEncoding('utf8');
		request.on('data', function (chunk) {
			requestBody += chunk;
		});
		request.on('end', function () {
			let data = JSON.parse(requestBody);
			data.id = GenerateId();
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
	else if (request.method === 'DELETE' && request.url.indexOf('/quiz')!==-1) {
		const id = request.url.split('/quiz/')[1];
		console.log('deleted id: '+id);
		DB = DB.filter(item => item.id !== +id);
		console.log(DB);
		response.statusCode = 200;
		response.end();
	}
	else {
		serveFile(request,response);
	}
	return;
}

function serveFile(req,res){
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
		".woff2": "application/font-woff2",
		".ico": "image/x-icon"
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
}

