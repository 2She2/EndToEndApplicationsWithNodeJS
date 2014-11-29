var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
var uuid = require('node-uuid');
var querystring = require('querystring');
var port = 1234;
var dataDir = '\\UploadedData\\';

http.createServer(function(req, res) {
	if (req.url === '/') {
		res.writeHead(200, {
			'content-type': 'text/html'
		});

		fs.readFile('index.html', 'utf8', function(err, data) {
			res.write(data);
			res.end();
		});
	} else if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
		// parse a file upload
		var form = new formidable.IncomingForm();
		var currentFileName = uuid.v4();

		form.uploadDir = __dirname + '/UploadedData/';
		form.keepExtensions = false;
		form.multiple = false;

		form
			.on('file', function(name, file) {
				fs.rename(file.path, form.uploadDir + currentFileName);
			})
			.on('end', function() {
				res.writeHead(200, {
					'content-type': 'text/plain'
				});
				res.write("Your file id is: " + currentFileName);
				res.end();
			});

		form.parse(req);
	} else if(req.url === '/download' && req.method.toLowerCase() === 'post') {
        var chunk = '';
        req.on('data', function (data) {
            chunk += data;
        });

        req.on('end', function () {
            var filePath = __dirname + dataDir + querystring.parse(chunk).fileName;

            var stream = fs.createReadStream(filePath, { bufferSize: 64 * 1024 });
            // Download file
            stream.pipe(res);
        });
	} else {
        res.write("Invalid URL");
        res.end();
    }
}).listen(port);

console.log('Server running on port: ' + port);