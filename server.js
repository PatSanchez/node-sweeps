var express = require('express');
var exphbs  = require('express3-handlebars');
var app = express();
app.rest = require('restler');

app.headers = {
    "Accept-Language": "en-US,en;q=0.8:",
    "X-Api-Key": 65032887
};

var port = 3000;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

//Routes
require('./router')(app);

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});