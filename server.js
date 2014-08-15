var express = require('express');
var exphbs  = require('express3-handlebars');
var app = express();
var helpers = require('./lib/helpers');

app.rest = require('restler');

app.headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Encoding": "gzip,deflate,sdch",
    "Accept-Language": "en-US,en;q=0.8:",
    "X-Api-Key": 65032887
};

var port = 3000;

app.engine('handlebars', exphbs(
    {
        defaultLayout: 'main',
        helpers: helpers
    }
));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

//Routes
require('./router')(app);

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});