var cluster = require('cluster');
var WORKERS = process.env.WEB_CONCURRENCY || 1;

// Code to run if we're in the master process
if (cluster.isMaster) {

  // Create a worker for each WORKERS
  for (var i = 0; i < WORKERS; i += 1) {
      cluster.fork();
  }

// Code to run if we're in a worker process
} else {

    // Include Express
    var express = require('express');

    // Create a new Express application
    var app = express();

    // Add a basic route – index page
    app.get('/', function (req, res) {
        res.send('Hello World!');
    });

    // Bind to a port
    app.listen(8080);
    console.log('Application running!');

}
