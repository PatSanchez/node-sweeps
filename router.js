module.exports = function(app){
    require('./routes/index')(app);
    require('./routes/organization')(app);
    require('./routes/sweeps')(app);
    require('./routes/sweeps/enter')(app);
    require('./routes/sweeps/thanks')(app);
};